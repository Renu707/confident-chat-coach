
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Progress Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your conversation skills improvement over time
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
                <p className="text-sm text-muted-foreground">Practice Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalMinutes}</p>
                <p className="text-sm text-muted-foreground">Minutes Practiced</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {sessions.filter(s => s.score >= 80).length}
                </p>
                <p className="text-sm text-muted-foreground">Great Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions & Overall Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Recent Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm capitalize">
                      {session.scenario.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.date.toLocaleDateString()} • {session.duration} min
                    </p>
                  </div>
                  <Badge className={getScoreBadgeColor(session.score)}>
                    {session.score}%
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No sessions yet</p>
                <p className="text-sm">Start your first practice session!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Confidence Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Confidence</span>
                <span className="text-sm font-medium">{averageScore}%</span>
              </div>
              <Progress value={averageScore} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-confidence-50 rounded-lg">
                  <p className="text-lg font-bold text-confidence-700">
                    {sessions.filter(s => s.score > (sessions[0]?.score || 0)).length}
                  </p>
                  <p className="text-xs text-confidence-600">Improved Sessions</p>
                </div>
                <div className="text-center p-3 bg-coach-50 rounded-lg">
                  <p className="text-lg font-bold text-coach-700">
                    {Math.max(0, ...sessions.map(s => s.score))}%
                  </p>
                  <p className="text-xs text-coach-600">Best Score</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Keep Practicing</h4>
              <p className="text-sm text-blue-700 mb-3">
                Regular practice sessions help build lasting confidence.
              </p>
              <div className="flex items-center text-xs text-blue-600">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Try to practice 3x per week</span>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Challenge Yourself</h4>
              <p className="text-sm text-green-700 mb-3">
                Try more advanced scenarios to expand your skills.
              </p>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>Progress to harder levels</span>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">Apply Skills</h4>
              <p className="text-sm text-purple-700 mb-3">
                Use your practice in real-world conversations.
              </p>
              <div className="flex items-center text-xs text-purple-600">
                <ArrowRight className="w-3 h-3 mr-1" />
                <span>Practice outside the app</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={onStartNewSession}
          className="px-8 py-3 text-base"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Start New Practice Session
        </Button>
      </div>
    </div>
  );
};

export default ProgressDashboard;
