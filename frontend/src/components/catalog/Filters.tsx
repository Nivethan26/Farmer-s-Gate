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

interface FiltersProps {
  isMobile?: boolean;
}

export const Filters = ({ isMobile = false }: FiltersProps) => {
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
    <div className={`space-y-5 ${isMobile ? 'pb-4' : ''}`}>
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 className="font-bold text-lg text-gray-800">{t('catalog.filters')}</h3>
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-green-600 hover:text-green-700 hover:bg-green-50">
          <X className="mr-1 h-4 w-4" />
          {t('common.cancel')}
        </Button>
      </div>

      {isMobile ? (
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-5 pr-3">
            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('catalog.categories')}</Label>
              <div className="space-y-2">
                {categories.map((category) => {
                  const categoryKey = getCategoryTranslationKey(category.id);
                  const displayName = categoryKey ? t(categoryKey) : category.name;
                  return (
                    <div key={category.id} className="flex items-center space-x-2 hover:bg-green-50/50 p-2 rounded-lg transition-colors cursor-pointer">
                      <Checkbox
                        id={`cat-${category.id}`}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <label
                        htmlFor={`cat-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                      >
                        <span className="text-lg">{category.icon}</span> {displayName}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Supply Type */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('seller.supplyType')}</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 hover:bg-green-50/50 p-2 rounded-lg transition-colors cursor-pointer">
                  <Checkbox
                    id="wholesale"
                    checked={filters.supplyTypes.includes('wholesale')}
                    onCheckedChange={() => handleSupplyTypeToggle('wholesale')}
                    className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <label htmlFor="wholesale" className="text-sm font-medium cursor-pointer">
                    {t('seller.wholesale')}
                  </label>
                </div>
                <div className="flex items-center space-x-2 hover:bg-amber-50/50 p-2 rounded-lg transition-colors cursor-pointer">
                  <Checkbox
                    id="small_scale"
                    checked={filters.supplyTypes.includes('small_scale')}
                    onCheckedChange={() => handleSupplyTypeToggle('small_scale')}
                    className="border-gray-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                  />
                  <label htmlFor="small_scale" className="text-sm font-medium cursor-pointer">
                    {t('seller.smallScale')}
                  </label>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('catalog.priceRange')} (Rs./kg)</Label>
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
                    className="w-20 rounded-lg border-gray-300"
                  />
                  <span className="text-gray-500 font-semibold">-</span>
                  <Input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => dispatch(setFilters({ maxPrice: Number(e.target.value) }))}
                    className="w-20 rounded-lg border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Districts */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('catalog.location')} ({t('profile.district')})</Label>
              <ScrollArea className="h-48 border border-gray-200 rounded-lg p-2">
                <div className="space-y-2 pr-4">
                  {districts.map((district) => (
                    <div key={district} className="flex items-center space-x-2 hover:bg-green-50/50 p-2 rounded-lg transition-colors cursor-pointer">
                      <Checkbox
                        id={`dist-${district}`}
                        checked={filters.districts.includes(district)}
                        onCheckedChange={() => handleDistrictToggle(district)}
                        className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
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
        </ScrollArea>
      ) : (
        <>
          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('catalog.categories')}</Label>
            <div className="space-y-2">
              {categories.map((category) => {
                const categoryKey = getCategoryTranslationKey(category.id);
                const displayName = categoryKey ? t(categoryKey) : category.name;
                return (
                  <div key={category.id} className="flex items-center space-x-2 hover:bg-green-50/50 p-2 rounded-lg transition-colors cursor-pointer">
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                      className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <label
                      htmlFor={`cat-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-lg">{category.icon}</span> {displayName}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supply Type */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('seller.supplyType')}</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 hover:bg-green-50/50 p-2 rounded-lg transition-colors cursor-pointer">
                <Checkbox
                  id="wholesale"
                  checked={filters.supplyTypes.includes('wholesale')}
                  onCheckedChange={() => handleSupplyTypeToggle('wholesale')}
                  className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <label htmlFor="wholesale" className="text-sm font-medium cursor-pointer">
                  {t('seller.wholesale')}
                </label>
              </div>
              <div className="flex items-center space-x-2 hover:bg-amber-50/50 p-2 rounded-lg transition-colors cursor-pointer">
                <Checkbox
                  id="small_scale"
                  checked={filters.supplyTypes.includes('small_scale')}
                  onCheckedChange={() => handleSupplyTypeToggle('small_scale')}
                  className="border-gray-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                />
                <label htmlFor="small_scale" className="text-sm font-medium cursor-pointer">
                  {t('seller.smallScale')}
                </label>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('catalog.priceRange')} (Rs./kg)</Label>
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
                  className="w-20 rounded-lg border-gray-300"
                />
                <span className="text-gray-500 font-semibold">-</span>
                <Input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => dispatch(setFilters({ maxPrice: Number(e.target.value) }))}
                  className="w-20 rounded-lg border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Districts */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('catalog.location')} ({t('profile.district')})</Label>
            <ScrollArea className="h-48 border border-gray-200 rounded-lg p-2">
              <div className="space-y-2 pr-4">
                {districts.map((district) => (
                  <div key={district} className="flex items-center space-x-2 hover:bg-green-50/50 p-2 rounded-lg transition-colors cursor-pointer">
                    <Checkbox
                      id={`dist-${district}`}
                      checked={filters.districts.includes(district)}
                      onCheckedChange={() => handleDistrictToggle(district)}
                      className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
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
        </>
      )}
    </div>
  );
};