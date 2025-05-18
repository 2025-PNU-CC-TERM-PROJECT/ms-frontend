"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	BarChart3,
	Image as ImageIcon,
	FileText,
	Activity,
} from "lucide-react";

interface UsageStats {
	imageClassification: number;
	textSummarization: number;
	totalUsage: number;
}

export default function DashboardPage() {
	const [username, setUsername] = useState<string | null>(null);
	const [usageStats, setUsageStats] = useState<UsageStats>({
		imageClassification: 0,
		textSummarization: 0,
		totalUsage: 0,
	});
	const router = useRouter();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const userObj = JSON.parse(storedUser);
			setUsername(userObj.username || "사용자");
	
			// 사용 횟수 정보 포함
			const total = userObj.usageCount || 0;
			const image = userObj.imageCount || 0;
			const text = userObj.textCount || 0;
	
			setUsageStats({
				imageClassification: image,
				textSummarization: text,
				totalUsage: total,
			});
		} else {
			router.push("/login");
		}
	}, [router]);
	

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
			<Navbar />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* 사용자 정보 카드 */}
					<Card className="md:col-span-1">
						<CardHeader>
							<div className="flex items-center space-x-4">
								<Avatar className="h-12 w-12">
									<AvatarFallback>
										{username?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<CardTitle className="text-xl">{username}</CardTitle>
									<p className="text-sm text-gray-500">환영합니다!</p>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-gray-600">총 사용 횟수</span>
									<span className="text-2xl font-bold text-blue-600">
									({usageStats.totalUsage} / 30)
									</span>
								</div>
								<div className="h-2 bg-gray-200 rounded-full">
									<div
										className="h-2 bg-blue-600 rounded-full transition-all duration-300"
										style={{
											width: `${Math.min((usageStats.totalUsage / 30) * 100, 100)}%`,
										}}
									></div>
								</div>

							</div>
						</CardContent>
					</Card>

					{/* 사용 통계 카드 */}
					<Card className="md:col-span-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<BarChart3 className="w-5 h-5 text-blue-600" />
								<CardTitle>사용 통계</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								<div className="p-4 bg-blue-50 rounded-lg">
									<div className="flex items-center gap-2 mb-2">
										<ImageIcon className="w-4 h-4 text-blue-600" />
										<span className="font-medium">이미지 분류</span>
									</div>
									<p className="text-2xl font-bold text-blue-600">
										{usageStats.imageClassification}
									</p>
									<p className="text-sm text-gray-500">회 사용</p>
								</div>
								<div className="p-4 bg-indigo-50 rounded-lg">
									<div className="flex items-center gap-2 mb-2">
										<FileText className="w-4 h-4 text-indigo-600" />
										<span className="font-medium">텍스트 요약</span>
									</div>
									<p className="text-2xl font-bold text-indigo-600">
										{usageStats.textSummarization}
									</p>
									<p className="text-sm text-gray-500">회 사용</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 서비스 선택 카드 */}
					<Card className="md:col-span-3">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Activity className="w-5 h-5 text-blue-600" />
								<CardTitle>AI 서비스 선택</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Button
									className="h-24 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white"
									onClick={() => router.push("/service-a")}
								>
									<div className="flex flex-col items-center gap-2">
										<ImageIcon className="w-6 h-6" />
										<span className="text-lg">이미지 분류</span>
									</div>
								</Button>
								<Button
									className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
									onClick={() => router.push("/service-b")}
								>
									<div className="flex flex-col items-center gap-2">
										<FileText className="w-6 h-6" />
										<span className="text-lg">텍스트 요약</span>
									</div>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>

			<Footer />
		</div>
	);
}
