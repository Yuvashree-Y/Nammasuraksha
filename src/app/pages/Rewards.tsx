import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Gift, IndianRupee, Ticket, CreditCard, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export function Rewards() {
  const { user, updateProfile, claimReward } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [showUpiDialog, setShowUpiDialog] = useState(false);
  const [upiId, setUpiId] = useState(user?.upiId || '');
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [scratched, setScratched] = useState(false);
  const [scratchReward, setScratchReward] = useState(0);

  if (!user || user.role !== 'citizen') {
    navigate('/');
    return null;
  }

  const handleConnectUpi = () => {
    updateProfile({ upiId });
    setShowUpiDialog(false);
    toast.success('UPI ID connected successfully!');
  };

  const handleClaimCash = (points: number, amount: number) => {
    if (!user.upiId) {
      toast.error('Please connect your UPI ID first!');
      setShowUpiDialog(true);
      return;
    }
    
    if (claimReward(points, amount)) {
      toast.success(`₹${amount} transferred to ${user.upiId}!`);
    } else {
      toast.error('Insufficient points!');
    }
  };

  const handleScratchCard = () => {
    if (user.streaks < 2) {
      toast.error('You need at least 2 streaks (20 points) to unlock a scratch card!');
      return;
    }
    
    setShowScratchCard(true);
    setScratched(false);
  };

  const handleScratch = () => {
    const rewards = [10, 20, 50, 100];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    setScratchReward(reward);
    setScratched(true);
  };

  const cashRewards = [
    { points: 50, amount: 200, description: '10 Streak Milestone' },
    { points: 100, amount: 500, description: '20 Streak Milestone' },
    { points: 200, amount: 1200, description: '40 Streak Milestone' },
  ];

  const discountCoupons = [
    { name: 'Amazon', discount: '10%', points: 10, streaks: 1 },
    { name: 'Flipkart', discount: '15%', points: 15, streaks: 2 },
    { name: 'Swiggy', discount: '₹100 OFF', points: 10, streaks: 1 },
    { name: 'Uber', discount: '20%', points: 15, streaks: 2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">{t('myRewards')}</h1>
          <p className="text-gray-600 mb-8">Redeem your points for exciting rewards</p>

          {/* Points Summary */}
          <Card className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Available Points</div>
                  <div className="text-5xl font-bold">{user.points}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Current Streaks</div>
                  <div className="text-5xl font-bold">{user.streaks}</div>
                </div>
                <Trophy className="w-24 h-24 opacity-50" />
              </div>
            </CardContent>
          </Card>

          {/* UPI Connection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                {t('connectUpi')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.upiId ? (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-green-800">Connected UPI ID</div>
                    <div className="text-green-600">{user.upiId}</div>
                  </div>
                  <Button variant="outline" onClick={() => setShowUpiDialog(true)}>
                    Change
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowUpiDialog(true)} className="w-full">
                  Connect UPI ID for Cash Rewards
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Scratch Cards */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-6 h-6" />
                {t('scratchCard')}
              </CardTitle>
              <CardDescription>Unlock scratch cards at 2+ streaks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <div>
                  <div className="text-lg font-semibold">Mystery Scratch Card</div>
                  <div className="text-sm text-gray-600">Win discount coupons worth ₹10-₹100</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Required: 2 streaks | Available: {user.streaks >= 2 ? '✓' : '✗'}
                  </div>
                </div>
                <Button
                  onClick={handleScratchCard}
                  disabled={user.streaks < 2}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Open Scratch Card
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cash Rewards */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-6 h-6" />
                {t('cashReward')}
              </CardTitle>
              <CardDescription>Transfer cash directly to your UPI account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {cashRewards.map((reward, index) => (
                  <Card key={index} className={user.points >= reward.points ? 'border-green-500' : 'border-gray-200'}>
                    <CardHeader>
                      <CardTitle className="text-2xl text-green-600">₹{reward.amount}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-sm text-gray-600">{t('pointsRequired')}</div>
                        <div className="text-xl font-bold">{reward.points} points</div>
                      </div>
                      <Button
                        onClick={() => handleClaimCash(reward.points, reward.amount)}
                        disabled={user.points < reward.points}
                        className="w-full"
                      >
                        {t('claimReward')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discount Coupons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-6 h-6" />
                {t('discountCoupon')}
              </CardTitle>
              <CardDescription>Redeem points for popular brands</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {discountCoupons.map((coupon, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div>
                      <div className="font-semibold text-lg">{coupon.name}</div>
                      <div className="text-2xl font-bold text-blue-600">{coupon.discount}</div>
                      <div className="text-sm text-gray-600">
                        {coupon.points} points • {coupon.streaks} streaks
                      </div>
                    </div>
                    <Button
                      disabled={user.points < coupon.points || user.streaks < coupon.streaks}
                      variant="outline"
                    >
                      Redeem
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* UPI Dialog */}
      <Dialog open={showUpiDialog} onOpenChange={setShowUpiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('connectUpi')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="upi">{t('upiId')}</Label>
              <Input
                id="upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
              />
            </div>
            <Button onClick={handleConnectUpi} className="w-full">
              Connect UPI
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scratch Card Dialog */}
      <Dialog open={showScratchCard} onOpenChange={setShowScratchCard}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('scratchCard')}</DialogTitle>
          </DialogHeader>
          <div className="py-8">
            {!scratched ? (
              <div
                onClick={handleScratch}
                className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="text-white text-center">
                  <Gift className="w-16 h-16 mx-auto mb-4" />
                  <div className="text-2xl font-bold">Tap to Scratch!</div>
                </div>
              </div>
            ) : (
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                  <div className="text-4xl font-bold">₹{scratchReward}</div>
                  <div className="text-lg">Discount Coupon!</div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
