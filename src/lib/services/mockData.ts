import { Agent, CallRecord, Campaign, IndustryUseCase, Voice } from './types';

export const MOCK_VOICES: Voice[] = [
  {
    id: 'voice-sarah',
    name: 'Sarah',
    accent: 'American (Neutral)',
    language: 'English (US)',
    gender: 'Female',
    age: 'Young',
    style: ['Warm', 'Professional', 'Empathetic'],
    useCase: 'Receptionist & Front Desk Support',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    provider: 'CallioAI Native',
    audioSampleUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
    scenarios: [
      {
        label: 'Greeting',
        audioUrl: '',
        script: 'Good morning! Thank you for calling Acme Health. My name is Sarah. How can I direct your call today?'
      },
      {
        label: 'Appointment Booking',
        audioUrl: '',
        script: 'I have an opening this Thursday at 2:30 PM with Dr. Sharma. Would that time work well for your schedule?'
      },
      {
        label: 'Follow-up',
        audioUrl: '',
        script: 'I wanted to confirm that your appointment is set. We have sent a calendar invite and reminder SMS to your phone.'
      }
    ]
  },
  {
    id: 'voice-alex',
    name: 'Alex',
    accent: 'American (Standard)',
    language: 'English (US)',
    gender: 'Male',
    age: 'Young',
    style: ['Confident', 'Clear', 'Energetic'],
    useCase: 'Outbound Sales & Lead Qualification',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    provider: 'Cartesia',
    audioSampleUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
    scenarios: [
      {
        label: 'Sales Opener',
        audioUrl: '',
        script: 'Hi David! Alex calling from Apex Logistics. I saw you requested a fleet quote on our site. Do you have 2 minutes to check your requirements?'
      },
      {
        label: 'Requirement Capture',
        audioUrl: '',
        script: 'Got it. For 25 cross-country routes, our automated freight dispatcher usually reduces per-mile costs by around 18%.'
      }
    ]
  },
  {
    id: 'voice-priya',
    name: 'Priya',
    accent: 'Indian (Bilingual English/Hindi)',
    language: 'English (India) & Hindi',
    gender: 'Female',
    age: 'Young',
    style: ['Polite', 'Courteous', 'Fast-Resolving'],
    useCase: 'Hospitality & Clinic Dispatch',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    provider: 'CallioAI Native',
    audioSampleUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
    scenarios: [
      {
        label: 'Bilingual Greeting',
        audioUrl: '',
        script: 'Namaste! Welcome to Fortis Wellness. Main Priya bol rahi hoon. How may I assist you with doctor consultation today?'
      },
      {
        label: 'FAQ Support',
        audioUrl: '',
        script: 'Our dental clinic is open Monday through Saturday from 9 AM to 8 PM with free basement parking available.'
      }
    ]
  },
  {
    id: 'voice-marcus',
    name: 'Marcus',
    accent: 'British (RP)',
    language: 'English (UK)',
    gender: 'Male',
    age: 'Middle-Aged',
    style: ['Authoritative', 'Calm', 'Consultative'],
    useCase: 'Financial Advisory & Real Estate',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    provider: 'ElevenLabs',
    audioSampleUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
    scenarios: [
      {
        label: 'Consultation Opener',
        audioUrl: '',
        script: 'Good afternoon. Marcus here from Kensington Capital. I understand you are exploring commercial mortgage options for Q4.'
      },
      {
        label: 'Qualification',
        audioUrl: '',
        script: 'Understood. Based on your anticipated loan-to-value ratio, our portfolio team can arrange a tailored briefing with senior underwriters.'
      }
    ]
  },
  {
    id: 'voice-elena',
    name: 'Elena',
    accent: 'American (Pacific)',
    language: 'English (US)',
    gender: 'Female',
    age: 'Young',
    style: ['Friendly', 'Patient', 'Structured'],
    useCase: 'Customer Support & Order Status',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    provider: 'CallioAI Native',
    audioSampleUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
    scenarios: [
      {
        label: 'Order Status Check',
        audioUrl: '',
        script: 'Thanks for calling SwiftDeliver! I found your order #8492. It is currently out for delivery and will arrive by 3:45 PM today.'
      }
    ]
  },
  {
    id: 'voice-liam',
    name: 'Liam',
    accent: 'Australian',
    language: 'English (AU)',
    gender: 'Male',
    age: 'Young',
    style: ['Approachable', 'Direct', 'Upbeat'],
    useCase: 'Education & Course Advising',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    provider: 'Cartesia',
    audioSampleUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
    scenarios: [
      {
        label: 'Course Inquiry',
        audioUrl: '',
        script: 'Gday! Liam here from Melbourne Tech Institute. Happy to walk you through our upcoming AI engineering batch and scholarship criteria.'
      }
    ]
  }
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-receptionist',
    name: 'Sarah — AI Receptionist',
    role: 'Front-Desk Virtual Receptionist',
    category: 'receptionist',
    description: 'Answers 100% of customer phone calls 24/7, resolves common FAQs, captures caller details, and routes urgent calls to staff.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    voiceId: 'voice-sarah',
    voiceName: 'Sarah (US Professional)',
    language: 'English (US)',
    accent: 'American',
    gender: 'Female',
    status: 'live',
    channels: ['phone', 'web'],
    phoneNumbers: ['+1 (888) 492-3021'],
    firstMessage: 'Hi! Thanks for calling Acme Dental. My name is Sarah. How can I help you today?',
    systemPrompt: 'You are the primary front desk receptionist for Acme Dental. Greet callers warmly, answer questions regarding timings, location, and insurance, and assist in booking consultations. Keep answers brief (2-3 sentences max).',
    skills: ['24/7 Answering', 'Smart Call Routing', 'FAQ Resolution', 'SMS Confirmation'],
    metrics: {
      totalCalls: 3412,
      callsToday: 84,
      avgDurationSec: 138,
      successRate: 94,
      sentimentScore: 92
    },
    sampleScenarios: [
      {
        title: 'Clinic Hours & Location',
        description: 'Caller inquires about weekend availability and emergency slots.',
        previewTranscript: [
          { speaker: 'customer', text: 'Are you guys open this Saturday morning?' },
          { speaker: 'ai', text: 'Yes, we are open Saturdays from 9:00 AM to 2:00 PM for cleanings and emergencies. Would you like me to reserve a spot for you?' },
          { speaker: 'customer', text: 'Yes please, around 11 AM.' },
          { speaker: 'ai', text: 'Done! I have booked you for Saturday at 11:00 AM with Dr. Bennett. A text confirmation is on its way to your number.' }
        ]
      }
    ]
  },
  {
    id: 'agent-scheduler',
    name: 'Jordan — Appointment Setter',
    role: 'Automated Calendar & Booking Specialist',
    category: 'appointment_setter',
    description: 'Integrates with Google Calendar & Cal.com to qualify caller availability, check real-time open slots, and confirm appointments.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    voiceId: 'voice-priya',
    voiceName: 'Priya (Courteous)',
    language: 'English',
    accent: 'Bilingual',
    gender: 'Female',
    status: 'live',
    channels: ['phone', 'web', 'campaign'],
    phoneNumbers: ['+1 (888) 492-3022'],
    firstMessage: 'Hello! I can help you schedule your consultation in less than two minutes. What day works best for you?',
    systemPrompt: 'You are an appointment booking specialist. Your goal is to find a suitable date and time, confirm contact details, and send a calendar invitation.',
    skills: ['Real-time Calendar Sync', 'Rescheduling & Cancellations', 'SMS Reminders'],
    metrics: {
      totalCalls: 2190,
      callsToday: 62,
      avgDurationSec: 104,
      successRate: 91,
      sentimentScore: 89
    },
    sampleScenarios: [
      {
        title: 'Instant Reschedule',
        description: 'Patient moving consultation from Tuesday to Friday.',
        previewTranscript: [
          { speaker: 'customer', text: 'I need to push my Tuesday appointment back to Friday.' },
          { speaker: 'ai', text: 'No problem at all! On Friday we have 10:00 AM or 3:15 PM open. Which one suits you better?' },
          { speaker: 'customer', text: 'Let’s do 3:15 PM.' },
          { speaker: 'ai', text: 'All updated! Your slot is confirmed for Friday at 3:15 PM.' }
        ]
      }
    ]
  },
  {
    id: 'agent-sales',
    name: 'Alex — Outbound Lead Qualifier',
    role: 'Speed-to-Lead Outbound Caller',
    category: 'sales',
    description: 'Instantly calls new web form submissions within 30 seconds, assesses budget, timeline, and company size, and books qualified demos.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    voiceId: 'voice-alex',
    voiceName: 'Alex (Energetic)',
    language: 'English (US)',
    accent: 'American',
    gender: 'Male',
    status: 'live',
    channels: ['campaign', 'phone'],
    phoneNumbers: ['+1 (888) 720-9110'],
    firstMessage: 'Hi there! Alex calling from CloudScale. I saw you just checked out our enterprise pricing. Did you have a quick minute?',
    systemPrompt: 'You are a friendly SDR qualifying incoming enterprise leads. Check current provider, monthly volume, and decision maker timeline. If qualified, offer a live video walkthrough with the engineering director.',
    skills: ['Sub-minute Speed-to-Lead', 'BANT Qualification', 'Live Call Transfer'],
    metrics: {
      totalCalls: 4890,
      callsToday: 142,
      avgDurationSec: 165,
      successRate: 88,
      sentimentScore: 86
    },
    sampleScenarios: [
      {
        title: 'Lead Qualification',
        description: 'Qualifying enterprise prospective buyer on call volume.',
        previewTranscript: [
          { speaker: 'ai', text: 'Roughly how many outbound customer calls is your sales team handling each week right now?' },
          { speaker: 'customer', text: 'We are doing around 12,000 calls across 15 reps.' },
          { speaker: 'ai', text: 'That is right in our sweet spot. Our AI workflows usually double connect rates on that volume. Can I introduce you to Marcus on our solutions team tomorrow at 2 PM?' }
        ]
      }
    ]
  },
  {
    id: 'agent-realestate',
    name: 'Marcus — Property Inquiries',
    role: 'Real Estate Buyer & Tenant Qualifier',
    category: 'real_estate',
    description: 'Handles buyer inquiries from Zillow, portals, and yard signs, qualifies budget and bedrooms, and books on-site showings.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    voiceId: 'voice-marcus',
    voiceName: 'Marcus (Consultative)',
    language: 'English',
    accent: 'British',
    gender: 'Male',
    status: 'live',
    channels: ['phone', 'web'],
    phoneNumbers: ['+1 (888) 902-4411'],
    firstMessage: 'Hello! Thank you for inquiring about 42 Meadow Lane. How can I help with your property search today?',
    systemPrompt: 'You represent Oakwood Realty. Provide accurate specs on listings (price, square footage, school district) and pre-screen buyers for pre-approval before booking an agent walk-through.',
    skills: ['MLS Property Lookup', 'Pre-approval Verification', 'Showing Scheduling'],
    metrics: {
      totalCalls: 1820,
      callsToday: 41,
      avgDurationSec: 152,
      successRate: 91,
      sentimentScore: 90
    },
    sampleScenarios: [
      {
        title: 'Property Tour Booking',
        description: 'Scheduling open house walk-through.',
        previewTranscript: [
          { speaker: 'customer', text: 'Is the Meadow Lane home still available to view?' },
          { speaker: 'ai', text: 'Yes it is! It features 4 bedrooms, 3 baths, and an updated chef kitchen. Would you like to tour it this Sunday afternoon?' }
        ]
      }
    ]
  }
];

export const MOCK_CALLS: CallRecord[] = [
  {
    id: 'call-9021',
    customerName: 'Eleanor Vance',
    customerPhone: '+1 (415) 883-9120',
    agentId: 'agent-receptionist',
    agentName: 'Sarah — AI Receptionist',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    direction: 'inbound',
    startedAt: '12 mins ago',
    durationSec: 142,
    outcome: 'Appointment Booked',
    sentiment: 'positive',
    sentimentScore: 96,
    summary: 'Caller inquired about teeth whitening and emergency crown repair. Agent answered pricing questions and booked appointment for Thursday at 2:00 PM with Dr. Sharma.',
    intent: 'Dental procedure inquiry & appointment scheduling',
    actionItems: [
      'Calendar hold placed for Thursday 2:00 PM',
      'Sent SMS confirmation with clinic pre-registration link',
      'Notified front desk dental hygienist'
    ],
    extractedData: {
      'Preferred Date': 'Thursday, Oct 12',
      'Time Slot': '2:00 PM',
      'Procedure': 'Crown Repair & Whitening',
      'Insurance Provider': 'Delta Dental PPO'
    },
    transcript: [
      { timestamp: '00:01', speaker: 'ai', text: 'Hi! Welcome to Acme Dental. My name is Sarah. How can I help you today?' },
      { timestamp: '00:06', speaker: 'customer', text: 'Hi Sarah, I had a crown come loose this morning and I am in a bit of pain. Do you have any emergency openings?' },
      { timestamp: '00:15', speaker: 'ai', text: 'I am so sorry to hear that! We keep daily buffer slots for dental emergencies. I can book you with Dr. Sharma today at 4:15 PM or tomorrow at 10:00 AM. Which would you prefer?' },
      { timestamp: '00:27', speaker: 'customer', text: 'Today at 4:15 PM would be a lifesaver, thank you!' },
      { timestamp: '00:32', speaker: 'ai', text: 'You are all set for 4:15 PM today with Dr. Sharma. Please bring your insurance card. I am sending an instant SMS confirmation to your number right now.' },
      { timestamp: '00:41', speaker: 'customer', text: 'Thank you so much, Sarah!' },
      { timestamp: '00:44', speaker: 'ai', text: 'You are very welcome. We will see you soon, take care!' }
    ]
  },
  {
    id: 'call-9022',
    customerName: 'Robert Martinez',
    customerPhone: '+1 (312) 554-1802',
    agentId: 'agent-sales',
    agentName: 'Alex — Outbound Lead Qualifier',
    agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    direction: 'outbound',
    startedAt: '34 mins ago',
    durationSec: 188,
    outcome: 'Lead Qualified',
    sentiment: 'positive',
    sentimentScore: 91,
    summary: 'Lead requested quote for multi-location dispatch. Current volume is 8,000 monthly calls with 12 dispatchers. High purchase intent; scheduled product demo with account executive.',
    intent: 'B2B Software Upgrade',
    actionItems: [
      'Synced lead to HubSpot with "Marketing Qualified Lead" status',
      'Assigned account executive: Marcus Cole',
      'Demo invite sent for Friday at 11:00 AM EST'
    ],
    extractedData: {
      'Company Name': 'Nexus Logistics Group',
      'Team Size': '45 drivers, 12 dispatchers',
      'Monthly Calls': '8,000+',
      'Primary Pain Point': 'Missed late-night driver check-ins'
    },
    transcript: [
      { timestamp: '00:02', speaker: 'ai', text: 'Hi Robert! Alex calling from Dograh. I saw you checked out our automated dispatch calling. Did you have two minutes?' },
      { timestamp: '00:08', speaker: 'customer', text: 'Yeah, sure. We are losing calls after 7 PM when our dispatch team logs off.' },
      { timestamp: '00:16', speaker: 'ai', text: 'That is exactly what we solve. Dograh answers every driver call, logs load numbers, and escalates emergencies. How many loads do you track daily?' },
      { timestamp: '00:25', speaker: 'customer', text: 'Around 150 to 200 loads a day.' },
      { timestamp: '00:30', speaker: 'ai', text: 'Terrific. Let’s have our senior solutions architect walk your team through our automated driver check-in workflow. Does Friday at 11 AM EST work for you?' },
      { timestamp: '00:39', speaker: 'customer', text: 'Sounds good. Send the invite to my work email.' }
    ]
  },
  {
    id: 'call-9023',
    customerName: 'Sophia Chen',
    customerPhone: '+1 (206) 914-3829',
    agentId: 'agent-receptionist',
    agentName: 'Sarah — AI Receptionist',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    direction: 'inbound',
    startedAt: '1 hour ago',
    durationSec: 96,
    outcome: 'Resolved FAQ',
    sentiment: 'positive',
    sentimentScore: 94,
    summary: 'Customer called to verify if clinic takes Aetna Dental PPO and asked for parking instructions.',
    intent: 'Insurance & Directions',
    actionItems: ['Sent directions map link via SMS'],
    extractedData: {
      'Insurance': 'Aetna PPO',
      'In-Network Verified': 'Yes'
    },
    transcript: [
      { timestamp: '00:01', speaker: 'ai', text: 'Hello! Acme Dental, this is Sarah. How may I assist you today?' },
      { timestamp: '00:05', speaker: 'customer', text: 'Hi, do you accept Aetna PPO insurance?' },
      { timestamp: '00:10', speaker: 'ai', text: 'Yes, we are fully in-network with Aetna PPO for preventive care, fillings, and major services.' },
      { timestamp: '00:18', speaker: 'customer', text: 'Awesome. Is there parking at the clinic?' },
      { timestamp: '00:22', speaker: 'ai', text: 'Yes, we have free validated parking in the underground garage right under our building on 4th Avenue.' }
    ]
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-101',
    name: 'Q3 Enterprise Lead Follow-up',
    agentId: 'agent-sales',
    agentName: 'Alex — Outbound Lead Qualifier',
    status: 'running',
    createdAt: 'Sep 1, 2026',
    funnel: {
      contacts: 4500,
      callsPlaced: 3840,
      connected: 2610,
      qualified: 890,
      appointmentsBooked: 342
    },
    conversionRate: 13.1,
    avgDurationSec: 154
  },
  {
    id: 'camp-102',
    name: 'Patient Recall & Annual Checkups',
    agentId: 'agent-scheduler',
    agentName: 'Jordan — Appointment Setter',
    status: 'completed',
    createdAt: 'Aug 15, 2026',
    funnel: {
      contacts: 1800,
      callsPlaced: 1800,
      connected: 1420,
      qualified: 980,
      appointmentsBooked: 612
    },
    conversionRate: 43.1,
    avgDurationSec: 112
  },
  {
    id: 'camp-103',
    name: 'Real Estate VIP Buyer Outreach',
    agentId: 'agent-realestate',
    agentName: 'Marcus — Property Inquiries',
    status: 'running',
    createdAt: 'Sep 4, 2026',
    funnel: {
      contacts: 850,
      callsPlaced: 620,
      connected: 440,
      qualified: 190,
      appointmentsBooked: 78
    },
    conversionRate: 17.7,
    avgDurationSec: 168
  }
];

export const INDUSTRY_USE_CASES: IndustryUseCase[] = [
  {
    slug: 'healthcare',
    industry: 'Healthcare & Clinics',
    title: 'AI Receptionist & Appointment Booking for Clinics',
    headline: 'Never let a patient call go to voicemail again.',
    subheadline: 'Automate 24/7 patient call triage, appointment scheduling, insurance verification, and post-visit follow-ups with medical-grade empathy.',
    painPoints: [
      'Over 35% of patient calls during peak hours are abandoned or sent to voicemail',
      'Front-desk staff spend 4+ hours daily repeating basic clinic hours and directions',
      'High no-show rates cost average practices $150,000+ per physician annually'
    ],
    aiSolutions: [
      'Answers on the first ring, 24 hours a day, 365 days a year',
      'Direct integration with EHR and calendars (Epic, Athena, Google Cal)',
      'Automated SMS confirmations and interactive voice reminders'
    ],
    recommendedAgentCategory: 'healthcare',
    roiStats: [
      { label: 'Zero', value: '0 sec', description: 'Average patient hold time' },
      { label: 'Booking Rate', value: '+34%', description: 'Increase in scheduled appointments' },
      { label: 'Front-Desk Hours', value: '4.5 hrs', description: 'Saved per staff member every day' }
    ],
    exampleScript: [
      { speaker: 'customer', text: 'Hi, I need an appointment with Dr. Reed for a back checkup.' },
      { speaker: 'ai', text: 'I can certainly help you with that. Dr. Reed has an opening this Wednesday at 10:30 AM or Thursday at 2:00 PM. Which works best for you?' },
      { speaker: 'customer', text: 'Wednesday at 10:30 AM is perfect.' },
      { speaker: 'ai', text: 'You are all set for Wednesday at 10:30 AM. I have sent a confirmation text with your pre-visit digital check-in link.' }
    ]
  },
  {
    slug: 'real-estate',
    industry: 'Real Estate',
    title: 'Instant Lead Qualification & Showing Dispatch',
    headline: 'Respond to property inquiries within 15 seconds.',
    subheadline: 'Turn portal inquiries and yard sign calls into booked showings before prospective buyers contact competing brokerages.',
    painPoints: [
      '78% of buyers purchase with the agent who responds first',
      'Unqualified tire-kickers consume hours of top-producing agent time',
      'Weekend and evening inquiries slip through the cracks'
    ],
    aiSolutions: [
      'Sub-30 second outreach to Zillow, Realtor, and web inquiries',
      'Pre-qualification on budget, pre-approval status, and move-in timeline',
      'Auto-routes qualified buyers to senior agents with full conversation briefings'
    ],
    recommendedAgentCategory: 'real_estate',
    roiStats: [
      { label: 'Lead Response', value: '<15s', description: 'Average time to dial new inquiries' },
      { label: 'Showings Booked', value: '+42%', description: 'Boost in weekly home tours' },
      { label: 'Conversion', value: '2.8x', description: 'Higher appointment set rate' }
    ],
    exampleScript: [
      { speaker: 'ai', text: 'Hi Jordan! Marcus calling regarding the 3-bedroom home on Willow Creek you just inquired about online. Did you have a quick moment?' },
      { speaker: 'customer', text: 'Yes! Is it still on the market?' },
      { speaker: 'ai', text: 'It is active. Are you looking to move within the next 60 days, and have you already received lender pre-approval?' },
      { speaker: 'customer', text: 'Yes, pre-approved with Wells Fargo up to $750k and ready to buy.' },
      { speaker: 'ai', text: 'Wonderful. Let me schedule you for a private showing with our neighborhood specialist this Saturday at 11 AM.' }
    ]
  },
  {
    slug: 'sales',
    industry: 'B2B & High-Velocity Sales',
    title: 'High-Conversion Outbound Calling & Speed-to-Lead',
    headline: 'Reach every inbound lead in under 30 seconds.',
    subheadline: 'Scale outbound calling campaigns without adding headcount. CallioAI qualifies prospects, handles objections, and live-transfers ready buyers.',
    painPoints: [
      'Sales reps take an average of 42 hours to respond to new inbound leads',
      'Connect rates drop by 80% after the first 5 minutes',
      'Over half of an SDRs day is lost to voicemails and manual dialing'
    ],
    aiSolutions: [
      'Instant callback triggered automatically upon web form submission',
      'Natural conversational qualification (BANT / MEDDIC)',
      'Warm transfer directly to available account executives'
    ],
    recommendedAgentCategory: 'sales',
    roiStats: [
      { label: 'Speed to Lead', value: '28 sec', description: 'Average response time' },
      { label: 'Pipeline Generated', value: '3.4x', description: 'Increase in qualified demos' },
      { label: 'Cost per Demo', value: '-64%', description: 'Reduction in SDR operational spend' }
    ],
    exampleScript: [
      { speaker: 'ai', text: 'Hello David! Alex calling from CallioAI. I saw you just requested our volume pricing table. What kind of call volume is your team aiming to automate?' },
      { speaker: 'customer', text: 'We handle about 25,000 monthly inquiries across our regional branches.' },
      { speaker: 'ai', text: 'Got it. At that scale, our automated agents typically cut cost-per-minute by 70%. Can I introduce you to Sarah, our enterprise specialist, tomorrow at 3 PM?' }
    ]
  },
  {
    slug: 'customer-support',
    industry: 'Customer Support',
    title: 'Tier-1 Support Automation with Human Escalation',
    headline: 'Resolve 80% of customer support calls instantly.',
    subheadline: 'Empower customers with instant answers on order tracking, account questions, and troubleshooting, with zero waiting on hold.',
    painPoints: [
      'Customers endure 15+ minutes waiting in hold queues',
      'Support teams burn out answering the same 20 repetitive questions',
      'Late-night and holiday support requires costly overseas shifts'
    ],
    aiSolutions: [
      'Zero wait times: Infinite concurrent call handling capacity',
      'Trained on your knowledge base, FAQs, and help center articles',
      'Instant human handoff with full contextual transcript when needed'
    ],
    recommendedAgentCategory: 'customer_support',
    roiStats: [
      { label: 'Hold Time', value: '0 sec', description: 'Across all call volumes' },
      { label: 'First Contact', value: '88%', description: 'Resolution rate without escalation' },
      { label: 'Support Cost', value: '-52%', description: 'Total cost reduction per ticket' }
    ],
    exampleScript: [
      { speaker: 'customer', text: 'I made an order yesterday but haven’t received my tracking number yet.' },
      { speaker: 'ai', text: 'I can locate that for you right away. May I have the phone number or email linked to your order?' },
      { speaker: 'customer', text: 'Sure, it is 415-555-0199.' },
      { speaker: 'ai', text: 'Thank you! Your order #1084 shipped this morning via FedEx and is scheduled for delivery tomorrow before 5 PM. I have sent the tracking link to your phone.' }
    ]
  },
  {
    slug: 'education',
    industry: 'Education & EdTech',
    title: 'Student Admissions & Course Counseling',
    headline: 'Engage student applicants while enrollment intent is peak.',
    subheadline: 'Automate student inquiry triage, course curriculum questions, financial aid overviews, and counselor interviews.',
    painPoints: [
      'Prospective students abandon applications when questions go unanswered',
      'Admissions counselors overwhelmed during seasonal intake surges',
      'International applicants calling in varied timezones'
    ],
    aiSolutions: [
      '24/7 multi-language counseling and course guidance',
      'Automated interview and campus tour scheduling',
      'Personalized follow-up sequences across SMS and voice'
    ],
    recommendedAgentCategory: 'education',
    roiStats: [
      { label: 'Application Completion', value: '+45%', description: 'Higher yield on inquiries' },
      { label: 'Response Speed', value: 'Instant', description: 'Across global timezones' },
      { label: 'Counselor Productivity', value: '2.5x', description: 'More time spent with qualified applicants' }
    ],
    exampleScript: [
      { speaker: 'customer', text: 'Does your Data Science certificate program offer evening classes for working professionals?' },
      { speaker: 'ai', text: 'Yes! We host live evening cohorts on Tuesdays and Thursdays at 7 PM EST, plus weekend lab sessions. Would you like to join our info session this Thursday?' }
    ]
  },
  {
    slug: 'logistics',
    industry: 'Logistics & Supply Chain',
    title: 'Automated Dispatch & Driver Check-ins',
    headline: 'Automate driver check calls and delivery updates.',
    subheadline: 'Eliminate manual phone calls between dispatchers, drivers, and shippers. CallioAI handles ETA updates, load confirmations, and exception alerts.',
    painPoints: [
      'Dispatchers spend 60% of their workday making routine "Where are you?" check calls',
      'Shippers frustrated by lack of real-time transit visibility',
      'Missed night deliveries due to delayed gate access communication'
    ],
    aiSolutions: [
      'Automated outbound driver check calls capturing load status and ETA',
      'Integration with TMS (McLeod, Samsara, DAT) to update timestamps',
      'Automated escalation for breakdowns and detention delays'
    ],
    recommendedAgentCategory: 'sales',
    roiStats: [
      { label: 'Check Call Automation', value: '92%', description: 'Calls handled without dispatcher intervention' },
      { label: 'On-Time Visibility', value: '+38%', description: 'Improvement in customer tracking accuracy' },
      { label: 'Dispatcher Capacity', value: '3x', description: 'More loads managed per dispatcher' }
    ],
    exampleScript: [
      { speaker: 'ai', text: 'Hey Steve, automated check call from Apex Dispatch for load #9401. Are you still on schedule for your 2 PM receiver delivery in Dallas?' },
      { speaker: 'customer', text: 'Yeah, running smooth. About 45 miles out, ETA 1:40 PM.' },
      { speaker: 'ai', text: 'Got it Steve, updated the receiver. Gate code is 8842. Drive safe!' }
    ]
  }
];
