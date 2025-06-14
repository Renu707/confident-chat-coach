import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  HandHeart, 
  GraduationCap, 
  Heart,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  skills: string[];
  color: string;
}

interface ScenarioSelectorProps {
  onSelectScenario: (scenarioId: string, difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
}

const scenarios: Scenario[] = [
  {
    id: 'workplace-small-talk',
    title: 'Workplace Small Talk',
    description: 'Practice casual conversations with colleagues around the office, by the coffee machine, or during breaks.',
    icon: <Briefcase className="w-6 h-6" />,
    difficulty: 'beginner',
    duration: '10-15 min',
    skills: ['Ice breaking', 'Active listening', 'Professional tone'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
  },
  {
    id: 'casual-social-event',
    title: 'Social Events',
    description: 'Navigate conversations at parties, gatherings, and social meetups with confidence.',
    icon: <Users className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '15-20 min',
    skills: ['Group dynamics', 'Finding common ground', 'Humor'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
  },
  {
    id: 'professional-networking',
    title: 'Professional Networking',
    description: 'Master the art of networking at conferences, industry events, and business meetups.',
    icon: <HandHeart className="w-6 h-6" />,
    difficulty: 'advanced',
    duration: '20-25 min',
    skills: ['Elevator pitch', 'Value proposition', 'Follow-up'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
  },
  {
    id: 'interview-preparation',
    title: 'Interview Skills',
    description: 'Build confidence for job interviews with practice questions and professional communication.',
    icon: <GraduationCap className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '25-30 min',
    skills: ['Professional presence', 'Storytelling', 'Confidence'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
  },
  {
    id: 'dating-conversation',
    title: 'Dating & Romance',
    description: 'Practice meaningful conversations for dating apps, first dates, and romantic relationships.',
    icon: <Heart className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '15-20 min',
    skills: ['Authenticity', 'Emotional connection', 'Flirting'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ onSelectScenario }) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Choose Your Practice Scenario
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select a conversation scenario that matches your goals. Each session is designed to build your confidence in real-world situations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${scenario.color} backdrop-blur-sm`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-slate-900/80 rounded-lg shadow-sm border border-slate-600">
                  {scenario.icon}
                </div>
                <Badge className={getDifficultyColor(scenario.difficulty)}>
                  {scenario.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3 text-slate-100">{scenario.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                {scenario.description}
              </p>
              
              <div className="flex items-center text-xs text-slate-400 space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{scenario.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>{scenario.skills.length} skills</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400">Skills you'll practice:</p>
                <div className="flex flex-wrap gap-1">
                  {scenario.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white border-0" 
                onClick={() => onSelectScenario(scenario.id, scenario.difficulty)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Start Practice Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <h3 className="font-semibold text-slate-200 mb-2">New to conversation practice?</h3>
        <p className="text-sm text-slate-400 mb-4">
          Start with "Workplace Small Talk" to build your foundation, then progress to more challenging scenarios.
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Safe environment</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Personalized feedback</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Build confidence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelector;
