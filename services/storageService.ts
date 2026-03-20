import { Khatam, Juz, JuzStatus, Feedback } from '../types';

// Constants for LocalStorage
const KHATAMS_KEY = 'quran_khatams_v1';
const FEEDBACK_KEY = 'quran_feedback_v1';
const USER_HISTORY_KEY = 'khatam_user_history_v1';

// Helper to simulate network delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Helpers ---
const getLocalKhatams = (): Khatam[] => {
    try {
        const data = localStorage.getItem(KHATAMS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

const saveLocalKhatams = (khatams: Khatam[]) => {
    localStorage.setItem(KHATAMS_KEY, JSON.stringify(khatams));
};

const getLocalFeedback = (): Feedback[] => {
    try {
        const data = localStorage.getItem(FEEDBACK_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

const saveLocalFeedback = (feedback: Feedback[]) => {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
};

// --- User Session Helpers (Local History) ---

const getUserHistory = (): string[] => {
    try {
        const data = localStorage.getItem(USER_HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        return [];
    }
}

export const addToUserHistory = (khatamId: string) => {
    const history = getUserHistory();
    if (!history.includes(khatamId)) {
        history.push(khatamId);
        localStorage.setItem(USER_HISTORY_KEY, JSON.stringify(history));
    }
}

const removeFromUserHistory = (khatamId: string) => {
    const history = getUserHistory();
    const newHistory = history.filter(id => id !== khatamId);
    localStorage.setItem(USER_HISTORY_KEY, JSON.stringify(newHistory));
}

// --- Feedback API ---

export const saveFeedback = async (message: string, source: string) => {
    await delay(300);
    const feedbackList = getLocalFeedback();
    const newFeedback: Feedback = {
        id: crypto.randomUUID(),
        message,
        source,
        timestamp: Date.now()
    };
    feedbackList.push(newFeedback);
    saveLocalFeedback(feedbackList);
}

export const getAllFeedback = async (): Promise<Feedback[]> => {
    await delay(300);
    const feedbackList = getLocalFeedback();
    return feedbackList.sort((a, b) => b.timestamp - a.timestamp);
}

// --- Khatam API ---

// Central Dashboard: Get ALL khatams
export const getAllKhatams = async (): Promise<Khatam[]> => {
    await delay(300);
    const khatams = getLocalKhatams();
    return khatams.sort((a, b) => b.createdAt - a.createdAt);
};

// Personal Dashboard: Get khatams by creatorId
export const getKhatamsByCreator = async (creatorId: string): Promise<Khatam[]> => {
    await delay(300);
    const khatams = getLocalKhatams();
    return khatams
        .filter(k => k.creatorId === creatorId)
        .sort((a, b) => b.createdAt - a.createdAt);
};

// Gets khatams in user's local history (visited/created)
export const getUserKhatams = async (): Promise<Khatam[]> => {
    await delay(300);
    const userHistory = getUserHistory();
    const khatams = getLocalKhatams();
    // Filter khatams that are in history
    return khatams
        .filter(k => userHistory.includes(k.id))
        .sort((a, b) => b.createdAt - a.createdAt);
};

export const getKhatamById = async (id: string): Promise<Khatam | undefined> => {
    await delay(300);
    const khatams = getLocalKhatams();
    return khatams.find(k => k.id === id);
};

export const createKhatam = async (data: { deceasedName: string; description?: string; targetDate?: number; creatorName: string }, existingCreatorId?: string): Promise<Khatam> => {
    await delay(300);
    
    // Initialize 30 Juzs
    const initialJuzs: Juz[] = Array.from({ length: 30 }, (_, i) => ({
        juzNumber: i + 1,
        status: 'available' as JuzStatus,
    }));

    const creatorId = existingCreatorId || crypto.randomUUID();
    const id = crypto.randomUUID();

    const newKhatam: Khatam = {
        id: id,
        creatorId: creatorId,
        createdAt: Date.now(),
        deceasedName: data.deceasedName,
        description: data.description,
        targetDate: data.targetDate,
        creatorName: data.creatorName,
        juzs: initialJuzs,
    };

    const khatams = getLocalKhatams();
    khatams.push(newKhatam);
    saveLocalKhatams(khatams);
    
    // Automatically give the creator access to this Khatam locally as well
    addToUserHistory(newKhatam.id);
    
    return newKhatam;
};

export const updateJuzStatus = async (khatamId: string, juzNumber: number, status: JuzStatus, claimedBy?: string): Promise<Khatam | null> => {
    await delay(100);
    const khatams = getLocalKhatams();
    const index = khatams.findIndex(k => k.id === khatamId);
    
    if (index === -1) return null;

    const khatam = khatams[index];
    const juzIndex = khatam.juzs.findIndex(j => j.juzNumber === juzNumber);

    if (juzIndex === -1) return null;

    const updatedJuz = { ...khatam.juzs[juzIndex] };
    updatedJuz.status = status;
    
    if (status === 'claimed') {
        updatedJuz.claimedBy = claimedBy;
        updatedJuz.claimedAt = Date.now();
        updatedJuz.completedAt = undefined;
    } else if (status === 'completed') {
        updatedJuz.completedAt = Date.now();
    } else if (status === 'available') {
        updatedJuz.claimedBy = null;
        updatedJuz.claimedAt = undefined;
        updatedJuz.completedAt = undefined;
    }

    khatam.juzs[juzIndex] = updatedJuz;
    khatams[index] = khatam;
    saveLocalKhatams(khatams);
    
    return khatam;
};

export const deleteKhatam = async (id: string) => {
    await delay(300);
    let khatams = getLocalKhatams();
    khatams = khatams.filter(k => k.id !== id);
    saveLocalKhatams(khatams);
    removeFromUserHistory(id);
}