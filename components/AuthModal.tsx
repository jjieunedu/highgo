'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, GraduationCap, School, User, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithCode, session } = useAuth();
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (codeToUse?: string) => {
    const code = (codeToUse || inputCode).trim();
    if (!code) {
      setErrorMsg('코드를 입력해주세요.');
      return;
    }
    const res = loginWithCode(code);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setErrorMsg('');
      setInputCode('');
    }
  };

  const handleTeacherClick = (code: string) => {
    handleSubmit(code);
  };

  const handleStudentQuickClick = (studentId: string) => {
    handleSubmit(studentId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* 상단 닫기 (게스트 모드 유지 가능한 경우) */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          title="닫기"
        >
          ✕
        </button>

        {/* 로고 및 헤더 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-inner">
            <School className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">HIGHGO 시작하기</h2>
          <p className="text-sm text-slate-500 mt-1">
            서울 중3 학생과 담임선생님을 위한 스마트 고입 정보 서비스
          </p>
        </div>

        {/* 교사 / 학생 탭 선택 */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setErrorMsg('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'student'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            중3 학생 입장
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setErrorMsg('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'teacher'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            담임교사 입장
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. 학생 탭 */}
        {activeTab === 'student' && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              본인의 5자리 학번을 입력하세요
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="예: 30101, 30205"
                maxLength={5}
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.replace(/[^0-9]/g, ''));
                  setErrorMsg('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
              >
                입장하기
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-4">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  빠른 테스트 샘플 학번 클릭:
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleStudentQuickClick('30101')}
                  className="px-3 py-2 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all text-center"
                >
                  30101 (과고/용산)
                </button>
                <button
                  type="button"
                  onClick={() => handleStudentQuickClick('30105')}
                  className="px-3 py-2 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all text-center"
                >
                  30105 (선린인터넷)
                </button>
                <button
                  type="button"
                  onClick={() => handleStudentQuickClick('30116')}
                  className="px-3 py-2 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all text-center"
                >
                  30116 (미선택)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. 교사 탭 */}
        {activeTab === 'teacher' && (
          <div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                담당 학급의 코드를 선택하거나 입력하세요
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleTeacherClick('301')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all group"
                >
                  <div className="text-xs font-medium text-slate-400 group-hover:text-indigo-600">
                    3학년 1반
                  </div>
                  <div className="text-base font-bold text-slate-800 group-hover:text-indigo-900">
                    코드: 301
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTeacherClick('302')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all group"
                >
                  <div className="text-xs font-medium text-slate-400 group-hover:text-indigo-600">
                    3학년 2반
                  </div>
                  <div className="text-base font-bold text-slate-800 group-hover:text-indigo-900">
                    코드: 302
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTeacherClick('303')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all group"
                >
                  <div className="text-xs font-medium text-slate-400 group-hover:text-indigo-600">
                    3학년 3반
                  </div>
                  <div className="text-base font-bold text-slate-800 group-hover:text-indigo-900">
                    코드: 303
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTeacherClick('304')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all group"
                >
                  <div className="text-xs font-medium text-slate-400 group-hover:text-indigo-600">
                    3학년 4반
                  </div>
                  <div className="text-base font-bold text-slate-800 group-hover:text-indigo-900">
                    코드: 304
                  </div>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="3자리 코드 직접 입력 (301~304)"
                  maxLength={3}
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.replace(/[^0-9]/g, ''));
                    setErrorMsg('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  직접 입력 입장
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 leading-relaxed">
              💡 교사 코드로 진입하시면 해당 반 1~22번 학생들의 희망고교 선택 현황과 상담 대시보드를
              열람하실 수 있습니다.
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">개인정보는 절대 수집되지 않습니다.</span>
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
          >
            로그인 없이 둘러보기
          </button>
        </div>
      </div>
    </div>
  );
}

