
import { Solution, VideoReference, SiteSettings } from './types';

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
    description: '시청자가 끝까지 머물 수 있는 스토리 라인 설계와 몰입감을 더하는 인터렉티브한 연출을 제안합니다.',
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
  },
  {
    id: 'ref3',
    type: 'Long-form',
    title: '라이프스타일 다큐멘터리 시리즈',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/tech2/800/450'
  },
  {
    id: 'ref4',
    type: 'Short-form',
    title: '데일리 패션 트렌드 요약',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/shorts2/450/800'
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

export const TERMS_OF_SERVICE = `
제1조 (목적)
본 약관은 [주식회사 마켓꾸](이하 “회사”)가 운영하는 홈페이지([도메인주소])에서 제공하는 서비스 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
“홈페이지”란 회사가 서비스를 제공하기 위하여 운영하는 웹사이트를 의미합니다.
“이용자”란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.
“서비스”란 회사가 제공하는 마케팅·홍보 컨설팅, 상담, 제안요청 접수, 자료 제공 등 일체의 서비스를 의미합니다.

제3조 (약관의 효력 및 변경)
본 약관은 홈페이지에 게시함으로써 효력이 발생합니다.
회사는 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 사전 공지합니다.

제4조 (서비스의 제공 및 변경)
회사는 다음과 같은 서비스를 제공합니다.
마케팅·홍보 관련 상담 및 문의 응대
제안요청서 접수 및 견적 안내
콘텐츠, 자료, 정보 제공
회사는 서비스의 내용, 운영상 또는 기술상 필요에 따라 변경할 수 있습니다.

제5조 (서비스 이용 제한)
회사는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다.
허위 정보를 기재한 경우
타인의 권리 또는 명예를 침해한 경우
관련 법령을 위반한 경우

제6조 (지적재산권)
홈페이지에 게시된 모든 콘텐츠(문구, 이미지, 영상 등)의 저작권은 회사 또는 정당한 권리자에게 있으며, 무단 복제·배포를 금지합니다.

제7조 (면책조항)
회사는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
회사는 이용자가 홈페이지에 기재한 정보의 정확성에 대해 보증하지 않습니다.

제8조 (준거법 및 관할)
본 약관은 대한민국 법률을 준거법으로 하며, 분쟁 발생 시 회사 본점 소재지를 관할하는 법원을 전속 관할로 합니다.
`;

export const PRIVACY_POLICY = `
[주식회사 마켓꾸](이하 “회사”)는 개인정보 보호법 등 관련 법령을 준수하며, 이용자의 개인정보를 소중히 보호합니다.

1. 개인정보의 수집 항목 및 방법
수집 항목
- 필수항목: 이름, 연락처(휴대전화번호), 이메일
- 선택항목: 회사명, 직책, 문의내용
- 자동수집항목: IP주소, 쿠키, 접속 로그, 방문 기록

수집 방법
- 홈페이지 문의/상담/제안요청 폼
- 이벤트, 프로모션 참여
- 서비스 이용 과정에서 자동 수집

2. 개인정보의 이용 목적
회사는 수집한 개인정보를 다음의 목적을 위해 사용합니다.
- 문의 및 상담 응대
- 마케팅·홍보 서비스 제안 및 견적 제공
- 고객 관리 및 서비스 개선
- 마케팅 및 광고 활용(이용자 동의 시)

3. 개인정보의 보유 및 이용 기간
원칙적으로 개인정보 수집 및 이용 목적 달성 시 지체 없이 파기합니다.
단, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.
- 상담·문의 기록: 3년
- 계약 및 결제 관련 기록: 5년

4. 개인정보의 제3자 제공
회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며, 다음의 경우에만 제공합니다.
- 이용자의 사전 동의가 있는 경우
- 법령에 의해 요구되는 경우

5. 개인정보 처리 위탁
회사는 서비스 향상을 위해 아래와 같이 개인정보 처리를 위탁할 수 있습니다.
- 수탁업체: 주식회사 엔터바이브, 문자·이메일 발송 업체
※ 위탁업체 변경 시 본 방침을 통해 공지합니다.

6. 이용자의 권리 및 행사 방법
이용자는 언제든지 다음 권리를 행사할 수 있습니다.
- 개인정보 열람, 정정, 삭제 요청
- 처리 정지 요청
요청은 이메일 또는 고객센터를 통해 가능합니다.

7. 개인정보의 파기 절차 및 방법
전자적 파일: 복구 불가능한 방식으로 삭제
종이 문서: 분쇄 또는 소각

8. 개인정보 보호책임자
성명: [유승용]
직책: [대표자]
이메일: [entervibecre@gmail.com]

9. 개인정보처리방침 변경
본 방침은 법령 또는 회사 정책 변경에 따라 수정될 수 있으며, 변경 시 홈페이지를 통해 공지합니다.
공고일자: [2026.11.18]
`;
