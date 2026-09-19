'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { RosterProvider } from '@/context/RosterContext';
import Navbar from './Navbar';
import AuthModal from './AuthModal';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RosterProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-1 pb-16">{children}</main>
          <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto space-y-2">
              <p className="font-semibold text-slate-500">
                HIGHGO · 서울특별시 중학교 3학년 맞춤형 고입 정보 웹 서비스
              </p>
              <p>
                본 서비스는 서울시교육청의 고등학교 입학전형 기본계획에 기초하여 객관적인 공공 정보만을 제공하며, 학생 개인정보를 수집하지 않습니다.
              </p>
              <p className="text-[11px] text-slate-400">
                기본 탑재 교사 진입 코드: 301, 302, 303, 304 | 학생 학번: 30101 ~ 30422
              </p>
            </div>
          </footer>
          <AuthModal />
        </div>
      </RosterProvider>
    </AuthProvider>
  );
}

