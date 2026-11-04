import type {
  AdminInquiry,
  AdminMasterItem,
  AdminPackage,
  AdminPostApproval,
  AdminSearchTerm,
  BlogPost,
  BlogSummary,
  Category,
  Device,
  Emotion,
  EventSummary,
  HomeEvent,
  Listing,
  MyListing,
  User,
  Vendor,
} from '@/src/types';


export const SITE = {
  name: 'Tinyadds',
  tagline: 'Connecting you with reliable local contractors for all your service needs.',
  copyright: 'Amitaujas LLP',
  copyrightUrl: 'https://amitaujas.com',
};

export const CATEGORIES: Category[] = [
  { slug: 'automotive', name: 'Automotive', short: 'Automotive', image: '/assets/img/cat-1.png' },
  { slug: 'communication-services', name: 'Communication Services', short: 'Comm Services', image: '/assets/img/cat-2.png' },
  { slug: 'retail', name: 'Retail', short: 'Retail', image: '/assets/img/cat-3.png' },
  { slug: 'healthcare', name: 'Healthcare', short: 'Healthcare', image: '/assets/img/cat-4.png' },
  { slug: 'education', name: 'Education', short: 'Education', image: '/assets/img/cat-5.png' },
  { slug: 'financial-services', name: 'Financial Services', short: 'Financial Services', image: '/assets/img/cat-6.png' },
  { slug: 'publishing', name: 'Publishing', short: 'Publishing', image: '/assets/img/cat-7.png' },
  { slug: 'support', name: 'Support', short: 'Support', image: '/assets/img/cat-8.png' },
  { slug: 'travel', name: 'Travel', short: 'Travel', image: '/assets/img/cat-9.png' },
  { slug: 'media-and-entertainment', name: 'Media and Entertainment', short: 'Media & Ent', image: '/assets/img/cat-10.png' },
  { slug: 'logistics-and-distribution', name: 'Logistics and Distribution', short: 'Logistics & Dist', image: '/assets/img/cat-11.png' },
  { slug: 'utilities', name: 'Utilities', short: 'Utilities', image: '/assets/img/cat-12.png' },
];

export const EMOTIONS: Emotion[] = [
  { slug: 'happy', name: 'Happy', image: '/assets/img/Happy.png' },
  { slug: 'sad', name: 'Sad', image: '/assets/img/Sad.png' },
  { slug: 'exciting', name: 'Exciting', image: '/assets/img/Exiting.png' },
  { slug: 'corporate', name: 'Corporate', image: '/assets/img/Corporate.png' },
  { slug: 'surprise', name: 'Surprise', image: '/assets/img/Surprise.png' },
];

export const HERO_CITIES = ['Vadodara', 'Surat', 'Deesa', 'Anand', 'Palanpur'];

export const FILTER_CITIES = [
  'Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Surat',
  'Vadodara', 'Lucknow', 'Indore', 'Nagpur', 'Bhopal', 'Chandigarh', 'Coimbatore', 'Kochi', 'Patna', 'Ranchi',
];

export const SORT_OPTIONS: { value: 'popular' | 'rated' | 'recent'; label: string }[] = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rated', label: 'Best rated' },
  { value: 'recent', label: 'Most recent' },
];

export const HERO_SLIDES = [
  '/assets/img/home/city-guide/hero/01.png',
  '/assets/img/home/city-guide/hero/02.png',
];

export const UPCOMING_EVENTS = [
  { id: 'u1', title: 'Simon Blues Concert', date: 'Nov 15', time: '19:00', image: '/assets/img/home/city-guide/events/01.jpg' },
  { id: 'u2', title: 'The Concert in Palau Sant Jordi', date: 'Oct 28', time: '21:00', image: '/assets/img/home/city-guide/events/02.jpg' },
  { id: 'u3', title: 'Dance About Passion: Tango Show', date: 'Sep 7', time: '81:30', image: '/assets/img/home/city-guide/events/03.jpg' },
];

const TEMPLATES = [
  { title: 'Chicago Business Conference', city: 'Chicago', type: 'Conference', date: 'Sep 23', time: '18:00' },
  { title: 'Classic Music Evening', city: 'Boston', type: 'Concert', date: 'Nov 8', time: '17:30' },
  { title: 'Sunset Disco Party', city: 'San Francisco', type: 'Disco', date: 'Oct 16', time: '22:00' },
];

/** Demo data generator. Replace with a real API call in src/lib/api.js. */
export function buildListings(categorySlug = 'automotive'): Listing[] {
  return Array.from({ length: 96 }, (_, i) => {
    const t = TEMPLATES[i % TEMPLATES.length];
    return {
      id: String(i + 1),
      ...t,
      image: '/assets/img/Add-1.png',
      category: categorySlug,
      emotion: EMOTIONS[i % EMOTIONS.length].slug,
      popularity: (i * 37) % 100,
      rating: 3 + ((i * 7) % 20) / 10,
      createdAt: new Date(2026, 0, 1 + i).toISOString(),
    };
  });
}

export const HOME_EVENTS: HomeEvent[] = TEMPLATES.map((t, i) => ({
  id: `h${i + 1}`,
  ...t,
  image: '/assets/img/Add-1.png',
  category: CATEGORIES[i].slug,
  popularity: 90 - i * 10,
  rating: 4.5 - i * 0.3,
  createdAt: new Date(2026, 0, 10 + i).toISOString(),
}));

// Blog images are the demo-template pictures; swap for /public paths when real assets exist.
const BLOG_IMG = 'https://html.aqlova.com/listbnb-prv/listbnb/assets/img';
const BLOG_EXCERPT =
  "In a world brimming with opportunities, it's disheartening to know that not everyone has equal access to education. Education is the cornerstone of progress and personal.";

export const BLOG_PAGE_SIZE = 6;

export const BLOGS: BlogSummary[] = [
  {
    slug: 'buildings-and-other-physical-structures',
    title: 'Buildings and other physical structures, as well as the profession...',
    tag: 'classified',
    date: 'March 8, 2023',
    image: `${BLOG_IMG}/blog/blog-details-1.jpg`,
    excerpt: BLOG_EXCERPT,
    comments: 23,
    views: '2000+',
    keywords: ['Architecture', 'Design'],
  },
  {
    slug: 'powered-by-nvidia-ada-lovelace-architecture',
    title: 'It’s powered by the NVIDIA Ada Lovelace architecture and comes',
    tag: 'classified',
    date: 'March 8, 2023',
    image: `${BLOG_IMG}/blog/blog-details-2.jpg`,
    excerpt: BLOG_EXCERPT,
    comments: 23,
    views: '2000+',
    keywords: ['Renovation', 'Construction'],
  },
  {
    slug: '16-gb-of-g6x-memory-for-gamers',
    title: 'With 16 GB of G6X memory to deliver the ultimate experience for gamers',
    tag: 'classified',
    date: 'March 8, 2023',
    image: `${BLOG_IMG}/blog/blog-details-3.jpg`,
    gallery: [
      `${BLOG_IMG}/blog/blog-details-3.jpg`,
      `${BLOG_IMG}/blog/blog-details-2.jpg`,
      `${BLOG_IMG}/blog/blog-details-1.jpg`,
    ],
    excerpt: BLOG_EXCERPT,
    comments: 23,
    views: '2000+',
    keywords: ['Soil', 'Rebuild'],
  },
  {
    slug: '22-4-power-supply-and-16-pin-connector',
    title: 'This graphics card has a 22+4 power supply and a 16-pin power connector.',
    tag: 'classified',
    date: 'March 8, 2023',
    image: `${BLOG_IMG}/blog/blog-details-4.jpg`,
    excerpt: BLOG_EXCERPT,
    comments: 23,
    views: '2000+',
    keywords: ['Interior', 'Architecture'],
  },
  {
    slug: 'recommended-power-input-and-tdp',
    title: 'Its recommended power input is One 16-Pin , & its TDP is 460W.',
    tag: 'classified',
    date: 'March 8, 2023',
    image: `${BLOG_IMG}/blog/blog-details-5.jpg`,
    excerpt: BLOG_EXCERPT,
    comments: 23,
    views: '2000+',
    keywords: ['Design', 'Renovation'],
  },
  {
    slug: 'need-to-avoid-redirect-couple-our-design',
    title: 'Need to avoid redirect couple our design',
    tag: 'classified',
    date: 'November 21, 2022',
    image: `${BLOG_IMG}/blog/blog-details-4.jpg`,
    thumb: `${BLOG_IMG}/blog/details-sm-1-1.jpg`,
    excerpt: BLOG_EXCERPT,
    comments: 12,
    views: '1500+',
    keywords: ['Construction', 'Interior'],
  },
  {
    slug: 'this-graphics-card-has-a-22-4-power',
    title: 'This graphics card has a 22+4 power',
    tag: 'classified',
    date: 'November 21, 2022',
    image: `${BLOG_IMG}/blog/blog-details-5.jpg`,
    thumb: `${BLOG_IMG}/blog/details-sm-1-2.jpg`,
    excerpt: BLOG_EXCERPT,
    comments: 12,
    views: '1500+',
    keywords: ['Soil', 'Architecture'],
  },
  {
    slug: 'for-gamers-and-creators',
    title: 'For gamers and creators.',
    tag: 'classified',
    date: 'November 21, 2022',
    image: `${BLOG_IMG}/blog/blog-details-1.jpg`,
    thumb: `${BLOG_IMG}/blog/details-sm-1-3.jpg`,
    excerpt: BLOG_EXCERPT,
    comments: 12,
    views: '1500+',
    keywords: ['Rebuild', 'Design'],
  },
  {
    slug: 'to-deliver-the-ultimate-experience',
    title: 'To deliver the ultimate experience',
    tag: 'classified',
    date: 'November 21, 2022',
    image: `${BLOG_IMG}/blog/blog-details-2.jpg`,
    thumb: `${BLOG_IMG}/blog/details-sm-1-4.jpg`,
    excerpt: BLOG_EXCERPT,
    comments: 12,
    views: '1500+',
    keywords: ['Interior', 'Renovation'],
  },
];

/** Article copy shown on every blog details page (mock – same text for each slug). */
export const BLOG_POST: Omit<BlogPost, keyof BlogSummary> = {
  paragraphs: [
    "In a world brimming with opportunities, it's disheartening to know that not everyone has equal access to education. Education is the cornerstone of progress and personal growth, yet countless communities around the globe struggle to provide quality learning experiences for their children. This blog post delves into the profound significance of supporting education initiatives in underserved communities and how they can pave the way for a brighter future.",
    "It's no secret that access to quality education is unevenly distributed. Many children in underserved communities lack proper school infrastructure, qualified teachers, and essential learning resources. This disparity creates a cycle of disadvantage that persists from one generation to the next. Addressing this divide is crucial for breaking the chains of poverty and fostering sustainable development. Education is more than just acquiring facts; it's about empowerment. When we invest in education, we equip individuals with the tools they need to think critically, solve problems, and make informed decisions. Education empowers children to dream beyond their circumstances and envision a world of possibilities. It's a catalyst for personal growth, self-confidence, and social mobility. Education doesn't just benefit individuals; it transforms entire communities. Educated individuals become agents of change, driving progress and innovation in their societies. By nurturing a culture of learning, underserved communities can break free from cycles of poverty, reduce crime rates, and contribute positively to economic development.",
    "Education is more than just acquiring facts; it's about empowerment. When we invest in education, we equip individuals with the tools they need to think critically, solve problems, and make informed decisions. Education empowers children to dream beyond their circumstances and envision a world of possibilities. It's a catalyst for personal growth, self-confidence, and social mobility. Education doesn't just benefit individuals; it transforms entire communities. Educated individuals become agents of change, driving progress and innovation in their societies. By nurturing a culture of learning, underserved communities can break free from cycles of poverty, reduce crime rates, and contribute positively to economic development.",
    'Educated individuals become agents of change, driving progress and innovation in their societies. By nurturing a culture of learning, underserved communities can break free from cycles of poverty, reduce crime rates, and contribute positively to economic development is not only easy.',
    "In a world brimming with opportunities, it's disheartening to know that not everyone has equal access to education. Education is the cornerstone of progress and personal growth, yet countless communities around the globe struggle to provide quality learning experiences for their children. This blog post delves into the profound significance of supporting education initiatives in underserved communities and how they can pave the way for a brighter future.",
  ],
  inlineImage: `${BLOG_IMG}/blog/blog-details-5.jpg`,
  quote: {
    text: 'This quote emphasizes the significance of charity as an essential virtue that allows compassion and benevolence to flow from one person',
    name: 'Ronald D. Dowson',
    role: 'CTO, Dowson Co.',
    avatar: `${BLOG_IMG}/avata/avata-8-1.png`,
  },
  tags: ['Find', 'Classified', 'ROI'],
  commentList: [
    {
      name: 'Tromas H. Hendson',
      date: 'Nov 9, 2023',
      avatar: `${BLOG_IMG}/avata/avata-8-2.png`,
      text: 'Variations in the floor plan, window location, and interstitial outdoor spaces enhance this material homogeneity. The goal was to produce a unified whole using a modern design language, where attention to materiality and detail is evident. All flats have two sides and are in close proximity to the outside world.',
    },
    {
      name: 'Tromas H. Hendson',
      date: 'Nov 9, 2023',
      avatar: `${BLOG_IMG}/avata/avata-8-3.png`,
      text: 'Variations in the floor plan, window location, and interstitial outdoor spaces enhance this material homogeneity. The goal was to produce a unified whole using a modern design language, where attention to materiality and detail is evident.',
    },
    {
      name: 'Tromas H. Hendson',
      date: 'Nov 9, 2023',
      avatar: `${BLOG_IMG}/avata/avata-8-4.png`,
      text: 'Variations in the floor plan, window location, and interstitial outdoor spaces enhance this material homogeneity. The goal was to produce a unified whole using a modern design language, where attention to materiality and detail is evident. All flats have two sides and are in close proximity to the outside world.',
    },
  ],
};

export const BENEFITS = [
  'Looking for a smarter way to promote your business without overspending? Tiny Adds is designed to deliver big results through simple, targeted advertising.',
  'With Tiny Adds, you can reach the right audience at the right time. Our platform ensures your ads are seen by people who actually care about your product or service—boosting engagement and improving conversion rates.',
  'Track your performance in real time. Get clear insights, understand what’s working, and optimize your campaigns for even better results.',
  'Start small. Grow big. With Tiny Adds, powerful advertising is finally within reach.',
];

export const SERVICES = [
  ['Cloud Based Product Development', 'Build scalable and reliable cloud products that help your business grow and adapt efficiently'],
  ['ERP System Implementation', 'Implement ERP systems smoothly to streamline your operations and improve productivity across teams'],
  ['Accounting And Auditing Services', 'Get professional accounting and auditing services to keep your finances accurate, transparent, and compliant'],
  ['Finance Advisory Services', 'Manage your finances confidently with expert guidance on planning, budgeting, and financial decisions'],
  ['Social Media marketing', 'Promote your brand effectively with strategic and engaging social media campaigns across platforms'],
  ['Website Development', 'Design and develop modern, responsive websites that connect with your audience and drive results'],
  ['Domain Name Registration', 'Secure your online presence with reliable domain registration services and protect your brand identity online'],
  ['Web Hosting & Maintenance', 'Keep your website running smoothly with reliable, fast, and secure web hosting solutions you can trust'],
  ['SSL Certificate Installation', 'Protect your website and users with trusted SSL certificates to ensure safe and secure online connections'],
  ['Corporate Branding Solutions', 'Build a strong and memorable corporate identity that strengthens your brand and reputation'],
  ['Mobile Application Development', 'Create easy-to-use and engaging mobile apps for Android and iOS to enhance user experience and reach'],
  ['Digital Marketing & Strategy', 'Grow your business online with effective digital marketing strategies that attract and engage customers'],
  ['Search Engine Optimization', 'Improve your website’s visibility and attract more visitors with practical and effective SEO techniques'],
].map(([title, text]) => ({ title, text }));

export const PRINCIPLES = [
  ['Commitment to quality', 'We feature only the top contractors who excel in craftsmanship and professionalism, ensuring every project meets the highest standards of quality.'],
  ['Dependability and trust', 'We connect you with reliable contractors who are punctual, responsive, and consistent, guaranteeing your project remains on schedule and within scope.'],
  ['Full transparency', 'We emphasize clarity and openness, offering detailed contractor profiles with credentials, past projects.'],
  ['Client-centric approach', "Share experiences and helping us continually enhance our platform's service quality."],
  ['Integrity in every interaction', 'We maintain the highest ethical standards, ensuring our contractors follow fair practices and professional conduct throughout their engagements.'],
].map(([title, text], i) => ({ title, text, image: `/assets/img/about/v2/principles/0${i + 1}.jpg` }));

export const STORY = [
  ['2022', 'The vision takes shape', 'In early 2022, a team with backgrounds in construction, technology, and customer service saw a pressing need in the market.'],
  ['2023', 'Building trust', 'After a successful beta launch in late 2022, the platform officially went live, quickly gaining traction among homeowners and business owners.'],
  ['2024', 'Leading the market', "The platform's reputation for reliability and client satisfaction attracted a growing user base, leading to exponential growth."],
  ['2025', 'The future ahead', 'As Finder Contractor looks to the future, the team remains dedicated to refining the platform and expanding its reach.'],
].map(([year, title, text]) => ({ year, title, text }));

export const TESTIMONIALS = [
  ['Liza Rogers', 'One-time cleaning service', 'I had a fantastic experience using Finder for my office remodel. The platform is very user-friendly, with an intuitive interface that makes searching and comparing contractors a breeze. I particularly appreciated the seamless project management tools.'],
  ['Michael Howard', 'Fence installation & repair', 'Finder has become my go-to platform for all my contracting needs. As a property manager, I often need reliable contractors for various maintenance and renovation projects. Finder Contractor provides a comprehensive list of professionals.'],
  ['Kristin Watson', 'Gutter service', 'The detailed profiles and client reviews made it easy to choose the right professional for the job. The advanced search filters allowed me to narrow down my options based on my specific needs and budget.'],
  ['Kristin Watson', 'Website user', 'Using this site to find a local contractor was a game-changer for my home renovation. The listings were clear and detailed, making it easy to compare services and read reviews. I found a reliable contractor quickly, and the entire process was smooth and hassle-free.'],
].map(([name, role, text], i) => ({ name, role, text, avatar: `/assets/img/about/v2/avatars/0${i + 1}.jpg` }));

export const TEAM: string[] = ['Kristin Watson', 'Liza Rogers', 'Cody Fisher', 'Michael Howard', 'Jacob Jones', 'Darrell Steward'];

export const PARTNERS = [
  'Our collaboration with innovative technology providers enhances the user experience.',
  'Integrating cutting-edge tools and software, we offer advanced features like AI-powered search.',
  'Flexible loan solutions and payment plans, making it easier to fund renovation.',
  'Provide our users with access to a broad range of high-quality materials and resources.',
];

const BIO =
  "Extensive experience in rentals and a vast database means I can quickly find the options that are right for you. Looking for a seamless and exciting rental experience? Contact me today - I promise it won't be boring! Your perfect home is just a call away.";

export const USER: User = {
  name: 'Kalpesh Rathod',
  firstName: 'Kalpesh',
  lastName: 'Rathod',
  email: 'kalpesh@example.com',
  phone: '(212) 555-7890',
  address: 'BHayli, Vadodara',
  bio: BIO,
  avatarSm: '/assets/img/account/avatar-sm.jpg',
  avatar: '/assets/img/account/avatar.jpg',
  avatarLg: '/assets/img/account/avatar-lg.jpg',
};

export const VENDOR: Vendor = {
  id: '1',
  name: 'Naman Gami',
  location: 'Bhayli, Vadodara',
  phone: '+91 76088284',
  email: 'naman@example.com',
  lastVisited: '2 hours ago',
  bio: BIO,
  avatar: '/assets/img/blog/v1/single/avatar.jpg',
  cover: '/assets/img/listings/real-estate/vendor-cover.jpg',
  stats: [
    ['3 years', 'Works with Finder'],
    ['26', 'Advertise'],
    ['4.9', 'Finder overall rating'],
  ],
};

export const VENDOR_POSTS: EventSummary[] = [1, 2, 3, 4].map((n) => ({
  id: `v${n}`,
  title: 'Chicago Business Conference',
  city: 'Chicago',
  type: 'Conference',
  date: 'Sep 23',
  time: '18:00',
  image: '/assets/img/listings/events/13.jpg',
}));

export const MY_LISTINGS: MyListing[] = [
  { id: 'm1', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Sad', created: '19/05/2024', image: '/assets/img/Add-1.png' },
  { id: 'm2', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Happy', created: '19/05/2024', image: '/assets/img/Add-1.png' },
  { id: 'm3', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Sad', created: '19/05/2024', image: '/assets/img/Add-1.png' },
  { id: 'm4', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Happy', created: '19/05/2024', image: '/assets/img/Add-1.png' },
  { id: 'm5', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Happy', created: '19/05/2024', image: '/assets/img/Add-1.png' },
];

export const DEVICES: Device[] = [
  { id: 'd1', name: 'Mac - New York, USA', meta: 'Chrome', status: 'Active now' },
  { id: 'd2', name: 'iPhone 15 - New York, USA', meta: 'Finder App', status: '20 hours ago' },
];

export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian'];


export const ADMIN_POST_APPROVALS: AdminPostApproval[] = [
  {
    id: 'appr-1',
    title: 'Precision CNC Machining & Lathe Works',
    category: 'Logistics and Distribution',
    city: 'Vadodara',
    vendorName: 'Naman Gami',
    submittedAt: '2 hours ago',
    price: '₹15,000 / order',
    status: 'pending',
    image: '/assets/img/cat-11.png',
  },
  {
    id: 'appr-2',
    title: 'Solar Rooftop Installation and Net-metering',
    category: 'Utilities',
    city: 'Surat',
    vendorName: 'GreenTech Energy',
    submittedAt: '5 hours ago',
    price: '₹45,000 onwards',
    status: 'pending',
    image: '/assets/img/cat-12.png',
  },
  {
    id: 'appr-3',
    title: 'Corporate Event AV Setup & Stage Lighting',
    category: 'Media and Entertainment',
    city: 'Ahmedabad',
    vendorName: 'Vibe Sound Systems',
    submittedAt: 'Yesterday',
    price: '₹22,000 / day',
    status: 'approved',
    image: '/assets/img/cat-10.png',
  },
  {
    id: 'appr-4',
    title: 'High-speed Fiber Broadband for SMEs',
    category: 'Communication Services',
    city: 'Anand',
    vendorName: 'NetLink Gujarat',
    submittedAt: '2 days ago',
    price: '₹999 / mo',
    status: 'rejected',
    image: '/assets/img/cat-2.png',
  },
];

export const ADMIN_PACKAGES: AdminPackage[] = [
  {
    id: 'pkg-starter',
    name: 'Starter Business',
    price: 499,
    period: 'month',
    listingLimit: 5,
    features: ['5 Active Listings', 'Standard Search Placement', 'Direct Buyer Inquiries', 'Email Support'],
    isPopular: false,
    status: 'active',
  },
  {
    id: 'pkg-growth',
    name: 'Growth Professional',
    price: 1499,
    period: 'month',
    listingLimit: 25,
    features: [
      '25 Active Listings',
      'Featured Badge on Listings',
      'Priority Search Ranking',
      'Direct WhatsApp Leads',
      'Monthly Analytics Report',
    ],
    isPopular: true,
    status: 'active',
  },
  {
    id: 'pkg-enterprise',
    name: 'Enterprise Leader',
    price: 3999,
    period: 'month',
    listingLimit: 100,
    features: [
      'Unlimited / 100 Active Listings',
      'Top-of-Search Sticky Boost',
      'Dedicated Account Manager',
      'Banner Display Ads across Portal',
      'Custom Emotion & Category Tags',
    ],
    isPopular: false,
    status: 'active',
  },
];

export const ADMIN_SEARCH_TERMS: AdminSearchTerm[] = [
  { id: 'st-1', term: 'Electrician near me', category: 'Support', city: 'Vadodara', count: 1420, lastSearched: '10 mins ago', trend: 'up' },
  { id: 'st-2', term: 'Used car detailing', category: 'Automotive', city: 'Surat', count: 1180, lastSearched: '25 mins ago', trend: 'up' },
  { id: 'st-3', term: 'Office interior design', category: 'Retail', city: 'Ahmedabad', count: 940, lastSearched: '1 hour ago', trend: 'stable' },
  { id: 'st-4', term: 'AC repair and gas refill', category: 'Utilities', city: 'Anand', count: 820, lastSearched: '2 hours ago', trend: 'down' },
  { id: 'st-5', term: 'Dental clinic appointment', category: 'Healthcare', city: 'Vadodara', count: 710, lastSearched: '3 hours ago', trend: 'up' },
  { id: 'st-6', term: 'IELTS coaching classes', category: 'Education', city: 'Palanpur', count: 590, lastSearched: '5 hours ago', trend: 'stable' },
];

export const ADMIN_MASTER_ITEMS: AdminMasterItem[] = [
  { id: 'mi-1', type: 'category', name: 'Automotive', slug: 'automotive', status: 'active', itemCount: 42 },
  { id: 'mi-2', type: 'category', name: 'Communication Services', slug: 'communication-services', status: 'active', itemCount: 28 },
  { id: 'mi-3', type: 'category', name: 'Healthcare', slug: 'healthcare', status: 'active', itemCount: 35 },
  { id: 'mi-8', type: 'manage-cms', name: 'Terms of Service Page', slug: 'terms-of-service', status: 'active', itemCount: 1 },
  { id: 'mi-9', type: 'manage-cms', name: 'Privacy Policy Page', slug: 'privacy-policy', status: 'active', itemCount: 1 },
  { id: 'mi-10', type: 'manage-marquee', name: 'Diwali Festive Boost: 20% Off Listing Packages', slug: 'diwali-festive-boost', status: 'active', itemCount: 1 },
  { id: 'mi-11', type: 'tax-master', name: 'GST 18% (Standard Services)', slug: 'gst-18', status: 'active', itemCount: 18 },
  { id: 'mi-12', type: 'tax-master', name: 'GST 5% (Essential Services)', slug: 'gst-5', status: 'active', itemCount: 5 },
  { id: 'mi-13', type: 'success-stories', name: 'Shree Sai Motors 300% Growth Story', slug: 'shree-sai-motors', status: 'active', itemCount: 1 },
  { id: 'mi-14', type: 'user', name: 'Kishan Dave (Vendor Admin)', slug: 'kishan-dave', status: 'active', itemCount: 12 },
  { id: 'mi-15', type: 'user', name: 'Neha Joshi (Verified Merchant)', slug: 'neha-joshi', status: 'active', itemCount: 7 },
  { id: 'mi-16', type: 'country', name: 'India', slug: 'india', status: 'active', itemCount: 240 },
  { id: 'mi-17', type: 'country', name: 'United Arab Emirates', slug: 'uae', status: 'active', itemCount: 18 },
  { id: 'mi-18', type: 'state', name: 'Gujarat', slug: 'gujarat', status: 'active', itemCount: 185 },
  { id: 'mi-19', type: 'state', name: 'Maharashtra', slug: 'maharashtra', status: 'active', itemCount: 55 },
  { id: 'mi-20', type: 'city', name: 'Vadodara', slug: 'vadodara', status: 'active', itemCount: 120 },
  { id: 'mi-21', type: 'city', name: 'Surat', slug: 'surat', status: 'active', itemCount: 98 },
  { id: 'mi-26', type: 'tag', name: 'Verified Vendor', slug: 'verified-vendor', status: 'active', itemCount: 85 },
  { id: 'mi-27', type: 'tag', name: 'Emergency 24x7', slug: 'emergency-24x7', status: 'active', itemCount: 19 },
];

