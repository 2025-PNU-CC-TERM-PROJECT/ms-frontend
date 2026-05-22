"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PredictionBarChart } from "@/components/ui/PredictionBarChart";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";

interface UsageHistory {
	id: number;
	modelType: string;
	usageTime: string;
	inputFile: string | null;
	resultSummary: string;
}

function parseResultSummary(
	resultText: string
): { class: string; confidence: number }[] {
	try {
		const raw = JSON.parse(resultText);
		const fixed = raw
			.replace(/([{,])\s*class=([^,}]+)/g, '$1"class":"$2"')
			.replace(/([{,])\s*confidence=([^,}]+)/g, '$1"confidence":$2')
			.replace(/=/g, ":");
		return JSON.parse(fixed);
	} catch (e) {
		console.error(" parseResultSummary 실패:", e);
		return [];
	}
}

export default function ActivityPage() {
	const [activities, setActivities] = useState<UsageHistory[]>([]);
	const [selected, setSelected] = useState<UsageHistory | null>(null);
	const [loading, setLoading] = useState(true);
	const [resultText, setResultText] = useState<string>("");
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [categoryFilter, setCategoryFilter] = useState<
		"ALL" | "IMAGE" | "summary"
	>("ALL");
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		fetch(apiUrl("/api/user/usage-history"), {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(setActivities)
			.finally(() => setLoading(false));
	}, [router]); // ⭐ router 넣기 (의존성 추가)

	useEffect(() => {
		if (selected && selected.modelType === "IMAGE") {
			const token = localStorage.getItem("token");

			fetch(
				apiUrl(`/api/user/usage-history/image/${selected.id}`),
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
				.then((res) => res.blob())
				.then((blob) => {
					const url = URL.createObjectURL(blob);
					setImageUrl(url);
				});

			fetch(
				apiUrl(`/api/user/usage-history/image-meta/${selected.id}`),
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
				.then((res) => res.json())
				.then((data) => setResultText(data.resultSummary))
				.catch((err) => {
					console.error("resultSummary 가져오기 실패", err);
					setResultText("요약 결과를 불러오는 데 실패했습니다.");
				});
		}
	}, [selected]);

	if (loading) return <div className="text-center py-10">불러오는 중...</div>;

	const filteredActivities = activities.filter((a) =>
		categoryFilter === "ALL" ? true : a.modelType === categoryFilter
	);

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 via-sky-50 to-indigo-50 p-6">
			<div className="max-w-2xl mx-auto space-y-6">
				<h1 className="text-3xl font-bold text-center text-blue-900">
					내 활동 내역
				</h1>
				<p className="text-center text-gray-600">
					AI 모델 사용 기록을 확인할 수 있어요.
				</p>

				{/* 카테고리 필터 버튼 */}
				<div className="flex justify-center gap-3 mt-2">
					<Button
						variant={categoryFilter === "ALL" ? "default" : "outline"}
						onClick={() => setCategoryFilter("ALL")}
					>
						전체
					</Button>
					<Button
						variant={categoryFilter === "IMAGE" ? "default" : "outline"}
						onClick={() => setCategoryFilter("IMAGE")}
					>
						🖼 이미지
					</Button>
					<Button
						variant={categoryFilter === "summary" ? "default" : "outline"}
						onClick={() => setCategoryFilter("summary")}
					>
						📄 텍스트
					</Button>
				</div>

				{filteredActivities.map((activity) => (
					<Card
						key={activity.id}
						className="bg-white/90 shadow-md hover:shadow-lg transition cursor-pointer"
						onClick={() => {
							setSelected(activity);
							setResultText("");
						}}
					>
						<CardContent className="p-6 flex items-center justify-between">
							<div className="text-blue-900 font-medium text-base">
								{activity.modelType === "IMAGE"
									? "🖼️ 이미지 분석"
									: "📄 텍스트 요약"}
							</div>
							<div className="text-sm text-gray-500">
								{new Date(activity.usageTime).toLocaleString()}
							</div>
						</CardContent>
					</Card>
				))}

				<div className="flex justify-center pt-6">
					<Button onClick={() => (window.location.href = "/mypage")}>
						마이페이지로 돌아가기
					</Button>
				</div>
			</div>

			{/* 상세 팝업 */}
			{selected && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
					<div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative space-y-4">
						<h2 className="text-xl font-bold text-blue-800">
							{selected.modelType === "IMAGE"
								? "🖼️ 이미지 분석"
								: "📄 텍스트 요약"}
						</h2>

						<p className="text-sm text-gray-500">
							⏰ {new Date(selected.usageTime).toLocaleString()}
						</p>

						{selected.modelType === "IMAGE" ? (
							<>
								{imageUrl && (
									<img
										src={imageUrl}
										alt="분석 이미지"
										className="w-full max-h-[400px] object-contain rounded border"
									/>
								)}
								<div className="bg-slate-100 p-4 rounded text-sm text-gray-800 max-h-[300px] overflow-y-auto">
									{resultText ? (
										(() => {
											const parsed = parseResultSummary(resultText);
											return parsed.length > 0 ? (
												<PredictionBarChart results={parsed} />
											) : (
												<p className="text-red-500 text-sm">
													⚠ 결과를 불러오는 데 실패했습니다.
												</p>
											);
										})()
									) : (
										<p className="text-gray-600">결과 불러오는 중...</p>
									)}
								</div>
							</>
						) : (
							<div className="bg-slate-100 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
								{selected.resultSummary}
							</div>
						)}

						{selected.inputFile && (
							<p className="text-sm text-gray-600">
								📎 입력 파일: {selected.inputFile}
							</p>
						)}

						<div className="flex justify-end">
							<Button variant="secondary" onClick={() => setSelected(null)}>
								닫기
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
