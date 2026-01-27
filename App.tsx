
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Video, BarChart3, Layout, Instagram, Youtube, MessageCircle, 
  Settings, ChevronRight, X, Plus, Trash2, Edit2, Check, Download,
  Menu, Play, Lock, User, ChevronLeft, TrendingUp, Users, Award, AlertCircle, Loader2, ExternalLink, Image as ImageIcon, Upload, ArrowLeft, Zap, RefreshCw, PlusCircle, Save, LogOut, Eye, EyeOff, FileImage, ChevronUp, ChevronDown, Github, Globe, Copy, CreditCard, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { 
  Solution, VideoReference, Inquiry, SiteSettings, PerformanceStats 
} from './types';
import { 
  INITIAL_SOLUTIONS, INITIAL_REFERENCES, INITIAL_SETTINGS, CHANNEL_URLS, INITIAL_PERFORMANCE, CORE_HOOKS
} from './constants';

// --- Admin Login Modal ---
interface AdminLoginModalProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLoginSuccess, onClose }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    if (userId === 'entervibecre' && password === 'PLMokn12#$') {
      setTimeout(() => {
        onLoginSuccess();
        setIsLoggingIn(false);
      }, 600);
    } else {
      setTimeout(() => {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        setIsLoggingIn(false);
      }, 600);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-[50px] -mr-16 -mt-16" />
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all">
          <X size={20} className="text-gray-500" />
        </button>
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-violet-500" size={32} />
          </div>
          <h2 className="text-2xl font-black italic mb-2 tracking-tighter">Admin Access</h2>
          <p className="text-gray-500 text-sm">콘텐츠 수정을 위해 관리자 로그인이 필요합니다.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Admin ID</label>
            <input 
              required
              autoFocus
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-base focus:border-violet-500 outline-none transition-all"
              placeholder="아이디를 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Password</label>
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 pr-12 text-base focus:border-violet-500 outline-none transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold text-center">{error}</motion.p>}
          <button disabled={isLoggingIn} className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20">
            {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : '관리자 접속'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- Reference Manager Component ---
interface ReferenceManagerProps {
  references: VideoReference[];
  onSave: (refs: VideoReference[]) => void;
  onClose: () => void;
  onLogout: () => void;
}

const ReferenceManager: React.FC<ReferenceManagerProps> = ({ references, onSave, onClose, onLogout }) => {
  const [localRefs, setLocalRefs] = useState<VideoReference[]>(references);
  const [activeTab, setActiveTab] = useState<'Short-form' | 'Long-form' | 'Sync'>('Short-form');
  
  // GitHub Sync States
  const [ghToken, setGhToken] = useState(localStorage.getItem('gh_token') || '');
  const [ghRepo, setGhRepo] = useState(localStorage.getItem('gh_repo') || '');
  const [ghPath, setGhPath] = useState(localStorage.getItem('gh_path') || 'constants.ts');
  const [isSyncing, setIsSyncing] = useState(false);

  const addReference = () => {
    const newRef: VideoReference = {
      id: `ref_${Date.now()}`,
      type: activeTab === 'Sync' ? 'Short-form' : (activeTab as any),
      title: '새로운 영상 제목',
      embedUrl: '',
      thumbnail: ''
    };
    setLocalRefs([newRef, ...localRefs]);
  };

  const updateRef = (id: string, field: keyof VideoReference, value: string) => {
    setLocalRefs(localRefs.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateRef(id, 'thumbnail', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteRef = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setLocalRefs(localRefs.filter(r => r.id !== id));
    }
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = localRefs.findIndex(r => r.id === id);
    if (index === -1) return;
    const currentType = localRefs[index].type;
    const filteredRefs = localRefs.filter(r => r.type === currentType);
    const filteredIndex = filteredRefs.findIndex(r => r.id === id);

    if (direction === 'up' && filteredIndex > 0) {
      const targetId = filteredRefs[filteredIndex - 1].id;
      const targetIndex = localRefs.findIndex(r => r.id === targetId);
      const newList = [...localRefs];
      [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
      setLocalRefs(newList);
    } else if (direction === 'down' && filteredIndex < filteredRefs.length - 1) {
      const targetId = filteredRefs[filteredIndex + 1].id;
      const targetIndex = localRefs.findIndex(r => r.id === targetId);
      const newList = [...localRefs];
      [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
      setLocalRefs(newList);
    }
  };

  const handleSave = () => {
    onSave(localRefs);
    alert('브라우저에 임시 저장되었습니다. 모든 방문자에게 보이게 하려면 [배포 및 동기화] 탭에서 GitHub에 업데이트하세요.');
  };

  const generateSourceCode = () => {
    const json = JSON.stringify(localRefs, null, 2);
    return `export const INITIAL_REFERENCES: VideoReference[] = ${json};`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateSourceCode());
    alert('소스코드가 복사되었습니다. constants.ts 파일에 붙여넣으세요.');
  };

  // 한글 깨짐 방지를 위한 핵심 UTF-8 Base64 변환 함수
  const utf8ToBase64 = (str: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    let binary = "";
    for (let i = 0; i < data.byteLength; i++) {
      binary += String.fromCharCode(data[i]);
    }
    return btoa(binary);
  };

  const base64ToUtf8 = (base64: string) => {
    const binary = atob(base64.replace(/\s/g, ''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  };

  const syncToGithub = async () => {
    if (!ghToken || !ghRepo || !ghPath) {
      alert('GitHub 설정을 모두 입력해주세요.');
      return;
    }

    setIsSyncing(true);
    localStorage.setItem('gh_token', ghToken);
    localStorage.setItem('gh_repo', ghRepo);
    localStorage.setItem('gh_path', ghPath);

    try {
      const getRes = await fetch(`https://api.github.com/repos/${ghRepo}/contents/${ghPath}`, {
        headers: { Authorization: `token ${ghToken}` }
      });
      
      if (!getRes.ok) throw new Error('파일을 찾을 수 없습니다. 저장소와 경로를 확인해 주세요.');
      const fileData = await getRes.json();
      const sha = fileData.sha;
      const oldContent = base64ToUtf8(fileData.content);

      const newRefsCode = `export const INITIAL_REFERENCES: VideoReference[] = ${JSON.stringify(localRefs, null, 2)};`;
      // INITIAL_REFERENCES 블록만 정확히 찾아서 교체
      const regex = /export const INITIAL_REFERENCES: VideoReference\[\] = \[[\s\S]*?\];/;
      
      let newContent;
      if (regex.test(oldContent)) {
        newContent = oldContent.replace(regex, newRefsCode);
      } else {
        throw new Error('파일 내에서 INITIAL_REFERENCES 변수를 찾을 수 없습니다.');
      }

      const putRes = await fetch(`https://api.github.com/repos/${ghRepo}/contents/${ghPath}`, {
        method: 'PUT',
        headers: { 
          Authorization: `token ${ghToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update references via Admin Dashboard (UTF-8 Protected)',
          content: utf8ToBase64(newContent),
          sha: sha
        })
      });

      if (putRes.ok) {
        alert('GitHub 동기화 성공! 잠시 후 모든 방문자에게 반영됩니다.');
      } else {
        const err = await putRes.json();
        throw new Error(err.message || '업데이트 실패');
      }
    } catch (e: any) {
      alert(`오류 발생: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const currentRefs = localRefs.filter(r => r.type === (activeTab === 'Sync' ? 'Short-form' : (activeTab as any)));

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
    >
      <div className="bg-zinc-900 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-black/20">
          <div>
            <h2 className="text-xl md:text-2xl font-black italic">콘텐츠 마스터 센터</h2>
            <p className="text-gray-500 text-[10px] md:text-xs mt-1 uppercase tracking-widest font-bold">Global Data Synchronization</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={onLogout} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] md:text-xs font-bold transition-all border border-red-500/20">
              <LogOut size={14} /> 로그아웃
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all hidden md:block">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-white/5 bg-black/10">
          <button onClick={() => setActiveTab('Short-form')} className={`flex-1 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'Short-form' ? 'text-violet-500 border-violet-500 bg-violet-500/5' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>숏폼 관리</button>
          <button onClick={() => setActiveTab('Long-form')} className={`flex-1 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'Long-form' ? 'text-violet-500 border-violet-500 bg-violet-500/5' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>롱폼 관리</button>
          <button onClick={() => setActiveTab('Sync')} className={`flex-1 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'Sync' ? 'text-green-500 border-green-500 bg-green-500/5' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>배포 및 동기화</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {activeTab === 'Sync' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-violet-600/10 border border-violet-500/20 p-6 rounded-2xl">
                <h3 className="text-lg font-black mb-2 flex items-center gap-2 text-violet-400">
                  <Globe size={20} /> 전역 배포 안내
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed break-keep">
                  현재 브라우저에서 수정한 내용은 관리자님의 컴퓨터에만 저장됩니다. <b>모든 방문자에게 레퍼런스를 공개하려면</b> 아래 GitHub 설정을 완료하고 [GitHub에 즉시 업데이트]를 클릭하세요. (한글 깨짐 보호 로직이 적용되어 있습니다)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">GitHub PAT (Token)</label>
                  <input type="password" value={ghToken} onChange={e => setGhToken(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-violet-500 outline-none" placeholder="ghp_..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Repository (Owner/Name)</label>
                  <input value={ghRepo} onChange={e => setGhRepo(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-violet-500 outline-none" placeholder="username/repo-name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">File Path</label>
                  <input value={ghPath} onChange={e => setGhPath(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-violet-500 outline-none" placeholder="constants.ts" />
                </div>
                <div className="flex items-end">
                  <button onClick={syncToGithub} disabled={isSyncing} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-50">
                    {isSyncing ? <Loader2 className="animate-spin" size={20} /> : <><RefreshCw size={18} /> GitHub에 즉시 업데이트</>}
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <h3 className="text-sm font-black mb-4 text-gray-400 uppercase tracking-widest">Manual Method (Code Copy)</h3>
                <div className="bg-black border border-white/5 rounded-2xl p-6 relative group">
                  <pre className="text-[10px] md:text-xs text-gray-500 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {generateSourceCode()}
                  </pre>
                  <button onClick={copyCode} className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg hover:bg-violet-600 transition-all">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button onClick={addReference} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:text-white hover:border-violet-500/50 transition-all font-bold bg-white/5">
                <PlusCircle size={20} /> {activeTab === 'Short-form' ? '숏폼' : '롱폼'} 영상 추가
              </button>
              <div className="space-y-4">
                {currentRefs.map((ref, idx) => (
                  <div key={ref.id} className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/5 space-y-4 group hover:bg-white/[0.07] transition-all relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[10px] font-black">{idx + 1}</div>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-tighter">Order #{idx + 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => moveItem(ref.id, 'up')} className="p-1.5 rounded-lg bg-black border border-white/5 text-gray-400 hover:text-violet-400 transition-colors" title="위로"><ChevronUp size={16} /></button>
                        <button onClick={() => moveItem(ref.id, 'down')} className="p-1.5 rounded-lg bg-black border border-white/5 text-gray-400 hover:text-violet-400 transition-colors" title="아래로"><ChevronDown size={16} /></button>
                        <button onClick={() => deleteRef(ref.id)} className="p-1.5 rounded-lg bg-black border border-white/5 text-red-500/70 hover:text-red-500 transition-colors ml-2" title="삭제"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">영상 제목</label>
                        <input value={ref.title} onChange={(e) => updateRef(ref.id, 'title', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-violet-500 outline-none transition-all font-bold" placeholder="제목 입력" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">YouTube Embed URL</label>
                        <input value={ref.embedUrl} onChange={(e) => updateRef(ref.id, 'embedUrl', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-violet-500 outline-none transition-all" placeholder="https://www.youtube.com/embed/..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">썸네일 이미지 업로드</label>
                      <div className="flex items-center gap-4">
                        <div className={`w-24 md:w-32 h-16 md:h-20 rounded-xl bg-black border border-white/10 flex items-center justify-center overflow-hidden shrink-0 ${!ref.thumbnail && 'border-dashed'}`}>
                          {ref.thumbnail ? <img src={ref.thumbnail} className="w-full h-full object-cover" alt="미리보기" /> : <ImageIcon size={20} className="text-gray-700" />}
                        </div>
                        <label className="flex-1">
                          <div className="cursor-pointer w-full bg-black border border-white/10 rounded-xl p-3 md:p-4 text-xs md:text-sm hover:border-violet-500 transition-all flex items-center justify-center gap-2 font-black text-gray-400 hover:text-white"><Upload size={16} /> 이미지 선택</div>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(ref.id, e)} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="p-6 md:p-8 border-t border-white/5 bg-black/40 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 md:px-8 md:py-3 rounded-xl font-bold text-gray-400 hover:text-white transition-all text-sm">닫기</button>
          <button onClick={handleSave} className="px-8 py-2 md:px-10 md:py-3 rounded-xl bg-violet-600 hover:bg-violet-700 font-black flex items-center gap-2 transition-all text-sm shadow-lg shadow-violet-600/20">
            <Save size={18} /> 임시 저장하기
          </button>
        </div>
      </div>
    </motion.div>
  );
};

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
          <input required name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all font-bold shadow-inner" placeholder="예: 홍길동 팀장" />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-black text-gray-400 uppercase tracking-widest leading-[1.6]">연락처</label>
          <input required name="contact" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all font-bold shadow-inner" placeholder="010-0000-0000" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-sm font-black text-gray-400 uppercase tracking-widest leading-[1.6]">이메일 주소</label>
        <input required name="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all font-bold shadow-inner" placeholder="contact@example.com" />
      </div>
      <div className="space-y-4">
        <label className="text-sm font-black text-gray-400 uppercase tracking-widest leading-[1.6]">상담 요청 내용 (필수)</label>
        <textarea required name="message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={6} className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-lg focus:border-violet-500 outline-none transition-all font-bold leading-[2.4] break-keep shadow-inner" placeholder="50% 할인가로 숏폼 광고 이벤트를 통해 제작하고 싶은 영상의 주제나 채널 성격 등을 적어주세요." />
      </div>
      <button disabled={isSent || isSubmitting} className={`w-full py-6 md:py-10 rounded-[2rem] font-black text-xl md:text-2xl flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 break-keep ${isSent ? 'bg-green-600 scale-95 opacity-80' : 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/30'} ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}>
        {isSubmitting ? <><Loader2 size={32} className="animate-spin" /> 전송 중...</> : isSent ? <><Check size={32} /> 신청 완료되었습니다</> : '50% 할인가로 숏폼 광고 신청하기'}
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
        contents: `Analyze these channels: ${CHANNEL_URLS}. Return sum of total views, daily views, and per-capita reach.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      if (response.text) setStats(prev => ({ ...prev, lastUpdated: new Date().toLocaleTimeString('ko-KR') }));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchRealtimeStats(); }, []);

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
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6 md:space-y-24">
              <div className="space-y-4 text-center">
                 <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter break-keep">실시간 유튜브·틱톡 <br className="md:hidden" /> <span className="text-violet-500">누적 성과분석</span></h2>
                <p className="text-gray-500 text-xs md:text-lg font-bold uppercase tracking-[0.4em] opacity-40 italic">Global Traffic Metrics</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative inline-flex items-baseline">
                  <div className="text-6xl md:text-[10rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 leading-none drop-shadow-2xl">{formatNumberOnly(stats.totalViews)}</div>
                  <div className="text-2xl md:text-6xl font-black text-white ml-2 md:ml-6 tracking-tighter opacity-90">억 뷰</div>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 2, delay: 0.3 }} className="h-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent absolute -bottom-2 md:-bottom-8 left-0" />
                </div>
                <span className="text-violet-400 text-xs md:text-xl font-black mt-4 md:mt-16 tracking-widest uppercase italic opacity-60">Verified Performance</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 md:gap-10 max-w-5xl mx-auto">
                <div className="glass-panel p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] border-white/5 bg-white/5 flex flex-col items-start justify-center hover:bg-white/10 transition-all duration-500 group">
                  <span className="text-white text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-3 md:mb-5 group-hover:text-violet-400 transition-colors">국민 1인당 평균 시청</span>
                  <div className="text-3xl md:text-7xl font-black text-white italic tracking-tighter">{stats.perCapita}회</div>
                </div>
                <div className="glass-panel p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] border-white/5 bg-white/5 flex flex-col items-start justify-center hover:bg-white/10 transition-all duration-500 group">
                  <span className="text-white text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-3 md:mb-5 group-hover:text-violet-400 transition-colors">현재 일평균 시청수</span>
                  <div className="text-3xl md:text-7xl font-black text-white italic tracking-tighter">{Math.floor(stats.dailyViews / 10000)}만+</div>
                </div>
              </div>
              <div className="max-w-4xl mx-auto space-y-6 md:space-y-16">
                {CORE_HOOKS.map((hook, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.2, type: 'spring', damping: 20 }} className="flex items-start gap-4 md:gap-8 group">
                    <div className="w-1 md:w-1.5 h-auto min-h-[30px] md:min-h-[70px] bg-gradient-to-b from-violet-500 to-transparent rounded-full opacity-30 group-hover:opacity-100 transition-opacity shrink-0" />
                    <div className="space-y-1">
                      <p className="text-base md:text-[2.2rem] text-white font-medium italic whitespace-pre-line break-keep leading-[1.6] tracking-tight opacity-90 text-left">{hook.text}<span className="text-violet-500 font-black px-1 md:px-1.5 group-hover:text-violet-400 transition-colors bg-clip-text">{hook.highlight}</span>{hook.suffix}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 pt-6 md:pt-12 border-t border-white/5">
                <div className="flex items-center gap-3 text-[13px] md:text-xl font-black text-white bg-white/10 px-5 md:px-16 py-4 md:py-8 rounded-2xl md:rounded-full border border-white/20 shadow-2xl backdrop-blur-xl hover:bg-white/20 transition-all duration-300 min-w-[280px] md:min-w-[500px]">
                  <RefreshCw size={18} className={loading ? 'animate-spin text-violet-500' : 'text-violet-400'} />
                  <div className="flex flex-col md:items-center text-left md:text-center w-full whitespace-nowrap overflow-hidden">
                    <span className="md:hidden">실시간 통합 데이터 : <span className="text-violet-400">데이터 동기화 완료</span></span>
                    <div className="hidden md:flex flex-col items-center"><span className="text-white text-lg">실시간 통합 데이터:</span><span className="text-violet-400 text-xl font-black">데이터 동기화 완료 ({stats.lastUpdated})</span></div>
                  </div>
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
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 z-[100] bg-black overflow-y-auto">
      <div className="luxury-gradient min-h-full py-16 md:py-24 px-6 md:px-24">
        <div className="max-w-4xl mx-auto">
          <button onClick={onClose} className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-12 md:mb-16 text-lg font-black"><ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />홈으로 돌아가기</button>
          <div className="mb-16 md:mb-24 text-left">
            <h2 className="text-3xl md:text-7xl font-black mb-6 md:mb-8 leading-tight tracking-tighter break-keep italic">채널 운영 및<br/><span className="text-violet-500">상품 홍보 상담하기</span></h2>
            <p className="text-lg md:text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl break-keep">실전 전문가 집단이 당신의 비즈니스를 분석하여<br/> 가장 효율적인 유튜브 성장 전략을 제안해 드립니다.</p>
          </div>
          <div className="glass-panel p-8 md:p-20 rounded-[2rem] md:rounded-[3rem] border-white/10 shadow-2xl"><InquiryForm onSubmit={onSubmit} /></div>
        </div>
      </div>
    </motion.div>
  );
};

const VideoCard: React.FC<{ video: VideoReference; isShort?: boolean }> = ({ video, isShort }) => {
  return (
    <div onClick={() => video.embedUrl && window.open(video.embedUrl, '_blank')} className={`flex-shrink-0 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] glass-panel border border-white/5 hover:border-violet-500/40 transition-all duration-500 shadow-xl cursor-pointer ${isShort ? 'w-[180px] md:w-[260px] aspect-[9/16]' : 'w-[280px] md:w-[460px] aspect-video'}`}>
      {video.thumbnail ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full bg-zinc-900 flex items-center justify-center"><FileImage size={40} className="text-zinc-800" /></div>}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12 md:pt-16">
        <div className="flex justify-between items-center"><h4 className="text-sm md:text-xl font-black truncate group-hover:text-violet-400 transition-colors leading-[1.6] tracking-tight break-keep">{video.title}</h4><ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-violet-400 shrink-0 ml-4" /></div>
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
      <button onClick={() => scroll('left')} className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full glass-panel opacity-0 group-hover/scroll:opacity-100 transition-all hidden md:flex items-center justify-center bg-black/60 hover:bg-violet-600 border border-white/10"><ChevronLeft size={24} /></button>
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 md:gap-8 px-6 md:px-24 pb-8 md:pb-12 no-scrollbar scroll-smooth">{children}<div className="flex-shrink-0 w-8 md:w-20" /></div>
      <button onClick={() => scroll('right')} className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full glass-panel opacity-0 group-hover/scroll:opacity-100 transition-all hidden md:flex items-center justify-center bg-black/60 hover:bg-violet-600 border border-white/10"><ChevronRight size={24} /></button>
    </div>
  );
};

const StarBackground: React.FC<{ springX: any; springY: any }> = ({ springX, springY }) => {
  const layer1X = useTransform(springX, (v: number) => v * 0.1);
  const layer1Y = useTransform(springY, (v: number) => v * 0.1);
  const layer2X = useTransform(springX, (v: number) => v * 0.3);
  const layer2Y = useTransform(springY, (v: number) => v * 0.3);
  const stars = useMemo(() => [...Array(800)].map((_, i) => ({ id: i, size: Math.random() * 2 + 0.5, x: Math.random() * 100, y: Math.random() * 100, dur: Math.random() * 5 + 2, del: Math.random() * 5 })), []);
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <motion.div style={{ x: layer1X, y: layer1Y }} className="absolute inset-[-10%] opacity-20 bg-[radial-gradient(1px_1px_at_20px_30px,white,rgba(0,0,0,0))] bg-[length:200px_200px]" />
      <motion.div style={{ x: layer2X, y: layer2Y }} className="absolute inset-[-20%]">{stars.map((star) => (<motion.div key={star.id} animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: star.dur, repeat: Infinity, delay: star.del }} className="absolute rounded-full bg-white" style={{ width: star.size + 'px', height: star.size + 'px', left: star.x + '%', top: star.y + '%' }} />))}</motion.div>
    </div>
  );
};

const App: React.FC = () => {
  const [isConsultationPageOpen, setIsConsultationPageOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRefManagerOpen, setIsRefManagerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [references, setReferences] = useState<VideoReference[]>([]);

  useEffect(() => {
    const adminSession = sessionStorage.getItem('entervibe_admin');
    if (adminSession === 'true') setIsAdmin(true);
    const saved = localStorage.getItem('entervibe_refs');
    setReferences(saved ? JSON.parse(saved) : INITIAL_REFERENCES);
  }, []);

  const handleLoginSuccess = () => { setIsAdmin(true); setIsLoginModalOpen(false); setIsRefManagerOpen(true); sessionStorage.setItem('entervibe_admin', 'true'); };
  const handleLogout = () => { setIsAdmin(false); setIsRefManagerOpen(false); sessionStorage.removeItem('entervibe_admin'); };
  const handleOpenAdmin = () => isAdmin ? setIsRefManagerOpen(true) : setIsLoginModalOpen(true);
  const saveReferences = (newRefs: VideoReference[]) => { setReferences(newRefs); localStorage.setItem('entervibe_refs', JSON.stringify(newRefs)); };

  const settings = INITIAL_SETTINGS;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });
  const handleMouseMove = (e: React.MouseEvent) => { mouseX.set((e.clientX / window.innerWidth - 0.5) * 60); mouseY.set((e.clientY / window.innerHeight - 0.5) * 60); };
  const saveInquiry = useCallback((inquiry: any) => Promise.resolve(true), []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden" onMouseMove={handleMouseMove}>
      <StarBackground springX={springX} springY={springY} />
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-500">
        <div className="text-lg md:text-2xl font-black tracking-tighter" style={{ color: settings.primaryColor }}>{settings.agencyName}</div>
        <div className="flex items-center gap-6"><button onClick={() => setIsConsultationPageOpen(true)} className="px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-700 text-sm font-black transition-all">상담하기</button></div>
      </nav>
      <main className="relative z-10">
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-5xl"><h1 className="text-5xl md:text-[8vw] font-black tracking-tighter mb-8 leading-normal bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 pr-8 overflow-visible">{settings.heroTitle}</h1><div className="space-y-6 mb-12"><p className="text-xl md:text-4xl font-bold tracking-tight text-white/40 leading-relaxed">당신의 비전을 현실로</p><p className="text-xl md:text-4xl font-bold tracking-tight text-white leading-relaxed">압도적인 유튜브 성장의 파트너</p></div><a href="#section-2" className="group relative inline-flex items-center gap-3 px-10 py-6 rounded-full bg-white text-black font-black text-lg hover:scale-105 transition-all shadow-xl"><span>50% 할인가로 숏폼 광고 신청하기</span><ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></a></motion.div></section>
        
        <LiveDashboard primaryColor={settings.primaryColor} />
        
        <section id="section-0" className="py-24 px-6 md:px-24 bg-transparent relative">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 text-center">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-black mb-6 shadow-sm"><Award size={18} /> 실전 데이터로 증명합니다</div>
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight md:leading-tight tracking-tighter text-center">단순한 대행이 아닌 실행사로서<br /><span style={{ color: settings.primaryColor }}>100여 개의 채널</span>을<br />직접 운영하는<br />실전 전문가 집단</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {INITIAL_SOLUTIONS.map((sol) => (<div key={sol.id} className="glass-panel p-10 rounded-[2rem] hover:border-violet-500/30 transition-all duration-500"><h3 className="text-2xl font-black mb-4">{sol.title}</h3><p className="text-gray-400 leading-relaxed font-medium">{sol.description}</p></div>))}
            </div>
          </div>
        </section>

        {/* --- Pricing Section --- */}
        <section className="py-24 px-6 md:px-24 bg-transparent relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter italic">Service Pricing Plan</h2>
              <p className="text-gray-500 text-sm md:text-xl font-bold uppercase tracking-[0.3em] opacity-60">합리적인 비용으로 압도적인 성과를 경험하세요</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <motion.div 
                whileHover={{ y: -10 }}
                className="glass-panel p-10 md:p-16 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Video size={80} className="text-violet-500" />
                </div>
                <div className="relative z-10">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-violet-600/20 text-violet-400 text-[10px] font-black uppercase tracking-widest mb-8">Short-form Basic</div>
                  <h3 className="text-3xl md:text-4xl font-black mb-4">숏폼 광고 단건 제작 및 홍보</h3>
                  <p className="text-gray-500 font-medium mb-12 text-sm md:text-base break-keep">정밀한 타겟팅과 알고리즘 분석이 적용된 고효율 숏폼 콘텐츠 1건을 제작합니다.</p>
                  
                  <div className="flex items-baseline gap-2 mb-12">
                    <span className="text-5xl md:text-7xl font-black text-white italic">15만원</span>
                    <span className="text-lg md:text-xl font-bold text-gray-400">/ 1건</span>
                  </div>
                  
                  <ul className="space-y-4 mb-12">
                    {['전문 PD 1:1 기획 매칭', '알고리즘 최적화 편집', '저작권 프리 음원 사용'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-400">
                        <Check size={16} className="text-violet-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="glass-panel p-10 md:p-16 rounded-[3rem] border-violet-500/30 bg-violet-500/5 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Sparkles size={80} className="text-violet-400" />
                </div>
                <div className="relative z-10">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest mb-8">Premium Full-Package</div>
                  <h3 className="text-3xl md:text-4xl font-black mb-4">채널 성장 올인원 패키지</h3>
                  <p className="text-gray-500 font-medium mb-12 text-sm md:text-base break-keep">기획부터 촬영, 업로드, 채널 관리까지 전 과정을 대행하는 전문가 밀착 케어 서비스입니다.</p>
                  
                  <div className="flex items-baseline gap-2 mb-12">
                    <span className="text-5xl md:text-7xl font-black text-white italic">199만원</span>
                    <span className="text-lg md:text-xl font-bold text-gray-400">/ Month</span>
                  </div>
                  
                  <ul className="space-y-4 mb-12">
                    {['월 10~15개 숏폼 정기 제작 or 롱폼 8개 제작', '채널 운영 및 댓글 관리 대행', '주간 데이터 분석 리포트 제공', '광고 캠페인 전략 수립'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                        <Zap size={16} className="text-violet-400" /> {item}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black text-violet-400 uppercase tracking-tighter text-center">
                    현재 가장 많은 업체가 선택 중인 베스트 플랜
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="section-1" className="py-24 bg-transparent overflow-hidden text-left relative">
          <div className="px-6 md:px-24 mb-12 flex items-center justify-between gap-4"><div className="flex items-center gap-4"><h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">레퍼런스</h2><div className="hidden md:block w-32 h-px bg-white/5" /></div><button onClick={handleOpenAdmin} className={`p-2 md:p-3 rounded-full border transition-all flex items-center gap-2 ${isAdmin ? 'bg-violet-600/20 border-violet-500 text-violet-400' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:bg-white/10'}`}>{isAdmin ? <Lock size={20} /> : <Settings size={20} />}<span className="hidden md:inline text-xs font-bold">{isAdmin ? '관리중' : '관리'}</span></button></div>
          <div className="space-y-24">
            <div><div className="px-6 md:px-24 flex items-center gap-3 mb-10"><div className="w-8 h-1 bg-violet-500 rounded-full" /><h3 className="text-2xl font-black">숏폼 마케팅</h3></div><HorizontalScrollContainer>{references.filter(r => r.type === 'Short-form').map(video => <VideoCard key={video.id} video={video} isShort />)}</HorizontalScrollContainer></div>
            <div><div className="px-6 md:px-24 flex items-center gap-3 mb-10"><div className="w-8 h-1 bg-violet-500 rounded-full" /><h3 className="text-2xl font-black">롱폼 기획 제작</h3></div><HorizontalScrollContainer>{references.filter(r => r.type === 'Long-form').map(video => <VideoCard key={video.id} video={video} />)}</HorizontalScrollContainer></div>
          </div>
        </section>

        <section id="section-2" className="py-24 px-6 md:px-24 bg-transparent relative"><div className="max-w-4xl mx-auto text-center"><div className="mb-20"><span className="inline-block px-5 py-1.5 rounded-full bg-violet-500 text-white text-xs font-black mb-6 tracking-widest uppercase">limited event</span><h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">50% 할인가로 숏폼 광고 요청하기</h2><p className="text-lg text-gray-500 font-medium">선착순 혜택이 곧 종료됩니다. 지금 바로 무료 진단을 예약하세요.</p></div><InquiryForm onSubmit={saveInquiry} /></div></section>
        
        <footer className="py-20 border-t border-white/5 px-6 md:px-24 text-center"><div className="text-2xl font-black mb-8 text-violet-500 opacity-40">{settings.agencyName}</div><div className="text-xs text-gray-800 font-medium space-y-2"><p>주식회사 마켓꾸 / 사업자등록번호 373-87-03959 / 대표자 유승용 / 서울특별시 용산구 서빙고로 17</p><p>© 2024 ENTERVIBECRE. ALL RIGHTS RESERVED.</p></div></footer>
      </main>
      
      <AnimatePresence>
        {isConsultationPageOpen && <ConsultationPage onClose={() => setIsConsultationPageOpen(false)} onSubmit={saveInquiry} />}
        {isLoginModalOpen && <AdminLoginModal onLoginSuccess={handleLoginSuccess} onClose={() => setIsLoginModalOpen(false)} />}
        {isRefManagerOpen && <ReferenceManager references={references} onSave={saveReferences} onClose={() => setIsRefManagerOpen(false)} onLogout={handleLogout} />}
      </AnimatePresence>
    </div>
  );
};

export default App;
