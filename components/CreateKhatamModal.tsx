import React, { useState, useContext, useRef } from 'react';
import { X, HeartHandshake, AlertCircle, Calendar } from 'lucide-react';
import { LanguageContext } from '../App';

interface CreateKhatamModalProps {
  onClose: () => void;
  onCreate: (data: { deceasedName: string; description?: string; targetDate?: number; creatorName: string }) => void;
  existingCreatorId?: string;
}

const CreateKhatamModal: React.FC<CreateKhatamModalProps> = ({ onClose, onCreate, existingCreatorId }) => {
  const { t } = useContext(LanguageContext);
  const [deceasedName, setDeceasedName] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [targetDate, setTargetDate] = useState(''); // Stores the text string dd/mm/yyyy
  const [dateError, setDateError] = useState('');
  const datePickerRef = useRef<HTMLInputElement>(null);

  // Get today's date in YYYY-MM-DD for min attribute of hidden picker
  const today = new Date().toISOString().split('T')[0];

  // Handle typing in the text field - Allow digits and slashes
  const handleTextDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow digits and forward slashes to be typed
    if (/^[\d\/]*$/.test(val)) {
        setTargetDate(val);
        if (dateError) setDateError('');
    }
  };

  // Handle selection from the popup picker
  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // yyyy-mm-dd
    if (val) {
        const [year, month, day] = val.split('-');
        setTargetDate(`${day}/${month}/${year}`);
        setDateError('');
    }
  };

  const triggerDatePicker = () => {
    // Try to open the picker programmatically
    if (datePickerRef.current) {
        if ('showPicker' in HTMLInputElement.prototype) {
            try {
                datePickerRef.current.showPicker();
            } catch (err) {
                datePickerRef.current.focus(); 
            }
        } else {
            datePickerRef.current.focus();
            datePickerRef.current.click();
        }
    }
  };

  const validateAndParseDate = (dateStr: string): number | null => {
    if (!dateStr) return null; // Optional is fine

    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    
    if (!match) return -1; // Invalid format

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Basic range check
    if (month < 1 || month > 12 || day < 1 || day > 31) return -1;

    const dateObj = new Date(year, month - 1, day);
    
    // Check strict date validity (e.g. catches 31/02)
    if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
        return -1;
    }

    // Check if in past
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);

    if (dateObj < todayObj) return -1;

    return dateObj.getTime();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName.trim() || !creatorName.trim()) return;

    let timestamp: number | undefined = undefined;

    if (targetDate.trim()) {
        const result = validateAndParseDate(targetDate);
        if (result === -1) {
            setDateError(t.invalidDate);
            return;
        }
        if (result !== null) {
            timestamp = result;
        }
    }

    onCreate({
      deceasedName,
      description,
      creatorName,
      targetDate: timestamp,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.startInitiative}</h2>
              <p className="text-slate-500 text-sm">Organize a collective recitation.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.deceasedName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={deceasedName}
                onChange={(e) => setDeceasedName(e.target.value)}
                placeholder={t.deceasedPlaceholder}
                className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.yourName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder={t.yourNamePlaceholder}
                className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.targetDate} (Optional)
              </label>
              <div className="relative">
                  <input
                    type="text"
                    value={targetDate}
                    onChange={handleTextDateChange}
                    placeholder={t.datePlaceholder}
                    className={`w-full pl-4 pr-12 py-2 border bg-white text-slate-900 rounded-lg focus:ring-2 outline-none ${dateError ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'}`}
                  />
                  <button
                    type="button"
                    onClick={triggerDatePicker}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                  
                  {/* Hidden native date input for the popup picker */}
                  <input 
                    type="date"
                    ref={datePickerRef}
                    min={today}
                    className="absolute opacity-0 pointer-events-none bottom-0 left-0 w-0 h-0"
                    onChange={handlePickerChange}
                    tabIndex={-1}
                  />
              </div>
              {dateError && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{dateError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.note} (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder={t.notePlaceholder}
                className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none placeholder:text-slate-400"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98]"
              >
                {t.create}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateKhatamModal;