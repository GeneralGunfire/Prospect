import { quizQuestions } from '../data/quizQuestions';

export interface RIASECScore {
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  score: number;
  label: string;
  description: string;
}

const RIASEC_LABELS: Record<string, { label: string; description: string }> = {
  R: {
    label: 'Realistic',
    description: 'Practical, physical, concrete, hands-on, machine-oriented, and tool-oriented.',
  },
  I: {
    label: 'Investigative',
    description: 'Analytical, intellectual, scientific, inquisitive, and exploratory.',
  },
  A: {
    label: 'Artistic',
    description: 'Creative, original, independent, chaotic, inventive, and media-oriented.',
  },
  S: {
    label: 'Social',
    description: 'Cooperative, supporting, helping, healing/nurturing, and teaching.',
  },
  E: {
    label: 'Enterprising',
    description: 'Competitive environments, leadership, persuading, and status.',
  },
  C: {
    label: 'Conventional',
    description: 'Detail-oriented, organizing, and clerical.',
  },
};

export function calculateRIASEC(answers: { questionId: number; value: number }[]): RIASECScore[] {
  const totals: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  answers.forEach((answer) => {
    const question = quizQuestions.find((q) => q.id === answer.questionId);
    if (question) {
      totals[question.category] += answer.value;
      counts[question.category] += 1;
    }
  });

  const scores: RIASECScore[] = Object.keys(totals).map((key) => ({
    type: key as any,
    score: Math.round((totals[key] / (counts[key] * 5)) * 100),
    label: RIASEC_LABELS[key].label,
    description: RIASEC_LABELS[key].description,
  }));

  return scores.sort((a, b) => b.score - a.score);
}
