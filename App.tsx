import React, { useState, useEffect, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Plus, Heart, Share2, ArrowLeft, Trash2, Wand2, Calendar, User, Sparkles, BookOpen, Clock, Globe, ArrowRight, Link as LinkIcon, Users, Lock, MessageSquare, ExternalLink, Copy, AlertTriangle } from 'lucide-react';
import { getAllKhatams, getKhatamsByCreator, createKhatam, getKhatamById, updateJuzStatus, deleteKhatam, addToUserHistory, getUserKhatams, getAllFeedback } from './services/storageService';
import { Khatam, JuzStatus, Feedback } from './types';
import CreateKhatamModal from './components/CreateKhatamModal';
import FeedbackBox from './components/FeedbackBox';
import JuzCard from './components/JuzCard';
import { generateComfortingMessage, generateSharingMessage } from './services/geminiService';
import { translations, Language } from './data/translations';

// --- Helpers ---
const formatDate = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// --- Context Definition ---
export const LanguageContext = React.createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations['en'];
}>({
  lang: 'en',
  setLang: () => {},
  t: translations['en'],
});

interface DashboardProps {
    viewMode: 'history' | 'creator' | 'community';
}

// --- Dashboard Component (Handles Central, Personal, and Admin views) ---
const Dashboard: React.FC<DashboardProps> = ({ viewMode }) => {
  const { t } = useContext(LanguageContext);
  const { creatorId } = useParams<{ creatorId: string }>(); // If present, Personal Dashboard
  const [khatams, setKhatams] = useState<Khatam[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    let data: Khatam[] = [];
    if (viewMode === 'creator' && creatorId) {
        data = await getKhatamsByCreator(creatorId);
    } else if (viewMode === 'community') {
        data = await getAllKhatams();
        const feedback = await getAllFeedback();
        setFeedbackList(feedback);
    } else {
        // Default 'history' mode for landing page
        data = await getUserKhatams();
    }
    setKhatams(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [viewMode, creatorId]);

  const handleCreateDashboard = () => {
      const newId = crypto.randomUUID();
      navigate(`/organizer/${newId}`);
  };

  const handleCreateKhatam = async (data: any) => {
    // Pass existing creatorId if we are on a personal dashboard
    const newKhatam = await createKhatam(data, creatorId);
    
    // Refresh list
    loadData();
    
    setIsModalOpen(false);

    navigate(`/khatam/${newKhatam.id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if(confirm(t.deleteConfirm)) {
        await deleteKhatam(id);
        loadData();
    }
  }

  const handleCopyLink = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      const url = `${window.location.origin}${window.location.pathname}#/khatam/${id}`;
      navigator.clipboard.writeText(url).then(() => {
          alert(t.copied);
      });
  }

  const copyDashboardLink = () => {
      if (creatorId) {
          const url = window.location.href;
          navigator.clipboard.writeText(url);
          alert(t.copied);
      }
  }

  const getPageTitle = () => {
      if (viewMode === 'community') return "Global Community Khatams";
      if (viewMode === 'creator') return "Organizer Dashboard";
      return t.appTitle;
  }

  const getPageSubtitle = () => {
      if (viewMode === 'community') return "Admin view of all active khatams across the platform.";
      if (viewMode === 'creator') return t.saveDashboardDesc;
      return t.dashboardIntro;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-emerald-900 text-white relative overflow-hidden flex-shrink-0">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
         <div className="max-w-4xl mx-auto px-6 py-16 text-center relative z-10">
            {viewMode === 'creator' && (
                <div className="mb-4 inline-flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full border border-emerald-700 text-emerald-100 text-sm animate-in fade-in slide-in-from-top-4">
                    <User className="w-4 h-4" />
                    <span>{t.saveDashboard}</span>
                </div>
            )}
            {viewMode === 'community' && (
                <div className="mb-4 inline-flex items-center gap-2 bg-red-800/50 px-4 py-2 rounded-full border border-red-700 text-red-100 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Admin Access</span>
                </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                {getPageTitle()}
            </h1>
            
            <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed opacity-90">
               {getPageSubtitle()}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Landing Page Action: Create New Dashboard */}
                {viewMode === 'history' && (
                    <button 
                        onClick={handleCreateDashboard}
                        className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95 inline-flex items-center gap-3 text-lg"
                    >
                        <Plus className="w-6 h-6" />
                        {t.createDashboard}
                    </button>
                )}

                {/* Organizer View Action: Create Khatam inside dashboard */}
                {(viewMode === 'creator' || viewMode === 'community') && (
                     <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95 inline-flex items-center gap-3 text-lg"
                     >
                        <Plus className="w-6 h-6" />
                        {t.startInitiative}
                     </button>
                )}
                
                {/* Organizer View Action: Save Link */}
                {viewMode === 'creator' && creatorId && (
                    <button 
                      onClick={copyDashboardLink}
                      className="bg-emerald-800 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95 inline-flex items-center gap-3 text-lg border border-emerald-700"
                    >
                      <LinkIcon className="w-6 h-6" />
                      {t.shareJuz}
                    </button>
                )}
            </div>
         </div>
      </div>

      {/* List */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
         
         {/* Feedback Section - Top of Creator Dashboard */}
         {viewMode === 'creator' && (
            <div className="mb-8 max-w-lg mx-auto">
                <FeedbackBox source="organizer-dashboard" />
            </div>
         )}

         {/* Feedback List for Admin */}
         {viewMode === 'community' && (
             <div className="mb-12">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    {t.adminFeedbackTitle}
                    <span className="text-slate-400 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">{feedbackList.length}</span>
                 </h2>
                 
                 {feedbackList.length === 0 ? (
                    <div className="text-slate-500 italic p-4 bg-white rounded-xl border border-dashed border-slate-300">No feedback submitted yet.</div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {feedbackList.map((fb) => (
                            <div key={fb.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-slate-800 text-sm mb-3 whitespace-pre-wrap">"{fb.message}"</p>
                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>{formatDate(fb.timestamp)}</span>
                                    <span className="bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">{fb.source}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
                 <div className="h-px bg-slate-200 w-full my-12"></div>
             </div>
         )}

         <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                {viewMode === 'history' ? t.welcomeTitle : (viewMode === 'community' ? 'All Active Khatams' : 'Your Khatams')}
            </h2>
            {khatams.length > 0 && (
                <span className="text-slate-400 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">{khatams.length} {viewMode === 'history' ? 'Items' : 'Active'}</span>
            )}
         </div>
         
         {loading ? (
             <div className="text-center py-20 text-slate-400 animate-pulse">
                 Loading initiatives...
             </div>
         ) : khatams.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 px-4">
                {viewMode === 'history' ? (
                     <p className="text-slate-500 mb-4">{t.welcomeText}</p>
                ) : (
                     <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{t.organizerEmptyTitle}</h3>
                        <p className="text-slate-500 mb-6">{t.organizerEmptyDesc}</p>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left flex items-start gap-3 mb-6">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">{t.dataPersistenceWarning}</p>
                        </div>

                        <button onClick={() => setIsModalOpen(true)} className="text-emerald-600 font-bold hover:underline">
                            {t.createFirst}
                        </button>
                     </div>
                )}
             </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {khatams.map(khatam => {
                    const completed = khatam.juzs.filter(j => j.status === 'completed').length;
                    const progress = Math.round((completed / 30) * 100);
                    
                    return (
                        <Link 
                            key={khatam.id} 
                            to={`/khatam/${khatam.id}`}
                            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 block relative"
                        >
                            <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handleCopyLink(e, khatam.id)}
                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full bg-white shadow-sm border border-slate-100"
                                    title="Copy Link"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(e, khatam.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full bg-white shadow-sm border border-slate-100"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-serif font-bold text-slate-900 mb-1 line-clamp-1">{khatam.deceasedName}</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(khatam.createdAt)}</span>
                                    {khatam.creatorName && (
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full ml-auto truncate max-w-[100px]">
                                            by {khatam.creatorName}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                <span>{t.progress}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-6">
                                <div 
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex -space-x-2 overflow-hidden">
                                    {khatam.juzs.filter(j => j.claimedBy).slice(0, 3).map((j, i) => (
                                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 uppercase" title={j.claimedBy || ''}>
                                            {j.claimedBy ? j.claimedBy.charAt(0) : '?'}
                                        </div>
                                    ))}
                                    {khatam.juzs.filter(j => j.claimedBy).length > 3 && (
                                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-500">
                                            +{khatam.juzs.filter(j => j.claimedBy).length - 3}
                                        </div>
                                    )}
                                    </div>
                                    <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold group-hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                    Open <ArrowRight className="w-3 h-3" />
                                    </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
         )}
      </main>

      {isModalOpen && (
        <CreateKhatamModal 
          onClose={() => setIsModalOpen(false)} 
          onCreate={handleCreateKhatam} 
          existingCreatorId={creatorId}
        />
      )}
    </div>
  );
};

// --- Single Khatam View Component ---
const KhatamDetail = () => {
  const { t } = useContext(LanguageContext);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [khatam, setKhatam] = useState<Khatam | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
        if (id) {
          const data = await getKhatamById(id);
          if (data) {
            setKhatam(data);
            addToUserHistory(data.id);
            setAiMessage("O soul at peace, return to your Lord, well-pleased and pleasing [to Him], and enter among My [righteous] servants and enter My Paradise. (Surah Al-Fajr 89:27-30)");
          } else {
            setNotFound(true);
          }
          setLoading(false);
        }
    };
    fetchData();
  }, [id]);

  // Handle status update
  const handleStatusChange = async (juzNumber: number, status: JuzStatus, name?: string) => {
    if (!khatam || !id) return;
    if (name) setCurrentUser(name);

    // Optimistic UI update (optional, but good for UX)
    // For now we just wait for DB response to keep it consistent
    const updated = await updateJuzStatus(id, juzNumber, status, name);
    if (updated) setKhatam(updated);
  };

  const handleGenerateDua = async () => {
     if(!khatam) return;
     setGeneratingAi(true);
     const msg = await generateComfortingMessage(khatam.deceasedName);
     setAiMessage(msg);
     setGeneratingAi(false);
  }

  const handleShare = async () => {
      if(!khatam) return;
      
      const url = window.location.href;

      try {
         await navigator.clipboard.writeText(url);
         alert(t.copied);
      } catch(e) {
         alert(t.copied);
      }
  }

  const navigateToMyDashboard = () => {
      if (khatam?.creatorId) {
          navigate(`/organizer/${khatam.creatorId}`);
      }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;

  if (notFound || !khatam) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center border border-slate-200">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">{t.khatamNotFound}</h2>
                  <p className="text-slate-600 mb-6">{t.khatamNotFoundDesc}</p>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left flex items-start gap-3 mb-8">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">{t.dataPersistenceWarning}</p>
                  </div>

                  <Link to="/" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors">
                      {t.returnHome}
                  </Link>
              </div>
          </div>
      )
  }

  const completedCount = khatam.juzs.filter(j => j.status === 'completed').length;
  const claimedCount = khatam.juzs.filter(j => j.status === 'claimed').length;
  const progress = Math.round((completedCount / 30) * 100);
  const targetDateDisplay = khatam.targetDate ? formatDate(khatam.targetDate) : null;

  return (
    <div className="bg-slate-50 pb-24">
       {/* Hero Section */}
       <div className="bg-emerald-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
                <div className="flex justify-between items-start">
                    <Link to="/" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-6 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4" /> {t.back}
                    </Link>
                    
                    <div className="flex gap-3">
                         {khatam.creatorId && (
                            <button 
                                onClick={navigateToMyDashboard}
                                className="inline-flex items-center gap-2 text-emerald-200 hover:text-white text-sm bg-emerald-800/50 px-3 py-1.5 rounded-full border border-emerald-700/50"
                            >
                                <User className="w-3 h-3" /> Organizer Dashboard
                            </button>
                         )}
                        {targetDateDisplay && (
                             <div className="flex items-center gap-2 bg-emerald-800/80 px-4 py-1.5 rounded-full text-emerald-50 text-sm font-medium border border-emerald-700/50 shadow-sm">
                                <Clock className="w-4 h-4 text-emerald-300" />
                                <span>{t.completeBy} <span className="text-white font-bold tracking-wide">{targetDateDisplay}</span></span>
                             </div>
                        )}
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium uppercase tracking-wide mb-3">
                            <span>Khatam Initiative</span>
                            <span className="w-1 h-1 bg-emerald-300 rounded-full"></span>
                            <span>{formatDate(khatam.createdAt)}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                            For {khatam.deceasedName}
                        </h1>
                        <p className="text-emerald-100 max-w-xl text-lg opacity-90 leading-relaxed">
                            {khatam.description || t.descriptionDefault}
                        </p>
                    </div>

                     <button 
                        onClick={handleShare}
                        className="bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 shrink-0"
                    >
                        <Share2 className="w-5 h-5" />
                        {t.share}
                    </button>
                </div>

                {/* Dua Section */}
                <div className="bg-emerald-800/40 backdrop-blur-md rounded-xl p-6 border border-emerald-700/50 shadow-lg">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-emerald-300 shrink-0 mt-1" />
                        <div className="flex-1">
                            <p className="text-lg font-serif italic leading-relaxed text-emerald-50 mb-3">
                                "{aiMessage}"
                            </p>
                            <button 
                                onClick={handleGenerateDua}
                                className="text-xs text-emerald-300 hover:text-white hover:underline flex items-center gap-1 transition-colors"
                            >
                                <Wand2 className="w-3 h-3" />
                                {generatingAi ? "Generating..." : t.personalizeDua}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
       </div>

       {/* Stats Bar */}
       <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-8 text-sm">
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase tracking-wider">{t.completed}</span>
                        <span className="font-bold text-slate-900 text-xl">{completedCount} <span className="text-slate-400 text-sm font-normal">/ 30</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase tracking-wider">{t.claimed}</span>
                        <span className="font-bold text-amber-600 text-xl">{claimedCount}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase tracking-wider">{t.available}</span>
                        <span className="font-bold text-emerald-600 text-xl">{30 - completedCount - claimedCount}</span>
                    </div>
                </div>
                
                <div className="w-full sm:w-64">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{t.progress}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
       </div>

       {/* Grid */}
       <main className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    {t.selectJuz}
                </h2>
                {/* Inline Feedback for Khatam Page */}
                <div className="w-full md:w-64">
                    <FeedbackBox source="khatam-page" />
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {khatam.juzs.map(juz => (
                    <JuzCard 
                        key={juz.juzNumber} 
                        juz={juz} 
                        onStatusChange={handleStatusChange} 
                        currentUser={currentUser}
                    />
                ))}
            </div>
       </main>
    </div>
  );
};

// --- Main App & Router ---
const App = () => {
  const [lang, setLang] = useState<Language>('en');

  // Value for the context provider
  const contextValue = {
    lang,
    setLang,
    t: translations[lang]
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'sw' : 'en');
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      <Router>
        <div className="min-h-screen bg-slate-50">
             {/* Global Language Toggler */}
             <div className="fixed top-4 right-4 z-50">
                <button 
                  onClick={toggleLang}
                  className="bg-white/90 backdrop-blur shadow-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-emerald-50 border border-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  {lang === 'en' ? 'Swahili' : 'English'}
                </button>
             </div>

            <Routes>
                {/* Home: Only shows local history (Landing) */}
                <Route path="/" element={<Dashboard viewMode="history" />} />
                
                {/* Personal Dashboard: Shows creator-specific khatams */}
                <Route path="/organizer/:creatorId" element={<Dashboard viewMode="creator" />} />
                
                {/* Admin/Community: Shows ALL khatams (Secret URL) */}
                <Route path="/community-admin" element={<Dashboard viewMode="community" />} />
                
                {/* Detail View */}
                <Route path="/khatam/:id" element={<KhatamDetail />} />
            </Routes>
        </div>
      </Router>
    </LanguageContext.Provider>
  );
};

export default App;