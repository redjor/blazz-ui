# Guide des Composants - Blazz UI

Index complet de tous les composants UI disponibles dans Blazz UI App.

## Table des Matières

1. [Composants Formulaires](#composants-formulaires)
2. [Composants Conteneurs](#composants-conteneurs)
3. [Composants Dialog & Overlays](#composants-dialog--overlays)
4. [Composants Navigation](#composants-navigation)
5. [Composants Data Display](#composants-data-display)
6. [Composants Layout](#composants-layout)
7. [Composants Features](#composants-features)

---

## Composants Formulaires

### Button

Bouton interactif avec 6 variants et 8 sizes.

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Click me</Button>
```

**Documentation**: [BUTTON.README.md](../components/ui/BUTTON.README.md) ✅

**Variants**: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`

---

### Input

Champ de saisie texte pour tous types d'entrées.

```tsx
import { Input } from '@/components/ui/input'

<Input placeholder="Entrez votre texte..." />
```

**Documentation**: [INPUT.README.md](../components/ui/INPUT.README.md) ✅

**Types supportés**: text, email, password, number, tel, url, search, date, time, file

---

### Label

Label de formulaire accessible associé aux champs.

```tsx
import { Label } from '@/components/ui/label'

<Label htmlFor="name">Nom</Label>
<Input id="name" />
```

**Props principales**: `htmlFor` (string)

---

### Field

Wrapper pour intégration react-hook-form avec context.

```tsx
import { Field } from '@/components/ui/field'

<Field name="email">
  <Label>Email</Label>
  <Input />
  <FormMessage />
</Field>
```

**Usage**: Avec react-hook-form uniquement

---

### Form Components

Suite complète pour formulaires avec react-hook-form.

```tsx
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
```

**Pattern**:
```tsx
<FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### Textarea

Champ de saisie multi-ligne.

```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea placeholder="Votre message..." rows={4} />
```

**Props principales**: `rows` (number), `maxLength` (number)

---

### Checkbox

Case à cocher avec support indeterminate.

```tsx
import { Checkbox } from '@/components/ui/checkbox'

<Checkbox id="terms" />
<Label htmlFor="terms">Accepter les conditions</Label>
```

**États**: checked, unchecked, indeterminate

---

### Switch

Toggle switch on/off.

```tsx
import { Switch } from '@/components/ui/switch'

<Switch id="notifications" />
<Label htmlFor="notifications">Notifications</Label>
```

**Props principales**: `checked` (boolean), `onCheckedChange` (function)

---

### Select

Menu déroulant de sélection.

```tsx
import { Select } from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choisissez..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Composants**: Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel

---

### Combobox

Select avec recherche et autocomplétion.

```tsx
import { Combobox } from '@/components/ui/combobox'

<Combobox
  options={[
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
  ]}
  placeholder="Sélectionnez une langue"
/>
```

**Features**: Recherche, filtrage, keyboard navigation

---

### Tags-Input

Input multi-select avec tags.

```tsx
import { TagsInput } from '@/components/ui/tags-input'

<TagsInput
  value={tags}
  onChange={setTags}
  placeholder="Ajouter tags..."
/>
```

**Features**: Add, remove, keyboard navigation

---

## Composants Conteneurs

### Card

Conteneur avec header, content et footer.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Contenu</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Sizes**: `default`, `sm`

---

### Alert

Message d'alerte ou notification.

```tsx
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from '@/components/ui/alert'

<Alert variant="default">
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>Votre message ici</AlertDescription>
</Alert>
```

**Variants**: `default`, `destructive`

---

### Box

Conteneur polymorphique flexible.

```tsx
import { Box } from '@/components/ui/box'

<Box>div par défaut</Box>
<Box as="section">section</Box>
<Box as="article">article</Box>
```

**Props**: `as` (ElementType), `variant`, `size`

---

### Separator

Diviseur visuel horizontal ou vertical.

```tsx
import { Separator } from '@/components/ui/separator'

<Separator />
<Separator orientation="vertical" />
```

**Orientations**: `horizontal` (default), `vertical`

---

### Skeleton

Placeholder de chargement animé.

```tsx
import { Skeleton } from '@/components/ui/skeleton'

<Skeleton className="h-12 w-full" />
<Skeleton className="h-4 w-[250px]" />
```

**Usage**: Loading states, shimmer effect

---

## Composants Dialog & Overlays

### Dialog

Modal dialog accessible.

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre</DialogTitle>
    </DialogHeader>
    Content
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Features**: Trap focus, ESC to close, backdrop click

---

### Popover

Overlay flottant pour contenu contextuel.

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'

<Popover>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>Content here</PopoverContent>
</Popover>
```

**Positioning**: Auto-positioned

---

### Sheet

Panneau latéral coulissant.

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    Content
  </SheetContent>
</Sheet>
```

**Sides**: `left`, `right`, `top`, `bottom`

---

### Tooltip

Info-bulle au hover.

```tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Delay**: Configurable

---

### Tabs

Navigation par onglets.

```tsx
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

**Orientation**: `horizontal` (default), `vertical`

---

### Collapsible

Section pliable/dépliable.

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'

<Collapsible>
  <CollapsibleTrigger>Click to expand</CollapsibleTrigger>
  <CollapsibleContent>Hidden content</CollapsibleContent>
</Collapsible>
```

**Features**: Smooth animation

---

## Composants Navigation

### Dropdown Menu

Menu contextuel déroulant.

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Composants**: 10+ sous-composants (Item, CheckboxItem, RadioItem, etc.)

---

### Menu

Menu générique de base.

```tsx
import { Menu } from '@/components/ui/menu'

<Menu>
  <MenuItem>Item 1</MenuItem>
  <MenuItem>Item 2</MenuItem>
</Menu>
```

**Usage**: Base pour autres menus

---

### Command

Command palette (⌘K).

```tsx
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandGroup heading="Actions">
      <CommandItem>Action 1</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**Features**: Fuzzy search, keyboard navigation

---

### Breadcrumb

Fil d'Ariane de navigation.

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>Current</BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### Badge

Tag ou label de statut.

```tsx
import { Badge } from '@/components/ui/badge'

<Badge>New</Badge>
<Badge variant="secondary">Badge</Badge>
```

**Variants**: `default`, `secondary`, `destructive`, `outline`

---

### Avatar

Photo de profil utilisateur.

```tsx
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar'

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

**Features**: Fallback automatique, lazy loading

---

## Composants Data Display

### Table

Table HTML sémantique stylisée.

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Usage**: Tables simples. Pour tables avancées, voir DataTable

---

### DataTable (Feature)

Table enterprise avec sorting, filtering, pagination.

```tsx
import { DataTable } from '@/components/features/data-table'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<Data>[] = [
  { accessorKey: 'name', header: 'Name' },
]

<DataTable
  data={data}
  columns={columns}
  searchPlaceholder="Search..."
/>
```

**Documentation**: [DATA_TABLE_README.md](../components/features/data-table/DATA_TABLE_README.md) ✅

**Features**:
- Multi-column sorting
- Advanced filtering (AND/OR logic)
- Pagination
- Row selection & bulk actions
- Saved views (localStorage)
- 3 visual variants
- 3 density levels

---

### Scroll-Area

Zone scrollable avec scrollbar custom.

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'

<ScrollArea className="h-[200px]">
  Long content here...
</ScrollArea>
```

**Features**: Custom scrollbar, horizontal/vertical

---

## Composants Layout

### DashboardLayout

Layout principal application avec sidebar.

```tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout'

<DashboardLayout>
  <Page>Content</Page>
</DashboardLayout>
```

**Features**: Sidebar collapsible, topbar, responsive

---

### AppFrame

Container applicatif avec navigation.

```tsx
import { AppFrame } from '@/components/layout/app-frame'

<AppFrame>
  Content
</AppFrame>
```

---

### Frame

Frame de base simple.

```tsx
import { Frame } from '@/components/layout/frame'

<Frame>
  Content
</Frame>
```

---

### Navbar

Barre de navigation horizontale.

```tsx
import { Navbar } from '@/components/layout/navbar'

<Navbar>
  <NavbarLeft>Logo</NavbarLeft>
  <NavbarCenter>Menu</NavbarCenter>
  <NavbarRight>Actions</NavbarRight>
</Navbar>
```

**Sections**: Left, Center, Right

---

### AppTopBar

Top bar application avec actions.

```tsx
import { AppTopBar } from '@/components/layout/app-topbar'

<AppTopBar />
```

**Features**: Breadcrumb, command palette trigger, user menu

---

### AppSidebar

Sidebar application avec navigation.

```tsx
import { AppSidebar } from '@/components/layout/app-sidebar'

<AppSidebar config={sidebarConfig} />
```

**Features**: Collapsible, sections, icons, badges

---

### Page

Composant page Shopify-style.

```tsx
import { Page, PageHeader } from '@/components/layout/page'

<Page>
  <PageHeader
    title="Page Title"
    description="Description"
    actions={<Button>Action</Button>}
  />
  Content
</Page>
```

**Features**: Title, description, actions, breadcrumb

---

### PageHeader

En-tête de page standalone.

```tsx
import { PageHeader } from '@/components/layout/page-header'

<PageHeader
  title="Title"
  description="Description"
  actions={<Button>Action</Button>}
/>
```

---

### NavTabs

Navigation par tabs horizontale.

```tsx
import { NavTabs } from '@/components/layout/nav-tabs'

<NavTabs>
  <NavTab href="/tab1">Tab 1</NavTab>
  <NavTab href="/tab2">Tab 2</NavTab>
</NavTabs>
```

---

## Composants Features

### CommandPalette

Interface commande ⌘K globale.

```tsx
import { CommandPalette } from '@/components/features/command-palette'

<CommandPalette />
```

**Features**: Fuzzy search, actions, keyboard shortcuts

---

### ImageUpload

Upload d'images avec dropzone.

```tsx
import { ImageUpload } from '@/components/features/image-upload'

<ImageUpload
  onUpload={(file) => console.log(file)}
  maxSize={5 * 1024 * 1024} // 5MB
/>
```

**Features**: Drag & drop, preview, validation

---

## Utilisation avec l'Agent LLM

Pour générer la documentation d'un composant non documenté:

```bash
# Utiliser l'agent Blazz UI Assistant
"Lis le fichier components/ui/[component].tsx et génère
une documentation complète suivant le format de BUTTON.README.md
avec API reference, 5 exemples, accessibilité, et best practices"
```

L'agent suivra automatiquement les patterns établis pour créer une documentation cohérente.

---

## Status Documentation

| Composant | Documentation Complète | README |
|-----------|----------------------|---------|
| Button | ✅ | BUTTON.README.md |
| Input | ✅ | INPUT.README.md |
| DataTable | ✅ | DATA_TABLE_README.md |
| Sidebar | ✅ | SIDEBAR-V2-README.md |
| **Autres** | ⏳ À générer | - |

**Note**: Les documentations manquantes peuvent être générées rapidement avec l'agent Blazz UI Assistant qui comprend les patterns du projet.

---

## Ressources

- [Guide Architecture](ARCHITECTURE.md) - Structure et patterns
- [Guide LLM](LLM_GUIDE.md) - Utiliser avec Claude Code
- [Storybook](http://localhost:6006) - Voir tous les composants visuellement

---

**Dernière mise à jour**: 2026-01-19
