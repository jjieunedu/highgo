'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Award, Calendar, CheckCircle2, HelpCircle } from 'lucide-react';

export default function ScoreCalculator() {
  // 교과 입력 상태 (2, 3학년 4개 학기 총 이수과목수 및 E/C 개수)
  const [totalSubjects, setTotalSubjects] = useState<number>(38); // 일반 중학교 2~3학년 평균 약 38~40과목
  const [lowestGradeSubjects, setLowestGradeSubjects] = useState<number>(0); // E(5단계) 또는 C(3단계) 받은 과목 수

  // 출결 입력 상태 (1~3학년 전 학년 미인정)
  const [absentDays, setAbsentDays] = useState<number>(0); // 미인정 결석일
  const [tardyCount, setTardyCount] = useState<number>(0); // 미인정 지각·조퇴·결과 횟수

  // 출결 계산: 미인정 지각·조퇴·결과 3회 = 결석 1일 (2회 이하 버림)
  const convertedAbsentDays = useMemo(() => {
    const fromTardy = Math.floor(tardyCount / 3);
    const total = absentDays + fromTardy;
    return Math.min(100, Math.max(0, total));
  }, [absentDays, tardyCount]);

  // 점수 계산 공식:
  // 1. 교과 점수 (최고 80점) = (1 - 최하위성취도과목수 / 총이수과목수) * 80 (소수점 4자리 반올림, 3자리 표기)
  const academicScore = useMemo(() => {
    if (totalSubjects <= 0) return 0;
    const clampedLowest = Math.min(totalSubjects, Math.max(0, lowestGradeSubjects));
    const raw = (1 - clampedLowest / totalSubjects) * 80;
    return Math.round(raw * 1000) / 1000;
  }, [totalSubjects, lowestGradeSubjects]);

  // 2. 출결 점수 (최고 20점) = 20 - (결석일수 * 0.2)
  const attendanceScore = useMemo(() => {
    const raw = 20 - convertedAbsentDays * 0.2;
    return Math.max(0, Math.round(raw * 10) / 10);
  }, [convertedAbsentDays]);

  // 3. 고입전형 총점 = 교과(80점) + 출결(20점) = 100점 만점
  const totalScore = useMemo(() => {
    return Math.round((academicScore + attendanceScore) * 1000) / 1000;
  }, [academicScore, attendanceScore]);

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/40 rounded-3xl p-6 sm:p-8 border border-indigo-200/80 shadow-sm space-y-6">
      {/* 타이틀 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5" />
            2027학년도 공식 산출식 적용
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            서울시교육청 고입전형 중학교 성적 모의 계산기 (100점 만점)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            서울시교육청 고입전형 기본계획 [붙임 3] 지침에 따라 <strong>교과(80점) + 출결(20점)</strong>을 실시간 자동 환산합니다.
          </p>
        </div>

        {/* 최종 점수 디스플레이 카드 */}
        <div className="p-4 rounded-2xl bg-white border-2 border-indigo-500 shadow-md flex items-center justify-between sm:justify-end gap-6 shrink-0">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              고입 환산 총점
            </div>
            <div className="text-3xl font-black text-indigo-600">
              {totalScore.toFixed(3)}
              <span className="text-sm font-bold text-slate-400 ml-1">/ 100점</span>
            </div>
          </div>
          <div className="text-right text-xs space-y-0.5 text-slate-500 border-l border-slate-100 pl-4">
            <div>교과: <strong className="text-slate-800">{academicScore.toFixed(3)}</strong>점</div>
            <div>출결: <strong className="text-slate-800">{attendanceScore.toFixed(1)}</strong>점</div>
          </div>
        </div>
      </div>

      {/* 입력 폼 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. 교과 점수 영역 (80점) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                A
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">
                교과 학습발달상황 점수 (배점 80점)
              </h4>
            </div>
            <span className="text-xs font-bold text-indigo-600">{academicScore.toFixed(3)}점</span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
            중학교 2, 3학년 4개 학기 동안 이수한 과목 중 <strong>최하위 성취도(E 또는 C)</strong>를 받은 과목 수로 산출합니다. (원점수, 평균은 미반영)
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                <span>총 이수 과목수 (2·3학년 전체)</span>
                <span className="text-indigo-600 font-extrabold">{totalSubjects}과목</span>
              </label>
              <input
                type="range"
                min="30"
                max="46"
                value={totalSubjects}
                onChange={(e) => setTotalSubjects(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>30과목</span>
                <span className="text-slate-500">평균 약 38과목</span>
                <span>46과목</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                <span>최하위 성취도(E 또는 C) 과목수</span>
                <span className="text-rose-600 font-extrabold">{lowestGradeSubjects}과목</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={totalSubjects}
                  value={lowestGradeSubjects}
                  onChange={(e) => setLowestGradeSubjects(Math.max(0, Number(e.target.value)))}
                  className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                />
                <span className="text-xs text-slate-500">
                  {lowestGradeSubjects === 0 ? '✨ 최하위 성취도 없음 (교과 80점 만점!)' : `(E/C 과목당 약 ${(80 / totalSubjects).toFixed(2)}점 감점)`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 출결 점수 영역 (20점) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                B
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">
                출결상황 점수 (배점 20점)
              </h4>
            </div>
            <span className="text-xs font-bold text-blue-600">{attendanceScore.toFixed(1)}점</span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
            중학교 1, 2, 3학년 전 학년의 <strong>미인정(무단) 결석일수</strong>를 반영합니다. (질병 및 기타 사유 결석은 계산에서 제외)
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                미인정 결석 일수
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={absentDays}
                  onChange={(e) => setAbsentDays(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
                <span className="text-xs text-slate-400 shrink-0">일</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                미인정 지각·조퇴·결과
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={tardyCount}
                  onChange={(e) => setTardyCount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
                <span className="text-xs text-slate-400 shrink-0">회</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
            <span>환산 결석일수: <strong>{convertedAbsentDays}일</strong> (지각 3회당 1일)</span>
            <span className="text-blue-600 font-bold">결석 1일당 -0.2점</span>
          </div>
        </div>
      </div>

      {/* 안내 각주 */}
      <div className="flex items-start gap-2 p-3 bg-indigo-50/60 rounded-xl text-[11px] text-indigo-900">
        <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>성적 산출 기준일:</strong> 2026. 11. 13.(금) | 본 산출 지침은 서울특별시 특성화고 일반전형 및 교육감 선발 후기고등학교(일반고, 과학중점학급) 신입생 선발에 공식 적용됩니다.
        </div>
      </div>
    </div>
  );
}
