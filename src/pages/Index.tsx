
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ScenarioSelector from '@/components/ScenarioSelector';
import ConversationCoach from '@/components/ConversationCoach';
import ProgressDashboard from '@/components/ProgressDashboard';
import { 
  MessageCircle, 
  BarChart3, 
  Brain, 
  Shield, 
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';

type AppState = 'welcome' | 'scenarios' | 'coaching' | 'progress';

interface SessionResult {
  id: string;
  scenario: string;
  score: number;
  duration: number;
  date: Date;
  improvements: string[];
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [sessions, setSessions] = useState<SessionResult[]>([]);

  const handleSelectScenario = (scenarioId: string, difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedScenario(scenarioId);
    setSelectedDifficulty(difficulty);
    setCurrentState('coaching');
  };

  const handleSessionComplete = (score: number) => {
    const newSession: SessionResult = {
      id: `session-${Date.now()}`,
      scenario: selectedScenario,
      score: score,
      duration: Math.floor(Math.random() * 15) + 10, // Mock duration
      date: new Date(),
      improvements: ['Active listening', 'Confidence building'] // Mock improvements
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentState('progress');
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-coach-50 via-white to-confidence-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex p-4 bg-white rounded-full shadow-lg mb-6">
              <MessageCircle className="w-12 h-12 text-coach-600" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Build Social Confidence with
              <span className="text-coach-600 block">AI-Powered Practice</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Practice conversations in a safe, judgment-free environment. Our AI coach helps you develop natural social skills and overcome social anxiety through personalized feedback and real-time coaching.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={() => setCurrentState('scenarios')}
              className="px-8 py-4 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your First Session
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentState('progress')}
              className="px-8 py-4 text-lg"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Progress
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="p-3 bg-coach-100 rounded-full w-fit mx-auto mb-4">
              <Brain className="w-8 h-8 text-coach-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI-Powered Coaching</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI provides personalized feedback and adapts to your learning style
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="p-3 bg-confidence-100 rounded-full w-fit mx-auto mb-4">
              <Shield className="w-8 h-8 text-confidence-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Safe Environment</h3>
            <p className="text-sm text-muted-foreground">
              Practice without judgment in a completely private and supportive space
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Real Scenarios</h3>
            <p className="text-sm text-muted-foreground">
              Practice workplace, social, dating, and networking conversations
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your confidence growth and celebrate improvements
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-coach-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Choose Your Scenario</h3>
              <p className="text-muted-foreground">
                Select from workplace, social, dating, or networking conversations
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-coach-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Practice with AI</h3>
              <p className="text-muted-foreground">
                Have natural conversations with our supportive AI coach
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-coach-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Build Confidence</h3>
              <p className="text-muted-foreground">
                Receive feedback and track your progress over time
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-coach-500 to-confidence-500 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Confidence?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands who have overcome social anxiety through practice
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setCurrentState('scenarios')}
            className="px-8 py-4 text-lg"
          >
            Start Practicing Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentState) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'scenarios':
        return <ScenarioSelector onSelectScenario={handleSelectScenario} />;
      case 'coaching':
        return (
          <div className="min-h-screen bg-background">
            <ConversationCoach 
              scenario={selectedScenario}
              difficulty={selectedDifficulty}
              onSessionComplete={handleSessionComplete}
            />
          </div>
        );
      case 'progress':
        return (
          <ProgressDashboard 
            sessions={sessions}
            onStartNewSession={() => setCurrentState('scenarios')}
          />
        );
      default:
        return renderWelcomeScreen();
    }
  };

  // Navigation bar for non-welcome screens
  if (currentState !== 'welcome') {
    return (
      <div className="min-h-screen bg-background">
        <nav className="bg-white border-b border-border px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-coach-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-coach-600" />
              </div>
              <h1 className="text-xl font-bold text-foreground">ConversationAI Coach</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentState('scenarios')}
                className={currentState === 'scenarios' ? 'bg-muted' : ''}
              >
                Practice
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentState('progress')}
                className={currentState === 'progress' ? 'bg-muted' : ''}
              >
                Progress
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentState('welcome')}
              >
                Home
              </Button>
            </div>
          </div>
        </nav>
        {renderContent()}
      </div>
    );
  }

  return renderContent();
};

export default Index;
