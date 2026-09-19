'use client';

import React, { useState, useMemo } from 'react';
import { GUIDE_TOPICS } from '@/data/guides';
import { ATHLETIC_SPECIALTY_SCHOOLS } from '@/data/athleticSpecialty';
import ScoreCalculator from '@/components/ScoreCalculator';
import {
  BookOpen,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sparkles,
  Trophy,
  Award,
  Layers,
  FileText,
  AlertTriangle,
  Search,
  Building,
  CheckCircle,
} from 'lucide-react';

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'2027new' | 'calculator' | 'allocation' | 'personal-statement' | 'sports' | 'faq'>('2027new');
  const [openTopicId, setOpenTopicId] = useState<string>('guide-2027-new-rules');

  // 체육특기자 검색 필터
  const [selectedSport, setSelectedSport] = useState<string>('전체');
  const [selectedOffice, setSelectedOffice] = useState<string>('전체');

  // 종목 목록 추출
  const sportCategories = useMemo(() => {
    const list = Array.from(new Set(ATHLETIC_SPECIALTY_SCHOOLS.map((s) => s.sportCategory))).sort();
    return ['전체', ...list];
  }, []);

  // 교육청 목록 추출
  const officeList = useMemo(() => {
    const list = Array.from(new Set(ATHLETIC_SPECIALTY_SCHOOLS.map((s) => s.educationOffice))).sort();
    return ['전체', ...list];
  }, []);

  // 필터링된 체육특기자 학교
  const filteredSportsSchools = useMemo(() => {
    return ATHLETIC_SPECIALTY_SCHOOLS.filter((s) => {
      if (selectedSport !== '전체' && s.sportCategory !== selectedSport) return false;
      if (selectedOffice !== '전체' && s.educationOffice !== selectedOffice) return false;
      return true;
    });
  }, [selectedSport, selectedOffice]);

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
            2027 서울 고입 공식 종합 가이드
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            2027학년도 서울특별시 고입전형 기본계획 & 배정 지침
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            서울특별시교육청 공식 공고(제2026-318호/319호)에 기반하여 신설된 다자녀 동일교 배정, 100점 만점 내신 산출기, 자사고·외고 자기소개서 감점 기준을 안내합니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
          {[
            { id: '2027new', label: '🌟 2027 주요 변경사항', icon: Sparkles },
            { id: 'calculator', label: '📊 고입 내신 계산기', icon: Award },
            { id: 'allocation', label: '🎯 고교선택제 배정공식', icon: Layers },
            { id: 'personal-statement', label: '📝 자기소개서 0점·감점 기준', icon: FileText },
            { id: 'sports', label: '🏅 체육특기자 배정 고교', icon: Trophy },
            { id: 'faq', label: '💬 용어사전 & FAQ', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== 탭 1: 2027 주요 변경 사항 ==================== */}
      {activeTab === '2027new' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. 다자녀 동일교 배정 */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-white to-emerald-50 rounded-3xl p-6 border border-emerald-200 space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold">
                2027학년도 최초 시행
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                다자녀(3자녀 이상) 동일교 배정 제도
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                다자녀 가정의 둘째 자녀부터, 형제·자매·남매가 고1 또는 고2에 재학 중인 동일 고등학교로 배정을 희망하면 <strong>동일교로 우선 배정</strong>받을 수 있습니다.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-800">
                ※ 첫째 자녀는 일반배정 대상 / 신청서 및 재학증명서 제출 필요
              </div>
            </div>

            {/* 2. 중증 장애학생 형제 동일교 배정 */}
            <div className="bg-gradient-to-br from-blue-500/10 via-white to-blue-50 rounded-3xl p-6 border border-blue-200 space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-extrabold">
                2027학년도 최초 시행
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                중증 장애학생 형제·자매 동일교 배정
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                장애 정도가 심한 장애학생이 고1 또는 고2로 재학 중인 경우, 그 형제·자매·남매가 동일교 배정을 희망하면 <strong>동일교 우선 배정</strong> 혜택을 부여합니다.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-blue-800">
                ※ 통학 지원 및 가족 돌봄 부담 완화 목적
              </div>
            </div>

            {/* 3. 서울반도체고 개교 & 남녀공학 전환 */}
            <div className="bg-gradient-to-br from-purple-500/10 via-white to-purple-50 rounded-3xl p-6 border border-purple-200 space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[11px] font-extrabold">
                학교 신설 및 전환
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                서울반도체고 마이스터고 개교 확정
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                서울반도체고가 2027년 3월 마이스터고로 공식 개교하며(서울 총 5교), 무학여고는 남녀공학으로 전환 예정이고 흑석고가 동작구에 신설 개교합니다.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-purple-800">
                ※ 청담고는 서초구 잠원동으로 최첨단 신축 이전
              </div>
            </div>
          </div>

          {/* 전기고 vs 후기고 개괄 카드 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              서울 고등학교 전·후기 전형 체계 요약 (총 319교)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                <span className="font-extrabold text-purple-900 text-sm">전기고등학교 (총 83교)</span>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  <li>영재학교(1교: 서울과학고)</li>
                  <li>특목고(과학계열 2교: 한성과고, 세종과고)</li>
                  <li>특목고(예술계열 6교, 체육계열 1교: 서울체고)</li>
                  <li>마이스터고(5교: 서울로봇고, 미림마이스터고, 수도전기공고, 서울도시과학기술고, 신설 서울반도체고)</li>
                  <li>특성화고(67교: 선린인터넷고, 서울디지텍고 등)</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                <span className="font-extrabold text-blue-900 text-sm">후기고등학교 (총 236교)</span>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  <li>교육감 선발 일반고(212교) 및 제3기 과학중점학급(22교)</li>
                  <li>특목고(외국어계열 6교: 대원·대일·명덕·서울·이화·한영)</li>
                  <li>특목고(국제계열 1교: 서울국제고 - 사회통합 40% 의무선발)</li>
                  <li>자율형사립고(15교: 하나고, 중동고, 현대고, 배재고, 이화여고 등)</li>
                  <li>학교장 선발 일반고(2교: 한광고, 한국삼육고)</li>
                  <li>예술·체육중점학급(4교: 대원여고·영신여고 음악, 송곡여고 미술, 송곡고 체육)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 탭 2: 내신 계산기 ==================== */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <ScoreCalculator />
        </div>
      )}

      {/* ==================== 탭 3: 고교선택제 배정 공식 ==================== */}
      {activeTab === 'allocation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              서울 후기 일반고 '고교선택제' 3단계 배정 공식
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              서울시 후기 일반고(212교)는 학생의 학교 선택권을 보장하는 3단계 '선지원 후추첨' 방식으로 배정됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-indigo-700 text-sm">1단계 (20% 배정)</span>
                <span className="px-2 py-0.5 rounded bg-indigo-200 text-indigo-900 font-bold text-[10px]">
                  단일학교군
                </span>
              </div>
              <div className="font-bold text-slate-800 text-sm">서울 전역에서 2개교 선택</div>
              <p className="text-slate-600 leading-relaxed">
                거주지에 구애받지 않고 서울시 전체 212개 일반고 중 서로 다른 2개교를 지원합니다. 학교별 입학정원의 20%(중부학교군은 60%)를 지망 순위별 전산추첨으로 배정합니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-700 text-sm">2단계 (40% 배정)</span>
                <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-bold text-[10px]">
                  일반학교군
                </span>
              </div>
              <div className="font-bold text-slate-800 text-sm">거주지 학군 내에서 2개교 선택</div>
              <p className="text-slate-600 leading-relaxed">
                자신이 거주하는 자치구 교육지원청 관할 학교군(총 11개 학군) 내의 일반고 중 2개교를 지원합니다. 입학정원의 40%를 전산추첨 배정합니다. (1단계 지망교 중복 가능)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-700 text-sm">3단계 (40% 배정)</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">
                  통합학교군
                </span>
              </div>
              <div className="font-bold text-slate-800 text-sm">통학 편의 고려 통합 추첨</div>
              <p className="text-slate-600 leading-relaxed">
                1·2단계에서 배정되지 않은 학생을 대상으로 1·2단계 지원 사항과 대중교통 통학 편의, 종교, 학교별 수용 여건을 종합 고려하여 인접 19개 통합학교군 범위 내에서 최종 배정합니다.
              </p>
            </div>
          </div>

          {/* 학교군 안내 표 */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">
              서울시 11개 일반학교군(거주지 학군) 현황
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {[
                { name: '중부', dist: '종로구, 중구, 용산구' },
                { name: '동부', dist: '동대문구, 중랑구' },
                { name: '서부', dist: '마포구, 서대문구, 은평구' },
                { name: '남부', dist: '영등포구, 구로구, 금천구' },
                { name: '북부', dist: '노원구, 도봉구' },
                { name: '강동송파', dist: '강동구, 송파구' },
                { name: '강서양천', dist: '강서구, 양천구' },
                { name: '강남서초', dist: '강남구, 서초구' },
                { name: '동작관악', dist: '동작구, 관악구' },
                { name: '성동광진', dist: '성동구, 광진구' },
                { name: '성북강북', dist: '강북구, 성북구' },
              ].map((item) => (
                <div key={item.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-indigo-700">{item.name}학교군</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.dist}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 탭 4: 자기소개서 배제 사항 ==================== */}
      {activeTab === 'personal-statement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                자기주도학습전형 필수 준수사항
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                외고·국제고·자사고 자기소개서 작성 시 배제 사항 (0점 및 감점 기준)
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                공교육 정상화 촉진 및 선행학습 규제 특별법에 의거하여, 사교육 유발 요인이나 부모의 지위를 암시할 경우 즉시 0점 또는 10~20% 감점 처리됩니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* 0점 처리 항목 */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">✕</span>
                기재 시 즉시 0점 처리 항목
              </div>
              <ul className="space-y-2 text-slate-700 leading-relaxed list-disc list-inside">
                <li><strong>공인어학시험 성적 및 수상 실적:</strong> TOEIC, TOEFL, TEPS, HSK, JLPT, 한국어·한자능력검정 등</li>
                <li><strong>교내·외 각종 경시대회:</strong> 올림피아드(KMO 등), 교내·외 교과 및 비교과 경시대회 입상 실적</li>
                <li><strong>교외 수상 실적:</strong> 교외 기관·단체장 표창장, 감사장, 공로상 등</li>
                <li><strong>교내·외 인증시험:</strong> 각종 자격증 취득 사실 및 인증 점수</li>
                <li><strong>영재교육원:</strong> 영재교육원 교육 및 수료 여부</li>
                <li><strong>교과 성적:</strong> 교과목의 원점수, 성취도, 석차, 전교 등수 등</li>
                <li><strong>논문 및 출간:</strong> 학회지 논문 투고, 도서 출간, 지식재산권(특허, 실용신안) 등록</li>
              </ul>
            </div>

            {/* 감점 처리 항목 */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">!</span>
                기재 시 10~20% 감점 처리 항목
              </div>
              <ul className="space-y-2 text-slate-700 leading-relaxed list-disc list-inside">
                <li><strong>부모·친인척 사회경제적 지위 암시:</strong> 구체적인 직종명, 직업명, 직장명, 직위명(검사장, 대학교수 등), 소득수준</li>
                <li><strong>고비용 사교육 취미활동:</strong> 골프, 승마 등 또는 학교 주관 외 사설 기관 프로젝트</li>
                <li><strong>장학금 수혜:</strong> 장학생 선발 및 장학금 수혜 내역</li>
                <li><strong>특정 명칭 노출:</strong> 구체적인 대학명, 기관명, 상호명, 유명 강사명</li>
                <li><strong>본인 인적사항 암시:</strong> 지원자 이름, 출신 중학교명(방송반, 학생회 활동 중 학교명 암시 포함)</li>
                <li><strong>해외 활동 실적:</strong> 어학연수, 해외 봉사활동 등 해외 실적</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">💡 올바른 자기소개서 작성 팁</div>
            <div>학교생활기록부에 기반하여 지원 학교의 건학이념과 연계된 <strong>자기주도학습 과정(학습 목표, 실천, 성장)</strong>과 <strong>인성 영역(배려, 나눔, 협력, 타인 존중)</strong>을 진솔하게 자신의 언어로 서술하세요. (외고·국제고 1,500자 이내 / 자사고 1,200자 이내, 하나고 1,500자)</div>
          </div>
        </div>
      )}

      {/* ==================== 탭 5: 체육특기자 배정 고교 ==================== */}
      {activeTab === 'sports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5 w-fit">
                <Trophy className="w-3.5 h-3.5" />
                2027 후기 일반고 체육특기자
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                체육특기자 배정 요청 고등학교 목록
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                서울특별시교육청 선발 후기 일반고 중 체육특기자 배정을 요청한 고등학교와 종목별 정원 현황입니다.
              </p>
            </div>

            {/* 필터 */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {sportCategories.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp === '전체' ? '전체 종목' : sp}
                  </option>
                ))}
              </select>

              <select
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {officeList.map((of) => (
                  <option key={of} value={of}>
                    {of === '전체' ? '전체 학교군' : `${of}교육청`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 종목별 고교 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSportsSchools.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                      {item.sportCategory}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.educationOffice}청 · {item.foundation}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{item.schoolName}</h4>
                  <div className="text-[11px] text-slate-600 mt-1">{item.sportDetail}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400">요청 인원</div>
                  <div className="text-base font-black text-indigo-600">
                    {item.quotaTotal}명
                  </div>
                  <div className="text-[10px] text-slate-500">
                    (남 {item.quotaMale} / 여 {item.quotaFemale})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 탭 6: 용어사전 & FAQ ==================== */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            고입 자주 묻는 질문 & 용어 해설
          </h2>

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
                        {topic.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                            {topic.badge}
                          </span>
                        )}
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
      )}

      {/* 하단 공식 포털 링크 */}
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
            공식 모집요강 전문, 학교알리미 공시 정보, 2027학년도 서울특별시 고등학교 입학전형 기본계획 공고(제2026-318호/319호) 전문을 직접 확인하실 수 있습니다.
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
