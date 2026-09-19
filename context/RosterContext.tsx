'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentRecord } from '@/types';
import { INITIAL_ROSTER } from '@/data/initialRoster';

interface RosterContextType {
  roster: StudentRecord[];
  getStudentRecord: (studentId: string) => StudentRecord | undefined;
  getClassStudents: (classNum: number) => StudentRecord[];
  toggleWishlist: (studentId: string, schoolId: string) => void;
  toggleChecklist: (studentId: string, checklistId: string) => void;
  updateTeacherNote: (studentId: string, note: string) => void;
  resetRoster: () => void;
}

const RosterContext = createContext<RosterContextType | undefined>(undefined);

const ROSTER_STORAGE_KEY = '@highgo/roster_data';

export function RosterProvider({ children }: { children: React.ReactNode }) {
  const [roster, setRoster] = useState<StudentRecord[]>(INITIAL_ROSTER);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROSTER_STORAGE_KEY);
      if (saved) {
        setRoster(JSON.parse(saved));
      } else {
        localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(INITIAL_ROSTER));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRoster = (newRoster: StudentRecord[]) => {
    setRoster(newRoster);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(newRoster));
      } catch {
        // ignore
      }
    }
  };

  const getStudentRecord = (studentId: string): StudentRecord | undefined => {
    let student = roster.find((s) => s.studentId === studentId);
    if (!student && studentId.length === 5) {
      // 명부에 없는 새로운 학번인 경우 자동 생성
      const classNum = parseInt(studentId.charAt(2), 10);
      const studentNum = parseInt(studentId.slice(3), 10);
      student = {
        studentId,
        grade: 3,
        classNum,
        studentNum,
        displayName: `${studentId} 학생`,
        wishlistSchoolIds: [],
        completedChecklistIds: [],
        updatedAt: new Date().toISOString(),
      };
      saveRoster([...roster, student]);
    }
    return student;
  };

  const getClassStudents = (classNum: number): StudentRecord[] => {
    return roster
      .filter((s) => s.classNum === classNum)
      .sort((a, b) => a.studentNum - b.studentNum);
  };

  const toggleWishlist = (studentId: string, schoolId: string) => {
    const student = getStudentRecord(studentId);
    if (!student) return;

    const exists = student.wishlistSchoolIds.includes(schoolId);
    const newWishlist = exists
      ? student.wishlistSchoolIds.filter((id) => id !== schoolId)
      : [...student.wishlistSchoolIds, schoolId];

    const updatedRoster = roster.map((s) => {
      if (s.studentId === studentId) {
        return {
          ...s,
          wishlistSchoolIds: newWishlist,
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    saveRoster(updatedRoster);
  };

  const toggleChecklist = (studentId: string, checklistId: string) => {
    const student = getStudentRecord(studentId);
    if (!student) return;

    const exists = student.completedChecklistIds.includes(checklistId);
    const newChecklist = exists
      ? student.completedChecklistIds.filter((id) => id !== checklistId)
      : [...student.completedChecklistIds, checklistId];

    const updatedRoster = roster.map((s) => {
      if (s.studentId === studentId) {
        return {
          ...s,
          completedChecklistIds: newChecklist,
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    saveRoster(updatedRoster);
  };

  const updateTeacherNote = (studentId: string, note: string) => {
    const updatedRoster = roster.map((s) => {
      if (s.studentId === studentId) {
        return {
          ...s,
          teacherNote: note,
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    saveRoster(updatedRoster);
  };

  const resetRoster = () => {
    saveRoster(INITIAL_ROSTER);
  };

  return (
    <RosterContext.Provider
      value={{
        roster,
        getStudentRecord,
        getClassStudents,
        toggleWishlist,
        toggleChecklist,
        updateTeacherNote,
        resetRoster,
      }}
    >
      {children}
    </RosterContext.Provider>
  );
}

export function useRoster() {
  const ctx = useContext(RosterContext);
  if (!ctx) throw new Error('useRoster must be used within a RosterProvider');
  return ctx;
}

