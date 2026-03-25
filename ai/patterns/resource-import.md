# Pattern : Import de données

> Upload CSV/Excel, mapping des colonnes, validation, import en masse.
> Exemples : import de clients depuis un fichier, import de relevés, migration de données.

## Structure

```
Page
  top                          — Breadcrumb (Dashboard > Clients > Import)
  header                       — PageHeader ("Importer des clients")
  children
    └─ PageWrapper size="md"
         MultiStepForm
           └─ Step 1 "Upload"      — Drop zone fichier + preview premières lignes
           └─ Step 2 "Mapping"     — Associer colonnes du fichier → champs de la ressource
           └─ Step 3 "Validation"  — Afficher erreurs par ligne, permettre correction
           └─ Step 4 "Résultat"    — Résumé : X importés, Y ignorés, Z erreurs
```

## Code complet

### Page (`app/(dashboard)/clients/import/page.tsx`)

```tsx
import { Page, PageWrapper } from "@blazz/pro/components/blocks/page"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@blazz/ui/components/ui/breadcrumb"
import { ImportWizard } from "./_components/import-wizard"

export default function ImportClientsPage() {
  return (
    <Page
      top={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Import</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={<PageHeader title="Importer des clients" />}
    >
      <PageWrapper size="md">
        <ImportWizard
          resource="clients"
          targetFields={[
            { key: "lastName", label: "Nom", required: true },
            { key: "firstName", label: "Prénom", required: true },
            { key: "email", label: "Email", required: true },
            { key: "phone", label: "Téléphone" },
            { key: "company", label: "Entreprise" },
            { key: "address", label: "Adresse" },
            { key: "zipCode", label: "Code postal" },
            { key: "city", label: "Ville" },
          ]}
          validationSchema={clientMutationSchema}
          onImport={importClients}
          templateUrl="/templates/clients-import.csv"
        />
      </PageWrapper>
    </Page>
  )
}
```

### Import Wizard (`_components/import-wizard.tsx`)

```tsx
"use client"

import { useState } from "react"
import { MultiStepForm } from "@/components/blocks/multi-step-form"
import { UploadStep } from "./steps/upload-step"
import { MappingStep } from "./steps/mapping-step"
import { ValidationStep } from "./steps/validation-step"
import { ResultStep } from "./steps/result-step"

export function ImportWizard({ resource, targetFields, validationSchema, onImport, templateUrl }) {
  const [fileData, setFileData] = useState<{ headers: string[]; rows: Record<string, string>[] }>()
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [validationResult, setValidationResult] = useState<ValidationResult>()
  const [importResult, setImportResult] = useState<ImportResult>()

  return (
    <MultiStepForm
      steps={[
        {
          id: "upload",
          title: "Fichier",
          description: "Sélectionnez votre fichier CSV ou Excel",
          component: (
            <UploadStep
              onFileLoaded={setFileData}
              templateUrl={templateUrl}
            />
          ),
          canProceed: !!fileData,
        },
        {
          id: "mapping",
          title: "Mapping",
          description: "Associez les colonnes du fichier",
          component: fileData && (
            <MappingStep
              sourceHeaders={fileData.headers}
              targetFields={targetFields}
              mapping={mapping}
              onMappingChange={setMapping}
              previewRows={fileData.rows.slice(0, 3)}
            />
          ),
          canProceed: targetFields.filter(f => f.required).every(f => mapping[f.key]),
        },
        {
          id: "validation",
          title: "Validation",
          description: "Vérification des données",
          component: (
            <ValidationStep
              rows={fileData?.rows ?? []}
              mapping={mapping}
              schema={validationSchema}
              onValidated={setValidationResult}
            />
          ),
          canProceed: validationResult && validationResult.validRows > 0,
        },
        {
          id: "result",
          title: "Résultat",
          component: <ResultStep result={importResult} resource={resource} />,
        },
      ]}
      onComplete={async () => {
        const result = await onImport(fileData!.rows, mapping)
        setImportResult(result)
      }}
      submitLabel="Lancer l'import"
    />
  )
}
```

### Step Upload — points importants

```tsx
// La DropZone doit :
// - Accepter .csv, .xlsx, .xls
// - Afficher un preview des 5 premières lignes dans un mini-tableau
// - Lien "Télécharger le modèle" vers le template CSV
// - Afficher le nombre de lignes détectées
// - Gérer les erreurs de parsing (encoding, format)
```

### Step Mapping — points importants

```tsx
// Pour chaque champ cible, un Select avec les colonnes du fichier source
// Auto-mapping intelligent : si la colonne source s'appelle "Nom" ou "name",
// pré-sélectionner le champ "lastName"
// Preview en temps réel : montrer ce que les 3 premières lignes donnent
// avec le mapping actuel
// Indicateur visuel : ✓ mappé / ⚠ requis non mappé / — optionnel ignoré
```

### Step Validation — points importants

```tsx
// Valider CHAQUE ligne avec le schema zod
// Afficher un résumé : "142 valides, 8 erreurs, 3 doublons"
// Tableau des lignes en erreur avec :
//   - Numéro de ligne
//   - Champ en erreur (surligné rouge)
//   - Message d'erreur
//   - Possibilité de corriger inline
// Option "Ignorer les lignes en erreur et continuer"
```

### Step Résultat — points importants

```tsx
// Résumé final :
// - ✓ 142 clients importés avec succès
// - ⚠ 3 doublons ignorés
// - ✗ 5 lignes en erreur ignorées
// Boutons :
// - "Voir les clients importés" → lien vers /clients?imported=true
// - "Télécharger le rapport d'erreurs" → CSV des lignes échouées
// - "Nouvel import" → reset le wizard
```

## Checklist avant de livrer

- [ ] Support CSV et Excel ✓
- [ ] Template téléchargeable ✓
- [ ] Auto-mapping des colonnes ✓
- [ ] Preview des données à chaque étape ✓
- [ ] Validation zod ligne par ligne ✓
- [ ] Gestion des doublons ✓
- [ ] Correction inline des erreurs ✓
- [ ] Rapport d'erreurs exportable ✓
- [ ] Progress bar pendant l'import ✓
- [ ] Possibilité de revenir en arrière dans les étapes ✓
- [ ] Page.top avec Breadcrumb primitives ✓
- [ ] PageHeader titre simple ✓
- [ ] PageWrapper size="md" pour centrer le wizard ✓
