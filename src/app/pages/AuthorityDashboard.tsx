import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, XCircle, Clock, Image, Mic } from 'lucide-react';
import { toast } from 'sonner';

export function AuthorityDashboard() {
  const { user, complaints, approveComplaint, rejectComplaint } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'authority') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  const pendingComplaints = complaints.filter(c => c.status === 'pending');
  const approvedComplaints = complaints.filter(c => c.status === 'approved');
  const rejectedComplaints = complaints.filter(c => c.status === 'rejected');

  const handleApprove = (id: string) => {
    approveComplaint(id);
    toast.success('Complaint approved! Points awarded to citizen.');
  };

  const handleReject = (id: string) => {
    rejectComplaint(id);
    toast.error('Complaint rejected.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-600 mb-8">Authority Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-600">{pendingComplaints.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{approvedComplaints.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{rejectedComplaints.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">{complaints.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Complaints */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              {t('pendingComplaints')}
            </CardTitle>
            <CardDescription>Review and approve citizen reports</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingComplaints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending complaints to review
              </div>
            ) : (
              <div className="space-y-4">
                {pendingComplaints.map((complaint) => (
                  <Card key={complaint.id} className="border-2 border-yellow-200">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {complaint.type === 'accident' && '🚨 Accident Report'}
                                {complaint.type === 'violation' && '📸 Traffic Violation'}
                                {complaint.type === 'damaged_road' && '🚧 Damaged Road'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Reported by: {complaint.userName} • {new Date(complaint.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-yellow-50">
                              {complaint.points} points
                            </Badge>
                          </div>

                          {complaint.violationType && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Type: </span>
                              <Badge>{t(complaint.violationType)}</Badge>
                            </div>
                          )}

                          <div className="mb-2">
                            <span className="text-sm font-medium">Location: </span>
                            <span className="text-sm">{complaint.location}</span>
                          </div>

                          <div className="mb-3">
                            <span className="text-sm font-medium">Description: </span>
                            <p className="text-sm text-gray-700">{complaint.description}</p>
                          </div>

                          {complaint.numberPlate && (
                            <div className="mb-2 flex items-center gap-2">
                              <span className="text-sm font-medium">{t('numberPlate')}: </span>
                              <Badge variant="destructive">{complaint.numberPlate}</Badge>
                            </div>
                          )}

                          {complaint.voiceNote && (
                            <div className="mb-2 flex items-center gap-2 text-sm">
                              <Mic className="w-4 h-4" />
                              <span className="text-gray-600 italic">{complaint.voiceNote}</span>
                            </div>
                          )}

                          {complaint.photoUrl && (
                            <div className="mb-3">
                              <div className="text-sm font-medium mb-1 flex items-center gap-2">
                                <Image className="w-4 h-4" />
                                Evidence Photo:
                              </div>
                              <img
                                src={complaint.photoUrl}
                                alt="Violation evidence"
                                className="max-w-md rounded-lg border"
                              />
                            </div>
                          )}

                          <div className="flex gap-3 mt-4">
                            <Button
                              onClick={() => handleApprove(complaint.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t('approveComplaint')}
                            </Button>
                            <Button
                              onClick={() => handleReject(complaint.id)}
                              variant="destructive"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              {t('rejectComplaint')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Approved */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Recently Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            {approvedComplaints.slice(0, 5).map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <div className="font-medium">{complaint.userName}</div>
                  <div className="text-sm text-gray-600">{complaint.location}</div>
                </div>
                <Badge className="bg-green-600">Approved</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
