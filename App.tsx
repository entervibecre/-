
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Video, BarChart3, Layout, Instagram, Youtube, MessageCircle, 
  Settings, ChevronRight, X, Plus, Trash2, Edit2, Check, Download,
  Menu, Play, Lock, User, ChevronLeft, TrendingUp, Users, Award, AlertCircle, Loader2, ExternalLink, Image as ImageIcon, Upload, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  Solution, VideoReference, Inquiry, SiteSettings, AdminTab 
} from './types';
import { 
  INITIAL_SOLUTIONS, INITIAL_REFERENCES, INITIAL_SETTINGS, TERMS_OF_SERVICE, PRIVACY_POLICY
} from './constants';

// Define prop interfaces for better parser stability in TSX
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
          <label className="text-base font-black text-gray-500 uppercase tracking-widest leading-[1.6]">성함 / 업체명</label>
          <input 
            required
            name="name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all focus:bg-white/10 font-bold"
            placeholder="예: 홍길동 팀장"
          />
        </div>
        <div className="space-y-4">
          <label className="text-base font-black text-gray-500 uppercase tracking-widest leading-[1.6]">연락처</label>
          <input 
            required
            name="contact"
            value={form.contact}
            onChange={e => setForm({...form, contact: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all focus:bg-white/10 font-bold"
            placeholder="010-0000-0000"
          />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-base font-black text-gray-500 uppercase tracking-widest leading-[1.6]">이메일 주소</label>
        <input 
          required
          name="email"
          type="email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all focus:bg-white/10 font-bold"
          placeholder="contact@example.com"
        />
      </div>
      <div className="space-y-4">
        <label className="text-base font-black text-gray-500 uppercase tracking-widest leading-[1.6]">상담 요청 내용 (필수)</label>
        <textarea 
          required
          name="message"
          value={form.message}
          onChange={e => setForm({...form, message: e.target.value})}
          rows={6}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all focus:bg-white/10 font-bold leading-[2.4] break-keep"
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

          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
              <h4 className="text-violet-500 font-black text-xl mb-4">운영 전략</h4>
              <p className="text-gray-500 font-medium leading-relaxed">알고리즘 분석을 통한 채널 포지셔닝 및 정체성 확립</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
              <h4 className="text-violet-500 font-black text-xl mb-4">홍보 매칭</h4>
              <p className="text-gray-500 font-medium leading-relaxed">브랜드 이미지에 최적화된 고효율 인플루언서 네트워크 연결</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
              <h4 className="text-violet-500 font-black text-xl mb-4">성과 관리</h4>
              <p className="text-gray-500 font-medium leading-relaxed">실시간 데이터 모니터링 및 지속적인 퍼포먼스 최적화</p>
            </div>
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
      <button 
        onClick={() => scroll('left')}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full glass-panel opacity-0 group-hover/scroll:opacity-100 transition-all hidden md:flex items-center justify-center bg-black/80 hover:bg-violet-600 border border-white/10"
      >
        <ChevronLeft size={32} />
      </button>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-8 md:gap-10 px-6 md:px-24 pb-12 no-scrollbar scroll-smooth"
      >
        {children}
        <div className="flex-shrink-0 w-16 md:w-24" />
      </div>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full glass-panel opacity-0 group-hover/scroll:opacity-100 transition-all hidden md:flex items-center justify-center bg-black/80 hover:bg-violet-600 border border-white/10"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

interface LoginModalProps {
  onClose: () => void;
  onLogin: (id: string, pw: string) => boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(id, pw)) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg glass-panel p-10 md:p-16 rounded-[2.5rem] md:rounded-[3rem] border border-white/10"
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black flex items-center gap-4 tracking-tight leading-[1.6] break-keep"><Lock size={28} className="text-violet-500"/> 관리 시스템 로그인</h2>
          <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full transition-all"><X size={28}/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="text-sm font-black text-gray-500 uppercase flex items-center gap-2 tracking-widest leading-none"><User size={16}/> 아이디</label>
            <input 
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg font-bold focus:border-violet-500 outline-none transition-all"
              value={id}
              onChange={e => setId(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-black text-gray-500 uppercase flex items-center gap-2 tracking-widest leading-none"><Lock size={16}/> 비밀번호</label>
            <input 
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg font-bold focus:border-violet-500 outline-none transition-all"
              value={pw}
              onChange={e => setPw(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm md:text-base font-black text-center leading-[1.6] break-keep">인증 정보가 올바르지 않습니다.</p>}
          <button className="w-full py-5 bg-violet-600 rounded-2xl font-black text-xl md:text-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/20 active:scale-95">
            로그인
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

interface AdminPanelProps {
  onClose: () => void;
  onLogout: () => void;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  settings: SiteSettings;
  onUpdateSettings: (s: SiteSettings) => void;
  solutions: Solution[];
  onUpdateSolutions: (s: Solution[]) => void;
  references: VideoReference[];
  onUpdateReferences: (r: VideoReference[]) => void;
  inquiries: Inquiry[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onClose, onLogout, activeTab, setActiveTab, settings, onUpdateSettings, 
  solutions, onUpdateSolutions, references, onUpdateReferences, inquiries 
}) => {
  const handleThumbnailUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...references];
        updated[index].thumbnail = reader.result as string;
        onUpdateReferences(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col md:flex-row animate-in fade-in">
      {/* Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 p-8 flex flex-col bg-zinc-950">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-violet-500 leading-tight tracking-tighter">EntervibeCre</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Management Console</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full transition-all"><X size={24}/></button>
        </div>
        <nav className="space-y-6 flex-grow overflow-x-auto md:overflow-x-visible flex md:flex-col pb-4 md:pb-0">
          {[
            { id: 'leads', label: '문의데이터', icon: BarChart3 },
            { id: 'content', label: '콘텐츠', icon: Layout },
            { id: 'appearance', label: '디자인', icon: Edit2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex-shrink-0 md:w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-lg md:text-xl ${activeTab === tab.id ? 'bg-violet-600 shadow-xl shadow-violet-600/30 text-white' : 'hover:bg-white/5 text-gray-500 hover:text-gray-300'}`}
            >
              <tab.icon size={22} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="space-y-8 pt-8 border-t border-white/10 hidden md:block">
          <button onClick={onLogout} className="w-full flex items-center gap-3 text-lg text-red-500 hover:text-red-400 font-black transition-colors">
            <Lock size={18} /> 로그아웃
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-all group" onClick={onClose}>
            미리보기 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-8 md:p-16 bg-black">
        {activeTab === 'content' && (
          <div className="max-w-5xl space-y-20">
            <section>
              <h3 className="text-3xl md:text-4xl font-black mb-12 tracking-tight leading-[2.5] break-keep">솔루션 관리</h3>
              <div className="grid gap-10">
                {solutions.map((sol, i) => (
                  <div key={sol.id} className="glass-panel p-8 md:p-12 rounded-[2.5rem] flex flex-col gap-10 shadow-lg">
                    <div className="flex items-center gap-8">
                       <div className="p-4 rounded-2xl bg-violet-600/10 text-violet-500">
                          {sol.iconName === 'Video' && <Video size={32} />}
                          {sol.iconName === 'BarChart3' && <BarChart3 size={32} />}
                          {sol.iconName === 'Layout' && <Layout size={32} />}
                       </div>
                       <input 
                        className="bg-transparent text-2xl md:text-3xl font-black border-b border-white/5 focus:border-violet-500 outline-none w-full py-4 transition-all"
                        value={sol.title}
                        onChange={e => {
                          const updated = [...solutions];
                          updated[i].title = e.target.value;
                          onUpdateSolutions(updated);
                        }}
                      />
                    </div>
                    <textarea 
                      className="bg-zinc-900/50 text-gray-300 text-lg md:text-xl border-2 border-transparent focus:border-violet-500/20 outline-none w-full p-8 rounded-2xl leading-[2.4] font-medium transition-all break-keep"
                      value={sol.description}
                      rows={4}
                      onChange={e => {
                        const updated = [...solutions];
                        updated[i].description = e.target.value;
                        onUpdateSolutions(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-[2.5] break-keep">레퍼런스 관리</h3>
                <button 
                  onClick={() => onUpdateReferences([{ id: Date.now().toString(), type: 'Long-form', title: '새 레퍼런스', embedUrl: '', thumbnail: '' }, ...references])}
                  className="flex items-center gap-3 bg-violet-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-violet-700 transition-all shadow-lg active:scale-95"
                >
                  <Plus size={28}/> 추가
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                {references.map((ref, i) => (
                  <div key={ref.id} className="glass-panel p-8 md:p-10 rounded-[2.5rem] flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                      <select 
                        className="bg-zinc-800 text-base rounded-full px-6 py-3 font-black text-violet-400 outline-none border border-white/10"
                        value={ref.type}
                        onChange={e => {
                          const updated = [...references];
                          updated[i].type = e.target.value as any;
                          onUpdateReferences(updated);
                        }}
                      >
                        <option>Long-form</option>
                        <option>Short-form</option>
                      </select>
                      <button 
                        onClick={() => onUpdateReferences(references.filter((_, idx) => idx !== i))}
                        className="text-gray-600 hover:text-red-500 p-3 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={28}/>
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">영상 제목</label>
                        <input 
                          className="w-full bg-zinc-900 p-5 rounded-xl text-xl font-bold outline-none border border-white/5 focus:border-violet-500"
                          placeholder="영상 제목"
                          value={ref.title}
                          onChange={e => {
                            const updated = [...references];
                            updated[i].title = e.target.value;
                            onUpdateReferences(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">영상 클릭 시 이동할 URL</label>
                         <input 
                          className="w-full bg-zinc-900 p-5 rounded-xl text-xs outline-none border border-white/5 focus:border-violet-500 font-mono text-violet-400"
                          placeholder="예: https://www.youtube.com/watch?v=..."
                          value={ref.embedUrl}
                          onChange={e => {
                            const updated = [...references];
                            updated[i].embedUrl = e.target.value;
                            onUpdateReferences(updated);
                          }}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">썸네일 이미지</label>
                        <div className="relative group/thumb aspect-video rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex flex-col items-center justify-center gap-4 transition-all hover:border-violet-500/40">
                          {ref.thumbnail ? (
                            <>
                              <img src={ref.thumbnail} className="w-full h-full object-cover opacity-60 group-hover/thumb:opacity-40 transition-opacity" alt="미리보기" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-black text-sm shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform">
                                  <Upload size={16}/> 이미지 교체
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleThumbnailUpload(i, e)} />
                                </label>
                              </div>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="text-gray-700" size={40} />
                              <label className="cursor-pointer bg-violet-600 text-white px-8 py-4 rounded-xl font-black text-base shadow-xl flex items-center gap-2 hover:bg-violet-700 hover:scale-105 transition-all">
                                <Upload size={20}/> 이미지 업로드
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleThumbnailUpload(i, e)} />
                              </label>
                              <p className="text-[10px] text-gray-600 font-bold">권장 사이즈: 1280x720 (16:9)</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="max-w-4xl space-y-20">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-[2.5] break-keep">브랜드 및 SNS 설정</h3>
            <div className="glass-panel p-10 md:p-14 rounded-[3rem] space-y-16">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <label className="text-sm font-black text-gray-500 uppercase tracking-widest leading-[1.6]">포인트 컬러</label>
                  <div className="flex gap-6">
                    <input type="color" className="w-16 h-16 bg-transparent border-0 cursor-pointer rounded-2xl overflow-hidden shadow-lg" value={settings.primaryColor} onChange={e => onUpdateSettings({...settings, primaryColor: e.target.value})} />
                    <input className="bg-zinc-900 p-5 rounded-2xl flex-grow text-xl font-mono border border-white/5 outline-none focus:border-violet-500 font-bold" value={settings.primaryColor} onChange={e => onUpdateSettings({...settings, primaryColor: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-6">
                  <label className="text-sm font-black text-gray-500 uppercase tracking-widest leading-[1.6]">브랜드 명칭</label>
                  <input className="w-full bg-zinc-900 p-5 rounded-2xl text-2xl border border-white/5 outline-none focus:border-violet-500 font-black tracking-tighter" value={settings.agencyName} onChange={e => onUpdateSettings({...settings, agencyName: e.target.value})} />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest leading-[1.6]">유튜브 URL</label>
                  <input className="w-full bg-zinc-900 p-4 rounded-xl text-sm border border-white/5 outline-none focus:border-violet-500 font-bold" value={settings.youtubeUrl} onChange={e => onUpdateSettings({...settings, youtubeUrl: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest leading-[1.6]">인스타그램 URL</label>
                  <input className="w-full bg-zinc-900 p-4 rounded-xl text-sm border border-white/5 outline-none focus:border-violet-500 font-bold" value={settings.instagramUrl} onChange={e => onUpdateSettings({...settings, instagramUrl: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest leading-[1.6]">카카오톡 URL</label>
                  <input className="w-full bg-zinc-900 p-4 rounded-xl text-sm border border-white/5 outline-none focus:border-violet-500 font-bold" value={settings.kakaoUrl} onChange={e => onUpdateSettings({...settings, kakaoUrl: e.target.value})} />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-sm font-black text-gray-500 uppercase tracking-widest leading-[1.6]">메인 타이틀</label>
                <input className="w-full bg-zinc-900 p-8 rounded-2xl text-4xl border border-white/5 outline-none focus:border-violet-500 font-black tracking-tight" value={settings.heroTitle} onChange={e => onUpdateSettings({...settings, heroTitle: e.target.value})} />
              </div>
              <div className="space-y-6">
                <label className="text-sm font-black text-gray-500 uppercase tracking-widest leading-[1.6]">슬로건 (컴마로 구분)</label>
                <textarea className="w-full bg-zinc-900 p-8 rounded-2xl text-2xl border border-white/5 outline-none focus:border-violet-500 font-bold leading-[2.4]" rows={3} value={settings.heroSlogan} onChange={e => onUpdateSettings({...settings, heroSlogan: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div>
                <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-[2.5] break-keep">상담 요청 내역</h3>
                <p className="text-gray-400 text-xl mt-5 font-medium tracking-tight">수집 데이터: <span className="text-violet-500 font-black">{inquiries.length}건</span></p>
              </div>
              <button className="flex items-center gap-4 bg-white text-black px-10 py-5 rounded-[2rem] font-black text-xl md:text-2xl hover:bg-gray-200 transition-all shadow-lg active:scale-95">
                <Download size={28}/> CSV 추출
              </button>
            </div>
            <div className="glass-panel rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-xl border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-xs text-gray-500 font-black uppercase tracking-[0.4em]">
                    <tr>
                      <th className="p-10">접수일</th>
                      <th className="p-10">요청자</th>
                      <th className="p-10">연락처</th>
                      <th className="p-10">문의상세</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inquiries.length === 0 ? (
                      <tr><td colSpan={4} className="p-32 text-center text-gray-600 text-3xl font-black italic">수집된 데이터가 없습니다.</td></tr>
                    ) : (
                      inquiries.map(lead => (
                        <tr key={lead.id} className="hover:bg-white/5 transition-all group">
                          <td className="p-10 text-base font-mono text-gray-600">{lead.date.split(' ')[0]}</td>
                          <td className="p-10 font-black text-2xl text-white group-hover:text-violet-400 transition-colors">{lead.name}</td>
                          <td className="p-10 text-xl text-gray-300 font-bold">{lead.contact}</td>
                          <td className="p-10">
                            <div className="max-w-md text-lg text-gray-500 line-clamp-2 group-hover:line-clamp-none transition-all duration-500 leading-[2.4] font-medium break-keep">
                              {lead.message}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 40;
    const y = (clientY / innerHeight - 0.5) * 40;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Persistence logic
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
    try {
      const response = await fetch('https://formspree.io/f/mgoowpgo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(inquiry)
      });
      
      if (!response.ok) {
        console.error('Formspree submission failed');
      }
    } catch (error) {
      console.error('Error submitting to Formspree:', error);
    }

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

  const toggleAdmin = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
    } else {
      setIsAdminMode(!isAdminMode);
    }
  };

  const handleLogin = (id: string, pw: string) => {
    if (id === 'entervibecre' && pw === 'PLMokn12#$') {
      setIsAuthenticated(true);
      localStorage.setItem('evc_auth', 'true');
      setShowLogin(false);
      setIsAdminMode(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminMode(false);
    localStorage.removeItem('evc_auth');
  };

  const scrollToInquiry = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('section-2');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openConsultation = () => {
    setIsConsultationPageOpen(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openLegal = (type: 'terms' | 'privacy') => {
    setActiveLegalView(type);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-violet-500 selection:text-white ${isAdminMode || isConsultationPageOpen || activeLegalView ? 'overflow-hidden h-screen' : ''}`}>
      {/* Navigation */}
      {!isAdminMode && !isConsultationPageOpen && !activeLegalView && (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-500">
          <div className="text-xl md:text-2xl font-black tracking-tighter" style={{ color: settings.primaryColor }}>
            {settings.agencyName}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleAdmin}
              className={`p-2 rounded-full transition-all ${isAuthenticated ? 'text-violet-400 scale-105' : 'hover:bg-white/10 opacity-60 hover:opacity-100'}`}
            >
              <Settings size={22} />
            </button>
          </div>
        </nav>
      )}

      {/* Social Floating Icons */}
      {!isAdminMode && !isConsultationPageOpen && !activeLegalView && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex flex-col gap-4">
          {[
            { Icon: Youtube, color: 'hover:bg-red-600', url: settings.youtubeUrl },
            { Icon: Instagram, color: 'hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500', url: settings.instagramUrl },
            { Icon: MessageCircle, color: 'hover:bg-violet-600', url: settings.kakaoUrl }
          ].map(({ Icon, color, url }, i) => (
            <a 
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3.5 md:p-4 rounded-full glass-panel transition-all hover:scale-110 shadow-xl hover:shadow-violet-500/20 ${color}`}
            >
              <Icon size={24} className="md:w-7 md:h-7" />
            </a>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className={isAdminMode || isConsultationPageOpen || activeLegalView ? 'hidden' : 'block'}>
        {/* Hero Section */}
        <section 
          onMouseMove={handleMouseMove}
          className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden bg-black cursor-default"
        >
          {/* Main Dark Mesh Background (Replaced potentially confusing images) */}
          <motion.div 
            style={{ 
              x: springX,
              y: springY,
              background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
              scale: 1.15
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0 pointer-events-none"
          />
          
          {/* Dynamic Light Spot */}
          <motion.div 
            style={{ 
              x: useTransform(springX, (v) => v * -1.5),
              y: useTransform(springY, (v) => v * -1.5),
              background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
              width: '100vw',
              height: '100vh',
            }}
            className="absolute inset-0 z-[1] pointer-events-none"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black z-[2] pointer-events-none" />
          <div className="absolute inset-0 z-[2] pointer-events-none" 
               style={{ background: 'radial-gradient(circle at center, transparent 30%, black 100%)' }} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl"
          >
            <h1 className="text-5xl md:text-[9vw] font-black tracking-tighter mb-8 md:mb-10 leading-[1.35] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 break-keep">
              {settings.heroTitle}
            </h1>
            
            <div className="space-y-6 md:space-y-10 mb-12 md:mb-16">
              {settings.heroSlogan.split(',').map((text, idx) => (
                <motion.p 
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.15, duration: 0.8 }}
                  className={`text-xl md:text-5xl font-bold tracking-tight leading-[1.4] md:leading-[1.8] break-keep ${idx === 1 ? 'text-white' : 'text-white/40'}`}
                >
                  {idx === 1 ? (
                    <span className="relative inline-block">
                      <span style={{ color: settings.primaryColor }} className="font-black italic">
                        {text.trim().split(' ')[0]} {text.trim().split(' ')[1]}
                      </span>
                      <span> {text.trim().split(' ').slice(2).join(' ')}</span>
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.2, duration: 1, ease: "circOut" }}
                        className="absolute -bottom-2 left-0 w-full h-1 bg-violet-500/30 rounded-full origin-left"
                      />
                    </span>
                  ) : (
                    text.trim() + (idx === 0 ? ',' : '')
                  )}
                </motion.p>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <a 
                href="#section-2" 
                onClick={scrollToInquiry}
                className="group relative inline-flex items-center gap-3 px-10 py-5 md:px-12 md:py-6 rounded-full bg-white text-black font-black text-lg md:text-xl hover:scale-105 transition-all shadow-xl"
              >
                <span className="relative z-10">무료 숏폼 광고 신청하기</span>
                <ChevronRight size={24} className="group-hover:translate-x-1.5 transition-transform relative z-10" />
                <div className="absolute inset-0 rounded-full bg-violet-500 blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-500" />
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Solutions Section */}
        <section id="section-0" className="py-24 md:py-32 px-6 md:px-24 bg-zinc-950 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-24 md:mb-32 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm md:text-base font-black mb-8 shadow-sm cursor-default">
                <Award size={20} /> 실전 데이터로 증명합니다
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-10 leading-[1.65] md:leading-[1.7] tracking-tighter break-keep">
                단순한 대행이 아닌,<br/>
                <span style={{ color: settings.primaryColor }} className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-violet-600">100여 개의 채널</span>을 <br className="md:hidden" />직접 운영하는<br/>실전 전문가 집단
              </h2>
              <p className="text-lg md:text-2xl text-gray-400 max-w-4xl mx-auto font-medium leading-[1.2] md:leading-[2.4] tracking-tight break-keep">
                현재 대형 인플루언서 매니지먼트 및 100여 개의 자사 채널을 직접 운영하며 쌓은 
                <br className="hidden md:block" />
                독보적인 데이터로 당신의 성장을 견인합니다.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-24 md:mb-32">
              {solutions.map((sol, i) => (
                <motion.div 
                  key={sol.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] hover:border-violet-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col items-start text-left"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[1.5rem] bg-violet-500/10 flex items-center justify-center mb-8 text-violet-500 group-hover:scale-105 transition-transform duration-500">
                    {sol.iconName === 'Video' && <Video size={32} />}
                    {sol.iconName === 'BarChart3' && <BarChart3 size={32} />}
                    {sol.iconName === 'Layout' && <Layout size={32} />}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-6 tracking-tight group-hover:text-violet-400 transition-colors leading-[1.6] break-keep">
                    {sol.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-400 leading-[2.4] font-medium break-keep">
                    {sol.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-10 md:p-24 rounded-[3rem] md:rounded-[4rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-16 md:gap-20 items-center">
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl md:text-5xl font-black mb-10 leading-[1.65] md:leading-[1.7] tracking-tighter break-keep">
                    성과는 압도적으로,<br/>
                    <span className="text-violet-500">비용은 혁신적으로.</span>
                  </h3>
                  <p className="text-lg md:text-xl text-gray-400 font-medium leading-[1.2] md:leading-[2.4] break-keep">
                    거품을 걷어낸 실전 중심의 합리적 가격 정책으로<br className="hidden md:block"/> 
                    부담 없이 최고의 성장을 경험할 수 있습니다.
                  </p>
                </div>
                
                <div className="w-full lg:w-auto flex flex-col gap-8 md:gap-12">
                  <div className="glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-white/5 hover:border-violet-500/20 transition-all duration-500 min-w-[280px]">
                    <p className="text-violet-400 text-sm md:text-base font-black mb-4 uppercase tracking-widest">채널 운영 단가</p>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-gray-500 text-xl font-bold">월</span>
                      <span className="text-4xl md:text-5xl font-black text-white">100만원</span>
                      <span className="text-gray-500 text-lg font-bold">부터</span>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base font-medium leading-[2.1] break-keep">전담 PD 매칭 및 브랜딩 영상 제작</p>
                  </div>
                  
                  <div className="glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-white/5 hover:border-violet-500/20 transition-all duration-500 min-w-[280px]">
                    <p className="text-violet-400 text-sm md:text-base font-black mb-4 uppercase tracking-widest">상품 홍보 단가</p>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-gray-500 text-xl font-bold">건당</span>
                      <span className="text-4xl md:text-5xl font-black text-white">15만원</span>
                      <span className="text-gray-500 text-lg font-bold">부터</span>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base font-medium">제품 영상 제작 및 유튜브,SNS 홍보 확산</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 md:mt-20 flex justify-center">
                <button 
                  onClick={openConsultation}
                  className="flex items-center gap-4 px-12 py-6 md:px-16 md:py-8 rounded-full bg-violet-600 font-black text-xl md:text-2xl hover:bg-violet-700 hover:scale-105 transition-all shadow-xl shadow-violet-600/30 group active:scale-95"
                >
                  상담 신청하고 성장 시작하기
                  <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Reference Section */}
        <section id="section-1" className="py-24 md:py-32 bg-black overflow-hidden relative">
          <div className="px-6 md:px-24 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="md:max-w-none text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter italic leading-[1.6] break-keep">레퍼런스</h2>
              <p className="text-lg md:text-xl text-gray-500 font-medium tracking-tight leading-[2.4] break-keep md:whitespace-nowrap">
                EntervibeCre가 만들어낸 실제 사례들입니다. (이미지를 클릭하면 영상으로 연결됩니다)
              </p>
            </div>
            <div className="flex items-center gap-2 text-violet-500/40 font-black text-sm md:text-base animate-pulse">
              <ChevronLeft size={20} /> 가로로 스크롤 <ChevronRight size={20} />
            </div>
          </div>
          
          <div className="flex flex-col gap-24 md:gap-32">
            <div>
              <div className="px-6 md:px-24 flex items-center gap-4 mb-8 md:mb-12">
                <div className="w-10 h-1 bg-violet-500 rounded-full" />
                <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-[1.6] break-keep">롱폼 기획 제작</h3>
              </div>
              <HorizontalScrollContainer>
                {references.filter(r => r.type === 'Long-form').map(video => (
                   <VideoCard key={video.id} video={video} />
                ))}
              </HorizontalScrollContainer>
            </div>

            <div>
              <div className="px-6 md:px-24 flex items-center gap-4 mb-8 md:mb-12">
                <div className="w-10 h-1 bg-violet-500 rounded-full" />
                <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-[1.6] break-keep">숏폼 마케팅</h3>
              </div>
              <HorizontalScrollContainer>
                {references.filter(r => r.type === 'Short-form').map(video => (
                   <VideoCard key={video.id} video={video} isShort />
                ))}
              </HorizontalScrollContainer>
            </div>
          </div>
        </section>

        {/* Inquiry Form Section */}
        <section id="section-2" className="py-24 md:py-32 px-6 md:px-24 bg-zinc-950 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16 md:mb-24">
              <span className="inline-block px-6 py-2 rounded-full bg-violet-500 text-white text-sm md:text-base font-black mb-8 tracking-widest shadow-lg shadow-violet-500/10">
                이벤트 마감 임박
              </span>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.65] md:leading-[1.7] tracking-tighter break-keep">
                이벤트<br/>무료 숏폼 광고 요청하기
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-medium leading-[1.2] md:leading-[2.4] max-w-2xl mx-auto break-keep">
                선착순 혜택이 곧 종료됩니다. <br className="md:hidden" /> 지금 바로 전문가의 무료 진단을 예약하세요.
              </p>
            </div>
            
            <InquiryForm onSubmit={handleAddInquiry} />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 md:py-24 border-t border-white/5 px-6 md:px-24 bg-black text-center">
          <div className="text-2xl md:text-3xl font-black mb-10 tracking-tighter text-violet-500 opacity-40 leading-[1.6] break-keep">
            {settings.agencyName}
          </div>
          <p className="text-base md:text-lg text-gray-500 font-medium mb-10 leading-[2.4] max-w-3xl mx-auto break-keep">
            대한민국 유튜브 성장의 새로운 기준. <br /> EntervibeCre가 당신의 가치를 증명합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm md:text-base uppercase tracking-widest text-gray-600 font-black mb-10">
            <button onClick={() => openLegal('terms')} className="hover:text-white transition-all">이용약관</button>
            <button onClick={() => openLegal('privacy')} className="hover:text-white transition-all">개인정보처리방침</button>
          </div>
          <div className="text-xs md:text-sm text-gray-700 font-medium mb-12 space-y-2 leading-relaxed tracking-tight">
            <p>주식회사 마켓꾸 / 사업자등록번호 373-87-03959 / 대표자 유승용 / 서울특별시 용산구 서빙고로 17, 용산센트럴파크</p>
            <p className="opacity-50 tracking-[0.2em]">© 2024 ENTERVIBECRE. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {activeLegalView && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-0 z-[120] bg-black overflow-y-auto px-6 py-20 md:px-24"
          >
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => setActiveLegalView(null)}
                className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-16 text-lg font-black"
              >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                뒤로 가기
              </button>
              
              <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter">
                {activeLegalView === 'terms' ? '이용약관' : '개인정보처리방침'}
              </h2>
              
              <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/10 text-gray-400 leading-[2.2] font-medium whitespace-pre-wrap break-keep">
                {activeLegalView === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY}
              </div>
              
              <div className="mt-16 text-center">
                <button 
                  onClick={() => setActiveLegalView(null)}
                  className="px-10 py-4 rounded-full bg-white text-black font-black hover:scale-105 transition-all shadow-xl"
                >
                  닫기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConsultationPageOpen && (
          <ConsultationPage 
            onClose={() => setIsConsultationPageOpen(false)}
            onSubmit={handleAddInquiry}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <LoginModal 
            onClose={() => setShowLogin(false)} 
            onLogin={handleLogin} 
          />
        )}
      </AnimatePresence>

      {isAdminMode && (
        <AdminPanel 
          onClose={() => setIsAdminMode(false)} 
          onLogout={handleLogout}
          activeTab={activeAdminTab}
          setActiveTab={setActiveAdminTab}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          solutions={solutions}
          onUpdateSolutions={handleUpdateSolutions}
          references={references}
          onUpdateReferences={handleUpdateReferences}
          inquiries={inquiries}
        />
      )}
    </div>
  );
};

export default App;
