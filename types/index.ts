export type SchoolCategory = '전기고' | '후기고';

export type SchoolType =
  // 전기고
  | '과학고'
  | '마이스터고'
  | '특성화고'
  | '예술고'
  | '체육고'
  // 후기고
  | '일반고'
  | '자율형공립고'
  | '자율형사립고'
  | '외국어고'
  | '국제고';

export type GenderType = '남녀공학' | '남학교' | '여학교';

export interface School {
  id: string;
  name: string;
  category: SchoolCategory;
  type: SchoolType;
  district: string;            // 예: '용산구', '강남구', '종로구' 등 25개 구
  educationOffice: string;     // 예: '중부교육지원청'
  foundation: '공립' | '사립';
  gender: GenderType;
  address: string;
  phone: string;
  websiteUrl: string;
  admissionUrl?: string;
  dormitory: boolean;
  departments?: string[];      // 특성화고/마이스터고 전공 학과
  description: string;         // 중립적 공식 학교 소개
  features?: string[];         // 특색 프로그램 (예: 과학중점학교, AI융합, 기숙사 등)
  tags: string[];
}

export type EventCategory =
  | '입학설명회'
  | '원서접수'
  | '서류제출'
  | '면접실기'
  | '합격자발표'
  | '합격자등록'
  | '중3필수일정' // 담임교사 강조 일정: 2학기 지필평가, 나이스 내신 마감, 학교장 추천서 등
  | '일반안내';

export interface AdmissionEvent {
  id: string;
  title: string;
  schoolId?: string;           // 특정 학교 일정인 경우 해당 학교 ID
  schoolName?: string;         // 특정 학교명
  targetCategory: SchoolCategory | '전체';
  targetTypes?: SchoolType[];
  category: EventCategory;
  startDate: string;           // 'YYYY-MM-DD' 또는 'YYYY-MM-DDTHH:mm'
  endDate: string;
  isDDayHighlight: boolean;    // 메인 홈 D-Day 노출 여부
  isEssential: boolean;        // 담임교사 필수 점검 일정 여부 (내신마감, 시험, 추천서 등)
  description: string;
  location?: string;
  linkUrl?: string;
}

export type UserRole = 'guest' | 'student' | 'teacher';

export interface UserSession {
  role: UserRole;
  code: string;                // '301', '302' 또는 '30101', '30205'
  classNum?: number;           // 1, 2, 3, 4
  studentId?: string;          // '30101'
  displayName: string;         // '3학년 1반 담임교사' 또는 '30101 학생'
}

export interface StudentRecord {
  studentId: string;           // '30101' ~ '30422'
  grade: number;               // 3
  classNum: number;            // 1, 2, 3, 4
  studentNum: number;          // 1 ~ 22
  displayName: string;         // '30101 학생' (개인정보 보호를 위해 완전 학번만 표시)
  wishlistSchoolIds: string[]; // 희망고교 ID 배열
  completedChecklistIds: string[]; // 체크리스트 완료 ID 배열
  teacherNote?: string;        // 담임교사 상담 메모
  updatedAt: string;           // 최종 수정 일시
}

export interface ChecklistItem {
  id: string;
  title: string;
  period: string;              // 예: '9월 중순', '11월 초'
  category: '학업/내신' | '서류/상담' | '원서접수';
  description: string;
  link?: string;
}

