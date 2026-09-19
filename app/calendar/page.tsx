'use client';

import React, { useState, useMemo } from 'react';
import { ADMISSION_EVENTS } from '@/data/schedules';
import { SCHOOLS } from '@/data/schools';
import { AdmissionEvent, EventCategory } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRoster } from '@/context/RosterContext';
import {
  Calendar as CalendarIcon,
  Filter,
  Star,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  List,
  Grid,
} from 'lucide-react';

export default function CalendarPage() {
  const { session, openAuthModal } = useAuth();
  const { getStudentRecord } = useRoster();

  // 필터 상태
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [viewMode, setViewMode] = useState<'timeline' | 'month'>('timeline');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11'); // 기본 11월

  // 모달 상태
  const [activeEvent, setActiveEvent] = useState<AdmissionEvent | null>(null);

  // 현재 학생의 희망고교 ID 목록
  const currentStudentId = session.role === 'student' ? session.studentId : undefined;
  const currentStudent = currentStudentId ? getStudentRecord(currentStudentId) : undefined;
  const wishlistIds = currentStudent?.wishlistSchoolIds || [];

  // 학교 맵
  const schoolMap = useMemo(() => new Map(SCHOOLS.map((s) => [s.id, s])), []);

  // 필터링된 일정 목록
  const filteredEvents = useMemo(() => {
    return ADMISSION_EVENTS.filter((ev) => {
      // 1. 희망고교만 보기 필터
      if (wishlistOnly) {
        // 공통 필수 일정이거나, 내가 담은 학교 ID와 일치하는 경우만
        const isCommonEssential = ev.isEssential && !ev.schoolId;
        const isMySchoolEvent = ev.schoolId && wishlistIds.includes(ev.schoolId);
        if (!isCommonEssential && !isMySchoolEvent) {
          return false;
        }
      }

      // 2. 카테고리 필터
      if (selectedCategory !== '전체' && ev.category !== selectedCategory) {
        return false;
      }

      return true;
    }).sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [wishlistOnly, selectedCategory, wishlistIds]);

  // 타임라인용 월별 그룹화 (YYYY-MM 기준)
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, AdmissionEvent[]> = {};
    filteredEvents.forEach((ev) => {
      const monthKey = ev.startDate.slice(0, 7); // '2026-08'
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(ev);
    });
    return groups;
  }, [filteredEvents]);

  // 카테고리 배지 색상 매퍼
  const getCategoryBadge = (cat: EventCategory, isEssential: boolean) => {
    if (isEssential) {
      return 'bg-amber-100 text-amber-900 border-amber-200';
    }
    switch (cat) {
      case '원서접수':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case '입학설명회':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case '면접실기':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case '합격자발표':
      case '합격자등록':
        return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const categories = [
    '전체',
    '중3필수일정',
    '입학설명회',
    '원서접수',
    '면접실기',
    '합격자발표',
    '합격자등록',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 캘린더 헤더 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              서울 고입 스마트 캘린더
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            2027학년도 고입 전형 및 설명회 일정
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            교육청 공식 일정부터 담임선생님 필수 점검 일정(내신 마감, 지필평가, 추천서)까지 한눈에 확인하세요.
          </p>
        </div>

        {/* 내 희망고교만 보기 토글 버튼 (핵심 기능) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => {
              if (session.role === 'guest') {
                openAuthModal();
                return;
              }
              setWishlistOnly(!wishlistOnly);
            }}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border ${
              wishlistOnly
                ? 'bg-amber-500 border-amber-600 text-white shadow-md shadow-amber-200 scale-102'
                : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400 hover:bg-amber-50/50'
            }`}
          >
            <Star className={`w-4 h-4 ${wishlistOnly ? 'fill-white' : 'text-amber-500'}`} />
            <span>
              {wishlistOnly ? '★ 내 희망고교 일정만 보는 중' : '★ 내 희망고교 일정만 모아보기'}
            </span>
          </button>
        </div>
      </div>

      {/* 카테고리 필터 칩 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-1">일정 구분:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          조회된 일정: <strong className="text-slate-900 font-bold">{filteredEvents.length}</strong>건
        </div>
      </div>

      {/* 캘린더 안내 배너 */}
      {wishlistOnly && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{session.displayName}</strong> 님이 담아둔{' '}
              <strong>{wishlistIds.length}개 희망고교</strong>와 연결된 일정 및 중3 필수 공통 일정만 필터링하여 표시하고 있습니다.
            </span>
          </div>
          <button
            onClick={() => setWishlistOnly(false)}
            className="text-amber-700 hover:text-amber-900 underline font-semibold shrink-0 ml-3"
          >
            전체 일정으로 전환
          </button>
        </div>
      )}

      {/* 타임라인 목록 뷰 (월별 그룹화) */}
      <div className="space-y-8">
        {Object.keys(groupedByMonth).length === 0 ? (
          <div className="py-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">해당 조건의 일정이 없습니다.</h3>
            <p className="text-xs text-slate-400">
              필터 조건을 변경하거나 '전체 일정'을 선택해 보세요.
            </p>
          </div>
        ) : (
          Object.entries(groupedByMonth).map(([monthKey, events]) => {
            const [year, month] = monthKey.split('-');
            const monthLabel = `${year}년 ${parseInt(month, 10)}월`;

            return (
              <div key={monthKey} className="space-y-3">
                {/* 월 헤더 */}
                <div className="sticky top-18 z-20 bg-slate-50/90 backdrop-blur-sm py-2 flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-extrabold tracking-wide">
                    {monthLabel}
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-xs text-slate-400 font-semibold">{events.length}개 일정</span>
                </div>

                {/* 해당 월의 이벤트 카드 목록 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((ev) => {
                    const isMySchool = ev.schoolId && wishlistIds.includes(ev.schoolId);

                    return (
                      <div
                        key={ev.id}
                        onClick={() => setActiveEvent(ev)}
                        className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between group ${
                          ev.isEssential
                            ? 'border-amber-300/80 bg-gradient-to-br from-amber-50/30 to-white'
                            : isMySchool
                            ? 'border-indigo-300/80 bg-gradient-to-br from-indigo-50/20 to-white ring-1 ring-indigo-200'
                            : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          {/* 배지 행 */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getCategoryBadge(
                                  ev.category,
                                  ev.isEssential
                                )}`}
                              >
                                {ev.category}
                              </span>
                              {ev.targetCategory && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                                  {ev.targetCategory}
                                </span>
                              )}
                              {isMySchool && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  내 희망고교
                                </span>
                              )}
                            </div>

                            {ev.isEssential && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold animate-pulse">
                                ★ 담임 필수 점검
                              </span>
                            )}
                          </div>

                          {/* 타이틀 */}
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {ev.title}
                          </h3>

                          {/* 학교명 (해당시) */}
                          {ev.schoolName && (
                            <div className="text-xs font-semibold text-indigo-700 mt-1">
                              {ev.schoolName}
                            </div>
                          )}

                          {/* 상세 설명 미리보기 */}
                          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {ev.description}
                          </p>
                        </div>

                        {/* 하단 날짜 & 시간 정보 */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                          <div className="flex items-center gap-1.5 text-indigo-600">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {ev.startDate}
                              {ev.startDate !== ev.endDate && ` ~ ${ev.endDate}`}
                            </span>
                          </div>

                          <span className="text-slate-400 group-hover:text-indigo-600 text-xs flex items-center gap-0.5">
                            상세보기 <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ==================== 일정 상세 모달 ==================== */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveEvent(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
            >
              ✕
            </button>

            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getCategoryBadge(
                  activeEvent.category,
                  activeEvent.isEssential
                )}`}
              >
                {activeEvent.category}
              </span>
              {activeEvent.isEssential && (
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-xs font-extrabold">
                  담임교사 필수 일정
                </span>
              )}
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">
              {activeEvent.title}
            </h2>

            {activeEvent.schoolName && (
              <div className="text-sm font-bold text-indigo-600 mt-1">
                대상: {activeEvent.schoolName}
              </div>
            )}

            {/* 일정 기간 박스 */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                일정 진행 기간
              </div>
              <div className="text-base font-extrabold text-indigo-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>
                  {activeEvent.startDate}
                  {activeEvent.startDate !== activeEvent.endDate && ` ~ ${activeEvent.endDate}`}
                </span>
              </div>
              {activeEvent.location && (
                <div className="text-xs text-indigo-800 font-medium pt-1">
                  장소: {activeEvent.location}
                </div>
              )}
            </div>

            {/* 상세 설명 */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                안내 및 유의사항
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {activeEvent.description}
              </p>
            </div>

            {/* 공식 링크 (해당 시) */}
            {activeEvent.linkUrl && (
              <div className="mt-5">
                <a
                  href={activeEvent.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  <span>공식 공지 및 접수 사이트 바로가기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

