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

            // Build NODE_PATH for monorepo deps resolution
            let node_modules_root = resource_path.join("node_modules_root");
            let node_modules_app = resource_path.join("node_modules");
            let node_path_env = format!(
                "{}:{}",
                node_modules_root.display(),
                node_modules_app.display()
            );

            let mut cmd = Command::new(&node_path);
            cmd.arg(&server_js)
                .env("PORT", PORT.to_string())
                .env("HOSTNAME", "127.0.0.1")
                .env("NODE_PATH", &node_path_env);

            // Pass through the user's PATH so node can find dependencies
            if let Some(shell_path) = resolve_shell_path() {
                cmd.env("PATH", shell_path);
            }

            // Pass .env vars that Next.js needs at runtime
            // NEXT_PUBLIC_* are baked at build time, but server-side env vars need passing
            for (key, value) in std::env::vars() {
                if key.starts_with("NEXT_PUBLIC_")
                    || key == "CONVEX_DEPLOY_KEY"
                    || key == "OPENAI_API_KEY"
                {
                    cmd.env(&key, &value);
                }
            }

            let child = cmd.spawn().expect("failed to start Node.js server");
            eprintln!("[tauri] Node.js server spawned (pid: {})", child.id());

            // Store the child process for cleanup
            let state = app.state::<NodeServer>();
            *state.0.lock().unwrap() = Some(child);

            // Wait for server to be ready
            eprintln!("[tauri] Waiting for server on port {}...", PORT);
            if wait_for_server(PORT, SERVER_TIMEOUT) {
                eprintln!("[tauri] Server ready!");
                // Navigate the main window to the server
                if let Some(window) = app.get_webview_window("main") {
                    let url = format!("http://localhost:{}", PORT);
                    let _ = window.navigate(url.parse().unwrap());
                }
            } else {
                eprintln!("[tauri] Server failed to start within {:?}", SERVER_TIMEOUT);
            }

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
