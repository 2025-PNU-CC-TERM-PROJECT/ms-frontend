import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-200",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function AvatarImage({
	src,
	alt,
	className,
}: {
	src: string;
	alt?: string;
	className?: string;
}) {
	return (
		<img
			src={src}
			alt={alt}
			className={cn("h-full w-full object-cover", className)}
		/>
	);
}

export function AvatarFallback({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className={cn(
				"flex h-full w-full items-center justify-center text-lg font-semibold text-blue-800 bg-blue-200",
				className
			)}
			{...props}
		>
			{children}
		</span>
	);
}
