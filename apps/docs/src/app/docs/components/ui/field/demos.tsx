"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Field, FieldContent, FieldControl, FieldDescription, FieldError, FieldLabel } from "@blazz/ui/components/ui/field"
import { Input } from "@blazz/ui/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import * as React from "react"

export function FieldHeroDemo() {
	return (
		<div className="w-full max-w-sm">
			<Field>
				<FieldLabel>Full name</FieldLabel>
				<FieldControl>
					<Input placeholder="Enter your name" />
				</FieldControl>
				<FieldDescription>As it appears on your ID.</FieldDescription>
			</Field>
		</div>
	)
}

export function FieldBasicDemo() {
	return (
		<div className="w-full max-w-sm">
			<Field>
				<FieldLabel>Name</FieldLabel>
				<FieldControl>
					<Input placeholder="Enter your name" />
				</FieldControl>
			</Field>
		</div>
	)
}

export function FieldDescriptionDemo() {
	return (
		<div className="w-full max-w-sm">
			<Field>
				<FieldLabel>Email</FieldLabel>
				<FieldControl>
					<Input type="email" placeholder="you@example.com" />
				</FieldControl>
				<FieldDescription>We will never share your email.</FieldDescription>
			</Field>
		</div>
	)
}

export function FieldErrorDemo() {
	return (
		<div className="w-full max-w-sm">
			<Field>
				<FieldLabel>Username</FieldLabel>
				<FieldControl>
					<Input placeholder="Enter username" />
				</FieldControl>
				<FieldError>This field is required.</FieldError>
			</Field>
		</div>
	)
}

export function FieldMultipleErrorsDemo() {
	return (
		<div className="w-full max-w-sm">
			<Field>
				<FieldLabel>Password</FieldLabel>
				<FieldControl>
					<Input type="password" placeholder="Enter password" />
				</FieldControl>
				<FieldError errors={["Must be at least 8 characters.", "Must contain a number."]} />
			</Field>
		</div>
	)
}

export function FieldTextareaDemo() {
	return (
		<div className="w-full max-w-sm">
			<Field>
				<FieldLabel>Bio</FieldLabel>
				<FieldControl>
					<Textarea placeholder="Tell us about yourself..." />
				</FieldControl>
				<FieldDescription>Max 500 characters.</FieldDescription>
			</Field>
		</div>
	)
}

export function FieldSelectDemo() {
	return (
		<div className="w-full max-w-sm">
			<Field>
				<FieldLabel>Country</FieldLabel>
				<FieldControl
					render={({ id }) => (
						<Select>
							<SelectTrigger id={id}>
								<SelectValue placeholder="Select a country" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="fr">France</SelectItem>
								<SelectItem value="us">United States</SelectItem>
								<SelectItem value="uk">United Kingdom</SelectItem>
							</SelectContent>
						</Select>
					)}
				>
					<span />
				</FieldControl>
			</Field>
		</div>
	)
}

export function FieldHorizontalDemo() {
	return (
		<div className="w-full max-w-lg">
			<Field orientation="horizontal">
				<FieldLabel>Email</FieldLabel>
				<FieldContent>
					<FieldControl>
						<Input type="email" placeholder="you@example.com" />
					</FieldControl>
					<FieldDescription>We will never share your email.</FieldDescription>
				</FieldContent>
			</Field>
		</div>
	)
}

export function FieldHorizontalFieldsetDemo() {
	return (
		<div className="w-full max-w-lg">
			<fieldset className="space-y-4">
				<legend className="text-sm font-medium mb-2">Profile</legend>
				<Field orientation="horizontal">
					<FieldLabel>First name</FieldLabel>
					<FieldContent>
						<FieldControl>
							<Input placeholder="Jane" />
						</FieldControl>
					</FieldContent>
				</Field>
				<Field orientation="horizontal">
					<FieldLabel>Last name</FieldLabel>
					<FieldContent>
						<FieldControl>
							<Input placeholder="Doe" />
						</FieldControl>
					</FieldContent>
				</Field>
				<Field orientation="horizontal">
					<FieldLabel>Bio</FieldLabel>
					<FieldContent>
						<FieldControl>
							<Textarea placeholder="Tell us about yourself..." />
						</FieldControl>
						<FieldDescription>Max 500 characters.</FieldDescription>
					</FieldContent>
				</Field>
			</fieldset>
		</div>
	)
}

export function FieldValidationDemo() {
	const [value, setValue] = React.useState("")
	const [submitted, setSubmitted] = React.useState(false)
	const error = submitted && !value.trim() ? "This field is required." : undefined
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				setSubmitted(true)
			}}
			className="w-full max-w-sm space-y-4"
		>
			<Field>
				<FieldLabel>Username</FieldLabel>
				<FieldControl>
					<Input
						placeholder="Enter username"
						value={value}
						onChange={(e) => {
							setValue(e.target.value)
							if (submitted) setSubmitted(false)
						}}
					/>
				</FieldControl>
				<FieldDescription>Must be at least 3 characters.</FieldDescription>
				<FieldError errors={error ? [error] : undefined} />
			</Field>
			<Button type="submit" size="sm">
				Submit
			</Button>
		</form>
	)
}

export function FieldHorizontalControlledDemo() {
	const [email, setEmail] = React.useState("")
	const error = email && !email.includes("@") ? "Please enter a valid email address." : undefined
	return (
		<div className="w-full max-w-lg">
			<Field orientation="horizontal">
				<FieldLabel>Email</FieldLabel>
				<FieldContent>
					<FieldControl>
						<Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
					</FieldControl>
					<FieldDescription>We will never share your email.</FieldDescription>
					<FieldError errors={error ? [error] : undefined} />
				</FieldContent>
			</Field>
		</div>
	)
}
