
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Heart, Smile, Meh, Frown, Zap, Coffee } from 'lucide-react';

interface EmotionState {
  anxiety: number;
  confidence: number;
  energy: number;
  mood: number;
  motivation: number;
}

interface EmotionCheckInProps {
  type: 'pre' | 'post';
  onComplete: (emotions: EmotionState, notes?: string) => void;
  onSkip: () => void;
}

const EmotionCheckIn: React.FC<EmotionCheckInProps> = ({ type, onComplete, onSkip }) => {
  const [emotions, setEmotions] = useState<EmotionState>({
    anxiety: 5,
    confidence: 5,
    energy: 5,
    mood: 5,
    motivation: 5
  });
  const [notes, setNotes] = useState('');

  const handleEmotionChange = (emotion: keyof EmotionState, value: number) => {
    setEmotions(prev => ({ ...prev, [emotion]: value }));
  };

  const getEmotionIcon = (emotion: keyof EmotionState, value: number) => {
    switch (emotion) {
      case 'anxiety':
        return value <= 3 ? '😌' : value <= 6 ? '😰' : '😱';
      case 'confidence':
        return value <= 3 ? '😔' : value <= 6 ? '🙂' : '😎';
      case 'energy':
        return value <= 3 ? '😴' : value <= 6 ? '🙂' : '⚡';
      case 'mood':
        return value <= 3 ? '😢' : value <= 6 ? '😐' : '😊';
      case 'motivation':
        return value <= 3 ? '😑' : value <= 6 ? '🙂' : '🔥';
      default:
        return '🙂';
    }
  };

  const getEmotionLabel = (emotion: keyof EmotionState, value: number) => {
    const labels = {
      anxiety: value <= 3 ? 'Calm' : value <= 6 ? 'Moderate' : 'High',
      confidence: value <= 3 ? 'Low' : value <= 6 ? 'Good' : 'High',
      energy: value <= 3 ? 'Tired' : value <= 6 ? 'Okay' : 'Energized',
      mood: value <= 3 ? 'Down' : value <= 6 ? 'Neutral' : 'Great',
      motivation: value <= 3 ? 'Low' : value <= 6 ? 'Okay' : 'High'
    };
    return labels[emotion];
  };

  const emotionConfig = [
    { key: 'anxiety' as keyof EmotionState, label: 'Anxiety Level', icon: Heart, color: 'text-red-400' },
    { key: 'confidence' as keyof EmotionState, label: 'Confidence', icon: Zap, color: 'text-blue-400' },
    { key: 'energy' as keyof EmotionState, label: 'Energy Level', icon: Coffee, color: 'text-green-400' },
    { key: 'mood' as keyof EmotionState, label: 'Overall Mood', icon: Smile, color: 'text-yellow-400' },
    { key: 'motivation' as keyof EmotionState, label: 'Motivation', icon: Zap, color: 'text-purple-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-600 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white mb-2">
              {type === 'pre' ? 'How are you feeling right now?' : 'How do you feel after that session?'}
            </CardTitle>
            <p className="text-slate-300">
              {type === 'pre' 
                ? 'Take a moment to check in with yourself before we begin'
                : 'Reflecting on your emotions helps track your progress over time'
              }
            </p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {emotionConfig.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="text-white font-medium">{label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getEmotionIcon(key, emotions[key])}</span>
                    <span className="text-slate-300 text-sm min-w-[60px]">
                      {getEmotionLabel(key, emotions[key])}
                    </span>
                  </div>
                </div>
                
                <div className="px-3">
                  <Slider
                    value={[emotions[key]]}
                    onValueChange={(value) => handleEmotionChange(key, value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{key === 'anxiety' ? 'Calm' : 'Low'}</span>
                    <span>{key === 'anxiety' ? 'Very Anxious' : 'High'}</span>
                  </div>
                </div>
              </div>
            ))}

            {type === 'post' && (
              <div className="space-y-3">
                <label className="text-white font-medium">Any thoughts about this session? (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it go? What felt challenging or went well?"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 resize-none"
                  rows={3}
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={onSkip} className="text-slate-400 hover:text-slate-200">
                Skip Check-in
              </Button>
              
              <Button 
                onClick={() => onComplete(emotions, notes || undefined)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
              >
                {type === 'pre' ? 'Ready to Practice!' : 'Complete Session'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionCheckIn;
