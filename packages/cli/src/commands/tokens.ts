import { loadTokens } from "../loader.js"

export function tokens(): void {
  process.stdout.write(loadTokens())
}
