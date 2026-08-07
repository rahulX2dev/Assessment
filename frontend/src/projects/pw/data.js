export const courseMenu = [
  {
    group: 'Competitive Exams',
    items: ['IIT JEE', 'NEET', 'Only IAS', 'GATE & ESE', 'Defence', 'CUET'],
  },
  {
    group: 'School Preparation',
    items: ['Class 6th-8th', 'Class 9th-10th', 'Class 11th-12th', 'School Boards', 'Foundation'],
  },
  {
    group: 'Govt Exam',
    items: ['Banking', 'SSC', 'Railway', 'Teaching', 'State PSC'],
  },
  {
    group: 'UG & PG Entrance',
    items: ['CUET UG', 'CUET PG', 'IPMAT', 'CLAT', 'NIFT'],
  },
  {
    group: 'Finance & Skills',
    items: ['CA Foundation', 'CS Executive', 'PW Skills', 'Semester Prep', 'Online Degrees'],
  },
  {
    group: 'More from PW',
    items: ['PW Talk', 'Gyaan-E', 'Study Abroad', 'Agriculture', 'PW Gulf'],
  },
]

export const headerNav = [
  { label: 'Vidyapeeth' },
  { label: 'PW Skills' },
  { label: 'PW Store' },
  { label: 'Class 1st - 8th' },
  { label: 'Power Batch' },
]

export const valueProps = [
  { value: 'Daily Live', label: 'Interactive classes', icon: 'video', tone: 'bg-rose-50 text-rose-500' },
  {
    value: '10 Million +',
    label: 'Tests, sample papers & notes',
    icon: 'file',
    tone: 'bg-sky-50 text-sky-500',
  },
  {
    value: '24 x 7',
    label: 'Doubt solving sessions',
    icon: 'message',
    tone: 'bg-violet-50 text-violet-500',
  },
  { value: '100 +', label: 'Offline centres', icon: 'award', tone: 'bg-amber-50 text-amber-500' },
]

export const examCategories = [
  {
    name: 'NEET',
    tags: ['Class 11', 'Class 12', 'Dropper'],
    icon: 'shield',
    arc: 'bg-rose-100/70',
    iconTone: 'text-rose-500',
  },
  {
    name: 'IIT JEE',
    tags: ['Class 11', 'Class 12', 'Dropper'],
    icon: 'cpu',
    arc: 'bg-orange-100/70',
    iconTone: 'text-orange-500',
  },
  {
    name: 'Pre Foundation',
    tags: [],
    icon: 'book',
    arc: 'bg-amber-100/70',
    iconTone: 'text-amber-500',
  },
  {
    name: 'School Boards',
    tags: ['CBSE', 'ICSE', 'UP Board', 'Maharashtra Board'],
    icon: 'layers',
    arc: 'bg-indigo-100/60',
    iconTone: 'text-indigo-500',
  },
  {
    name: 'UPSC',
    tags: [],
    icon: 'globe',
    arc: 'bg-sky-100/60',
    iconTone: 'text-sky-500',
  },
  {
    name: 'Govt Job Exams',
    tags: ['SSC', 'Banking', 'Teaching', 'Judiciary'],
    icon: 'award',
    arc: 'bg-ink-100',
    iconTone: 'text-ink-500',
  },
]

export const centreCities = [
  'Kota',
  'Bareilly',
  'Patna',
  'Noida',
  'New Delhi',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
]

export const batchFilters = ['All', 'IIT JEE', 'NEET', 'Class 11-12', 'UPSC']

export const batches = [
  {
    id: 'lakshya-jee-2026',
    name: 'Lakshya JEE 2026',
    category: 'IIT JEE',
    language: 'Hinglish',
    starts: '18 Aug 2026',
    price: 4200,
    mrp: 8500,
    seats: 'Limited seats',
    features: ['Live + recorded classes', 'DPP with solutions', 'Weekly mock tests'],
    faculty: ['Alakh Pandey', 'Saleem Ahmed'],
  },
  {
    id: 'yakeen-neet-2026',
    name: 'Yakeen NEET 2026',
    category: 'NEET',
    language: 'Hinglish',
    starts: '12 Aug 2026',
    price: 3800,
    mrp: 7600,
    seats: 'Filling fast',
    features: ['NCERT line-by-line', 'Biology handwritten notes', 'AIIMS-pattern tests'],
    faculty: ['Sachin Sir', 'Ritu Rattewal'],
  },
  {
    id: 'arjuna-11',
    name: 'Arjuna JEE Class 11',
    category: 'Class 11-12',
    language: 'Hinglish',
    starts: '05 Aug 2026',
    price: 2900,
    mrp: 5800,
    seats: 'Open',
    features: ['Foundation to advanced', 'Doubt sessions daily', 'Printed module included'],
    faculty: ['Prateek Jain', 'Nitesh Devnani'],
  },
  {
    id: 'prayas-upsc',
    name: 'Prayas UPSC CSE 2027',
    category: 'UPSC',
    language: 'English',
    starts: '25 Aug 2026',
    price: 6900,
    mrp: 14000,
    seats: 'Limited seats',
    features: ['GS Prelims + Mains', 'Answer writing evaluation', 'Current affairs digest'],
    faculty: ['Kumar Vaibhav', 'Anushka Rai'],
  },
  {
    id: 'nishtha-neet-dropper',
    name: 'Nishtha NEET Dropper',
    category: 'NEET',
    language: 'Hinglish',
    starts: '01 Aug 2026',
    price: 5100,
    mrp: 10200,
    seats: 'Filling fast',
    features: ['Full syllabus revision', '120+ full-length tests', 'Mentor call every week'],
    faculty: ['Sachin Sir', 'Sarvesh Sharma'],
  },
  {
    id: 'sankalp-jee-adv',
    name: 'Sankalp JEE Advanced',
    category: 'IIT JEE',
    language: 'English',
    starts: '22 Aug 2026',
    price: 5600,
    mrp: 11200,
    seats: 'Open',
    features: ['Advanced problem sets', 'Previous 20-year papers', 'One-on-one mentorship'],
    faculty: ['Alakh Pandey', 'Vidhi Bansal'],
  },
]

export const heroStats = [
  { value: 15000000, suffix: '+', label: 'Students taught' },
  { value: 24000, suffix: '+', label: 'Video lectures' },
  { value: 1000000, suffix: '+', label: 'Mock tests attempted' },
  { value: 175, suffix: '+', label: 'Cities with centres' },
]

export const studyResources = [
  {
    title: 'Reference Books',
    detail:
      'Our experts have created thorough study materials that break down complicated concepts into easily understandable content',
    icon: 'book',
    surface: 'bg-[#eef6ff]',
    iconTone: 'text-sky-500',
    cta: true,
  },
  {
    title: 'NCERT Solutions',
    detail:
      'Unlock academic excellence with Physics Wallah NCERT Solutions which provides you step-by-step solutions',
    icon: 'file',
    surface: 'bg-[#fdf1de]',
    iconTone: 'text-amber-500',
    arrow: true,
  },
  {
    title: 'Notes',
    detail:
      'Use Physics Wallah detailed study materials that simplify complex ideas into easily understandable language',
    icon: 'layers',
    surface: 'bg-[#e9f8f0]',
    iconTone: 'text-emerald-500',
  },
]

export const resultFilters = [
  'NEET UG Result 2026',
  'JEE Advanced Result 2026',
  'GATE',
  'Class 10 ICSE',
  'Class 10 CBSE',
  'Class 12 CBSE',
  'Bihar State Board class 12th',
]

export const toppers = [
  { rank: 'AIR - 55', name: 'Ravikant Diwakar' },
  { rank: 'AIR - 173', name: 'Divyansh Jaiswal' },
  { rank: 'AIR - 192', name: 'Sakshi Kumari' },
  { rank: 'AIR - 248', name: 'Ankit Gupta' },
  { rank: 'AIR - 251', name: 'Jiya Goyal' },
  { rank: 'AIR - 258', name: 'Nishita' },
  { rank: 'AIR - 293', name: 'Sudipta Fouzdar' },
  { rank: 'AIR - 318', name: 'Naitik Chand' },
  { rank: 'AIR - 321', name: 'Saksham Bhandari' },
  { rank: 'AIR - 330', name: 'Garv' },
  { rank: 'AIR - 396', name: 'Anmol Prabhu' },
  { rank: 'AIR - 408', name: 'Saksham Gupta' },
  { rank: 'AIR - 415', name: 'Shreya Rai' },
  { rank: 'AIR - 439', name: 'Khateeb Aftab' },
  { rank: 'AIR - 448', name: 'Vansh Chaurasia' },
  { rank: 'AIR - 450', name: 'Manjita' },
  { rank: 'AIR - 462', name: 'Rajiv Raiguru' },
  { rank: 'AIR - 537', name: 'Suryansh Bandhu Tyagi' },
  { rank: 'AIR - 565', name: 'Rishabh Jain' },
  { rank: 'AIR - 600', name: 'Shailendra Kumar' },
]

export const appHighlights = [
  'Live & recorded classes available at ease',
  'Dashboard for progress tracking',
  'Lakhs of practice questions',
]

export const featuredStory = {
  quote:
    'My name is Tathagat Awatar. I secured All India Rank 1 by scoring full score in NEET UG 2024. I started my preparation with Physics Wallah in 12th grade by joining the Lakshya NEET batch, then I took 2 drop by joining Yakeen NEET batch and I completed my full preparation from online PW batch. PW teachers and their guidance helps me to achieve AIR1 and motivated me during my drop year.',
  name: 'Multiple Rankers',
  credential: 'AIR 1 | NEET',
  videoTitle: 'DARK Story',
  videoSubtitle: '12 saal se sirf 4 ghante so raha',
}

export const studentStories = [
  {
    quote:
      'I used to regularly follow the youtube videos, prelims booster videos and specially editorial discussion from where I made important pointers. I also watched some history videos like Buddhism, Jainism as the topics were explained very clearly, all those were very helpful.',
    name: 'Anmol Rathore',
    credential: 'UPSC CSE 2023 AIR 7 | UPSC',
  },
  {
    quote:
      'I am Raja Majhi, and I am thrilled to share that I have secured All India Rank 1 (AIR 1) in the GATE 2024 examination in ECE. From the very beginning, Physics Wallah stood out for its structured and comprehensive curriculum.',
    name: 'Raja Majhi',
    credential: 'GATE 2024 AIR 1 | GATE',
  },
  {
    quote:
      'PW helped me in establishing the basics of every subject through which I was able to progress quickly and was also able to increase my speed and also maintaining accuracy.',
    name: 'Amit Kumar Mandal',
    credential: 'IBPS Topper | Banking',
  },
]

export const youtubeChannels = [
  { name: 'Physics Wallah', subscribers: '11.5M Subscribers', featured: true },
  { name: 'Competition Wallah', subscribers: '2.71M Subscribers' },
  { name: 'JEE Wallah', subscribers: '1.69M Subscribers' },
  { name: 'NCERT Wallah', subscribers: '1.35M Subscribers' },
]

export const pwFooter = [
  {
    title: 'Company',
    links: ['About Us', 'Contact Us', 'Careers', 'Updates', 'Account Deletion'],
  },
  {
    title: 'Our Centres',
    links: ['New Delhi', 'Patna', 'Kota', 'Noida', 'Dhanbad', 'Varanasi', 'View All'],
  },
  {
    title: 'Popular Exams',
    links: ['IIT JEE', 'NEET', 'GATE', 'Defence', 'UPSC', 'School Prep', 'PWSAT'],
  },
  {
    title: 'Connect with us',
    links: ['Email us', 'Talk to a counsellor'],
  },
  {
    title: 'Quick Links',
    links: ['PW Prerna', 'PW SIP', 'PW Gurukulam', 'NIOS', 'Alakh Sir Notes', 'Investor Relations'],
  },
  {
    title: 'Our Products',
    links: ['PW Learning App', 'PW Offline Payments'],
  },
]

export const learningResources = [
  {
    title: 'PW Study Materials',
    links: [
      'Class 10 Sample Paper',
      'Class 10th Study Material',
      'Arjuna JEE Modules',
      'JEE 8 Years PYQ',
      'JEE 45 Years PYQ',
      'Yakeen NEET Modules',
      'NCERT Punch',
    ],
  },
  {
    title: 'PW Books',
    links: [
      'NEET Books',
      'JEE Books',
      'School Prep Books',
      'UPSC CSE Books',
      'NDA Defence Books',
      'RRB Books',
      'SSC Books',
    ],
  },
  {
    title: 'Notes (Class 6-9)',
    links: [
      'Class 6 Theory Notes',
      'Maths Notes for class 7',
      'Science Notes for class 7',
      'Class 8 Physics Notes',
      'Class 8 Biology Notes',
      'Class 8 SST Notes',
      'Class 9 Maths Notes',
    ],
  },
  {
    title: 'Notes (Class 10-12)',
    links: [
      'Class 10 Maths Notes',
      'Class 10 Chemistry Notes',
      'Class 10 Physics Notes',
      'Aptitude & Reasoning',
      'Class 11 Chemistry Notes',
      'Maths Notes Class 11',
      'Zoology Class 12',
    ],
  },
  {
    title: 'Govt Exams',
    links: [
      'SSC Exams',
      'Banking Exams',
      'Teaching Exams',
      'JAIIB CAIIB Exams',
      'Railway Exams',
      'Defence Exams',
      'Judiciary Exams',
    ],
  },
  {
    title: 'Ncert Solutions',
    links: [
      'NCERT Solutions for Class 6',
      'NCERT Solutions for class 7',
      'NCERT Solutions for class 8',
      'NCERT Solutions for class 9',
      'NCERT Solutions for class 10',
      'NCERT Solutions for class 11',
      'NCERT Solutions for class 12',
    ],
  },
  {
    title: 'Entrance Exams',
    links: [
      'Gate Exam',
      'IIT JAM Exam',
      'NEET Exam',
      'CUET Exam',
      'CSIR NET Exam',
      'MBA Exam',
      'Nursing Exam',
    ],
  },
  {
    title: 'Offline centres',
    links: [
      'Vidyapeeth',
      'OnlyIAS UPSC Centers',
      'Superkalam',
      'Short wallah Coaching centres',
      'Defence Coaching centres',
      'Vidyapeeth Blogs',
    ],
  },
]

export const socialLinks = ['globe', 'message', 'video', 'mail', 'send']
