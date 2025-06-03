'use client';

import { redirect } from 'next/navigation';

export default function Home() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }

  return null; // 렌더링할 UI 없음
}