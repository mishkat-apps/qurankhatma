import React, { useState, useContext } from 'react';
import { MessageSquare, Send, Check } from 'lucide-react';
import { LanguageContext } from '../App';
import { saveFeedback } from '../services/storageService';

interface FeedbackBoxProps {
  source: string;
  className?: string;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({ source, className = "" }) => {
  const { t } = useContext(LanguageContext);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await saveFeedback(message, source);
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
        <MessageSquare className="w-3 h-3" />
        {t.feedbackTitle}
      </div>
      {sent ? (
        <div className="flex items-center gap-2 text-emerald-600 text-sm py-2 animate-in fade-in bg-emerald-50 rounded-lg px-3">
            <Check className="w-4 h-4" />
            <span className="font-medium">{t.feedbackSent}</span>
        </div>
      ) : (
        <form onSubmit={handleSend} className="relative group">
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.feedbackPlaceholderShort}
                rows={1}
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none bg-slate-50 min-h-[42px] focus:min-h-[80px] transition-all"
            />
            <button 
                type="submit"
                disabled={!message.trim()}
                className="absolute right-2 top-2 p-1.5 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-0 disabled:pointer-events-none transition-all shadow-sm"
                title={t.sendFeedback}
            >
                <Send className="w-3 h-3" />
            </button>
        </form>
      )}
    </div>
  );
};
export default FeedbackBox;