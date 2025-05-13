"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export function Navbar() {
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		router.push("/login");
	};

	return (
		<nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-20 items-center">
					<div className="flex items-center">
						<div className="w-20 h-20">
							<Image
								src="/titleLogo.png"
								alt="logo"
								width={50}
								height={50}
								className="w-full h-full object-contain"
							/>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							onClick={() => router.push("/mypage")}
							className="flex items-center gap-2"
						>
							<User className="w-4 h-4" />
							<span>마이페이지</span>
						</Button>
						<Button
							variant="ghost"
							onClick={handleLogout}
							className="flex items-center gap-2 text-red-600 hover:text-red-700"
						>
							<LogOut className="w-4 h-4" />
							<span>로그아웃</span>
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}
