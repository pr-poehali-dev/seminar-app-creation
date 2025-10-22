import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import type { RootState, AppDispatch } from '@/store/store';
import { setBrands, addBrand, deleteBrand } from '@/store/brandsSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BrandFormData {
  name: string;
  logo: string;
}

export default function BrandsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector((state: RootState) => state.brands.brands);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BrandFormData>();

  useEffect(() => {
    fetch('/dbB.json')
      .then((res) => res.json())
      .then((data) => dispatch(setBrands(data.brands)));
  }, [dispatch]);

  const onSubmit = (data: BrandFormData) => {
    const newBrand = {
      id: Date.now(),
      name: data.name,
      logo: data.logo,
    };
    dispatch(addBrand(newBrand));
    reset();
  };

  const handleDeleteClick = (id: number, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch(deleteBrand(deleteId));
      setDeleteId(null);
      setDeleteName('');
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="name">Введите название бренда</Label>
            <Input
              id="name"
              {...register('name', { required: 'Название обязательно' })}
              placeholder="Введите название бренда"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="logo">Загрузите логотип бренда</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="logo"
                {...register('logo')}
                placeholder="Размер логотипа 600×600 в PNG, JPG, JPEG"
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon">
                <Icon name="Upload" size={20} className="text-gray-600" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Размер логотипа 600×600 в PNG, JPG, JPEG
            </p>
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
              Добавить бренд
            </Button>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-gray-700">
          <div>Логотип бренда</div>
          <div>Название бренда</div>
          <div></div>
        </div>

        {brands.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Здесь пока нет брендов
          </div>
        ) : (
          brands.map((brand) => (
            <div
              key={brand.id}
              className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 last:border-b-0 items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-20 h-20 object-contain bg-gray-100 rounded-lg p-2"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon name="Image" size={32} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="font-medium text-gray-900">{brand.name}</div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-[#8B5CF6]">
                  <Icon name="Pencil" size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(brand.id, brand.name)}
                  className="text-gray-600 hover:text-red-500"
                >
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы действительно хотите удалить бренд</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium text-gray-900">
              {deleteName}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[#8B5CF6]">
              Отменить удаление
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}