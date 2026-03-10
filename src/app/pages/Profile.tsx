import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NavBar } from '../components/NavBar';
import { CitizenAvatar } from '../components/CitizenAvatar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [upiId, setUpiId] = useState(user?.upiId || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 1);

  if (!user || user.role !== 'citizen') {
    navigate('/');
    return null;
  }

  const handleSave = () => {
    updateProfile({
      name,
      phoneNumber,
      upiId,
      avatar: selectedAvatar,
    });
    toast.success('Profile updated successfully!');
  };

  const avatarIds = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-600 mb-8">{t('profile')}</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Avatar Selection */}
            <Card>
              <CardHeader>
                <CardTitle>{t('yourAvatar')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <CitizenAvatar id={selectedAvatar} size="xl" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {avatarIds.map((id) => (
                    <div
                      key={id}
                      onClick={() => setSelectedAvatar(id)}
                      className={`cursor-pointer rounded-lg p-2 transition-all ${
                        selectedAvatar === id
                          ? 'ring-4 ring-blue-500 bg-blue-50'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <CitizenAvatar id={id} size="sm" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('editProfile')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t('phoneNumber')}</Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="upi">{t('upiId')}</Label>
                  <Input
                    id="upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                  />
                </div>

                <Button onClick={handleSave} className="w-full">
                  {t('save')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Summary */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Contribution Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">{user.totalComplaints}</div>
                  <div className="text-sm text-gray-600">{t('totalComplaints')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{user.streaks}</div>
                  <div className="text-sm text-gray-600">{t('streaks')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600">{user.points}</div>
                  <div className="text-sm text-gray-600">{t('points')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">
                    {Math.floor(user.totalComplaints * 0.8)}
                  </div>
                  <div className="text-sm text-gray-600">{t('approved')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
