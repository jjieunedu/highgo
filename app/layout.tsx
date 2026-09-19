import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'HIGHGO | 서울 중3 맞춤 고입 길라잡이',
  description: '서울시 중학교 3학년 학생과 담임선생님을 위한 스마트 고입 정보 및 일정 관리 웹 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
