import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import Icon from '@/components/ui/icon';
import SeminarsTable from '@/components/seminars/SeminarsTable';
import SeminarsPagination from '@/components/seminars/SeminarsPagination';
import AddSeminarDialog from '@/components/seminars/AddSeminarDialog';

const tabs = [
  { id: 'upcoming', label: 'Будущие' },
  { id: 'history', label: 'История' },
  { id: 'application', label: 'Заявки на семинар' },
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
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-end">
        <div className="relative max-w-md">
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

      <div className="flex items-center justify-between mb-6 border-b border-gray-200">
        <div className="flex gap-4">
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
        <div className="pb-3">
          <SeminarsPagination
            page={page}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            onPageChange={(newPage) => dispatch(setPage(newPage))}
            onRowsPerPageChange={(rows) => dispatch(setRowsPerPage(rows))}
          />
        </div>
      </div>

      {currentTab !== 'application' && (
        <Button
          onClick={() => setShowAddDialog(true)}
          className="w-full mb-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
        >
          Добавить семинар
        </Button>
      )}

      {paginatedSeminars.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Здесь пока нет семинаров
        </div>
      ) : (
        <SeminarsTable
          seminars={paginatedSeminars}
          currentTab={currentTab}
          getUserById={getUserById}
          onDelete={handleDelete}
        />
      )}

      <AddSeminarDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={onSubmit}
        users={users}
        cities={cities}
      />
    </div>
  );
}