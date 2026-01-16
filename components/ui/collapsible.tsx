'use client'

import * as React from 'react'
import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.Trigger

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Panel>
>((props, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    className="overflow-hidden data-[ending-style]:animate-collapsible-up data-[starting-style]:animate-collapsible-down"
    {...props}
  />
))
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
