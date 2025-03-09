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
    linkedin: "https://www.linkedin.com/in/shania-azzahra-41b28b348",
    github: "https://github.com/sasa1599",
    instagram:
      "https://www.instagram.com/shnazzhar?igsh=MXBta3ZubjJqcXphcA%3D%3D&utm_source=qr",
  },
  {
    name: "Dzaky Athariq Ferreira",
    role: "Founder",
    imagePath:
      "https://res.cloudinary.com/dak07ttxh/image/upload/v1741170286/0d4cb028-cd28-4e64-83e0-a6472d3142ef_wpkjbv.jpg",
    linkedin:
      "https://www.linkedin.com/in/dzaky-athariq-ferreira-s-tr-t-a820b3180/",
    github: "https://github.com/crayoninvok",
    instagram: "https://instagram.com/dzakyathariq",
  },
  {
    name: "Mirza Ali Yusuf",
    role: "Founder",
    imagePath:
      "https://res.cloudinary.com/dak07ttxh/image/upload/v1741559886/DSC08142_11zon_onhi3c.jpg",
    linkedin: "https://www.linkedin.com/in/mirzaaliyusuf",
    github: "https://github.com/mirzaali45",
    instagram: "https://www.instagram.com/mirzaaliyusuf",
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
