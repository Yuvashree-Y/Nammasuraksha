import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Shield, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { login, signup } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    if (mode === 'login') {
      success = await login(email, password, role);
      if (!success) {
        toast.error('Invalid credentials or user not found');
        return;
      }
    } else {
      success = await signup(email, password, name, role);
      if (!success) {
        toast.error('User already exists with this email');
        return;
      }
    }
    
    if (success) {
      toast.success(mode === 'login' ? 'Login successful!' : 'Account created successfully!');
      navigate(role === 'citizen' ? '/citizen-dashboard' : '/authority-dashboard');
    }
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'kn', label: 'ಕನ್ನಡ' },
    { value: 'ta', label: 'தமிழ்' },
    { value: 'te', label: 'తెలుగు' },
    { value: 'ml', label: 'മലയാളം' },
    { value: 'bn', label: 'বাংলা' },
    { value: 'gu', label: 'ગુજરાતી' },
    { value: 'mr', label: 'मराठी' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-blue-900 mb-2">{t('appName')}</h1>
          <p className="text-2xl text-green-700 font-semibold">{t('slogan')}</p>
          
          {/* Language Selector */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Label className="text-sm font-medium">{t('selectLanguage')}:</Label>
            <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Citizen Login */}
          <Card className={`border-2 transition-all cursor-pointer ${role === 'citizen' ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}
                onClick={() => setRole('citizen')}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">{t('loginAsCitizen')}</CardTitle>
              <CardDescription>{t('responsibleCitizen')}</CardDescription>
            </CardHeader>
            <CardContent>
              {role === 'citizen' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <Label htmlFor="name">{t('name')}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {mode === 'login' ? t('login') : t('signup')}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  >
                    {mode === 'login' ? t('signup') : t('login')}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Authority Login */}
          <Card className={`border-2 transition-all cursor-pointer ${role === 'authority' ? 'border-green-500 shadow-lg' : 'border-gray-200'}`}
                onClick={() => setRole('authority')}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <UserCheck className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl">{t('loginAsAuthority')}</CardTitle>
              <CardDescription>Government Official</CardDescription>
            </CardHeader>
            <CardContent>
              {role === 'authority' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <Label htmlFor="auth-name">{t('name')}</Label>
                      <Input
                        id="auth-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="auth-email">{t('email')}</Label>
                    <Input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="auth-password">{t('password')}</Label>
                    <Input
                      id="auth-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    {mode === 'login' ? t('login') : t('signup')}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  >
                    {mode === 'login' ? t('signup') : t('login')}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
