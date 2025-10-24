import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AppHeaderProps {
  userEmail: string;
  onLogout: () => void;
}

export default function AppHeader({ userEmail, onLogout }: AppHeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-full px-6">
        <div></div>
        
        <div className="flex items-center gap-4">
          <Icon name="Bell" size={20} className="text-gray-600" />
          <span className="text-sm text-gray-700">{userEmail}</span>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-500 hover:bg-transparent"
          >
            <Icon name="LogOut" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}