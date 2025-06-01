"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/layout/Footer";
import { TitleWithLogo } from "@/components/layout/TitleWithLogo";
import { useEffect, useState } from "react";
import { PredictionBarChart } from "@/components/ui/PredictionBarChart";
export default function ServiceA() {
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
		}
	}, [router]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) setFile(selectedFile);
	};

	const handleSubmit = async () => {
		if (!file) return;

		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		setLoading(true);
		setResult(null);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/dashboard/image-class`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);

			if (!response.ok) throw new Error("분석 실패");

			const data = await response.json();
			setResult(data);
		} catch (err) {
			alert("분석 중 오류가 발생했습니다.");
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
							mobilenet: 동물 이미지 분류 서비스
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 pb-8 space-y-6">
						<Input type="file" accept="image/*" onChange={handleFileChange} />
						{file && (
							<img
								src={URL.createObjectURL(file)}
								alt="업로드 미리보기"
								className="w-full max-h-64 object-contain border rounded"
							/>
						)}
						<Button disabled={!file || loading} onClick={handleSubmit}>
							{loading ? "분석 중..." : "이미지 분석 시작"}
						</Button>
						{result && result.predictions && (
							<div className="mt-6 text-sm space-y-2">
								<p className="font-semibold text-gray-700">
									예측 결과 상위 3개:
								</p>
								<div className="bg-slate-100 p-4 rounded">
									<PredictionBarChart
										results={result.predictions.slice(0, 3)}
									/>
								</div>
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
