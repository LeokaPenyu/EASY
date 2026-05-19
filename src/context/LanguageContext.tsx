import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, TRANSLATIONS } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS[Language.BM]) => string;
  translateContent: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple mock dictionary for demo automatic translation
const MOCK_DICTIONARY: Record<string, { BM: string; EN: string }> = {
  "Apakah prinsip pertama di dalam pergerakan Palang Merah?": {
    BM: "Apakah prinsip pertama di dalam pergerakan Palang Merah?",
    EN: "What is the first principle of the Red Cross movement?"
  },
  "Kemanusiaan": { BM: "Kemanusiaan", EN: "Humanity" },
  "Kesaksamaan": { BM: "Kesaksamaan", EN: "Impartiality" },
  "Keberkecualian": { BM: "Keberkecualian", EN: "Neutrality" },
  "Kebebasan": { BM: "Kebebasan", EN: "Independence" },
  "Berapakah bilangan prinsip asas pergerakan Palang Merah dan Bulan Sabit Merah?": {
    BM: "Berapakah bilangan prinsip asas pergerakan Palang Merah dan Bulan Sabit Merah?",
    EN: "How many fundamental principles are there in the Red Cross and Red Crescent movement?"
  },
  "Identity Verification Required": {
    BM: "Pengesahan Identiti Diperlukan",
    EN: "Identity Verification Required"
  },
  "Please ensure you have your physical MyKad, Pasport, or BSMM Membership Card ready. Online exams require active web camera monitoring and a stable internet connection.": {
    BM: "Sila pastikan anda mempunyai MyKad, Pasport, atau Kad Keahlian BSMM fizikal yang bersedia. Peperiksaan dalam talian memerlukan pemantauan kamera web aktif dan sambungan internet yang stabil.",
    EN: "Please ensure you have your physical MyKad, Pasport, or BSMM Membership Card ready. Online exams require active web camera monitoring and a stable internet connection."
  },
  "Active Registrations": {
    BM: "Pendaftaran Aktif",
    EN: "Active Registrations"
  },
  "System Online": {
    BM: "Sistem Dalam Talian",
    EN: "System Online"
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.BM);

  const t = (key: keyof typeof TRANSLATIONS[Language.BM]) => {
    return TRANSLATIONS[language][key] || key;
  };

  // Mock auto translator
  const translateContent = (text: string) => {
    if (!text) return text;
    // Check if we have a direct match in our dictionary
    const dictMatch = MOCK_DICTIONARY[text] || Object.values(MOCK_DICTIONARY).find(v => v.BM === text || v.EN === text);
    if (dictMatch) {
      return dictMatch[language];
    }
    
    // If no match, add a small indicator to show "auto-translation" is active for demo
    if (language === Language.EN && !text.match(/^[0-9]+$/)) {
      // Very basic keyword replacement for demo purposes
      let translated = text
        .replace(/Soalan Tidak Diketahui/gi, "Unknown Question")
        .replace(/Tiada/gi, "None")
        .replace(/Pilihan/gi, "Option")
        .replace(/Disertakan/gi, "Included");
        
      if (translated === text && text.length > 3) {
         // Fake translation suffix if we don't know the phrase
         return `${text} [EN]`;
      }
      return translated;
    } else if (language === Language.BM && !text.match(/^[0-9]+$/)) {
      let translated = text
        .replace(/Unknown Question/gi, "Soalan Tidak Diketahui")
        .replace(/None/gi, "Tiada")
        .replace(/Option/gi, "Pilihan")
        .replace(/Included/gi, "Disertakan");

      if (translated === text && text.length > 3 && !text.match(/[a-zA-Z]/i) === false) {
         // Just append a [BM] marker for strings we didn't explicitly translate
         // to prove to the user that translation ran through the whole system
         if (!text.includes('[BM]') && !text.includes('?')) {
           return `${text} [BM]`;
         }
      }
      return translated;
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateContent }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
