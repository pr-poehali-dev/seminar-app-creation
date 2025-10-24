import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppHeader from './components/AppHeader';
import Sidebar from './components/Sidebar';
import SeminarsPage from './pages/SeminarsPage';
import BrandsPage from './pages/BrandsPage';
import EmptyPage from './pages/EmptyPage';
import LoginPage from './pages/LoginPage';
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

const App = () => {
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedAuth = localStorage.getItem('isAuthenticated');
    
    if (savedEmail && savedAuth === 'true') {
      setUserEmail(savedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAuthenticated');
  };

  const handleLogin = (email: string, rememberMe: boolean) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    
    if (rememberMe) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAuthenticated', 'true');
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Provider store={store}>
          <BrowserRouter>
            {!isAuthenticated ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <div className="min-h-screen bg-gray-50">
                <Sidebar />
                <AppHeader userEmail={userEmail} onLogout={handleLogout} />
                
                <main className="md:ml-64 mt-16 min-h-[calc(100vh-4rem)]">
                  <Routes>
                    <Route path="/" element={<Navigate to="/seminars" replace />} />
                    <Route path="/seminars" element={<SeminarsPage />} />
                    <Route path="/applications" element={<EmptyPage />} />
                    <Route path="/products" element={<EmptyPage />} />
                    <Route path="/users" element={<EmptyPage />} />
                    <Route path="/categories" element={<EmptyPage />} />
                    <Route path="/cities" element={<EmptyPage />} />
                    <Route path="/brands" element={<BrandsPage />} />
                    <Route path="/protocols" element={<EmptyPage />} />
                    <Route path="/orders" element={<EmptyPage />} />
                    <Route path="/banners" element={<EmptyPage />} />
                    <Route path="/promocodes" element={<EmptyPage />} />
                    <Route path="/settings" element={<EmptyPage />} />
                  </Routes>
                </main>
              </div>
            )}
          </BrowserRouter>
        </Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;