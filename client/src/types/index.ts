export type SortKey = 'popular' | 'rated' | 'recent';

export interface Category { slug: string; name: string; short: string; image: string }
export interface Emotion { slug: string; name: string; image: string }

export interface EventSummary {
  id: string;
  title: string;
  city: string;
  type?: string;
  date: string;
  time: string;
  image: string;
}

export interface HomeEvent extends EventSummary {
  category: string;
  popularity: number;
  rating: number;
  createdAt: string;
}

export interface Listing extends HomeEvent { emotion: string }

export interface MyListing extends EventSummary { created: string }

export interface BlogSummary { slug: string; title: string; tag: string; date: string; image: string }

export interface BlogPost {
  title: string;
  author: string;
  date: string;
  intro: string;
  images: string[];
  sections: [string, string][];
  conclusion: string;
  authorCard: { name: string; avatar: string };
}

export interface User {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatarSm: string;
  avatar: string;
  avatarLg: string;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  lastVisited: string;
  bio: string;
  avatar: string;
  cover: string;
  stats: [string, string][];
}

export interface Device { id: string; name: string; meta: string; status: string }

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  status: 'pending' | 'in_progress' | 'resolved';
}

export interface AdminPostApproval {
  id: string;
  title: string;
  category: string;
  city: string;
  vendorName: string;
  submittedAt: string;
  price?: string;
  status: 'pending' | 'approved' | 'rejected';
  image: string;
}

export interface AdminPackage {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  listingLimit: number;
  features: string[];
  isPopular?: boolean;
  status: 'active' | 'inactive';
}

export interface AdminSearchTerm {
  id: string;
  term: string;
  category: string;
  city: string;
  count: number;
  lastSearched: string;
  trend: 'up' | 'down' | 'stable';
}

export interface AdminMasterItem {
  id: string;
  type: 'category' | 'emotion' | 'city' | 'tag';
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  itemCount: number;
}

