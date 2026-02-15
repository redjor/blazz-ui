"use client"

import { createContext, useContext, useState } from "react"
import * as BasePhoneInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronsUpDown, GlobeIcon } from "lucide-react"

type PhoneInputSize = "sm" | "default" | "lg"

const PhoneInputContext = createContext<{
	variant: PhoneInputSize
}>({
	variant: "default",
})

type PhoneInputProps = Omit<
	React.ComponentProps<"input">,
	"onChange" | "value" | "ref"
> &
	Omit<
		BasePhoneInput.Props<typeof BasePhoneInput.default>,
		"onChange" | "variant"
	> & {
		onChange?: (value: BasePhoneInput.Value) => void
		variant?: PhoneInputSize
	}

function PhoneInput({
	className,
	variant,
	onChange,
	value,
	...props
}: PhoneInputProps) {
	const phoneInputSize = variant || "default"
	return (
		<PhoneInputContext.Provider value={{ variant: phoneInputSize }}>
			<BasePhoneInput.default
				className={cn("flex", className)}
				flagComponent={FlagComponent}
				countrySelectComponent={CountrySelect}
				inputComponent={InputComponent}
				smartCaret={false}
				value={value || undefined}
				onChange={(value) => onChange?.(value || ("" as BasePhoneInput.Value))}
				{...props}
			/>
		</PhoneInputContext.Provider>
	)
}

function InputComponent({
	className,
	...props
}: React.ComponentProps<typeof Input>) {
	const { variant } = useContext(PhoneInputContext)

	return (
		<Input
			className={cn(
				"rounded-s-none focus:z-10",
				variant === "sm" && "h-7",
				variant === "lg" && "h-9",
				className
			)}
			{...props}
		/>
	)
}

type CountryEntry = { label: string; value: BasePhoneInput.Country | undefined }

type CountrySelectProps = {
	disabled?: boolean
	value: BasePhoneInput.Country
	options: CountryEntry[]
	onChange: (country: BasePhoneInput.Country) => void
}

function CountrySelect({
	disabled,
	value: selectedCountry,
	options: countryList,
	onChange,
}: CountrySelectProps) {
	const { variant } = useContext(PhoneInputContext)
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size={variant}
					role="combobox"
					aria-expanded={open}
					className={cn(
						"rounded-s-lg rounded-e-none flex gap-1 border-e-0 px-2.5 py-0 leading-none hover:bg-transparent focus:z-10",
						disabled && "opacity-50"
					)}
					disabled={disabled}
				>
					<FlagComponent
						country={selectedCountry}
						countryName={selectedCountry}
					/>
					<ChevronsUpDown className="size-3.5 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0" align="start">
				<Command>
					<CommandInput placeholder="Search country..." />
					<CommandList>
						<CommandEmpty>No country found.</CommandEmpty>
						<CommandGroup>
							<ScrollArea className="h-[300px]">
								{countryList.map((item: CountryEntry) =>
									item.value ? (
										<CommandItem
											key={item.value}
											value={item.label}
											onSelect={() => {
												onChange(item.value as BasePhoneInput.Country)
												setOpen(false)
											}}
											className="flex items-center gap-2"
										>
											<FlagComponent
												country={item.value}
												countryName={item.label}
											/>
											<span className="flex-1 text-sm">{item.label}</span>
											<span className="text-fg-muted text-xs font-mono">
												{`+${BasePhoneInput.getCountryCallingCode(item.value)}`}
											</span>
											<Check
												className={cn(
													"size-3.5",
													selectedCountry === item.value ? "opacity-100" : "opacity-0"
												)}
											/>
										</CommandItem>
									) : null
								)}
							</ScrollArea>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

function FlagComponent({ country, countryName }: BasePhoneInput.FlagProps) {
	const Flag = flags[country]

	return (
		<span className="flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-full! [&_svg:not([class*='size-'])]:rounded-[5px]">
			{Flag ? (
				<Flag title={countryName} />
			) : (
				<GlobeIcon className="size-4 opacity-60" />
			)}
		</span>
	)
}

export { PhoneInput }
