import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://cdn.poehali.dev/files/2b7c8c2e-68b3-4b90-9cd6-f26d822086e2.png" 
              alt="Filara Cosmo"
              className="h-32"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-xl font-normal mb-6">Вход в учётную запись</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">E-mail</label>
              <Input
                type="email"
                placeholder="Введите свой e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">Пароль</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Запомнить меня
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#B794E8] hover:bg-[#A683D7] text-white"
            >
              Войти
            </Button>

            <div className="text-center">
              <a
                href="#"
                className="text-sm text-[#B794E8] hover:text-[#A683D7]"
              >
                Забыли пароль?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
