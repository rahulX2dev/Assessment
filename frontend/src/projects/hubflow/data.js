export const navigation = [
  {
    label: 'Platform',
    items: [
      { title: 'WhatsApp Campaigns', description: 'Broadcast, drip and transactional sends', icon: 'message' },
      { title: 'CRM Pipeline', description: 'Contacts, deals and lifecycle stages', icon: 'workflow' },
      { title: 'AI Assistant', description: 'Reply drafting, intent routing, summaries', icon: 'sparkles' },
      { title: 'Automation Studio', description: 'Visual triggers, conditions and actions', icon: 'puzzle' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      { title: 'Ed-Tech', description: 'Admission funnels and batch reminders', icon: 'book' },
      { title: 'Retail & D2C', description: 'Abandoned cart and order updates', icon: 'bag' },
      { title: 'Healthcare', description: 'Appointment reminders and follow-ups', icon: 'shield' },
      { title: 'Real Estate', description: 'Lead scoring and site-visit scheduling', icon: 'target' },
    ],
  },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#faq' },
]

export const trustedBy = [
  'Nexora Retail',
  'Vidyapeeth',
  'CarePoint Health',
  'Zentro Logistics',
  'Bluepeak Realty',
  'Orbit Fintech',
  'Marigold Foods',
]

export const stats = [
  { value: 48, suffix: 'M+', label: 'Messages delivered monthly' },
  { value: 3200, suffix: '+', label: 'Businesses running on Hubflow' },
  { value: 62, suffix: '%', label: 'Average lift in reply rate' },
  { value: 99.95, suffix: '%', label: 'Gateway uptime, trailing 12 months' },
]

export const features = [
  {
    icon: 'message',
    title: 'WhatsApp Business API',
    description:
      'Official Cloud API access with template management, quality-rating monitoring and per-number throughput controls.',
  },
  {
    icon: 'workflow',
    title: 'Pipeline-native CRM',
    description:
      'Contacts, companies, deals and custom fields with stage automation that fires the moment a record changes.',
  },
  {
    icon: 'sparkles',
    title: 'AI assistant',
    description:
      'Drafts replies in your brand voice, classifies incoming intent and summarises long threads before an agent opens them.',
  },
  {
    icon: 'bolt',
    title: 'High-throughput engine',
    description:
      'A C++ queue worker fans out bulk campaigns at sustained rates without starving transactional traffic.',
  },
  {
    icon: 'chart',
    title: 'Reports that reconcile',
    description:
      'Delivery, read, reply and revenue attribution computed from the same event ledger the billing engine reads.',
  },
  {
    icon: 'lock',
    title: 'Enterprise controls',
    description:
      'Role-based access, tenant isolation, audit trails, OTP-backed sign-in and encrypted credential storage.',
  },
]

export const workflowTabs = [
  {
    id: 'lead',
    label: 'Lead capture',
    trigger: 'Form submitted on landing page',
    steps: [
      { icon: 'user', title: 'Create contact', detail: 'Upsert into CRM by phone number' },
      { icon: 'sparkles', title: 'Score the lead', detail: 'AI service returns intent + priority' },
      { icon: 'message', title: 'Send welcome template', detail: 'WhatsApp utility template within 60s' },
      { icon: 'users', title: 'Assign owner', detail: 'Round-robin across the active sales pod' },
    ],
  },
  {
    id: 'cart',
    label: 'Abandoned cart',
    trigger: 'Cart idle for 45 minutes',
    steps: [
      { icon: 'bag', title: 'Pull cart contents', detail: 'Read line items from commerce webhook' },
      { icon: 'filter', title: 'Check suppression', detail: 'Skip if ordered or opted out' },
      { icon: 'send', title: 'Send recovery message', detail: 'Product card with a one-tap checkout link' },
      { icon: 'refresh', title: 'Escalate at 24h', detail: 'Follow-up with a limited discount code' },
    ],
  },
  {
    id: 'renewal',
    label: 'Renewal drive',
    trigger: 'Subscription ends in 14 days',
    steps: [
      { icon: 'calendar', title: 'Build audience', detail: 'Segment by plan, usage and health score' },
      { icon: 'megaphone', title: 'Queue campaign', detail: 'Batched through the C++ dispatch engine' },
      { icon: 'headset', title: 'Route replies', detail: 'Live replies land in the shared inbox' },
      { icon: 'card', title: 'Trigger invoice', detail: 'Billing service issues the renewal invoice' },
    ],
  },
]

export const conversation = [
  { from: 'business', text: 'Hi Ananya, your Physics batch starts Monday at 6 PM. Shall I reserve your seat?', time: '10:24' },
  { from: 'customer', text: 'Yes please. Can I pay in two instalments?', time: '10:26' },
  { from: 'ai', text: 'Intent detected: payment_plan_request - routed to Finance queue', time: '10:26' },
  { from: 'business', text: 'Absolutely. Here is a 2-part plan - 60% today, 40% on the 15th.', time: '10:27' },
  { from: 'customer', text: 'Perfect, sending the first payment now.', time: '10:29' },
]

export const pipelineStages = [
  { name: 'New', count: 184, value: '18.4L', tone: 'bg-ink-400' },
  { name: 'Qualified', count: 96, value: '12.7L', tone: 'bg-hub-400' },
  { name: 'Demo', count: 41, value: '8.2L', tone: 'bg-hub-500' },
  { name: 'Negotiation', count: 23, value: '5.9L', tone: 'bg-hub-600' },
  { name: 'Won', count: 17, value: '4.1L', tone: 'bg-emerald-500' },
]

export const integrations = [
  { name: 'WhatsApp', icon: 'message' },
  { name: 'Razorpay', icon: 'card' },
  { name: 'Shopify', icon: 'bag' },
  { name: 'Google Sheets', icon: 'grid' },
  { name: 'Zoho', icon: 'database' },
  { name: 'Slack', icon: 'headset' },
  { name: 'Zoom', icon: 'video' },
  { name: 'Webhooks', icon: 'code' },
  { name: 'S3 Storage', icon: 'cloud' },
  { name: 'Tally', icon: 'wallet' },
  { name: 'HubSpot', icon: 'workflow' },
  { name: 'Calendly', icon: 'calendar' },
]

export const testimonials = [
  {
    quote:
      'We moved 40,000 admission enquiries off spreadsheets in a fortnight. The automation studio replaced three separate tools and our counsellors finally answer on the same day.',
    name: 'Ritika Menon',
    role: 'Head of Growth, Vidyapeeth Learning',
    metric: '2.4x enquiry-to-enrolment',
  },
  {
    quote:
      'Delivery reporting used to be a guess. Now every campaign reconciles against the billing ledger, so finance and marketing argue a lot less.',
    name: 'Arjun Bhatt',
    role: 'VP Marketing, Nexora Retail',
    metric: '38% lower cost per order',
  },
  {
    quote:
      'The AI assistant drafts the first reply and our agents just approve it. Average first response went from 40 minutes to under two.',
    name: 'Sneha Kulkarni',
    role: 'Customer Ops Lead, CarePoint Health',
    metric: '<2 min first response',
  },
]

export const fallbackPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For small teams validating WhatsApp as a channel.',
    monthly: 2499,
    yearly: 24990,
    featured: false,
    features: [
      '2 team seats',
      '5,000 conversations / month',
      'Shared inbox and contact CRM',
      'Template library and approvals',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For growing revenue teams running always-on campaigns.',
    monthly: 7999,
    yearly: 79990,
    featured: true,
    features: [
      '10 team seats',
      '50,000 conversations / month',
      'Automation studio and lead scoring',
      'AI reply drafting and intent routing',
      'Campaign analytics and attribution',
      'Priority support with 4h SLA',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For multi-brand organisations with compliance needs.',
    monthly: 0,
    yearly: 0,
    featured: false,
    features: [
      'Unlimited seats and sub-accounts',
      'Dedicated throughput and IP pool',
      'SSO, audit logs and data residency',
      'HRMS and billing modules',
      'Named success manager',
    ],
  },
]

export const faqs = [
  {
    question: 'Do I need my own WhatsApp Business API approval?',
    answer:
      'No. Hubflow onboards your number through the official Cloud API, handles Meta business verification and manages template submissions. Most accounts are live within two working days.',
  },
  {
    question: 'How does Hubflow price conversations?',
    answer:
      'Your plan covers platform access and a monthly conversation allowance. Meta conversation charges are passed through at cost and shown as a separate line on every invoice, so there is no hidden markup.',
  },
  {
    question: 'Can Hubflow handle bulk campaigns without hurting transactional messages?',
    answer:
      'Yes. Bulk sends run through a dedicated C++ dispatch engine on a separate queue with its own rate limiter, so OTPs and order updates keep their own throughput budget.',
  },
  {
    question: 'What happens to my data if I leave?',
    answer:
      'You can export contacts, conversations, campaign logs and invoices as CSV or through the REST API at any time. On cancellation we retain data for 30 days, then purge it permanently.',
  },
  {
    question: 'Is there an on-premise or private-cloud option?',
    answer:
      'Enterprise plans can deploy into your own AWS account using our Helm charts. You keep the database and object storage; we ship signed container images and handle upgrades.',
  },
]

export const footerLinks = [
  {
    title: 'Product',
    links: ['Campaigns', 'CRM', 'Automation Studio', 'AI Assistant', 'Reports', 'Billing'],
  },
  {
    title: 'Solutions',
    links: ['Ed-Tech', 'Retail & D2C', 'Healthcare', 'Real Estate', 'Financial Services'],
  },
  {
    title: 'Developers',
    links: ['REST API', 'Webhooks', 'WebSocket events', 'Postman collection', 'Status'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Security', 'Privacy', 'Terms'],
  },
]
