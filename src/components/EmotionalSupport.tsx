
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  BookHeart
} from 'lucide-react';

interface EmotionalSupportProps {
  onBack: () => void;
}

const EmotionalSupport: React.FC<EmotionalSupportProps> = ({ onBack }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showCrisisResources, setShowCrisisResources] = useState(false);

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
      name: "Stuttering Support Circle",
      members: "2,847 members",
      description: "Safe space for people who stutter to share experiences",
      nextMeeting: "Today 7 PM EST",
      type: "stuttering"
    },
    {
      name: "Social Anxiety Warriors",
      members: "5,129 members", 
      description: "Overcome social anxiety together with understanding peers",
      nextMeeting: "Tomorrow 6 PM EST",
      type: "anxiety"
    },
    {
      name: "Overthinking Anonymous",
      members: "3,234 members",
      description: "Break free from analysis paralysis in conversation",
      nextMeeting: "Friday 8 PM EST", 
      type: "overthinking"
    },
    {
      name: "Confidence Builders United",
      members: "4,567 members",
      description: "Building communication confidence one conversation at a time",
      nextMeeting: "Sunday 5 PM EST",
      type: "confidence"
    }
  ];

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

        <Tabs defaultValue="daily-support" className="space-y-6">
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
            {/* Daily Affirmations */}
            <Card className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border-pink-700/50">
              <CardHeader>
                <CardTitle className="text-pink-300 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Your Daily Affirmations 💕
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dailyAffirmations.map((affirmation, index) => (
                  <div key={index} className="p-4 bg-pink-900/30 rounded-lg border border-pink-800/50">
                    <p className="text-pink-200 text-center font-medium">{affirmation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mood Check-in */}
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
                      onClick={() => setSelectedMood(mood.label)}
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
              {supportGroups.map((group, index) => (
                <Card key={index} className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-700/50">
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
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      Join Group 💬
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Guidelines */}
            <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700/50">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Safe Community Promise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-green-200">Zero tolerance for judgment or mockery</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-green-200">Professional moderation 24/7</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-green-200">Inclusive and respectful language</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-green-200">Trauma-informed community guidelines</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional-help" className="space-y-6">
            <div className="text-center mb-6">
              <BookHeart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Professional Support 🏥</h2>
              <p className="text-xl text-blue-300 max-w-3xl mx-auto">
                Find qualified therapists and speech-language pathologists who specialize in your specific needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Find SLP Near You
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-700/50">
                <CardHeader>
                  <CardTitle className="text-purple-300">Anxiety Specialists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-200">Connect with therapists who specialize in social anxiety, communication anxiety, and related challenges.</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-purple-300">
                      <Brain className="w-4 h-4 mr-2" />
                      CBT, DBT, and other approaches
                    </div>
                    <div className="flex items-center text-sm text-purple-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Same-week appointments
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Find Therapist
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-900/40 to-teal-900/40 border-green-700/50">
                <CardHeader>
                  <CardTitle className="text-green-300">Support Groups IRL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-green-200">Find in-person support groups in your area for stuttering, social anxiety, and communication challenges.</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-green-300">
                      <Users className="w-4 h-4 mr-2" />
                      Local chapter meetings
                    </div>
                    <div className="flex items-center text-sm text-green-300">
                      <Heart className="w-4 h-4 mr-2" />
                      Peer support programs
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Find Local Groups
                  </Button>
                </CardContent>
              </Card>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Breathing Exercises",
                  description: "Calm your nervous system with guided breathing techniques",
                  icon: "🫁",
                  color: "from-cyan-900/40 to-blue-900/40",
                  border: "border-cyan-700/50",
                  text: "text-cyan-300"
                },
                {
                  title: "Mindfulness Meditations", 
                  description: "5-minute guided meditations for communication anxiety",
                  icon: "🧘‍♀️",
                  color: "from-purple-900/40 to-indigo-900/40",
                  border: "border-purple-700/50", 
                  text: "text-purple-300"
                },
                {
                  title: "Grounding Techniques",
                  description: "5-4-3-2-1 sensory grounding and other present-moment tools",
                  icon: "🌱",
                  color: "from-green-900/40 to-emerald-900/40",
                  border: "border-green-700/50",
                  text: "text-green-300"
                },
                {
                  title: "Progressive Relaxation",
                  description: "Release physical tension that builds up from communication stress",
                  icon: "😌",
                  color: "from-pink-900/40 to-rose-900/40", 
                  border: "border-pink-700/50",
                  text: "text-pink-300"
                },
                {
                  title: "Comfort Visualization",
                  description: "Imagine your safe space and successful conversations",
                  icon: "☁️",
                  color: "from-blue-900/40 to-slate-900/40",
                  border: "border-blue-700/50",
                  text: "text-blue-300"
                },
                {
                  title: "Gentle Movement",
                  description: "Simple stretches and movement for when you feel stuck",
                  icon: "🤸‍♀️",
                  color: "from-orange-900/40 to-red-900/40",
                  border: "border-orange-700/50",
                  text: "text-orange-300"
                }
              ].map((tool, index) => (
                <Card key={index} className={`bg-gradient-to-r ${tool.color} ${tool.border}`}>
                  <CardHeader>
                    <CardTitle className={`${tool.text} flex items-center`}>
                      <span className="text-2xl mr-3">{tool.icon}</span>
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className={`${tool.text.replace('300', '200')}`}>{tool.description}</p>
                    <Button className={`w-full bg-gradient-to-r ${tool.color.replace('/40', '')} text-white hover:opacity-90`}>
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmotionalSupport;
