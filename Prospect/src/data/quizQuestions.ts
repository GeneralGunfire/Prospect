export interface Question {
  id: number;
  text: string;
  category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
}

export const quizQuestions: Question[] = [
  // Realistic (R)
  { id: 1, text: "Build kitchen cabinets", category: 'R' },
  { id: 2, text: "Lay brick or tile", category: 'R' },
  { id: 3, text: "Repair household appliances", category: 'R' },
  { id: 4, text: "Raise fish in a hatchery", category: 'R' },
  { id: 5, text: "Assemble electronic parts", category: 'R' },
  { id: 6, text: "Drive a truck to deliver packages", category: 'R' },
  { id: 7, text: "Operate a grinding machine in a factory", category: 'R' },

  // Investigative (I)
  { id: 8, text: "Study the structure of the human body", category: 'I' },
  { id: 9, text: "Study bacteria", category: 'I' },
  { id: 10, text: "Study the movement of planets", category: 'I' },
  { id: 11, text: "Examine blood samples using a microscope", category: 'I' },
  { id: 12, text: "Investigate the cause of a fire", category: 'I' },
  { id: 13, text: "Develop a new medicine", category: 'I' },
  { id: 14, text: "Conduct biological research", category: 'I' },

  // Artistic (A)
  { id: 15, text: "Write books or plays", category: 'A' },
  { id: 16, text: "Play a musical instrument", category: 'A' },
  { id: 17, text: "Compose or arrange music", category: 'A' },
  { id: 18, text: "Draw pictures", category: 'A' },
  { id: 19, text: "Create special effects for movies", category: 'A' },
  { id: 20, text: "Paint sets for plays", category: 'A' },
  { id: 21, text: "Write scripts for television", category: 'A' },

  // Social (S)
  { id: 22, text: "Teach children how to read", category: 'S' },
  { id: 23, text: "Help people with personal or family problems", category: 'S' },
  { id: 24, text: "Take care of sick people", category: 'S' },
  { id: 25, text: "Teach a high-school class", category: 'S' },
  { id: 26, text: "Help elderly people with their daily activities", category: 'S' },
  { id: 27, text: "Work as a volunteer at a hospital", category: 'S' },
  { id: 28, text: "Help people who have problems with drugs or alcohol", category: 'S' },

  // Enterprising (E)
  { id: 29, text: "Sell a product or service", category: 'E' },
  { id: 30, text: "Manage a department in a large company", category: 'E' },
  { id: 31, text: "Start your own business", category: 'E' },
  { id: 32, text: "Negotiate business contracts", category: 'E' },
  { id: 33, text: "Represent a client in a lawsuit", category: 'E' },
  { id: 34, text: "Market a new line of clothing", category: 'E' },
  { id: 35, text: "Manage a retail store", category: 'E' },

  // Conventional (C)
  { id: 36, text: "Keep shipping and receiving records", category: 'C' },
  { id: 37, text: "Inventory supplies using a computer", category: 'C' },
  { id: 38, text: "Record rent payments", category: 'C' },
  { id: 39, text: "Keep financial records for a business", category: 'C' },
  { id: 40, text: "Develop a spreadsheet using computer software", category: 'C' },
  { id: 41, text: "Proofread records or forms", category: 'C' },
  { id: 42, text: "Update personnel records", category: 'C' },
];
