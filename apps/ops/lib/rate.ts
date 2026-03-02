/**
 * Calcule le taux horaire d'un projet à partir du TJM et des heures/jour.
 * Fallback sur 8h/j si hoursPerDay est 0 ou négatif.
 */
export function computeHourlyRate(tjm: number, hoursPerDay: number): number {
  return hoursPerDay > 0 ? tjm / hoursPerDay : tjm / 8
}
