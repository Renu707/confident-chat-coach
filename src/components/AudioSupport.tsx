
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioFeatures from './AudioFeatures';
import SpeechTherapyFeatures from './SpeechTherapyFeatures';
import { 
  Headphones, 
  Brain, 
  Heart, 
  Star,
  ArrowLeft,
  Settings
} from 'lucide-react';

interface AudioSupportProps {
  onBack: () => void;
}

const AudioSupport: React.FC<AudioSupportProps> = ({ onBack }) => {
  const [currentAudioMode, setCurrentAudioMode] = useState('confidence-building');
  const [exerciseResults, setExerciseResults] = useState<Array<{exercise: string, score: number}>>([]);

  const handleExerciseComplete = (exercise: string, score: number) => {
    setExerciseResults(prev => [...prev, { exercise, score }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Practice
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Audio Support Center</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-green-900/30 rounded-full border border-green-700">
              <span className="text-xs text-green-400 font-medium">🔒 100% Private & Safe</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="audio-settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-slate-800/60 border border-slate-600">
            <TabsTrigger 
              value="audio-settings" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Audio Settings
            </TabsTrigger>
            <TabsTrigger 
              value="speech-therapy" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Brain className="w-4 h-4 mr-2" />
              Speech Exercises
            </TabsTrigger>
            <TabsTrigger 
              value="confidence-building" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Star className="w-4 h-4 mr-2" />
              Confidence Building
            </TabsTrigger>
            <TabsTrigger 
              value="support" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Heart className="w-4 h-4 mr-2" />
              Emotional Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audio-settings" className="space-y-6">
            <AudioFeatures 
              onAudioModeChange={setCurrentAudioMode}
              currentMode={currentAudioMode}
            />
          </TabsContent>

          <TabsContent value="speech-therapy" className="space-y-6">
            <SpeechTherapyFeatures 
              activeMode={currentAudioMode}
              onExerciseComplete={handleExerciseComplete}
            />
          </TabsContent>

          <TabsContent value="confidence-building" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Affirmations */}
              <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-600/30">
                <CardHeader>
                  <CardTitle className="text-yellow-300 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Daily Confidence Boosters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "🌟 Your voice has power and purpose",
                    "💪 Every word you speak builds confidence", 
                    "✨ You are worthy of being heard",
                    "🚀 Your communication skills grow stronger daily",
                    "❤️ You speak with courage and authenticity"
                  ].map((affirmation, index) => (
                    <div key={index} className="p-3 bg-yellow-900/20 rounded-lg">
                      <p className="text-yellow-200">{affirmation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Success Stories */}
              <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-600/30">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    You're Not Alone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-900/20 rounded-lg">
                    <p className="text-green-200 italic">
                      "I used to fear every phone call. Now I'm confident in meetings and presentations. 
                      The key was practicing in a safe space first." 
                    </p>
                    <p className="text-green-300 text-sm mt-2">- Sarah, Marketing Manager</p>
                  </div>
                  <div className="p-4 bg-green-900/20 rounded-lg">
                    <p className="text-green-200 italic">
                      "My stutter felt like a barrier to everything. Through patient practice, 
                      I learned to embrace my unique speaking style."
                    </p>
                    <p className="text-green-300 text-sm mt-2">- Marcus, Teacher</p>
                  </div>
                  <div className="p-4 bg-green-900/20 rounded-lg">
                    <p className="text-green-200 italic">
                      "Overthinking used to paralyze me in conversations. Now I trust my instincts 
                      and speak authentically."
                    </p>
                    <p className="text-green-300 text-sm mt-2">- Elena, Student</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                You Are Seen, Heard, and Valued 💕
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Every step you take toward better communication is an act of courage. 
                We're here to support you every step of the way.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Emergency Support */}
              <Card className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-red-300">Feeling Overwhelmed?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-200 mb-4">
                    It's okay to have difficult days. You're still making progress.
                  </p>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Take a Gentle Break 🤗
                  </Button>
                </CardContent>
              </Card>

              {/* Community Support */}
              <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-600/30">
                <CardHeader>
                  <CardTitle className="text-blue-300">Community Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-200 mb-4">
                    Connect with others on similar journeys for mutual support.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Join Support Groups 👥
                  </Button>
                </CardContent>
              </Card>

              {/* Professional Help */}
              <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-600/30">
                <CardHeader>
                  <CardTitle className="text-green-300">Professional Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-200 mb-4">
                    Find qualified speech therapists and counselors in your area.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Find Therapists 🏥
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AudioSupport;
