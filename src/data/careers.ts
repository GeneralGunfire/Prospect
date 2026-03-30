export interface Career {
  id: string;
  title: string;
  category: string;
  riasec: ('R' | 'I' | 'A' | 'S' | 'E' | 'C')[];
  description: string;
  salary: string;
  growth: string;
  education: string;
  subjects: string[];
  aps: number;
  universities: string[];
  bursaries: string[];
}

export const careers: Career[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Technology',
    riasec: ['I', 'R', 'C'],
    description: 'Design, develop, and test software systems and applications.',
    salary: 'R450k - R1.2m',
    growth: 'High',
    education: 'BSc Computer Science / BEng Software Engineering',
    subjects: ['Mathematics', 'Physical Sciences', 'Information Technology'],
    aps: 32,
    universities: ['UCT', 'Wits', 'Stellenbosch', 'UP'],
    bursaries: ['Standard Bank', 'Investec', 'Amazon'],
  },
  {
    id: 'civil-engineer',
    title: 'Civil Engineer',
    category: 'Engineering',
    riasec: ['R', 'I', 'E'],
    description: 'Plan, design, and oversee construction and maintenance of building structures and infrastructure.',
    salary: 'R400k - R1.1m',
    growth: 'Moderate',
    education: 'BEng Civil Engineering',
    subjects: ['Mathematics', 'Physical Sciences'],
    aps: 34,
    universities: ['UCT', 'Wits', 'UP', 'UKZN'],
    bursaries: ['Murray & Roberts', 'SANRAL', 'Department of Public Works'],
  },
  {
    id: 'chartered-accountant',
    title: 'Chartered Accountant',
    category: 'Finance',
    riasec: ['C', 'E', 'I'],
    description: 'Provide financial advice, audit accounts, and provide trustworthy information about financial records.',
    salary: 'R500k - R1.5m',
    growth: 'High',
    education: 'BCom Accounting + CTA + SAICA Articles',
    subjects: ['Mathematics', 'Accounting'],
    aps: 35,
    universities: ['UJ', 'UP', 'Wits', 'UCT'],
    bursaries: ['PwC', 'Deloitte', 'EY', 'KPMG'],
  },
  {
    id: 'medical-doctor',
    title: 'Medical Doctor',
    category: 'Healthcare',
    riasec: ['I', 'S', 'R'],
    description: 'Diagnose and treat illnesses and injuries in patients.',
    salary: 'R600k - R2.5m',
    growth: 'High',
    education: 'MBChB (Bachelor of Medicine and Bachelor of Surgery)',
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences'],
    aps: 40,
    universities: ['UCT', 'Wits', 'UP', 'Stellenbosch'],
    bursaries: ['Department of Health', 'Netcare', 'Discovery'],
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    category: 'Creative',
    riasec: ['A', 'I', 'E'],
    description: 'Create visual concepts to communicate ideas that inspire, inform, and captivate consumers.',
    salary: 'R180k - R600k',
    growth: 'Moderate',
    education: 'BA Graphic Design / Diploma in Visual Communication',
    subjects: ['Design', 'Visual Arts'],
    aps: 24,
    universities: ['UJ', 'CPUT', 'Vega', 'Open Window'],
    bursaries: ['Multichoice', 'Media24'],
  },
  {
    id: 'clinical-psychologist',
    title: 'Clinical Psychologist',
    category: 'Healthcare',
    riasec: ['S', 'I', 'A'],
    description: 'Diagnose and treat mental, emotional, and behavioral disorders.',
    salary: 'R350k - R1.2m',
    growth: 'High',
    education: 'MA Clinical Psychology + Internship + Community Service',
    subjects: ['Mathematics', 'Life Sciences'],
    aps: 30,
    universities: ['UCT', 'Wits', 'Stellenbosch', 'NWU'],
    bursaries: ['Department of Health', 'SAMRC'],
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur',
    category: 'Business',
    riasec: ['E', 'A', 'S'],
    description: 'Organize and operate a business, taking on financial risks in order to do so.',
    salary: 'Variable',
    growth: 'High',
    education: 'BCom Business Management / Entrepreneurship (Optional)',
    subjects: ['Mathematics', 'Business Studies', 'Economics'],
    aps: 26,
    universities: ['UJ', 'Wits', 'UCT', 'Stellenbosch'],
    bursaries: ['SAB Foundation', 'Allan Gray Orbis Foundation'],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Technology',
    riasec: ['I', 'C', 'E'],
    description: 'Analyze and interpret complex digital data to assist businesses in decision-making.',
    salary: 'R500k - R1.4m',
    growth: 'Very High',
    education: 'BSc Data Science / BSc Computer Science / BSc Statistics',
    subjects: ['Mathematics', 'Physical Sciences', 'Information Technology'],
    aps: 34,
    universities: ['Stellenbosch', 'UCT', 'Wits', 'UP'],
    bursaries: ['Standard Bank', 'Absa', 'Capitec'],
  },
];
