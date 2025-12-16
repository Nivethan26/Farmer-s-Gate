import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const ProfileHeaderSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mb-6 sm:mb-8 lg:mb-10">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4 sm:mb-6 hover:bg-green-50 hover:text-green-700 transition-all duration-200 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">{t('profile.back')}</span>
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
          {t('profile.myProfile')}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl">
          {t('profile.manageInfo')}
        </p>
      </div>
    </div>
  );
};

