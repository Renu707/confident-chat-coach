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
  BarChart3,
  FileText,
  Zap,
  BookOpen,
  Award
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
    wordsPerMinute: number;
    pauseDuration: number;
    fillerWords: number;
  };
  spokenText: string;
  fluencyScore: number;
  coherenceScore: number;
  currentTargetProgress: number; // Progress for current word/sentence
}

interface AudioAnalysisData {
  volume: number;
  frequency: number;
  clarity: number;
  speechRate: number;
  pauseDuration: number;
  fluencyMetrics: {
    wordsPerMinute: number;
    pauseFrequency: number;
    fillerWordCount: number;
    repetitionCount: number;
    coherenceScore: number;
  };
}

interface FluencyFeedback {
  overall: string;
  pace: string;
  clarity: string;
  pauses: string;
  suggestions: string[];
  strengths: string[];
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
    pauseDuration: 0,
    fluencyMetrics: {
      wordsPerMinute: 0,
      pauseFrequency: 0,
      fillerWordCount: 0,
      repetitionCount: 0,
      coherenceScore: 0
    }
  });
  const [realTimeFeedback, setRealTimeFeedback] = useState<string>('');
  const [fluencyFeedback, setFluencyFeedback] = useState<FluencyFeedback | null>(null);
  const [lastPauseTime, setLastPauseTime] = useState<number>(0);
  const [wordTimestamps, setWordTimestamps] = useState<Array<{word: string, timestamp: number}>>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const animationFrameRef = useRef<number>();
  const speechStartTimeRef = useRef<number>(0);

  const exerciseTargets = {
    'gentle-onset': {
      words: ['apple', 'orange', 'elephant', 'umbrella', 'airplane'],
      longSentences: [
        'The magnificent elephant gracefully walked through the lush green forest.',
        'Understanding the importance of gentle voice starts helps improve overall speech fluency.',
        'Every morning brings new opportunities to practice and improve our communication skills.'
      ],
      paragraphs: [
        'Speaking with confidence requires practice and patience. When we focus on gentle voice starts, we create a foundation for clear communication. Each word flows naturally into the next, creating a smooth and pleasant speaking rhythm that others enjoy listening to.'
      ],
      instructions: 'Start each word gently with smooth airflow',
      targetRate: 120,
      focusArea: 'onset'
    },
    'syllable-tapping': {
      words: ['butterfly', 'elephant', 'watermelon', 'incredible', 'community'],
      longSentences: [
        'The beautiful butterfly danced gracefully among the colorful flowers in the garden.',
        'Community involvement creates incredible opportunities for personal and professional growth.',
        'Understanding the rhythm of speech helps develop natural and confident communication patterns.'
      ],
      paragraphs: [
        'Rhythm and flow are essential elements of natural speech. When we tap along with syllables, we develop an internal sense of timing that makes our speech more engaging and easier to follow. This technique helps speakers maintain consistent pacing and reduces the likelihood of rushing through important information.'
      ],
      instructions: 'Tap for each syllable as you speak',
      targetRate: 100,
      focusArea: 'rhythm'
    },
    'breathing-speech': {
      words: ['breathe deeply', 'speak smoothly', 'calm voice', 'steady flow', 'relaxed speaking'],
      longSentences: [
        'Deep breathing provides the foundation for powerful and controlled speech delivery.',
        'Coordinating breath with speech creates natural pauses and improves overall communication effectiveness.',
        'Relaxed breathing patterns support confident speaking and reduce anxiety in challenging situations.'
      ],
      paragraphs: [
        'Proper breathing technique is the cornerstone of effective speech. When we breathe deeply and regularly, we provide our voice with the support it needs to project clearly and maintain consistent volume. This coordination between breath and speech creates natural rhythm and helps prevent the tension that can interfere with clear communication.'
      ],
      instructions: 'Coordinate breathing with speech',
      targetRate: 110,
      focusArea: 'breathing'
    },
    'slow-motion': {
      words: ['slow and clear', 'take your time', 'deliberate speech', 'careful words', 'mindful speaking'],
      longSentences: [
        'Taking time to speak slowly and deliberately helps ensure that every word is clearly understood.',
        'Mindful speaking involves paying attention to each word and giving it the time it deserves.',
        'Careful articulation and slower pace often lead to more meaningful and impactful communication.'
      ],
      paragraphs: [
        'In our fast-paced world, the art of slow, deliberate speech has become increasingly valuable. When we take time to carefully form each word and allow natural pauses between thoughts, we create space for our listeners to truly understand and absorb our message. This mindful approach to speaking demonstrates respect for both our words and our audience.'
      ],
      instructions: 'Speak each word slowly and clearly',
      targetRate: 80,
      focusArea: 'pace'
    },
    'articulation-drills': {
      words: ['red leather yellow leather', 'unique New York', 'toy boat', 'she sells seashells', 'peter piper picked'],
      longSentences: [
        'Precise articulation of consonants and vowels creates crystal clear speech that everyone can understand.',
        'Practicing challenging tongue twisters regularly improves overall speech clarity and confidence.',
        'Sharp consonant sounds and clear vowel formation are the building blocks of excellent pronunciation.'
      ],
      paragraphs: [
        'Clear articulation is the hallmark of professional and confident communication. Every consonant should be crisp and precise, while vowels should be pure and well-formed. This attention to detail in pronunciation not only makes speech easier to understand but also demonstrates care and professionalism in all communication settings.'
      ],
      instructions: 'Focus on precise consonant sounds',
      targetRate: 90,
      focusArea: 'clarity'
    },
    'pacing-practice': {
      words: ['find your rhythm', 'natural pace', 'comfortable speed', 'steady timing', 'balanced flow'],
      longSentences: [
        'Finding your natural speaking pace allows for comfortable and confident communication in any situation.',
        'Balanced flow between words and phrases creates an engaging and pleasant listening experience.',
        'Steady timing helps maintain audience attention and ensures important information is clearly delivered.'
      ],
      paragraphs: [
        'The perfect speaking pace varies from person to person, but finding your natural rhythm is essential for effective communication. This optimal pace allows you to think clearly while speaking, ensures your audience can follow along comfortably, and gives you time to emphasize important points. Practice helps you maintain this ideal pace even in stressful or exciting situations.'
      ],
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
        } else if (currentSession && !event.results[0].isFinal) {
          // Update progress dynamically for interim results
          updateDynamicProgress(transcript);
        }
      };

      recognitionRef.current!.onstart = () => {
        speechStartTimeRef.current = Date.now();
      };
    }

    return () => {
      stopAudioAnalysis();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentSession]);

  const updateDynamicProgress = (interimTranscript: string) => {
    if (!currentSession) return;

    const currentTarget = getCurrentTarget();
    const targetWords = currentTarget.toLowerCase().split(' ');
    const spokenWords = interimTranscript.toLowerCase().split(' ');
    
    // Calculate how many words match
    let matchedWords = 0;
    spokenWords.forEach((word, index) => {
      if (index < targetWords.length && targetWords[index].includes(word.replace(/[.,!?]/g, ''))) {
        matchedWords++;
      }
    });

    // Calculate progress for current target (0-100%)
    const currentTargetProgress = Math.min(100, (matchedWords / targetWords.length) * 100);
    
    // Update session with current target progress
    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentTargetProgress
      };
    });

    // Update overall exercise progress
    const exercise = exerciseTargets[currentSession.id as keyof typeof exerciseTargets];
    const totalTargets = exercise.words.length + 
                        (exercise.longSentences?.length || 0) + 
                        (exercise.paragraphs?.length || 0);
    
    const completedTargets = currentSession.currentWordIndex;
    const overallProgress = ((completedTargets + (currentTargetProgress / 100)) / totalTargets) * 100;
    
    setExerciseProgress(Math.min(100, overallProgress));
  };

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
    
    // Calculate speech rate based on time elapsed
    const timeElapsed = Date.now() - speechStartTimeRef.current;
    const estimatedWPM = currentSession ? 
      Math.round((currentSession.spokenText.split(' ').length / timeElapsed) * 60000) : 0;
    
    setAudioAnalysis(prev => ({
      ...prev,
      volume: Math.min(100, (volume / 128) * 100),
      frequency,
      clarity,
      fluencyMetrics: {
        ...prev.fluencyMetrics,
        wordsPerMinute: estimatedWPM
      }
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
    const currentTarget = getCurrentTarget();
    
    // Update spoken text for analysis
    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        spokenText: prev.spokenText + ' ' + transcript
      };
    });

    // Add word timestamps for pause analysis
    setWordTimestamps(prev => [
      ...prev,
      { word: transcript, timestamp: Date.now() }
    ]);
    
    // Check similarity with target
    const similarity = calculateSimilarity(transcript.toLowerCase(), currentTarget.toLowerCase());
    
    if (similarity > 0.6) {
      setCurrentSession(prev => {
        if (!prev) return null;
        const totalTargets = exercise.words.length + 
                           (exercise.longSentences?.length || 0) + 
                           (exercise.paragraphs?.length || 0);
        const newIndex = prev.currentWordIndex + 1;
        const progress = (newIndex / totalTargets) * 100;
        setExerciseProgress(progress);
        
        if (newIndex >= totalTargets) {
          completeExercise();
          return null;
        }
        
        return {
          ...prev,
          currentWordIndex: newIndex,
          currentTargetProgress: 0 // Reset progress for next target
        };
      });
      
      setRealTimeFeedback('✅ Excellent! Moving to next item...');
      
      // Provide detailed feedback after each completion
      if (currentSession) {
        provideDetailedFeedback(currentSession);
      }
    } else {
      setRealTimeFeedback('🎯 Try again - focus on clarity and pace');
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
        stutterEvents: 0,
        wordsPerMinute: 0,
        pauseDuration: 0,
        fillerWords: 0
      },
      spokenText: '',
      fluencyScore: 0,
      coherenceScore: 0,
      currentTargetProgress: 0
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

  const getCurrentTarget = () => {
    if (!currentSession) return '';
    
    const exercise = exerciseTargets[currentSession.id as keyof typeof exerciseTargets];
    const index = currentSession.currentWordIndex;
    
    if (index < exercise.words.length) {
      return exercise.words[index];
    } else if (exercise.longSentences && index < exercise.words.length + exercise.longSentences.length) {
      return exercise.longSentences[index - exercise.words.length];
    } else if (exercise.paragraphs) {
      return exercise.paragraphs[index - exercise.words.length - (exercise.longSentences?.length || 0)];
    }
    
    return '';
  };

  const getCurrentTargetType = () => {
    if (!currentSession) return 'word';
    
    const exercise = exerciseTargets[currentSession.id as keyof typeof exerciseTargets];
    const index = currentSession.currentWordIndex;
    
    if (index < exercise.words.length) {
      return 'word';
    } else if (exercise.longSentences && index < exercise.words.length + exercise.longSentences.length) {
      return 'sentence';
    } else {
      return 'paragraph';
    }
  };

  const provideDetailedFeedback = (session: ExerciseSession) => {
    if (!session.spokenText) return;

    const duration = Date.now() - session.startTime;
    const feedback = analyzeFluency(session.spokenText, duration);
    setFluencyFeedback(feedback);
  };

  const analyzeFluency = (spokenText: string, duration: number): FluencyFeedback => {
    const words = spokenText.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const wordsPerMinute = Math.round((words.length / duration) * 60000);
    
    // Detect filler words
    const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'well', 'actually', 'basically'];
    const fillerCount = words.filter(word => fillerWords.includes(word.replace(/[.,!?]/, ''))).length;
    
    // Detect repetitions
    const repetitions = words.filter((word, index) => word === words[index + 1]).length;
    
    // Calculate fluency metrics
    const fillerRatio = fillerCount / Math.max(words.length, 1);
    const repetitionRatio = repetitions / Math.max(words.length, 1);
    
    // Generate feedback
    const feedback: FluencyFeedback = {
      overall: '',
      pace: '',
      clarity: '',
      pauses: '',
      suggestions: [],
      strengths: []
    };

    // Pace analysis
    if (wordsPerMinute < 120) {
      feedback.pace = 'Your speaking pace is quite slow. Try to increase your speed slightly for more natural flow.';
      feedback.suggestions.push('Practice reading aloud to increase your natural speaking pace');
    } else if (wordsPerMinute > 180) {
      feedback.pace = 'You\'re speaking quite fast. Slow down to ensure clarity and comprehension.';
      feedback.suggestions.push('Take deeper breaths and pause between sentences');
    } else {
      feedback.pace = 'Excellent pace! Your speaking speed is natural and easy to follow.';
      feedback.strengths.push('Great natural speaking rhythm');
    }

    // Filler word analysis
    if (fillerRatio > 0.1) {
      feedback.suggestions.push('Reduce filler words by pausing instead of saying "um" or "uh"');
    } else if (fillerRatio < 0.05) {
      feedback.strengths.push('Minimal use of filler words - very professional!');
    }

    // Repetition analysis
    if (repetitionRatio > 0.05) {
      feedback.suggestions.push('Avoid repeating words - take a moment to organize your thoughts');
    } else {
      feedback.strengths.push('Clear and concise expression without unnecessary repetition');
    }

    // Overall assessment
    const overallScore = Math.max(0, 100 - (fillerRatio * 30) - (repetitionRatio * 20) - Math.abs(wordsPerMinute - 150) / 2;
    
    if (overallScore >= 80) {
      feedback.overall = '🌟 Excellent fluency! Your speech is clear, well-paced, and engaging.';
    } else if (overallScore >= 60) {
      feedback.overall = '👍 Good fluency with room for improvement in specific areas.';
    } else {
      feedback.overall = '💪 Keep practicing! Focus on the suggestions to improve your fluency.';
    }

    feedback.clarity = `Speech clarity: ${Math.round(audioAnalysis.clarity)}% - ${audioAnalysis.clarity > 70 ? 'Excellent' : audioAnalysis.clarity > 50 ? 'Good' : 'Needs improvement'}`;
    feedback.pauses = `Pause frequency: ${wordTimestamps.length > 1 ? 'Natural' : 'Consider adding more pauses'}`;

    return feedback;
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

      {/* Enhanced Current Exercise Session with Dynamic Progress */}
      {currentSession && (
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Advanced Fluency Training
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white">
                  {getCurrentTargetType().toUpperCase()}
                </Badge>
                <Button
                  onClick={stopExercise}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:bg-red-900/30"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Current Target Display with Dynamic Progress */}
              <div className="text-center p-6 bg-purple-900/40 rounded-lg border border-purple-600/30">
                <div className="flex items-center justify-center mb-3">
                  {getCurrentTargetType() === 'word' && <Target className="w-5 h-5 text-purple-400 mr-2" />}
                  {getCurrentTargetType() === 'sentence' && <FileText className="w-5 h-5 text-blue-400 mr-2" />}
                  {getCurrentTargetType() === 'paragraph' && <BookOpen className="w-5 h-5 text-green-400 mr-2" />}
                  <h3 className="text-purple-300 text-sm">
                    Practice this {getCurrentTargetType()}:
                  </h3>
                </div>
                <p className={`font-bold text-white mb-4 ${
                  getCurrentTargetType() === 'paragraph' ? 'text-lg leading-relaxed' : 
                  getCurrentTargetType() === 'sentence' ? 'text-xl' : 'text-3xl'
                }`}>
                  {getCurrentTarget()}
                </p>
                <p className="text-purple-200 text-sm mb-4">
                  {exerciseTargets[currentSession.id as keyof typeof exerciseTargets]?.instructions}
                </p>
                {/* Dynamic Progress for Current Target */}
                <div className="w-full bg-purple-900/30 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentSession.currentTargetProgress || 0}%` }}
                  ></div>
                </div>
                <p className="text-purple-300 text-xs">
                  Current target: {Math.round(currentSession.currentTargetProgress || 0)}% complete
                </p>
              </div>

              {/* Enhanced Real-time Audio Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-slate-300 text-sm">Pace (WPM)</p>
                    <Progress value={Math.min(100, audioAnalysis.fluencyMetrics.wordsPerMinute / 2)} className="mt-2" />
                    <p className="text-yellow-400 text-xs mt-1">{audioAnalysis.fluencyMetrics.wordsPerMinute}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-slate-600">
                  <CardContent className="p-4 text-center">
                    <Timer className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-slate-300 text-sm">Overall Progress</p>
                    <Progress value={exerciseProgress} className="mt-2" />
                    <p className="text-purple-400 text-xs mt-1">
                      {currentSession.currentWordIndex + 1}/
                      {(exerciseTargets[currentSession.id as keyof typeof exerciseTargets]?.words.length || 0) + 
                       (exerciseTargets[currentSession.id as keyof typeof exerciseTargets]?.longSentences?.length || 0) +
                       (exerciseTargets[currentSession.id as keyof typeof exerciseTargets]?.paragraphs?.length || 0)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Fluency Feedback */}
              {fluencyFeedback && (
                <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-600/30">
                  <CardHeader>
                    <CardTitle className="text-green-300 flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Fluency Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-3 bg-green-900/20 rounded-lg">
                      <p className="text-green-200 font-medium">{fluencyFeedback.overall}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-blue-300 font-medium flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          Strengths
                        </h4>
                        {fluencyFeedback.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-green-200 text-sm">{strength}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-yellow-300 font-medium flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          Suggestions
                        </h4>
                        {fluencyFeedback.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-yellow-200 text-sm">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <p className="text-blue-200">{fluencyFeedback.pace}</p>
                      <p className="text-green-200">{fluencyFeedback.clarity}</p>
                      <p className="text-purple-200">{fluencyFeedback.pauses}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

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
