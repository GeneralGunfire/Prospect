export interface Subject {
  id: string;
  name: string;
  category: 'Core' | 'Elective';
}

export const subjects: Subject[] = [
  // Core
  { id: 'english-hl', name: 'English Home Language', category: 'Core' },
  { id: 'english-fal', name: 'English First Additional Language', category: 'Core' },
  { id: 'afrikaans-hl', name: 'Afrikaans Home Language', category: 'Core' },
  { id: 'afrikaans-fal', name: 'Afrikaans First Additional Language', category: 'Core' },
  { id: 'maths', name: 'Mathematics', category: 'Core' },
  { id: 'maths-lit', name: 'Mathematical Literacy', category: 'Core' },
  { id: 'life-orientation', name: 'Life Orientation', category: 'Core' },

  // Electives
  { id: 'phys-sci', name: 'Physical Sciences', category: 'Elective' },
  { id: 'life-sci', name: 'Life Sciences', category: 'Elective' },
  { id: 'accounting', name: 'Accounting', category: 'Elective' },
  { id: 'business-studies', name: 'Business Studies', category: 'Elective' },
  { id: 'economics', name: 'Economics', category: 'Elective' },
  { id: 'history', name: 'History', category: 'Elective' },
  { id: 'geography', name: 'Geography', category: 'Elective' },
  { id: 'it', name: 'Information Technology', category: 'Elective' },
  { id: 'cat', name: 'Computer Applications Technology', category: 'Elective' },
  { id: 'visual-arts', name: 'Visual Arts', category: 'Elective' },
  { id: 'design', name: 'Design', category: 'Elective' },
  { id: 'drama', name: 'Dramatic Arts', category: 'Elective' },
  { id: 'music', name: 'Music', category: 'Elective' },
  { id: 'tourism', name: 'Tourism', category: 'Elective' },
  { id: 'hospitality', name: 'Hospitality Studies', category: 'Elective' },
  { id: 'egd', name: 'Engineering Graphics and Design', category: 'Elective' },
];
