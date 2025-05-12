"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { TitleWithLogo } from "@/components/layout/TitleWithLogo";

export default function DashboardPage() {
	const [username, setUsername] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const userObj = JSON.parse(storedUser);
			setUsername(userObj.username || "사용자");
		} else {
			router.push("/login");
		}
	}, [router]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		router.push("/login");
	};

	const goToMyPage = () => {
		router.push("/mypage");
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4">
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-200 opacity-50 blur-3xl animate-pulse"></div>
				<div className="absolute top-1/3 -right-10 w-60 h-60 rounded-full bg-sky-300 opacity-30 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
				<div className="absolute -bottom-10 left-1/3 w-60 h-60 rounded-full bg-indigo-200 opacity-40 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
			</div>

			<div className="w-full max-w-2xl relative z-10">
				<TitleWithLogo />

				<Card className="overflow-hidden border-0 bg-white/90 shadow-xl shadow-blue-100/50 backdrop-blur-sm transform hover:shadow-2xl transition-all duration-300">
					<div className="h-2 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500"></div>
					<CardHeader className="flex flex-col md:flex-row justify-between items-center py-6 px-6">
						<CardTitle className="text-xl font-bold text-blue-900">
							{username}님 환영합니다
						</CardTitle>
						<div className="flex gap-3 mt-4 md:mt-0">
							<Button variant="outline" onClick={goToMyPage}>마이페이지</Button>
							<Button variant="destructive" onClick={handleLogout}>로그아웃</Button>
						</div>
					</CardHeader>

					<CardContent className="px-6 pb-8">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">사용할 AI 서비스 선택</h2>
						<p className="text-gray-600">아래에서 원하는 AI 서비스를 선택해 주세요. (예: OCR, 텍스트 요약, 감정 분석 등)</p>
					</CardContent>

                    <CardContent className="space-y-4">
						<Button className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white"
							onClick={() => router.push("/service-a")}>
							이미지 분류
						</Button>
						<Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
							onClick={() => router.push("/service-b")}>
							Text 요약
						</Button>
					</CardContent>
                    
				</Card>
				<Footer />
			</div>
		</div>
	);
}
