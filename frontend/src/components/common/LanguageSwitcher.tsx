import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLanguage, Language } from '@/store/uiSlice';
import type { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

const languages = [
  { code: 'en' as Language, label: 'English', native: 'EN (English)' },
  { code: 'si' as Language, label: 'Sinhala', native: 'සිං (Sinhala)' },
  { code: 'ta' as Language, label: 'Tamil', native: 'தமிழ் (Tamil)' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state: RootState) => state.ui.language);

  const currentLang = languages.find((l) => l.code === currentLanguage) || languages[0];

  const handleLanguageChange = (langCode: Language) => {
    // Update i18next
    i18n.changeLanguage(langCode);
    // Update Redux state
    dispatch(setLanguage(langCode));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="group gap-2 h-9 px-3 rounded-lg border-green-200 bg-white/80 hover:bg-green-50 transition-all duration-300 hover:shadow-md hover:shadow-green-100/50 hover:border-green-300 md:h-11 md:px-4"
          aria-label="Change language"
        >
          <Languages className="h-4 w-4 text-green-700 group-hover:text-green-800 transition-colors md:h-5 md:w-5" />
          <span className="font-semibold text-sm text-green-800 whitespace-nowrap md:text-base">
            {currentLang.native.split(' ')[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 border-green-200/50 shadow-2xl backdrop-blur-xl bg-white/95 rounded-2xl overflow-hidden md:w-56"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer transition-all duration-200 ${
              currentLanguage === lang.code 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 font-semibold' 
                : 'hover:bg-green-50/50 text-green-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>{lang.native}</span>
            </span>
            {currentLanguage === lang.code && (
              <span className="ml-auto text-green-600 font-bold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
