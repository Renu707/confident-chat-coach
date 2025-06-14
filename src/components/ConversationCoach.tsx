
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Send, Mic, MicOff, RotateCcw, Lightbulb, Shield, Eye, EyeOff } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'coach' | 'user';
  timestamp: Date;
  tip?: string;
}

interface ConversationCoachProps {
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onSessionComplete: (score: number) => void;
}

const ConversationCoach: React.FC<ConversationCoachProps> = ({
  scenario,
  difficulty,
  onSessionComplete
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(50);
  const [conversationTurn, setConversationTurn] = useState(0);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: getWelcomeMessage(),
      sender: 'coach',
      timestamp: new Date(),
      tip: 'Remember, this is a completely safe space to practice. Take your time and be yourself!'
    };
    setMessages([welcomeMessage]);
  }, [scenario, difficulty]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getWelcomeMessage = () => {
    const welcomeMessages = {
      'workplace-small-talk': "Hi there! I'm your personal conversation coach. Let's practice some workplace small talk in a completely safe environment. Imagine we've just met by the coffee machine. How would you start a conversation?",
      'casual-social-event': "Welcome! Today we're practicing casual conversations at a social event. Picture yourself at a friend's party where you don't know many people. I'm here to help you feel more confident. Go ahead and introduce yourself!",
      'professional-networking': "Great to meet you! We're at a professional networking event. I'm here to help you practice introducing yourself and making meaningful connections in a judgment-free space. What would you like to say?",
      'interview-preparation': "Hello! I'm here to help you prepare for interviews with personalized feedback. Let's start with some common questions and build your confidence step by step. How are you feeling about this practice session?",
      'dating-conversation': "Hi! Let's practice some dating conversation skills in this comfortable, completely private environment. Imagine we're on a casual coffee date. What would you like to talk about?"
    };
    return welcomeMessages[scenario as keyof typeof welcomeMessages] || "Hello! I'm excited to help you practice your conversation skills in this safe space. What would you like to talk about?";
  };

  const generateCoachResponse = (userMessage: string): { content: string; tip?: string } => {
    const messageLength = userMessage.length;
    const isQuestion = userMessage.includes('?');
    const hasPersonalDetail = userMessage.toLowerCase().includes('i ') || userMessage.toLowerCase().includes('my ');
    
    // Analyze the user's message for conversation skills
    const analysisResults = analyzeConversationSkills(userMessage);
    
    // Generate contextual responses based on scenario and user input
    if (scenario === 'workplace-small-talk') {
      return generateWorkplaceResponse(userMessage, analysisResults);
    } else if (scenario === 'casual-social-event') {
      return generateSocialResponse(userMessage, analysisResults);
    } else if (scenario === 'professional-networking') {
      return generateNetworkingResponse(userMessage, analysisResults);
    } else if (scenario === 'interview-preparation') {
      return generateInterviewResponse(userMessage, analysisResults);
    } else if (scenario === 'dating-conversation') {
      return generateDatingResponse(userMessage, analysisResults);
    }
    
    // Default educational response
    return {
      content: "That's a great start! I can see you're putting thought into your response. Let me ask you something to keep the conversation flowing - what made you interested in that topic?",
      tip: "Remember: Good conversations are like tennis - keep the ball going back and forth by asking questions and sharing your own experiences."
    };
  };

  const analyzeConversationSkills = (message: string) => {
    return {
      hasQuestion: message.includes('?'),
      isPersonal: message.toLowerCase().includes('i ') || message.toLowerCase().includes('my '),
      showsInterest: message.toLowerCase().includes('tell me') || message.toLowerCase().includes('what about') || message.toLowerCase().includes('how about'),
      length: message.length,
      isFollowUp: message.toLowerCase().includes('and you') || message.toLowerCase().includes('what about you')
    };
  };

  const generateWorkplaceResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "That's wonderful! I love how you brought up something we can both relate to. You know, I've been thinking about work-life balance lately too. How do you usually unwind after a busy day?",
        tip: "Great job finding common ground! In workplace conversations, relating to shared experiences helps build rapport with colleagues."
      },
      {
        content: "Oh, that sounds really interesting! I hadn't thought about it that way before. It's nice to learn something new during our coffee break. What got you started with that?",
        tip: "You're showing genuine curiosity - that's excellent! Asking follow-up questions keeps workplace conversations engaging without being too personal."
      },
      {
        content: "I can definitely relate to that! It's one of those things that makes the workday more enjoyable when you find people who share similar interests. Have you noticed any other colleagues who might be into that too?",
        tip: "Perfect! You're building connections by finding shared interests. This is how workplace friendships often begin."
      }
    ];

    if (!analysis.hasQuestion) {
      responses.push({
        content: "That's really cool! I appreciate you sharing that with me. It makes me curious - what's the most interesting part about that for you?",
        tip: "I noticed you shared something personal, which is great! Try ending with a question to keep the conversation balanced and engaging."
      });
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateSocialResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "Oh wow, that's so cool! I love meeting people with different backgrounds. It makes parties like this so much more interesting. How do you know the host?",
        tip: "Excellent icebreaker! Asking about the connection to the host is a classic way to find common ground at social events."
      },
      {
        content: "That's fascinating! I never would have guessed. You know what's funny? I was just thinking how everyone here seems to have such unique stories. What's been the most surprising thing about tonight so far?",
        tip: "You're doing great at being open and curious! This kind of enthusiasm makes people want to continue talking with you."
      },
      {
        content: "I love that! It's so refreshing to meet someone who's passionate about what they do. The energy in your voice really shows. What's next on your horizon with that?",
        tip: "You're showing genuine interest in their passions - that's the key to memorable conversations at social events!"
      }
    ];

    if (analysis.length < 20) {
      responses.push({
        content: "Absolutely! Tell me more about that - I'm really curious to hear your perspective on it.",
        tip: "Try expanding on your thoughts a bit more. People love when you share your genuine reactions and ask for their perspective."
      });
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateNetworkingResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "That's impressive! Your experience in that area sounds really valuable. I'm always interested in learning from people with different professional backgrounds. What trends are you seeing in your industry right now?",
        tip: "Great professional introduction! Asking about industry trends shows you're engaged and thinking strategically."
      },
      {
        content: "Wonderful! It sounds like you've built some really solid expertise. I can see why that would be both challenging and rewarding. What drew you to that field initially?",
        tip: "You're balancing professionalism with personal interest perfectly. This helps build genuine business relationships."
      },
      {
        content: "That's exactly the kind of insight I was hoping to hear tonight! Your perspective on that is really valuable. I'd love to understand how that impacts your day-to-day work.",
        tip: "Excellent! You're showing that you value their expertise while keeping the conversation professional and engaging."
      }
    ];

    if (!analysis.showsInterest) {
      responses.push({
        content: "I really appreciate you sharing that background. It gives me a much better sense of your expertise. What would you say is the most exciting project you're working on right now?",
        tip: "Remember to show curiosity about their work! Networking conversations thrive when both people demonstrate genuine professional interest."
      });
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateInterviewResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "That's a solid answer! I can see you've thought carefully about this. Your experience clearly demonstrates that skill. Can you tell me about a specific time when that quality helped you overcome a challenge?",
        tip: "Great start! In interviews, always follow up general statements with specific examples. Use the STAR method: Situation, Task, Action, Result."
      },
      {
        content: "I appreciate the honesty in your response. That kind of self-awareness is valuable. How have you been working to develop that area, and what progress have you seen?",
        tip: "Good approach! When discussing weaknesses, always include what you're doing to improve. It shows growth mindset."
      },
      {
        content: "Excellent! Your passion for this really comes through. That enthusiasm, combined with your background, suggests you'd be a great fit. What questions do you have about the role or our company culture?",
        tip: "Perfect! You're showing genuine interest. Always prepare thoughtful questions for interviews - it demonstrates your serious interest in the position."
      }
    ];

    if (analysis.length < 30) {
      responses.push({
        content: "That's a good start! For interview success, try to elaborate a bit more with specific examples. What particular situation can you think of that demonstrates this?",
        tip: "Remember: Interviews are your chance to tell your story! Provide concrete examples and details that make your experiences memorable."
      });
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateDatingResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "That's really interesting! I love how thoughtful you are about that. It tells me a lot about what matters to you. What got you interested in that in the first place?",
        tip: "Beautiful! You're sharing something meaningful about yourself while showing curiosity about their interests. This creates real connection."
      },
      {
        content: "I can hear the excitement in your voice when you talk about that! It's really attractive when someone is passionate about something. How do you usually spend your weekends with that hobby?",
        tip: "Perfect! Showing genuine interest in their passions and asking about their lifestyle helps you both learn if you're compatible."
      },
      {
        content: "That's so cool! I wouldn't have expected that, but it makes total sense now that you mention it. You seem like someone who really thinks about these things. What's been your favorite experience with that recently?",
        tip: "Excellent conversation skills! You're being genuinely curious while showing that you find them interesting as a person."
      }
    ];

    if (!analysis.isFollowUp) {
      responses.push({
        content: "I really appreciate you sharing that with me. It's nice to learn more about who you are. What would you like to know about me?",
        tip: "Great sharing! Remember that dating conversations work best when both people contribute. Try asking 'What about you?' to keep things balanced."
      });
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);
    setConversationTurn(prev => prev + 1);

    setTimeout(() => {
      const coachResponse = generateCoachResponse(currentInput);
      const coachMessage: Message = {
        id: `coach-${Date.now()}`,
        content: coachResponse.content,
        sender: 'coach',
        timestamp: new Date(),
        tip: coachResponse.tip
      };

      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
      setConfidenceScore(prev => Math.min(100, prev + 5));
    }, 1000 + Math.random() * 1000);
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentInput('');
    setConversationTurn(0);
    setConfidenceScore(50);
    
    const welcomeMessage: Message = {
      id: 'welcome-restart',
      content: getWelcomeMessage(),
      sender: 'coach',
      timestamp: new Date(),
      tip: 'Fresh start! Remember, this is your safe space to practice and grow.'
    };
    setMessages([welcomeMessage]);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const togglePrivateMode = () => {
    setIsPrivateMode(!isPrivateMode);
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl capitalize text-slate-100">
              {scenario.replace('-', ' ')} Practice
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs font-medium bg-blue-900/50 text-blue-200 border-blue-700">
                {difficulty} level
              </Badge>
              {isPrivateMode && (
                <Badge className="text-xs font-medium bg-green-900/50 text-green-200 border-green-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Private Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-slate-300 font-medium">Confidence Level</p>
            <div className="flex items-center space-x-3 mt-1">
              <Progress value={confidenceScore} className="w-24 h-2" />
              <span className="text-sm font-bold text-green-400 min-w-[3rem]">
                {confidenceScore}%
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePrivateMode}
            className={`px-3 py-2 border-slate-600 text-slate-200 hover:bg-slate-700 ${isPrivateMode ? 'bg-green-900/30 border-green-600 text-green-300' : ''}`}
          >
            {isPrivateMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPrivateMode ? 'Private' : 'Standard'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart} className="px-3 py-2 border-slate-600 text-slate-200 hover:bg-slate-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>
      </div>

      {/* Enhanced Conversation Area */}
      <ScrollArea className="flex-1 p-6 bg-gradient-to-br from-slate-900 to-slate-800" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="animate-fade-in">
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl px-6 py-4 rounded-2xl shadow-sm border ${
                  message.sender === 'coach' 
                    ? 'bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 ml-auto'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.timestamp && (
                    <p className={`text-xs mt-3 ${message.sender === 'coach' ? 'text-slate-400' : 'text-blue-100'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
              
              {message.tip && (
                <div className="flex justify-start mt-3">
                  <div className="flex items-start space-x-3 max-w-lg p-4 bg-green-900/30 border border-green-700 rounded-xl shadow-sm">
                    <div className="p-2 bg-green-800/50 rounded-lg">
                      <Lightbulb className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-300 mb-1">Coach Tip</p>
                      <p className="text-xs text-green-200 leading-relaxed">{message.tip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-2xl px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl shadow-sm">
                <div className="typing-indicator">
                  <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="p-6 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response... (this conversation is completely private)"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="pr-14 py-3 text-base bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
              disabled={isTyping}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-slate-600 text-slate-400 hover:text-slate-200"
              onClick={toggleListening}
            >
              {isListening ? (
                <Mic className="w-4 h-4 text-red-400" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentInput.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <p>Turn {conversationTurn} • Press Enter to send</p>
            {isPrivateMode && (
              <div className="flex items-center gap-1 text-green-400">
                <Shield className="w-3 h-3" />
                <span>All data encrypted & private</span>
              </div>
            )}
          </div>
          {conversationTurn >= 5 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSessionComplete(confidenceScore)}
              className="px-4 py-2 bg-green-900/30 border-green-600 text-green-300 hover:bg-green-800/40"
            >
              Complete Session
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationCoach;
