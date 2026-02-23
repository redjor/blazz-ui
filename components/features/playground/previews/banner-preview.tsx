import { Banner } from "@/components/ui/banner"

export function BannerPreview() {
  return (
    <div className="space-y-2">
      <Banner tone="info">This is an informational banner.</Banner>
      <Banner tone="success">Operation completed successfully.</Banner>
      <Banner tone="warning">Please review before proceeding.</Banner>
      <Banner tone="critical">An error occurred during processing.</Banner>
    </div>
  )
}
