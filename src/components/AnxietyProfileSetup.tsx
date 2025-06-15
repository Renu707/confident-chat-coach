
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Target, ArrowRight } from 'lucide-react';

interface AnxietyProfile {
  triggers: string[];
  conversationTone: string;
  anxietySeverity: number;
  preferredScenarios: string[];
  goals: string[];
}

interface AnxietyProfileSetupProps {
  onProfileComplete: (profile: AnxietyProfile) => void;
  onSkip: () => void;
}

const AnxietyProfileSetup: React.FC<AnxietyProfileSetupProps> = ({ onProfileComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<AnxietyProfile>({
    triggers: [],
    conversationTone: 'friendly',
    anxietySeverity: 5,
    preferredScenarios: [],
    goals: []
  });

  const totalSteps = 4;

  const triggers = [
    'Public speaking', 'Job interviews', 'Dating conversations', 'Group discussions',
    'Making phone calls', 'Meeting new people', 'Workplace interactions', 'Disagreements/conflicts'
  ];

  const scenarios = [
    'Workplace small talk', 'Social gatherings', 'Professional networking',
    'Dating conversations', 'Customer service interactions', 'Family discussions'
  ];

  const goals = [
    'Speak more confidently', 'Reduce anxiety in conversations', 'Improve listening skills',
    'Express opinions clearly', 'Handle disagreements better', 'Make new friends',
    'Advance career through better communication', 'Feel more comfortable in groups'
  ];

  const handleTriggerChange = (trigger: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      triggers: checked 
        ? [...prev.triggers, trigger]
        : prev.triggers.filter(t => t !== trigger)
    }));
  };

  const handleScenarioChange = (scenario: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferredScenarios: checked 
        ? [...prev.preferredScenarios, scenario]
        : prev.preferredScenarios.filter(s => s !== scenario)
    }));
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      goals: checked 
        ? [...prev.goals, goal]
        : prev.goals.filter(g => g !== goal)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onProfileComplete(profile);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getAnxietyLabel = (value: number) => {
    if (value <= 3) return 'Mild - I feel slightly nervous in social situations';
    if (value <= 6) return 'Moderate - I often feel anxious but can manage';
    return 'Severe - Social situations cause significant distress';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">What triggers your social anxiety?</h3>
              <p className="text-slate-300">Select all that apply - this helps us personalize your practice</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {triggers.map((trigger) => (
                <div key={trigger} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                  <Checkbox
                    id={trigger}
                    checked={profile.triggers.includes(trigger)}
                    onCheckedChange={(checked) => handleTriggerChange(trigger, checked as boolean)}
                  />
                  <Label htmlFor={trigger} className="text-slate-200 cursor-pointer flex-1">{trigger}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">How severe is your social anxiety?</h3>
              <p className="text-slate-300">This helps us adjust the pace and support level</p>
            </div>
            <div className="space-y-6">
              <div className="px-4">
                <Slider
                  value={[profile.anxietySeverity]}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, anxietySeverity: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <p className="text-slate-200">{getAnxietyLabel(profile.anxietySeverity)}</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">What conversation style works best for you?</h3>
              <p className="text-slate-300">We'll match you with AI personalities that feel comfortable</p>
            </div>
            <RadioGroup
              value={profile.conversationTone}
              onValueChange={(value) => setProfile(prev => ({ ...prev, conversationTone: value }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <RadioGroupItem value="casual" id="casual" />
                <Label htmlFor="casual" className="text-slate-200 cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">Casual & Relaxed</div>
                    <div className="text-sm text-slate-400">Like chatting with a friend, informal and easy-going</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <RadioGroupItem value="friendly" id="friendly" />
                <Label htmlFor="friendly" className="text-slate-200 cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">Friendly & Supportive</div>
                    <div className="text-sm text-slate-400">Warm and encouraging, but structured conversations</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional" className="text-slate-200 cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">Professional & Polite</div>
                    <div className="text-sm text-slate-400">Formal but kind, like workplace or academic settings</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">What are your main goals?</h3>
              <p className="text-slate-300">Choose what you'd like to work on - we'll track your progress</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {goals.map((goal) => (
                <div key={goal} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                  <Checkbox
                    id={goal}
                    checked={profile.goals.includes(goal)}
                    onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                  />
                  <Label htmlFor={goal} className="text-slate-200 cursor-pointer flex-1">{goal}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-600 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-white mb-2">Let's Personalize Your Journey</CardTitle>
            <p className="text-slate-300">This takes just 2 minutes and helps us create the perfect practice experience for you</p>
            <div className="mt-4">
              <Progress value={(currentStep / totalSteps) * 100} className="w-full h-2" />
              <p className="text-sm text-slate-400 mt-2">Step {currentStep} of {totalSteps}</p>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep} className="border-slate-600 text-slate-200 hover:bg-slate-700">
                    Previous
                  </Button>
                )}
                <Button variant="ghost" onClick={onSkip} className="text-slate-400 hover:text-slate-200">
                  Skip Setup
                </Button>
              </div>
              
              <Button 
                onClick={nextStep} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={currentStep === 1 && profile.triggers.length === 0}
              >
                {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnxietyProfileSetup;
