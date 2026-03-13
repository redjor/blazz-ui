import { forwardRef } from "react"

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	src: string
	alt: string
	width?: number | string
	height?: number | string
	fill?: boolean
	priority?: boolean
	quality?: number
	placeholder?: string
	blurDataURL?: string
	unoptimized?: boolean
}

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
	{
		src,
		alt,
		width,
		height,
		fill,
		priority,
		quality,
		placeholder,
		blurDataURL,
		unoptimized,
		...rest
	},
	ref
) {
	const style: React.CSSProperties = fill
		? {
				position: "absolute",
				inset: 0,
				width: "100%",
				height: "100%",
				objectFit: "cover",
				...rest.style,
			}
		: rest.style || {}

	return (
		<img
			ref={ref}
			src={src}
			alt={alt}
			width={fill ? undefined : width}
			height={fill ? undefined : height}
			loading={priority ? "eager" : "lazy"}
			style={style}
			{...rest}
		/>
	)
})

export default Image
