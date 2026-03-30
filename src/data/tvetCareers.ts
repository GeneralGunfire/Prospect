/**
 * TVET Careers and Technical Pathways
 * Matches Grade 10 subjects to TVET programs
 */

export interface TVETCareer {
  id: string;
  name: string;
  description: string;
  relatedSubjects: string[];
  colleges: string[];
  duration: string;
  salaryRange: string;
  jobDemand: 'High' | 'Medium' | 'Low';
  entryRequirements: string;
}

export const tvetCareers: TVETCareer[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    description: 'Install, maintain, and repair electrical systems in buildings, industries, and homes',
    relatedSubjects: ['Physical Sciences', 'Mathematics', 'EGD'],
    colleges: ['IPSET', 'Johannesburg TVET College', 'Ekurhuleni TVET College'],
    duration: '3 years',
    salaryRange: 'R8,000 - R18,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 minimum, with Physics and Mathematics'
  },
  {
    id: 'plumber',
    name: 'Plumber',
    description: 'Install and repair water and gas pipes, fixtures, and systems',
    relatedSubjects: ['Physical Sciences', 'Mathematics'],
    colleges: ['Cape Peninsula TVET College', 'Eastcape Midlands TVET College'],
    duration: '3 years',
    salaryRange: 'R7,000 - R16,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 minimum with Mathematics'
  },
  {
    id: 'welder',
    name: 'Welder',
    description: 'Weld metal parts together for construction, manufacturing, and repair',
    relatedSubjects: ['Physical Sciences', 'Mathematics', 'EGD'],
    colleges: ['Gert Sibande TVET College', 'Vhembe TVET College'],
    duration: '3 years',
    salaryRange: 'R7,500 - R17,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 minimum with Physical Sciences'
  },
  {
    id: 'carpenter',
    name: 'Carpenter & Joinery',
    description: 'Design, build, and install wood structures and furniture',
    relatedSubjects: ['EGD', 'Physical Sciences', 'Mathematics'],
    colleges: ['Ekurhuleni TVET College', 'Northlink TVET College'],
    duration: '3 years',
    salaryRange: 'R6,500 - R14,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 9 with EGD or Mathematics'
  },
  {
    id: 'motor-mechanic',
    name: 'Motor Mechanic',
    description: 'Service, repair, and maintain motor vehicles and engines',
    relatedSubjects: ['Physical Sciences', 'Mathematics'],
    colleges: ['Automotive Skills Institute', 'Johannesburg TVET College'],
    duration: '3 years',
    salaryRange: 'R7,000 - R15,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 minimum'
  },
  {
    id: 'chef',
    name: 'Chef / Culinary Arts',
    description: 'Prepare and cook food in professional kitchen settings',
    relatedSubjects: ['Business Studies', 'Life Sciences'],
    colleges: ['False Bay TVET College', 'Boland TVET College'],
    duration: '2-3 years',
    salaryRange: 'R6,000 - R12,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 9 minimum'
  },
  {
    id: 'it-support',
    name: 'IT Support & Networking',
    description: 'Provide technical support and maintain computer networks',
    relatedSubjects: ['CAT', 'Mathematics'],
    colleges: ['Northlink TVET College', 'West Coast TVET College'],
    duration: '2-3 years',
    salaryRange: 'R8,000 - R16,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with Mathematics/CAT'
  },
  {
    id: 'construction',
    name: 'Construction & Building',
    description: 'Learn construction techniques, safety, and project management',
    relatedSubjects: ['EGD', 'Physical Sciences', 'Mathematics'],
    colleges: ['Gert Sibande TVET College', 'KZN TVET College'],
    duration: '3 years',
    salaryRange: 'R8,000 - R18,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with Mathematics'
  }
];

export function getMatchingTVETCareers(selectedSubjects: string[]): TVETCareer[] {
  if (selectedSubjects.length === 0) return [];

  return tvetCareers.filter(career => {
    return career.relatedSubjects.some(subject =>
      selectedSubjects.includes(subject)
    );
  }).sort((a, b) => {
    const demandOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return demandOrder[a.jobDemand] - demandOrder[b.jobDemand];
  });
}

export function getTopTVETCareers(selectedSubjects: string[], limit: number = 6): TVETCareer[] {
  return getMatchingTVETCareers(selectedSubjects).slice(0, limit);
}
