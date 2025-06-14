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
      'workplace-small-talk': "Hey! *walks up to coffee machine* Oh, you're getting coffee too? I swear this machine has a mind of its own sometimes. How's your morning going so far?",
      'casual-social-event': "Hi there! *notices you by the snack table* I don't think we've met yet - I'm Sarah's friend from college. Are you enjoying the party? The music's pretty great, right?",
      'professional-networking': "Hi! *extends hand for handshake* I'm Alex, I work in marketing at TechCorp. I love these networking events - you meet such interesting people. What brings you here tonight?",
      'interview-preparation': "Good morning! Please, have a seat. *gestures to chair* I'm Jennifer, I'll be conducting your interview today. I hope you didn't have too much trouble finding the office. Can I get you some water before we start?",
      'dating-conversation': "Hi! *smiles warmly* You must be... *checks phone* ...from the dating app? I'm glad we finally get to meet in person! This coffee shop is really cozy, isn't it? How was your day?"
    };
    return welcomeMessages[scenario as keyof typeof welcomeMessages] || "Hey there! *friendly wave* Nice to meet you! What's on your mind today?";
  };

  const generateCoachResponse = (userMessage: string): { content: string; tip?: string } => {
    const messageLength = userMessage.length;
    const analysisResults = analyzeConversationSkills(userMessage);
    
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
    
    return {
      content: "That's really interesting! *nods thoughtfully* I hadn't thought about it that way before. What made you think of that?",
      tip: "Great conversation starter! Keep the momentum going by asking follow-up questions."
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
        content: "Oh totally! *chuckles* I know exactly what you mean. I was just dealing with something similar yesterday. It's funny how these things always seem to happen right when you're trying to focus, you know?",
        tip: "Perfect! You're building rapport by sharing a relatable experience. This is how workplace friendships develop naturally."
      },
      {
        content: "Really? *leans in with interest* That sounds fascinating! I've always wondered about that but never really looked into it. Do you find it actually makes a difference in your day-to-day work?",
        tip: "Excellent curiosity! Asking genuine questions shows you're engaged and interested in your colleague as a person."
      },
      {
        content: "Ugh, don't even get me started! *laughs* I swear some days I feel like I'm living in a sitcom. But hey, at least we're all in this together, right? Speaking of which, are you doing anything fun this weekend?",
        tip: "Great job using humor to connect! Transitioning to weekend plans is a natural way to get to know colleagues better."
      },
      {
        content: "*coffee machine beeps* Oh, saved by the coffee! *grins* But seriously, that's actually really cool. I love learning random things from people here. Makes the office feel less like, well, an office.",
        tip: "You're creating a friendly, relaxed atmosphere. Using situational humor helps make workplace conversations feel natural."
      }
    ];

    if (!analysis.hasQuestion) {
      responses.push({
        content: "That's so true! *nods enthusiastically* I never really thought about it like that before. What got you interested in that whole thing?",
        tip: "Good sharing! Try ending with a question to keep the conversation balanced and flowing naturally."
      });
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateSocialResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "No way, really? *eyes light up* That's so cool! I would never have guessed that about you. You seem to have so many interesting stories - I bet you're the life of the party wherever you go!",
        tip: "Perfect enthusiasm! Showing genuine excitement about what someone shares makes them feel valued and want to continue talking."
      },
      {
        content: "*laughs* Oh my god, I love that! You know what's funny? I was just talking to someone about something similar earlier. It's like everyone here has these amazing hidden talents or something.",
        tip: "Great job connecting their story to the broader social context. This helps people feel part of the group."
      },
      {
        content: "Wait, seriously? *leans forward* Okay, you have to tell me more about that because that sounds absolutely amazing. I'm getting serious FOMO just listening to you!",
        tip: "Excellent! Your genuine interest and enthusiasm is infectious. This is exactly how to make someone feel heard and appreciated."
      },
      {
        content: "*raises drink* Okay, I officially think you're the most interesting person I've met tonight! How do you even get into something like that? I need to step up my game!",
        tip: "Wonderful! You're making them feel special while showing authentic curiosity. This builds real connections."
      }
    ];

    if (analysis.length < 20) {
      responses.push({
        content: "Totally! *nods* I can see why you'd feel that way. Tell me more - what's your favorite part about it?",
        tip: "Try sharing a bit more of your own thoughts and experiences. People love when you open up too!"
      });
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateNetworkingResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "That's really impressive! *nods appreciatively* The industry changes so fast these days, it sounds like you're really staying ahead of the curve. I'd love to hear your thoughts on where you see things heading in the next few years.",
        tip: "Excellent professional engagement! Asking about future trends shows strategic thinking and genuine interest in their expertise."
      },
      {
        content: "Wow, that must be both challenging and rewarding work. *thoughtful pause* I'm always fascinated by how different companies approach these problems. What's been the most surprising thing you've learned in your role?",
        tip: "Perfect balance of professionalism and curiosity. You're showing respect for their experience while keeping the conversation engaging."
      },
      {
        content: "That's exactly the kind of insight I was hoping to hear tonight! *smiles* Your perspective on that is really valuable. I'm curious - what made you pivot into that area originally?",
        tip: "Great networking technique! You're acknowledging their expertise while learning about their career journey."
      },
      {
        content: "Absolutely fascinating! *genuine interest* I can see why you'd be passionate about that. The impact you're having must be really fulfilling. What's the most exciting project you're working on right now?",
        tip: "Excellent professional conversation! You're showing genuine interest in their work while keeping the focus on them."
      }
    ];

    if (!analysis.showsInterest) {
      responses.push({
        content: "That background is really solid. *nods* I can see how that experience would be invaluable in your current role. What aspect of your work energizes you the most?",
        tip: "Remember to ask engaging questions! Networking conversations thrive when you demonstrate genuine professional curiosity."
      });
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateInterviewResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*writes notes* That's a great example, thank you. I can really see how that experience shaped your approach. Can you walk me through how you handled the most challenging part of that situation?",
        tip: "Excellent response! In interviews, specific examples make your answers memorable. Use the STAR method for structure."
      },
      {
        content: "*nods thoughtfully* I appreciate your honesty about that. It shows good self-awareness. How have you been working on developing that skill, and what progress have you seen so far?",
        tip: "Good approach to discussing growth areas! Always include specific steps you're taking to improve."
      },
      {
        content: "*smiles* I can hear the passion in your voice when you talk about this work. That enthusiasm, combined with your background, suggests you'd be a great fit for our team. What questions do you have about the role?",
        tip: "Perfect! Your enthusiasm is coming through clearly. Always prepare thoughtful questions to show your genuine interest."
      },
      {
        content: "*leans forward slightly* That's interesting. I'd love to hear more detail about how you approached that challenge. What was going through your mind when you first realized you had to handle it?",
        tip: "Great start! Interviewers love to hear your thought process. Walk them through your decision-making step by step."
      }
    ];

    if (analysis.length < 30) {
      responses.push({
        content: "*encouraging smile* That's a good foundation. Can you give me a specific example of when you demonstrated that skill? I'd love to hear the details of the situation.",
        tip: "Remember to provide concrete examples! Stories make your responses much more compelling and memorable."
      });
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateDatingResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*smiles warmly* I love how passionate you are about that! There's something really attractive about someone who knows what they care about. How did you first get into it?",
        tip: "Beautiful! Showing genuine interest in their passions creates real connection. Keep asking follow-up questions."
      },
      {
        content: "*laughs softly* You know what I love about that? It's so refreshingly honest. Most people try to sound perfect on dates, but you're just being yourself. That's really refreshing.",
        tip: "Perfect! Authenticity is magnetic. Appreciating their genuine self helps build trust and connection."
      },
      {
        content: "That's so cool! *eyes light up* I would never have guessed that about you, but it totally makes sense now. You have this thoughtful energy that I really like. What's your favorite thing about it?",
        tip: "Excellent! You're noticing personality traits and connecting them to their interests. This shows you're really paying attention."
      },
      {
        content: "*takes a sip of coffee* Okay, I have to admit, I'm a little impressed. *smiles* That sounds like something that takes real commitment. Do you think I'd be terrible at it?",
        tip: "Great flirtation technique! Showing vulnerability while asking if you could share their interest creates intimacy."
      }
    ];

    if (!analysis.isFollowUp) {
      responses.push({
        content: "*nods thoughtfully* I really appreciate you sharing that with me. It tells me a lot about who you are. What would you like to know about me?",
        tip: "Great sharing! Make sure to invite them to ask about you too. Good dates have balanced conversation flow."
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
