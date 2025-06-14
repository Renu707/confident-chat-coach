
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ScenarioSelector from '@/components/ScenarioSelector';
import ConversationCoach from '@/components/ConversationCoach';
import ProgressDashboard from '@/components/ProgressDashboard';
import AudioSupport from '@/components/AudioSupport';
import { 
  MessageCircle, 
  BarChart3, 
  Brain, 
  Shield, 
  Users,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle,
  Eye,
  EyeOff,
  Headphones
} from 'lucide-react';

type AppState = 'welcome' | 'scenarios' | 'coaching' | 'progress' | 'audio-support';

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
  const [isPrivateMode, setIsPrivateMode] = useState(false);

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
      duration: Math.floor(Math.random() * 15) + 10,
      date: new Date(),
      improvements: ['Active listening', 'Confidence building']
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentState('progress');
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,rgba(0,0,0,0.8),rgba(0,0,0,0.3))] -z-10"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
          <div className="w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
          <div className="w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          {/* Privacy Toggle */}
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPrivateMode(!isPrivateMode)}
              className="bg-slate-800/80 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              {isPrivateMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPrivateMode ? 'Private' : 'Standard'}
            </Button>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="mb-8">
              <div className="inline-flex p-4 bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg mb-8 border border-slate-600">
                <MessageCircle className="w-16 h-16 text-blue-400" />
              </div>
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                Master Social Skills with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 block mt-2">
                  AI-Powered Practice
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Build confidence in a safe, judgment-free environment. Our AI coach adapts to your pace, 
                providing personalized feedback to help you overcome social anxiety and develop natural conversation skills.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={() => setCurrentState('scenarios')}
                className="px-10 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-900/20 transition-all duration-300 hover:scale-105 text-white"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Start Your Journey
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentState('audio-support')}
                className="px-10 py-6 text-lg font-semibold border-2 border-slate-600 hover:border-green-400 hover:bg-green-950/50 transition-all duration-300 text-slate-200 hover:text-white"
              >
                <Headphones className="w-6 h-6 mr-2" />
                Audio Support
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentState('emotional-support')}
                className="px-10 py-6 text-lg font-semibold border-2 border-slate-600 hover:border-pink-400 hover:bg-pink-950/50 transition-all duration-300 text-slate-200 hover:text-white"
              >
                <Heart className="w-6 h-6 mr-2" />
                Emotional Support
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentState('community')}
                className="px-10 py-6 text-lg font-semibold border-2 border-slate-600 hover:border-purple-400 hover:bg-purple-950/50 transition-all duration-300 text-slate-200 hover:text-white"
              >
                <Users className="w-6 h-6 mr-2" />
                Community
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentState('progress')}
                className="px-10 py-6 text-lg font-semibold border-2 border-slate-600 hover:border-blue-400 hover:bg-blue-950/50 transition-all duration-300 text-slate-200 hover:text-white"
              >
                <BarChart3 className="w-6 h-6 mr-2" />
                View Progress
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-8 text-slate-400 mb-8">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-300">4.9/5 from 2,000+ users</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-slate-300">Completely Private & Safe</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                icon: Brain,
                title: "AI-Powered Coaching",
                description: "Advanced AI provides personalized feedback and adapts to your unique learning style",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Shield,
                title: "100% Private & Safe",
                description: "Practice without judgment in a completely secure and supportive environment",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Users,
                title: "Real-World Scenarios",
                description: "Practice workplace, social, dating, and networking conversations that matter",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: BarChart3,
                title: "Track Your Growth",
                description: "Monitor confidence improvements and celebrate your communication milestones",
                color: "from-orange-500 to-orange-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="group p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-slate-800/60 backdrop-blur-sm border border-slate-600 hover:border-slate-500">
                <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-slate-600 mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: "1",
                  title: "Choose Your Scenario",
                  description: "Select from workplace, social, dating, or networking conversations tailored to your goals"
                },
                {
                  step: "2", 
                  title: "Practice with AI",
                  description: "Engage in natural conversations with our supportive AI coach that adapts to your comfort level"
                },
                {
                  step: "3",
                  title: "Build Confidence",
                  description: "Receive personalized feedback and track your progress as you develop stronger social skills"
                }
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 z-0"></div>
                  )}
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-xl mb-4 text-white">{item.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center p-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Social Confidence?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands who have overcome social anxiety and built lasting confidence through personalized practice
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setCurrentState('scenarios')}
                className="px-12 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-slate-100 shadow-xl hover:scale-105 transition-all duration-300"
              >
                Start Your First Session
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </div>
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
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
      case 'audio-support':
        return <AudioSupport onBack={() => setCurrentState('welcome')} />;
      case 'emotional-support':
        return <EmotionalSupport onBack={() => setCurrentState('welcome')} />;
      case 'community':
        return <CommunityHub onBack={() => setCurrentState('welcome')} />;
      default:
        return renderWelcomeScreen();
    }
  };

  // Navigation bar for non-welcome screens
  if (currentState !== 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">ConversationAI Coach</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentState('scenarios')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${currentState === 'scenarios' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
              >
                Practice
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentState('audio-support')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${currentState === 'audio-support' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
              >
                <Headphones className="w-4 h-4 mr-2" />
                Audio Support
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentState('emotional-support')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${currentState === 'emotional-support' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
              >
                <Heart className="w-4 h-4 mr-2" />
                Support
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentState('community')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${currentState === 'community' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
              >
                <Users className="w-4 h-4 mr-2" />
                Community
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentState('progress')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${currentState === 'progress' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
              >
                Progress
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentState('welcome')}
                className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
              >
                Home
              </Button>
              {/* Privacy indicator */}
              {isPrivateMode && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-900/30 rounded-full border border-green-700">
                  <EyeOff className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Private</span>
                </div>
              )}
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
