import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Camera, Mic, MicOff, Upload, Scan } from 'lucide-react';
import { toast } from 'sonner';

export function ReportViolation() {
  const { user, submitComplaint } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [violationType, setViolationType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [scanningPlate, setScanningPlate] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        // Simulate number plate scanning
        simulateNumberPlateScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateNumberPlateScan = () => {
    setScanningPlate(true);
    setTimeout(() => {
      // Generate a random Indian number plate
      const states = ['KA', 'TN', 'MH', 'DL', 'AP', 'TS'];
      const state = states[Math.floor(Math.random() * states.length)];
      const number = Math.floor(Math.random() * 99) + 1;
      const series = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                     String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const code = Math.floor(Math.random() * 9999) + 1000;
      
      setNumberPlate(`${state}-${number.toString().padStart(2, '0')}-${series}-${code}`);
      setScanningPlate(false);
      toast.success('Number plate scanned successfully!');
    }, 2000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // In a real app, we would convert this to text using speech-to-text API
        // For demo, we'll simulate it
        simulateVoiceToText();
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success(t('startRecording'));
    } catch (error) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success(t('stopRecording'));
    }
  };

  const simulateVoiceToText = () => {
    // Simulate voice-to-text conversion
    const sampleDescriptions = [
      'A red car was parked in a no-parking zone near the market',
      'Motorcyclist without helmet spotted at the signal',
      'Vehicle jumped the red light at high speed',
      'Large pothole causing accidents on main road',
    ];
    const randomDesc = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
    setVoiceNote(randomDesc);
    setDescription(description + ' ' + randomDesc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submitComplaint({
      type: 'violation',
      violationType,
      description,
      location,
      numberPlate: numberPlate || undefined,
      voiceNote: voiceNote || undefined,
      photoUrl: photoPreview || undefined,
      points: 5,
    });
    
    toast.success(t('complaintSubmitted'));
    navigate('/citizen-dashboard');
  };

  if (!user || user.role !== 'citizen') {
    navigate('/');
    return null;
  }

  const violationTypes = [
    'wrongParking',
    'noHelmet',
    'signalJump',
    'overSpeeding',
    'wrongSide',
    'damagedRoad',
    'otherViolation',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">{t('reportViolation')}</h1>
          <p className="text-gray-600 mb-8">{t('trafficViolation')}</p>

          <Card>
            <CardHeader>
              <CardTitle>Violation Report</CardTitle>
              <CardDescription>Document the violation with photo and voice description</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="type">Violation Type</Label>
                  <Select value={violationType} onValueChange={setViolationType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select violation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {violationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">{t('location')}</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter violation location"
                    required
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <Label>{t('uploadPhoto')}</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {photoPreview ? (
                      <div>
                        <img src={photoPreview} alt="Violation" className="max-h-64 mx-auto mb-4 rounded" />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPhotoPreview('');
                            setPhotoFile(null);
                            setNumberPlate('');
                          }}
                        >
                          Remove Photo
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload photo</p>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Number Plate Detection */}
                {photoPreview && (
                  <div>
                    <Label>{t('numberPlate')}</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={numberPlate}
                        onChange={(e) => setNumberPlate(e.target.value)}
                        placeholder="Scanned automatically..."
                        className="flex-1"
                      />
                      {scanningPlate && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Scan className="w-5 h-5 animate-pulse" />
                          <span className="text-sm">Scanning...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Voice Recording */}
                <div>
                  <Label>{t('recordVoice')}</Label>
                  <div className="mt-2 flex gap-2">
                    {!isRecording ? (
                      <Button
                        type="button"
                        onClick={startRecording}
                        className="flex-1"
                        variant="outline"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        {t('startRecording')}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={stopRecording}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        <MicOff className="w-4 h-4 mr-2 animate-pulse" />
                        {t('stopRecording')}
                      </Button>
                    )}
                  </div>
                  {voiceNote && (
                    <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>Voice Note:</strong> {voiceNote}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">{t('reportDescription')}</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional details..."
                    rows={4}
                    required
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Reward:</strong> You will earn 5 points for each violation report. 
                    Accumulate 10 points for a streak and unlock rewards!
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
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
