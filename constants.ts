
import { Solution, VideoReference, SiteSettings, PerformanceStats } from './types';

// 이 문구들은 어드민에서 수정하지 않고 코드로 고정합니다.
export const INITIAL_SOLUTIONS: Solution[] = [
  {
    id: '1',
    title: 'Media',
    description: '전문 촬영 장비와 시네마틱한 편집으로 브랜드의 가치를 높이는 독보적인 영상미를 구현합니다.',
    iconName: 'Video'
  },
  {
    id: '2',
    title: 'Digital',
    description: 'AI 기반 데이터 분석을 통해 최적의 업로드 시간과 키워드 전략을 도출, 알고리즘의 선택을 보장합니다.',
    iconName: 'BarChart3'
  },
  {
    id: '3',
    title: 'User Experience',
    description: '시청자가 끝까지 머물 수 있는 스토리 라인 설계와 몰입감을 더하는 인터랙티브한 연출을 제안합니다.',
    iconName: 'Layout'
  }
];

export const INITIAL_REFERENCES: VideoReference[] = [
  {
    id: 'ref1',
    type: 'Long-form',
    title: '테크 리뷰의 새로운 패러다임',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/tech1/800/450'
  },
  {
    id: 'ref2',
    type: 'Short-form',
    title: '브랜드 캠페인 숏츠 챌린지',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/shorts1/450/800'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  primaryColor: '#8B5CF6',
  secondaryColor: '#000000',
  agencyName: 'EntervibeCre',
  heroTitle: 'EntervibeCre',
  heroSlogan: '당신의 비전을 현실로, 압도적인 유튜브 성장의 파트너',
  youtubeUrl: 'https://youtube.com',
  instagramUrl: 'https://instagram.com',
  kakaoUrl: 'https://kakao.com'
};

export const CHANNEL_DATA = [
  { name: '연픽', youtube: 'https://youtube.com/channel/UCYdOBCsWT4RzSB8AuqxAmNQ', tiktok: 'https://www.tiktok.com/@finclmoney' },
  { name: '오이거좋은데', youtube: 'https://www.youtube.com/channel/UCN9BwA21OHoOrWZaqImySBg', tiktok: 'https://www.tiktok.com/@ohgoodinde' },
  { name: '집중1분', youtube: 'https://www.youtube.com/@focus1min', tiktok: 'https://www.tiktok.com/@nicehkgumnf' },
  { name: '이슈클립', youtube: 'https://www.youtube.com/@ChefClips-s8o', tiktok: 'https://www.tiktok.com/@chefclips_s80' },
  { name: '폭스뷰티', youtube: 'https://www.youtube.com/@폭스뷰티', tiktok: 'https://www.tiktok.com/@cookfriend_s' },
  { name: '이슈집', youtube: 'https://www.youtube.com/@ISSUE_ZIP-v9b', tiktok: 'https://www.tiktok.com/@issue_zip_1' },
  { name: '뷰티픽', youtube: 'https://www.youtube.com/@이슈픽2026', tiktok: '' },
  { name: '큐리컷', youtube: 'https://www.youtube.com/@큐리컷', tiktok: 'https://www.tiktok.com/@beautycut10' },
  { name: '이런k이슈', youtube: 'https://www.youtube.com/channel/UC4UG7GAJ9-0UaSjskL8NqAA', tiktok: 'https://www.tiktok.com/@this_k_issue' }
];

export const CHANNEL_URLS = CHANNEL_DATA.map(c => `[${c.name}] YouTube: ${c.youtube} | TikTok: ${c.tiktok || 'N/A'}`).join('\n');

export const CORE_HOOKS = [
  { text: "귀하의 상품은 죄가 없습니다.\n문제는 ", highlight: "'조회수 0'", suffix: "에서 멈춘 스크롤입니다." },
  { text: "아직도 1분 넘게 설명하시나요? 고객의 지갑이 열리는 시간은 ", highlight: "단 3초", suffix: "면 충분합니다." },
  { text: "알고리즘의 파도를 타느냐, 휩쓸리느냐. 실전 데이터로 증명된 ", highlight: "숏폼의 정석", suffix: "을 만나보세요." }
];

export const INITIAL_PERFORMANCE: PerformanceStats = {
  totalViews: 530000000,
  dailyViews: 5000000,
  perCapita: 10.3,
  lastUpdated: new Date().toLocaleTimeString('ko-KR'),
  hookMessage: CORE_HOOKS.map(h => `${h.text}${h.highlight}${h.suffix}`).join('\n')
};
