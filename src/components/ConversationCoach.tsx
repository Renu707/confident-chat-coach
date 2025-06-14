
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Send, Mic, MicOff, RotateCcw, Lightbulb } from 'lucide-react';

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start with a welcoming message from the coach
    const welcomeMessage: Message = {
      id: 'welcome',
      content: getWelcomeMessage(),
      sender: 'coach',
      timestamp: new Date(),
      tip: 'Remember, this is a safe space to practice. Take your time and be yourself!'
    };
    setMessages([welcomeMessage]);
  }, [scenario, difficulty]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getWelcomeMessage = () => {
    const welcomeMessages = {
      'workplace-small-talk': "Hi there! I'm your conversation coach. Let's practice some workplace small talk. Imagine we've just run into each other by the coffee machine. How would you start a conversation?",
      'casual-social-event': "Welcome! Today we're practicing casual conversations at a social event. Picture yourself at a friend's party where you don't know many people. I'll be someone friendly you might approach. Go ahead and introduce yourself!",
      'professional-networking': "Great to meet you! We're at a professional networking event. I'm here to help you practice introducing yourself and making meaningful connections. What would you like to say to break the ice?",
      'interview-preparation': "Hello! I'm here to help you prepare for interviews. Let's start with some common questions and work on building your confidence. How are you feeling about this practice session?",
      'dating-conversation': "Hi! Let's practice some dating conversation skills in a comfortable, judgment-free environment. Imagine we're on a casual coffee date. What would you like to talk about?"
    };
    return welcomeMessages[scenario as keyof typeof welcomeMessages] || "Hello! I'm excited to help you practice your conversation skills. What would you like to talk about?";
  };

  const generateCoachResponse = (userMessage: string): { content: string; tip?: string } => {
    // This is a simplified response generator - in a real app, this would use an AI model
    const responses = [
      {
        content: "That's a great way to start! I can tell you're putting thought into your approach. What would you say next?",
        tip: "You're showing good initiative by starting the conversation!"
      },
      {
        content: "I appreciate you sharing that. It sounds like you have some interesting experiences. Can you tell me more about that?",
        tip: "Asking follow-up questions shows genuine interest in the other person."
      },
      {
        content: "That's really interesting! I hadn't thought about it that way before. What got you interested in that topic?",
        tip: "Showing curiosity and asking open-ended questions keeps conversations flowing naturally."
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

    // Simulate typing delay
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
      
      // Update confidence score based on conversation progress
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
      tip: 'Fresh start! Remember, every conversation is a chance to practice and improve.'
    };
    setMessages([welcomeMessage]);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real app, this would integrate with speech recognition
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-coach-100 rounded-full">
            <MessageCircle className="w-5 h-5 text-coach-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg capitalize">
              {scenario.replace('-', ' ')} Practice
            </h2>
            <Badge variant="secondary" className="text-xs">
              {difficulty} level
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Confidence Level</p>
            <div className="flex items-center space-x-2">
              <Progress value={confidenceScore} className="w-20" />
              <span className="text-sm font-medium text-confidence-600">
                {confidenceScore}%
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>
      </div>

      {/* Conversation Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="animate-fade-in">
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`conversation-bubble ${message.sender === 'coach' ? 'coach-bubble' : 'user-bubble'}`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.timestamp && (
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
              
              {message.tip && (
                <div className="flex justify-start mt-2">
                  <div className="flex items-start space-x-2 max-w-md p-3 bg-confidence-50 border border-confidence-200 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-confidence-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-confidence-700">{message.tip}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="conversation-bubble coach-bubble">
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

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="pr-12"
              disabled={isTyping}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={toggleListening}
            >
              {isListening ? (
                <Mic className="w-4 h-4 text-red-500" />
              ) : (
                <MicOff className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentInput.trim() || isTyping}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <p>Turn {conversationTurn} • Press Enter to send</p>
          {conversationTurn >= 5 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSessionComplete(confidenceScore)}
            >
              End Session
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationCoach;
