import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const rows = [
  { name: "Acme Corp", status: "Active", amount: "$12,500" },
  { name: "Globex Inc", status: "Pending", amount: "$8,200" },
  { name: "Wayne Ent.", status: "Active", amount: "$24,300" },
]

export function TablePreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-edge">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>
                <Badge variant={row.status === "Active" ? "success" : "warning"} size="xs">
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
