import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Shield, Award, User, LogOut, FileText } from 'lucide-react';

export function NavBar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">{t('appName')}</h1>
          </div>
          
          {user.role === 'citizen' && (
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/citizen-dashboard')}
              >
                {t('dashboard')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/examples')}
              >
                <FileText className="w-4 h-4 mr-2" />
                {t('exampleComplaints')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/rewards')}
              >
                <Award className="w-4 h-4 mr-2" />
                {t('myRewards')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/profile')}
              >
                <User className="w-4 h-4 mr-2" />
                {t('profile')}
              </Button>
            </div>
          )}
          
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </Button>
        </div>
      </div>
    </nav>
  );
}
