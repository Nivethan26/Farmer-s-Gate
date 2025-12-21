import { useTranslation } from 'react-i18next';

export const ProfileHeaderSection = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
          {t('profile.myProfile')}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('profile.manageInfo')}
        </p>
      </div>
    </div>
  );
};

