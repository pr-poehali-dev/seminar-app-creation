import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import {
  setSeminars,
  setSearchQuery,
  setCurrentTab,
  setPage,
  setRowsPerPage,
  deleteSeminar,
} from '@/store/seminarsSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

const tabs = [
  { id: 'future', label: 'Будущие' },
  { id: 'history', label: 'История' },
  { id: 'request', label: 'Заявки на семинар' },
];

export default function SeminarsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { seminars, searchQuery, currentTab, page, rowsPerPage } = useSelector(
    (state: RootState) => state.seminars
  );

  useEffect(() => {
    fetch('/dbA.json')
      .then((res) => res.json())
      .then((data) => dispatch(setSeminars(data.seminars)));
  }, [dispatch]);

  const filteredSeminars = useMemo(() => {
    return seminars.filter(
      (seminar) =>
        seminar.type === currentTab &&
        (seminar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seminar.speaker.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [seminars, currentTab, searchQuery]);

  const paginatedSeminars = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSeminars.slice(start, start + rowsPerPage);
  }, [filteredSeminars, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredSeminars.length / rowsPerPage);

  const handleDelete = (id: number) => {
    dispatch(deleteSeminar(id));
  };

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

      <Button className="w-full mb-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
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
                  <TableHead>Дата</TableHead>
                  {currentTab === 'history' && <TableHead>Лайки</TableHead>}
                  {(currentTab === 'history' || currentTab === 'request') && (
                    <TableHead>Действия</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSeminars.map((seminar) => (
                  <TableRow key={seminar.id}>
                    <TableCell>
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell className="font-medium">{seminar.name}</TableCell>
                    <TableCell className="text-gray-600">{seminar.speaker}</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(seminar.date).toLocaleDateString('ru-RU')}
                    </TableCell>
                    {currentTab === 'history' && (
                      <TableCell>
                        <div className="flex items-center gap-1 text-[#8B5CF6]">
                          <Icon name="Heart" size={16} />
                          <span>{seminar.likes}</span>
                        </div>
                      </TableCell>
                    )}
                    {(currentTab === 'history' || currentTab === 'request') && (
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
                ))}
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
    </div>
  );
}
