import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import type { RootState, AppDispatch } from '@/store/store';
import { setBrands, addBrand, deleteBrand, updateBrand } from '@/store/brandsSlice';
import type { Brand } from '@/store/brandsSlice';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface BrandFormData {
  name: string;
  logo: string;
}

export default function BrandsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector((state: RootState) => state.brands.brands);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [uploadingEditLogo, setUploadingEditLogo] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BrandFormData>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue, formState: { errors: errorsEdit } } = useForm<BrandFormData>();

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

  const handleEditClick = (brand: Brand) => {
    setEditBrand(brand);
    setValue('name', brand.name);
    setValue('logo', brand.logo || '');
  };

  const handleEditLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      alert('Пожалуйста, загрузите изображение в формате PNG, JPG или JPEG');
      return;
    }

    setUploadingEditLogo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Ошибка загрузки');

      const data = await response.json();
      setValue('logo', data.url);
    } catch (error) {
      console.error('Ошибка загрузки логотипа:', error);
      alert('Ошибка загрузки логотипа');
    } finally {
      setUploadingEditLogo(false);
    }
  };

  const onEditSubmit = (data: BrandFormData) => {
    if (editBrand) {
      dispatch(updateBrand({
        id: editBrand.id,
        name: data.name,
        logo: data.logo,
      }));
      setEditBrand(null);
      resetEdit();
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
                    className="w-[200px] h-[200px] object-contain bg-gray-100 rounded-lg p-4"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon name="Image" size={64} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="font-medium text-gray-900">{brand.name}</div>

              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEditClick(brand)}
                  className="text-gray-600 hover:text-[#8B5CF6]"
                >
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

      <Dialog open={editBrand !== null} onOpenChange={() => setEditBrand(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать бренд</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Название бренда</Label>
                <Input
                  id="edit-name"
                  {...registerEdit('name', { required: 'Название обязательно' })}
                  placeholder="Введите название бренда"
                  className="mt-1"
                />
                {errorsEdit.name && (
                  <p className="text-red-500 text-sm mt-1">{errorsEdit.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-logo">Логотип бренда</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="edit-logo"
                    {...registerEdit('logo')}
                    placeholder="URL логотипа"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={uploadingEditLogo}
                    onClick={() => document.getElementById('edit-logo-file')?.click()}
                  >
                    {uploadingEditLogo ? (
                      <Icon name="Loader2" size={20} className="text-gray-600 animate-spin" />
                    ) : (
                      <Icon name="Upload" size={20} className="text-gray-600" />
                    )}
                  </Button>
                  <input
                    id="edit-logo-file"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleEditLogoUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Размер логотипа 600×600 в PNG, JPG, JPEG
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditBrand(null);
                  resetEdit();
                }}
                className="text-[#8B5CF6]"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              >
                Сохранить изменения
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}