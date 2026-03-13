"use client"

import { Link as TanStackLink } from "@tanstack/react-router"
import { forwardRef } from "react"

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
	href?: string
	prefetch?: boolean
	replace?: boolean
	scroll?: boolean
	children?: React.ReactNode
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
	{ href = "#", children, prefetch, replace, scroll, ...rest },
	ref
) {
	// External links or hash links — use a plain <a>
	if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) {
		return (
			<a ref={ref} href={href} {...rest}>
				{children}
			</a>
		)
	}

	return (
		<TanStackLink ref={ref} to={href} preload={prefetch === false ? undefined : "intent"} {...rest}>
			{children}
		</TanStackLink>
	)
})

export default Link
