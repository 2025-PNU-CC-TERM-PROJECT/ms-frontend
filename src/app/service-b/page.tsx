// src/app/service-b/page.tsx
"use client";

// import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "@/components/layout/Footer";
import { TitleWithLogo } from "@/components/layout/TitleWithLogo";
import { useEffect, useState } from "react";

export default function ServiceB() {
	const [text, setText] = useState("");
	const [summary, setSummary] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
		}
	}, [router]);

	const handleSubmit = async () => {
		if (!text.trim()) return;

		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		setLoading(true);
		setSummary("");

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/text-summary`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ text }),
			});

			if (!response.ok) throw new Error("요약 실패");

			const data = await response.json();
			setSummary(data.summary);
		} catch (err) {
			alert("요약 중 오류가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4">
			<div className="w-full max-w-2xl relative z-10">
				<TitleWithLogo />
				<Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm">
					<div className="h-2 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500"></div>
					<CardHeader className="py-6 px-6">
						<CardTitle className="text-xl font-bold text-blue-900">
							텍스트 요약 서비스
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 pb-8 space-y-6">
						<Textarea
							className="w-full h-40 resize-none"
							placeholder="요약할 텍스트를 입력하세요..."
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
						<Button disabled={!text || loading} onClick={handleSubmit}>
							{loading ? "요약 중..." : "요약하기"}
						</Button>
						{summary && (
							<div className="mt-4 p-4 border rounded bg-gray-50 text-gray-800 text-sm whitespace-pre-wrap">
								<p className="font-semibold text-blue-700 mb-1">요약 결과:</p>
								{summary}
							</div>
						)}
						<Button
							className="w-full"
							variant="outline"
							onClick={() => router.push("/dashboard")}
						>
							← 대시보드로 돌아가기
						</Button>
					</CardContent>
				</Card>
				<Footer />
			</div>
		</div>
	);
}
