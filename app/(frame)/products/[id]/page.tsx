'use client'

import { use } from 'react'
import { Page, PageSection } from '@/components/ui/page'
import { Box } from '@/components/ui/box'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, BarChart3, Trash2, Save } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <Page
      title="Wireless Headphones"
      subtitle={`SKU: WH-${id}`}
      breadcrumbs={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Product #{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      primaryAction={
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      }
      secondaryActions={
        <Button variant="outline">Edit</Button>
      }
      additionalMetadata={
        <Badge>In Stock</Badge>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Product Details - 2/3 width */}
        <div className="md:col-span-2">
          <PageSection title="Product Details" description="Manage product information">
            <Box
              padding="6"
              background="white"
              borderRadius="lg"
              border="default"
            >
              <Tabs defaultValue="general">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4 pt-4">
                  <Box as="div" className="space-y-2">
                    <h3 className="font-medium">Product Name</h3>
                    <p className="text-sm text-muted-foreground">Wireless Headphones</p>
                  </Box>
                  <Box as="div" className="space-y-2">
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      Premium wireless headphones with noise cancellation and 30-hour battery life.
                    </p>
                  </Box>
                  <Box as="div" className="space-y-2">
                    <h3 className="font-medium">Price</h3>
                    <p className="text-sm text-muted-foreground">$99.99</p>
                  </Box>
                </TabsContent>
                <TabsContent value="inventory" className="space-y-4 pt-4">
                  <Box as="div" className="space-y-2">
                    <h3 className="font-medium">Stock Quantity</h3>
                    <p className="text-sm text-muted-foreground">45 units</p>
                  </Box>
                  <Box as="div" className="space-y-2">
                    <h3 className="font-medium">Status</h3>
                    <Badge>In Stock</Badge>
                  </Box>
                </TabsContent>
                <TabsContent value="shipping" className="space-y-4 pt-4">
                  <Box as="div" className="space-y-2">
                    <h3 className="font-medium">Weight</h3>
                    <p className="text-sm text-muted-foreground">0.5 kg</p>
                  </Box>
                  <Box as="div" className="space-y-2">
                    <h3 className="font-medium">Dimensions</h3>
                    <p className="text-sm text-muted-foreground">20 x 15 x 8 cm</p>
                  </Box>
                </TabsContent>
              </Tabs>
            </Box>
          </PageSection>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Stats Card */}
          <PageSection title="Stats">
            <Box
              padding="6"
              background="white"
              borderRadius="lg"
              border="default"
              className="space-y-3"
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Sales</span>
                <span className="font-medium">234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium">$23,397</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium">4.8/5.0</span>
              </div>
            </Box>
          </PageSection>

          {/* Actions Card */}
          <PageSection title="Actions">
            <Box
              padding="6"
              background="white"
              borderRadius="lg"
              border="default"
              className="space-y-2"
            >
              <Button variant="outline" className="w-full justify-start">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Product
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </Box>
          </PageSection>
        </div>
      </div>
    </Page>
  )
}
