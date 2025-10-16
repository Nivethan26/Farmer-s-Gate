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
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="font-medium">{currentLang.native.split(' ')[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer ${currentLanguage === lang.code ? 'bg-accent font-semibold' : ''}`}
          >
            <span>{lang.native}</span>
            {currentLanguage === lang.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
