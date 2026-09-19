'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRoster } from '@/context/RosterContext';
import { SCHOOLS } from '@/data/schools';
import { ADMISSION_EVENTS } from '@/data/schedules';
import {
  Compass,
  Calendar,
  Star,
  BookOpen,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  School,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  const { session, openAuthModal } = useAuth();
  const { getStudentRecord } = useRoster();

  // 학생 희망고교 데이터
  const studentId = session.role === 'student' ? session.studentId! : '30101';
  const student = getStudentRecord(studentId);
  const wishlistIds = student?.wishlistSchoolIds || [];
  const wishSchools = wishlistIds
    .map((id) => SCHOOLS.find((s) => s.id === id))
    .filter(Boolean);

  // 다가오는 주요 D-Day 일정 3개
  const highlightEvents = ADMISSION_EVENTS.filter((e) => e.isDDayHighlight).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ==================== 1. 히어로 환영 배너 ==================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>2027학년도 서울특별시 고등학교 입학전형</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            복잡한 서울 고입, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">
              HIGHGO
            </span>
            에서 한눈에 확인하세요.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            전기고(과고, 마이스터, 특성화)부터 후기고(일반고, 자사고, 외고)까지 객관적인 정보와
            원서접수 일정을 나만의 맞춤 캘린더로 관리할 수 있습니다.
          </p>

          {/* 현재 로그인 상태 뱃지 & 액션 */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-all border border-white/20"
            >
              <span>현재 접속: {session.displayName}</span>
              <span className="text-indigo-300">코드 변경 →</span>
            </button>

            {session.role === 'teacher' && (
              <Link
                href="/teacher"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>3학년 {session.classNum}반 현황판 바로가기</span>
              </Link>
            )}
          </div>
        </div>

        {/* 배경 은은한 데코 그래픽 */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ==================== 2. 현재 시기 안내 & 필수 D-Day 배너 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 지금 중3이 확인해야 할 사항 (2열) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                지금 중3, 무엇을 준비해야 할까요?
              </h2>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              고입 집중 기간
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                <span>01</span>
                <span>내신 관리</span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                3학년 2학기 지필평가
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                중3 2학기 교과성적과 수행평가가 고입 내신 산출에 그대로 반영됩니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                <span>02</span>
                <span>학교 탐색</span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                입학설명회 및 특색 조사
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                관심 학교의 모집요강과 설명회 일정을 확인하고 희망고교로 담아두세요.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                <span>03</span>
                <span>담임 상담</span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                전기 1곳 / 후기 지망 상담
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                이중지원 금지 규칙을 확인하고 담임선생님과 최종 지망을 상의하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 다가오는 D-Day 위젯 (1열) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                다가오는 주요 고입 일정
              </h2>
              <Link href="/calendar" className="text-xs text-indigo-600 hover:underline font-bold">
                전체보기 →
              </Link>
            </div>

            <div className="space-y-2.5">
              {highlightEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 line-clamp-1">
                      {ev.title}
                    </span>
                    <span className="text-[10px] font-bold text-rose-600 shrink-0 ml-2">
                      {ev.startDate.slice(5)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {ev.description.slice(0, 38)}...
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/calendar"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center transition-colors mt-2"
          >
            캘린더에서 내 일정 확인하기
          </Link>
        </div>
      </div>

      {/* ==================== 3. 4대 주요 기능 퀵 링크 그리드 ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/schools"
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                고등학교 탐색
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                전기/후기, 학교유형, 자치구별 필터로 서울 내 학교를 찾고 관심 학교를 담아보세요.
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-indigo-600 gap-1">
            <span>학교 찾아보기</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/calendar"
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                스마트 고입 캘린더
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                설명회, 원서접수 기간부터 담임 필수 점검 일정까지 내 희망고교만 모아서 볼 수 있습니다.
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-blue-600 gap-1">
            <span>캘린더 열기</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/my-schools"
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                  나의 희망고교
                </h3>
                {wishSchools.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {wishSchools.length}개
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                내가 찜한 학교들을 모아보고 전기 1곳 / 후기 지원 규칙 충돌을 자가진단합니다.
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-amber-600 gap-1">
            <span>내 희망고교 관리</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/guide"
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                고입 길라잡이
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                고교선택제 3단계 배정, 이중지원 금지, 중학생 맞춤 용어 사전을 확인하세요.
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-emerald-600 gap-1">
            <span>길라잡이 읽기</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* ==================== 4. 교사용 안내 배너 ==================== */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-extrabold">
              교사용 기능
            </span>
            <h4 className="text-sm font-extrabold text-amber-950">
              담임선생님이신가요? 301~304 코드로 진입해 보세요.
            </h4>
          </div>
          <p className="text-xs text-amber-900/80">
            우리 반 학생들의 관심 고등학교 선택 현황과 전기/후기 비율을 실시간 통계로 조회하고 상담 메모를 작성할 수 있습니다.
          </p>
        </div>

        <Link
          href="/teacher"
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>우리 반 현황판 이동</span>
        </Link>
      </div>
    </div>
  );
}
