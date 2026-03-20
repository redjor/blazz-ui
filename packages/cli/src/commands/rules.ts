import { loadRules } from "../loader.js"

export function rules(): void {
  process.stdout.write(loadRules())
}
