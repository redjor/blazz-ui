import { loadCompose } from "../loader.js"

export function compose(): void {
  process.stdout.write(loadCompose())
}
