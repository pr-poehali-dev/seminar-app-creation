import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface LoginPageProps {
  onLogin: (email: string, rememberMe: boolean) => void;
}

const ALLOWED_EMAILS = [
  'm.ivanova@example.com',
  'e.petrova@example.com',
  'a.sidorov@example.com',
  'v.kravtsov@example.com',
  'n.alyoshina@example.com',
  't.ulianova@example.com',
  'k.smirnov@example.com',
  's.romanova@example.com',
  'o.vasilieva@example.com',
  'i.zaicev@example.com'
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateEmail = (value: string) => {
    if (!value) {
      return 'E-mail обязателен для заполнения';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Введите корректный e-mail';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Пароль обязателен для заполнения';
    }
    if (value.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLoginError('');
    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setLoginError('');
    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setTouched({ email: true, password: true });

    if (!emailErr && !passwordErr) {
      if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
        setLoginError('Неверная почта или пароль');
        return;
      }
      onLogin(email, rememberMe);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="Filara Cosmo"
              className="h-32"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://cdn.poehali.dev/files/2b7c8c2e-68b3-4b90-9cd6-f26d822086e2.png';
              }}
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
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                className={`w-full ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">{emailError}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">Пароль</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={handlePasswordBlur}
                  className={`w-full pr-10 ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">{passwordError}</p>
              )}
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

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!email || !password || !!emailError || !!passwordError}
              className="w-full bg-[#B794E8] hover:bg-[#A683D7] text-white disabled:opacity-50 disabled:cursor-not-allowed"
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