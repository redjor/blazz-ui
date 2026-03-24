use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::process::{Child, Command};
use std::sync::Mutex;
use std::time::{Duration, Instant};
use tauri::Manager;

const PORT: u16 = 3120;
const SERVER_TIMEOUT: Duration = Duration::from_secs(15);

struct NodeServer(Mutex<Option<Child>>);

/// Resolve the full path to `node` by querying the user's login shell.
/// macOS GUI apps get a minimal PATH, so `node` (installed via fnm/nvm/brew)
/// won't be found without this.
fn resolve_node_path() -> String {
    if let Ok(output) = Command::new("/bin/zsh")
        .args(["-l", "-c", "which node"])
        .output()
    {
        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !path.is_empty() {
                return path;
            }
        }
    }
    "node".to_string()
}

/// Get the full PATH from the user's login shell
fn resolve_shell_path() -> Option<String> {
    if let Ok(output) = Command::new("/bin/zsh")
        .args(["-l", "-c", "echo $PATH"])
        .output()
    {
        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !path.is_empty() {
                return Some(path);
            }
        }
    }
    None
}

/// Load a .env file into a HashMap
fn load_env_file(path: &Path) -> HashMap<String, String> {
    let mut vars = HashMap::new();
    if let Ok(content) = fs::read_to_string(path) {
        for line in content.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            if let Some(pos) = line.find('=') {
                let key = line[..pos].to_string();
                let value = line[pos + 1..].to_string();
                vars.insert(key, value);
            }
        }
    }
    vars
}

fn wait_for_server(port: u16, timeout: Duration) -> bool {
    let start = Instant::now();
    while start.elapsed() < timeout {
        if std::net::TcpStream::connect(format!("127.0.0.1:{}", port)).is_ok() {
            return true;
        }
        std::thread::sleep(Duration::from_millis(200));
    }
    false
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(NodeServer(Mutex::new(None)))
        .setup(|app| {
            // Resolve server bundle path
            let resource_path = app
                .path()
                .resource_dir()
                .expect("failed to resolve resource dir")
                .join("server");

            let server_js = resource_path.join("server.js");
            if !server_js.exists() {
                // In dev mode, server bundle doesn't exist — devUrl handles it
                eprintln!("[tauri] No server bundle found, skipping server spawn (dev mode)");
                return Ok(());
            }

            let node_path = resolve_node_path();
            eprintln!("[tauri] Using node: {}", node_path);
            eprintln!("[tauri] Server path: {}", server_js.display());

            // Load .env.production from the bundled resources
            let env_file = resource_path.join(".env.production");
            let env_vars = load_env_file(&env_file);
            if !env_vars.is_empty() {
                eprintln!("[tauri] Loaded {} env vars from .env.production", env_vars.len());
            }

            // Kill any stale process on our port before starting
            if let Ok(output) = Command::new("lsof")
                .args(["-ti", &format!(":{}", PORT)])
                .output()
            {
                let pids = String::from_utf8_lossy(&output.stdout);
                for pid in pids.split_whitespace() {
                    eprintln!("[tauri] Killing stale process on port {} (pid: {})", PORT, pid);
                    let _ = Command::new("kill").args(["-9", pid]).output();
                }
                if !pids.trim().is_empty() {
                    std::thread::sleep(Duration::from_millis(500));
                }
            }

            let mut cmd = Command::new(&node_path);
            cmd.arg(&server_js)
                .env("PORT", PORT.to_string())
                .env("HOSTNAME", "127.0.0.1");

            // Pass through the user's PATH so node can find dependencies
            if let Some(shell_path) = resolve_shell_path() {
                cmd.env("PATH", shell_path);
            }

            // Pass all env vars from .env.production to the Node process
            for (key, value) in &env_vars {
                cmd.env(key, value);
            }

            let child = cmd.spawn().expect("failed to start Node.js server");
            eprintln!("[tauri] Node.js server spawned (pid: {})", child.id());

            // Store the child process for cleanup
            let state = app.state::<NodeServer>();
            *state.0.lock().unwrap() = Some(child);

            // The loading page (loading/index.html) polls localhost:3120
            // and redirects automatically when the server is ready.
            eprintln!("[tauri] Server spawned — loading page will redirect when ready");

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        if let tauri::RunEvent::Exit = event {
            // Kill the Node.js server on exit
            let state = app_handle.state::<NodeServer>();
            let mut guard = state.0.lock().unwrap();
            if let Some(ref mut child) = *guard {
                eprintln!("[tauri] Killing Node.js server (pid: {})", child.id());
                let _ = child.kill();
                let _ = child.wait();
            }
            *guard = None;
        }
    });
}
