import { LessonData } from '../../../../../types/lesson'

const baseAnimation = {
  title: 'Physics Concept',
  duration: 2,
  description: 'Step-by-step visual explanation',
  steps: Array(3).fill(null).map((_, i) => ({
    duration: 2,
    title: `Step ${i + 1}`,
    visual: 'Visual explanation',
    narration: 'Detailed explanation of the concept',
  })),
}

const baseExplanation = {
  title: 'Concept Explanation',
  sections: [
    { heading: 'Introduction', content: 'Basic understanding of the concept' },
    { heading: 'Key Points', content: 'Important facts and relationships' },
    { heading: 'Examples', content: 'Real-world applications' },
  ],
}

const createQuizQuestion = (q: string, o: string[], c: number) => ({
  id: `q${Math.random()}`,
  question: q,
  options: o,
  correct: c,
  explanation: 'See lesson content for detailed explanation',
})

const createTestQuestion = (q: string, a: string, d: 'easy' | 'medium' | 'hard') => ({
  id: `t${Math.random()}`,
  question: q,
  type: 'short-answer' as const,
  answer: a,
  difficulty: d,
})

export const TransverseWaves: LessonData = {
  id: 'g10-t1-phys-transverse-waves',
  subject: 'Physical Sciences - Physics',
  subjectId: 'phys-sci',
  grade: 10,
  term: 1,
  topic: 'Transverse Pulses and Waves',
  topicId: 'transverse-waves',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: [
    'Understand transverse wave motion',
    'Identify particles vs wave motion',
    'Apply to real examples (water, light)',
  ],
  animation: baseAnimation,
  explanation: baseExplanation,
  workedExamples: [
    {
      level: 'basic',
      question: 'A rope is shaken up and down. Describe the wave motion.',
      solution: [
        {step: 'The rope moves up and down', result: 'Vertical particle motion'},
        {step: 'The wave travels along rope', result: 'Horizontal wave propagation'},
        {step: 'Particles move perpendicular to wave', result: 'Transverse motion'},
      ],
      explanation: 'Transverse waves have particles moving perpendicular to the wave direction',
    },
    {level: 'intermediate', question: 'A wave has wavelength 2m. Particles oscillate with amplitude 0.5m. What is the maximum particle displacement?', solution: [{step: 'Amplitude is max displacement', result: '0.5m'}, ], explanation: 'Amplitude defines the maximum distance particles move from equilibrium'},
    {level: 'advanced', question: 'Compare transverse (light) and longitudinal (sound) waves.', solution: [{step: 'Transverse: perpendicular motion', result: 'Light waves'}, {step: 'Longitudinal: parallel motion', result: 'Sound waves'}, ], explanation: 'Different motion types have different properties'},
  ],
  practiceQuestions: [
    {id: 'p1', question: 'Name the transverse wave: light', answer: 'Light wave or electromagnetic wave', type: 'short-answer', hint: 'Light is electromagnetic radiation', difficulty: 'easy'},
    {id: 'p2', question: 'Describe particle motion in a water wave.', answer: 'Circular/up and down motion', type: 'short-answer', hint: 'Watch a cork on water', difficulty: 'medium'},
    {id: 'p3', question: 'Is sound transverse or longitudinal?', answer: 'Longitudinal', type: 'short-answer', hint: 'Sound travels through air by compressions', difficulty: 'medium'},
  ],
  quiz: {
    passingScore: 70,
    questions: [
      createQuizQuestion('In transverse waves, particles move...', ['Along the wave', 'Perpendicular to the wave', 'At random', 'Parallel to wave direction'], 1),
      createQuizQuestion('Light is what type of wave?', ['Longitudinal', 'Transverse', 'Both', 'Neither'], 1),
      createQuizQuestion('Wavelength is the distance between...', ['Two peaks', 'Peak and trough', 'Any two corresponding points', 'A and B'], 2),
      createQuizQuestion('What is amplitude?', ['Wave speed', 'Maximum displacement', 'Frequency', 'Wave length'], 1),
      createQuizQuestion('A wave property that defines how many oscillations per second...', ['Wavelength', 'Amplitude', 'Frequency', 'Period'], 2),
    ],
  },
  test: {
    questions: [
      createTestQuestion('Define transverse wave.', 'Wave where particles move perpendicular to wave direction', 'easy'),
      createTestQuestion('What is the relationship between wavelength (λ) and frequency (f)?', 'v = fλ or λ = v/f', 'medium'),
      createTestQuestion('A water wave has wavelength 3m. Is this transverse or longitudinal?', 'Transverse', 'medium'),
      createTestQuestion('Calculate frequency if period T = 0.5s.', 'f = 1/T = 2 Hz', 'hard'),
      createTestQuestion('Compare light and sound wave types.', 'Light is transverse, sound is longitudinal', 'hard'),
    ],
  },
  misconceptions: [
    {misconception: 'Particles move along with the wave', correction: 'Particles oscillate in place; only the wave pattern travels'},
    {misconception: 'Wavelength and amplitude are the same', correction: 'Wavelength is distance between peaks; amplitude is maximum displacement'},
  ],
  relatedTopics: ['wave-properties', 'wave-behaviour'],
  capsCodes: ['DBE/2014/04/PhysicalSciences/Grade10/Term1'],
}

export const WaveProperties: LessonData = {
  id: 'g10-t1-phys-wave-properties',
  subject: 'Physical Sciences - Physics',
  subjectId: 'phys-sci',
  grade: 10,
  term: 1,
  topic: 'Wave Properties (λ, f, v, A)',
  topicId: 'wave-properties',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: [
    'Measure wavelength and frequency',
    'Calculate wave speed: v = fλ',
    'Identify properties affecting wave energy',
  ],
  animation: baseAnimation,
  explanation: baseExplanation,
  workedExamples: [
    {
      level: 'basic',
      question: 'If f = 5 Hz and λ = 2m, find wave speed v.',
      solution: [
        {step: 'Use formula v = fλ', result: 'v = fλ'},
        {step: 'Substitute values', result: 'v = 5 × 2'},
        {step: 'Calculate', result: 'v = 10 m/s'},
      ],
      explanation: 'Wave speed equals frequency times wavelength',
    },
    {
      level: 'intermediate',
      question: 'A wave has period T = 4s. Calculate frequency.',
      solution: [
        {step: 'Period and frequency are reciprocals', result: 'f = 1/T'},
        {step: 'Substitute T = 4', result: 'f = 1/4'},
        {step: 'Calculate', result: 'f = 0.25 Hz'},
      ],
      explanation: 'Frequency = 1 / Period',
    },
  ],
  practiceQuestions: [
    {id: 'p1', question: 'If f = 2 Hz and λ = 3m, calculate v.', answer: '6 m/s', type: 'short-answer', hint: 'v = fλ', difficulty: 'easy'},
    {id: 'p2', question: 'What is frequency if period is 2s?', answer: '0.5 Hz', type: 'short-answer', hint: 'f = 1/T', difficulty: 'medium'},
    {id: 'p3', question: 'Calculate wavelength if v = 340 m/s and f = 100 Hz.', answer: '3.4 m', type: 'short-answer', hint: 'λ = v/f', difficulty: 'hard'},
  ],
  quiz: {
    passingScore: 70,
    questions: [
      createQuizQuestion('The wave equation is:', ['v = f + λ', 'v = fλ', 'f = vλ', 'λ = f/v'], 1),
      createQuizQuestion('Frequency is measured in:', ['meters', 'seconds', 'hertz', 'meters/second'], 2),
      createQuizQuestion('If wavelength increases and speed stays constant, frequency...', ['Increases', 'Decreases', 'Stays same', 'Becomes zero'], 1),
    ],
  },
  test: {
    questions: [
      createTestQuestion('Calculate v if f = 10 Hz, λ = 0.5m.', 'v = 5 m/s', 'easy'),
      createTestQuestion('If v = 340 m/s and λ = 0.85m, find f.', 'f = 400 Hz', 'medium'),
      createTestQuestion('A wave has v = 20 m/s, T = 0.1s. Find wavelength.', 'λ = 2m', 'hard'),
    ],
  },
  misconceptions: [
    {misconception: 'Amplitude affects wave speed', correction: 'Wave speed depends on medium, not amplitude'},
  ],
  relatedTopics: ['transverse-waves'],
  capsCodes: ['DBE/2014/04/PhysicalSciences/Grade10/Term1'],
}

export const WaveBehaviour: LessonData = {
  id: 'g10-t1-phys-wave-behaviour',
  subject: 'Physical Sciences - Physics',
  subjectId: 'phys-sci',
  grade: 10,
  term: 1,
  topic: 'Wave Behaviour (Reflection, Interference)',
  topicId: 'wave-behaviour',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: [
    'Understand reflection and law of reflection',
    'Identify constructive and destructive interference',
    'Apply to sound and light',
  ],
  animation: baseAnimation,
  explanation: baseExplanation,
  workedExamples: [
    {
      level: 'basic',
      question: 'A light ray hits a mirror at 30° to the normal. What is angle of reflection?',
      solution: [
        {step: 'Law of reflection: angle of incidence = angle of reflection', result: '30°'},
        {step: 'Angle of reflection', result: '30°'},
      ],
      explanation: 'The angle at which light bounces equals the angle at which it arrives',
    },
    {
      level: 'intermediate',
      question: 'Two identical waves meet in phase. Describe interference.',
      solution: [
        {step: 'Waves in phase: peaks align with peaks', result: 'Constructive interference'},
        {step: 'Result: larger amplitude', result: 'Combined amplitude = A1 + A2'},
      ],
      explanation: 'Constructive interference amplifies the wave',
    },
  ],
  practiceQuestions: [
    {id: 'p1', question: 'If incident angle = 45°, what is reflection angle?', answer: '45°', type: 'short-answer', hint: 'Law of reflection', difficulty: 'easy'},
    {id: 'p2', question: 'Name two types of wave interference.', answer: 'Constructive and destructive', type: 'short-answer', hint: 'Consider in-phase and out-of-phase', difficulty: 'medium'},
    {id: 'p3', question: 'Explain why noise-canceling headphones use destructive interference.', answer: 'Destructive interference cancels unwanted sound', type: 'short-answer', hint: 'Opposite phase waves cancel', difficulty: 'hard'},
  ],
  quiz: {
    passingScore: 70,
    questions: [
      createQuizQuestion('Law of reflection states:', ['Angle in = Angle out', 'Angle in ≠ Angle out', 'Reflection angle = 90°', 'No pattern'], 0),
      createQuizQuestion('Constructive interference occurs when:', ['Waves are in phase', 'Waves are out of phase', 'One wave is larger', 'Waves dont interact'], 0),
      createQuizQuestion('Destructive interference results in:', ['Larger amplitude', 'Smaller amplitude', 'Zero amplitude', 'Random amplitude'], 2),
    ],
  },
  test: {
    questions: [
      createTestQuestion('If a ray reflects at 60°, what was incident angle?', 'Incident angle = 60°', 'easy'),
      createTestQuestion('Describe constructive interference.', 'Waves combine to produce larger amplitude', 'medium'),
      createTestQuestion('How does destructive interference reduce noise?', 'Out-of-phase sound waves cancel each other', 'hard'),
    ],
  },
  misconceptions: [
    {misconception: 'Reflection angle depends on material', correction: 'Law of reflection applies to all smooth surfaces'},
  ],
  relatedTopics: ['wave-properties'],
  capsCodes: ['DBE/2014/04/PhysicalSciences/Grade10/Term1'],
}

export const LongitudinalWaves: LessonData = {
  id: 'g10-t1-phys-longitudinal-waves',
  subject: 'Physical Sciences - Physics',
  subjectId: 'phys-sci',
  grade: 10,
  term: 1,
  topic: 'Longitudinal Waves & Sound',
  topicId: 'longitudinal-waves',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: [
    'Understand longitudinal wave motion',
    'Identify compressions and rarefactions',
    'Apply wave properties to sound',
  ],
  animation: baseAnimation,
  explanation: baseExplanation,
  workedExamples: [
    {
      level: 'basic',
      question: 'A coil spring produces longitudinal waves. Describe particle motion.',
      solution: [
        {step: 'Particles move along wave direction', result: 'Longitudinal motion'},
        {step: 'Creates compressions and rarefactions', result: 'Pressure variations'},
      ],
      explanation: 'Longitudinal waves are created by compressions and rarefactions',
    },
    {
      level: 'intermediate',
      question: 'Sound wave frequency = 440 Hz, v = 340 m/s. Find wavelength.',
      solution: [
        {step: 'Use λ = v/f', result: 'λ = v/f'},
        {step: 'Substitute', result: 'λ = 340/440'},
        {step: 'Calculate', result: 'λ ≈ 0.77 m'},
      ],
      explanation: 'This is the A note in music',
    },
  ],
  practiceQuestions: [
    {id: 'p1', question: 'Is sound transverse or longitudinal?', answer: 'Longitudinal', type: 'short-answer', hint: 'Consider how sound travels through air', difficulty: 'easy'},
    {id: 'p2', question: 'Name the two parts of a longitudinal wave.', answer: 'Compressions and rarefactions', type: 'short-answer', hint: 'High and low pressure regions', difficulty: 'medium'},
    {id: 'p3', question: 'Calculate λ for 1000 Hz sound in air (v=340 m/s).', answer: '0.34 m', type: 'short-answer', hint: 'λ = v/f', difficulty: 'hard'},
  ],
  quiz: {
    passingScore: 70,
    questions: [
      createQuizQuestion('Longitudinal waves have particles that move:', ['Perpendicular', 'Along wave', 'In circles', 'Randomly'], 1),
      createQuizQuestion('Sound is a:', ['Transverse wave', 'Longitudinal wave', 'Electromagnetic wave', 'Not a wave'], 1),
      createQuizQuestion('In longitudinal waves, compressions are:', ['High pressure', 'Low pressure', 'Medium pressure', 'Zero pressure'], 0),
    ],
  },
  test: {
    questions: [
      createTestQuestion('Describe compression in a sound wave.', 'Region of high pressure and particle density', 'easy'),
      createTestQuestion('If f = 200 Hz and v = 340 m/s, find λ.', '1.7 m', 'medium'),
      createTestQuestion('Why can sound travel through solids, liquids, and gases but light cannot through opaque objects?', 'Sound is longitudinal (compressions); light is transverse (needs perpendicular particle motion)', 'hard'),
    ],
  },
  misconceptions: [
    {misconception: 'Sound needs a medium to travel', correction: 'TRUE - sound requires matter; it cannot travel through vacuum'},
  ],
  relatedTopics: ['transverse-waves', 'wave-properties'],
  capsCodes: ['DBE/2014/04/PhysicalSciences/Grade10/Term1'],
}

export const ElectromagneticRadiation: LessonData = {
  id: 'g10-t1-phys-electromagnetic-radiation',
  subject: 'Physical Sciences - Physics',
  subjectId: 'phys-sci',
  grade: 10,
  term: 1,
  topic: 'Electromagnetic Radiation',
  topicId: 'electromagnetic-radiation',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: [
    'Understand EM spectrum',
    'Know properties across spectrum',
    'Identify applications',
  ],
  animation: baseAnimation,
  explanation: baseExplanation,
  workedExamples: [
    {
      level: 'basic',
      question: 'Order from lowest to highest frequency: visible light, UV, radio waves.',
      solution: [
        {step: 'Radio waves: lowest frequency', result: 'Lowest'},
        {step: 'Visible light: middle', result: 'Medium'},
        {step: 'UV: higher frequency', result: 'Higher'},
        {step: 'Order', result: 'Radio < Visible < UV'},
      ],
      explanation: 'EM spectrum ordered by frequency',
    },
    {
      level: 'advanced',
      question: 'If UV wavelength = 300 nm, calculate frequency (c = 3×10⁸ m/s).',
      solution: [
        {step: 'f = c/λ', result: 'f = c/λ'},
        {step: 'Convert 300 nm to m', result: '300 × 10⁻⁹ m'},
        {step: 'f = 3×10⁸ / (300×10⁻⁹)', result: 'f = 10¹⁵ Hz'},
      ],
      explanation: 'UV has very high frequency',
    },
  ],
  practiceQuestions: [
    {id: 'p1', question: 'What type of EM wave is used in microwave ovens?', answer: 'Microwave', type: 'short-answer', hint: 'Between radio and infrared', difficulty: 'easy'},
    {id: 'p2', question: 'Which EM wave is ionizing and dangerous?', answer: 'UV, X-rays, or gamma rays', type: 'short-answer', hint: 'High energy waves', difficulty: 'medium'},
    {id: 'p3', question: 'Calculate f if λ = 600 nm (visible light).', answer: '5 × 10¹⁴ Hz', type: 'short-answer', hint: 'f = c/λ, c = 3×10⁸ m/s', difficulty: 'hard'},
  ],
  quiz: {
    passingScore: 70,
    questions: [
      createQuizQuestion('Radio waves have:', ['Highest frequency', 'Lowest frequency', 'Medium frequency', 'Variable frequency'], 1),
      createQuizQuestion('Visible light wavelength range:', ['100-400 nm', '400-700 nm', '700-1000 nm', '1000+ nm'], 1),
      createQuizQuestion('Which is most dangerous?', ['Radio', 'Microwave', 'Gamma ray', 'Infrared'], 2),
    ],
  },
  test: {
    questions: [
      createTestQuestion('List EM waves from lowest to highest frequency.', 'Radio, microwave, infrared, visible, UV, X-ray, gamma', 'easy'),
      createTestQuestion('Why is UV dangerous?', 'High energy causes damage to cells and DNA', 'medium'),
      createTestQuestion('Microwaves have λ ≈ 1 cm. Calculate frequency.', 'f ≈ 3 × 10⁹ Hz (3 GHz)', 'hard'),
    ],
  },
  misconceptions: [
    {misconception: 'All EM radiation is dangerous', correction: 'Low-energy EM (radio, microwave) is generally safe; high-energy (UV, X-ray, gamma) is dangerous'},
  ],
  relatedTopics: ['transverse-waves', 'wave-properties'],
  capsCodes: ['DBE/2014/04/PhysicalSciences/Grade10/Term1'],
}
