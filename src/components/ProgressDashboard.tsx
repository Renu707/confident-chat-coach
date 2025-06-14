
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  MessageCircle,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Calendar,
  Flame,
  Star,
  Trophy,
  Zap,
  Target,
  Crown,
  Shield,
  Sparkles,
  Medal
} from 'lucide-react';

interface SessionResult {
  id: string;
  scenario: string;
  score: number;
  duration: number;
  date: Date;
  improvements: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  progress?: number;
  target?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProgressDashboardProps {
  sessions: SessionResult[];
  onStartNewSession: () => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  sessions, 
  onStartNewSession 
}) => {
  const totalSessions = sessions.length;
  const averageScore = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length)
    : 0;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const recentSessions = sessions.slice(-5).reverse();

  // Gamification calculations
  const totalXP = sessions.reduce((sum, session) => sum + Math.floor(session.score * 10), 0);
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const xpToNextLevel = 1000 - (totalXP % 1000);
  const levelProgress = ((totalXP % 1000) / 1000) * 100;

  // Streak calculation
  const calculateStreak = () => {
    if (sessions.length === 0) return 0;
    const sortedSessions = [...sessions].sort((a, b) => b.date.getTime() - a.date.getTime());
    let streak = 0;
    let currentDate = new Date();
    
    for (let session of sortedSessions) {
      const sessionDate = new Date(session.date);
      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Achievement system
  const achievements: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete your first practice session',
      icon: Star,
      unlocked: totalSessions >= 1,
      rarity: 'common'
    },
    {
      id: 'consistent-learner',
      title: 'Consistent Learner',
      description: 'Maintain a 3-day streak',
      icon: Flame,
      unlocked: currentStreak >= 3,
      progress: Math.min(currentStreak, 3),
      target: 3,
      rarity: 'rare'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Score 100% in a session',
      icon: Trophy,
      unlocked: sessions.some(s => s.score >= 100),
      rarity: 'epic'
    },
    {
      id: 'marathon-talker',
      title: 'Marathon Talker',
      description: 'Practice for 100+ minutes total',
      icon: Clock,
      unlocked: totalMinutes >= 100,
      progress: Math.min(totalMinutes, 100),
      target: 100,
      rarity: 'rare'
    },
    {
      id: 'confidence-master',
      title: 'Confidence Master',
      description: 'Achieve 90%+ average score',
      icon: Crown,
      unlocked: averageScore >= 90,
      rarity: 'legendary'
    },
    {
      id: 'dedicated-student',
      title: 'Dedicated Student',
      description: 'Complete 10 practice sessions',
      icon: Shield,
      unlocked: totalSessions >= 10,
      progress: Math.min(totalSessions, 10),
      target: 10,
      rarity: 'epic'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-yellow-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (score >= 60) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header with Level */}
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-white">Level {currentLevel}</h2>
              <p className="text-yellow-400 font-medium">{totalXP} XP • {xpToNextLevel} XP to next level</p>
            </div>
          </div>
          <div className="max-w-md mx-auto mb-6">
            <Progress value={levelProgress} className="h-3 bg-slate-700" />
            <div className="flex justify-between text-sm text-slate-400 mt-1">
              <span>Level {currentLevel}</span>
              <span>Level {currentLevel + 1}</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Your Progress Journey
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Level up your conversation skills and unlock achievements
          </p>
        </div>

        {/* Gamified Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Level Card */}
          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-400">{currentLevel}</p>
                  <p className="text-sm text-yellow-300/80">Current Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XP Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400">{totalXP}</p>
                  <p className="text-sm text-purple-300/80">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-400">{currentStreak}</p>
                  <p className="text-sm text-orange-300/80">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions Card */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">{totalSessions}</p>
                  <p className="text-sm text-blue-300/80">Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-400">{unlockedAchievements.length}</p>
                  <p className="text-sm text-emerald-300/80">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Unlocked Achievements */}
          <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span>Unlocked Achievements</span>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  {unlockedAchievements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unlockedAchievements.length > 0 ? (
                unlockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 group">
                    <div className={`p-3 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-lg group-hover:scale-110 transition-transform`}>
                      <achievement.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-yellow-300 transition-colors">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-slate-400">{achievement.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getRarityColor(achievement.rarity).replace('from-', 'bg-').replace('to-', '').split(' ')[0]}/20 text-white border-0 capitalize`}>
                        {achievement.rarity}
                      </Badge>
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                  <p>Complete your first session to unlock achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Towards Achievements */}
          <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span>In Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lockedAchievements.filter(a => a.progress !== undefined).map((achievement) => (
                <div key={achievement.id} className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)} opacity-60 rounded-lg`}>
                      <achievement.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-300">{achievement.title}</h4>
                      <p className="text-xs text-slate-500">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>{achievement.progress}/{achievement.target}</span>
                      <span>{Math.round((achievement.progress! / achievement.target!) * 100)}%</span>
                    </div>
                    <Progress value={(achievement.progress! / achievement.target!) * 100} className="h-2 bg-slate-700" />
                  </div>
                </div>
              ))}
              {lockedAchievements.filter(a => a.progress === undefined).slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 opacity-60">
                  <div className={`p-3 bg-gradient-to-r ${getRarityColor(achievement.rarity)} opacity-60 rounded-lg`}>
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-400">{achievement.title}</h4>
                    <p className="text-sm text-slate-500">{achievement.description}</p>
                  </div>
                  <Badge className="bg-slate-600/50 text-slate-400 border-slate-500/30 capitalize">
                    {achievement.rarity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span>Recent Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white capitalize mb-1">
                        {session.scenario.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-slate-400">
                        {session.date.toLocaleDateString()} • {session.duration} min • +{Math.floor(session.score * 10)} XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getScoreBadgeColor(session.score)} font-medium`}>
                      {session.score}%
                    </Badge>
                    {session.score >= 90 && <Medal className="w-4 h-4 text-yellow-400" />}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <div className="p-4 bg-slate-700/30 rounded-full w-fit mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-lg font-medium mb-2">No sessions yet</p>
                <p className="text-sm">Start your first practice session to begin earning XP and achievements!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center py-8">
          <Button 
            size="lg" 
            onClick={onStartNewSession}
            className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl shadow-blue-900/20 transition-all duration-300 hover:scale-105 text-white border-0 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Sparkles className="w-6 h-6 mr-3 relative z-10" />
            <span className="relative z-10">Start New Practice Session</span>
            <ArrowRight className="w-6 h-6 ml-3 relative z-10" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
