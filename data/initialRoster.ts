import { StudentRecord } from '@/types';

// 301~304반 각각 1번부터 22번까지의 학생 기본 레코드 생성
export function generateInitialRoster(): StudentRecord[] {
  const roster: StudentRecord[] = [];
  const classes = [1, 2, 3, 4];

  // 반별 사전 등록된 샘플 희망고교 프리셋
  const sampleWishlists: Record<string, string[]> = {
    // 3학년 1반
    '30101': ['sch-seoul-sci', 'sch-yongsan-high'],
    '30102': ['sch-yongsan-high', 'sch-gyeongbok-high'],
    '30103': ['sch-seoul-robot'],
    '30104': ['sch-daewon-fl', 'sch-yongsan-high'],
    '30105': ['sch-sunrin-internet'],
    '30106': ['sch-hana-high', 'sch-yongsan-high'],
    '30107': ['sch-yeouido-high', 'sch-jungkyung-high'],
    '30108': ['sch-seoul-arts'],
    '30109': ['sch-seoul-digitech'],
    '30110': ['sch-jungdong-high', 'sch-kyunggi-high'],
    '30111': ['sch-danggok-high'],
    '30112': ['sch-sudo-electric'],
    '30113': ['sch-seoul-intl', 'sch-baehwa-girls'],
    '30114': ['sch-yongsan-high'],
    '30115': ['sch-hansei-cyber'],
    // 30116 ~ 30122: 아직 희망고교 미선택 상태 (상담 필요 학생 예시)

    // 3학년 2반
    '30201': ['sch-sejong-sci', 'sch-mapo-high'],
    '30202': ['sch-hyundai-high', 'sch-kyunggi-high'],
    '30203': ['sch-sunrin-internet'],
    '30204': ['sch-mirim-meister'],
    '30205': ['sch-yongsan-high', 'sch-yeouido-high'],
    '30206': ['sch-daeil-fl'],
    '30207': ['sch-paichai-high'],
    '30208': ['sch-seoul-sports'],
    '30209': ['sch-daekyung-comm'],
    '30210': ['sch-ewha-girls-high'],
    '30211': ['sch-sanggye-high'],
    '30212': ['sch-jungkyung-high'],

    // 3학년 3반
    '30301': ['sch-hana-high', 'sch-yongsan-high'],
    '30302': ['sch-seoul-robot'],
    '30303': ['sch-yongsan-high'],
    '30304': ['sch-seoul-digitech'],
    '30305': ['sch-yeouido-high'],
    '30306': ['sch-daewon-fl'],
    '30307': ['sch-kyunggi-high'],
    '30308': ['sch-sunrin-internet'],

    // 3학년 4반
    '30401': ['sch-seoul-sci'],
    '30402': ['sch-jungdong-high'],
    '30403': ['sch-danggok-high'],
    '30404': ['sch-mirim-meister'],
    '30405': ['sch-yongsan-high'],
    '30406': ['sch-daeil-fl'],
    '30407': ['sch-hansei-cyber'],
  };

  classes.forEach((classNum) => {
    for (let num = 1; num <= 22; num++) {
      const numStr = num < 10 ? `0${num}` : `${num}`;
      const studentId = `30${classNum}${numStr}`;
      const wishList = sampleWishlists[studentId] || [];

      roster.push({
        studentId,
        grade: 3,
        classNum,
        studentNum: num,
        displayName: `${studentId} 학생`,
        wishlistSchoolIds: wishList,
        completedChecklistIds: wishList.length > 0 ? ['chk-counseling', 'chk-score'] : [],
        teacherNote:
          studentId === '30101'
            ? '과학고 1단계 원서 및 추천서 준비 완료. 불합격 시 용산고 지원 예정.'
            : studentId === '30105'
            ? '선린인터넷고 SW과 특별전형 포트폴리오 면담 완료.'
            : undefined,
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return roster;
}

export const INITIAL_ROSTER = generateInitialRoster();

