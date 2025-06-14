import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Phone, 
  MessageCircle, 
  Users, 
  Shield, 
  Star,
  AlertCircle,
  Headphones,
  Brain,
  MapPin,
  Calendar,
  BookHeart,
  Play,
  Pause,
  Check,
  Timer,
  Search,
  Navigation
} from 'lucide-react';

interface EmotionalSupportProps {
  onBack: () => void;
}

interface UserLocation {
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

const EmotionalSupport: React.FC<EmotionalSupportProps> = ({ onBack }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [selfCareSession, setSelfCareSession] = useState<string>('');
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [weeklyProgress, setWeeklyProgress] = useState(65);
  const [activeTab, setActiveTab] = useState('daily-support');
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, text: "Practice one affirmation", completed: false },
    { id: 2, text: "Check in with emotions", completed: false },
    { id: 3, text: "Take 5 deep breaths", completed: false }
  ]);

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const dailyAffirmations = [
    "🌟 Your voice has unique value and deserves to be heard",
    "💪 Every conversation is practice, and you're getting stronger",
    "✨ You're brave for working on your communication skills",
    "🌈 Progress isn't always linear - you're exactly where you need to be",
    "❤️ You deserve patience and kindness, especially from yourself",
    "🚀 Each word you speak is an act of courage",
    "🌸 Your journey is valid, no matter how long it takes",
    "💎 You're not broken - you're beautifully human"
  ];

  const crisisResources = [
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      description: "24/7 crisis support via text message",
      urgent: true
    },
    {
      name: "National Suicide Prevention Lifeline",
      contact: "988",
      description: "24/7 phone support for mental health crises",
      urgent: true
    },
    {
      name: "SAMHSA National Helpline",
      contact: "1-800-662-4357",
      description: "24/7 mental health and substance abuse support",
      urgent: false
    },
    {
      name: "Anxiety and Depression Hotline",
      contact: "1-800-944-4773",
      description: "Support for anxiety and depression",
      urgent: false
    }
  ];

  const supportGroups = [
    {
      id: "stuttering",
      name: "Stuttering Support Circle",
      members: "2,847 members",
      description: "Safe space for people who stutter to share experiences",
      nextMeeting: "Today 7 PM EST",
      type: "stuttering"
    },
    {
      id: "anxiety",
      name: "Social Anxiety Warriors",
      members: "5,129 members", 
      description: "Overcome social anxiety together with understanding peers",
      nextMeeting: "Tomorrow 6 PM EST",
      type: "anxiety"
    },
    {
      id: "overthinking",
      name: "Overthinking Anonymous",
      members: "3,234 members",
      description: "Break free from analysis paralysis in conversation",
      nextMeeting: "Friday 8 PM EST", 
      type: "overthinking"
    },
    {
      id: "confidence",
      name: "Confidence Builders United",
      members: "4,567 members",
      description: "Building communication confidence one conversation at a time",
      nextMeeting: "Sunday 5 PM EST",
      type: "confidence"
    }
  ];

  const selfCareTools = [
    {
      id: "breathing",
      title: "Breathing Exercises",
      description: "Calm your nervous system with guided breathing techniques",
      duration: 300, // 5 minutes
      icon: "🫁",
      color: "from-cyan-900/40 to-blue-900/40",
      border: "border-cyan-700/50",
      text: "text-cyan-300"
    },
    {
      id: "meditation",
      title: "Mindfulness Meditations", 
      description: "5-minute guided meditations for communication anxiety",
      duration: 300,
      icon: "🧘‍♀️",
      color: "from-purple-900/40 to-indigo-900/40",
      border: "border-purple-700/50", 
      text: "text-purple-300"
    },
    {
      id: "grounding",
      title: "Grounding Techniques",
      description: "5-4-3-2-1 sensory grounding and other present-moment tools",
      duration: 180,
      icon: "🌱",
      color: "from-green-900/40 to-emerald-900/40",
      border: "border-green-700/50",
      text: "text-green-300"
    }
  ];

  // Timer effect for self-care sessions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    // Update daily goals
    setDailyGoals(prev => 
      prev.map(goal => 
        goal.id === 2 ? { ...goal, completed: true } : goal
      )
    );
  };

  const handleJoinGroup = (groupId: string) => {
    if (!joinedGroups.includes(groupId)) {
      setJoinedGroups(prev => [...prev, groupId]);
    }
  };

  const startSelfCareSession = (toolId: string) => {
    setSelfCareSession(toolId);
    setSessionActive(true);
    setSessionTime(0);
  };

  const endSelfCareSession = () => {
    setSessionActive(false);
    setSelfCareSession('');
    setSessionTime(0);
    // Update daily goals
    setDailyGoals(prev => 
      prev.map(goal => 
        goal.id === 3 ? { ...goal, completed: true } : goal
      )
    );
  };

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % dailyAffirmations.length);
    // Update daily goals
    setDailyGoals(prev => 
      prev.map(goal => 
        goal.id === 1 ? { ...goal, completed: true } : goal
      )
    );
  };

  const toggleGoalCompletion = (goalId: number) => {
    setDailyGoals(prev => 
      prev.map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLocalizedProfessionalResources = (location: UserLocation) => {
    const baseResources = [
      {
        id: "slp",
        title: "Speech-Language Pathologists",
        description: `Find certified SLPs in ${location.city}, ${location.state} who specialize in stuttering, voice therapy, and communication disorders.`,
        searchUrl: `https://www.asha.org/profind/?location=${encodeURIComponent(location.city + ', ' + location.state)}`,
        localInfo: `${location.state} licensing requirements and insurance coverage`,
        color: "from-blue-900/40 to-cyan-900/40",
        border: "border-blue-700/50",
        text: "text-blue-300"
      },
      {
        id: "anxiety",
        title: "Anxiety Specialists",
        description: `Connect with therapists in ${location.city} area who specialize in social anxiety, communication anxiety, and related challenges.`,
        searchUrl: `https://www.psychologytoday.com/us/therapists/${location.state.toLowerCase()}/${location.city.toLowerCase().replace(/\s+/g, '-')}`,
        localInfo: `Local support groups and ${location.state} mental health resources`,
        color: "from-purple-900/40 to-pink-900/40", 
        border: "border-purple-700/50",
        text: "text-purple-300"
      },
      {
        id: "groups",
        title: "Local Support Groups",
        description: `Find in-person support groups in ${location.city}, ${location.state} for stuttering, social anxiety, and communication challenges.`,
        searchUrl: `https://www.nami.org/Support-Education/Support-Groups?location=${encodeURIComponent(location.zipCode)}`,
        localInfo: `${location.city} chapter meetings and peer support programs`,
        color: "from-green-900/40 to-teal-900/40",
        border: "border-green-700/50", 
        text: "text-green-300"
      }
    ];

    // Add country-specific resources
    if (location.country === 'US') {
      baseResources.push({
        id: "insurance",
        title: "Insurance Coverage Help",
        description: `Navigate ${location.state} insurance requirements for speech therapy and mental health services.`,
        searchUrl: `https://www.healthcare.gov/see-plans/#/plan/results/${location.state}`,
        localInfo: `${location.state} Medicaid and marketplace options`,
        color: "from-orange-900/40 to-red-900/40",
        border: "border-orange-700/50",
        text: "text-orange-300"
      });
    }

    return baseResources;
  };

  const detectUserLocation = async () => {
    setIsDetectingLocation(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Use a geolocation API to get city/state from coordinates
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
              );
              const data = await response.json();
              
              const location: UserLocation = {
                city: data.city || data.locality || 'Your area',
                state: data.principalSubdivision || data.countryName,
                country: data.countryCode || 'US',
                zipCode: data.postcode || ''
              };
              
              setUserLocation(location);
              setShowLocationPrompt(false);
            } catch (error) {
              console.log('Geocoding failed:', error);
              // Fallback to manual entry
              setShowLocationPrompt(true);
            }
            setIsDetectingLocation(false);
          },
          (error) => {
            console.log('Geolocation failed:', error);
            setIsDetectingLocation(false);
            setShowLocationPrompt(true);
          }
        );
      } else {
        setIsDetectingLocation(false);
        setShowLocationPrompt(true);
      }
    } catch (error) {
      console.log('Location detection failed:', error);
      setIsDetectingLocation(false);
      setShowLocationPrompt(true);
    }
  };

  const handleManualLocationEntry = () => {
    if (locationInput.trim()) {
      // Parse location input (assume format: "City, State" or "City, State, ZIP")
      const parts = locationInput.split(',').map(part => part.trim());
      const location: UserLocation = {
        city: parts[0] || 'Your area',
        state: parts[1] || 'Your state',
        country: 'US', // Default to US, can be enhanced
        zipCode: parts[2] || ''
      };
      
      setUserLocation(location);
      setShowLocationPrompt(false);
      setLocationInput('');
    }
  };

  // New function to handle professional help navigation
  const navigateToProfessionalHelp = () => {
    setActiveTab('professional-help');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-indigo-950">
      {/* Navigation */}
      <nav className="bg-purple-900/90 backdrop-blur-sm border-b border-purple-800 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-purple-300 hover:bg-purple-800 hover:text-white"
            >
              ← Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Emotional Support Center</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowCrisisResources(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Crisis Support
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Crisis Resources Modal */}
        {showCrisisResources && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-red-950/90 border-red-800">
              <CardHeader>
                <CardTitle className="text-red-300 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Crisis Support Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-red-200 mb-6">
                  If you're in crisis or having thoughts of self-harm, please reach out for immediate help. 
                  You matter, and support is available 24/7.
                </p>
                {crisisResources.map((resource, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${resource.urgent ? 'bg-red-900/40 border-red-700' : 'bg-purple-900/40 border-purple-700'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{resource.name}</h3>
                      {resource.urgent && <Badge className="bg-red-600 text-white">Urgent</Badge>}
                    </div>
                    <p className="text-lg font-mono text-yellow-300 mb-2">{resource.contact}</p>
                    <p className="text-sm text-gray-300">{resource.description}</p>
                    <Button 
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open(`tel:${resource.contact.replace(/[^0-9]/g, '')}`, '_self')}
                    >
                      Call Now
                    </Button>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={() => setShowCrisisResources(false)}
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-800"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Daily Progress Tracker */}
        <Card className="mb-6 bg-gradient-to-r from-emerald-900/40 to-green-900/40 border-emerald-700/50">
          <CardHeader>
            <CardTitle className="text-emerald-300">Today's Wellness Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-200">Weekly Progress</span>
              <span className="text-emerald-300 font-semibold">{weeklyProgress}%</span>
            </div>
            <Progress value={weeklyProgress} className="mb-4" />
            
            <div className="space-y-2">
              {dailyGoals.map((goal) => (
                <div key={goal.id} className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGoalCompletion(goal.id)}
                    className={`p-1 ${goal.completed ? 'text-green-400' : 'text-emerald-400'}`}
                  >
                    <Check className={`w-4 h-4 ${goal.completed ? 'opacity-100' : 'opacity-30'}`} />
                  </Button>
                  <span className={`text-emerald-200 ${goal.completed ? 'line-through opacity-75' : ''}`}>
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-purple-900/60 border border-purple-700">
            <TabsTrigger value="daily-support" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-purple-300">
              <Heart className="w-4 h-4 mr-2" />
              Daily Support
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-purple-300">
              <Users className="w-4 h-4 mr-2" />
              Community
            </TabsTrigger>
            <TabsTrigger value="professional-help" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-purple-300">
              <BookHeart className="w-4 h-4 mr-2" />
              Professional Help
            </TabsTrigger>
            <TabsTrigger value="self-care" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-purple-300">
              <Brain className="w-4 h-4 mr-2" />
              Self-Care
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily-support" className="space-y-6">
            {/* Interactive Daily Affirmations */}
            <Card className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border-pink-700/50">
              <CardHeader>
                <CardTitle className="text-pink-300 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Your Daily Affirmation 💕
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="p-6 bg-pink-900/30 rounded-lg border border-pink-800/50 min-h-[100px] flex items-center justify-center">
                  <p className="text-pink-200 text-lg font-medium">{dailyAffirmations[currentAffirmation]}</p>
                </div>
                <Button 
                  onClick={nextAffirmation}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  New Affirmation ✨
                </Button>
              </CardContent>
            </Card>

            {/* Interactive Mood Check-in */}
            <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-300">How are you feeling today? 🤗</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { emoji: "😊", label: "Great", color: "green" },
                    { emoji: "😌", label: "Calm", color: "blue" },
                    { emoji: "😟", label: "Anxious", color: "yellow" },
                    { emoji: "😢", label: "Struggling", color: "red" }
                  ].map((mood) => (
                    <Button
                      key={mood.label}
                      variant={selectedMood === mood.label ? "default" : "outline"}
                      onClick={() => handleMoodSelection(mood.label)}
                      className={`p-4 h-auto flex-col space-y-2 ${selectedMood === mood.label ? 'bg-purple-600' : 'border-purple-600 text-purple-300 hover:bg-purple-800'}`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-sm">{mood.label}</span>
                    </Button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="mt-4 p-4 bg-purple-900/30 rounded-lg">
                    <p className="text-purple-200">
                      {selectedMood === "Great" && "That's wonderful! Your positive energy will shine through in your conversations today! ✨"}
                      {selectedMood === "Calm" && "Perfect mindset for practice! When you're calm, your authentic self can really come through. 🌸"}
                      {selectedMood === "Anxious" && "It's completely normal to feel anxious. Remember, you're safe here, and every small step counts. Take your time. 💙"}
                      {selectedMood === "Struggling" && "I see you, and your feelings are valid. You're incredibly brave for being here despite the struggle. You don't have to be perfect. 💕"}
                    </p>
                  </div>
                )}
                
                {/* Journal Entry */}
                <div className="mt-6">
                  <label className="block text-purple-300 mb-2">Optional: Share what's on your mind</label>
                  <Textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="Sometimes writing helps..."
                    className="bg-purple-900/30 border-purple-700 text-purple-200 placeholder:text-purple-400"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="text-center mb-6">
              <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">You're Not Alone 🤝</h2>
              <p className="text-xl text-purple-300 max-w-3xl mx-auto">
                Connect with others who understand your journey. Share victories, find support, and grow together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportGroups.map((group) => (
                <Card key={group.id} className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-indigo-300">{group.name}</CardTitle>
                      <Badge className="bg-indigo-600 text-white">{group.members}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-indigo-200">{group.description}</p>
                    <div className="flex items-center text-sm text-indigo-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Next meeting: {group.nextMeeting}
                    </div>
                    <Button 
                      onClick={() => handleJoinGroup(group.id)}
                      className={`w-full ${joinedGroups.includes(group.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
                    >
                      {joinedGroups.includes(group.id) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Joined! 💬
                        </>
                      ) : (
                        'Join Group 💬'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="professional-help" className="space-y-6">
            {/* Location Prompt */}
            {showLocationPrompt && (
              <Card className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-yellow-700/50 mb-6">
                <CardHeader>
                  <CardTitle className="text-yellow-300 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Help Us Find Local Resources for You
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-yellow-200">
                    To provide you with the most relevant therapists, support groups, and resources, 
                    we'd like to know your general location. This information is only used to personalize 
                    your search results and is not stored permanently.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={detectUserLocation}
                      disabled={isDetectingLocation}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center"
                    >
                      {isDetectingLocation ? (
                        <>
                          <Timer className="w-4 h-4 mr-2 animate-spin" />
                          Detecting...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4 mr-2" />
                          Auto-Detect Location
                        </>
                      )}
                    </Button>
                    
                    <div className="flex gap-2 flex-1">
                      <Input
                        placeholder="Or enter: City, State, ZIP"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        className="bg-yellow-900/30 border-yellow-700 text-yellow-200 placeholder:text-yellow-400"
                        onKeyPress={(e) => e.key === 'Enter' && handleManualLocationEntry()}
                      />
                      <Button 
                        onClick={handleManualLocationEntry}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost"
                    onClick={() => setShowLocationPrompt(false)}
                    className="text-yellow-400 hover:bg-yellow-800/30 w-full"
                  >
                    Skip for now (show general resources)
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="text-center mb-6">
              <BookHeart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Professional Support {userLocation && `in ${userLocation.city}, ${userLocation.state}`} 🏥
              </h2>
              <p className="text-xl text-blue-300 max-w-3xl mx-auto">
                {userLocation 
                  ? `Find qualified therapists and speech-language pathologists in your ${userLocation.city} area who specialize in your specific needs.`
                  : "Find qualified therapists and speech-language pathologists who specialize in your specific needs."
                }
              </p>
              {userLocation && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLocationPrompt(true)}
                  className="mt-2 border-blue-600 text-blue-300 hover:bg-blue-800"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Change Location
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userLocation ? (
                getLocalizedProfessionalResources(userLocation).map((resource) => (
                  <Card key={resource.id} className={`bg-gradient-to-r ${resource.color} ${resource.border}`}>
                    <CardHeader>
                      <CardTitle className={resource.text}>{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className={`${resource.text.replace('300', '200')}`}>{resource.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm opacity-90">
                          <MapPin className="w-4 h-4 mr-2" />
                          {resource.localInfo}
                        </div>
                        <div className="flex items-center text-sm opacity-90">
                          <Headphones className="w-4 h-4 mr-2" />
                          Telehealth options available
                        </div>
                      </div>
                      <Button 
                        className={`w-full bg-gradient-to-r ${resource.color.replace('/40', '')} text-white hover:opacity-90`}
                        onClick={() => window.open(resource.searchUrl, '_blank')}
                      >
                        Find Local {resource.title.split(' ')[0]}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Default resources when no location is provided
                <Card className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-blue-700/50">
                  <CardHeader>
                    <CardTitle className="text-blue-300">Speech-Language Pathologists</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-blue-200">Find certified SLPs who specialize in stuttering, voice therapy, and communication disorders.</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-blue-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        Filter by location & insurance
                      </div>
                      <div className="flex items-center text-sm text-blue-300">
                        <Headphones className="w-4 h-4 mr-2" />
                        Telehealth options available
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open('https://www.asha.org/profind/', '_blank')}
                    >
                      Find SLP Near You
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="self-care" className="space-y-6">
            <div className="text-center mb-6">
              <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Self-Care Toolkit 🧘‍♀️</h2>
              <p className="text-xl text-cyan-300 max-w-3xl mx-auto">
                Take care of your mental and emotional wellbeing with these gentle, supportive tools.
              </p>
            </div>

            {/* Active Session Display */}
            {sessionActive && (
              <Card className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-yellow-700/50 mb-6">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-yellow-300 text-xl font-semibold">
                      {selfCareTools.find(tool => tool.id === selfCareSession)?.title} Session Active
                    </h3>
                    <div className="flex items-center justify-center space-x-4">
                      <Timer className="w-6 h-6 text-yellow-300" />
                      <span className="text-2xl font-mono text-yellow-200">{formatTime(sessionTime)}</span>
                    </div>
                    <Button 
                      onClick={endSelfCareSession}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      End Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selfCareTools.map((tool) => (
                <Card key={tool.id} className={`bg-gradient-to-r ${tool.color} ${tool.border}`}>
                  <CardHeader>
                    <CardTitle className={`${tool.text} flex items-center`}>
                      <span className="text-2xl mr-3">{tool.icon}</span>
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className={`${tool.text.replace('300', '200')}`}>{tool.description}</p>
                    <p className="text-sm opacity-75">Duration: {Math.floor(tool.duration / 60)} minutes</p>
                    <Button 
                      onClick={() => startSelfCareSession(tool.id)}
                      disabled={sessionActive}
                      className={`w-full ${sessionActive ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r ${tool.color.replace('/40', '')} text-white hover:opacity-90`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Updated Support Section with proper navigation */}
        <div className="mt-12 text-center mb-8">
          <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            You Are Seen, Heard, and Valued 💕
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Every step you take toward better communication is an act of courage. 
            We're here to support you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Emergency Support */}
          <Card className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-600/30">
            <CardHeader>
              <CardTitle className="text-red-300">Feeling Overwhelmed?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-200 mb-4">
                It's okay to have difficult days. You're still making progress.
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Take a Gentle Break 🤗
              </Button>
            </CardContent>
          </Card>

          {/* Community Support */}
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-600/30">
            <CardHeader>
              <CardTitle className="text-blue-300">Community Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 mb-4">
                Connect with others on similar journeys for mutual support.
              </p>
              <Button 
                onClick={() => setActiveTab('community')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Join Support Groups 👥
              </Button>
            </CardContent>
          </Card>

          {/* Professional Help */}
          <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-600/30">
            <CardHeader>
              <CardTitle className="text-green-300">Professional Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-200 mb-4">
                Find qualified speech therapists and counselors in your area.
              </p>
              <Button 
                onClick={navigateToProfessionalHelp}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Find Therapists 🏥
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmotionalSupport;
