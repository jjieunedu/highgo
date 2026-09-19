'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  School,
  Calendar,
  Compass,
  Star,
  BookOpen,
  Users,
  Menu,
  X,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { session, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: '홈', icon: School },
    { href: '/schools', label: '고등학교 탐색', icon: Compass },
    { href: '/calendar', label: '고입 캘린더', icon: Calendar },
    { href: '/my-schools', label: '내 희망고교', icon: Star },
    { href: '/guide', label: '고입 길라잡이', icon: BookOpen },
    {
      href: '/teacher',
      label: '우리 반 현황판',
      icon: Users,
      isTeacherOnly: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                <School className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  HIGHGO
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 -mt-1 tracking-wider uppercase">
                  서울 중3 고입 길라잡이
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-xs'
                      : link.isTeacherOnly
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : ''}`} />
                  {link.label}
                  {link.isTeacherOnly && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-200 text-amber-900">
                      교사
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Session Badge & Switch Button */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={openAuthModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                session.role === 'teacher'
                  ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                  : session.role === 'student'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="코드 변경 및 역할 전환"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{session.displayName}</span>
              <RefreshCw className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openAuthModal}
              className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100"
            >
              {session.role === 'teacher'
                ? `${session.classNum}반 교사`
                : session.role === 'student'
                ? session.studentId
                : '입장'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                </div>
                {link.isTeacherOnly && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">
                    교사용
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>현재 접속: {session.displayName} (코드 변경)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

