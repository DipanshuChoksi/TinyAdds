import { OTHER_CITIES, POPULAR_CITIES } from "@/data/cities";

export type ClientMenuItem = { label: string; href: string | null; icon: string };

/** href: null  -> menu is shown but click does nothing (Payment History is pending). */
export const CLIENT_MENU: ClientMenuItem[] = [
  { label: "Dashboard", href: "/client-admin", icon: "bi-speedometer2" },
  { label: "Profile", href: "/client-admin/profile", icon: "bi-person" },
  { label: "Add Post", href: "/client-admin/add-post", icon: "bi-plus-square" },
  { label: "View Post", href: "/client-admin/view-post", icon: "bi-card-list" },
  { label: "View Payment History", href: null, icon: "bi-receipt" },
];

/** Top 3 stat cards. */
export const CLIENT_STATS = [
  { title: "Profile view", value: "200 K", icon: "bi-people-fill" },
  { title: "Direct Enquiry", value: "200 K", icon: "bi-person-vcard" },
  { title: "Email View", value: "200 K", icon: "bi-envelope-at" },
];

/* Chart data – dummy values, replace with API data. */
export type ChartPoint = { label: string; value: number };

export const PROFILE_VIEWS_MONTHLY: ChartPoint[] = [
  { label: "Jun", value: 12400 }, { label: "Jul", value: 15800 }, { label: "Aug", value: 14200 },
  { label: "Sep", value: 18900 }, { label: "Oct", value: 22100 }, { label: "Nov", value: 25600 },
];

export const REVIEWS_MONTHLY: ChartPoint[] = [
  { label: "Jun", value: 18 }, { label: "Jul", value: 26 }, { label: "Aug", value: 22 },
  { label: "Sep", value: 35 }, { label: "Oct", value: 41 }, { label: "Nov", value: 48 },
];

/** Rating split: stars -> number of ratings. */
export const RATING_SPLIT = [
  { stars: 5, count: 120 }, { stars: 4, count: 64 }, { stars: 3, count: 22 }, { stars: 2, count: 9 }, { stars: 1, count: 5 },
];

export const CLIENT_PROFILE = {
  firstName: "Amitaujas LLP",
  lastName: "-",
  mobile: "7600 020 884",
  email: "design@amitaujas.com",
  country: "India",
  state: "Gujarat",
  city: "Vadodara",
};

/** Country -> State -> Cities (replace with API data later). */
export const LOCATION_TREE: Record<string, Record<string, string[]>> = {
  India: {
    Gujarat: [...POPULAR_CITIES, ...OTHER_CITIES.slice(0, 25)].sort(),
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Dewas", "Ratlam", "Sagar"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  },
};

/* Dropdown options for Add Post – placeholders, replace with API / master data. */
export const BANNER_SECTIONS = ["Home Top Banner", "Home Middle Banner", "Sidebar Banner", "Footer Banner"];
export const EMOTIONS = ["Happy", "Excited", "Trusted", "Urgent"];
export const SEARCH_GROUPS = ["Property", "Vehicles", "Jobs", "Services", "Electronics"];
export const SEARCH_CATEGORIES = ["Buy", "Sell", "Rent", "Auction", "Finance"];

export type ClientPost = { id: number; title: string; image: string; fromDate: string; toDate: string };

export const CLIENT_POSTS: ClientPost[] = [
  { id: 1, title: "E-AUCTION SALE NOTICE", image: "", fromDate: "12-11-2024", toDate: "" },
  { id: 2, title: "Mahindra FINANCE", image: "", fromDate: "29-11-2024", toDate: "" },
  { id: 3, title: "Property Auction Notice", image: "", fromDate: "05-12-2024", toDate: "" },
];
