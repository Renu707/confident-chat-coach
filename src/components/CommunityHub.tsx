
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Star, 
  Trophy,
  Calendar,
  Shield,
  ThumbsUp,
  Send,
  UserPlus
} from 'lucide-react';

interface CommunityHubProps {
  onBack: () => void;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ onBack }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');

  const successStories = [
    {
      author: "Sarah M.",
      story: "Six months ago, I couldn't order coffee without panic. Yesterday, I gave a presentation to 50 people! 🎉",
      likes: 847,
      responses: 23,
      badge: "Confidence Champion"
    },
    {
      author: "Alex K.", 
      story: "My stutter used to define me. Now I see it as part of my unique voice. Therapy + this app changed everything! 💪",
      likes: 1024,
      responses: 67,
      badge: "Fluency Fighter"
    },
    {
      author: "Jordan T.",
      story: "Overthinking paralyzed me in conversations. Learning to trust my first instincts has been life-changing! ✨",
      likes: 532,
      responses: 31,
      badge: "Mindful Communicator"
    }
  ];

  const todaysChallenges = [
    {
      challenge: "Say 'good morning' to one person today",
      participants: 1247,
      completed: 892,
      difficulty: "Gentle Start"
    },
    {
      challenge: "Share one thing you're grateful for",
      participants: 834,
      completed: 567,
      difficulty: "Heart Opening"
    },
    {
      challenge: "Ask someone how their day is going",
      participants: 623,
      completed: 341,
      difficulty: "Connection Builder"
    }
  ];

  const mentorSpotlight = [
    {
      name: "Dr. Maria Rodriguez",
      role: "Speech-Language Pathologist",
      specialty: "Stuttering & Fluency",
      experience: "15+ years",
      quote: "Every voice deserves to be heard. Your journey is valid, no matter how long it takes.",
      availableToday: true
    },
    {
      name: "Jamie Chen",
      role: "Anxiety Coach & Peer Mentor",
      specialty: "Social Anxiety",
      experience: "8+ years",
      quote: "I've been where you are. The fear gets smaller, but you get braver.",
      availableToday: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
      {/* Navigation */}
      <nav className="bg-indigo-900/90 backdrop-blur-sm border-b border-indigo-800 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-indigo-300 hover:bg-indigo-800 hover:text-white"
            >
              ← Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Community Hub</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-900/30 text-green-300 border-green-700">
              <Shield className="w-3 h-3 mr-1" />
              Safe Space
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Message */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Welcome to Our Community! 🤗</h2>
          <p className="text-xl text-indigo-300 max-w-3xl mx-auto">
            A judgment-free zone where everyone's communication journey is celebrated. 
            Share your wins, find support during struggles, and grow together! 💕
          </p>
        </div>

        {/* Today's Community Challenges */}
        <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-700/50">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Today's Gentle Challenges ✨
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {todaysChallenges.map((challenge, index) => (
                <div key={index} className="p-4 bg-purple-900/30 rounded-lg border border-purple-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-600 text-white text-xs">{challenge.difficulty}</Badge>
                    <span className="text-xs text-purple-300">{challenge.participants} joined</span>
                  </div>
                  <p className="text-purple-200 mb-3 font-medium">{challenge.challenge}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">{challenge.completed} completed</span>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Join Challenge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Stories */}
        <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700/50">
          <CardHeader>
            <CardTitle className="text-green-300 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Today's Inspiring Stories 🌟
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {successStories.map((story, index) => (
              <div key={index} className="p-4 bg-green-900/30 rounded-lg border border-green-800/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                      {story.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-green-200">{story.author}</p>
                      <Badge className="bg-green-800/50 text-green-300 text-xs">{story.badge}</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-green-200 mb-3 leading-relaxed">{story.story}</p>
                <div className="flex items-center space-x-4 text-sm text-green-400">
                  <button className="flex items-center space-x-1 hover:text-green-300">
                    <Heart className="w-4 h-4" />
                    <span>{story.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-green-300">
                    <MessageCircle className="w-4 h-4" />
                    <span>{story.responses}</span>
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mentor Spotlight */}
        <Card className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-700/50">
          <CardHeader>
            <CardTitle className="text-blue-300 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Mentor Spotlight 👨‍⚕️👩‍⚕️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentorSpotlight.map((mentor, index) => (
                <div key={index} className="p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-blue-200">{mentor.name}</h3>
                      <p className="text-sm text-blue-300">{mentor.role}</p>
                    </div>
                    {mentor.availableToday && (
                      <Badge className="bg-green-600 text-white">Available Today</Badge>
                    )}
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-blue-400">
                      <strong>Specialty:</strong> {mentor.specialty}
                    </p>
                    <p className="text-xs text-blue-400">
                      <strong>Experience:</strong> {mentor.experience}
                    </p>
                  </div>
                  <blockquote className="text-blue-200 italic text-sm mb-4 border-l-2 border-blue-600 pl-3">
                    "{mentor.quote}"
                  </blockquote>
                  <Button 
                    className={`w-full ${mentor.availableToday ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                    disabled={!mentor.availableToday}
                  >
                    {mentor.availableToday ? 'Chat Now' : 'Message'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Chat Preview */}
        <Card className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border-pink-700/50">
          <CardHeader>
            <CardTitle className="text-pink-300 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Community Chat 💬
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-pink-900/30 rounded-lg p-3 space-y-3 max-h-64 overflow-y-auto">
              {[
                { user: "Emma", message: "Just completed my first phone call without panic! 🎉", time: "2 min ago" },
                { user: "Coach Lisa", message: "That's incredible Emma! What helped you feel most prepared?", time: "1 min ago" },
                { user: "David", message: "Way to go Emma! Phone calls used to terrify me too", time: "30s ago" }
              ].map((chat, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {chat.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-pink-200 text-sm">{chat.user}</span>
                      <span className="text-xs text-pink-400">{chat.time}</span>
                    </div>
                    <p className="text-pink-200 text-sm">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input 
                placeholder="Share your thoughts or encouragement..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-pink-900/30 border-pink-700 text-pink-200 placeholder:text-pink-400"
              />
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines Reminder */}
        <Card className="bg-gradient-to-r from-emerald-900/40 to-green-900/40 border-emerald-700/50">
          <CardHeader>
            <CardTitle className="text-emerald-300 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Our Community Promise 💚
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "🚫 Zero judgment zone",
                "💕 Celebrate all progress", 
                "🤝 Support over advice",
                "🔒 Respect privacy always"
              ].map((rule, index) => (
                <div key={index} className="p-3 bg-emerald-900/30 rounded-lg text-center">
                  <p className="text-emerald-200 font-medium">{rule}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityHub;
