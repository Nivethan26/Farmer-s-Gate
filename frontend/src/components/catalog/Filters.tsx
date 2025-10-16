import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setFilters, resetFilters } from '@/store/catalogSlice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { getCategoryTranslationKey } from '@/utils/translations';

const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export const Filters = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.catalog.categories);
  const filters = useAppSelector((state) => state.catalog.filters);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    dispatch(setFilters({ categories: newCategories }));
  };

  const handleDistrictToggle = (district: string) => {
    const newDistricts = filters.districts.includes(district)
      ? filters.districts.filter((d) => d !== district)
      : [...filters.districts, district];
    dispatch(setFilters({ districts: newDistricts }));
  };

  const handleSupplyTypeToggle = (type: string) => {
    const newTypes = filters.supplyTypes.includes(type)
      ? filters.supplyTypes.filter((t) => t !== type)
      : [...filters.supplyTypes, type];
    dispatch(setFilters({ supplyTypes: newTypes }));
  };

  const handlePriceChange = (values: number[]) => {
    dispatch(setFilters({ minPrice: values[0], maxPrice: values[1] }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{t('catalog.filters')}</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="mr-1 h-4 w-4" />
          {t('common.cancel')}
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t('catalog.categories')}</Label>
        <div className="space-y-2">
          {categories.map((category) => {
            const categoryKey = getCategoryTranslationKey(category.id);
            const displayName = categoryKey ? t(categoryKey) : category.name;
            return (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <label
                  htmlFor={`cat-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category.icon} {displayName}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supply Type */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t('seller.supplyType')}</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wholesale"
              checked={filters.supplyTypes.includes('wholesale')}
              onCheckedChange={() => handleSupplyTypeToggle('wholesale')}
            />
            <label htmlFor="wholesale" className="text-sm font-medium cursor-pointer">
              {t('seller.wholesale')}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="small_scale"
              checked={filters.supplyTypes.includes('small_scale')}
              onCheckedChange={() => handleSupplyTypeToggle('small_scale')}
            />
            <label htmlFor="small_scale" className="text-sm font-medium cursor-pointer">
              {t('seller.smallScale')}
            </label>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t('catalog.priceRange')} (Rs./kg)</Label>
        <div className="space-y-4">
          <Slider
            min={0}
            max={2000}
            step={10}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={filters.minPrice}
              onChange={(e) => dispatch(setFilters({ minPrice: Number(e.target.value) }))}
              className="w-20"
            />
            <span>-</span>
            <Input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => dispatch(setFilters({ maxPrice: Number(e.target.value) }))}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Districts */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t('catalog.location')} ({t('profile.district')})</Label>
        <ScrollArea className="h-48">
          <div className="space-y-2 pr-4">
            {districts.map((district) => (
              <div key={district} className="flex items-center space-x-2">
                <Checkbox
                  id={`dist-${district}`}
                  checked={filters.districts.includes(district)}
                  onCheckedChange={() => handleDistrictToggle(district)}
                />
                <label
                  htmlFor={`dist-${district}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {district}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
