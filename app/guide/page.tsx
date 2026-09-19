'use client';

import React, { useState } from 'react';
import { GUIDE_TOPICS } from '@/data/guides';
import {
  BookOpen,
  Info,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function GuidePage() {
  const [openTopicId, setOpenTopicId] = useState<string>('guide-category-diff');

  const toggleTopic = (id: string) => {
    setOpenTopicId(openTopicId === id ? '' : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 헤더 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="max-w-3xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1.5 w-fit">
            <BookOpen className="w-3.5 h-3.5" />
            고입 길라잡이
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            알기 쉬운 서울 고입 전형 안내 & 용어 사전
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            중학교 3학년 학생들이 가장 헷갈려하는 전기고/후기고의 차이점, 이중지원 금지 원칙, 고교선택제 배정 방식을 친절하게 설명해 드립니다.
          </p>
        </div>
      </div>

      {/* ==================== 1. 전기고 vs 후기고 한눈에 비교 인포그래픽 ==================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-sm">
            1
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">
            서울 고입 한눈에 이해하기: 전기고 vs 후기고
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 전기고 카드 */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30 border border-purple-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-extrabold">
                전기고등학교 (8월 ~ 11월)
              </span>
              <span className="text-xs font-bold text-purple-700">먼저 전형 실시</span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-purple-950">
                특수 목적 및 직업 전문 교육 학교
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                학생의 적성과 특기를 살려 수학·과학, 로봇, IT소프트웨어, 예술, 체육 등을 전문적으로 배우는 학교군입니다.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-bold text-slate-700">해당 학교 유형:</div>
              <div className="flex flex-wrap gap-1.5">
                {['과학고', '마이스터고', '특성화고(일반/특별)', '예술고', '체육고'].map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-900 text-xs font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 font-medium leading-relaxed">
              <strong>⚠️ 이중지원 절대 금지:</strong> 전국 전기고 중 <strong>오직 1곳만</strong> 지원 가능합니다. 2개 이상 접수 시 합격이 모두 취소됩니다.
            </div>
          </div>

          {/* 후기고 카드 */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 border border-blue-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold">
                후기고등학교 (12월 초)
              </span>
              <span className="text-xs font-bold text-blue-700">동시 전형 실시</span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-blue-950">
                일반계 및 자율형·외국어 교육 학교
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                교육감 선발 후기 일반고(고교선택제)와 자기주도학습 전형으로 선발하는 자사고, 외고, 국제고가 해당합니다.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-bold text-slate-700">해당 학교 유형:</div>
              <div className="flex flex-wrap gap-1.5">
                {['일반고등학교', '자율형공립고', '자율형사립고(자사고)', '외국어고', '국제고'].map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-900 text-xs font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium leading-relaxed">
              <strong>💡 자사고·외고·국제고 동시지원:</strong> 자사고나 외고에 지원하더라도 일반고 2단계(거주지 학군)에 동시 지원할 수 있어 안전합니다.
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 2. 서울 후기 일반고 배정 3단계 시각화 ==================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-sm">
            2
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">
            서울 후기 일반고 '고교선택제' 3단계 배정 공식
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-indigo-600 text-sm">1단계 (20% 배정)</span>
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                단일학교군
              </span>
            </div>
            <div className="font-bold text-slate-800 text-sm">서울 전역에서 2개교 선택</div>
            <p className="text-slate-600 leading-relaxed">
              거주지와 상관없이 서울시 전체 후기 일반고 중 서로 다른 2개교를 지망 순위로 지원하여 추첨 배정합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-indigo-600 text-sm">2단계 (40% 배정)</span>
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                일반학교군
              </span>
            </div>
            <div className="font-bold text-slate-800 text-sm">거주지 학군 내에서 2개교 선택</div>
            <p className="text-slate-600 leading-relaxed">
              자신이 살고 있는 자치구 교육지원청 관할 학교군(예: 중부학교군 등) 내의 일반고 중 2개교를 지원합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-indigo-600 text-sm">3단계 (40% 배정)</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                통합학교군
              </span>
            </div>
            <div className="font-bold text-slate-800 text-sm">통학 편의 고려 통합 추첨</div>
            <p className="text-slate-600 leading-relaxed">
              1, 2단계에서 미배정된 학생들을 대상으로 1·2단계 지망 사항과 대중교통 통학 편의를 고려하여 최종 배정합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 3. 아코디언형 상세 가이드 & 용어 사전 ==================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-sm">
            3
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">
            고입 자주 묻는 질문 & 용어 해설
          </h2>
        </div>

        <div className="space-y-3">
          {GUIDE_TOPICS.map((topic) => {
            const isOpen = openTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {topic.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {topic.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{topic.summary}</p>
                  </div>

                  <div className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {topic.content.map((paragraph, idx) => (
                      <p key={idx} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}

                    {topic.tips && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold">
                        {topic.tips}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== 4. 서울시교육청 공식 링크 배너 ==================== */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200">
            <Info className="w-3.5 h-3.5" />
            서울시교육청 공식 정보 포털
          </div>
          <h3 className="text-xl font-extrabold">
            서울특별시교육청 고입포털 '하이인포(Highinfo)'
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            공식 모집요강 원문, 학교알리미 공시 정보, 전년도 고입전형 기본계획 전문을 직접 확인하실 수 있습니다.
          </p>
        </div>

        <a
          href="https://hinfo.sen.go.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 font-extrabold text-xs transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <span>하이인포 바로가기</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

