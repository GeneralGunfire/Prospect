// ── Types ─────────────────────────────────────────────────────────────────────

export type TopicStatus = 'not-started' | 'in-progress' | 'mastered' | 'needs-practice' | 'struggling'

export interface DiagnosticQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface WorkedStep {
  step: number
  instruction: string
  explanation: string
}

export interface GuidedPracticeItem {
  id: string
  problem: string
  steps: WorkedStep[]
}

export interface IndependentQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  hint: string
  explanation: string
}

export interface ConceptBlock {
  title: string
  explanation: string       // max 200 words
  workedExample: {
    problem: string
    steps: WorkedStep[]
  }
}

export interface LearningTopic {
  id: string
  title: string
  order: number
  locked: boolean           // true if previous topic not yet mastered
  conceptBlock: ConceptBlock
  guidedPractice: GuidedPracticeItem[]
  independentPractice: IndependentQuestion[]
  diagnosticQuestions: DiagnosticQuestion[]
}

export interface LearningPath {
  id: string
  subject: string
  grade: number
  title: string
  description: string
  totalTopics: number
  estimatedHours: number
  topics: LearningTopic[]
}

// ── Algebra Learning Path ─────────────────────────────────────────────────────

export const algebraLearningPath: LearningPath = {
  id: 'grade10-algebra',
  subject: 'Mathematics',
  grade: 10,
  title: 'Algebra',
  description: 'Master algebraic expressions, factorisation, equations, and inequalities',
  totalTopics: 4,
  estimatedHours: 8,
  topics: [
    // ── Topic 1: Algebraic Expressions ────────────────────────────────────
    {
      id: 'expressions',
      title: 'Algebraic Expressions',
      order: 1,
      locked: false,
      diagnosticQuestions: [
        {
          id: 'exp-d1',
          question: 'Simplify: 3x + 2x',
          options: ['5x', '5x²', '6x', 'x⁵'],
          correctIndex: 0,
          explanation: 'Like terms have the same variable. 3x + 2x = 5x.',
        },
        {
          id: 'exp-d2',
          question: 'What is the coefficient of y in the expression 7y − 3?',
          options: ['3', '−3', '7', '−7'],
          correctIndex: 2,
          explanation: 'The coefficient is the number multiplied by the variable. In 7y, the coefficient is 7.',
        },
        {
          id: 'exp-d3',
          question: 'Expand: 2(x + 4)',
          options: ['2x + 4', 'x + 8', '2x + 8', '2x − 8'],
          correctIndex: 2,
          explanation: 'Distribute 2 to each term inside the brackets: 2×x + 2×4 = 2x + 8.',
        },
      ],
      conceptBlock: {
        title: 'Algebraic Expressions',
        explanation:
          'An algebraic expression uses letters (called variables) to represent unknown numbers. ' +
          'A term is a single number, variable, or their product — like 3x, −5, or 2xy. ' +
          'Like terms share the same variable and power: 3x and 7x are like terms; 3x and 3x² are not. ' +
          'To simplify, collect like terms by adding or subtracting their coefficients. ' +
          'To expand, multiply the term outside the bracket by each term inside.',
        workedExample: {
          problem: 'Simplify: 4x + 3y − x + 2y',
          steps: [
            { step: 1, instruction: 'Identify like terms', explanation: '4x and −x are like terms. 3y and 2y are like terms.' },
            { step: 2, instruction: 'Collect x terms', explanation: '4x − x = 3x' },
            { step: 3, instruction: 'Collect y terms', explanation: '3y + 2y = 5y' },
            { step: 4, instruction: 'Write final answer', explanation: '3x + 5y' },
          ],
        },
      },
      guidedPractice: [
        {
          id: 'exp-g1',
          problem: 'Simplify: 5a + 2b − 2a + 4b',
          steps: [
            { step: 1, instruction: 'Which terms can be grouped together?', explanation: '5a and −2a are like terms. 2b and 4b are like terms.' },
            { step: 2, instruction: 'Combine the a terms', explanation: '5a − 2a = 3a' },
            { step: 3, instruction: 'Combine the b terms', explanation: '2b + 4b = 6b' },
            { step: 4, instruction: 'Write the answer', explanation: '3a + 6b' },
          ],
        },
      ],
      independentPractice: [
        { id: 'exp-i1', question: 'Simplify: 6m − 2m', options: ['4m', '8m', '4m²', '−4m'], correctIndex: 0, hint: 'Subtract the coefficients of like terms.', explanation: '6m − 2m = 4m.' },
        { id: 'exp-i2', question: 'Expand: 3(2x − 1)', options: ['6x − 1', '6x − 3', '5x − 3', '6x + 3'], correctIndex: 1, hint: 'Multiply 3 by each term inside the brackets.', explanation: '3 × 2x = 6x and 3 × (−1) = −3, so the answer is 6x − 3.' },
        { id: 'exp-i3', question: 'Simplify: x² + 3x − x² + x', options: ['4x', '3x', '2x² + 4x', '4x²'], correctIndex: 0, hint: 'x² and −x² are like terms. 3x and x are like terms.', explanation: 'x² − x² = 0. 3x + x = 4x. Answer: 4x.' },
      ],
    },

    // ── Topic 2: Factorisation ────────────────────────────────────────────
    {
      id: 'factorisation',
      title: 'Factorisation',
      order: 2,
      locked: true,
      diagnosticQuestions: [
        {
          id: 'fac-d1',
          question: 'What is the HCF of 6x and 9x²?',
          options: ['3x', '6x', '9x²', '3'],
          correctIndex: 0,
          explanation: 'HCF of 6 and 9 is 3. HCF of x and x² is x. So HCF = 3x.',
        },
        {
          id: 'fac-d2',
          question: 'Factorise: 4x + 8',
          options: ['4(x + 2)', '2(2x + 4)', '4(x + 8)', '8(x + 1)'],
          correctIndex: 0,
          explanation: 'HCF of 4x and 8 is 4. Take out 4: 4(x + 2).',
        },
        {
          id: 'fac-d3',
          question: 'Factorise: x² − 9',
          options: ['(x − 3)(x + 3)', '(x − 9)(x + 1)', '(x − 3)²', '(x + 9)(x − 1)'],
          correctIndex: 0,
          explanation: 'Difference of squares: a² − b² = (a − b)(a + b). Here a = x, b = 3.',
        },
      ],
      conceptBlock: {
        title: 'Factorisation',
        explanation:
          'Factorisation is the reverse of expanding. You rewrite an expression as a product of its factors. ' +
          'Always start by taking out the Highest Common Factor (HCF). ' +
          'For a difference of two squares: a² − b² = (a − b)(a + b). ' +
          'For trinomials like x² + 5x + 6, find two numbers that multiply to 6 and add to 5 (answer: 2 and 3), giving (x + 2)(x + 3).',
        workedExample: {
          problem: 'Factorise: 6x² + 9x',
          steps: [
            { step: 1, instruction: 'Find the HCF of all terms', explanation: 'HCF of 6x² and 9x is 3x.' },
            { step: 2, instruction: 'Divide each term by the HCF', explanation: '6x² ÷ 3x = 2x and 9x ÷ 3x = 3.' },
            { step: 3, instruction: 'Write the factorised form', explanation: '3x(2x + 3).' },
            { step: 4, instruction: 'Check by expanding', explanation: '3x × 2x + 3x × 3 = 6x² + 9x ✓' },
          ],
        },
      },
      guidedPractice: [
        {
          id: 'fac-g1',
          problem: 'Factorise: 10y² − 15y',
          steps: [
            { step: 1, instruction: 'Find the HCF', explanation: 'HCF of 10y² and 15y is 5y.' },
            { step: 2, instruction: 'Divide each term by 5y', explanation: '10y² ÷ 5y = 2y and 15y ÷ 5y = 3.' },
            { step: 3, instruction: 'Write the answer', explanation: '5y(2y − 3).' },
          ],
        },
      ],
      independentPractice: [
        { id: 'fac-i1', question: 'Factorise: 8a + 12', options: ['4(2a + 3)', '2(4a + 6)', '8(a + 4)', '4(2a + 12)'], correctIndex: 0, hint: 'Find the HCF of 8 and 12.', explanation: 'HCF is 4. 4(2a + 3).' },
        { id: 'fac-i2', question: 'Factorise: x² − 16', options: ['(x − 4)(x + 4)', '(x − 8)(x + 2)', '(x − 4)²', '(x + 16)(x − 1)'], correctIndex: 0, hint: 'Is this a difference of squares?', explanation: 'x² − 16 = x² − 4². Difference of squares: (x − 4)(x + 4).' },
        { id: 'fac-i3', question: 'Factorise: x² + 7x + 12', options: ['(x + 3)(x + 4)', '(x + 2)(x + 6)', '(x + 1)(x + 12)', '(x + 7)(x + 5)'], correctIndex: 0, hint: 'Find two numbers that multiply to 12 and add to 7.', explanation: '3 × 4 = 12 and 3 + 4 = 7, so (x + 3)(x + 4).' },
      ],
    },

    // ── Topic 3: Equations ────────────────────────────────────────────────
    {
      id: 'equations',
      title: 'Equations',
      order: 3,
      locked: true,
      diagnosticQuestions: [
        {
          id: 'eq-d1',
          question: 'Solve: x + 5 = 12',
          options: ['x = 7', 'x = 17', 'x = −7', 'x = 60'],
          correctIndex: 0,
          explanation: 'Subtract 5 from both sides: x = 12 − 5 = 7.',
        },
        {
          id: 'eq-d2',
          question: 'Solve: 3x = 18',
          options: ['x = 6', 'x = 15', 'x = 54', 'x = 21'],
          correctIndex: 0,
          explanation: 'Divide both sides by 3: x = 18 ÷ 3 = 6.',
        },
      ],
      conceptBlock: {
        title: 'Solving Linear Equations',
        explanation:
          'An equation states that two expressions are equal. To solve for x, isolate x on one side. ' +
          'Whatever you do to one side, do to the other. ' +
          'Steps: 1) Expand brackets. 2) Move x terms to the left, numbers to the right. 3) Divide by the coefficient of x.',
        workedExample: {
          problem: 'Solve: 2(x − 3) = 8',
          steps: [
            { step: 1, instruction: 'Expand the bracket', explanation: '2x − 6 = 8.' },
            { step: 2, instruction: 'Add 6 to both sides', explanation: '2x = 14.' },
            { step: 3, instruction: 'Divide both sides by 2', explanation: 'x = 7.' },
            { step: 4, instruction: 'Check: substitute x = 7', explanation: '2(7 − 3) = 2 × 4 = 8 ✓' },
          ],
        },
      },
      guidedPractice: [
        {
          id: 'eq-g1',
          problem: 'Solve: 3x + 4 = 19',
          steps: [
            { step: 1, instruction: 'Subtract 4 from both sides', explanation: '3x = 15.' },
            { step: 2, instruction: 'Divide both sides by 3', explanation: 'x = 5.' },
            { step: 3, instruction: 'Check your answer', explanation: '3(5) + 4 = 15 + 4 = 19 ✓' },
          ],
        },
      ],
      independentPractice: [
        { id: 'eq-i1', question: 'Solve: x − 4 = 10', options: ['x = 14', 'x = 6', 'x = −6', 'x = 40'], correctIndex: 0, hint: 'Add 4 to both sides.', explanation: 'x = 10 + 4 = 14.' },
        { id: 'eq-i2', question: 'Solve: 5x = 35', options: ['x = 7', 'x = 30', 'x = 175', 'x = 5'], correctIndex: 0, hint: 'Divide both sides by 5.', explanation: 'x = 35 ÷ 5 = 7.' },
        { id: 'eq-i3', question: 'Solve: 2x + 3 = 11', options: ['x = 4', 'x = 7', 'x = 8', 'x = 3'], correctIndex: 0, hint: 'First subtract 3, then divide by 2.', explanation: '2x = 8, so x = 4.' },
      ],
    },

    // ── Topic 4: Inequalities ─────────────────────────────────────────────
    {
      id: 'inequalities',
      title: 'Inequalities',
      order: 4,
      locked: true,
      diagnosticQuestions: [
        {
          id: 'ineq-d1',
          question: 'What does x > 3 mean?',
          options: ['x is greater than 3', 'x is less than 3', 'x equals 3', 'x is at least 3'],
          correctIndex: 0,
          explanation: 'The > symbol means "greater than". x > 3 means x is any value strictly above 3.',
        },
        {
          id: 'ineq-d2',
          question: 'Solve: x + 2 > 7',
          options: ['x > 5', 'x > 9', 'x < 5', 'x = 5'],
          correctIndex: 0,
          explanation: 'Subtract 2 from both sides: x > 5.',
        },
      ],
      conceptBlock: {
        title: 'Inequalities',
        explanation:
          'Inequalities show that two expressions are not equal. Symbols: > (greater than), < (less than), ≥ (greater than or equal), ≤ (less than or equal). ' +
          'Solve like equations — but IMPORTANT: when you multiply or divide both sides by a NEGATIVE number, flip the inequality sign. ' +
          'The solution is usually a range of values, shown on a number line.',
        workedExample: {
          problem: 'Solve: 3x − 4 ≥ 8 and show on a number line',
          steps: [
            { step: 1, instruction: 'Add 4 to both sides', explanation: '3x ≥ 12.' },
            { step: 2, instruction: 'Divide both sides by 3 (positive, no flip)', explanation: 'x ≥ 4.' },
            { step: 3, instruction: 'Number line', explanation: 'Draw a closed circle at 4 (≥ includes 4) and shade to the right.' },
          ],
        },
      },
      guidedPractice: [
        {
          id: 'ineq-g1',
          problem: 'Solve: 2x + 1 < 9',
          steps: [
            { step: 1, instruction: 'Subtract 1 from both sides', explanation: '2x < 8.' },
            { step: 2, instruction: 'Divide both sides by 2', explanation: 'x < 4.' },
            { step: 3, instruction: 'Describe the solution', explanation: 'All values of x less than 4.' },
          ],
        },
      ],
      independentPractice: [
        { id: 'ineq-i1', question: 'Solve: x − 3 > 5', options: ['x > 8', 'x > 2', 'x < 8', 'x = 8'], correctIndex: 0, hint: 'Add 3 to both sides.', explanation: 'x > 5 + 3 = 8.' },
        { id: 'ineq-i2', question: 'Solve: 4x ≤ 20', options: ['x ≤ 5', 'x ≤ 16', 'x ≥ 5', 'x < 5'], correctIndex: 0, hint: 'Divide both sides by 4 (positive, no flip).', explanation: 'x ≤ 20 ÷ 4 = 5.' },
        { id: 'ineq-i3', question: 'If −2x > 8, what is x?', options: ['x < −4', 'x > −4', 'x > 4', 'x < 4'], correctIndex: 0, hint: 'Dividing by a negative number flips the inequality.', explanation: 'Divide by −2 and flip: x < −4.' },
      ],
    },
  ],
}
