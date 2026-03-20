import React, { useState, useContext, useEffect } from 'react';
import { Juz, JuzStatus } from '../types';
import { CheckCircle, Circle, User, BookOpen, Calendar, Share2, Info, Copy } from 'lucide-react';
import { juzInfo } from '../data/quranData';
import { LanguageContext } from '../App';

interface JuzCardProps {
  juz: Juz;
  onStatusChange: (juzNumber: number, status: JuzStatus, name?: string) => void;
  currentUser: string;
}

const JuzCard: React.FC<JuzCardProps> = ({ juz, onStatusChange, currentUser }) => {
  const { t } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimerName, setClaimerName] = useState(currentUser || '');

  const info = juzInfo.find(j => j.id === juz.juzNumber);

  // Effect: When status changes to available (Undo), clear the name field.
  useEffect(() => {
    if (juz.status === 'available') {
        setClaimerName('');
    }
  }, [juz.status]);

  // Effect: Keep local name synced with currentUser if we are starting fresh, 
  // but only if it's not already set by manual input during this session
  useEffect(() => {
    if (currentUser && !claimerName && juz.status === 'available') {
        setClaimerName(currentUser);
    }
  }, [currentUser]);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claimerName.trim()) {
      onStatusChange(juz.juzNumber, 'claimed', claimerName);
      setIsModalOpen(false);
    }
  };

  const getCalendarUrl = () => {
    const title = `Recite Juz ${juz.juzNumber} (${info?.name}) - Quran`;
    const details = `Recitation for Khatam. Starts at page ${info?.startPage || ''}. Surahs: ${info?.surahs || ''}.`;
    const now = new Date();
    // Default to a 1 hour slot today
    const start = now.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(now.getTime() + 60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${start}/${end}`;
  };

  const handleShareJuz = async (e: React.MouseEvent) => {
      e.stopPropagation();
      const text = `I am reciting Juz ${juz.juzNumber} (${info?.name}). Starts pg ${info?.startPage}. Join us: ${window.location.href}`;
      try {
          await navigator.clipboard.writeText(text);
          alert(t.copied);
      } catch (err) {
          alert("Could not copy.");
      }
  };

  // Styles based on status
  const getStyles = () => {
    switch (juz.status) {
      case 'completed':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'claimed':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400 hover:shadow-md cursor-pointer';
    }
  };

  return (
    <>
      <div 
        onClick={() => {
            if (juz.status === 'available') setIsModalOpen(true);
        }}
        className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between h-40 ${getStyles()}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold opacity-40 leading-none">{juz.juzNumber}</span>
              <span className="text-sm font-serif font-bold opacity-80 mt-1">{info?.name}</span>
              {info && (
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">{t.startsPage} {info.startPage}</span>
              )}
          </div>
          <div className="mt-1">
            {juz.status === 'completed' && <CheckCircle className="w-6 h-6 text-emerald-600" />}
            {juz.status === 'claimed' && <User className="w-5 h-5 text-amber-500" />}
            {juz.status === 'available' && <Circle className="w-5 h-5 text-slate-300" />}
          </div>
        </div>

        <div className="mt-auto">
          {juz.status === 'available' && (
             <div className="text-sm font-medium">
                <span className="block truncate text-xs text-slate-400 mb-1" title={info?.surahs}>{info?.surahs}</span>
                <span className="text-emerald-600 flex items-center gap-1">{t.select} <BookOpen className="w-3 h-3"/></span>
             </div>
          )}
          {juz.status === 'claimed' && (
            <div className="flex flex-col gap-2">
              <div>
                  <span className="text-xs uppercase tracking-wider opacity-70 block">{t.reciter}</span>
                  <span className="font-semibold truncate w-full block">{juz.claimedBy}</span>
              </div>
              <div className="flex gap-1 justify-between items-center">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onStatusChange(juz.juzNumber, 'completed'); }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1.5 px-2 rounded shadow-sm"
                 >
                    {t.markDone}
                 </button>
                 <a 
                    href={getCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-amber-600 hover:bg-amber-100 rounded"
                    title="Add Reminder"
                 >
                    <Calendar className="w-4 h-4" />
                 </a>
                 <button 
                    onClick={(e) => { e.stopPropagation(); onStatusChange(juz.juzNumber, 'available'); }}
                    className="text-xs text-amber-700 hover:underline px-1"
                 >
                    {t.undo}
                 </button>
              </div>
            </div>
          )}
          {juz.status === 'completed' && (
            <div className="flex flex-col">
               <span className="text-xs uppercase tracking-wider opacity-70">Completed by</span>
               <span className="font-semibold truncate">{juz.claimedBy}</span>
               <button 
                  onClick={(e) => { e.stopPropagation(); onStatusChange(juz.juzNumber, 'claimed', juz.claimedBy); }}
                  className="mt-1 text-xs text-emerald-700 hover:underline text-left"
               >
                  {t.undo}
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-emerald-600"/>
                {t.reciteJuz} {juz.juzNumber}
            </h3>
             <p className="text-emerald-700 font-serif font-bold text-lg mb-4">{info?.name}</p>
            
            {info && (
                <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">{t.startsPage}:</span>
                        <span className="font-semibold text-slate-800">{info.startPage}</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-slate-500 block mb-1">{t.surahs}:</span>
                        <span className="font-medium text-slate-800 leading-snug">{info.surahs}</span>
                    </div>
                </div>
            )}

            <p className="text-slate-600 text-sm mb-4">
                Enter your name to commit to reciting this part.
            </p>
            <form onSubmit={handleClaimSubmit}>
                <input
                    type="text"
                    value={claimerName}
                    onChange={(e) => setClaimerName(e.target.value)}
                    placeholder={t.yourNameEntry}
                    className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none mb-4 placeholder:text-slate-400"
                    autoFocus
                />
                
                <div className="flex flex-col gap-3">
                    <button 
                        type="submit"
                        disabled={!claimerName.trim()}
                        className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t.confirm}
                    </button>
                    <div className="flex gap-2">
                         <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="button"
                            onClick={handleShareJuz}
                            className="flex-1 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                        >
                            <Copy className="w-3 h-3" /> {t.shareJuz}
                        </button>
                    </div>
                </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JuzCard;