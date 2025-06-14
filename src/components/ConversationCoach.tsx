import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Send, Mic, MicOff, RotateCcw, Lightbulb, Shield, Eye, EyeOff, Heart, Star } from 'lucide-react';

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
      tip: 'Remember, this is your safe space to practice! Every word you speak here builds your real-world confidence! 🌟',
      encouragement: "You've already taken the hardest step by being here. I believe in you! 💪✨"
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
      'dating-conversation': "Hi! *smiles warmly* You must be... *checks phone* ...from the dating app? I'm glad we finally get to meet in person! This coffee shop is really cozy, isn't it? How was your day?",
      
      // New scenario welcome messages
      'grocery-store-interactions': "Excuse me! *looks up from shopping list* I'm so sorry to bother you, but you look like you might know where things are around here. I've been wandering around for 10 minutes trying to find the pasta sauce - any idea where that might be?",
      'coffee-shop-ordering': "*behind you in line* Oh wow, they have so many options today! *glances at menu board* I can never decide between the seasonal drinks. Have you tried any of their specialty coffees? I'm always curious but never brave enough to order something new!",
      'public-transportation': "*sitting across from you on the bus* Excuse me, I hope you don't mind me asking - I'm new to the area and I'm trying to get to the downtown library. Do you know if this bus goes that way? I'm a bit turned around with all these routes!",
      'airport-travel': "*in line at security* Oh my goodness, these lines are getting longer every time I fly! *adjusts carry-on bag* Are you traveling for business or pleasure? I always find it interesting to hear about people's adventures. I'm heading to Denver for my sister's wedding!",
      'making-new-friends': "*at the gym water fountain* Hey! I've seen you here a few times - you always look so focused during your workouts. I'm still pretty new to this gym routine. Any tips for someone who's trying to get into a good fitness habit?",
      'phone-calls': "*phone rings* Hello! Thank you for calling City Insurance, this is Jessica. I hope you're having a wonderful day! How can I help make it even better?",
      'complaining-resolving': "*at customer service desk* Good afternoon! I'm really hoping you can help me out here. I bought this item last week and it's not working as expected. I have my receipt right here - is there anything we can do to resolve this?",
      'retail-interactions': "*approaches you while you're browsing* Hi there! Welcome to our store! Is there anything specific you're looking for today? I'd love to help you find exactly what you need, or if you prefer to browse, that's totally fine too!",
      'car-service-mechanics': "*wipes hands on rag* Alright, so I've taken a look at your car. The good news is it's nothing too serious, but there are a couple of things we should discuss. Do you have a few minutes to go over what I found?",
      'medical-appointments': "*knocks on door and enters* Good morning! I'm Dr. Martinez. *sits down with clipboard* Thanks for coming in today. I see from your chart that you've been experiencing some concerns. Tell me, what's been going on? I want to make sure I understand everything clearly.",
      'government-offices': "*looks up from paperwork* Next! *waves you over* Good afternoon! What can I help you with today? Please have all your documents ready - I'll do my best to get you taken care of as quickly as possible."
    };
    return welcomeMessages[scenario as keyof typeof welcomeMessages] || "Hey there! *friendly wave* Nice to meet you! What's on your mind today?";
  };

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

  const generateCoachResponse = (userMessage: string): { content: string; tip?: string; encouragement?: string } => {
    const messageLength = userMessage.length;
    const analysisResults = analyzeConversationSkills(userMessage);
    
    // Generate base response based on scenario
    let baseResponse;
    if (scenario === 'workplace-small-talk') {
      baseResponse = generateWorkplaceResponse(userMessage, analysisResults);
    } else if (scenario === 'casual-social-event') {
      baseResponse = generateSocialResponse(userMessage, analysisResults);
    } else if (scenario === 'professional-networking') {
      baseResponse = generateNetworkingResponse(userMessage, analysisResults);
    } else if (scenario === 'interview-preparation') {
      baseResponse = generateInterviewResponse(userMessage, analysisResults);
    } else if (scenario === 'dating-conversation') {
      baseResponse = generateDatingResponse(userMessage, analysisResults);
    } else if (scenario === 'grocery-store-interactions') {
      baseResponse = generateGroceryResponse(userMessage, analysisResults);
    } else if (scenario === 'coffee-shop-ordering') {
      baseResponse = generateCoffeeShopResponse(userMessage, analysisResults);
    } else if (scenario === 'public-transportation') {
      baseResponse = generatePublicTransportResponse(userMessage, analysisResults);
    } else if (scenario === 'airport-travel') {
      baseResponse = generateAirportResponse(userMessage, analysisResults);
    } else if (scenario === 'making-new-friends') {
      baseResponse = generateFriendshipResponse(userMessage, analysisResults);
    } else if (scenario === 'phone-calls') {
      baseResponse = generatePhoneResponse(userMessage, analysisResults);
    } else if (scenario === 'complaining-resolving') {
      baseResponse = generateComplaintResponse(userMessage, analysisResults);
    } else if (scenario === 'retail-interactions') {
      baseResponse = generateRetailResponse(userMessage, analysisResults);
    } else if (scenario === 'car-service-mechanics') {
      baseResponse = generateMechanicResponse(userMessage, analysisResults);
    } else if (scenario === 'medical-appointments') {
      baseResponse = generateMedicalResponse(userMessage, analysisResults);
    } else if (scenario === 'government-offices') {
      baseResponse = generateGovernmentResponse(userMessage, analysisResults);
    } else {
      baseResponse = {
        content: "That's really interesting! *nods thoughtfully* I hadn't thought about it that way before. What made you think of that?",
        tip: "Great conversation starter! Keep the momentum going by asking follow-up questions."
      };
    }
    
    // Add encouragement to every response
    return {
      ...baseResponse,
      encouragement: getMotivationalMessages()
    };
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

  const generateGroceryResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "Oh perfect! *smiles* You're a lifesaver! Aisle 7, right next to the canned tomatoes. I swear they move things around just to keep us on our toes! *laughs* Have you noticed they reorganized the whole store recently?",
        tip: "Excellent! You helped someone and opened the door for more conversation. Small acts of kindness build confidence!"
      },
      {
        content: "*lights up* Oh thank you so much! You know what, I've been shopping here for years and I still get lost sometimes. *chuckles* You seem to know your way around - are you a regular here too?",
        tip: "Perfect! Being helpful and asking follow-up questions shows you're comfortable engaging with strangers."
      },
      {
        content: "Amazing, thank you! *genuine relief* You just saved me from wandering around like a lost tourist in my own neighborhood! *grins* I really appreciate people like you who are willing to help out a fellow shopper.",
        tip: "Beautiful response! Your willingness to help creates positive interactions that make everyone's day better."
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateCoffeeShopResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*brightens up* Oh really? That's so helpful! *looks at menu again* You know what, I think I'm going to be brave and try it! Life's too short for boring coffee, right? *grins* What's your usual go-to order?",
        tip: "Fantastic! You gave helpful advice and showed interest in continuing the conversation. This is how coffee shop friendships begin!"
      },
      {
        content: "Oh my gosh, yes! *nods enthusiastically* The pumpkin spice one is incredible - it tastes like fall in a cup! *gestures toward menu* I was actually debating between that and the caramel macchiato. What do you think?",
        tip: "Perfect enthusiasm! You're sharing your experience while asking for their opinion. Great conversation flow!"
      },
      {
        content: "*laughs* I totally get that! I used to be the same way - just stuck with regular coffee for years. But the baristas here are so friendly, they actually convinced me to try new things. Now I'm kind of addicted to trying their seasonal specials!",
        tip: "Excellent! You related to their experience and shared your growth story. This helps others feel comfortable too!"
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generatePublicTransportResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "Oh absolutely! *points out window* You'll want to get off at Central Station - it's about three more stops. The library is just a short walk from there, maybe two blocks north. *smiles* Welcome to the neighborhood, by the way!",
        tip: "Perfect! You gave clear directions and made them feel welcome. This is exactly how to be helpful to newcomers!"
      },
      {
        content: "*nods helpfully* Yes, this bus goes right past there! You'll see a big blue sign for the library on your left. *looks around* Actually, I'm getting off one stop before that - I can let you know when we're getting close if you'd like?",
        tip: "Excellent! You offered specific help and showed genuine care for a stranger. This builds community connections!"
      },
      {
        content: "Oh perfect timing! *enthusiastic* I actually work near the library and take this route every day. You're in good hands! *chuckles* The downtown area is really nice - are you planning to explore a bit while you're there?",
        tip: "Wonderful! You provided reassurance and showed interest in their plans. This turns a simple direction into a friendly chat!"
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateAirportResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*eyes light up* Oh how exciting! A wedding! *claps hands together quietly* Denver is beautiful this time of year. I bet it's going to be absolutely magical! *adjusts own luggage* I'm actually heading to Portland for a business conference. Not nearly as fun as a wedding!",
        tip: "Beautiful! You showed genuine excitement for their happy occasion and shared about yourself. Airport conversations can lead to wonderful connections!"
      },
      {
        content: "Oh I love weddings! *beams* Your sister must be so happy you're making the trip. *looks at the security line* These lines give us plenty of time to chat, right? *laughs* Are you in the wedding party or just there to celebrate?",
        tip: "Perfect! You expressed joy for their family event and asked a thoughtful follow-up question. This creates meaningful travel conversations!"
      },
      {
        content: "*warm smile* That's so sweet of you to travel for your sister's big day! Family weddings are the best. *glances around airport* You know, I always love hearing about people's travel stories. There's something special about airport conversations - everyone's going somewhere exciting!",
        tip: "Excellent! You appreciated their family commitment and reflected on the uniqueness of travel connections. This shows emotional intelligence!"
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateFriendshipResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*grins* Oh that's so nice of you to say! You know what helped me the most? *takes a sip of water* Starting with just 10 minutes a day and being consistent. Also, don't be afraid to ask the trainers here - they're super helpful and not scary at all! *laughs* What kind of workouts are you most interested in?",
        tip: "Fantastic! You gave practical advice and asked about their interests. This is exactly how gym friendships develop naturally!"
      },
      {
        content: "*lights up* Aw, thank you! I remember feeling exactly the same way when I started. *gestures around gym* The secret is finding something you actually enjoy - then it doesn't feel like work! What brought you to the gym? Are you training for something specific or just general fitness?",
        tip: "Perfect! You related to their experience and showed genuine interest in their fitness journey. This builds real connections!"
      },
      {
        content: "That's so sweet of you! *enthusiastic* You know what? I'd love to work out together sometime if you're interested! Sometimes having a buddy makes all the difference. *smiles* I usually come around this time - we could spot each other or just keep each other motivated!",
        tip: "Incredible! You took the brave step of suggesting friendship. This is how meaningful relationships begin - with one person being courageous!"
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generatePhoneResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "That would be wonderful! *professional warmth* I'd love to help you with that. Let me pull up your account information. Can I get your policy number or full name to get started? And please don't hesitate to ask if you have any questions along the way!",
        tip: "Excellent phone etiquette! You were professional yet warm, and you guided them through the process clearly."
      },
      {
        content: "Absolutely, I'd be happy to look into that for you! *typing sounds* You've come to the right place. Let me review your account and see what options we have available. This might take just a moment - I appreciate your patience!",
        tip: "Perfect! You were reassuring and set clear expectations. Good phone communication reduces anxiety for everyone involved."
      },
      {
        content: "Of course! *cheerful* That's exactly what I'm here for. Let me check on that right away. *pause* While I'm looking this up, is there anything else I can help you with today? I want to make sure we take care of everything in one call!",
        tip: "Outstanding! You were proactive about solving multiple issues at once. This kind of service makes phone calls feel less daunting!"
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateComplaintResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*nods understandingly* I completely understand your frustration, and I really appreciate you bringing this to my attention. *examines receipt* Let me see what we can do to make this right for you. We absolutely want you to be happy with your purchase. What would be the best solution from your perspective?",
        tip: "Excellent! You acknowledged their frustration while staying solution-focused. This approach turns complaints into positive resolutions."
      },
      {
        content: "I'm so sorry this didn't work out as expected! *genuine concern* Thank you for giving us the chance to fix this. *looks at item* I can definitely see the issue here. Let me check our options - we can do a full refund, exchange, or store credit. What would work best for you?",
        tip: "Perfect! You apologized genuinely and offered multiple solutions. This shows you're focused on their satisfaction, not just company policy."
      },
      {
        content: "*professional empathy* I really appreciate you coming in rather than just returning it online. It helps us understand what went wrong. *examines product* You know what, this definitely isn't up to our usual standards. Let me make this right for you immediately!",
        tip: "Outstanding! You appreciated their effort to communicate and took ownership of the problem. This builds customer trust and loyalty."
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateRetailResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*brightens up* Oh wonderful! *gestures enthusiastically* I'd love to help you find exactly what you're looking for. What brings you in today? Are you shopping for something specific or just seeing what catches your eye? Either way is totally fine - I'm here if you need me!",
        tip: "Perfect retail approach! You were enthusiastic without being pushy and gave them control over their shopping experience."
      },
      {
        content: "That's great! *warm smile* I love helping people find the perfect item. *looks around* Depending on what you're after, I can show you some of our newest arrivals or our customer favorites. What kind of thing did you have in mind?",
        tip: "Excellent! You offered specific types of help while keeping the conversation open-ended. This makes customers feel supported, not pressured."
      },
      {
        content: "*genuine enthusiasm* Perfect timing! We actually just got some amazing new pieces in this week. *gestures toward displays* But no pressure at all - feel free to browse and let me know if anything catches your eye or if you have any questions. I'll be right over here!",
        tip: "Beautiful balance! You created excitement about new products while respecting their space to browse. This is ideal retail interaction!"
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateMechanicResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*nods approvingly* Absolutely, let's go through everything together. *points to car* So the main issue is with your brake pads - they're getting pretty worn and should be replaced soon for safety. The good news is everything else looks solid. Here's what it would cost and why it's important...",
        tip: "Excellent! You asked for explanation and showed you want to understand. Never be afraid to ask questions about car repairs - it's your right as a customer!"
      },
      {
        content: "*appreciative* I really like that you want to understand what's going on. *wipes hands* Too many people just say 'fix it' without knowing what they're paying for. *walks over to car* Let me show you exactly what I found and why it needs attention...",
        tip: "Perfect approach! You showed interest in learning about your car. Mechanics respect customers who want to be informed about their vehicle's condition."
      },
      {
        content: "*smiles* Of course! I always appreciate customers who want to be involved. *points under hood* Here's what I discovered... *explains clearly* And here's what I'd recommend doing first, versus what can wait. Does that make sense so far?",
        tip: "Outstanding! You engaged actively in understanding your car's needs. This kind of communication builds trust with service providers!"
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateMedicalResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*attentive listening* Thank you for being so thorough in describing your symptoms. *takes notes* That level of detail really helps me understand what's going on. Let me ask you a few follow-up questions to get the complete picture, and then we'll figure out the best way to help you feel better.",
        tip: "Excellent! You provided detailed information about your health concerns. Clear communication with doctors leads to better care and outcomes."
      },
      {
        content: "*nods thoughtfully* I really appreciate you sharing all of that with me. *reviews notes* It sounds like this has been concerning you for a while. Let's work together to get to the bottom of this. What questions do you have for me before we proceed?",
        tip: "Perfect! You expressed your concerns clearly and asked for clarification. This is exactly how to advocate for your health effectively."
      },
      {
        content: "*reassuring* Thank you for being so open about your concerns. *gentle smile* I can see this has been worrying you, and that's completely understandable. Let's go through some options together and make sure you feel comfortable with our plan moving forward.",
        tip: "Beautiful! You communicated your health concerns openly and honestly. This kind of patient-doctor communication leads to the best care possible."
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateGovernmentResponse = (userMessage: string, analysis: any) => {
    const responses = [
      {
        content: "*efficient but friendly* Perfect! You came prepared - that's going to make this so much smoother. *reviews documents* Everything looks good here. Let me process this for you right away. *typing* This should take about 10 minutes. Is there anything else you need to take care of while you're here?",
        tip: "Excellent preparation! Having your documents ready shows respect for everyone's time and makes government processes much easier."
      },
      {
        content: "*appreciative nod* Great! I can see you've got everything organized. *stamps documents* You know, it's refreshing when people come in this prepared. *efficient processing* We'll have you taken care of in no time. Any questions about the process?",
        tip: "Perfect! Your organization and preparation made this interaction smooth and efficient. This is exactly how to navigate bureaucracy successfully!"
      },
      {
        content: "*professional warmth* Wonderful! *begins processing* I wish everyone came as prepared as you do - it makes my job so much easier and gets you out of here faster! *continues working* This should be completed shortly. Anything else on your list for today?",
        tip: "Outstanding! You made the government worker's job easier with your preparation. Good preparation turns potentially stressful interactions into smooth experiences!"
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
        tip: coachResponse.tip,
        encouragement: coachResponse.encouragement
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
      tip: 'Fresh start! Remember, this is your safe space to practice and grow. 🌟',
      encouragement: "Every restart is a chance to be even more confident than before! You've got this! 💪"
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
              {scenario.replace('-', ' ')} Practice 🌟
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

      {/* Enhanced Input Area */}
      <div className="p-6 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response... You're doing amazing! 🌟"
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
            <p>Turn {conversationTurn} • You're building confidence! 💪</p>
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
