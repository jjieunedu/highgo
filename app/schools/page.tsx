'use client';

import React, { useState, useMemo } from 'react';
import { SCHOOLS } from '@/data/schools';
import { ADMISSION_EVENTS } from '@/data/schedules';
import { School, SchoolCategory, SchoolType, GenderType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRoster } from '@/context/RosterContext';
import {
  Search,
  Filter,
  Star,
  ExternalLink,
  MapPin,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  Sparkles,
  Check,
  X,
  Bed,
} from 'lucide-react';

export default function SchoolsPage() {
  const { session, openAuthModal } = useAuth();
  const { getStudentRecord, toggleWishlist } = useRoster();

  // 검색 및 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'전체' | SchoolCategory>('전체');
  const [selectedType, setSelectedType] = useState<string>('전체');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('전체');
  const [selectedGender, setSelectedGender] = useState<string>('전체');
  const [dormitoryOnly, setDormitoryOnly] = useState(false);

  // 학교 상세 모달 상태
  const [detailSchool, setDetailSchool] = useState<School | null>(null);

  // 현재 로그인된 학생의 찜 목록 가져오기
  const currentStudentId = session.role === 'student' ? session.studentId : undefined;
  const currentStudent = currentStudentId ? getStudentRecord(currentStudentId) : undefined;
  const wishlistIds = currentStudent?.wishlistSchoolIds || [];

  // 서울시 25개 자치구 목록 추출
  const districts = useMemo(() => {
    const list = Array.from(new Set(SCHOOLS.map((s) => s.district))).sort();
    return ['전체', ...list];
  }, []);

  // 학교 유형 목록
  const schoolTypes = [
    '전체',
    '일반고',
    '과학고',
    '마이스터고',
    '특성화고',
    '자율형사립고',
    '외국어고',
    '국제고',
    '예술고',
    '체육고',
    '자율형공립고',
  ];

  // 필터링된 학교 목록
  const filteredSchools = useMemo(() => {
    return SCHOOLS.filter((school) => {
      // 1. 검색어 필터 (학교명, 학과명, 태그)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchName = school.name.toLowerCase().includes(query);
        const matchDept = school.departments?.some((d) => d.toLowerCase().includes(query));
        const matchTag = school.tags.some((t) => t.toLowerCase().includes(query));
        const matchDistrict = school.district.toLowerCase().includes(query);
        if (!matchName && !matchDept && !matchTag && !matchDistrict) return false;
      }

      // 2. 전기/후기 필터
      if (selectedCategory !== '전체' && school.category !== selectedCategory) {
        return false;
      }

      // 3. 학교 유형 필터
      if (selectedType !== '전체' && school.type !== selectedType) {
        return false;
      }

      // 4. 자치구 필터
      if (selectedDistrict !== '전체' && school.district !== selectedDistrict) {
        return false;
      }

      // 5. 남녀구분 필터
      if (selectedGender !== '전체' && school.gender !== selectedGender) {
        return false;
      }

      // 6. 기숙사 필터
      if (dormitoryOnly && !school.dormitory) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedType,
    selectedDistrict,
    selectedGender,
    dormitoryOnly,
  ]);

  const handleToggleWishlist = (school: School) => {
    if (session.role === 'guest') {
      openAuthModal();
      return;
    }
    const targetStudentId = session.role === 'student' ? session.studentId! : '30101';
    toggleWishlist(targetStudentId, school.id);
  };

  // 상세 모달에서 해당 학교와 연결된 일정 추출
  const schoolEvents = useMemo(() => {
    if (!detailSchool) return [];
    return ADMISSION_EVENTS.filter((e) => e.schoolId === detailSchool.id);
  }, [detailSchool]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 타이틀 및 헤더 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="max-w-3xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
            고등학교 탐색 및 정보
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            나에게 맞는 서울 고등학교 찾기
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            서울시 전기고(과고, 마이스터고, 특성화고)와 후기고(일반고, 자사고, 외고, 국제고)의
            공식 모집 정보와 학교별 특색을 객관적인 기준으로 확인해 보세요.
          </p>
        </div>

        {/* 검색 인풋 */}
        <div className="mt-6 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="학교명, 관심 학과(소프트웨어, 게임 등), 자치구 또는 키워드로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold px-2 py-1 rounded-md hover:bg-slate-200"
            >
              초기화
            </button>
          )}
        </div>

        {/* 다중 필터 영역 */}
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          {/* 1. 전기고 / 후기고 대분류 필터 탭 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 w-16">전형 시기:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['전체', '전기고', '후기고'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? cat === '전기고'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : cat === '후기고'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === '전체' ? '전체 시기' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* 2. 학교 세부 유형 칩 필터 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 w-16">학교 유형:</span>
            {schoolTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  selectedType === type
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* 3. 자치구 / 성별 / 기숙사 필터 */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            {/* 자치구 드롭다운 */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">지역(구):</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d === '전체' ? '서울 전체 자치구' : d}
                  </option>
                ))}
              </select>
            </div>

            {/* 남녀 구분 */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">성별 구분:</span>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="전체">전체 (공학/남/여)</option>
                <option value="남녀공학">남녀공학</option>
                <option value="남학교">남학교</option>
                <option value="여학교">여학교</option>
              </select>
            </div>

            {/* 기숙사 토글 */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dormitoryOnly}
                onChange={(e) => setDormitoryOnly(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                기숙사 보유교만 보기
              </span>
            </label>

            {/* 필터 초기화 */}
            {(selectedCategory !== '전체' ||
              selectedType !== '전체' ||
              selectedDistrict !== '전체' ||
              selectedGender !== '전체' ||
              dormitoryOnly ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('전체');
                  setSelectedType('전체');
                  setSelectedDistrict('전체');
                  setSelectedGender('전체');
                  setDormitoryOnly(false);
                  setSearchQuery('');
                }}
                className="text-indigo-600 hover:text-indigo-800 underline text-xs ml-auto"
              >
                필터 모두 초기화
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 검색 결과 카운트 안내 */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
        <span>
          총 <strong className="text-slate-900 font-extrabold">{filteredSchools.length}</strong>개의 학교가 검색되었습니다.
        </span>
        {session.role === 'student' && (
          <span className="text-indigo-600 font-semibold">
            ★ 내가 찜한 희망고교: {wishlistIds.length}개
          </span>
        )}
      </div>

      {/* 학교 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchools.length === 0 ? (
          <div className="col-span-full py-16 bg-white rounded-3xl border border-slate-200/80 text-center space-y-3">
            <Building className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">검색 조건에 맞는 학교가 없습니다.</h3>
            <p className="text-xs text-slate-400">
              필터 조건을 변경하거나 검색어를 다르게 입력해 보세요.
            </p>
          </div>
        ) : (
          filteredSchools.map((school) => {
            const isWishlisted = wishlistIds.includes(school.id);
            const isEarly = school.category === '전기고';

            return (
              <div
                key={school.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* 상단 뱃지 & 찜하기 버튼 */}
                  <div className="flex items-start justify-between gap-2">
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
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-100">
                        {school.district}
                      </span>
                    </div>

                    {/* 희망고교 찜하기 토글 버튼 */}
                    <button
                      onClick={() => handleToggleWishlist(school)}
                      className={`p-2 rounded-xl transition-all ${
                        isWishlisted
                          ? 'bg-amber-100 text-amber-600 scale-110 shadow-xs'
                          : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50'
                      }`}
                      title={isWishlisted ? '희망고교에서 해제' : '희망고교로 저장'}
                    >
                      <Star className={`w-5 h-5 ${isWishlisted ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* 학교 이름 */}
                  <div className="mt-3">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {school.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{school.foundation}</span>
                      <span>·</span>
                      <span>{school.gender}</span>
                      {school.dormitory && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                            <Bed className="w-3 h-3" />
                            기숙사
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 학교 소개 */}
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {school.description}
                  </p>

                  {/* 특성화고/마이스터고 학과 목록 뱃지 */}
                  {school.departments && (
                    <div className="mt-3">
                      <div className="text-[10px] font-bold text-slate-400 mb-1">모집 학과:</div>
                      <div className="flex flex-wrap gap-1">
                        {school.departments.slice(0, 3).map((dept) => (
                          <span
                            key={dept}
                            className="px-2 py-0.5 rounded-md bg-indigo-50/70 text-indigo-700 text-[10px] font-medium"
                          >
                            {dept}
                          </span>
                        ))}
                        {school.departments.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">
                            +{school.departments.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 태그 */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {school.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 하단 액션 버튼 */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setDetailSchool(school)}
                    className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
                  >
                    <span>상세정보 및 일정</span>
                    <span className="text-slate-400">→</span>
                  </button>

                  <a
                    href={school.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-slate-400 hover:text-slate-700 flex items-center gap-1"
                  >
                    <span>홈페이지</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ==================== 학교 상세 모달 ==================== */}
      {detailSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setDetailSchool(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 헤더 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Building className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
                      detailSchool.category === '전기고'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {detailSchool.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                    {detailSchool.type}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                    {detailSchool.foundation} · {detailSchool.gender}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {detailSchool.name}
                </h2>
              </div>
            </div>

            {/* 공식 소개 */}
            <div className="mt-5 p-4 bg-slate-50 rounded-2xl text-xs text-slate-700 leading-relaxed border border-slate-100">
              {detailSchool.description}
            </div>

            {/* 기본 팩트 정보 */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{detailSchool.address}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{detailSchool.phone}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span>관할: {detailSchool.educationOffice}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
                <Bed className="w-4 h-4 text-slate-400 shrink-0" />
                <span>기숙사: {detailSchool.dormitory ? '운영 중' : '미운영 (통학)'}</span>
              </div>
            </div>

            {/* 학과 정보 (특성화/마이스터) */}
            {detailSchool.departments && (
              <div className="mt-5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  개설 학과 및 전공
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {detailSchool.departments.map((dept) => (
                    <div
                      key={dept}
                      className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs font-semibold text-indigo-900"
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 특색 프로그램 */}
            {detailSchool.features && (
              <div className="mt-5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  학교 특색 프로그램
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailSchool.features.map((feat) => (
                    <span
                      key={feat}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-medium"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 해당 학교 공식 일정 목록 */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                등록된 공식 전형 및 설명회 일정 ({schoolEvents.length}개)
              </h4>

              {schoolEvents.length === 0 ? (
                <div className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl">
                  해당 학교의 개별 일정이 아직 등록되지 않았습니다. (서울시 공통 전형 일정 적용)
                </div>
              ) : (
                <div className="space-y-2">
                  {schoolEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{ev.title}</div>
                        <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                          {ev.startDate} ~ {ev.endDate}
                        </div>
                        <div className="text-slate-500 mt-1">{ev.description}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold shrink-0 text-[10px]">
                        {ev.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 모달 하단 버튼 */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleWishlist(detailSchool)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  wishlistIds.includes(detailSchool.id)
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    wishlistIds.includes(detailSchool.id) ? 'fill-amber-500' : ''
                  }`}
                />
                <span>
                  {wishlistIds.includes(detailSchool.id)
                    ? '희망고교 담김 (취소하기)'
                    : '내 희망고교로 담기'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {detailSchool.admissionUrl && (
                  <a
                    href={detailSchool.admissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                  >
                    <span>모집요강</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <a
                  href={detailSchool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  <span>공식 사이트</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

