"use client";

import { useState } from "react";
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
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	LockKeyhole,
	Mail,
	User,
	UserPlus,
	Loader2,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { TitleWithLogo } from "../../../components/layout/TitleWithLogo";

interface PasswordStrengthIndicatorProps {
	password: string;
}

// 비밀번호 강도 검사
const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
	password,
}) => {
	// 비밀번호 강도 계산 (0-100)
	const calculateStrength = (pass: string): number => {
		if (!pass) return 0;

		let strength = 0;

		// 길이 점수 (최대 25점)
		strength += Math.min(pass.length * 2, 25);

		// 다양성 점수
		if (/[A-Z]/.test(pass)) strength += 15; // 대문자
		if (/[a-z]/.test(pass)) strength += 15; // 소문자
		if (/[0-9]/.test(pass)) strength += 15; // 숫자
		if (/[^A-Za-z0-9]/.test(pass)) strength += 15; // 특수문자

		// 반복 문자 감점
		const repeats = pass.match(/(.)\1+/g);
		if (repeats) {
			strength -= repeats.length * 5;
		}

		return Math.max(0, Math.min(strength, 100));
	};

	const strength = calculateStrength(password);

	// 강도에 따른 색상
	const getColor = (): string => {
		if (strength < 30) return "bg-red-500";
		if (strength < 60) return "bg-yellow-500";
		return "bg-green-500";
	};

	// 강도에 따른 메시지
	const getMessage = (): string => {
		if (strength < 30) return "매우 약함";
		if (strength < 60) return "적절함";
		return "강함";
	};

	return (
		<div className="mt-2 space-y-2">
			<div className="text-sm text-muted-foreground">
				비밀번호 강도: {getMessage()}
			</div>
			<div className="h-2 w-full bg-gray-200 rounded-full">
				<div
					className={`h-full rounded-full ${getColor()}`}
					style={{ width: `${strength}%` }}
				/>
			</div>
		</div>
	);
};

// Zod 유효성 검사 스키마
const formSchema = z
	.object({
		username: z
			.string()
			.min(3, { message: "사용자명은 최소 3자 이상이어야 합니다." })
			.max(20, { message: "사용자명은 최대 20자 이하여야 합니다." }),
		email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
		password: z
			.string()
			.min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
			.refine((password) => /[A-Z]/.test(password), {
				message: "비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.",
			})
			.refine((password) => /[0-9]/.test(password), {
				message: "비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.",
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "비밀번호가 일치하지 않습니다.",
		path: ["confirmPassword"],
	});

type FormData = z.infer<typeof formSchema>;

export default function SignupPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const password = form.watch("password");

	async function onSubmit(data: FormData) {
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/signup`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: data.username,
						email: data.email,
						password: data.password,
						role: "user",
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "회원가입에 실패했습니다.");
			}

			await response.json();

			// 성공 메시지 표시
			toast({
				title: "회원가입 성공",
				description: "회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.",
			});

			// 로그인 페이지로 리다이렉트
			setTimeout(() => {
				router.push("/login");
			}, 2000);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "알 수 없는 오류가 발생했습니다."
			);
		} finally {
			setIsLoading(false);
		}
	}

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
				{/* 로고 및 타이틀 */}
				<TitleWithLogo />

				{/* 회원가입 카드 */}
				<Card className="overflow-hidden border-0 bg-white/90 shadow-xl shadow-blue-100/50 backdrop-blur-sm transform hover:shadow-2xl transition-all duration-300">
					<div className="h-2 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500"></div>
					<CardHeader className="space-y-1 pb-6 pt-6">
						<CardTitle className="text-center text-2xl font-bold text-blue-900">
							회원가입
						</CardTitle>
						<CardDescription className="text-center text-sky-600">
							MS-Serving 플랫폼의 새로운 멤버가 되어보세요
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

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-blue-800">
												사용자명
											</FormLabel>
											<FormControl>
												<div className="relative group">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<User className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
													</div>
													<Input
														placeholder="사용자명 입력"
														className="pl-10 h-12 rounded-lg border-blue-200 bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all hover:bg-blue-50"
														{...field}
													/>
												</div>
											</FormControl>
											<FormDescription className="text-sky-600">
												다른 사용자에게 표시될 이름입니다.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-blue-800">
												이메일
											</FormLabel>
											<FormControl>
												<div className="relative group">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<Mail className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
													</div>
													<Input
														placeholder="이메일 입력"
														type="email"
														className="pl-10 h-12 rounded-lg border-blue-200 bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all hover:bg-blue-50"
														{...field}
													/>
												</div>
											</FormControl>
											<FormDescription className="text-sky-600">
												알림 및 계정 복구에 사용됩니다.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-blue-800">
												비밀번호
											</FormLabel>
											<FormControl>
												<div className="relative group">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<LockKeyhole className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
													</div>
													<Input
														placeholder="비밀번호 입력"
														type="password"
														className="pl-10 h-12 rounded-lg border-blue-200 bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all hover:bg-blue-50"
														{...field}
													/>
												</div>
											</FormControl>
											<PasswordStrengthIndicator password={password} />
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-blue-800">
												비밀번호 확인
											</FormLabel>
											<FormControl>
												<div className="relative group">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<LockKeyhole className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
													</div>
													<Input
														placeholder="비밀번호 확인"
														type="password"
														className="pl-10 h-10 rounded-lg border-blue-200 bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all hover:bg-blue-50"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full h-12 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-lg font-medium text-base shadow-md shadow-blue-300/50 transition-all hover:shadow-lg hover:shadow-blue-300/50 hover:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={isLoading}
								>
									{isLoading ? (
										<div className="flex items-center justify-center">
											<Loader2 className="mr-2 h-5 w-5 animate-spin" />
											<span>처리 중...</span>
										</div>
									) : (
										<div className="flex items-center justify-center">
											<UserPlus className="mr-2 h-5 w-5" />
											<span>회원가입</span>
										</div>
									)}
								</Button>
							</form>
						</Form>
					</CardContent>

					<CardFooter className="border-t border-blue-100 bg-blue-50/50 py-5">
						<p className="mx-auto text-sm text-sky-700">
							이미 계정이 있으신가요?{" "}
							<Link
								href="/login"
								className="font-bold text-blue-600 hover:text-blue-800 transition-colors underline"
							>
								로그인
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
