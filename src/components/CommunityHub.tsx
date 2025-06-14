import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MentorChat from './MentorChat';
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
  UserPlus,
  CheckCircle,
  Clock,
  TrendingUp,
  HelpCircle,
  Plus,
  Camera,
  Share2,
  Reply,
  MoreHorizontal
} from 'lucide-react';

interface CommunityHubProps {
  onBack: () => void;
}

interface Challenge {
  id: string;
  challenge: string;
  participants: number;
  completed: number;
  difficulty: string;
  userJoined: boolean;
  userCompleted: boolean;
}

interface Story {
  id: string;
  author: string;
  story: string;
  likes: number;
  responses: number;
  badge: string;
  userLiked: boolean;
  timeAgo: string;
}

interface CommunityPost {
  id: string;
  author: string;
  type: 'question' | 'update' | 'celebration' | 'support';
  title?: string;
  content: string;
  timeAgo: string;
  likes: number;
  replies: number;
  userLiked: boolean;
  isUser?: boolean;
  tags?: string[];
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  time: string;
  isUser?: boolean;
  replyTo?: string;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [postType, setPostType] = useState<'question' | 'update' | 'celebration' | 'support'>('question');
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('feed');
  
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "morning-greeting",
      challenge: "Say 'good morning' to one person today",
      participants: 1247,
      completed: 892,
      difficulty: "Gentle Start",
      userJoined: false,
      userCompleted: false
    },
    {
      id: "gratitude-share",
      challenge: "Share one thing you're grateful for",
      participants: 834,
      completed: 567,
      difficulty: "Heart Opening",
      userJoined: false,
      userCompleted: false
    },
    {
      id: "ask-about-day",
      challenge: "Ask someone how their day is going",
      participants: 623,
      completed: 341,
      difficulty: "Connection Builder",
      userJoined: false,
      userCompleted: false
    }
  ]);

  const [stories, setStories] = useState<Story[]>([
    {
      id: "story-1",
      author: "Sarah M.",
      story: "Six months ago, I couldn't order coffee without panic. Yesterday, I gave a presentation to 50 people! 🎉",
      likes: 847,
      responses: 23,
      badge: "Confidence Champion",
      userLiked: false,
      timeAgo: "2 hours ago"
    },
    {
      id: "story-2",
      author: "Alex K.", 
      story: "My stutter used to define me. Now I see it as part of my unique voice. Therapy + this app changed everything! 💪",
      likes: 1024,
      responses: 67,
      badge: "Fluency Fighter",
      userLiked: false,
      timeAgo: "4 hours ago"
    },
    {
      id: "story-3",
      author: "Jordan T.",
      story: "Overthinking paralyzed me in conversations. Learning to trust my first instincts has been life-changing! ✨",
      likes: 532,
      responses: 31,
      badge: "Mindful Communicator",
      userLiked: false,
      timeAgo: "6 hours ago"
    }
  ]);

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: "post-1",
      author: "Maya R.",
      type: "question",
      title: "How do you handle phone anxiety?",
      content: "I've been working on my phone anxiety for months but still get nervous before important calls. What strategies have worked for you?",
      timeAgo: "1 hour ago",
      likes: 23,
      replies: 8,
      userLiked: false,
      tags: ["phone-anxiety", "tips", "help"]
    },
    {
      id: "post-2",
      author: "David L.",
      type: "celebration",
      title: "First job interview in 2 years!",
      content: "Just finished my first job interview since starting my communication journey. I was nervous but I spoke clearly and felt confident! 🎉",
      timeAgo: "3 hours ago",
      likes: 156,
      replies: 24,
      userLiked: false,
      tags: ["milestone", "interview", "confidence"]
    },
    {
      id: "post-3",
      author: "Sam K.",
      type: "support",
      title: "Having a rough day",
      content: "Today was really hard. Had a stuttering episode during a presentation and feeling discouraged. Could use some encouragement.",
      timeAgo: "5 hours ago",
      likes: 89,
      replies: 31,
      userLiked: false,
      tags: ["support", "difficult-day", "stuttering"]
    },
    {
      id: "post-4",
      author: "Emma T.",
      type: "update",
      content: "Week 3 of daily practice complete! Small wins: ordered coffee without writing it down, asked for directions, called to make a dentist appointment. Progress feels good! 💪",
      timeAgo: "8 hours ago",
      likes: 67,
      replies: 12,
      userLiked: false,
      tags: ["progress", "practice", "daily-wins"]
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", user: "Emma", message: "Just completed my first phone call without panic! 🎉", time: "2 min ago" },
    { id: "2", user: "Coach Lisa", message: "That's incredible Emma! What helped you feel most prepared?", time: "1 min ago" },
    { id: "3", user: "David", message: "Way to go Emma! Phone calls used to terrify me too", time: "30s ago" }
  ]);

  const [userStats, setUserStats] = useState({
    challengesCompleted: 0,
    weeklyProgress: 45,
    communityRank: "Emerging Voice",
    helpfulVotes: 0
  });

  const mentorSpotlight = [
    {
      name: "Dr. Maria Rodriguez",
      role: "Speech-Language Pathologist",
      specialty: "Stuttering & Fluency",
      experience: "15+ years",
      quote: "Every voice deserves to be heard. Your journey is valid, no matter how long it takes.",
      availableToday: true,
      rating: 4.9,
      responseTime: "Usually responds in 5 min"
    },
    {
      name: "Jamie Chen",
      role: "Anxiety Coach & Peer Mentor",
      specialty: "Social Anxiety",
      experience: "8+ years",
      quote: "I've been where you are. The fear gets smaller, but you get braver.",
      availableToday: false,
      rating: 4.8,
      responseTime: "Usually responds in 2 hours"
    }
  ];

  const joinChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              userJoined: true,
              participants: challenge.participants + (challenge.userJoined ? 0 : 1)
            }
          : challenge
      )
    );
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              userCompleted: true,
              completed: challenge.completed + (challenge.userCompleted ? 0 : 1)
            }
          : challenge
      )
    );
    
    setUserStats(prev => ({
      ...prev,
      challengesCompleted: prev.challengesCompleted + 1,
      weeklyProgress: Math.min(prev.weeklyProgress + 15, 100)
    }));
  };

  const likeStory = (storyId: string) => {
    setStories(prev => 
      prev.map(story => 
        story.id === storyId 
          ? { 
              ...story, 
              userLiked: !story.userLiked,
              likes: story.userLiked ? story.likes - 1 : story.likes + 1
            }
          : story
      )
    );
  };

  const likePost = (postId: string) => {
    setCommunityPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              userLiked: !post.userLiked,
              likes: post.userLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const createPost = () => {
    if (newPostContent.trim()) {
      const newPost: CommunityPost = {
        id: Date.now().toString(),
        author: "You",
        type: postType,
        title: newPostTitle.trim() || undefined,
        content: newPostContent,
        timeAgo: "now",
        likes: 0,
        replies: 0,
        userLiked: false,
        isUser: true,
        tags: []
      };
      
      setCommunityPosts(prev => [newPost, ...prev]);
      setNewPostContent('');
      setNewPostTitle('');
      
      // Simulate community engagement
      setTimeout(() => {
        const encouragingResponses = [
          "Thank you for sharing! 💕",
          "You're so brave for posting this! 🌟",
          "We're here to support you! 🤗",
          "This really resonates with me!",
          "Sending you positive vibes! ✨"
        ];
        const randomResponse = encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
        
        setCommunityPosts(prev => 
          prev.map(post => 
            post.id === newPost.id 
              ? { ...post, replies: 1, likes: Math.floor(Math.random() * 5) + 1 }
              : post
          )
        );
      }, 3000);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        user: "You",
        message: newMessage,
        time: "now",
        isUser: true
      };
      setChatMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Simulate community response
      setTimeout(() => {
        const responses = [
          "That's wonderful! Keep up the great work! 💪",
          "You're inspiring others with your courage! ✨",
          "Thanks for sharing - it helps knowing we're not alone 🤗",
          "Your progress is amazing to see! 🌟"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          user: "Community Member",
          message: randomResponse,
          time: "now"
        }]);
      }, 2000);
    }
  };

  const openMentorChat = (mentor: any) => {
    setSelectedMentor(mentor);
  };

  const closeMentorChat = () => {
    setSelectedMentor(null);
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return <HelpCircle className="w-4 h-4" />;
      case 'celebration': return <Star className="w-4 h-4" />;
      case 'support': return <Heart className="w-4 h-4" />;
      case 'update': return <TrendingUp className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-600';
      case 'celebration': return 'bg-yellow-600';
      case 'support': return 'bg-pink-600';
      case 'update': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

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
        {/* Welcome & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-bold text-white mb-4">Welcome to Our Community! 🤗</h2>
            <p className="text-xl text-indigo-300">
              A judgment-free zone where everyone's communication journey is celebrated. 
              Share your wins, ask questions, find support, and grow together! 💕
            </p>
          </div>
          
          {/* User Stats Card */}
          <Card className="bg-gradient-to-r from-emerald-900/40 to-green-900/40 border-emerald-700/50">
            <CardHeader>
              <CardTitle className="text-emerald-300 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-emerald-200">Weekly Progress</span>
                  <span className="text-emerald-300">{userStats.weeklyProgress}%</span>
                </div>
                <Progress value={userStats.weeklyProgress} className="h-2" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-200">Challenges Completed</span>
                  <span className="text-emerald-300 font-semibold">{userStats.challengesCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">Community Rank</span>
                  <span className="text-emerald-300 font-semibold">{userStats.communityRank}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-indigo-900/60 border border-indigo-700">
            <TabsTrigger value="feed" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-indigo-300">
              <MessageCircle className="w-4 h-4 mr-2" />
              Community Feed
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-indigo-300">
              <Trophy className="w-4 h-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="stories" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-indigo-300">
              <Star className="w-4 h-4 mr-2" />
              Success Stories
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-indigo-300">
              <Users className="w-4 h-4 mr-2" />
              Live Chat
            </TabsTrigger>
          </TabsList>

          {/* Community Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {/* Create Post Section */}
            <Card className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Share with the Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  {[
                    { type: 'question', label: 'Ask Question', icon: HelpCircle },
                    { type: 'update', label: 'Share Update', icon: TrendingUp },
                    { type: 'celebration', label: 'Celebrate', icon: Star },
                    { type: 'support', label: 'Need Support', icon: Heart }
                  ].map(({ type, label, icon: Icon }) => (
                    <Button
                      key={type}
                      variant={postType === type ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPostType(type as any)}
                      className={`${postType === type ? getPostTypeColor(type) + ' text-white' : 'text-purple-300 hover:bg-purple-800'}`}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {label}
                    </Button>
                  ))}
                </div>
                
                {(postType === 'question' || postType === 'celebration') && (
                  <Input
                    placeholder="Add a title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="bg-purple-900/30 border-purple-700 text-purple-200 placeholder:text-purple-400"
                  />
                )}
                
                <Textarea
                  placeholder={
                    postType === 'question' ? "What would you like to ask the community?" :
                    postType === 'update' ? "Share your progress or what you've been working on..." :
                    postType === 'celebration' ? "What milestone or achievement would you like to celebrate?" :
                    "What kind of support do you need today?"
                  }
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="bg-purple-900/30 border-purple-700 text-purple-200 placeholder:text-purple-400 min-h-[100px]"
                />
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-800">
                      <Camera className="w-4 h-4 mr-1" />
                      Add Photo
                    </Button>
                  </div>
                  <Button 
                    onClick={createPost}
                    disabled={!newPostContent.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id} className="bg-gradient-to-r from-slate-900/40 to-slate-800/40 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${post.isUser ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} rounded-full flex items-center justify-center text-white font-bold`}>
                        {post.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-white">{post.author}</span>
                          <Badge className={`${getPostTypeColor(post.type)} text-white text-xs`}>
                            {getPostTypeIcon(post.type)}
                            <span className="ml-1 capitalize">{post.type}</span>
                          </Badge>
                          <span className="text-xs text-slate-400">{post.timeAgo}</span>
                        </div>
                        
                        {post.title && (
                          <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        )}
                        
                        <p className="text-slate-300 mb-4 leading-relaxed">{post.content}</p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs text-slate-400 border-slate-600">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-6 text-slate-400">
                          <button 
                            onClick={() => likePost(post.id)}
                            className={`flex items-center space-x-1 hover:text-red-400 transition-colors ${post.userLiked ? 'text-red-400' : ''}`}
                          >
                            <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                            <Reply className="w-4 h-4" />
                            <span>{post.replies} replies</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                          <button className="hover:text-slate-300 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Today's Gentle Challenges ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 bg-purple-900/30 rounded-lg border border-purple-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-600 text-white text-xs">{challenge.difficulty}</Badge>
                        <span className="text-xs text-purple-300">{challenge.participants} joined</span>
                      </div>
                      <p className="text-purple-200 mb-3 font-medium">{challenge.challenge}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-purple-400">
                          <span>{challenge.completed} completed</span>
                          <span>{Math.round((challenge.completed / challenge.participants) * 100)}%</span>
                        </div>
                        <Progress value={(challenge.completed / challenge.participants) * 100} className="h-1" />
                        <div className="flex space-x-2">
                          {!challenge.userJoined ? (
                            <Button 
                              size="sm" 
                              onClick={() => joinChallenge(challenge.id)}
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Join Challenge
                            </Button>
                          ) : !challenge.userCompleted ? (
                            <Button 
                              size="sm" 
                              onClick={() => completeChallenge(challenge.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mark Complete
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              disabled
                              className="flex-1 bg-gray-600 text-white"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed!
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Success Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700/50">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Community Success Stories 🌟
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stories.map((story) => (
                  <div key={story.id} className="p-4 bg-green-900/30 rounded-lg border border-green-800/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          {story.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-green-200">{story.author}</p>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-800/50 text-green-300 text-xs">{story.badge}</Badge>
                            <span className="text-xs text-green-400">{story.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-green-200 mb-3 leading-relaxed">{story.story}</p>
                    <div className="flex items-center space-x-4 text-sm text-green-400">
                      <button 
                        onClick={() => likeStory(story.id)}
                        className={`flex items-center space-x-1 hover:text-green-300 transition-colors ${story.userLiked ? 'text-red-400' : ''}`}
                      >
                        <Heart className={`w-4 h-4 ${story.userLiked ? 'fill-current' : ''}`} />
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
          </TabsContent>

          {/* Live Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mentor Spotlight */}
              <Card className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-700/50">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Mentor Spotlight 👨‍⚕️👩‍⚕️
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mentorSpotlight.map((mentor, index) => (
                    <div key={index} className="p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {mentor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-bold text-blue-200">{mentor.name}</h3>
                            <p className="text-sm text-blue-300">{mentor.role}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-blue-400">{mentor.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-blue-400" />
                                <span className="text-xs text-blue-400">{mentor.responseTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {mentor.availableToday && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <Badge className="bg-green-600 text-white text-xs">Available Now</Badge>
                          </div>
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
                      <div className="flex space-x-2">
                        {mentor.availableToday ? (
                          <Button 
                            onClick={() => openMentorChat(mentor)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat Now
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => openMentorChat(mentor)}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Community Chat */}
              <Card className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border-pink-700/50">
                <CardHeader>
                  <CardTitle className="text-pink-300 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Live Community Chat 💬
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-pink-900/30 rounded-lg p-3 space-y-3 max-h-64 overflow-y-auto">
                    {chatMessages.map((chat) => (
                      <div key={chat.id} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 ${chat.isUser ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                          {chat.user.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-medium text-sm ${chat.isUser ? 'text-purple-200' : 'text-pink-200'}`}>
                              {chat.user}
                            </span>
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
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 bg-pink-900/30 border-pink-700 text-pink-200 placeholder:text-pink-400"
                    />
                    <Button 
                      onClick={sendMessage}
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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

      {/* Mentor Chat Modal */}
      {selectedMentor && (
        <MentorChat 
          mentor={selectedMentor} 
          onClose={closeMentorChat}
        />
      )}
    </div>
  );
};

export default CommunityHub;
