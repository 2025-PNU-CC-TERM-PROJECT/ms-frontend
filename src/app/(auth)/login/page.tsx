"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LockKeyhole, User, Loader2, LogIn, AlertCircle } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { TitleWithLogo } from "@/components/layout/TitleWithLogo";

interface LoginResponse {
	token: string;
	id: number;
	username: string;
	email: string;
	role: string;

	usageCount: number;
	imageCount: number;
	textCount: number;
}

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const formData = new FormData(e.currentTarget);
			const username = formData.get("username") as string;
			const password = formData.get("password") as string;

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						username,
						password,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "로그인에 실패했습니다.");
			}

			const data: LoginResponse = await response.json();

			// JWT 토큰을 로컬 스토리지에 저장
			localStorage.setItem("token", data.token);
			localStorage.setItem(
				"user",
				JSON.stringify({
					id: data.id,
					username: data.username,
					email: data.email,
					role: data.role,
					usageCount: data.usageCount,
					imageCount: data.imageCount,
					textCount: data.textCount,
				})
			);

			// 성공 시 대시보드로 리다이렉트
			router.replace("/dashboard");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "로그인에 실패했습니다. 다시 시도해주세요."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4">
			{/* 배경 장식 요소 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-200 opacity-50 blur-3xl animate-pulse"></div>
				<div
					className="absolute top-1/3 -right-10 w-60 h-60 rounded-full bg-sky-300 opacity-30 blur-3xl animate-pulse"
					style={{ animationDelay: "1s" }}
				></div>
				<div
					className="absolute -bottom-10 left-1/3 w-60 h-60 rounded-full bg-indigo-200 opacity-40 blur-3xl animate-pulse"
					style={{ animationDelay: "2s" }}
				></div>
			</div>

			<div className="w-full max-w-md relative z-10">
				<TitleWithLogo />

				{/* 로그인 카드 */}
				<Card className="overflow-hidden border-0 bg-white/90 shadow-xl shadow-blue-100/50 backdrop-blur-sm transform hover:shadow-2xl transition-all duration-300">
					<div className="h-2 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500"></div>
					<CardHeader className="space-y-1 pb-6 pt-6">
						<CardTitle className="text-center text-2xl font-bold text-blue-900">
							로그인
						</CardTitle>
						<CardDescription className="text-center text-sky-600">
							계정 정보를 입력하세요
						</CardDescription>
					</CardHeader>

					<CardContent className="pb-6">
						{error && (
							<Alert
								variant="destructive"
								className="mb-4 border-red-200 bg-red-50 text-red-800 animate-shake"
							>
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="username"
									className="text-sm font-medium text-blue-800"
								>
									사용자명
								</Label>
								<div className="relative group">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<User className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
									</div>
									<Input
										id="username"
										name="username"
										placeholder="사용자명 입력"
										className="pl-10 h-12 rounded-lg border-blue-200 bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all hover:bg-blue-50"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label
										htmlFor="password"
										className="text-sm font-medium text-blue-800"
									>
										비밀번호
									</Label>
									<Link
										href="/forgot-password"
										className="text-xs font-medium text-sky-600 hover:text-sky-800 transition-colors"
									>
										비밀번호 찾기
									</Link>
								</div>
								<div className="relative group">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<LockKeyhole className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
									</div>
									<Input
										id="password"
										name="password"
										type="password"
										placeholder="비밀번호 입력"
										className="pl-10 h-12 rounded-lg border-blue-200 bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all hover:bg-blue-50"
										required
									/>
								</div>
							</div>

							<div className="flex items-center space-x-2 my-2">
								<Checkbox
									id="remember"
									className="border-blue-300 text-blue-600 focus:ring-blue-500"
								/>
								<Label
									htmlFor="remember"
									className="text-sm text-sky-700 font-medium"
								>
									로그인 상태 유지
								</Label>
							</div>

							<Button
								type="submit"
								className="w-full h-12 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-lg font-medium text-base shadow-md shadow-blue-300/50 transition-all hover:shadow-lg hover:shadow-blue-300/50 hover:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center justify-center">
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										<span>로그인 중...</span>
									</div>
								) : (
									<div className="flex items-center justify-center">
										<LogIn className="mr-2 h-5 w-5" />
										<span>로그인</span>
									</div>
								)}
							</Button>
						</form>
					</CardContent>

					<CardFooter className="border-t border-blue-100 bg-blue-50/50 py-5">
						<p className="mx-auto text-sm text-sky-700">
							계정이 없으신가요?{" "}
							<Link
								href="/signup"
								className="font-bold text-blue-600 hover:text-blue-800 transition-colors underline"
							>
								회원가입
							</Link>
						</p>
					</CardFooter>
				</Card>

				{/* 푸터 */}
				<Footer />
			</div>
		</div>
	);
}
