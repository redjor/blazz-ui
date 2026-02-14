"use client";

import {
  DataTable,
  createProductsPreset,
} from "@/components/features/data-table";
import type { Product } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Page } from "@/components/ui/page";
import { useDataTableViews } from "@/hooks/use-data-table-views";
import Link from "next/link";
import { useMemo } from "react";

// Sample products data matching Product interface from sample-data
const products: Product[] = [
  {
    id: "1",
    name: "The Collection Snowboard: Liquid",
    description: "Premium liquid snowboard from the collection series",
    sku: "SB-LIQ-001",
    unitPrice: 749.99,
    currency: "EUR",
    category: "Licence",
    status: "active",
  },
  {
    id: "2",
    name: "The 3p Fulfilled Snowboard",
    description: "Third-party fulfilled snowboard model",
    sku: "SB-3PF-002",
    unitPrice: 649.99,
    currency: "EUR",
    category: "Licence",
    status: "active",
  },
  {
    id: "3",
    name: "The Multi-managed Snowboard",
    description: "Multi-managed inventory snowboard",
    sku: "SB-MM-003",
    unitPrice: 699.99,
    currency: "EUR",
    category: "Licence",
    status: "active",
  },
  {
    id: "4",
    name: "The Collection Snowboard: Oxygen",
    description: "Oxygen edition snowboard from the collection series",
    sku: "SB-OXY-004",
    unitPrice: 759.99,
    currency: "EUR",
    category: "Licence",
    status: "active",
  },
  {
    id: "5",
    name: "The Multi-location Snowboard",
    description: "Snowboard available at multiple locations",
    sku: "SB-ML-005",
    unitPrice: 629.99,
    currency: "EUR",
    category: "Licence",
    status: "active",
  },
  {
    id: "6",
    name: "Snowboard Boots - Premium",
    description: "Premium snowboard boots for professionals",
    sku: "BT-PRM-001",
    unitPrice: 299.99,
    currency: "EUR",
    category: "Support",
    status: "active",
  },
  {
    id: "7",
    name: "Ski Goggles - Pro Vision",
    description: "Professional vision ski goggles",
    sku: "GG-PRO-001",
    unitPrice: 179.99,
    currency: "EUR",
    category: "Support",
    status: "active",
  },
  {
    id: "8",
    name: "Winter Jacket - Insulated",
    description: "Fully insulated winter jacket",
    sku: "JK-INS-001",
    unitPrice: 449.99,
    currency: "EUR",
    category: "Consulting",
    status: "active",
  },
  {
    id: "9",
    name: "Thermal Base Layer Set",
    description: "Complete thermal base layer set",
    sku: "TH-BASE-001",
    unitPrice: 89.99,
    currency: "EUR",
    category: "Consulting",
    status: "active",
  },
  {
    id: "10",
    name: "Snowboard Bindings - Elite",
    description: "Elite-grade snowboard bindings",
    sku: "BD-ELI-001",
    unitPrice: 349.99,
    currency: "EUR",
    category: "Infrastructure",
    status: "active",
  },
  {
    id: "11",
    name: "Helmet - Safety First",
    description: "Safety-first certified helmet",
    sku: "HM-SAF-001",
    unitPrice: 129.99,
    currency: "EUR",
    category: "Infrastructure",
    status: "inactive",
  },
  {
    id: "12",
    name: "Gloves - Waterproof",
    description: "Waterproof winter gloves",
    sku: "GL-WP-001",
    unitPrice: 69.99,
    currency: "EUR",
    category: "Support",
    status: "active",
  },
  {
    id: "13",
    name: "Ski Poles - Carbon Fiber",
    description: "Lightweight carbon fiber ski poles",
    sku: "PL-CF-001",
    unitPrice: 199.99,
    currency: "EUR",
    category: "Infrastructure",
    status: "active",
  },
  {
    id: "14",
    name: "Backpack - Mountain Explorer",
    description: "Mountain explorer backpack with hydration system",
    sku: "BP-ME-001",
    unitPrice: 159.99,
    currency: "EUR",
    category: "Support",
    status: "active",
  },
  {
    id: "15",
    name: "Neck Warmer - Fleece",
    description: "Fleece neck warmer for cold weather",
    sku: "NW-FL-001",
    unitPrice: 29.99,
    currency: "EUR",
    category: "Support",
    status: "discontinued",
  },
];

export default function ProductsPage() {
  const preset = useMemo(
    () =>
      createProductsPreset({
        onEdit: (product) => {
          alert(`Editing product: ${product.name}`);
        },
        onDuplicate: async (product) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          alert(`Duplicated product: ${product.name}`);
        },
        onDeactivate: async (product) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          alert(`Deactivated product: ${product.name}`);
        },
      }),
    [],
  );

  const { views, activeView, setActiveView, addView, updateView, deleteView } =
    useDataTableViews({
      storageKey: "products-table",
      defaultViews: preset.views,
    });

  return (
    <Page
      title="Produits"
      fullWidth
      primaryAction={
        <Link href="/products/new" passHref>
          <Button>Ajouter un produit</Button>
        </Link>
      }
    >
      <Card>
        <DataTable
          data={products}
          columns={preset.columns}
          views={views}
          activeView={activeView}
          onViewChange={(view) => setActiveView(view.id)}
          onViewSave={addView}
          onViewUpdate={updateView}
          onViewDelete={deleteView}
          rowActions={preset.rowActions}
          enableSorting
          enablePagination
          enableRowSelection
          enableGlobalSearch
          enableAdvancedFilters
          enableCustomViews
          searchPlaceholder="Rechercher dans tous les produits..."
          pagination={{
            pageSize: 15,
            pageSizeOptions: [10, 15, 25, 50],
          }}
          variant="lined"
          density="default"
        />
      </Card>
    </Page>
  );
}
