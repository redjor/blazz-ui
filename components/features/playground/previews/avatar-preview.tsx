import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"

export function AvatarPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
        <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
      </div>
      <AvatarGroup>
        <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
        <AvatarGroupCount count={5} />
      </AvatarGroup>
    </div>
  )
}
