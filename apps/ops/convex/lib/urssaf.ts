/**
 * URSSAF 2025 — Barème kilométrique voiture
 *
 * | CV | ≤5000 km          | 5001–20000 km        | >20000 km  |
 * |----|--------------------|----------------------|------------|
 * | 3  | d × 0.529          | (d × 0.316) + 1065   | d × 0.370  |
 * | 4  | d × 0.606          | (d × 0.340) + 1330   | d × 0.407  |
 * | 5  | d × 0.636          | (d × 0.357) + 1395   | d × 0.427  |
 * | 6  | d × 0.665          | (d × 0.374) + 1457   | d × 0.447  |
 * | 7+ | d × 0.697          | (d × 0.394) + 1515   | d × 0.470  |
 */

type ScaleRow = { low: number; mid: number; flat: number; high: number }

const SCALE: Record<number, ScaleRow> = {
	3: { low: 0.529, mid: 0.316, flat: 1065, high: 0.37 },
	4: { low: 0.606, mid: 0.34, flat: 1330, high: 0.407 },
	5: { low: 0.636, mid: 0.357, flat: 1395, high: 0.427 },
	6: { low: 0.665, mid: 0.374, flat: 1457, high: 0.447 },
	7: { low: 0.697, mid: 0.394, flat: 1515, high: 0.47 },
}

/**
 * Compute URSSAF mileage reimbursement for a single trip.
 *
 * The URSSAF formula applies to TOTAL annual distance, so we compute
 * the annual reimbursement before and after adding this trip, then diff.
 *
 * @param distanceKm      Distance of this trip in km
 * @param annualKmBefore  Total km already driven this year (before this trip)
 * @param fiscalPower     Fiscal horsepower (CV) — clamped to 3–7
 * @returns Reimbursement amount in CENTS (integer)
 */
export function computeMileageReimbursement(distanceKm: number, annualKmBefore: number, fiscalPower: number): number {
	const cv = Math.max(3, Math.min(7, Math.round(fiscalPower)))
	const row = SCALE[cv]

	function annualReimbursement(km: number): number {
		if (km <= 0) return 0
		if (km <= 5000) return km * row.low
		if (km <= 20000) return km * row.mid + row.flat
		return km * row.high
	}

	const reimbBefore = annualReimbursement(annualKmBefore)
	const reimbAfter = annualReimbursement(annualKmBefore + distanceKm)

	return Math.round((reimbAfter - reimbBefore) * 100) // euros → cents
}
