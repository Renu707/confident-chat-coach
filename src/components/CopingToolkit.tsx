
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Heart, Brain, Sparkles, ArrowLeft } from 'lucide-react';

interface CopingToolkitProps {
  onBack: () => void;
}

const CopingToolkit: React.FC<CopingToolkitProps> = ({ onBack }) => {
  const [activeBreathing, setActiveBreathing] = useState<string | null>(null);
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Grounding exercise state
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingActive, setGroundingActive] = useState(false);

  const breathingExercises = [
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'Calm anxiety with 4-4-4-4 breathing',
      phases: [
        { name: 'Breathe in', duration: 4000, instruction: 'Slowly breathe in through your nose' },
        { name: 'Hold', duration: 4000, instruction: 'Hold your breath gently' },
        { name: 'Breathe out', duration: 4000, instruction: 'Slowly exhale through your mouth' },
        { name: 'Hold', duration: 4000, instruction: 'Hold empty for a moment' }
      ]
    },
    {
      id: '478',
      name: '4-7-8 Breathing',
      description: 'Deep relaxation technique',
      phases: [
        { name: 'Breathe in', duration: 4000, instruction: 'Breathe in quietly through your nose' },
        { name: 'Hold', duration: 7000, instruction: 'Hold your breath completely' },
        { name: 'Breathe out', duration: 8000, instruction: 'Exhale completely through your mouth' }
      ]
    }
  ];

  const groundingSteps = [
    { sense: 'See', instruction: 'Look around and name 5 things you can see', icon: '👀' },
    { sense: 'Touch', instruction: 'Notice 4 things you can touch or feel', icon: '🤲' },
    { sense: 'Hear', instruction: 'Listen for 3 sounds around you', icon: '👂' },
    { sense: 'Smell', instruction: 'Identify 2 scents you can smell', icon: '👃' },
    { sense: 'Taste', instruction: 'Name 1 thing you can taste', icon: '👅' }
  ];

  const socialScripts = [
    {
      category: 'Politely Declining',
      scripts: [
        "I appreciate the offer, but I can't make it.",
        "Thank you for thinking of me, but I'll have to pass this time.",
        "I'm not available, but I hope you have a great time!"
      ]
    },
    {
      category: 'Joining Conversations',
      scripts: [
        "Mind if I join you? That sounds really interesting.",
        "I couldn't help but overhear - that's fascinating!",
        "Hi! I'm [name]. What are you all discussing?"
      ]
    },
    {
      category: 'Handling Disagreements',
      scripts: [
        "I see your point, though I have a different perspective...",
        "That's an interesting way to look at it. I've found that...",
        "I understand where you're coming from. Let me share my experience..."
      ]
    },
    {
      category: 'Starting Small Talk',
      scripts: [
        "How's your day going so far?",
        "That's a great [item they have]. Where did you get it?",
        "Have you tried [local restaurant/activity] before?"
      ]
    }
  ];

  const affirmations = [
    "I am worthy of connection and belonging.",
    "My voice matters and deserves to be heard.",
    "I choose courage over comfort in conversations.",
    "Every social interaction is a chance to grow.",
    "I accept myself exactly as I am right now.",
    "My unique perspective adds value to conversations.",
    "I can handle whatever response I receive.",
    "Social skills improve with practice, and I'm practicing."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (activeBreathing) {
      const exercise = breathingExercises.find(ex => ex.id === activeBreathing);
      if (!exercise) return;

      let phaseIndex = 0;
      let phaseStartTime = Date.now();
      
      interval = setInterval(() => {
        const now = Date.now();
        const currentPhase = exercise.phases[phaseIndex];
        const elapsed = now - phaseStartTime;
        const progress = (elapsed / currentPhase.duration) * 100;

        if (progress >= 100) {
          phaseIndex = (phaseIndex + 1) % exercise.phases.length;
          phaseStartTime = now;
          setBreathingProgress(0);
        } else {
          setBreathingProgress(progress);
        }

        setBreathingPhase(exercise.phases[phaseIndex].instruction);
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeBreathing]);

  const startBreathing = (exerciseId: string) => {
    setActiveBreathing(exerciseId);
    setBreathingProgress(0);
  };

  const stopBreathing = () => {
    setActiveBreathing(null);
    setBreathingProgress(0);
    setBreathingPhase('');
  };

  const startGrounding = () => {
    setGroundingActive(true);
    setGroundingStep(0);
  };

  const nextGroundingStep = () => {
    if (groundingStep < groundingSteps.length - 1) {
      setGroundingStep(groundingStep + 1);
    } else {
      setGroundingActive(false);
      setGroundingStep(0);
    }
  };

  const speakAffirmation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Coping Toolkit</h1>
            <p className="text-slate-300">Instant support when you need it most</p>
          </div>
        </div>

        <Tabs defaultValue="breathing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/60">
            <TabsTrigger value="breathing" className="data-[state=active]:bg-blue-600">
              Breathing
            </TabsTrigger>
            <TabsTrigger value="grounding" className="data-[state=active]:bg-green-600">
              Grounding
            </TabsTrigger>
            <TabsTrigger value="scripts" className="data-[state=active]:bg-purple-600">
              Social Scripts
            </TabsTrigger>
            <TabsTrigger value="affirmations" className="data-[state=active]:bg-pink-600">
              Affirmations
            </TabsTrigger>
          </TabsList>

          {/* Breathing Exercises */}
          <TabsContent value="breathing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {breathingExercises.map((exercise) => (
                <Card key={exercise.id} className="bg-slate-800/60 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span>{exercise.name}</span>
                    </CardTitle>
                    <p className="text-slate-300">{exercise.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeBreathing === exercise.id && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl text-blue-400 mb-2">{breathingPhase}</div>
                          <Progress value={breathingProgress} className="w-full h-3" />
                        </div>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      {activeBreathing === exercise.id ? (
                        <Button onClick={stopBreathing} variant="outline" className="flex-1">
                          <Pause className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      ) : (
                        <Button onClick={() => startBreathing(exercise.id)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Grounding Exercise */}
          <TabsContent value="grounding" className="space-y-6">
            <Card className="bg-slate-800/60 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-green-400" />
                  <span>5-4-3-2-1 Grounding Technique</span>
                </CardTitle>
                <p className="text-slate-300">Reconnect with the present moment using your five senses</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {groundingActive ? (
                  <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">{groundingSteps[groundingStep].icon}</div>
                    <div className="space-y-4">
                      <h3 className="text-2xl text-white">{groundingSteps[groundingStep].sense}</h3>
                      <p className="text-xl text-slate-300">{groundingSteps[groundingStep].instruction}</p>
                      <Progress value={((groundingStep + 1) / groundingSteps.length) * 100} className="w-full h-2" />
                    </div>
                    <Button onClick={nextGroundingStep} className="bg-green-600 hover:bg-green-700 px-8">
                      {groundingStep < groundingSteps.length - 1 ? 'Next' : 'Complete'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-slate-300">Take a moment to ground yourself using your five senses</p>
                    <Button onClick={startGrounding} className="bg-green-600 hover:bg-green-700 px-8">
                      <Play className="w-4 h-4 mr-2" />
                      Start Grounding Exercise
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Scripts */}
          <TabsContent value="scripts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialScripts.map((category, index) => (
                <Card key={index} className="bg-slate-800/60 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.scripts.map((script, scriptIndex) => (
                      <div key={scriptIndex} className="p-3 bg-slate-700 rounded-lg">
                        <p className="text-slate-200 italic">"{script}"</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Affirmations */}
          <TabsContent value="affirmations" className="space-y-6">
            <Card className="bg-slate-800/60 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <span>Positive Affirmations</span>
                </CardTitle>
                <p className="text-slate-300">Gentle reminders to boost your confidence</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {affirmations.map((affirmation, index) => (
                    <div key={index} className="p-4 bg-slate-700 rounded-lg group hover:bg-slate-600 transition-colors">
                      <p className="text-slate-200 mb-3">"{affirmation}"</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => speakAffirmation(affirmation)}
                        className="text-pink-400 hover:text-pink-300"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Read Aloud
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CopingToolkit;
