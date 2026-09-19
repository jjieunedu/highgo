'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserSession } from '@/types';

interface AuthContextType {
  session: UserSession;
  loginWithCode: (code: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const DEFAULT_SESSION: UserSession = {
  role: 'guest',
  code: '',
  displayName: '게스트 (둘러보기)',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@highgo/session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession>(DEFAULT_SESSION);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSession(JSON.parse(saved));
      } else {
        // 첫 방문 시 코드 입력 모달 띄우기
        setIsAuthModalOpen(true);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const loginWithCode = (rawCode: string): { success: boolean; message: string } => {
    const code = rawCode.trim();

    // 1. 교사 코드 체크 (301, 302, 303, 304)
    if (['301', '302', '303', '304'].includes(code)) {
      const classNum = parseInt(code.charAt(2), 10);
      const newSession: UserSession = {
        role: 'teacher',
        code,
        classNum,
        displayName: `3학년 ${classNum}반 담임교사`,
      };
      setSession(newSession);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      }
      setIsAuthModalOpen(false);
      return { success: true, message: `3학년 ${classNum}반 담임교사 권한으로 접속되었습니다.` };
    }

    // 2. 학생 학번 체크 (예: 30101 ~ 30422 또는 5자리 학번)
    const studentRegex = /^30[1-4]\d{2}$/;
    if (studentRegex.test(code)) {
      const classNum = parseInt(code.charAt(2), 10);
      const studentNum = parseInt(code.slice(3), 10);
      const newSession: UserSession = {
        role: 'student',
        code,
        classNum,
        studentId: code,
        displayName: `${code} 학생`,
      };
      setSession(newSession);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      }
      setIsAuthModalOpen(false);
      return { success: true, message: `${code} 학생으로 접속되었습니다.` };
    }

    return {
      success: false,
      message: '유효한 코드가 아닙니다. 교사는 301~304, 학생은 5자리 학번(예: 30101)을 입력해주세요.',
    };
  };

  const logout = () => {
    setSession(DEFAULT_SESSION);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        session,
        loginWithCode,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

