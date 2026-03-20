import { loadDesignPrinciples } from "../loader.js"

export function design(): void {
  process.stdout.write(loadDesignPrinciples())
}
