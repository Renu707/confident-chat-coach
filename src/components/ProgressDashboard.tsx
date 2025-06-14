
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
  Calendar
} from 'lucide-react';

interface SessionResult {
  id: string;
  scenario: string;
  score: number;
  duration: number;
  date: Date;
  improvements: string[];
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

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Your Progress Journey
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Track your conversation skills improvement and celebrate your achievements
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700 hover:bg-slate-800/80 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{totalSessions}</p>
                  <p className="text-sm text-slate-400">Practice Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700 hover:bg-slate-800/80 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{averageScore}%</p>
                  <p className="text-sm text-slate-400">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700 hover:bg-slate-800/80 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{totalMinutes}</p>
                  <p className="text-sm text-slate-400">Minutes Practiced</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700 hover:bg-slate-800/80 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">
                    {sessions.filter(s => s.score >= 80).length}
                  </p>
                  <p className="text-sm text-slate-400">Excellent Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions & Overall Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sessions */}
          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <span>Recent Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSessions.length > 0 ? (
                recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-white capitalize mb-1">
                        {session.scenario.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-slate-400">
                        {session.date.toLocaleDateString()} • {session.duration} min
                      </p>
                    </div>
                    <Badge className={`${getScoreBadgeColor(session.score)} font-medium`}>
                      {session.score}%
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <div className="p-4 bg-slate-700/30 rounded-full w-fit mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-lg font-medium mb-2">No sessions yet</p>
                  <p className="text-sm">Start your first practice session to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <span>Confidence Growth</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Overall Confidence</span>
                  <span className="text-xl font-bold text-white">{averageScore}%</span>
                </div>
                <div className="relative">
                  <Progress value={averageScore} className="h-3 bg-slate-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full opacity-80" style={{width: `${averageScore}%`}} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
                    <p className="text-2xl font-bold text-blue-400 mb-1">
                      {sessions.filter(s => s.score > (sessions[0]?.score || 0)).length}
                    </p>
                    <p className="text-xs text-blue-300/80">Improved Sessions</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                    <p className="text-2xl font-bold text-emerald-400 mb-1">
                      {Math.max(0, ...sessions.map(s => s.score))}%
                    </p>
                    <p className="text-xs text-emerald-300/80">Best Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-slate-700/50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-amber-400" />
              </div>
              <span>Personal Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors group">
                <div className="p-3 bg-blue-500/20 rounded-lg w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-3">Consistency is Key</h4>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  Regular practice sessions help build lasting confidence and natural conversation flow.
                </p>
                <div className="flex items-center text-xs text-blue-400 font-medium">
                  <span>Aim for 3 sessions per week</span>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors group">
                <div className="p-3 bg-emerald-500/20 rounded-lg w-fit mb-4 group-hover:bg-emerald-500/30 transition-colors">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-white mb-3">Level Up</h4>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  Challenge yourself with advanced scenarios to expand your comfort zone.
                </p>
                <div className="flex items-center text-xs text-emerald-400 font-medium">
                  <span>Try harder difficulty levels</span>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
                <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
                  <ArrowRight className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-3">Real World Application</h4>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  Apply your practiced skills in everyday conversations and social situations.
                </p>
                <div className="flex items-center text-xs text-purple-400 font-medium">
                  <span>Practice makes permanent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center py-8">
          <Button 
            size="lg" 
            onClick={onStartNewSession}
            className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-900/20 transition-all duration-300 hover:scale-105 text-white border-0"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Start New Practice Session
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
