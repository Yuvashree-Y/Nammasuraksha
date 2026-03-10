import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NavBar } from '../components/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FileText, AlertTriangle, Camera, Construction } from 'lucide-react';

export function Examples() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!user || user.role !== 'citizen') {
    navigate('/');
    return null;
  }

  const exampleComplaints = [
    {
      type: 'violation',
      icon: <Camera className="w-8 h-8 text-orange-600" />,
      title: 'No Helmet Violation',
      violationType: t('noHelmet'),
      location: 'MG Road Signal, Bangalore',
      description: 'Two-wheeler rider spotted without helmet during peak hours. Clear violation of traffic safety rules.',
      numberPlate: 'KA-01-AB-1234',
      voiceNote: 'The motorcyclist was riding without a helmet and was talking on the phone.',
      points: 5,
    },
    {
      type: 'violation',
      icon: <Camera className="w-8 h-8 text-red-600" />,
      title: 'Signal Jump',
      violationType: t('signalJump'),
      location: 'Silk Board Junction, Bangalore',
      description: 'Car jumped red light at high speed endangering pedestrians crossing the road.',
      numberPlate: 'KA-05-MN-5678',
      voiceNote: 'A white sedan jumped the red signal without stopping.',
      points: 5,
    },
    {
      type: 'violation',
      icon: <Camera className="w-8 h-8 text-yellow-600" />,
      title: 'Wrong Parking',
      violationType: t('wrongParking'),
      location: 'Commercial Street, Bangalore',
      description: 'Vehicle parked in no-parking zone blocking pedestrian walkway and causing traffic congestion.',
      numberPlate: 'KA-03-XY-9012',
      voiceNote: 'A black SUV is parked in the no-parking zone near the market entrance.',
      points: 5,
    },
    {
      type: 'accident',
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
      title: 'Accident at Junction',
      violationType: null,
      location: 'Marathahalli Bridge, Bangalore',
      description: 'Two-vehicle collision at the junction due to poor visibility. Requested ambulance and police assistance.',
      numberPlate: null,
      voiceNote: 'Two cars collided at the junction. One person seems injured. Ambulance is on the way.',
      points: 5,
    },
    {
      type: 'damaged_road',
      icon: <Construction className="w-8 h-8 text-yellow-600" />,
      title: 'Large Pothole',
      violationType: t('damagedRoad'),
      location: 'Outer Ring Road, Bangalore',
      description: 'Deep pothole on main road causing accidents. Multiple vehicles have been damaged. Urgent repair needed.',
      numberPlate: null,
      voiceNote: 'There is a very large pothole on the main road that is causing accidents.',
      points: 5,
    },
    {
      type: 'violation',
      icon: <Camera className="w-8 h-8 text-blue-600" />,
      title: 'Over Speeding',
      violationType: t('overSpeeding'),
      location: 'Airport Road, Bangalore',
      description: 'Vehicle exceeding speed limit in residential area where children play.',
      numberPlate: 'KA-02-CD-3456',
      voiceNote: 'A sports car was driving very fast in a residential zone.',
      points: 5,
    },
    {
      type: 'violation',
      icon: <Camera className="w-8 h-8 text-purple-600" />,
      title: 'Wrong Side Driving',
      violationType: t('wrongSide'),
      location: 'Indiranagar Main Road, Bangalore',
      description: 'Motorcycle driving on wrong side of the road creating risk for oncoming traffic.',
      numberPlate: 'KA-04-EF-7890',
      voiceNote: 'A bike is coming from the wrong direction on a one-way street.',
      points: 5,
    },
    {
      type: 'violation',
      icon: <Camera className="w-8 h-8 text-pink-600" />,
      title: 'Other Violation - Drunk Driving',
      violationType: t('otherViolation'),
      location: 'Koramangala 5th Block, Bangalore',
      description: 'Suspected drunk driving with rash behavior on public road endangering others.',
      numberPlate: 'KA-51-GH-2345',
      voiceNote: 'The driver appears to be drunk and is driving in a zig-zag manner.',
      points: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold text-blue-600">{t('exampleComplaints')}</h1>
              <p className="text-gray-600">Learn how to report violations effectively</p>
            </div>
          </div>

          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">How to Generate Points & Rewards:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Each approved complaint earns you <strong>5 points</strong></li>
              <li>• Accumulate <strong>10 points (2 complaints)</strong> to unlock your first streak and discount coupons</li>
              <li>• Reach <strong>50 points (10 complaints)</strong> to earn <strong>₹200 cash reward</strong> via UPI</li>
              <li>• Every <strong>2 streaks</strong> unlocks a scratch card with surprise rewards</li>
              <li>• Share your achievements on social media with your streak badge</li>
            </ul>
          </div>

          <div className="space-y-6">
            {exampleComplaints.map((example, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{example.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{example.title}</CardTitle>
                      {example.violationType && (
                        <Badge className="mb-2">{example.violationType}</Badge>
                      )}
                      <CardDescription className="text-base">
                        📍 {example.location}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50">
                      +{example.points} points
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">Description:</div>
                      <p className="text-sm text-gray-700">{example.description}</p>
                    </div>

                    {example.numberPlate && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">{t('numberPlate')}:</div>
                        <Badge variant="destructive">{example.numberPlate}</Badge>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">Voice Description:</div>
                      <p className="text-sm text-gray-600 italic">
                        🎤 "{example.voiceNote}"
                      </p>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="text-xs text-gray-500">
                        💡 <strong>Tip:</strong> Include clear photos, accurate location, and detailed voice description for faster approval
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Your Impact Matters!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Every report you submit helps make our roads safer for everyone. Your contributions are 
                recognized with streaks, points, and rewards. Together, we're building a community of 
                responsible citizens committed to traffic safety and civic responsibility.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
