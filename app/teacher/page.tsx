'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRoster } from '@/context/RosterContext';
import { SCHOOLS } from '@/data/schools';
import { ADMISSION_EVENTS } from '@/data/schedules';
import {
  Users,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Printer,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ExternalLink,
  MessageSquare,
  Save,
  Download,
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherPage() {
  const { session, openAuthModal } = useAuth();
  const { roster, getClassStudents, updateTeacherNote, resetRoster } = useRoster();

  // 현재 보고 있는 학급 (기본은 세션 학급 번호, 없으면 1반)
  const [selectedClass, setSelectedClass] = useState<number>(session.classNum || 1);
  const [filterType, setFilterType] = useState<'all' | 'early' | 'late' | 'none' | 'note'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savedNoteMsg, setSavedNoteMsg] = useState<string | null>(null);

  // 선택한 학급의 학생 목록
  const students = getClassStudents(selectedClass);

  // 학교 ID 맵
  const schoolMap = new Map(SCHOOLS.map((s) => [s.id, s]));

  // 통계 계산
  const totalCount = students.length;
  const withWishlistCount = students.filter((s) => s.wishlistSchoolIds.length > 0).length;
  const noWishlistCount = totalCount - withWishlistCount;

  // 전기고 지망 학생 수
  const earlySchoolStudentCount = students.filter((s) =>
    s.wishlistSchoolIds.some((id) => schoolMap.get(id)?.category === '전기고')
  ).length;

  // 후기고 지망 학생 수
  const lateSchoolStudentCount = students.filter((s) =>
    s.wishlistSchoolIds.some((id) => schoolMap.get(id)?.category === '후기고')
  ).length;

  // 필터링 적용
  const filteredStudents = students.filter((student) => {
    // 키워드 검색
    if (searchKeyword.trim()) {
      const matchId = student.studentId.includes(searchKeyword.trim());
      const matchSchool = student.wishlistSchoolIds.some((id) => {
        const sch = schoolMap.get(id);
        return sch?.name.includes(searchKeyword.trim());
      });
      if (!matchId && !matchSchool) return false;
    }

    if (filterType === 'none') {
      return student.wishlistSchoolIds.length === 0;
    }
    if (filterType === 'early') {
      return student.wishlistSchoolIds.some((id) => schoolMap.get(id)?.category === '전기고');
    }
    if (filterType === 'late') {
      return student.wishlistSchoolIds.some((id) => schoolMap.get(id)?.category === '후기고');
    }
    if (filterType === 'note') {
      return !!student.teacherNote;
    }
    return true;
  });

  const handleNoteChange = (studentId: string, val: string) => {
    setEditingNotes((prev) => ({ ...prev, [studentId]: val }));
  };

  const handleSaveNote = (studentId: string) => {
    const note = editingNotes[studentId];
    if (note !== undefined) {
      updateTeacherNote(studentId, note);
      setSavedNoteMsg(`${studentId} 상담 메모가 저장되었습니다.`);
      setTimeout(() => setSavedNoteMsg(null), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['학번', '희망고교_목록', '전기_후기구분', '상담메모'];
    const rows = students.map((s) => {
      const schoolNames = s.wishlistSchoolIds
        .map((id) => schoolMap.get(id)?.name || id)
        .join('; ');
      const categories = Array.from(
        new Set(s.wishlistSchoolIds.map((id) => schoolMap.get(id)?.category || ''))
      ).join(', ');
      return [
        s.studentId,
        `"${schoolNames}"`,
        `"${categories}"`,
        `"${s.teacherNote || ''}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `3학년_${selectedClass}반_고입희망현황_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 상단 안내 & 학급 선택 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              담임교사용 학급 고입 현황 대시보드
            </span>
            <span className="text-xs text-slate-400">
              {session.role === 'teacher' ? `접속: 30${session.classNum} 코드` : '열람 모드'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            3학년 {selectedClass}반 고입 상담 및 희망고교 관리
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            우리 반 학생(1~22번)들이 담아둔 관심 고등학교를 실시간으로 확인하고, 진학 지도 상담 메모를 기록할 수 있습니다.
          </p>
        </div>

        {/* 1~4반 탭 전환 & 액션 버튼 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {[1, 2, 3, 4].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedClass === c
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                3-{c}반
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
            title="CSV 엑셀 파일로 다운로드"
          >
            <Download className="w-3.5 h-3.5" />
            <span>엑셀(CSV)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
            title="인쇄용 출력"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>인쇄</span>
          </button>
        </div>
      </div>

      {savedNoteMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedNoteMsg}</span>
        </div>
      )}

      {/* 학급 요약 통계 지표 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">학급 총원</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalCount}<span className="text-sm font-normal text-slate-500 ml-1">명</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">1번 ~ 22번</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">희망고교 등록</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-indigo-600">
            {withWishlistCount}<span className="text-sm font-normal text-slate-500 ml-1">명</span>
          </div>
          <div className="mt-1 text-xs text-indigo-500 font-medium">
            전체 대비 {Math.round((withWishlistCount / totalCount) * 100)}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">전기고 지망</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-purple-700">
            {earlySchoolStudentCount}<span className="text-sm font-normal text-slate-500 ml-1">명</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">과고·마이스터·특성화</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">후기고 지망</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-700">
            {lateSchoolStudentCount}<span className="text-sm font-normal text-slate-500 ml-1">명</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">일반고·자사고·외고</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">미선택 (상담 필요)</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-700">
            {noWishlistCount}<span className="text-sm font-normal text-slate-500 ml-1">명</span>
          </div>
          <div className="mt-1 text-xs text-amber-700/80 font-medium">진로 상담 우선 대상</div>
        </div>
      </div>

      {/* 필터 및 검색 컨트롤 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            전체 ({students.length})
          </button>
          <button
            onClick={() => setFilterType('early')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'early'
                ? 'bg-purple-600 text-white'
                : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
            }`}
          >
            전기고 지망 ({earlySchoolStudentCount})
          </button>
          <button
            onClick={() => setFilterType('late')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'late'
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            후기고 지망 ({lateSchoolStudentCount})
          </button>
          <button
            onClick={() => setFilterType('none')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'none'
                ? 'bg-amber-600 text-white'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            미선택 학생 ({noWishlistCount})
          </button>
          <button
            onClick={() => setFilterType('note')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'note'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            상담 메모 있음
          </button>
        </div>

        {/* 검색 인풋 */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="학번 또는 학교명 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 학생 목록 테이블 */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 sm:px-6 w-28">학번 / 학생</th>
                <th className="py-3.5 px-4 w-40">전형 구분</th>
                <th className="py-3.5 px-4 min-w-[280px]">선택한 희망고교</th>
                <th className="py-3.5 px-4 min-w-[260px]">담임 상담 메모</th>
                <th className="py-3.5 px-4 w-24 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    조건에 해당하는 학생이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const studentSchools = student.wishlistSchoolIds
                    .map((id) => schoolMap.get(id))
                    .filter(Boolean);

                  const hasEarly = studentSchools.some((s) => s?.category === '전기고');
                  const hasLate = studentSchools.some((s) => s?.category === '후기고');
                  const currentNote =
                    editingNotes[student.studentId] !== undefined
                      ? editingNotes[student.studentId]
                      : student.teacherNote || '';

                  return (
                    <tr
                      key={student.studentId}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* 1. 학번 */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="font-extrabold text-slate-900 text-sm">
                          {student.studentId}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {student.studentNum}번 학생
                        </div>
                      </td>

                      {/* 2. 전형 구분 태그 */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1 items-start">
                          {studentSchools.length === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
                              <AlertCircle className="w-3 h-3" />
                              미선택
                            </span>
                          ) : (
                            <>
                              {hasEarly && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[11px] font-bold">
                                  전기고 지망
                                </span>
                              )}
                              {hasLate && (
                                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                                  후기고 지망
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                      {/* 3. 희망고교 리스트 칩 */}
                      <td className="py-4 px-4 align-top">
                        {studentSchools.length === 0 ? (
                          <span className="text-slate-400 text-xs italic">
                            아직 담아둔 학교가 없습니다.
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {studentSchools.map((school) => {
                              if (!school) return null;
                              const isEarly = school.category === '전기고';
                              return (
                                <div
                                  key={school.id}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
                                    isEarly
                                      ? 'bg-purple-50/60 border-purple-200 text-purple-900'
                                      : 'bg-blue-50/60 border-blue-200 text-blue-900'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isEarly ? 'bg-purple-500' : 'bg-blue-500'
                                    }`}
                                  />
                                  <span>{school.name}</span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    ({school.type})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      {/* 4. 상담 메모 입력창 */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="상담 메모 (예: 특성화 포트폴리오 준비 중)"
                            value={currentNote}
                            onChange={(e) => handleNoteChange(student.studentId, e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {editingNotes[student.studentId] !== undefined &&
                            editingNotes[student.studentId] !== (student.teacherNote || '') && (
                              <button
                                onClick={() => handleSaveNote(student.studentId)}
                                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                                title="저장"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>저장</span>
                              </button>
                            )}
                        </div>
                      </td>

                      {/* 5. 학생 시점 전환 */}
                      <td className="py-4 px-4 align-top text-right">
                        <button
                          onClick={() => {
                            // 이 학생 권한으로 원클릭 로그인 전환하여 학생 화면 점검
                            const code = student.studentId;
                            session.role = 'student';
                            session.studentId = code;
                            session.code = code;
                            session.displayName = `${code} 학생`;
                            window.location.href = `/my-schools`;
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                          title="이 학생의 마이페이지 화면으로 이동"
                        >
                          <span>확인</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 안내 박스 */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800">
            📌 담임선생님을 위한 고입 지도 팁
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            - 전기고등학교(마이스터, 특성화, 과고)는 전국 1곳만 지원 가능합니다. 복수 지원하지 않도록 확인해 주세요.<br/>
            - 학생이 스마트폰에서 희망고교를 변경하면 새로고침 시 이 대시보드에 즉시 반영됩니다.
          </p>
        </div>
        <button
          onClick={resetRoster}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 underline shrink-0"
        >
          초기 샘플 데이터로 복원
        </button>
      </div>
    </div>
  );
}

