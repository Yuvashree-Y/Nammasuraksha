import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { Toaster } from '../components/ui/sonner';

export function Root() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          <Outlet />
          <Toaster />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}
