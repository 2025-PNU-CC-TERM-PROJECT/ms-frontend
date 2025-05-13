"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { TitleWithLogo } from "@/components/layout/TitleWithLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
	username: string;
	email: string;
	profileImageUrl?: string;
}

export default function MyPage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			router.push("/login");
			return;
		}

		fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			},
		})
			.then(async (res) => {
				if (!res.ok) {
					localStorage.removeItem("token");
					throw new Error("Unauthorized");
				}
				const data = await res.json();
				setUser(data);
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
				localStorage.removeItem("token");
				router.push("/login");
			})
			.finally(() => setLoading(false));
	}, [router]);

	if (loading) return <div className="text-center py-10">로딩 중...</div>;

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4">
			<div className="w-full max-w-2xl relative z-10 space-y-6">
				<TitleWithLogo />

				<Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm">
					<div className="h-2 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500" />

					<CardHeader className="flex flex-col items-center gap-4 py-6 px-6">
						<Avatar className="w-20 h-20">
							{user?.profileImageUrl ? (
								<AvatarImage src={user.profileImageUrl} alt={user.username} />
							) : (
								<AvatarFallback>
									{user?.username?.charAt(0).toUpperCase() ?? "U"}
								</AvatarFallback>
							)}
						</Avatar>

						<div className="text-center">
							<CardTitle className="text-2xl font-bold text-blue-900">
								{user?.username}
							</CardTitle>
							<p className="text-sm text-gray-600">{user?.email}</p>
						</div>
					</CardHeader>

					<CardContent className="flex flex-col items-center px-6 pb-8 space-y-6">
						<div className="flex gap-4">
							<Button onClick={() => router.push("/mypage/activity")}>
								활동 내역 보기
							</Button>
							<Button
								variant="secondary"
								onClick={() => router.push("/dashboard")}
							>
								대시보드로 돌아가기
							</Button>
						</div>
					</CardContent>
				</Card>

				<Footer />
			</div>
		</div>
	);
}
