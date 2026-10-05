// =====================================================================
//  Content model (types) + default seed content.
//  The live content is stored in the DB (prod) or data/content.json (dev).
// =====================================================================

export interface EduItem {
  year: string;
  school: string;
  note: string;
}

export interface Project {
  title: string;
  category: string;
  year: string;
  image: string;
  role: string;
  tools: string;
  overview: string;
  problem: string;
  process: string;
  solution: string;
  result: string;
}

export interface Certificate {
  issuer: string;
  name: string;
  meta: string;
  image: string;
  pdf: string;
  title: string;
  comingSoon: boolean;
}

export interface SiteContent {
  brand: string;
  theme: "dark" | "light";
  hero: { role: string; name1: string; name2: string; desc: string };
  socials: { dribbble: string; instagram: string; linkedin: string; behance: string };
  about: {
    lead: string;
    body: string[];
    skills: string[];
    education: EduItem[];
    soft: string;
  };
  contact: { email: string; location: string; reply: string; formEndpoint: string };
  footer: { tagline: string };
  projects: Project[];
  certificates: Certificate[];
}

export const DEFAULT_CONTENT: SiteContent = {
  brand: "Lazuardi Pandu",
  theme: "dark",
  hero: {
    role: "Full Stack Developer",
    name1: "Lazuardi",
    name2: "Pandu",
    desc: "Hi! I'm a Full Stack Developer who builds clean, functional web applications — turning ideas into products that work from front-end to back-end.",
  },
  socials: {
    dribbble: "https://dribbble.com/lazuardipandu",
    instagram: "https://www.instagram.com/lazuardipandu",
    linkedin: "https://www.linkedin.com/in/lazuardipandu",
    behance: "https://www.behance.net/lazuardipandu",
  },
  about: {
    lead: "A developer focused on detail, clarity, and building things that actually work.",
    body: [
      "I'm Lazuardi Pandu Dwi Suratno, a Full Stack Developer and vocational high-school student at SMK Telkom Purwokerto (Software & Game Development / PPLG). I enjoy building web applications end to end — from crafting the interface to wiring up the back-end.",
      "I'm open to collaboration, freelance projects, and internship (PKL) opportunities.",
    ],
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "PHP", "MySQL", "Figma", "Git"],
    education: [
      { year: "2024 — Present", school: "SMK Telkom Purwokerto", note: "Vocational High School — Software & Game Development (PPLG)" },
      { year: "2021 — 2024", school: "SMP Telkom Purwokerto", note: "Junior High School" },
      { year: "2019 — 2021", school: "SD Negeri 1 Purwokerto Lor", note: "Elementary School" },
      { year: "2015 — 2019", school: "SD Negeri 1 Purwojati", note: "Elementary School" },
    ],
    soft: "Beyond tech: strong critical thinking and a high drive to keep learning.",
  },
  contact: {
    email: "pandupro6789@gmail.com",
    location: "Indonesia · Remote / On-site",
    reply: "Usually replies within 24 hours",
    formEndpoint: "",
  },
  footer: {
    tagline: "Full Stack Developer — building clean, functional web apps.",
  },
  projects: [
    { title: "Furniture Library", category: "Web App", year: "2025", image: "", role: "Full Stack Developer", tools: "PHP, MySQL",
      overview: "A furniture website for the Purwokerto area, focused on quality furniture for homes, offices, and study rooms.",
      problem: "The business had no online catalog, so customers couldn't browse products easily.",
      process: "Planned the data model, built the pages with PHP, and connected a MySQL database for products.",
      solution: "A clean catalog with product listings and a simple, maintainable PHP + MySQL back-end.",
      result: "A working web app that showcases the store's products online." },
    { title: "Myst Walker", category: "Game", year: "2025", image: "", role: "Game Developer", tools: "Unity, C#",
      overview: "A post-apocalyptic zombie action-survival game where the player is the last soldier fighting to survive.",
      problem: "Needed an engaging survival loop with combat and tension.",
      process: "Designed the core loop, built mechanics in Unity with C#, and iterated on gameplay feel.",
      solution: "A playable action-survival prototype built on the Unity engine.",
      result: "A fun, atmospheric game demo that showcases gameplay programming." },
    { title: "Fintar — Finance App", category: "Mobile App", year: "2025", image: "", role: "UI/UX Designer", tools: "Figma, Protopie",
      overview: "A mobile app that helps young people track spending and save money in a simple, enjoyable way.",
      problem: "Many users struggle to see where their money goes. Existing finance apps feel complex and number-heavy.",
      process: "Quick research with 8 users, user flows, low-fi wireframes, then hi-fi UI and a clickable prototype.",
      solution: "A compact dashboard with spending visuals, auto categories, and savings goals.",
      result: "In usability tests, the logging task was completed 40% faster." },
    { title: "Bloom — E-commerce", category: "Web Design", year: "2025", image: "", role: "UI/UX Designer", tools: "Figma",
      overview: "A redesign of a fashion e-commerce site to feel modern, fast, and easy at checkout.",
      problem: "A slow checkout and weak product presentation led to many abandoned carts.",
      process: "UX audit, competitor benchmarking, restructured information architecture, then UI and components.",
      solution: "A clean product grid, quick-view, and a 2-step checkout with a clear progress indicator.",
      result: "The checkout flow was rated far more intuitive than the old one." },
    { title: "Nusa Coffee — Brand", category: "Branding", year: "2024", image: "", role: "Visual Designer", tools: "Illustrator, Photoshop",
      overview: "A visual identity for a local coffee shop: logo, color palette, and packaging application.",
      problem: "The brand lacked a consistent identity, making it hard to recognize.",
      process: "Moodboard, logo exploration, typography selection, and a mini brand guideline.",
      solution: "A bold monogram logo and a warm monochrome color system.",
      result: "The brand now looks more consistent and professional." },
    { title: "Estate+ — Dashboard", category: "Web Design", year: "2024", image: "", role: "UI Designer", tools: "Figma",
      overview: "A dashboard for property agents to monitor listings, leads, and sales performance.",
      problem: "Data was scattered, making it hard for agents to see the big picture quickly.",
      process: "Defined key metrics, built an information hierarchy, then designed data components and charts.",
      solution: "KPI summary, trend charts, and a filterable listing table on a single screen.",
      result: "Key information is understandable at a glance." },
  ],
  certificates: [
    { issuer: "Codelab Indonesia", name: "TechSprint Innovation Cup 2026", meta: "Web Development · 2026", image: "/img/certs/cert-techsprint.jpg", pdf: "/docs/sertifikat-techsprint.pdf", title: "TechSprint Innovation Cup 2026 — Web Development (Codelab Indonesia)", comingSoon: false },
    { issuer: "Microsoft · elevAIte", name: "Azure AI Fundamentals (AI-900)", meta: "Completion · Jul 2025", image: "/img/certs/cert-azure.jpg", pdf: "/docs/sertifikat-azure-ai900.pdf", title: "Microsoft Azure AI Fundamentals (AI-900) — Certificate of Completion", comingSoon: false },
    { issuer: "Telkom DigiUp 2025", name: "Digital Marketing", meta: "Certified · Dec 2025 · PT TPCC", image: "/img/certs/cert-digiup.jpg", pdf: "/docs/sertifikat-digiup.pdf", title: "Telkom DigiUp 2025 — Digital Marketing (Certified)", comingSoon: false },
    { issuer: "AI Ignition · KUMPUL", name: "AI Ignition Training", meta: "Participation · Aug 2026", image: "/img/certs/cert-aiignition.jpg", pdf: "/docs/sertifikat-ai-ignition.pdf", title: "AI Ignition Training — Certificate of Participation (KUMPUL.ID)", comingSoon: false },
    { issuer: "estha", name: "AI Experience Platform", meta: "Coming soon — stay tuned", image: "", pdf: "", title: "", comingSoon: true },
  ],
};
