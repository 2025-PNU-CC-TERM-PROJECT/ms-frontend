import Image from "next/image";

export function TitleWithLogo({ children }) {
	return (
		<div className="mb-8 text-center transform hover:scale-105 transition-transform duration-300">
			<div className="mx-auto mb-4 flex h-45 w-45 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-sky-600 shadow-lg shadow-blue-200">
				<Image
					src="/logo.png"
					alt="logo"
					width={280}
					height={280}
					className="object-contain"
					priority
				/>
			</div>
			<h1 className="text-2xl font-bold tracking-tight text-blue-900">
				MS-Serving
			</h1>
		</div>
	);
}
