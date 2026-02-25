import { Progress, ProgressTrack, ProgressIndicator } from "@blazz/ui/components/ui/progress"

export function ProgressPreview() {
  return (
    <div className="space-y-3 max-w-sm">
      <Progress value={25} max={100}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Progress value={60} max={100}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Progress value={100} max={100}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  )
}
