import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  Timer, 
  Mic, 
  Volume2, 
  Pause, 
  Play,
  RotateCcw,
  CheckCircle,
  Star,
  Sparkles,
  Target,
  TrendingUp,
  MicOff,
  Activity,
  BarChart3
} from 'lucide-react';

interface SpeechTherapyFeaturesProps {
  activeMode: string;
  onExerciseComplete: (exercise: string, score: number) => void;
}

interface ExerciseSession {
  id: string;
  isActive: boolean;
  startTime: number;
  targetWords: string[];
  currentWordIndex: number;
  speechRate: number;
  clarity: number;
  fluency: number;
  realTimeStats: {
    volume: number;
    pace: number;
    pauses: number;
    stutterEvents: number;
  };
}

interface AudioAnalysisData {
  volume: number;
  frequency: number;
  clarity: number;
  speechRate: number;
  pauseDuration: number;
}

const SpeechTherapyFeatures: React.FC<SpeechTherapyFeaturesProps> = ({ 
  activeMode, 
  onExerciseComplete 
}) => {
  const [currentSession, setCurrentSession] = useState<ExerciseSession | null>(null);
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [exercisesCompleted, setExercisesCompleted] = useState(12);
  const [isListening, setIsListening] = useState(false);
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysisData>({
    volume: 0,
    frequency: 0,
    clarity: 0,
    speechRate: 0,
    pauseDuration: 0
  });
  const [realTimeFeedback, setRealTimeFeedback] = useState<string>('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const animationFrameRef = useRef<number>();

  const exerciseTargets = {
    'gentle-onset': {
      words: ['apple', 'orange', 'elephant', 'umbrella', 'airplane'],
      instructions: 'Start each word gently with smooth airflow',
      targetRate: 120, // words per minute
      focusArea: 'onset'
    },
    'syllable-tapping': {
      words: ['butterfly', 'elephant', 'watermelon', 'incredible', 'community'],
      instructions: 'Tap for each syllable as you speak',
      targetRate: 100,
      focusArea: 'rhythm'
    },
    'breathing-speech': {
      words: ['breathe deeply', 'speak smoothly', 'calm voice', 'steady flow', 'relaxed speaking'],
      instructions: 'Coordinate breathing with speech',
      targetRate: 110,
      focusArea: 'breathing'
    },
    'slow-motion': {
      words: ['slow and clear', 'take your time', 'deliberate speech', 'careful words', 'mindful speaking'],
      instructions: 'Speak each word slowly and clearly',
      targetRate: 80,
      focusArea: 'pace'
    },
    'articulation-drills': {
      words: ['red leather yellow leather', 'unique New York', 'toy boat', 'she sells seashells', 'peter piper picked'],
      instructions: 'Focus on precise consonant sounds',
      targetRate: 90,
      focusArea: 'clarity'
    },
    'pacing-practice': {
      words: ['find your rhythm', 'natural pace', 'comfortable speed', 'steady timing', 'balanced flow'],
      instructions: 'Find your optimal speaking pace',
      targetRate: 140,
      focusArea: 'pacing'
    }
  };

  // Initialize audio analysis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current!.continuous = true;
      recognitionRef.current!.interimResults = true;
      recognitionRef.current!.lang = 'en-US';

      recognitionRef.current!.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        if (currentSession && event.results[0].isFinal) {
          analyzeSpokenText(transcript);
        }
      };
    }

    return () => {
      stopAudioAnalysis();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
      
      setIsListening(true);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      analyzeAudio();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setRealTimeFeedback('Microphone access denied. Please allow microphone access to practice.');
    }
  };

  const stopAudioAnalysis = () => {
    setIsListening(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate volume (amplitude)
    const volume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    
    // Calculate dominant frequency
    const maxIndex = dataArray.indexOf(Math.max(...dataArray));
    const frequency = (maxIndex * audioContextRef.current!.sampleRate) / (2 * bufferLength);
    
    // Estimate speech clarity based on frequency distribution
    const clarity = calculateClarity(dataArray);
    
    setAudioAnalysis(prev => ({
      ...prev,
      volume: Math.min(100, (volume / 128) * 100),
      frequency,
      clarity
    }));

    // Provide real-time feedback
    provideFeedback(volume, clarity);

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  const calculateClarity = (frequencyData: Uint8Array): number => {
    // Speech typically occurs in 85-255 Hz (fundamental) and 1000-4000 Hz (formants)
    const speechRange = frequencyData.slice(10, 80); // Approximate speech frequency range
    const totalEnergy = frequencyData.reduce((sum, val) => sum + val, 0);
    const speechEnergy = speechRange.reduce((sum, val) => sum + val, 0);
    
    return totalEnergy > 0 ? Math.min(100, (speechEnergy / totalEnergy) * 200) : 0;
  };

  const provideFeedback = (volume: number, clarity: number) => {
    if (!currentSession) return;

    const exercise = exerciseTargets[currentSession.id as keyof typeof exerciseTargets];
    let feedback = '';

    if (volume < 20) {
      feedback = '🔇 Speak a bit louder';
    } else if (volume > 80) {
      feedback = '🔊 Too loud - try speaking softer';
    } else if (clarity < 40) {
      feedback = '🎯 Focus on clear pronunciation';
    } else if (clarity > 70 && volume > 30 && volume < 70) {
      if (exercise.focusArea === 'pace') {
        feedback = '✨ Perfect pace! Keep this rhythm';
      } else if (exercise.focusArea === 'clarity') {
        feedback = '🌟 Excellent clarity!';
      } else if (exercise.focusArea === 'breathing') {
        feedback = '💨 Great breath control!';
      } else {
        feedback = '🎉 Excellent technique!';
      }
    }

    setRealTimeFeedback(feedback);
  };

  const analyzeSpokenText = (transcript: string) => {
    if (!currentSession) return;

    const exercise = exerciseTargets[currentSession.id as keyof typeof exerciseTargets];
    const targetWord = exercise.words[currentSession.currentWordIndex];
    
    // Check if the spoken text matches the target
    const similarity = calculateSimilarity(transcript.toLowerCase(), targetWord.toLowerCase());
    
    if (similarity > 0.7) {
      // Word completed successfully
      setCurrentSession(prev => {
        if (!prev) return null;
        const newIndex = prev.currentWordIndex + 1;
        const progress = (newIndex / exercise.words.length) * 100;
        setExerciseProgress(progress);
        
        if (newIndex >= exercise.words.length) {
          // Exercise completed
          completeExercise();
          return null;
        }
        
        return {
          ...prev,
          currentWordIndex: newIndex
        };
      });
      
      setRealTimeFeedback('✅ Great! Moving to next word...');
    }
  };

  const calculateSimilarity = (spoken: string, target: string): number => {
    // Simple similarity calculation - can be enhanced with more sophisticated algorithms
    const words1 = spoken.split(' ');
    const words2 = target.split(' ');
    let matches = 0;
    
    words2.forEach(word => {
      if (words1.some(spokenWord => spokenWord.includes(word) || word.includes(spokenWord))) {
        matches++;
      }
    });
    
    return matches / words2.length;
  };

  const startExercise = async (exerciseId: string) => {
    const exercise = exerciseTargets[exerciseId as keyof typeof exerciseTargets];
    if (!exercise) return;

    setCurrentSession({
      id: exerciseId,
      isActive: true,
      startTime: Date.now(),
      targetWords: exercise.words,
      currentWordIndex: 0,
      speechRate: 0,
      clarity: 0,
      fluency: 0,
      realTimeStats: {
        volume: 0,
        pace: 0,
        pauses: 0,
        stutterEvents: 0
      }
    });

    setExerciseProgress(0);
    await startAudioAnalysis();
  };

  const completeExercise = () => {
    if (!currentSession) return;
    
    stopAudioAnalysis();
    
    // Calculate final score based on multiple factors
    const finalScore = Math.floor(
      (audioAnalysis.clarity * 0.4) +
      (audioAnalysis.volume > 30 && audioAnalysis.volume < 70 ? 30 : 20) +
      (Math.random() * 20) + 30 // Base score with some variation
    );
    
    onExerciseComplete(currentSession.id, finalScore);
    setExercisesCompleted(prev => prev + 1);
    setCurrentSession(null);
    setRealTimeFeedback('🎉 Exercise completed! Great work!');
  };

  const stopExercise = () => {
    stopAudioAnalysis();
    setCurrentSession(null);
    setExerciseProgress(0);
    setRealTimeFeedback('');
  };

  const stutterExercises = [
    {
      id: 'gentle-onset',
      title: 'Gentle Voice Starts 🌱',
      description: 'Practice starting words smoothly and gently',
      duration: '3 min',
      difficulty: 'Beginner',
      instructions: [
        'Take a deep breath',
        'Start with "ahh" sound softly',
        'Gradually add the first letter',
        'No pressure - just flow naturally'
      ]
    },
    {
      id: 'syllable-tapping',
      title: 'Rhythm & Flow 🥁',
      description: 'Use rhythm to support natural speech flow',
      duration: '5 min',
      difficulty: 'Intermediate',
      instructions: [
        'Tap gently while speaking',
        'One tap per syllable',
        'Let the rhythm guide you',
        'Feel the natural beat of words'
      ]
    },
    {
      id: 'breathing-speech',
      title: 'Breath-Powered Speech 🫁',
      description: 'Connect breathing with confident speaking',
      duration: '4 min',
      difficulty: 'Beginner',
      instructions: [
        'Breathe in deeply and slowly',
        'Speak on the exhale',
        'Let your breath carry the words',
        'Trust your natural rhythm'
      ]
    }
  ];

  const speedControlExercises = [
    {
      id: 'slow-motion',
      title: 'Slow Motion Speech 🐌',
      description: 'Practice deliberately slower speech patterns',
      duration: '4 min',
      difficulty: 'Beginner',
      instructions: [
        'Speak each word slowly',
        'Pause between phrases',
        'Focus on clarity over speed',
        'Enjoy the peaceful pace'
      ]
    },
    {
      id: 'articulation-drills',
      title: 'Crystal Clear Words 💎',
      description: 'Enhance pronunciation and clarity',
      duration: '6 min',
      difficulty: 'Intermediate',
      instructions: [
        'Over-articulate each sound',
        'Move your mouth deliberately',
        'Practice difficult consonants',
        'Celebrate clear speech'
      ]
    },
    {
      id: 'pacing-practice',
      title: 'Perfect Pacing 🎯',
      description: 'Find your ideal speaking rhythm',
      duration: '5 min',
      difficulty: 'Advanced',
      instructions: [
        'Start slower than feels natural',
        'Gradually find your sweet spot',
        'Notice when you feel rushed',
        'Return to comfortable pace'
      ]
    }
  ];

  const overthinkingExercises = [
    {
      id: 'first-thought',
      title: 'Trust Your Instincts 💡',
      description: 'Practice responding with your first thought',
      duration: '3 min',
      difficulty: 'Beginner',
      instructions: [
        'Notice your first reaction',
        'Say it without editing',
        'Trust your initial wisdom',
        'Let authenticity shine'
      ]
    },
    {
      id: 'time-limits',
      title: 'Quick Response Training ⚡',
      description: 'Build comfort with spontaneous responses',
      duration: '4 min',
      difficulty: 'Intermediate',
      instructions: [
        'Give yourself 10 seconds to respond',
        'Accept "good enough" answers',
        'Practice decision making',
        'Embrace imperfection'
      ]
    },
    {
      id: 'stream-consciousness',
      title: 'Thought Stream Flow 🌊',
      description: 'Let thoughts flow without judgment',
      duration: '5 min',
      difficulty: 'Advanced',
      instructions: [
        'Speak whatever comes to mind',
        'Don\'t filter or edit',
        'Let ideas connect naturally',
        'Trust your mental flow'
      ]
    }
  ];

  const getExercisesForMode = () => {
    switch (activeMode) {
      case 'stutter-support':
        return stutterExercises;
      case 'speed-control':
        return speedControlExercises;
      case 'overthinking-relief':
        return overthinkingExercises;
      default:
        return [...stutterExercises.slice(0, 1), ...speedControlExercises.slice(0, 1), ...overthinkingExercises.slice(0, 1)];
    }
  };

  const exercises = getExercisesForMode();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-600/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="font-bold text-blue-300">Daily Streak</h3>
            <p className="text-2xl font-bold text-white">{dailyStreak} days 🔥</p>
            <p className="text-blue-200 text-sm">You're unstoppable!</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-600/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-bold text-green-300">Exercises Done</h3>
            <p className="text-2xl font-bold text-white">{exercisesCompleted} 💪</p>
            <p className="text-green-200 text-sm">Building strength!</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-600/30">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-bold text-yellow-300">Confidence Level</h3>
            <p className="text-2xl font-bold text-white">Rising! 📈</p>
            <p className="text-yellow-200 text-sm">Keep going!</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Exercise Session */}
      {currentSession && (
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Live Exercise Session
              </div>
              <Button
                onClick={stopExercise}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-900/30"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Current Target Word */}
              <div className="text-center p-6 bg-purple-900/40 rounded-lg border border-purple-600/30">
                <h3 className="text-purple-300 text-sm mb-2">Say this word/phrase:</h3>
                <p className="text-3xl font-bold text-white mb-4">
                  {exerciseTargets[currentSession.id as keyof typeof exerciseTargets]?.words[currentSession.currentWordIndex]}
                </p>
                <p className="text-purple-200 text-sm">
                  {exerciseTargets[currentSession.id as keyof typeof exerciseTargets]?.instructions}
                </p>
              </div>

              {/* Real-time Audio Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800/60 border-slate-600">
                  <CardContent className="p-4 text-center">
                    <Volume2 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-slate-300 text-sm">Volume</p>
                    <Progress value={audioAnalysis.volume} className="mt-2" />
                    <p className="text-blue-400 text-xs mt-1">{Math.round(audioAnalysis.volume)}%</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-slate-600">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-slate-300 text-sm">Clarity</p>
                    <Progress value={audioAnalysis.clarity} className="mt-2" />
                    <p className="text-green-400 text-xs mt-1">{Math.round(audioAnalysis.clarity)}%</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-slate-600">
                  <CardContent className="p-4 text-center">
                    <Timer className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-slate-300 text-sm">Progress</p>
                    <Progress value={exerciseProgress} className="mt-2" />
                    <p className="text-yellow-400 text-xs mt-1">{currentSession.currentWordIndex + 1}/{exerciseTargets[currentSession.id as keyof typeof exerciseTargets]?.words.length}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Feedback */}
              {realTimeFeedback && (
                <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-600/30">
                  <p className="text-blue-200 text-lg animate-pulse">
                    {realTimeFeedback}
                  </p>
                </div>
              )}

              {/* Microphone Status */}
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  {isListening ? (
                    <Mic className="w-4 h-4 text-green-400 animate-pulse" />
                  ) : (
                    <MicOff className="w-4 h-4 text-red-400" />
                  )}
                  <span className={isListening ? 'text-green-400' : 'text-red-400'}>
                    {isListening ? 'Listening...' : 'Not listening'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            Real-Time Speech Training 🎯
          </h3>
          <Badge className="bg-blue-600 text-white">
            <Target className="w-3 h-3 mr-1" />
            {activeMode.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="group hover:scale-105 transition-all duration-300 bg-slate-800/60 border-slate-600 hover:border-blue-400 hover:bg-blue-950/30"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg mb-1">
                      {exercise.title}
                    </CardTitle>
                    <p className="text-slate-300 text-sm">
                      {exercise.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                    <Timer className="w-3 h-3 mr-1" />
                    {exercise.duration}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs border-slate-600 ${
                      exercise.difficulty === 'Beginner' ? 'text-green-400' :
                      exercise.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'
                    }`}
                  >
                    {exercise.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-slate-600 text-purple-400">
                    <Activity className="w-3 h-3 mr-1" />
                    Real-time
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    {exercise.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-center text-sm text-slate-400">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></div>
                        {instruction}
                      </div>
                    ))}
                  </div>
                  
                  {/* Exercise Preview */}
                  {exerciseTargets[exercise.id as keyof typeof exerciseTargets] && (
                    <div className="p-3 bg-slate-900/40 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Practice words:</p>
                      <p className="text-sm text-slate-300">
                        {exerciseTargets[exercise.id as keyof typeof exerciseTargets].words.slice(0, 2).join(', ')}...
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => startExercise(exercise.id)}
                    disabled={currentSession !== null}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium group-hover:scale-105 transition-transform"
                  >
                    {currentSession?.id === exercise.id ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-pulse" />
                        Training Active...
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Training
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Motivational Section */}
      <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-600/30">
        <CardContent className="p-6 text-center">
          <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Real-Time Training Builds Real Confidence! 🌟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-pink-900/20 rounded-lg">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <p className="text-pink-300 font-medium">Immediate Feedback</p>
              <p className="text-pink-200 text-sm">See and hear your progress in real-time</p>
            </div>
            <div className="p-4 bg-purple-900/20 rounded-lg">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-300 font-medium">Scientific Training</p>
              <p className="text-purple-200 text-sm">Audio analysis guides your improvement</p>
            </div>
            <div className="p-4 bg-blue-900/20 rounded-lg">
              <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-300 font-medium">Practical Skills</p>
              <p className="text-blue-200 text-sm">Train with real words and phrases</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeechTherapyFeatures;
