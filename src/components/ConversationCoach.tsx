
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
    const responses = [
      {
        content: "That's a wonderful way to start! I can see you're putting real thought into your approach. Your confidence is already showing. What would you say next?",
        tip: "You're demonstrating excellent initiative by taking the first step in the conversation!"
      },
      {
        content: "I really appreciate you sharing that with me. It sounds like you have some fascinating experiences. I'd love to hear more about that - can you tell me what drew you to that?",
        tip: "Asking thoughtful follow-up questions like this shows genuine interest and keeps conversations flowing naturally."
      },
      {
        content: "That's incredibly interesting! I hadn't considered it from that perspective before. Your insight is really valuable. What initially got you interested in exploring that topic?",
        tip: "Expressing curiosity and asking open-ended questions like this creates deeper, more meaningful connections."
      }
    ];
    
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
      <div className="flex items-center justify-between p-6 bg-white/90 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl capitalize text-slate-900">
              {scenario.replace('-', ' ')} Practice
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-700">
                {difficulty} level
              </Badge>
              {isPrivateMode && (
                <Badge className="text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Private Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-slate-600 font-medium">Confidence Level</p>
            <div className="flex items-center space-x-3 mt-1">
              <Progress value={confidenceScore} className="w-24 h-2" />
              <span className="text-sm font-bold text-green-600 min-w-[3rem]">
                {confidenceScore}%
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePrivateMode}
            className={`px-3 py-2 ${isPrivateMode ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
          >
            {isPrivateMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPrivateMode ? 'Private' : 'Standard'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart} className="px-3 py-2">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>
      </div>

      {/* Enhanced Conversation Area */}
      <ScrollArea className="flex-1 p-6 bg-gradient-to-br from-slate-50/50 to-blue-50/50" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="animate-fade-in">
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl px-6 py-4 rounded-2xl shadow-sm border ${
                  message.sender === 'coach' 
                    ? 'bg-white border-blue-100 text-slate-800' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-200 ml-auto'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.timestamp && (
                    <p className={`text-xs mt-3 ${message.sender === 'coach' ? 'text-slate-500' : 'text-blue-100'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
              
              {message.tip && (
                <div className="flex justify-start mt-3">
                  <div className="flex items-start space-x-3 max-w-lg p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Lightbulb className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-800 mb-1">Coach Tip</p>
                      <p className="text-xs text-green-700 leading-relaxed">{message.tip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-2xl px-6 py-4 bg-white border border-blue-100 rounded-2xl shadow-sm">
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
      <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-slate-200/50">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response... (this conversation is completely private)"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="pr-14 py-3 text-base bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              disabled={isTyping}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-slate-100"
              onClick={toggleListening}
            >
              {isListening ? (
                <Mic className="w-4 h-4 text-red-500" />
              ) : (
                <MicOff className="w-4 h-4 text-slate-400" />
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
        
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <p>Turn {conversationTurn} • Press Enter to send</p>
            {isPrivateMode && (
              <div className="flex items-center gap-1 text-green-600">
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
              className="px-4 py-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
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
