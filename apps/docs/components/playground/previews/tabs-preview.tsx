import { Tabs, TabsList, TabsTrigger, TabsContent } from "@blazz/ui/components/ui/tabs"

export function TabsPreview() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Overview</TabsTrigger>
          <TabsTrigger value="tab2">Analytics</TabsTrigger>
          <TabsTrigger value="tab3">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="text-xs text-fg-muted pt-2">Overview content goes here.</TabsContent>
        <TabsContent value="tab2" className="text-xs text-fg-muted pt-2">Analytics content goes here.</TabsContent>
        <TabsContent value="tab3" className="text-xs text-fg-muted pt-2">Settings content goes here.</TabsContent>
      </Tabs>
      <Tabs defaultValue="t1">
        <TabsList variant="line">
          <TabsTrigger value="t1">Line Tab 1</TabsTrigger>
          <TabsTrigger value="t2">Line Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="t1" className="text-xs text-fg-muted pt-2">Line variant content.</TabsContent>
        <TabsContent value="t2" className="text-xs text-fg-muted pt-2">Second tab content.</TabsContent>
      </Tabs>
    </div>
  )
}
