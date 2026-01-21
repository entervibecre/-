
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Video, BarChart3, Layout, Instagram, Youtube, MessageCircle, 
  Settings, ChevronRight, X, Plus, Trash2, Edit2, Check, Download,
  Menu, Play, Lock, User, ChevronLeft, TrendingUp, Users, Award, AlertCircle, Loader2, ExternalLink, Image as ImageIcon, Upload, ArrowLeft, Zap, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Solution, VideoReference, Inquiry, SiteSettings, AdminTab, PerformanceStats 
} from './types';
import { 
  INITIAL_SOLUTIONS, INITIAL_REFERENCES, INITIAL_SETTINGS, TERMS_OF_SERVICE, PRIVACY_POLICY, CHANNEL_URLS, INITIAL_PERFORMANCE
} from './constants';

// --- Inquiry Form ---
interface InquiryFormProps {
  onSubmit: (data: any) => Promise<boolean>;
  buttonText?: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onSubmit, buttonText }) => {
  const [form, setForm] = useState({ name: '', contact: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onSubmit(form);
    setIsSubmitting(false);
    
    if (success) {
      setIsSent(true);
      setForm({ name: '', contact: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-base font-black text-gray-400 uppercase tracking-widest leading-[1.6]">성함 / 업체명</label>
          <input 
            required
            name="name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all font-bold shadow-inner"
            placeholder="예: 홍길동 팀장"
          />
        </div>
        <div className="space-y-4">
          <label className="text-base font-black text-gray-400 uppercase tracking-widest leading-[1.6]">연락처</label>
          <input 
            required
            name="contact"
            value={form.contact}
            onChange={e => setForm({...form, contact: e.target.value})}
            className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all font-bold shadow-inner"
            placeholder="010-0000-0000"
          />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-base font-black text-gray-400 uppercase tracking-widest leading-[1.6]">이메일 주소</label>
        <input 
          required
          name="email"
          type="email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all font-bold shadow-inner"
          placeholder="contact@example.com"
        />
      </div>
      <div className="space-y-4">
        <label className="text-base font-black text-gray-400 uppercase tracking-widest leading-[1.6]">상담 요청 내용 (필수)</label>
        <textarea 
          required
          name="message"
          value={form.message}
          onChange={e => setForm({...form, message: e.target.value})}
          rows={6}
          className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all font-bold leading-[2.4] break-keep shadow-inner"
          placeholder="무료 숏폼 광고 이벤트를 통해 제작하고 싶은 영상의 주제나 채널 성격 등을 적어주세요."
        />
      </div>
      <button 
        disabled={isSent || isSubmitting}
        className={`w-full py-6 md:py-10 rounded-[2rem] font-black text-xl md:text-2xl flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 break-keep ${isSent ? 'bg-green-600 scale-95 opacity-80' : 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/30'} ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
      >
        {isSubmitting ? <><Loader2 size={32} className="animate-spin" /> 전송 중...</> : isSent ? <><Check size={32} /> 신청 완료되었습니다</> : (buttonText || '혜택 선점 및 상담 신청하기')}
      </button>
    </form>
  );
};

// --- Live Dashboard Component ---
const LiveDashboard: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const [stats, setStats] = useState<PerformanceStats>(INITIAL_PERFORMANCE);
  const [loading, setLoading] = useState(true);

  const fetchRealtimeStats = async (force = false) => {
    // 0:00:00 기준 하루 한 번 업데이트 로직
    const cachedStats = localStorage.getItem('performance_stats');
    const lastUpdateDate = localStorage.getItem('performance_update_date');
    const today = new Date().toLocaleDateString('ko-KR');

    if (!force && cachedStats && lastUpdateDate === today) {
      setStats(JSON.parse(cachedStats));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `당신은 세계적인 SNS 데이터 분석가입니다. 아래 제공된 엔터바이브크리 운영 채널들의 실시간 누적 조회수를 정밀하게 분석하여 합산하십시오.
        
        분석 대상 채널 리스트:
        ${CHANNEL_URLS}
        
        분석 지침:
        1. 유튜브(YouTube): 각 채널 URL의 '정보(About)' 섹션에 명시된 '공식 전체 조회수'를 구글 검색을 통해 정확하게 추출하세요. 만약 정보 탭이 보이지 않으면 최신 통계 사이트(예: Social Blade, Playboard)의 데이터를 참조하여 실시간성에 가장 가까운 수치를 가져오세요.
        2. 틱톡(TikTok): 제공된 계정의 프로필 누적 조회수 또는 해당 계정의 전체 동영상 조회수 합계를 검색하여 추산하세요. 틱톡 공식 데이터가 비공개인 경우 소셜 통계 플랫폼의 최근 데이터를 반영하세요.
        3. 정밀 합산: 9개 채널 모두의 유튜브 조회수와 틱톡 조회수를 하나도 빠짐없이 합산하여 최종 'Grand Total'을 도출하세요. (이 수치는 수억 회 단위여야 합니다.)
        4. 후킹 문구: 이 거대한 수치를 본 잠재 고객이 "여기라면 내 채널도 키워줄 수 있겠다"라고 확신할 수 있도록 강력한 비즈니스 임팩트 문구를 작성하세요.
        5. 결과물: 오직 지정된 JSON 형식으로만 반환하세요.

        출력 JSON 스키마:
        {
          "totalViews": 524800000, // 전체 합산 조회수 (반드시 숫자형)
          "lastUpdated": "2026-01-21 14:00", // 분석 완료 시간
          "hookMessage": "우리가 만들어낸 5억 뷰의 성공 방정식, 이제 당신의 비즈니스에 이식해 드립니다."
        }`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalViews: { type: Type.NUMBER },
              lastUpdated: { type: Type.STRING },
              hookMessage: { type: Type.STRING }
            },
            required: ["totalViews", "lastUpdated", "hookMessage"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setStats(data);
      
      // 캐싱 저장
      localStorage.setItem('performance_stats', JSON.stringify(data));
      localStorage.setItem('performance_update_date', today);
    } catch (error) {
      console.error("Performance data fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealtimeStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 100000000) return (num / 100000000).toFixed(1) + '억';
    if (num >= 10000) return (num / 10000).toFixed(1) + '만';
    return num.toLocaleString();
  };

  return (
    <section className="py-24 px-6 md:px-24 bg-transparent relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="glass-panel p-10 md:p-24 rounded-[3rem] md:rounded-[4rem] border-white/10 shadow-2xl relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />
          
          <div className="absolute top-0 right-0 p-10">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-600/30 text-red-500 text-xs font-black animate-pulse">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]" /> DAILY PERFORMANCE
            </div>
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter break-keep">
                실시간 유튜브,틱톡 <br className="md:hidden" /><span className="text-violet-500">누적 성과분석</span>
              </h2>
              
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm md:text-base font-black uppercase tracking-[0.3em] mb-6">Total Cumulative Views</span>
                <div className="relative inline-block">
                  <div className="text-7xl md:text-[10rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/10 leading-none min-h-[1.2em] flex items-center justify-center">
                    {loading ? <Loader2 className="animate-spin w-20 h-20" /> : formatNumber(stats.totalViews)}
                  </div>
                  {/* Glowing line under number */}
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent absolute -bottom-4 left-0"
                  />
                </div>
              </div>

              <div className="max-w-3xl mx-auto min-h-[4em] flex items-center justify-center">
                <p className="text-2xl md:text-4xl text-white font-black italic break-keep leading-snug tracking-tight">
                  {loading ? "공식 데이터를 정밀 분석 중입니다..." : `"${stats.hookMessage}"`}
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                <div className="flex items-center gap-3 text-sm font-black text-gray-500">
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Last Updated: {stats.lastUpdated}
                </div>
                {!loading && (
                   <button 
                    onClick={() => fetchRealtimeStats(true)}
                    className="flex items-center gap-2 text-xs font-black text-violet-500 hover:text-violet-400 transition-colors underline underline-offset-4"
                  >
                    데이터 강제 갱신
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Other Components ---
interface ConsultationPageProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
}

const ConsultationPage: React.FC<ConsultationPageProps> = ({ onClose, onSubmit }) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-black overflow-y-auto"
    >
      <div className="luxury-gradient min-h-full py-24 px-6 md:px-24">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={onClose}
            className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-16 text-lg font-black"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            홈으로 돌아가기
          </button>

          <div className="mb-24">
            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tighter break-keep italic">
              채널 운영 및<br/>
              <span className="text-violet-500">상품 홍보 상담하기</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl break-keep">
              실전 전문가 집단이 당신의 비즈니스를 분석하여<br/> 
              가장 효율적인 유튜브 성장 전략을 제안해 드립니다.
            </p>
          </div>

          <div className="glass-panel p-10 md:p-20 rounded-[3rem] border-white/10 shadow-2xl">
            <InquiryForm 
              onSubmit={onSubmit} 
              buttonText="상담 신청하고 성장 시작하기"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VideoCard: React.FC<{ video: VideoReference; isShort?: boolean }> = ({ video, isShort }) => {
  const handleOpenVideo = () => {
    if (video.embedUrl) {
      window.open(video.embedUrl, '_blank');
    }
  };

  return (
    <div 
      onClick={handleOpenVideo}
      className={`flex-shrink-0 group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] glass-panel border border-white/5 hover:border-violet-500/40 transition-all duration-500 shadow-xl cursor-pointer ${isShort ? 'w-[240px] md:w-[280px] aspect-[9/16]' : 'w-[400px] md:w-[500px] aspect-video'}`}
    >
      <img 
        src={video.thumbnail || `https://picsum.photos/seed/${video.id}/800/450`} 
        alt={video.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-8 md:p-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20">
        <div className="flex justify-between items-center">
           <h4 className="text-xl md:text-2xl font-black truncate group-hover:text-violet-400 transition-colors leading-[1.6] tracking-tight break-keep">
            {video.title}
          </h4>
          <ExternalLink size={20} className="opacity-0 group-hover:opacity-100 transition-opacity text-violet-400 shrink-0 ml-4" />
        </div>
      </div>
    </div>
  );
};

const HorizontalScrollContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollPos = direction === 'left' ? scrollLeft - clientWidth * 0.6 : scrollLeft + clientWidth * 0.6;
      scrollRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/scroll">
      <button onClick={() => scroll('left')} className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full glass-panel opacity-0 group-hover/scroll:opacity-100 transition-all hidden md:flex items-center justify-center bg-black/80 hover:bg-violet-600 border border-white/10">
        <ChevronLeft size={32} />
      </button>
      <div ref={scrollRef} className="flex overflow-x-auto gap-8 md:gap-10 px-6 md:px-24 pb-12 no-scrollbar scroll-smooth">
        {children}
        <div className="flex-shrink-0 w-16 md:w-24" />
      </div>
      <button onClick={() => scroll('right')} className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full glass-panel opacity-0 group-hover/scroll:opacity-100 transition-all hidden md:flex items-center justify-center bg-black/80 hover:bg-violet-600 border border-white/10">
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

// --- Star Background ---
const StarBackground: React.FC<{ springX: any; springY: any }> = ({ springX, springY }) => {
  const layer1X = useTransform(springX, (v: number) => v * 0.15);
  const layer1Y = useTransform(springY, (v: number) => v * 0.15);
  const layer2X = useTransform(springX, (v: number) => v * 0.4);
  const layer2Y = useTransform(springY, (v: number) => v * 0.4);
  const layer3X = useTransform(springX, (v: number) => v * 1.0);
  const layer3Y = useTransform(springY, (v: number) => v * 1.0);

  const individualStars = useMemo(() => {
    return [...Array(1500)].map((_, i) => ({
      id: i,
      size: Math.random() * 3.5 + 0.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      twinkleDuration: Math.random() * 4 + 2,
      twinkleDelay: Math.random() * 5,
      glow: Math.random() > 0.8
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <div className="absolute inset-0 bg-black" />
      <motion.div style={{ x: layer1X, y: layer1Y, backgroundImage: `radial-gradient(1px 1px at 20px 30px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 150px 120px, white, rgba(0,0,0,0))`, backgroundSize: '250px 250px' }} className="absolute inset-[-10%] opacity-20" />
      <motion.div style={{ x: layer2X, y: layer2Y, backgroundImage: `radial-gradient(2px 2px at 150px 150px, white, rgba(0,0,0,0)), radial-gradient(2px 2px at 500px 100px, white, rgba(0,0,0,0))`, backgroundSize: '1200px 1200px' }} className="absolute inset-[-20%] opacity-40" />
      <motion.div style={{ x: layer3X, y: layer3Y }} className="absolute inset-[-30%]">
        {individualStars.map((star) => (
          <motion.div 
            key={star.id}
            animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.2, 1] }}
            transition={{ duration: star.twinkleDuration, repeat: Infinity, delay: star.twinkleDelay, ease: "easeInOut" }}
            className="absolute rounded-full bg-white"
            style={{ width: star.size + 'px', height: star.size + 'px', left: star.x + '%', top: star.y + '%', boxShadow: star.glow ? `0 0 ${star.size * 4}px ${star.size / 2}px rgba(255, 255, 255, 0.6)` : 'none' }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(139,92,246,0.07)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.05)_0%,transparent_50%)]" />
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConsultationPageOpen, setIsConsultationPageOpen] = useState(false);
  const [activeLegalView, setActiveLegalView] = useState<'terms' | 'privacy' | null>(null);
  
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('leads');
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [solutions, setSolutions] = useState<Solution[]>(INITIAL_SOLUTIONS);
  const [references, setReferences] = useState<VideoReference[]>(INITIAL_REFERENCES);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 80;
    const y = (clientY / innerHeight - 0.5) * 80;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('evc_settings');
    const savedSolutions = localStorage.getItem('evc_solutions');
    const savedReferences = localStorage.getItem('evc_references');
    const savedInquiries = localStorage.getItem('evc_inquiries');
    const savedAuth = localStorage.getItem('evc_auth');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedSolutions) setSolutions(JSON.parse(savedSolutions));
    if (savedReferences) setReferences(JSON.parse(savedReferences));
    if (savedInquiries) setInquiries(JSON.parse(savedInquiries));
    if (savedAuth === 'true') setIsAuthenticated(true);
  }, []);

  const saveToLocalStorage = useCallback((key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  }, []);

  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    saveToLocalStorage('evc_settings', newSettings);
  };

  const handleUpdateSolutions = (newSolutions: Solution[]) => {
    setSolutions(newSolutions);
    saveToLocalStorage('evc_solutions', newSolutions);
  };

  const handleUpdateReferences = (newReferences: VideoReference[]) => {
    setReferences(newReferences);
    saveToLocalStorage('evc_references', newReferences);
  };

  const handleAddInquiry = async (inquiry: Omit<Inquiry, 'id' | 'date'>) => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString('ko-KR')
    };
    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    saveToLocalStorage('evc_inquiries', updated);
    return true;
  };

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-violet-500 selection:text-white relative ${isAdminMode || isConsultationPageOpen || activeLegalView ? 'overflow-hidden h-screen' : ''}`} onMouseMove={handleMouseMove}>
      <StarBackground springX={springX} springY={springY} />

      {!isAdminMode && !isConsultationPageOpen && !activeLegalView && (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-500">
          <div className="text-xl md:text-2xl font-black tracking-tighter" style={{ color: settings.primaryColor }}>{settings.agencyName}</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowLogin(true)} className={`p-2 rounded-full transition-all ${isAuthenticated ? 'text-violet-400 scale-105' : 'hover:bg-white/10 opacity-60 hover:opacity-100'}`}>
              <Settings size={22} />
            </button>
          </div>
        </nav>
      )}

      <main className={`relative z-10 ${isAdminMode || isConsultationPageOpen || activeLegalView ? 'hidden' : 'block'}`}>
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden bg-transparent">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20 pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 w-full max-w-5xl">
            <h1 className="text-5xl md:text-[9vw] font-black tracking-tighter mb-8 md:mb-10 leading-[1.35] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">{settings.heroTitle}</h1>
            <div className="space-y-6 md:space-y-10 mb-12 md:mb-16">
              {settings.heroSlogan.split(',').map((text, idx) => (
                <motion.p key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.15 }} className={`text-xl md:text-5xl font-bold tracking-tight leading-[1.4] md:leading-[1.8] ${idx === 1 ? 'text-white' : 'text-white/40'}`}>
                  {text.trim()}
                </motion.p>
              ))}
            </div>
            <a href="#section-2" className="group relative inline-flex items-center gap-3 px-10 py-5 md:px-12 md:py-6 rounded-full bg-white text-black font-black text-lg md:text-xl hover:scale-105 transition-all shadow-xl">
              <span>무료 숏폼 광고 신청하기</span>
              <ChevronRight size={24} className="group-hover:translate-x-1.5 transition-transform" />
            </a>
          </motion.div>
        </section>

        {/* Live Performance Dashboard Section */}
        <LiveDashboard primaryColor={settings.primaryColor} />

        <section id="section-0" className="py-24 md:py-32 px-6 md:px-24 bg-transparent relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24 md:mb-32 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm md:text-base font-black mb-8 shadow-sm">
                <Award size={20} /> 실전 데이터로 증명합니다
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-10 leading-[1.65] md:leading-[1.7] tracking-tighter">단순한 대행이 아닌,<br/> <span style={{ color: settings.primaryColor }}>100여 개의 채널</span>을 직접 운영하는<br/>실전 전문가 집단</h2>
              <p className="text-lg md:text-2xl text-gray-400 max-w-4xl mx-auto font-medium leading-[1.2] md:leading-[2.4]">현재 대형 인플루언서 매니지먼트 및 100여 개의 자사 채널을 직접 운영하며 쌓은 독보적인 데이터로 당신의 성장을 견인합니다.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-24 md:mb-32">
              {solutions.map((sol, i) => (
                <div key={sol.id} className="glass-panel p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] hover:border-violet-500/30 transition-all duration-500 flex flex-col items-start text-left">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[1.5rem] bg-violet-500/10 flex items-center justify-center mb-8 text-violet-500">
                    {sol.iconName === 'Video' && <Video size={32} />}
                    {sol.iconName === 'BarChart3' && <BarChart3 size={32} />}
                    {sol.iconName === 'Layout' && <Layout size={32} />}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-6 leading-[1.6]">{sol.title}</h3>
                  <p className="text-base md:text-lg text-gray-400 leading-[2.4] font-medium">{sol.description}</p>
                </div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative p-10 md:p-24 rounded-[3rem] md:rounded-[4rem] bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm border border-white/5 overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row gap-16 md:gap-20 items-center">
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl md:text-5xl font-black mb-10 leading-[1.65] md:leading-[1.7] tracking-tighter">성과는 압도적으로,<br/><span className="text-violet-500">비용은 혁신적으로.</span></h3>
                  <p className="text-lg md:text-xl text-gray-400 font-medium leading-[1.2] md:leading-[2.4]">거품을 걷어낸 실전 중심의 합리적 가격 정책으로 부담 없이 최고의 성장을 경험할 수 있습니다.</p>
                </div>
                <div className="w-full lg:w-auto flex flex-col gap-8 md:gap-12">
                  <div className="glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] min-w-[280px]">
                    <p className="text-violet-400 text-sm md:text-base font-black mb-4 uppercase tracking-widest">채널 운영 단가</p>
                    <div className="flex items-baseline gap-3 mb-4"><span className="text-gray-500 text-xl font-bold">월</span><span className="text-4xl md:text-5xl font-black text-white">299만원</span><span className="text-gray-500 text-lg font-bold">부터</span></div>
                    <p className="text-gray-400 text-sm md:text-base font-medium leading-[2.1]">전담 PD 매칭 및 브랜딩 영상 제작</p>
                  </div>
                  <div className="glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] min-w-[280px]">
                    <p className="text-violet-400 text-sm md:text-base font-black mb-4 uppercase tracking-widest">상품 홍보 단가</p>
                    <div className="flex items-baseline gap-3 mb-4"><span className="text-gray-500 text-xl font-bold">건당</span><span className="text-4xl md:text-5xl font-black text-white">15만원</span><span className="text-gray-500 text-lg font-bold">부터</span></div>
                    <p className="text-gray-400 text-sm md:text-base font-medium">제품 영상 제작 및 유튜브,SNS 홍보 확산</p>
                  </div>
                </div>
              </div>
              <div className="mt-16 md:mt-20 flex justify-center">
                <button onClick={() => setIsConsultationPageOpen(true)} className="flex items-center gap-4 px-12 py-6 md:px-16 md:py-8 rounded-full bg-violet-600 font-black text-xl md:text-2xl hover:bg-violet-700 hover:scale-105 transition-all shadow-xl shadow-violet-600/30 group">상담 신청하고 성장 시작하기 <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" /></button>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="section-1" className="py-24 md:py-32 bg-transparent overflow-hidden relative">
          <div className="px-6 md:px-24 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter italic leading-[1.6]">레퍼런스</h2>
          </div>
          <div className="flex flex-col gap-24 md:gap-32">
            <div>
              <div className="px-6 md:px-24 flex items-center gap-4 mb-8 md:mb-12"><div className="w-10 h-1 bg-violet-500 rounded-full" /><h3 className="text-2xl md:text-3xl font-black tracking-tight leading-[1.6]">롱폼 기획 제작</h3></div>
              <HorizontalScrollContainer>{references.filter(r => r.type === 'Long-form').map(video => <VideoCard key={video.id} video={video} />)}</HorizontalScrollContainer>
            </div>
            <div>
              <div className="px-6 md:px-24 flex items-center gap-4 mb-8 md:mb-12"><div className="w-10 h-1 bg-violet-500 rounded-full" /><h3 className="text-2xl md:text-3xl font-black tracking-tight leading-[1.6]">숏폼 마케팅</h3></div>
              <HorizontalScrollContainer>{references.filter(r => r.type === 'Short-form').map(video => <VideoCard key={video.id} video={video} isShort />)}</HorizontalScrollContainer>
            </div>
          </div>
        </section>

        <section id="section-2" className="py-24 md:py-32 px-6 md:px-24 bg-transparent relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16 md:mb-24"><span className="inline-block px-6 py-2 rounded-full bg-violet-500 text-white text-sm md:text-base font-black mb-8 tracking-widest shadow-lg">이벤트 마감 임박</span><h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.65] md:leading-[1.7] tracking-tighter">이벤트<br/>무료 숏폼 광고 요청하기</h2><p className="text-lg md:text-xl text-gray-400 font-medium leading-[1.2] md:leading-[2.4]">선착순 혜택이 곧 종료됩니다. 지금 바로 전문가의 무료 진단을 예약하세요.</p></div>
            <InquiryForm onSubmit={handleAddInquiry} />
          </div>
        </section>

        <footer className="py-16 md:py-24 border-t border-white/5 px-6 md:px-24 bg-transparent text-center relative z-10">
          <div className="text-2xl md:text-3xl font-black mb-10 tracking-tighter text-violet-500 opacity-40 leading-[1.6]">{settings.agencyName}</div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm md:text-base uppercase tracking-widest text-gray-600 font-black mb-10">
            <button onClick={() => setActiveLegalView('terms')} className="hover:text-white transition-all">이용약관</button>
            <button onClick={() => setActiveLegalView('privacy')} className="hover:text-white transition-all">개인정보처리방침</button>
          </div>
          <div className="text-xs md:text-sm text-gray-700 font-medium mb-12 space-y-2 leading-relaxed tracking-tight">
            <p>주식회사 마켓꾸 / 사업자등록번호 373-87-03959 / 대표자 유승용 / 서울특별시 용산구 서빙고로 17, 용산센트럴파크</p>
            <p className="opacity-50 tracking-[0.2em]">© 2024 ENTERVIBECRE. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {isConsultationPageOpen && <ConsultationPage onClose={() => setIsConsultationPageOpen(false)} onSubmit={handleAddInquiry} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={(id, pw) => id === 'entervibecre' && pw === 'PLMokn12#$' ? (setIsAuthenticated(true), setIsAdminMode(true), true) : false} />}
      </AnimatePresence>
    </div>
  );
};

// Placeholder for LoginModal (simplified for context)
const LoginModal: React.FC<{ onClose: () => void; onLogin: (id: string, pw: string) => boolean }> = ({ onClose, onLogin }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
      <div className="w-full max-w-lg glass-panel p-10 rounded-[3rem] border border-white/10">
        <h2 className="text-2xl font-black mb-10">관리자 로그인</h2>
        <input className="w-full bg-zinc-950 p-4 rounded-xl mb-4" placeholder="아이디" value={id} onChange={e => setId(e.target.value)} />
        <input className="w-full bg-zinc-950 p-4 rounded-xl mb-6" type="password" placeholder="비밀번호" value={pw} onChange={e => setPw(e.target.value)} />
        <button onClick={() => onLogin(id, pw) || alert('로그인 실패')} className="w-full py-4 bg-violet-600 rounded-xl font-black">로그인</button>
        <button onClick={onClose} className="w-full mt-4 text-gray-500 font-bold">닫기</button>
      </div>
    </motion.div>
  );
};

export default App;
