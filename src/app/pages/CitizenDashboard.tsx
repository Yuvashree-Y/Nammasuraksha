import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NavBar } from '../components/NavBar';
import { CitizenAvatar } from '../components/CitizenAvatar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertTriangle, Camera, Trophy, TrendingUp, MapPin, Share2, Construction } from 'lucide-react';
import { toast } from 'sonner';

export function CitizenDashboard() {
  const { user, complaints } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showCongrats, setShowCongrats] = useState(false);
  const [previousStreaks, setPreviousStreaks] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'citizen') {
      navigate('/');
      return;
    }
    
    // Check for new streak
    if (user.streaks > previousStreaks && previousStreaks > 0) {
      setShowCongrats(true);
    }
    setPreviousStreaks(user.streaks);
  }, [user, navigate, previousStreaks]);

  if (!user) return null;

  const userComplaints = complaints.filter(c => c.userId === user.id);
  const pending = userComplaints.filter(c => c.status === 'pending').length;
  const approved = userComplaints.filter(c => c.status === 'approved').length;

  const handleShare = () => {
    const text = `I'm a ${t('responsibleCitizen')} with ${user.streaks} streaks and ${user.points} points on ${t('appName')}! 🏆`;
    
    if (navigator.share) {
      navigator.share({
        title: t('appName'),
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  const highAccidentZones = [
    { name: 'MG Road Junction', accidents: 24 },
    { name: 'Silk Board Signal', accidents: 18 },
    { name: 'Marathahalli Bridge', accidents: 15 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* User Profile Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <CitizenAvatar id={user.avatar} size="lg" />
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-lg opacity-90">{t('responsibleCitizen')}</p>
                <div className="flex gap-6 mt-4">
                  <div>
                    <div className="text-4xl font-bold">{user.streaks}</div>
                    <div className="text-sm opacity-80">{t('streaks')}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">{user.points}</div>
                    <div className="text-sm opacity-80">{t('points')}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">{user.totalComplaints}</div>
                    <div className="text-sm opacity-80">{t('totalComplaints')}</div>
                  </div>
                </div>
                <Button
                  onClick={handleShare}
                  className="mt-4 bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('shareOnSocial')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600">{t('pendingApproval')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-600">{pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">{t('approved')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{approved}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Next Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {10 - (user.points % 10)} points to go
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-red-200"
                onClick={() => navigate('/report-accident')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <CardTitle className="text-red-600">{t('reportAccident')}</CardTitle>
                  <CardDescription>{t('sosEmergency')}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-200"
                onClick={() => navigate('/report-violation')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Camera className="w-8 h-8 text-orange-600" />
                <div>
                  <CardTitle className="text-orange-600">{t('reportViolation')}</CardTitle>
                  <CardDescription>{t('trafficViolation')}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-yellow-200"
                onClick={() => {
                  navigate('/report-violation');
                  // Pass a flag to show damaged road form
                }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Construction className="w-8 h-8 text-yellow-600" />
                <div>
                  <CardTitle className="text-yellow-600">{t('damagedRoad')}</CardTitle>
                  <CardDescription>Report road issues</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* High Accident Zones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-red-600" />
              {t('highAccidentZones')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highAccidentZones.map((zone, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-semibold">{zone.name}</div>
                    <div className="text-sm text-gray-600">{zone.accidents} accidents this month</div>
                  </div>
                  <Badge variant="destructive">{zone.accidents}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Violation Types */}
        <Card>
          <CardHeader>
            <CardTitle>{t('violationTypes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-3">
              {['wrongParking', 'noHelmet', 'signalJump', 'overSpeeding', 'wrongSide', 'damagedRoad', 'otherViolation'].map((type) => (
                <Badge key={type} variant="outline" className="p-3 justify-center text-center">
                  {t(type)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Congratulations Dialog */}
      <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <Trophy className="w-20 h-20 text-yellow-500 animate-bounce" />
            </div>
            <DialogTitle className="text-3xl">{t('congratulations')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xl">{t('newStreakUnlocked')}</p>
            <div className="text-5xl font-bold text-blue-600">{user.streaks}</div>
            <p className="text-gray-600">{user.points} {t('points')}</p>
            <Button onClick={handleShare} className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              {t('shareOnSocial')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
