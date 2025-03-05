// components/about/data.ts
import { ValueItem, TeamMember, StatItem } from "./aboutTypes";

// Our values data
export const values: ValueItem[] = [
  {
    icon: "🔍",
    title: "Quality Assurance",
    description:
      "We select only the finest electronics products to ensure reliability and performance.",
  },
  {
    icon: "💡",
    title: "Innovation",
    description:
      "We continuously seek the latest technology to keep our catalog cutting-edge.",
  },
  {
    icon: "🤝",
    title: "Customer First",
    description:
      "Your satisfaction is our priority with responsive support and honest advice.",
  },
];

// Team members data
export const team: TeamMember[] = [
  {
    name: "Shania Azzahra",
    role: "Founder",
    imagePath:
      "https://res.cloudinary.com/dak07ttxh/image/upload/v1741170079/image_mwnbft.jpg",
  },
  {
    name: "Dzaky Athariq Ferreira",
    role: "Founder",
    imagePath:
      "https://res.cloudinary.com/dak07ttxh/image/upload/v1741170286/0d4cb028-cd28-4e64-83e0-a6472d3142ef_wpkjbv.jpg",
  },
  {
    name: "Mirza Ali Yusuf",
    role: "Founder",
    imagePath:
      "https://res.cloudinary.com/dak07ttxh/image/upload/v1741170284/03e02e7d-3a8e-40ca-adb1-9385899ac277_uriylx.jpg",
  },
];

// Stats data
export const stats: StatItem[] = [
  { count: "2+", label: "Founder Experience" },
  { count: "10,000+", label: "Happy Customers" },
  { count: "1,500+", label: "Products" },
  { count: "24/7", label: "Customer Support" },
];

// Partners data
export const partners = ["Apple", "Samsung", "Sony", "Google", "Microsoft", "HyperX"];
