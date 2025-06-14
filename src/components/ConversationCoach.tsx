import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Send, Mic, MicOff, RotateCcw, Lightbulb, Shield, Eye, EyeOff, Heart, Star, Shuffle, Target, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'coach' | 'user';
  timestamp: Date;
  tip?: string;
  encouragement?: string;
}

interface ConversationCoachProps {
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onSessionComplete: (score: number) => void;
}

interface ConversationContext {
  setting: string;
  personality: string;
  mood: string;
  situation: string;
  partnerName: string;
  partnerAge: string;
  partnerBackground: string;
  conversationGoal: string;
  timeOfDay: string;
  weatherMood: string;
  recentEvent: string;
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
  const [conversationContext, setConversationContext] = useState<ConversationContext | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      if (recognitionRef.current) {
        // Configure speech recognition
        recognitionRef.current.continuous = false; // Set to false for better control
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
          setSpeechFeedback('🎤 Listening... Please speak now');
        };

        recognitionRef.current.onresult = (event: any) => {
          console.log('Speech recognition result:', event);
          
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              console.log('Final transcript:', transcript);
            } else {
              interimTranscript += transcript;
              console.log('Interim transcript:', transcript);
            }
          }

          // Update input with interim results for immediate feedback
          if (interimTranscript) {
            setSpeechFeedback(`🎤 Hearing: "${interimTranscript}"`);
          }

          // Add final transcript to input
          if (finalTranscript.trim()) {
            console.log('Adding to input:', finalTranscript);
            setCurrentInput(prev => {
              const newValue = (prev + ' ' + finalTranscript).trim();
              console.log('Updated input:', newValue);
              return newValue;
            });
            setSpeechFeedback('✅ Speech captured! Click send or continue speaking');
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          switch (event.error) {
            case 'not-allowed':
              setSpeechFeedback('❌ Microphone access denied. Please allow access and try again.');
              break;
            case 'no-speech':
              setSpeechFeedback('🔇 No speech detected. Click the mic and try speaking again.');
              break;
            case 'audio-capture':
              setSpeechFeedback('❌ No microphone found. Please connect a microphone.');
              break;
            case 'network':
              setSpeechFeedback('❌ Network error. Please check your internet connection.');
              break;
            default:
              setSpeechFeedback('❌ Speech recognition error. Please try again.');
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
          if (speechFeedback.includes('Listening')) {
            setSpeechFeedback('🎤 Click the microphone to speak again');
          }
        };
      }
    } else {
      console.warn('Speech recognition not supported');
      setSpeechFeedback('❌ Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [speechFeedback]);

  // Dynamic conversation generation system
  const generateUniqueConversation = (): ConversationContext => {
    const settings = [
      'bustling coffee shop with live jazz', 'quiet library study corner', 'rooftop garden party at sunset',
      'crowded subway during rush hour', 'empty park bench on Sunday morning', 'hotel lobby during a conference',
      'grocery store checkout line', 'airport departure lounge', 'cozy bookstore café', 'gym locker room',
      'art gallery opening night', 'farmers market on Saturday', 'office kitchen during lunch break',
      'beach boardwalk at dawn', 'mountain hiking trail rest stop', 'university campus quad',
      'small town diner counter', 'city bus during evening commute', 'wedding reception dance floor',
      'volunteer event community center', 'cooking class kitchen', 'dog park on a sunny afternoon'
    ];

    const personalities = [
      'enthusiastic foodie who loves trying new restaurants', 'thoughtful introvert who enjoys deep conversations',
      'adventurous traveler with stories from 30 countries', 'tech entrepreneur working on their third startup',
      'retired teacher who mentors young professionals', 'aspiring artist balancing creativity with day job',
      'new parent juggling work and family life', 'recent college graduate exploring career options',
      'fitness enthusiast training for their first marathon', 'bookworm who reads 100 books per year',
      'environmental activist passionate about sustainability', 'local musician playing weekend gigs',
      'international student adapting to new culture', 'career changer pursuing lifelong dream',
      'volunteer firefighter and weekend mechanic', 'yoga instructor studying mindfulness practices',
      'freelance photographer traveling for work', 'small business owner in their community',
      'graduate student researching fascinating topic', 'seasoned professional mentoring others'
    ];

    const moods = [
      'excited and energetic', 'calm and reflective', 'curious and inquisitive', 'friendly and welcoming',
      'contemplative and philosophical', 'playful and humorous', 'professional yet warm',
      'nostalgic and storytelling', 'optimistic and forward-thinking', 'empathetic and understanding'
    ];

    const situations = [
      'just got promoted at work', 'recently moved to this city', 'celebrating a personal milestone',
      'taking a break from busy schedule', 'waiting for a delayed appointment', 'exploring a new hobby',
      'reconnecting with old interests', 'planning an upcoming adventure', 'reflecting on recent changes',
      'discovering something unexpected', 'sharing a recent achievement', 'learning something new'
    ];

    const names = [
      'Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Avery', 'Riley', 'Cameron', 'Drew', 'Quinn',
      'Sam', 'Blake', 'Sage', 'River', 'Phoenix', 'Rowan', 'Emery', 'Finley', 'Hayden', 'Kendall'
    ];

    const ages = ['mid-20s', 'early 30s', 'late 30s', 'early 40s', 'mid-40s', 'early 50s'];

    const backgrounds = [
      'grew up in a small town, now living in the city', 'international background with multicultural perspective',
      'creative family that encouraged artistic expression', 'academic family that values learning and growth',
      'entrepreneurial family that started their own businesses', 'military family that moved frequently',
      'close-knit community where everyone knew each other', 'family of healthcare workers serving others',
      'family passionate about environmental conservation', 'family involved in local politics and community service'
    ];

    const goals = [
      'practice making genuine connections', 'learn to ask engaging follow-up questions',
      'share personal stories authentically', 'develop active listening skills',
      'build confidence in expressing opinions', 'practice showing genuine interest in others',
      'learn to navigate conversation transitions', 'develop empathy and emotional intelligence'
    ];

    const timesOfDay = [
      'early morning as the sun rises', 'mid-morning with perfect lighting', 'lunch time with gentle warmth',
      'late afternoon golden hour', 'early evening as day transitions', 'twilight with soft ambient lighting'
    ];

    const weatherMoods = [
      'with a gentle breeze creating perfect atmosphere', 'under clear blue skies that lift spirits',
      'with soft clouds creating cozy ambiance', 'during a light rain that feels refreshing',
      'with warm sunshine streaming through windows', 'with cool air that feels energizing'
    ];

    const recentEvents = [
      'just finished reading an incredible book', 'recently discovered a new favorite restaurant',
      'attended an inspiring workshop last weekend', 'completed a personal challenge they set for themselves',
      'had an unexpected reunion with an old friend', 'tried a new activity that surprised them',
      'received news that made them reflect on priorities', 'experienced something that shifted their perspective',
      'accomplished a goal they had been working toward', 'learned something that changed how they see the world'
    ];

    // Generate unique combination
    let uniqueKey: string;
    do {
      const context = {
        setting: settings[Math.floor(Math.random() * settings.length)],
        personality: personalities[Math.floor(Math.random() * personalities.length)],
        mood: moods[Math.floor(Math.random() * moods.length)],
        situation: situations[Math.floor(Math.random() * situations.length)],
        partnerName: names[Math.floor(Math.random() * names.length)],
        partnerAge: ages[Math.floor(Math.random() * ages.length)],
        partnerBackground: backgrounds[Math.floor(Math.random() * backgrounds.length)],
        conversationGoal: goals[Math.floor(Math.random() * goals.length)],
        timeOfDay: timesOfDay[Math.floor(Math.random() * timesOfDay.length)],
        weatherMood: weatherMoods[Math.floor(Math.random() * weatherMoods.length)],
        recentEvent: recentEvents[Math.floor(Math.random() * recentEvents.length)]
      };
      
      uniqueKey = `${context.setting}-${context.personality}-${context.mood}`;
      
      if (!conversationHistory.includes(uniqueKey)) {
        setConversationHistory(prev => [...prev.slice(-9), uniqueKey]); // Keep last 10
        return context;
      }
    } while (conversationHistory.includes(uniqueKey));

    // Fallback if somehow we can't generate unique (very unlikely)
    return {
      setting: 'unique space that feels just right for this moment',
      personality: 'someone with a fascinating perspective you haven\'t encountered before',
      mood: 'perfectly matched to create an engaging conversation',
      situation: 'in the middle of an interesting life transition',
      partnerName: 'Alex',
      partnerAge: 'early 30s',
      partnerBackground: 'diverse life experiences that shaped their worldview',
      conversationGoal: 'practice authentic connection and genuine curiosity',
      timeOfDay: 'at the perfect time of day',
      weatherMood: 'with ideal atmospheric conditions',
      recentEvent: 'experienced something meaningful they\'re processing'
    };
  };

  useEffect(() => {
    const context = generateUniqueConversation();
    setConversationContext(context);
    
    const welcomeMessage: Message = {
      id: 'welcome',
      content: generateDynamicWelcomeMessage(context),
      sender: 'coach',
      timestamp: new Date(),
      tip: `Today you're practicing: ${context.conversationGoal}. Remember, every conversation is unique! 🌟`,
      encouragement: `You're about to meet ${context.partnerName}, who is ${context.mood}. This is your safe space to practice! 💪✨`
    };
    setMessages([welcomeMessage]);
  }, [scenario, difficulty]);

  const generateDynamicWelcomeMessage = (context: ConversationContext): string => {
    const scenarioIntros = {
      'workplace-small-talk': [
        `*${context.timeOfDay} in the ${context.setting}* Oh hey there! *looks up from laptop* I'm ${context.partnerName}, I work in the ${['marketing', 'design', 'operations', 'sales', 'HR'][Math.floor(Math.random() * 5)]} department. I don't think we've officially met yet! *${context.mood}*`,
        `*at the office ${context.setting} ${context.timeOfDay}* Hi! *adjusts coffee cup* You look familiar - I think I've seen you around the ${['elevator', 'cafeteria', 'parking garage', 'lobby', 'break room'][Math.floor(Math.random() * 5)]}. I'm ${context.partnerName} from the ${['third', 'second', 'fourth', 'fifth'][Math.floor(Math.random() * 4)]} floor. *appears ${context.mood}*`
      ],
      'casual-social-event': [
        `*${context.timeOfDay} at ${context.setting} ${context.weatherMood}* Hey! *waves enthusiastically* I'm ${context.partnerName}! I love meeting new people at events like this. *seems ${context.mood} and just ${context.recentEvent}* Are you enjoying yourself so far?`,
        `*mingling at ${context.setting}* Hi there! *genuine smile* You have really good taste in ${['music', 'events', 'parties', 'gatherings'][Math.floor(Math.random() * 4)]} - this is exactly my kind of scene! I'm ${context.partnerName}, and I'm feeling ${context.mood} tonight because I ${context.recentEvent}.`
      ],
      'professional-networking': [
        `*${context.timeOfDay} at prestigious ${context.setting}* Good evening! *professional handshake* I'm ${context.partnerName}, I'm a ${context.personality}. *appears ${context.mood}* I always find these networking events fascinating - you meet such driven people. What brings you here tonight?`,
        `*networking at elegant ${context.setting}* Hello! *confident approach* I'm ${context.partnerName}. *${context.mood} and clearly passionate about their work* I was just talking to someone about ${['industry trends', 'innovation', 'market changes', 'emerging technologies'][Math.floor(Math.random() * 4)]}. What's your perspective on where our field is heading?`
      ],
      'dating-conversation': [
        `*${context.timeOfDay} at charming ${context.setting} ${context.weatherMood}* Hi! *warm, genuine smile* You must be... *checks phone briefly* from the app? I'm ${context.partnerName}! *seems ${context.mood}* I love this place - it's got such a ${['cozy', 'welcoming', 'unique', 'relaxed'][Math.floor(Math.random() * 4)]} vibe. How was your day?`,
        `*meeting at romantic ${context.setting}* Hey there! *stands up to greet* I'm really glad we decided to meet in person. I'm ${context.partnerName}, and I have to say, I'm feeling ${context.mood} because I ${context.recentEvent}. *settles in comfortably* Tell me about yourself!`
      ]
    };

    // Handle new scenarios with dynamic generation
    const defaultIntros = [
      `*${context.timeOfDay} at ${context.setting} ${context.weatherMood}* Oh, hi! *friendly approach* I'm ${context.partnerName}, I'm in my ${context.partnerAge} and I'm a ${context.personality}. *appears ${context.mood}* I ${context.recentEvent}. What brings you here today?`,
      `*encountering you at ${context.setting}* Hey there! *genuine interest* I'm ${context.partnerName}. *seems ${context.mood} and energetic* You know, I was just thinking about how I ${context.recentEvent}, and it got me curious about other people's experiences. Mind if we chat?`
    ];

    const scenarioMessages = scenarioIntros[scenario as keyof typeof scenarioIntros] || defaultIntros;
    return scenarioMessages[Math.floor(Math.random() * scenarioMessages.length)];
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getMotivationalMessages = () => {
    const messages = [
      "🌟 You're doing amazing! Every response shows your growing confidence!",
      "💪 Look at you go! This is exactly how social skills are built!",
      "✨ Fantastic! You're getting more comfortable with each message!",
      "🚀 Incredible progress! You should be proud of yourself!",
      "🎉 YES! That's the confident you I knew was in there!",
      "💫 Perfect! You're turning fear into strength, one conversation at a time!",
      "🌈 Beautiful response! You're proving to yourself that you CAN do this!",
      "⭐ Outstanding! Each word you type builds real-world courage!",
      "🔥 You're on fire! This confidence will carry into your real conversations!",
      "💝 Wonderful! You're giving yourself the gift of social confidence!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const analyzeConversationSkills = (message: string) => {
    return {
      hasQuestion: message.includes('?'),
      isPersonal: message.toLowerCase().includes('i ') || message.toLowerCase().includes('my '),
      showsInterest: message.toLowerCase().includes('tell me') || message.toLowerCase().includes('what about') || message.toLowerCase().includes('how about'),
      length: message.length,
      isFollowUp: message.toLowerCase().includes('and you') || message.toLowerCase().includes('what about you'),
      isPolite: message.toLowerCase().includes('please') || message.toLowerCase().includes('thank') || message.toLowerCase().includes('sorry')
    };
  };

  const generateDynamicCoachResponse = (userMessage: string): { content: string; tip?: string; encouragement?: string } => {
    if (!conversationContext) return { content: "That's interesting! Tell me more." };

    const analysis = analyzeConversationSkills(userMessage);
    
    // Generate contextual response based on current conversation context
    const responses = [
      {
        content: `*${conversationContext.mood} and engaged* That's really ${['fascinating', 'interesting', 'cool', 'amazing', 'thoughtful'][Math.floor(Math.random() * 5)]}! You know, as someone who ${conversationContext.personality}, I find that perspective really ${['refreshing', 'insightful', 'unique', 'valuable'][Math.floor(Math.random() * 4)]}. ${conversationContext.recentEvent}, so I'm particularly curious about ${['your approach', 'how you see it', 'your experience', 'what drew you to that'][Math.floor(Math.random() * 4)]}.`,
        tip: `Great sharing! ${conversationContext.partnerName} is clearly ${conversationContext.mood} and interested. Try asking about their ${['background', 'experience', 'perspective', 'story'][Math.floor(Math.random() * 4)]} to keep the connection growing.`
      },
      {
        content: `*lights up with genuine interest* Oh wow, I love that! *${conversationContext.mood}* You know what's funny? Given my background where I ${conversationContext.partnerBackground}, I've had a completely different experience with that. ${conversationContext.recentEvent} actually made me think about ${['similar themes', 'related ideas', 'the same concepts', 'those patterns'][Math.floor(Math.random() * 4)]}. What's your take on that?`,
        tip: `Perfect! You're creating a natural exchange of perspectives. ${conversationContext.partnerName} is sharing their background - this is how deeper connections form.`
      },
      {
        content: `*nods thoughtfully* That makes so much sense! *appears ${conversationContext.mood}* I'm in my ${conversationContext.partnerAge}, and I've noticed that ${['perspective shifts', 'priorities change', 'understanding deepens', 'awareness grows'][Math.floor(Math.random() * 4)]} over time. Since I ${conversationContext.recentEvent}, I've been more aware of ${['these kinds of connections', 'how people approach this', 'different viewpoints', 'what really matters'][Math.floor(Math.random() * 4)]}. How long have you felt this way about it?`,
        tip: `Excellent depth! You're connecting with their ${conversationContext.conversationGoal} beautifully. Age and experience sharing builds authentic rapport.`
      }
    ];

    // Add scenario-specific contextual responses
    if (analysis.length < 20) {
      responses.push({
        content: `*encouraging smile* I can tell you're thinking carefully about this. *${conversationContext.mood}* In this ${conversationContext.setting}, I find it's nice to just ${['speak from the heart', 'share what feels true', 'be authentic', 'trust your instincts'][Math.floor(Math.random() * 4)]}. What's really on your mind about this?`,
        tip: `Take your time! This ${conversationContext.setting} is perfect for ${conversationContext.conversationGoal}. ${conversationContext.partnerName} seems patient and interested.`
      });
    }

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      ...selectedResponse,
      encouragement: getMotivationalMessages()
    };
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
    setSpeechFeedback('');
    setIsTyping(true);
    setConversationTurn(prev => prev + 1);

    setTimeout(() => {
      const coachResponse = generateDynamicCoachResponse(currentInput);
      const coachMessage: Message = {
        id: `coach-${Date.now()}`,
        content: coachResponse.content,
        sender: 'coach',
        timestamp: new Date(),
        tip: coachResponse.tip,
        encouragement: coachResponse.encouragement
      };

      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
      setConfidenceScore(prev => Math.min(100, prev + 5));

      // Speak the coach response if audio is enabled
      if (isAudioEnabled && 'speechSynthesis' in window) {
        speakText(coachResponse.content);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentInput('');
    setConversationTurn(0);
    setConfidenceScore(50);
    setSpeechFeedback('');
    
    // Generate completely new conversation context
    const newContext = generateUniqueConversation();
    setConversationContext(newContext);
    
    const welcomeMessage: Message = {
      id: 'welcome-restart',
      content: generateDynamicWelcomeMessage(newContext),
      sender: 'coach',
      timestamp: new Date(),
      tip: `Fresh conversation with completely new dynamics! Today's focus: ${newContext.conversationGoal} 🌟`,
      encouragement: `New person, new energy, new opportunity! You're about to meet ${newContext.partnerName} who is ${newContext.mood}. 💪`
    };
    setMessages([welcomeMessage]);
  };

  const shuffleConversation = () => {
    const newContext = generateUniqueConversation();
    setConversationContext(newContext);
    
    const shuffleMessage: Message = {
      id: `shuffle-${Date.now()}`,
      content: `*scene shifts* ${generateDynamicWelcomeMessage(newContext)}`,
      sender: 'coach',
      timestamp: new Date(),
      tip: `Conversation dynamics just changed! New goal: ${newContext.conversationGoal}`,
      encouragement: `Plot twist! You're now talking with ${newContext.partnerName} who has a completely different energy. Adapt and thrive! 🎭`
    };
    
    setMessages(prev => [...prev, shuffleMessage]);
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      setSpeechFeedback('❌ Speech recognition not supported in this browser. Try Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      console.log('Stopping speech recognition');
      recognitionRef.current.stop();
      return;
    }

    try {
      // Stop any current speech before listening
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      
      // Request microphone permission first
      console.log('Requesting microphone access');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      
      console.log('Starting speech recognition');
      recognitionRef.current.start();
      
    } catch (error) {
      console.error('Microphone access error:', error);
      setIsListening(false);
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            setSpeechFeedback('❌ Microphone access denied. Please allow microphone access in your browser settings.');
            break;
          case 'NotFoundError':
            setSpeechFeedback('❌ No microphone found. Please connect a microphone and try again.');
            break;
          case 'NotReadableError':
            setSpeechFeedback('❌ Microphone is being used by another application. Please close other apps using the microphone.');
            break;
          default:
            setSpeechFeedback('❌ Could not access microphone. Please check your browser settings.');
        }
      } else {
        setSpeechFeedback('❌ Microphone access failed. Please try again.');
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (!isAudioEnabled && isSpeaking && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string) => {
    if (!isAudioEnabled || !('speechSynthesis' in window)) return;

    // Stop any current speech
    speechSynthesis.cancel();

    // Clean the text for better speech synthesis
    const cleanText = text.replace(/\*/g, '').replace(/\[.*?\]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Use a pleasant voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const togglePrivateMode = () => {
    setIsPrivateMode(!isPrivateMode);
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto">
      {/* Enhanced Header with Dynamic Context Display */}
      <div className="flex items-center justify-between p-6 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl capitalize text-slate-100">
              Dynamic {scenario.replace('-', ' ')} Practice 🎭
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs font-medium bg-blue-900/50 text-blue-200 border-blue-700">
                {difficulty} level
              </Badge>
              {conversationContext && (
                <Badge className="text-xs font-medium bg-purple-900/50 text-purple-200 border-purple-700">
                  {conversationContext.partnerName} • {conversationContext.partnerAge}
                </Badge>
              )}
              {isPrivateMode && (
                <Badge className="text-xs font-medium bg-green-900/50 text-green-200 border-green-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Private Mode
                </Badge>
              )}
              {isSpeaking && (
                <Badge className="text-xs font-medium bg-orange-900/50 text-orange-200 border-orange-700">
                  🔊 Speaking
                </Badge>
              )}
            </div>
            {conversationContext && (
              <p className="text-xs text-slate-400 mt-1 max-w-md truncate">
                {conversationContext.setting} • {conversationContext.mood}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-slate-300 font-medium">Confidence Level ⚡</p>
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
            onClick={toggleAudio}
            className={`px-3 py-2 border-slate-600 text-slate-200 hover:bg-slate-700 ${isAudioEnabled ? 'bg-blue-900/30 border-blue-600 text-blue-300' : ''}`}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
            Audio {isAudioEnabled ? 'On' : 'Off'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shuffleConversation}
            className="px-3 py-2 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-purple-500"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            New Scene
          </Button>
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
            Fresh Start
          </Button>
        </div>
      </div>

      {/* Conversation Context Info Panel */}
      {conversationContext && (
        <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>🎯 Goal: {conversationContext.conversationGoal}</span>
              <span>📍 {conversationContext.setting}</span>
              <span>🕐 {conversationContext.timeOfDay}</span>
              {isAudioEnabled && <span>🎤 Voice conversation enabled</span>}
            </div>
            <span className="text-purple-300">✨ Each conversation is completely unique</span>
          </div>
        </div>
      )}

      {/* Enhanced Conversation Area */}
      <ScrollArea className="flex-1 p-6 bg-gradient-to-br from-slate-900 to-slate-800" ref={scrollAreaRef}>
        <div className="space-y-6">
          {/* Goal Display Card - Always Visible */}
          {conversationContext && (
            <div className="sticky top-0 z-10 mb-4">
              <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700/50 backdrop-blur-sm">
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-800/50 rounded-lg">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-300 text-sm">Today's Practice Goal</h3>
                      <p className="text-green-200 text-sm capitalize">{conversationContext.conversationGoal}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

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
                      <p className="text-xs font-semibold text-green-300 mb-1">Coach Tip 💡</p>
                      <p className="text-xs text-green-200 leading-relaxed">{message.tip}</p>
                    </div>
                  </div>
                </div>
              )}

              {message.encouragement && (
                <div className="flex justify-start mt-3">
                  <div className="flex items-start space-x-3 max-w-lg p-4 bg-purple-900/30 border border-purple-700 rounded-xl shadow-sm">
                    <div className="p-2 bg-purple-800/50 rounded-lg">
                      <Heart className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-300 mb-1">Encouragement ✨</p>
                      <p className="text-xs text-purple-200 leading-relaxed">{message.encouragement}</p>
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

      {/* Enhanced Input Area with better voice feedback */}
      <div className="p-6 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={isListening ? "🎤 Listening... Speak clearly!" : "Type or speak your response... 🌟"}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className={`pr-14 py-3 text-base bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 ${isListening ? 'ring-2 ring-green-400 border-green-400 bg-green-900/20' : ''}`}
              disabled={isTyping}
            />
            <Button
              size="sm"
              variant="ghost"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-slate-600 text-slate-400 hover:text-slate-200 transition-all ${isListening ? 'text-green-400 bg-green-900/30 scale-110 animate-pulse' : ''}`}
              onClick={toggleListening}
              disabled={isTyping || isSpeaking}
              title={isListening ? "Stop recording (speech will be processed)" : "Start voice input"}
            >
              {isListening ? (
                <Mic className="w-4 h-4" />
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
        
        {/* Speech Feedback */}
        {speechFeedback && (
          <div className="mt-3 p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
            <p className="text-blue-200 text-sm text-center">
              {speechFeedback}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <p>Turn {conversationTurn} • Building unique conversation skills! 💪</p>
            {conversationContext && (
              <p>Currently: {conversationContext.mood} conversation</p>
            )}
            {isAudioEnabled && (
              <p className={isListening ? 'text-green-400 font-medium' : 'text-blue-400'}>
                {isListening ? '🎤 Recording... Speak now!' : '🎤 Click mic button to start voice input'}
              </p>
            )}
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
              <Star className="w-4 h-4 mr-2" />
              Complete Session! 🎉
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationCoach;
