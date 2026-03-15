"use client"

import type { ComponentProps, ReactNode } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../../lib/with-pro-guard"
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@blazz/ui"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@blazz/ui"

export type ModelSelectorProps = ComponentProps<typeof Dialog>

const ModelSelectorBase = (props: ModelSelectorProps) => <Dialog {...props} />

export type ModelSelectorTriggerProps = ComponentProps<typeof DialogTrigger>

const ModelSelectorTriggerBase = (props: ModelSelectorTriggerProps) => <DialogTrigger {...props} />

export type ModelSelectorContentProps = ComponentProps<typeof DialogContent> & {
	title?: ReactNode
}

const ModelSelectorContentBase = ({
	className,
	children,
	title = "Model Selector",
	...props
}: ModelSelectorContentProps) => (
	<DialogContent
		aria-describedby={undefined}
		className={cn("outline! border-none! p-0 outline-border! outline-solid!", className)}
		{...props}
	>
		<DialogTitle className="sr-only">{title}</DialogTitle>
		<Command className="**:data-[slot=command-input-wrapper]:h-auto">{children}</Command>
	</DialogContent>
)

export type ModelSelectorDialogProps = ComponentProps<typeof CommandDialog>

const ModelSelectorDialogBase = (props: ModelSelectorDialogProps) => <CommandDialog {...props} />

export type ModelSelectorInputProps = ComponentProps<typeof CommandInput>

const ModelSelectorInputBase = ({ className, ...props }: ModelSelectorInputProps) => (
	<CommandInput className={cn("h-auto py-3.5", className)} {...props} />
)

export type ModelSelectorListProps = ComponentProps<typeof CommandList>

const ModelSelectorListBase = (props: ModelSelectorListProps) => <CommandList {...props} />

export type ModelSelectorEmptyProps = ComponentProps<typeof CommandEmpty>

const ModelSelectorEmptyBase = (props: ModelSelectorEmptyProps) => <CommandEmpty {...props} />

export type ModelSelectorGroupProps = ComponentProps<typeof CommandGroup>

const ModelSelectorGroupBase = (props: ModelSelectorGroupProps) => <CommandGroup {...props} />

export type ModelSelectorItemProps = ComponentProps<typeof CommandItem>

const ModelSelectorItemBase = (props: ModelSelectorItemProps) => <CommandItem {...props} />

export type ModelSelectorShortcutProps = ComponentProps<typeof CommandShortcut>

const ModelSelectorShortcutBase = (props: ModelSelectorShortcutProps) => (
	<CommandShortcut {...props} />
)

export type ModelSelectorSeparatorProps = ComponentProps<typeof CommandSeparator>

const ModelSelectorSeparatorBase = (props: ModelSelectorSeparatorProps) => (
	<CommandSeparator {...props} />
)

export type ModelSelectorLogoProps = Omit<ComponentProps<"img">, "src" | "alt"> & {
	provider:
		| "moonshotai-cn"
		| "lucidquery"
		| "moonshotai"
		| "zai-coding-plan"
		| "alibaba"
		| "xai"
		| "vultr"
		| "nvidia"
		| "upstage"
		| "groq"
		| "github-copilot"
		| "mistral"
		| "vercel"
		| "nebius"
		| "deepseek"
		| "alibaba-cn"
		| "google-vertex-anthropic"
		| "venice"
		| "chutes"
		| "cortecs"
		| "github-models"
		| "togetherai"
		| "azure"
		| "baseten"
		| "huggingface"
		| "opencode"
		| "fastrouter"
		| "google"
		| "google-vertex"
		| "cloudflare-workers-ai"
		| "inception"
		| "wandb"
		| "openai"
		| "zhipuai-coding-plan"
		| "perplexity"
		| "openrouter"
		| "zenmux"
		| "v0"
		| "iflowcn"
		| "synthetic"
		| "deepinfra"
		| "zhipuai"
		| "submodel"
		| "zai"
		| "inference"
		| "requesty"
		| "morph"
		| "lmstudio"
		| "anthropic"
		| "aihubmix"
		| "fireworks-ai"
		| "modelscope"
		| "llama"
		| "scaleway"
		| "amazon-bedrock"
		| "cerebras"
		// oxlint-disable-next-line typescript-eslint(ban-types) -- intentional pattern for autocomplete-friendly string union
		| (string & {})
}

const ModelSelectorLogoBase = ({ provider, className, ...props }: ModelSelectorLogoProps) => (
	<img
		{...props}
		alt={`${provider} logo`}
		className={cn("size-3 dark:invert", className)}
		height={12}
		src={`https://models.dev/logos/${provider}.svg`}
		width={12}
	/>
)

export type ModelSelectorLogoGroupProps = ComponentProps<"div">

const ModelSelectorLogoGroupBase = ({ className, ...props }: ModelSelectorLogoGroupProps) => (
	<div
		className={cn(
			"flex shrink-0 items-center -space-x-1 [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 dark:[&>img]:bg-foreground",
			className
		)}
		{...props}
	/>
)

export type ModelSelectorNameProps = ComponentProps<"span">

const ModelSelectorNameBase = ({ className, ...props }: ModelSelectorNameProps) => (
	<span className={cn("flex-1 truncate text-left", className)} {...props} />
)

export const ModelSelector = withProGuard(ModelSelectorBase, "ModelSelector")

export const ModelSelectorTrigger = withProGuard(ModelSelectorTriggerBase, "ModelSelectorTrigger")

export const ModelSelectorContent = withProGuard(ModelSelectorContentBase, "ModelSelectorContent")

export const ModelSelectorDialog = withProGuard(ModelSelectorDialogBase, "ModelSelectorDialog")

export const ModelSelectorInput = withProGuard(ModelSelectorInputBase, "ModelSelectorInput")

export const ModelSelectorList = withProGuard(ModelSelectorListBase, "ModelSelectorList")

export const ModelSelectorEmpty = withProGuard(ModelSelectorEmptyBase, "ModelSelectorEmpty")

export const ModelSelectorGroup = withProGuard(ModelSelectorGroupBase, "ModelSelectorGroup")

export const ModelSelectorItem = withProGuard(ModelSelectorItemBase, "ModelSelectorItem")

export const ModelSelectorShortcut = withProGuard(
	ModelSelectorShortcutBase,
	"ModelSelectorShortcut"
)

export const ModelSelectorSeparator = withProGuard(
	ModelSelectorSeparatorBase,
	"ModelSelectorSeparator"
)

export const ModelSelectorLogo = withProGuard(ModelSelectorLogoBase, "ModelSelectorLogo")

export const ModelSelectorLogoGroup = withProGuard(
	ModelSelectorLogoGroupBase,
	"ModelSelectorLogoGroup"
)

export const ModelSelectorName = withProGuard(ModelSelectorNameBase, "ModelSelectorName")
