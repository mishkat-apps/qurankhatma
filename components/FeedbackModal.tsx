import React, { useState, useContext } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import { LanguageContext } from '../App';
import { saveFeedback } from '../services/storageService';

interface FeedbackModalProps {
  onClose: () => void;
  source: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, source }) => {
  const { t } = useContext(LanguageContext);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    await saveFeedback(message, source);
    setSubmitted(true);
    
    // Close automatically after a short delay
    setTimeout(() => {
        onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{t.feedback}</h2>
          </div>

          {submitted ? (
             <div className="text-center py-6 text-emerald-600 font-medium animate-in fade-in">
                 {t.feedbackSent}
             </div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder={t.feedbackPlaceholder}
                    className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                    autoFocus
                />
                <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    {t.sendFeedback}
                </button>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;