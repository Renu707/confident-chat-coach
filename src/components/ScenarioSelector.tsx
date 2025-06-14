
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
  TrendingUp,
  ShoppingCart,
  Coffee,
  Plane,
  UserPlus,
  Phone,
  MessageSquare,
  Store,
  Car,
  Stethoscope,
  Building2,
  Train,
  Sparkles
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
  motivationalQuote: string;
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
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "💼 'Every expert was once a beginner. Start small, dream big!' ✨"
  },
  {
    id: 'casual-social-event',
    title: 'Social Events',
    description: 'Navigate conversations at parties, gatherings, and social meetups with confidence.',
    icon: <Users className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '15-20 min',
    skills: ['Group dynamics', 'Finding common ground', 'Humor'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🎉 'You belong in every room you enter. Your voice matters!' 🌟"
  },
  {
    id: 'professional-networking',
    title: 'Professional Networking',
    description: 'Master the art of networking at conferences, industry events, and business meetups.',
    icon: <HandHeart className="w-6 h-6" />,
    difficulty: 'advanced',
    duration: '20-25 min',
    skills: ['Elevator pitch', 'Value proposition', 'Follow-up'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🤝 'Networking is not about using people, it's about helping them!' 💫"
  },
  {
    id: 'interview-preparation',
    title: 'Interview Skills',
    description: 'Build confidence for job interviews with practice questions and professional communication.',
    icon: <GraduationCap className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '25-30 min',
    skills: ['Professional presence', 'Storytelling', 'Confidence'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🎯 'You are more prepared than you think. Trust yourself!' 💪"
  },
  {
    id: 'dating-conversation',
    title: 'Dating & Romance',
    description: 'Practice meaningful conversations for dating apps, first dates, and romantic relationships.',
    icon: <Heart className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '15-20 min',
    skills: ['Authenticity', 'Emotional connection', 'Flirting'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "💕 'Love starts with self-confidence. You are worth knowing!' 🌹"
  },
  {
    id: 'grocery-store-interactions',
    title: 'Grocery Store & Shopping',
    description: 'Practice asking for help, making small talk with cashiers, and navigating crowded stores.',
    icon: <ShoppingCart className="w-6 h-6" />,
    difficulty: 'beginner',
    duration: '10-15 min',
    skills: ['Asking for help', 'Polite requests', 'Quick conversations'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🛒 'Small conversations lead to big confidence! You've got this!' 😊"
  },
  {
    id: 'coffee-shop-ordering',
    title: 'Coffee Shop & Restaurants',
    description: 'Build confidence ordering food, chatting with baristas, and making conversation while waiting.',
    icon: <Coffee className="w-6 h-6" />,
    difficulty: 'beginner',
    duration: '8-12 min',
    skills: ['Ordering confidently', 'Pleasant small talk', 'Patience'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "☕ 'Every barista loves a friendly customer. Spread those good vibes!' ✨"
  },
  {
    id: 'public-transportation',
    title: 'Public Transportation',
    description: 'Navigate conversations on buses, trains, and asking for directions from strangers.',
    icon: <Train className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '12-18 min',
    skills: ['Asking directions', 'Brief encounters', 'Being helpful'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🚌 'Strangers are just friends you haven't met yet! Take the first step!' 🌈"
  },
  {
    id: 'airport-travel',
    title: 'Airport & Travel Situations',
    description: 'Practice conversations while traveling, asking airport staff for help, and chatting with fellow travelers.',
    icon: <Plane className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '15-20 min',
    skills: ['Travel communication', 'Stress management', 'Cultural awareness'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "✈️ 'Adventure begins when you step out of your comfort zone!' 🌍"
  },
  {
    id: 'making-new-friends',
    title: 'Making New Friends',
    description: 'Learn to approach potential friends at the gym, park, or community events.',
    icon: <UserPlus className="w-6 h-6" />,
    difficulty: 'advanced',
    duration: '20-25 min',
    skills: ['Initiating friendship', 'Finding common interests', 'Being genuine'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "👫 'Friendship is the only cement that will ever hold the world together!' 💖"
  },
  {
    id: 'phone-calls',
    title: 'Phone Conversations',
    description: 'Overcome phone anxiety with practice calls to businesses, friends, and professional contacts.',
    icon: <Phone className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '15-20 min',
    skills: ['Phone etiquette', 'Clear communication', 'Confidence building'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "📞 'Your voice has power! Let it be heard with confidence!' 🔊"
  },
  {
    id: 'complaining-resolving',
    title: 'Complaints & Problem Solving',
    description: 'Learn to address issues politely but firmly with customer service and resolve conflicts.',
    icon: <MessageSquare className="w-6 h-6" />,
    difficulty: 'advanced',
    duration: '18-25 min',
    skills: ['Assertiveness', 'Problem solving', 'Staying calm'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🗣️ 'Standing up for yourself is not rude, it's necessary! You deserve respect!' 💪"
  },
  {
    id: 'retail-interactions',
    title: 'Retail & Customer Service',
    description: 'Practice interactions when returning items, asking for help in stores, and dealing with sales people.',
    icon: <Store className="w-6 h-6" />,
    difficulty: 'beginner',
    duration: '12-18 min',
    skills: ['Customer interactions', 'Polite persistence', 'Getting help'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🏪 'Retail workers are people too! A smile goes a long way!' 😊"
  },
  {
    id: 'car-service-mechanics',
    title: 'Car Service & Mechanics',
    description: 'Build confidence discussing car problems, understanding quotes, and asking questions.',
    icon: <Car className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '15-20 min',
    skills: ['Technical discussions', 'Asking questions', 'Negotiation'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🚗 'Knowledge is power! Don't be afraid to ask questions!' 🔧"
  },
  {
    id: 'medical-appointments',
    title: 'Medical Appointments',
    description: 'Practice communicating with doctors, describing symptoms, and asking important health questions.',
    icon: <Stethoscope className="w-6 h-6" />,
    difficulty: 'intermediate',
    duration: '18-25 min',
    skills: ['Health communication', 'Describing symptoms', 'Advocacy'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🏥 'Your health matters! Speak up and advocate for yourself!' 💙"
  },
  {
    id: 'government-offices',
    title: 'Government Offices & Bureaucracy',
    description: 'Navigate conversations at DMV, post office, and other government agencies with confidence.',
    icon: <Building2 className="w-6 h-6" />,
    difficulty: 'advanced',
    duration: '20-25 min',
    skills: ['Bureaucratic navigation', 'Patience', 'Preparation'],
    color: 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600',
    motivationalQuote: "🏛️ 'Patience and preparation will get you through any red tape!' 📋"
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-900/50 text-green-200 border-green-700';
    case 'intermediate':
      return 'bg-yellow-900/50 text-yellow-200 border-yellow-700';
    case 'advanced':
      return 'bg-red-900/50 text-red-200 border-red-700';
    default:
      return 'bg-gray-900/50 text-gray-200 border-gray-700';
  }
};

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ onSelectScenario }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="inline-flex p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-100 mb-4">
          Choose Your Confidence-Building Adventure! 🚀
        </h1>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-6">
          Every conversation is a chance to grow stronger! Select a scenario that challenges you - 
          remember, courage isn't the absence of fear, it's feeling the fear and doing it anyway! 💪✨
        </p>
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-4 border border-green-700/50 max-w-2xl mx-auto">
          <p className="text-green-200 text-sm font-medium">
            🌟 "The magic happens outside your comfort zone. You're braver than you believe!" 🌟
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${scenario.color} backdrop-blur-sm transform hover:scale-105`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg border border-blue-500">
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
              
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-400">Skills you'll master:</p>
                <div className="flex flex-wrap gap-1">
                  {scenario.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-3 border border-blue-800/30">
                <p className="text-xs text-blue-200 font-medium text-center leading-relaxed">
                  {scenario.motivationalQuote}
                </p>
              </div>
              
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" 
                onClick={() => onSelectScenario(scenario.id, scenario.difficulty)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Start Building Confidence! 🌟
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 text-center p-8 bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-2xl border border-slate-600/50 backdrop-blur-sm">
        <h3 className="font-bold text-2xl text-slate-100 mb-4">
          🎯 Ready to Transform Your Social Life? 🎯
        </h3>
        <p className="text-slate-300 mb-6 max-w-3xl mx-auto text-lg leading-relaxed">
          Remember: Every person you admire for their social skills started exactly where you are now. 
          The only difference? They practiced! Your future confident self is cheering you on! 📣✨
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-green-900/30 rounded-xl p-6 border border-green-700/50">
            <div className="text-3xl mb-3">🌱</div>
            <h4 className="font-semibold text-green-200 mb-2">Beginners Start Here!</h4>
            <p className="text-green-200/80 text-sm">Every expert was once a beginner. Take that first brave step!</p>
          </div>
          
          <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-700/50">
            <div className="text-3xl mb-3">🎪</div>
            <h4 className="font-semibold text-blue-200 mb-2">Safe Practice Space</h4>
            <p className="text-blue-200/80 text-sm">No judgment, just growth. Make mistakes and learn freely!</p>
          </div>
          
          <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-700/50">
            <div className="text-3xl mb-3">🏆</div>
            <h4 className="font-semibold text-purple-200 mb-2">Celebrate Progress</h4>
            <p className="text-purple-200/80 text-sm">Every conversation is a victory. You're already winning!</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl border border-yellow-800/30">
          <p className="text-yellow-200 font-semibold text-lg">
            💡 "You are one conversation away from changing your life!" 💡
          </p>
          <p className="text-yellow-200/80 text-sm mt-2">
            Choose any scenario that scares you a little - that's where the magic happens! 🪄
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelector;
