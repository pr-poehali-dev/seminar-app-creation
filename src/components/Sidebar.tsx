import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const menuItems = [
  { name: 'Заявки', icon: 'ClipboardList', path: '/applications' },
  { name: 'Продукты', icon: 'Package', path: '/products' },
  { name: 'Пользователи', icon: 'Users', path: '/users' },
  { name: 'Категории', icon: 'Folder', path: '/categories' },
  { name: 'Города', icon: 'Map', path: '/cities' },
  { name: 'Бренды', icon: 'Star', path: '/brands' },
  { name: 'Протоколы', icon: 'FileText', path: '/protocols' },
  { name: 'Заказы', icon: 'Tag', path: '/orders' },
  { name: 'Баннеры', icon: 'Layout', path: '/banners' },
  { name: 'Семинары', icon: 'Calendar', path: '/seminars' },
  { name: 'Промокоды', icon: 'DollarSign', path: '/promocodes' },
  { name: 'Настройки', icon: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#8B5CF6] text-white rounded-lg"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={24} />
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300',
          'md:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <img
              src="/favicon.svg"
              alt="FILARA COSMO"
              className="h-16 object-contain"
            />
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#9D87F6] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon name={item.icon} size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}