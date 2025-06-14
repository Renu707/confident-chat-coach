
import React, { useState, useEffect } from 'react';
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
  TrendingUp
} from 'lucide-react';

interface SpeechTherapyFeaturesProps {
  activeMode: string;
  onExerciseComplete: (exercise: string, score: number) => void;
}

const SpeechTherapyFeatures: React.FC<SpeechTherapyFeaturesProps> = ({ 
  activeMode, 
  onExerciseComplete 
}) => {
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [exercisesCompleted, setExercisesCompleted] = useState(12);

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

  const startExercise = (exerciseId: string) => {
    setCurrentExercise(exerciseId);
    setExerciseProgress(0);
    
    // Simulate exercise progress
    const interval = setInterval(() => {
      setExerciseProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCurrentExercise(null);
          onExerciseComplete(exerciseId, Math.floor(Math.random() * 20) + 80);
          setExercisesCompleted(prev => prev + 1);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
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

      {/* Current Exercise */}
      {currentExercise && (
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="w-5 h-5 mr-2 text-purple-400" />
              Exercise in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-purple-300">Progress</span>
                <span className="text-purple-300">{exerciseProgress}%</span>
              </div>
              <Progress value={exerciseProgress} className="w-full" />
              <div className="text-center p-4 bg-purple-900/20 rounded-lg">
                <p className="text-purple-200 text-lg animate-pulse">
                  ✨ You're doing amazing! Keep going! ✨
                </p>
                <p className="text-purple-300 text-sm mt-2">
                  Every moment of practice builds real confidence 💪
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            Your Personalized Exercises 🎯
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
                  <Button 
                    onClick={() => startExercise(exercise.id)}
                    disabled={currentExercise !== null}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium group-hover:scale-105 transition-transform"
                  >
                    {currentExercise === exercise.id ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        In Progress...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Exercise
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
            You're Transforming Every Day! 🌟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-pink-900/20 rounded-lg">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <p className="text-pink-300 font-medium">Self-Compassion</p>
              <p className="text-pink-200 text-sm">Your voice is valuable exactly as it is</p>
            </div>
            <div className="p-4 bg-purple-900/20 rounded-lg">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-300 font-medium">Growth Mindset</p>
              <p className="text-purple-200 text-sm">Every practice session builds strength</p>
            </div>
            <div className="p-4 bg-blue-900/20 rounded-lg">
              <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-300 font-medium">Real Progress</p>
              <p className="text-blue-200 text-sm">You're already more confident than yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeechTherapyFeatures;
