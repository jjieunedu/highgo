'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRoster } from '@/context/RosterContext';
import { SCHOOLS } from '@/data/schools';
import { ADMISSION_EVENTS } from '@/data/schedules';
import { CHECKLIST_ITEMS } from '@/data/checklist';
import { School, AdmissionEvent } from '@/types';
import {
  Star,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Calendar,
  CheckSquare,
  Square,
  Bed,
} from 'lucide-react';

export default function MySchoolsPage() {
  const { session, openAuthModal } = useAuth();
  const { getStudentRecord, toggleWishlist, toggleChecklist } = useRoster();

  // 현재 사용자 학생 레코드 가져오기 (교사인 경우 30101 예시 모드로 시연 지원)
  const studentId = session.role === 'student' ? session.studentId! : '30101';
  const student = getStudentRecord(studentId);

  const wishlistIds = student?.wishlistSchoolIds || [];
  const completedChecklistIds = student?.completedChecklistIds || [];

  // 담긴 학교 목록
  const wishSchools = wishlistIds
    .map((id) => SCHOOLS.find((s) => s.id === id))
    .filter(Boolean) as School[];

  // 전기고 / 후기고 분류
  const earlySchools = wishSchools.filter((s) => s.category === '전기고');
  const lateSchools = wishSchools.filter((s) => s.category === '후기고');

  // 전기고 중복 지원 여부 체크
  const hasEarlyConflict = earlySchools.length > 1;

  // 내가 담은 학교들과 연결된 전형 일정 추출
  const myEvents = ADMISSION_EVENTS.filter((ev) => {
    if (ev.schoolId && wishlistIds.includes(ev.schoolId)) return true;
    return false;
  }).sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 상단 프로필 헤더 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              나의 희망고교 관리실
            </span>
            <span className="text-xs text-slate-400">
              학번: <strong>{studentId}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            내가 저장한 관심 고등학교 & 준비 상태
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            관심 있는 학교들의 지원 규칙 충돌 여부를 자가진단하고, 원서접수 전 체크리스트를 점검하세요.
          </p>
        </div>

        {session.role === 'guest' && (
          <button
            onClick={openAuthModal}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-xs"
          >
            학번 코드로 로그인하고 저장하기
          </button>
        )}
      </div>

      {/* ==================== 1. 고입 안심 자가진단 카드 ==================== */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            고입 지원 규칙 안심 체크기
          </h2>
          <Link
            href="/guide"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
          >
            지원 규칙 가이드 보기 →
          </Link>
        </div>

        {hasEarlyConflict ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-extrabold text-rose-800 text-sm">
                ⚠️ 전기고등학교가 {earlySchools.length}개 담겨 있습니다 (이중지원 유의)
              </div>
              <p className="leading-relaxed">
                전기고(과학고, 마이스터고, 특성화고, 예체고)는 전국 어디든 <strong>오직 1곳만 지원</strong>할 수 있습니다.
                원서접수 전 반드시 담임선생님과 상담하여 한 학교를 최종 선택해 주세요!
              </p>
            </div>
          </div>
        ) : earlySchools.length === 1 ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-emerald-800 text-sm">
                ✓ 전기고 지원 규칙 적합
              </div>
              <p className="leading-relaxed">
                전기고 1곳({earlySchools[0].name})이 안전하게 담겨 있습니다. 전기고에 불합격하더라도 12월 후기고에 정상 지원할 수 있습니다.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-blue-800 text-sm">
                후기고(일반고·자사고·외고) 중심 지망 구성
              </div>
              <p className="leading-relaxed">
                현재 전기고는 담겨있지 않으며, 12월에 실시되는 후기고 위주로 탐색 중입니다.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ==================== 2. 내가 담은 학교 목록 (2열 차지) ==================== */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              내가 찜한 학교 ({wishSchools.length}개)
            </h2>
            <Link
              href="/schools"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Compass className="w-4 h-4" />
              <span>더 많은 학교 찾아보기</span>
            </Link>
          </div>

          {wishSchools.length === 0 ? (
            <div className="py-16 bg-white rounded-3xl border border-slate-200/80 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                아직 저장한 희망고교가 없습니다.
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                '고등학교 탐색' 메뉴에서 관심 있는 고등학교 카드의 별표(★)를 눌러 희망고교로 담아보세요.
              </p>
              <Link
                href="/schools"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                고등학교 둘러보기
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {wishSchools.map((school) => {
                const isEarly = school.category === '전기고';
                return (
                  <div
                    key={school.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
                            isEarly
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {school.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                          {school.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {school.district} · {school.foundation}
                        </span>
                        {school.dormitory && (
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <Bed className="w-3 h-3" />
                            기숙사
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900">
                        {school.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1">
                        {school.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <a
                        href={school.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                      >
                        <span>홈페이지</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => toggleWishlist(studentId, school.id)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="희망고교 목록에서 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 내가 담은 학교들의 일정 요약 */}
          {myEvents.length > 0 && (
            <div className="mt-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  내 희망고교 다가오는 일정 ({myEvents.length}개)
                </h3>
                <Link
                  href="/calendar"
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  캘린더에서 크게 보기 →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {myEvents.map((ev) => (
                  <div key={ev.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {ev.title}
                      </div>
                      <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                        {ev.startDate} ~ {ev.endDate}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold shrink-0">
                      {ev.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== 3. 중3 실무 준비 체크리스트 (1열) ==================== */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              중3 고입 준비 체크리스트
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
              <span>달성 진행률</span>
              <strong className="text-indigo-600 font-bold">
                {completedChecklistIds.length} / {CHECKLIST_ITEMS.length} 완료
              </strong>
            </div>

            <div className="space-y-3">
              {CHECKLIST_ITEMS.map((item) => {
                const isChecked = completedChecklistIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(studentId, item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                          {item.period}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <div className={`font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {item.title}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

