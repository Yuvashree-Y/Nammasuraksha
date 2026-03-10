import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Ambulance, Phone, Hospital, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ReportAccident() {
  const { user, submitComplaint } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [emergencyCalled, setEmergencyCalled] = useState(false);

  const handleEmergencyCall = (service: string) => {
    toast.success(`${t('emergencyContacted')} - ${service}`);
    setEmergencyCalled(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submitComplaint({
      type: 'accident',
      description,
      location,
      points: 5,
    });
    
    toast.success(t('complaintSubmitted'));
    navigate('/citizen-dashboard');
  };

  if (!user || user.role !== 'citizen') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-red-600 mb-2">{t('reportAccident')}</h1>
          <p className="text-gray-600 mb-8">{t('sosEmergency')}</p>

          {/* Emergency Actions */}
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Emergency Services
              </CardTitle>
              <CardDescription>Contact emergency services immediately</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleEmergencyCall('Ambulance (108)')}
                  className="h-24 bg-red-600 hover:bg-red-700 flex-col gap-2"
                >
                  <Ambulance className="w-8 h-8" />
                  <div>{t('callAmbulance')}</div>
                  <div className="text-xs">108</div>
                </Button>

                <Button
                  onClick={() => handleEmergencyCall('Police (100)')}
                  className="h-24 bg-blue-600 hover:bg-blue-700 flex-col gap-2"
                >
                  <Phone className="w-8 h-8" />
                  <div>{t('callPolice')}</div>
                  <div className="text-xs">100</div>
                </Button>

                <Button
                  onClick={() => handleEmergencyCall('Nearby Hospital')}
                  className="h-24 bg-green-600 hover:bg-green-700 flex-col gap-2"
                >
                  <Hospital className="w-8 h-8" />
                  <div>{t('nearbyHospital')}</div>
                  <div className="text-xs">Find Location</div>
                </Button>
              </div>
              
              {emergencyCalled && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
                  ✓ {t('emergencyContacted')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle>Accident Report Details</CardTitle>
              <CardDescription>Provide information about the accident location</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="location">{t('location')}</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter accident location"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t('reportDescription')}</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the accident situation..."
                    rows={6}
                    required
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This report will help authorities identify accident-prone areas 
                    and take preventive measures. You will earn 5 points once approved.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                    {t('submitComplaint')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/citizen-dashboard')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
