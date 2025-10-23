import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import type { RootState, AppDispatch } from '@/store/store';
import {
  setSeminars,
  setSearchQuery,
  setCurrentTab,
  setPage,
  setRowsPerPage,
  deleteSeminar,
  addSeminar,
} from '@/store/seminarsSlice';
import type { Seminar } from '@/store/seminarsSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const tabs = [
  { id: 'application', label: 'Заявки на семинар' },
  { id: 'upcoming', label: 'Будущие' },
  { id: 'history', label: 'История' },
];

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

export default function SeminarsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { seminars, searchQuery, currentTab, page, rowsPerPage } = useSelector(
    (state: RootState) => state.seminars
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SeminarFormData>();

  useEffect(() => {
    fetch('/dbA.json')
      .then((res) => res.json())
      .then((data) => {
        const transformedSeminars = data.seminars.map((s: any) => ({
          ...s,
        }));
        dispatch(setSeminars(transformedSeminars));
        setUsers(data.users || []);
        setCities(data.cities || []);
      });
  }, [dispatch]);

  const getUserById = (userId: number) => {
    return users.find((u) => u.id === userId);
  };

  const filteredSeminars = useMemo(() => {
    return seminars.filter(
      (seminar) =>
        seminar.status === currentTab &&
        (seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          getUserById(seminar.userId)?.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [seminars, currentTab, searchQuery, users]);

  const paginatedSeminars = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSeminars.slice(start, start + rowsPerPage);
  }, [filteredSeminars, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredSeminars.length / rowsPerPage);

  const handleDelete = (id: number) => {
    dispatch(deleteSeminar(id));
  };

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

  const onSubmit = (data: SeminarFormData) => {
    const newSeminar: Seminar = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      photo: data.photo || '',
      userId: data.userId,
      status: 'application',
    };
    dispatch(addSeminar(newSeminar));
    setShowAddDialog(false);
    reset();
  };

  const selectedUser = watch('userId');
  const selectedUserData = users.find((u) => u.id === Number(selectedUser));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon
            name="Search"
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Поиск по семинарам"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setCurrentTab(tab.id as any))}
            className={`pb-3 px-1 relative font-medium transition-colors ${
              currentTab === tab.id
                ? 'text-[#8B5CF6]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {currentTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6]" />
            )}
          </button>
        ))}
      </div>

      <Button
        onClick={() => setShowAddDialog(true)}
        className="w-full mb-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
      >
        Добавить семинар
      </Button>

      {paginatedSeminars.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Здесь пока нет семинаров
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Спикер</TableHead>
                  {currentTab === 'application' && <TableHead>Телефон</TableHead>}
                  <TableHead>Дата</TableHead>
                  {currentTab === 'history' && <TableHead>Лайки</TableHead>}
                  {currentTab === 'upcoming' && <TableHead>Действия</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSeminars.map((seminar) => {
                  const user = getUserById(seminar.userId);
                  return (
                    <TableRow key={seminar.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell className="font-medium">{seminar.title}</TableCell>
                      <TableCell className="text-gray-600">{user?.fullName || '-'}</TableCell>
                      {currentTab === 'application' && (
                        <TableCell className="text-gray-600">{user?.phone || '-'}</TableCell>
                      )}
                      <TableCell className="text-gray-600">
                        {seminar.date} {seminar.time}
                      </TableCell>
                      {currentTab === 'history' && (
                        <TableCell>
                          <div className="flex items-center gap-1 text-[#8B5CF6]">
                            <Icon name="Heart" size={16} />
                            <span>{seminar.likes || 0}</span>
                          </div>
                        </TableCell>
                      )}
                      {currentTab === 'upcoming' && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(seminar.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Показывать</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => dispatch(setRowsPerPage(Number(value)))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">
                Страница {page + 1} из {totalPages}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => dispatch(setPage(page - 1))}
              >
                <Icon name="ChevronLeft" size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => dispatch(setPage(page + 1))}
              >
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить семинар</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  setShowAddDialog(false);
                  reset();
                }}
                className="flex-1 text-gray-600"
              >
                Удалить
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              >
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
