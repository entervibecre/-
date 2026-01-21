
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Video, BarChart3, Layout, Instagram, Youtube, MessageCircle, 
  Settings, ChevronRight, X, Plus, Trash2, Edit2, Check, Download,
  Menu, Play, Lock, User, ChevronLeft, TrendingUp, Users, Award, AlertCircle, Loader2, ExternalLink, Image as ImageIcon, Upload, ArrowLeft, Zap, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { 
  Solution, VideoReference, Inquiry, SiteSettings, PerformanceStats 
} from './types';
import { 
  INITIAL_SOLUTIONS, INITIAL_REFERENCES, INITIAL_SETTINGS, CHANNEL_URLS, INITIAL_PERFORMANCE, CORE_HOOKS
} from './constants';

// --- Inquiry Form ---
interface InquiryFormProps {
  onSubmit: (data: any) => Promise<boolean>;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onSubmit }) => {
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
          <label className="text-sm font-black text-gray-400 uppercase tracking-widest leading-[1.6]">성함 / 업체명</label>
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
          <label className="text-sm font-black text-gray-400 uppercase tracking-widest leading-[1.6]">연락처</label>
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
        <label className="text-sm font-black text-gray-400 uppercase tracking-widest leading-[1.6]">이메일 주소</label>
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
        <label className="text-sm font-black text-gray-400 uppercase tracking-widest leading-[1.6]">상담 요청 내용 (필수)</label>
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
        {isSubmitting ? <><Loader2 size={32} className="animate-spin" /> 전송 중...</> : isSent ? <><Check size={32} /> 신청 완료되었습니다</> : '무료 숏폼 광고 신청하기'}
      </button>
    </form>
  );
};

// --- Live Dashboard Component ---
const LiveDashboard: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const [stats, setStats] = useState<PerformanceStats>(INITIAL_PERFORMANCE);
  const [loading, setLoading] = useState(false);

  const fetchRealtimeStats = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') return;

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze these channels: ${CHANNEL_URLS}. Return sum of total views, daily views, and per-capita reach as JSON.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        setStats(prev => ({ ...prev, ...data, lastUpdated: new Date().toLocaleTimeString('ko-KR') }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealtimeStats();
  }, []);

  const formatNumberOnly = (num: number) => {
    if (num >= 100000000) return (num / 100000000).toFixed(1);
    if (num >= 10000) return (num / 10000).toFixed(1);
    return num.toLocaleString();
  };

  return (
    <section id="live-dashboard" className="py-6 md:py-24 px-6 md:px-24 bg-transparent relative overflow-visible flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="glass-panel p-6 md:p-20 rounded-[2rem] md:rounded-[4rem] border-white/10 shadow-2xl relative overflow-hidden bg-zinc-900/60 backdrop-blur-3xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
          
          <div className="absolute top-0 left-0 p-6 md:p-10 pointer-events-none z-20">
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] md:text-xs font-black tracking-widest uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8B5CF6]" /> Insights Sync
            </div>
          </div>

          <div className="relative pt-12 md:pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-24"
            >
              <div className="space-y-4 text-center">
                 <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter break-keep">
                  실시간 유튜브·틱톡 <br className="md:hidden" /> <span className="text-violet-500">누적 성과분석</span>
                </h2>
                <p className="text-gray-500 text-xs md:text-lg font-bold uppercase tracking-[0.4em] opacity-40 italic">Global Traffic Metrics</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative inline-flex items-baseline">
                  <div className="text-6xl md:text-[10rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 leading-none drop-shadow-2xl">
                    {formatNumberOnly(stats.totalViews)}
                  </div>
                  <div className="text-2xl md:text-6xl font-black text-white ml-2 md:ml-6 tracking-tighter opacity-90">
                    억 뷰
                  </div>
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 2, delay: 0.3 }}
                    className="h-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent absolute -bottom-2 md:-bottom-8 left-0"
                  />
                </div>
                <span className="text-violet-400 text-xs md:text-xl font-black mt-4 md:mt-16 tracking-widest uppercase italic opacity-60">Verified Performance</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-10 max-w-5xl mx-auto">
                <div className="glass-panel p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] border-white/5 bg-white/5 flex flex-col items-start justify-center hover:bg-white/10 transition-all duration-500 group">
                  <span className="text-white text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-3 md:mb-5 group-hover:text-violet-400 transition-colors">국민 1인당 평균 시청</span>
                  <div className="text-3xl md:text-7xl font-black text-white italic tracking-tighter">
                    {stats.perCapita}회
                  </div>
                </div>
                <div className="glass-panel p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] border-white/5 bg-white/5 flex flex-col items-start justify-center hover:bg-white/10 transition-all duration-500 group">
                  <span className="text-white text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-3 md:mb-5 group-hover:text-violet-400 transition-colors">현재 일평균 시청수</span>
                  <div className="text-3xl md:text-7xl font-black text-white italic tracking-tighter">
                    {Math.floor(stats.dailyViews / 10000)}만+
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto space-y-6 md:space-y-16">
                {CORE_HOOKS.map((hook, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.2, type: 'spring', damping: 20 }}
                    className="flex items-start gap-4 md:gap-8 group"
                  >
                    <div className="w-1 md:w-1.5 h-auto min-h-[30px] md:min-h-[70px] bg-gradient-to-b from-violet-500 to-transparent rounded-full opacity-30 group-hover:opacity-100 transition-opacity shrink-0" />
                    <div className="space-y-1">
                      <p className="text-base md:text-[2.2rem] text-white font-medium italic break-keep leading-[1.6] tracking-tight opacity-90 text-left">
                        {hook.text}
                        <span className="text-violet-500 font-black px-1 md:px-1.5 group-hover:text-violet-400 transition-colors bg-clip-text">
                          {hook.highlight}
                        </span>
                        {hook.suffix}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 pt-6 md:pt-12 border-t border-white/5">
                <div className="flex items-center gap-3 text-base md:text-xl font-black text-white bg-white/10 px-12 py-5 rounded-full border border-white/20 shadow-2xl backdrop-blur-xl hover:bg-white/20 transition-all duration-300">
                  <RefreshCw size={22} className={loading ? 'animate-spin text-violet-500' : 'text-violet-400'} />
                  실시간 통합 데이터: <span className="text-violet-400 ml-1">데이터 동기화 완료 ({stats.lastUpdated})</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Consultation Component ---
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
      <div className="luxury-gradient min-h-full py-16 md:py-24 px-6 md:px-24">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={onClose}
            className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-12 md:mb-16 text-lg font-black"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            홈으로 돌아가기
          </button>
          <div className="mb-16 md:mb-24 text-left">
            <h2 className="text-3xl md:text-7xl font-black mb-6 md:mb-8 leading-tight tracking-tighter break-keep italic">
              채널 운영 및<br/>
              <span className="text-violet-500">상품 홍보 상담하기</span>
            </h2>
            <p className="text-lg md:text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl break-keep">
              실전 전문가 집단이 당신의 비즈니스를 분석하여<br/> 
              가장 효율적인 유튜브 성장 전략을 제안해 드립니다.
            </p>
          </div>
          <div className="glass-panel p-8 md:p-20 rounded-[2rem] md:rounded-[3rem] border-white/10 shadow-2xl">
            <InquiryForm onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VideoCard: React.FC<{ video: VideoReference; isShort?: boolean }> = ({ video, isShort }) => {
  return (
    <div 
      onClick={() => video.embedUrl && window.open(video.embedUrl, '_blank')}
      className={`flex-shrink-0 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] glass-panel border border-white/5 hover:border-violet-500/40 transition-all duration-500 shadow-xl cursor-pointer ${isShort ? 'w-[180px] md:w-[260px] aspect-[9/16]' : 'w-[280px] md:w-[460px] aspect-video'}`}
    >
      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12 md:pt-16">
        <div className="flex justify-between items-center">
           <h4 className="text-sm md:text-xl font-black truncate group-hover:text-violet-400 transition-colors leading-[1.6] tracking-tight break-keep">{video.title}</h4>
          <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-violet-400 shrink-0 ml-4" />
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
      const scrollPos = direction === 'left' ? scrollLeft - clientWidth * 0.5 : scrollLeft + clientWidth * 0.5;
      scrollRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  };
  return (
    <div className="relative group/scroll">
      <button onClick={() => scroll('left')} className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full glass-panel opacity-0 group-hover/scroll:opacity-100 transition-all hidden md:flex items-center justify-center bg-black/60 hover:bg-violet-600 border border-white/10">
        <ChevronLeft size={24} />
      </button>
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 md:gap-8 px-6 md:px-24 pb-8 md:pb-12 no-scrollbar scroll-smooth">
        {children}
        <div className="flex-shrink-0 w-8 md:w-20" />
      </div>
      <button onClick={() => scroll('right')} className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full glass-panel opacity-0 group-hover/scroll:opacity-100 transition-all hidden md:flex items-center justify-center bg-black/60 hover:bg-violet-600 border border-white/10">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

const StarBackground: React.FC<{ springX: any; springY: any }> = ({ springX, springY }) => {
  const layer1X = useTransform(springX, (v: number) => v * 0.1);
  const layer1Y = useTransform(springY, (v: number) => v * 0.1);
  const layer2X = useTransform(springX, (v: number) => v * 0.3);
  const layer2Y = useTransform(springY, (v: number) => v * 0.3);
  const stars = useMemo(() => [...Array(800)].map((_, i) => ({
    id: i, size: Math.random() * 2 + 0.5, x: Math.random() * 100, y: Math.random() * 100, dur: Math.random() * 5 + 2, del: Math.random() * 5
  })), []);
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <motion.div style={{ x: layer1X, y: layer1Y }} className="absolute inset-[-10%] opacity-20 bg-[radial-gradient(1px_1px_at_20px_30px,white,rgba(0,0,0,0))] bg-[length:200px_200px]" />
      <motion.div style={{ x: layer2X, y: layer2Y }} className="absolute inset-[-20%]">
        {stars.map((star) => (
          <motion.div key={star.id} animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: star.dur, repeat: Infinity, delay: star.del }} className="absolute rounded-full bg-white" style={{ width: star.size + 'px', height: star.size + 'px', left: star.x + '%', top: star.y + '%' }} />
        ))}
      </motion.div>
    </div>
  );
};

const App: React.FC = () => {
  const [isConsultationPageOpen, setIsConsultationPageOpen] = useState(false);
  const settings = INITIAL_SETTINGS;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 60;
    const y = (e.clientY / window.innerHeight - 0.5) * 60;
    mouseX.set(x);
    mouseY.set(y);
  };

  const saveInquiry = useCallback((inquiry: any) => {
    console.log('Lead submitted:', inquiry);
    return Promise.resolve(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden" onMouseMove={handleMouseMove}>
      <StarBackground springX={springX} springY={springY} />
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-500">
        <div className="text-lg md:text-2xl font-black tracking-tighter" style={{ color: settings.primaryColor }}>{settings.agencyName}</div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsConsultationPageOpen(true)} className="px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-700 text-sm font-black transition-all">상담하기</button>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-5xl">
            <h1 className="text-5xl md:text-[8vw] font-black tracking-tighter mb-8 leading-normal bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 pr-8 overflow-visible">
              {settings.heroTitle}
            </h1>
            <div className="space-y-6 mb-12">
              <p className="text-xl md:text-4xl font-bold tracking-tight text-white/40 leading-relaxed">당신의 비전을 현실로</p>
              <p className="text-xl md:text-4xl font-bold tracking-tight text-white leading-relaxed">압도적인 유튜브 성장의 파트너</p>
            </div>
            <a href="#section-2" className="group relative inline-flex items-center gap-3 px-10 py-6 rounded-full bg-white text-black font-black text-lg hover:scale-105 transition-all shadow-xl">
              <span>무료 숏폼 광고 신청하기</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </section>

        <LiveDashboard primaryColor={settings.primaryColor} />

        <section id="section-0" className="py-24 px-6 md:px-24 bg-transparent relative">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 text-center">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-black mb-6 shadow-sm"><Award size={18} /> 실전 데이터로 증명합니다</div>
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-relaxed tracking-tighter">단순한 대행이 아닌, <span style={{ color: settings.primaryColor }}>100여 개의 채널</span>을 직접 운영하는 실전 전문가 집단</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {INITIAL_SOLUTIONS.map((sol) => (
                <div key={sol.id} className="glass-panel p-10 rounded-[2rem] hover:border-violet-500/30 transition-all duration-500">
                  <h3 className="text-2xl font-black mb-4">{sol.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">{sol.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="section-1" className="py-24 bg-transparent overflow-hidden text-left">
          <div className="px-6 md:px-24 mb-12 flex items-center gap-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">레퍼런스</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="space-y-24">
            <div>
              <div className="px-6 md:px-24 flex items-center gap-3 mb-10"><div className="w-8 h-1 bg-violet-500 rounded-full" /><h3 className="text-2xl font-black">숏폼 마케팅</h3></div>
              <HorizontalScrollContainer>{INITIAL_REFERENCES.filter(r => r.type === 'Short-form').map(video => <VideoCard key={video.id} video={video} isShort />)}</HorizontalScrollContainer>
            </div>
            <div>
              <div className="px-6 md:px-24 flex items-center gap-3 mb-10"><div className="w-8 h-1 bg-violet-500 rounded-full" /><h3 className="text-2xl font-black">롱폼 기획 제작</h3></div>
              <HorizontalScrollContainer>{INITIAL_REFERENCES.filter(r => r.type === 'Long-form').map(video => <VideoCard key={video.id} video={video} />)}</HorizontalScrollContainer>
            </div>
          </div>
        </section>

        <section id="section-2" className="py-24 px-6 md:px-24 bg-transparent relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-20">
              <span className="inline-block px-5 py-1.5 rounded-full bg-violet-500 text-white text-xs font-black mb-6 tracking-widest uppercase">limited event</span>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">무료 숏폼 광고 요청하기</h2>
              <p className="text-lg text-gray-500 font-medium">선착순 혜택이 곧 종료됩니다. 지금 바로 무료 진단을 예약하세요.</p>
            </div>
            <InquiryForm onSubmit={saveInquiry} />
          </div>
        </section>

        <footer className="py-20 border-t border-white/5 px-6 md:px-24 text-center">
          <div className="text-2xl font-black mb-8 text-violet-500 opacity-40">{settings.agencyName}</div>
          <div className="text-xs text-gray-800 font-medium space-y-2">
            <p>주식회사 마켓꾸 / 사업자등록번호 373-87-03959 / 대표자 유승용 / 서울특별시 용산구 서빙고로 17</p>
            <p>© 2024 ENTERVIBECRE. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {isConsultationPageOpen && <ConsultationPage onClose={() => setIsConsultationPageOpen(false)} onSubmit={saveInquiry} />}
      </AnimatePresence>
    </div>
  );
};

export default App;
