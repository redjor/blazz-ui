export default async function PrintQuotePage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-xl font-bold">Devis N° DEV-{id}</h2>
				<p className="text-sm text-gray-500">Version imprimable</p>
			</div>

			<div className="grid grid-cols-2 gap-8">
				<div>
					<h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
						Émetteur
					</h3>
					<p className="font-medium">Forge CRM SAS</p>
					<p className="text-sm text-gray-600">
						12 rue de l'Innovation
						<br />
						75001 Paris, France
					</p>
				</div>
				<div>
					<h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
						Client
					</h3>
					<p className="font-medium">Entreprise cliente</p>
					<p className="text-sm text-gray-600">
						Adresse du client
						<br />
						Ville, France
					</p>
				</div>
			</div>

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b-2">
						<th className="py-2 text-left font-semibold">Désignation</th>
						<th className="py-2 text-right font-semibold">Qté</th>
						<th className="py-2 text-right font-semibold">P.U. HT</th>
						<th className="py-2 text-right font-semibold">Total HT</th>
					</tr>
				</thead>
				<tbody>
					<tr className="border-b">
						<td className="py-2">Produit exemple</td>
						<td className="py-2 text-right">1</td>
						<td className="py-2 text-right">500,00 €</td>
						<td className="py-2 text-right">500,00 €</td>
					</tr>
				</tbody>
				<tfoot>
					<tr className="border-t-2 font-semibold">
						<td colSpan={3} className="py-2 text-right">
							Total HT
						</td>
						<td className="py-2 text-right">500,00 €</td>
					</tr>
					<tr>
						<td colSpan={3} className="py-1 text-right text-gray-500">
							TVA (20%)
						</td>
						<td className="py-1 text-right text-gray-500">100,00 €</td>
					</tr>
					<tr className="text-lg font-bold">
						<td colSpan={3} className="py-2 text-right">
							Total TTC
						</td>
						<td className="py-2 text-right">600,00 €</td>
					</tr>
				</tfoot>
			</table>
		</div>
	)
}
