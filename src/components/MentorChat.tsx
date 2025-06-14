
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Send, 
  Phone, 
  Video, 
  MessageCircle,
  Clock,
  Star
} from 'lucide-react';

interface MentorChatProps {
  mentor: {
    name: string;
    role: string;
    specialty: string;
    experience: string;
    quote: string;
    availableToday: boolean;
    avatar?: string;
    rating?: number;
    responseTime?: string;
  };
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  message: string;
  timestamp: Date;
  type?: 'text' | 'system';
}

const MentorChat: React.FC<MentorChatProps> = ({ mentor, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'mentor',
      message: `Hi! I'm ${mentor.name}. I'm here to support you on your communication journey. What would you like to talk about today?`,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate mentor response
    setTimeout(() => {
      const mentorResponses = [
        "That's a very common challenge. Many people experience similar feelings, and it's completely normal.",
        "Thank you for sharing that with me. Your courage in reaching out is already a step forward.",
        "I understand how overwhelming that can feel. Let's break this down into smaller, manageable steps.",
        "That's wonderful progress! Celebrating small wins is so important in this journey.",
        "Have you tried any specific techniques before? I'd love to hear about your experience.",
        "Remember, progress isn't always linear. Some days are harder than others, and that's okay."
      ];

      const randomResponse = mentorResponses[Math.floor(Math.random() * mentorResponses.length)];
      
      const mentorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mentor',
        message: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, mentorMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[600px] bg-slate-800 border-slate-600 flex flex-col">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white">{mentor.name}</h3>
                  {mentor.availableToday && (
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-slate-300">{mentor.role}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <Badge className="bg-blue-600 text-white text-xs">{mentor.specialty}</Badge>
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Usually responds in 5 min</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-300 hover:bg-slate-700">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-200 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t border-slate-600">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            This is a supportive space. Take your time and share what feels comfortable.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MentorChat;
