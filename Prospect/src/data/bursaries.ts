export interface Bursary {
  id: string;
  name: string;
  provider: string;
  category: string;
  amount: string;
  deadline: string;
  requirements: string[];
  description: string;
  website: string;
}

export const bursaries: Bursary[] = [
  {
    id: 'standard-bank-bursary',
    name: 'Standard Bank CSI Bursary',
    provider: 'Standard Bank',
    category: 'Finance & Technology',
    amount: 'Full Tuition + Accommodation',
    deadline: '30 September 2026',
    requirements: ['65% Average', 'Mathematics', 'South African Citizen'],
    description: 'Supporting students in commerce, science, engineering, and technology.',
    website: 'https://www.standardbank.com',
  },
  {
    id: 'investec-bursary',
    name: 'Investec Tertiary Bursary',
    provider: 'Investec',
    category: 'Finance',
    amount: 'Full Tuition + Books',
    deadline: '31 August 2026',
    requirements: ['60% Average', 'Mathematics', 'Financial Need'],
    description: 'Aiming to support high-potential students who face financial barriers.',
    website: 'https://www.investec.com',
  },
  {
    id: 'nsfas',
    name: 'National Student Financial Aid Scheme',
    provider: 'NSFAS',
    category: 'General',
    amount: 'Full Coverage',
    deadline: '30 November 2026',
    requirements: ['Household income < R350k', 'South African Citizen'],
    description: 'Government funding for students from poor and working-class backgrounds.',
    website: 'https://www.nsfas.org.za',
  },
  {
    id: 'vodacom-bursary',
    name: 'Vodacom Merit Bursary',
    provider: 'Vodacom',
    category: 'Technology',
    amount: 'Full Tuition + Laptop',
    deadline: '31 October 2026',
    requirements: ['70% Average', 'Mathematics', 'Physical Sciences'],
    description: 'For students pursuing degrees in STEM fields.',
    website: 'https://www.vodacom.com',
  },
  {
    id: 'sanral-bursary',
    name: 'SANRAL Scholarship',
    provider: 'SANRAL',
    category: 'Engineering',
    amount: 'Full Tuition + Stipend',
    deadline: '30 September 2026',
    requirements: ['70% Average', 'Mathematics', 'Physical Sciences'],
    description: 'Supporting future civil engineers and transport specialists.',
    website: 'https://www.nra.co.za',
  },
  {
    id: 'allan-gray-fellowship',
    name: 'Allan Gray Orbis Fellowship',
    provider: 'Allan Gray Foundation',
    category: 'Entrepreneurship',
    amount: 'Full Coverage + Mentorship',
    deadline: '31 May 2026',
    requirements: ['65% Average', 'Leadership Potential', 'Entrepreneurial Mindset'],
    description: 'Developing high-impact entrepreneurs for Southern Africa.',
    website: 'https://www.allangrayorbis.org',
  },
];
