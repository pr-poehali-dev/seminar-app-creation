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
import type { Seminar } from '@/store/seminarsSlice';

interface User {
  id: number;
  fullName: string;
  speciality: string;
  phone: string;
}

interface SeminarsTableProps {
  seminars: Seminar[];
  currentTab: string;
  getUserById: (userId: number) => User | undefined;
  onDelete: (id: number) => void;
}

export default function SeminarsTable({
  seminars,
  currentTab,
  getUserById,
  onDelete,
}: SeminarsTableProps) {
  return (
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
          {seminars.map((seminar) => {
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
                      onClick={() => onDelete(seminar.id)}
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
  );
}
