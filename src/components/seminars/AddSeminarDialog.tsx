import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface SeminarFormData {
  title: string;
  description: string;
  userId: number;
  date: string;
  time: string;
  photo: string;
}

interface User {
  id: number;
  fullName: string;
  speciality: string;
  phone: string;
}

interface City {
  id: number;
  name: string;
}

interface AddSeminarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SeminarFormData) => void;
  users: User[];
  cities: City[];
}

export default function AddSeminarDialog({
  open,
  onOpenChange,
  onSubmit,
  users,
  cities,
}: AddSeminarDialogProps) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SeminarFormData>();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      alert('Пожалуйста, загрузите изображение в формате PNG, JPG или JPEG');
      return;
    }

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Ошибка загрузки');

      const data = await response.json();
      setValue('photo', data.url);
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
      alert('Ошибка загрузки фото');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const selectedUser = watch('userId');
  const selectedUserData = users.find((u) => u.id === Number(selectedUser));

  const handleFormSubmit = (data: SeminarFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Добавить семинар</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Название*</Label>
              <Input
                id="title"
                {...register('title', { required: 'Название обязательно' })}
                placeholder="Новинки Kosmoteros"
                className="mt-1"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Описание*</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Описание обязательно' })}
                placeholder="Опишите семинар"
                className="mt-1 min-h-[80px]"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="userId">Спикер*</Label>
              <Select
                onValueChange={(value) => setValue('userId', Number(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Выберите спикера" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.userId && (
                <p className="text-red-500 text-sm mt-1">Выберите спикера</p>
              )}
            </div>

            {selectedUserData && (
              <div>
                <Label>Специальность спикера*</Label>
                <Input
                  value={selectedUserData.speciality}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
            )}

            <div>
              <Label htmlFor="cityId">Город*</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Дата*</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date', { required: 'Дата обязательна' })}
                  className="mt-1"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="time">Время*</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time', { required: 'Время обязательно' })}
                  className="mt-1"
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="photo">Фото</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="photo"
                  {...register('photo')}
                  placeholder="URL фотографии или загрузите файл"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={uploadingPhoto}
                  onClick={() => document.getElementById('photo-file')?.click()}
                >
                  {uploadingPhoto ? (
                    <Icon name="Loader2" size={20} className="animate-spin" />
                  ) : (
                    <Icon name="Image" size={20} />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={uploadingPhoto}
                  onClick={() => document.getElementById('photo-file')?.click()}
                >
                  <Icon name="Trash2" size={20} />
                </Button>
                <input
                  id="photo-file"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              {watch('photo') && (
                <p className="text-xs text-gray-500 mt-1 break-all">{watch('photo')}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Размер фото 750×735 в PNG, JPG, JPEG
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            >
              Создать семинар
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
