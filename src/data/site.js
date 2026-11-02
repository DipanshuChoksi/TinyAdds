export const SITE = {
  name: 'Tinyadds',
  tagline: 'Connecting you with reliable local contractors for all your service needs.',
  copyright: 'Amitaujas LLP',
  copyrightUrl: 'https://amitaujas.com',
};

export const CATEGORIES = [
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

export const EMOTIONS = [
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

export const SORT_OPTIONS = [
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
export function buildListings(categorySlug = 'automotive') {
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

export const HOME_EVENTS = TEMPLATES.map((t, i) => ({
  id: `h${i + 1}`,
  ...t,
  image: '/assets/img/Add-1.png',
  category: CATEGORIES[i].slug,
  popularity: 90 - i * 10,
  rating: 4.5 - i * 0.3,
  createdAt: new Date(2026, 0, 10 + i).toISOString(),
}));

export const BLOGS = [1, 2, 3, 4].map((n) => ({
  slug: `barcelona-national-zoo-${n}`,
  title: 'Barcelona National Zoo',
  tag: 'Entertainment',
  date: '01/02/2026',
  image: '/assets/img/listings/city-guide/v1/01.jpg',
}));

export const BLOG_POST = {
  title: 'How real estate drone photography can elevate your listing?',
  author: 'Darrell Steward',
  date: 'May 05, 2024',
  intro:
    "In the competitive world of real estate, first impressions matter, and drone photography has become a game-changer for property listings. The use of aerial imagery captured by drones can significantly elevate the presentation of a property. Here's how real estate drone photography can make your listing stand out.",
  images: ['/assets/img/blog/v1/single/01.jpg', '/assets/img/blog/v1/single/02.jpg'],
  sections: [
    ['Captivating perspectives', 'Drones provide a unique vantage point, capturing stunning aerial views of the property and its surroundings. This allows potential buyers to visualize the layout, landscaping, and neighborhood in a way that traditional ground-level photos cannot convey.'],
    ['Highlighting property features', "Drones excel at showcasing expansive properties, emphasizing key features like pools, gardens, and outdoor amenities. Aerial shots provide a comprehensive view, helping buyers understand the property's layout and potential."],
    ['Showcasing surrounding area', "Drone photography extends beyond the property boundaries, offering a glimpse of the surrounding neighborhood, parks, or proximity to landmarks. This broader perspective can influence a buyer's decision by presenting the property in its larger context."],
    ['Creating a cinematic experience', 'Drones can capture dynamic, sweeping shots that add a cinematic quality to property videos. This immersive experience can evoke emotion and create a lasting impression, setting your listing apart from others.'],
    ['Emphasizing property size and scale', "Drones excel at illustrating the size and scale of a property, particularly for larger estates or expansive landscapes. This helps potential buyers gauge the property's proportions and get a comprehensive understanding of its size."],
    ['Engaging online presence', "In an era where online browsing plays a crucial role in the home-buying process, drone photography enhances your listing's online presence. Eye-catching visuals grab attention, encouraging potential buyers to explore the property further."],
    ['Demonstrating property connectivity', "Drones can showcase a property's proximity to amenities, schools, and transportation hubs. This connectivity is valuable information for buyers looking for a convenient and well-connected living environment."],
    ['Competitive edge in marketing', 'As drone technology becomes more accessible, incorporating it into your real estate marketing strategy can give you a competitive edge. Properties with high-quality aerial imagery are more likely to attract attention and stand out in a crowded market.'],
  ],
  conclusion:
    "Incorporating drone photography into your real estate listings not only adds a touch of innovation but also provides potential buyers with a comprehensive and visually appealing overview of the property. It's an investment that can pay off by making your listings more attractive and memorable in the eyes of prospective buyers. So why settle for a worm's-eye view when you can soar above the competition with drone photography?",
  authorCard: { name: 'Naman Gami', avatar: '/assets/img/blog/v1/single/avatar.jpg' },
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

export const TEAM = ['Kristin Watson', 'Liza Rogers', 'Cody Fisher', 'Michael Howard', 'Jacob Jones', 'Darrell Steward'];

export const PARTNERS = [
  'Our collaboration with innovative technology providers enhances the user experience.',
  'Integrating cutting-edge tools and software, we offer advanced features like AI-powered search.',
  'Flexible loan solutions and payment plans, making it easier to fund renovation.',
  'Provide our users with access to a broad range of high-quality materials and resources.',
];

const BIO =
  "Extensive experience in rentals and a vast database means I can quickly find the options that are right for you. Looking for a seamless and exciting rental experience? Contact me today - I promise it won't be boring! Your perfect home is just a call away.";

export const USER = {
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

export const VENDOR = {
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

export const VENDOR_POSTS = [1, 2, 3, 4].map((n) => ({
  id: `v${n}`,
  title: 'Chicago Business Conference',
  city: 'Chicago',
  type: 'Conference',
  date: 'Sep 23',
  time: '18:00',
  image: '/assets/img/listings/events/13.jpg',
}));

export const MY_LISTINGS = [
  { id: 'm1', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Sad', created: '19/05/2024', image: '/assets/img/Add-1.png' },
  { id: 'm2', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Happy', created: '19/05/2024', image: '/assets/img/Add-1.png' },
  { id: 'm3', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Sad', created: '19/05/2024', image: '/assets/img/Add-1.png' },
  { id: 'm4', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Happy', created: '19/05/2024', image: '/assets/img/Add-1.png' },
  { id: 'm5', title: 'Classic Music Evening', city: 'Boston', date: 'Nov 8', time: '17:30', type: 'Happy', created: '19/05/2024', image: '/assets/img/Add-1.png' },
];

export const DEVICES = [
  { id: 'd1', name: 'Mac - New York, USA', meta: 'Chrome', status: 'Active now' },
  { id: 'd2', name: 'iPhone 15 - New York, USA', meta: 'Finder App', status: '20 hours ago' },
];

export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian'];
