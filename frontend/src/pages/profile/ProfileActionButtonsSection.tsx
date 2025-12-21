import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface ProfileActionButtonsSectionProps {
  isEditing: boolean;
  onCancel: () => void;
}

export const ProfileActionButtonsSection = ({ isEditing, onCancel }: ProfileActionButtonsSectionProps) => {
  const { t } = useTranslation();

  if (!isEditing) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
      <Button
        type="submit"
        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 h-11"
      >
        <Save className="mr-2 h-4 w-4" />
        {t('profile.saveChanges')}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 h-11 bg-transparent"
      >
        <X className="mr-2 h-4 w-4" />
        {t('profile.cancel')}
      </Button>
    </div>
  );
};

