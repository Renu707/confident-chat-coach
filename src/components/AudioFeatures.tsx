
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  RotateCcw,
  Heart,
  Brain,
  Timer,
  Waves,
  Shield,
  Star,
  Headphones,
  Zap
} from 'lucide-react';

interface AudioFeaturesProps {
  onAudioModeChange: (mode: string) => void;
  currentMode: string;
}

const AudioFeatures: React.FC<AudioFeaturesProps> = ({ onAudioModeChange, currentMode }) => {
  const [isListening, setIsListening] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [stutterSupport, setStutterSupport] = useState(false);
  const [fastSpeechControl, setFastSpeechControl] = useState(false);
  const [overthinkingMode, setOverthinkingMode] = useState(false);
  const [currentBPM, setCurrentBPM] = useState(60);
  const [confidenceLevel, setConfidenceLevel] = useState(75);
  const [isBreathingMode, setIsBreathingMode] = useState(false);

  const audioModes = [
    {
      id: 'stutter-support',
      title: 'Stuttering Support 💪',
      description: 'Patient, pressure-free environment with gentle pacing',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      features: ['Stutter-positive responses', 'Gentle pacing cues', 'No time pressure', 'Fluency celebration']
    },
    {
      id: 'speed-control',
      title: 'Fast Speech Manager 🐌',
      description: 'Slow down and articulate clearly with confidence',
      icon: Timer,
      color: 'from-blue-500 to-cyan-500',
      features: ['Real-time speed detection', 'Clarity scoring', 'Articulation help', 'Progressive training']
    },
    {
      id: 'overthinking-relief',
      title: 'Overthinking Relief 🧘',
      description: 'Break analysis paralysis with structured support',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      features: ['Thought organization', 'Decision assistance', 'Pause permission', 'Mindfulness cues']
    },
    {
      id: 'confidence-building',
      title: 'Voice Confidence 🌟',
      description: 'Build vocal strength and communication power',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      features: ['Voice warm-ups', 'Projection training', 'Success tracking', 'Affirmations']
    }
  ];

  const breathingExercise = () => {
    setIsBreathingMode(true);
    // Simulate a 4-7-8 breathing pattern
    setTimeout(() => {
      setIsBreathingMode(false);
    }, 30000); // 30 second breathing exercise
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg">
            <Headphones className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Audio Support Center 🎙️
        </h2>
        <p className="text-slate-300 text-lg">
          Specialized tools for every speaking challenge. You've got this! ✨
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800/60 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Waves className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-sm text-slate-300">Speech Clarity</p>
            <p className="text-xl font-bold text-blue-400">{confidenceLevel}%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/60 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Timer className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm text-slate-300">Comfort Pace</p>
            <p className="text-xl font-bold text-green-400">{currentBPM} BPM</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/60 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-sm text-slate-300">Confidence</p>
            <p className="text-xl font-bold text-pink-400">Rising! 📈</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/60 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm text-slate-300">Safe Space</p>
            <p className="text-xl font-bold text-purple-400">100% ✅</p>
          </CardContent>
        </Card>
      </div>

      {/* Audio Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {audioModes.map((mode) => (
          <Card 
            key={mode.id} 
            className={`group cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              currentMode === mode.id 
                ? 'border-blue-400 bg-blue-950/30' 
                : 'border-slate-600 bg-slate-800/60 hover:border-slate-500'
            }`}
            onClick={() => onAudioModeChange(mode.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-3 bg-gradient-to-r ${mode.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                  <mode.icon className="w-6 h-6 text-white" />
                </div>
                {currentMode === mode.id && (
                  <Badge className="bg-blue-600 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle className="text-white text-lg">{mode.title}</CardTitle>
              <p className="text-slate-300 text-sm">{mode.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mode.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Audio Controls */}
      <Card className="bg-slate-800/60 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Volume2 className="w-5 h-5 mr-2 text-blue-400" />
            Audio Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Speech Rate Control */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-300">
                Speech Rate (Your Comfort Zone) 🎯
              </label>
              <span className="text-sm text-blue-400">{speechRate.toFixed(1)}x</span>
            </div>
            <Slider
              value={[speechRate]}
              onValueChange={(value) => setSpeechRate(value[0])}
              max={2}
              min={0.3}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-slate-400 mt-1">
              Find your perfect speaking pace - there's no rush! 🌱
            </p>
          </div>

          {/* Volume Control */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-300">
                Audio Volume 🔊
              </label>
              <span className="text-sm text-blue-400">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Special Features Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={stutterSupport ? "default" : "outline"}
              onClick={() => setStutterSupport(!stutterSupport)}
              className={`w-full ${stutterSupport ? 'bg-pink-600 hover:bg-pink-700' : 'border-slate-600 text-slate-300'}`}
            >
              <Heart className="w-4 h-4 mr-2" />
              Stutter Support
            </Button>
            
            <Button
              variant={fastSpeechControl ? "default" : "outline"}
              onClick={() => setFastSpeechControl(!fastSpeechControl)}
              className={`w-full ${fastSpeechControl ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-slate-300'}`}
            >
              <Timer className="w-4 h-4 mr-2" />
              Speed Control
            </Button>
            
            <Button
              variant={overthinkingMode ? "default" : "outline"}
              onClick={() => setOverthinkingMode(!overthinkingMode)}
              className={`w-full ${overthinkingMode ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-slate-300'}`}
            >
              <Brain className="w-4 h-4 mr-2" />
              Thought Helper
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Breathing Exercise */}
      <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-600/30">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 rounded-full transition-all duration-1000 ${
              isBreathingMode 
                ? 'bg-green-500/30 scale-110' 
                : 'bg-green-500/20'
            }`}>
              <Waves className={`w-8 h-8 text-green-400 ${isBreathingMode ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Calming Breath Exercise 🫁
          </h3>
          <p className="text-green-200 mb-4">
            Take a moment to center yourself before speaking
          </p>
          <Button
            onClick={breathingExercise}
            disabled={isBreathingMode}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isBreathingMode ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Breathing... (Relax) 😌
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Breathing Exercise
              </>
            )}
          </Button>
          {isBreathingMode && (
            <div className="mt-4 p-4 bg-green-900/20 rounded-lg">
              <p className="text-green-300 text-lg animate-pulse">
                🌬️ Breathe in... Hold... Breathe out... 
              </p>
              <p className="text-green-400 text-sm mt-2">
                You're doing amazing. This is your safe space. 💚
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Encouragement Messages */}
      <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6">
        <div className="text-center">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-yellow-300 mb-2">
            You're Braver Than You Believe! 🌟
          </h3>
          <div className="space-y-2 text-yellow-200">
            <p>"Every word you speak is a victory over fear." 💪</p>
            <p>"Your voice matters, exactly as it is." ❤️</p>
            <p>"Progress, not perfection - you're already winning!" 🏆</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioFeatures;
