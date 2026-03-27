import { LessonData } from '../../../../../types/lesson'

// Factorisation
export const Factorisation: LessonData = {
  id: 'g10-t1-math-factorisation',
  subject: 'Mathematics',
  subjectId: 'maths',
  grade: 10,
  term: 1,
  topic: 'Factorisation',
  topicId: 'factorisation',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: ['Factor out common factors', 'Use difference of two squares', 'Factor trinomials', 'Group terms where applicable'],
  animation: { title: 'Factorisation Methods', duration: 2, description: 'Visual guide to factorisation', steps: [
    { duration: 2, title: 'Common Factor', visual: '6x + 9 = 3(2x + 3)', narration: 'Find the greatest common factor of all terms' },
    { duration: 2, title: 'Difference of Squares', visual: 'x² - 16 = (x + 4)(x - 4)', narration: 'When you see a² - b², use (a+b)(a-b)' },
    { duration: 2, title: 'Trinomial', visual: 'x² + 5x + 6 = (x + 2)(x + 3)', narration: 'Find two numbers that multiply to give c and add to give b' },
  ] },
  explanation: { title: 'Factorisation Techniques', sections: [
    { heading: 'Common Factor', content: 'Find the GCF of all terms and factor it out. Example: 4x + 8 = 4(x + 2)' },
    { heading: 'Difference of Squares', content: 'a² - b² = (a + b)(a - b). Example: 9 - x² = (3 + x)(3 - x)' },
    { heading: 'Trinomials', content: 'For ax² + bx + c, find factors of ac that add to b. Example: x² + 7x + 10 = (x + 2)(x + 5)' },
  ] },
  workedExamples: [
    { level: 'basic', question: 'Factor: 2x + 4', solution: [
      { step: 'Find GCF', result: 'GCF = 2' },
      { step: 'Factor out 2', result: '2(x + 2)' },
    ], explanation: 'The GCF of 2x and 4 is 2' },
    { level: 'intermediate', question: 'Factor: x² - 25', solution: [
      { step: 'Recognize as difference of squares', result: 'x² - 5²' },
      { step: 'Apply formula', result: '(x + 5)(x - 5)' },
    ], explanation: '(a + b)(a - b) pattern with a = x, b = 5' },
    { level: 'intermediate', question: 'Factor: x² + 8x + 12', solution: [
      { step: 'Find two numbers that multiply to 12 and add to 8', result: '2 and 6' },
      { step: 'Write factorization', result: '(x + 2)(x + 6)' },
    ], explanation: '2 × 6 = 12 and 2 + 6 = 8' },
    { level: 'advanced', question: 'Factor: 2x² + 7x + 3', solution: [
      { step: 'Find factors of 2·3=6 that add to 7', result: '1 and 6' },
      { step: 'Rewrite middle term', result: '2x² + x + 6x + 3' },
      { step: 'Group and factor', result: 'x(2x + 1) + 3(2x + 1) = (2x + 1)(x + 3)' },
    ], explanation: 'Use the AC method for trinomials with leading coefficient ≠ 1' },
    { level: 'advanced', question: 'Factor: a² + 2ab + b²', solution: [
      { step: 'Recognize as perfect square', result: '(a + b)²' },
    ], explanation: 'This is a perfect square trinomial: a² + 2ab + b² = (a + b)²' },
  ],
  practiceQuestions: [
    { id: 'p1', question: 'Factor: 3x + 6', answer: '3(x + 2)', type: 'short-answer', hint: 'Find the GCF', difficulty: 'easy' },
    { id: 'p2', question: 'Factor: x² - 9', answer: '(x + 3)(x - 3)', type: 'short-answer', hint: 'Difference of squares', difficulty: 'easy' },
    { id: 'p3', question: 'Factor: x² + 5x + 6', answer: '(x + 2)(x + 3)', type: 'short-answer', hint: 'Trinomial factoring', difficulty: 'medium' },
    { id: 'p4', question: 'Factor: 5a² - 20', answer: '5(a² - 4) or 5(a + 2)(a - 2)', type: 'short-answer', hint: 'GCF first, then difference of squares', difficulty: 'medium' },
    { id: 'p5', question: 'Factor: m² + 6m + 9', answer: '(m + 3)²', type: 'short-answer', hint: 'Perfect square trinomial', difficulty: 'hard' },
  ],
  quiz: { passingScore: 70, questions: [
    { id: 'q1', question: 'Factor: 4x + 8', options: ['4(x + 2)', '2(2x + 4)', '8(x)', 'x(4 + 8)'], correct: 0, explanation: '4x + 8 = 4(x + 2)' },
    { id: 'q2', question: 'What is x² - 16 factored?', options: ['(x - 4)²', '(x + 4)²', '(x + 4)(x - 4)', '(x - 8)(x + 2)'], correct: 2, explanation: 'x² - 16 = (x + 4)(x - 4)' },
    { id: 'q3', question: 'Factor: x² + 7x + 12', options: ['(x + 3)(x + 4)', '(x + 2)(x + 6)', '(x + 1)(x + 12)', '(x + 4)(x + 3)'], correct: 0, explanation: '(x + 3)(x + 4) = x² + 7x + 12' },
    { id: 'q4', question: 'Factor completely: 2x² + 8x', options: ['2x(x + 4)', '2x(x + 8)', 'x(2x + 8)', '2(x² + 4x)'], correct: 0, explanation: '2x² + 8x = 2x(x + 4)' },
    { id: 'q5', question: 'What is (a + 3)² expanded?', options: ['a² + 9', 'a² + 6a + 9', 'a² + 3a + 9', '2a + 6'], correct: 1, explanation: '(a + 3)² = a² + 6a + 9' },
    { id: 'q6', question: 'Factor: x² - 10x + 25', options: ['(x - 5)(x + 5)', '(x - 5)²', '(x - 25)(x + 1)', '(x - 2)(x - 5)'], correct: 1, explanation: 'This is a perfect square: (x - 5)²' },
  ] },
  test: { questions: [
    { id: 't1', question: 'Factor: 5x + 10', type: 'short-answer', answer: '5(x + 2)', difficulty: 'easy' },
    { id: 't2', question: 'Factor: y² - 4', type: 'short-answer', answer: '(y + 2)(y - 2)', difficulty: 'easy' },
    { id: 't3', question: 'Factor: x² + 6x + 8', type: 'short-answer', answer: '(x + 2)(x + 4)', difficulty: 'medium' },
    { id: 't4', question: 'Factor: 3m² + 6m', type: 'short-answer', answer: '3m(m + 2)', difficulty: 'medium' },
    { id: 't5', question: 'Factor: x² - 8x + 16', type: 'short-answer', answer: '(x - 4)²', difficulty: 'hard' },
    { id: 't6', question: 'Factor: 2a² - 8', type: 'short-answer', answer: '2(a + 2)(a - 2)', difficulty: 'hard' },
    { id: 't7', question: 'Factor: x² + 10x + 25', type: 'short-answer', answer: '(x + 5)²', difficulty: 'hard' },
    { id: 't8', question: 'Factor: p² - 49', type: 'short-answer', answer: '(p + 7)(p - 7)', difficulty: 'hard' },
    { id: 't9', question: 'Factor completely: 4x² + 4x', type: 'short-answer', answer: '4x(x + 1)', difficulty: 'hard' },
    { id: 't10', question: 'Factor: 2x² + 5x + 3', type: 'short-answer', answer: '(2x + 3)(x + 1)', difficulty: 'hard' },
  ] },
  misconceptions: [
    { misconception: 'You can factor (a² + b²) as (a + b)²', correction: 'a² + b² cannot be factored using real numbers. Only a² - b² factors to (a + b)(a - b)' },
  ],
  relatedTopics: ['expanding-brackets', 'algebraic-fractions'],
  capsCodes: ['DBE/2014/04/Mathematics/Grade10/Term1'],
}

// Algebraic Fractions
export const AlgebraicFractions: LessonData = {
  id: 'g10-t1-math-algebraic-fractions',
  subject: 'Mathematics',
  subjectId: 'maths',
  grade: 10,
  term: 1,
  topic: 'Algebraic Fractions',
  topicId: 'algebraic-fractions',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: ['Simplify algebraic fractions', 'Multiply and divide algebraic fractions', 'Add and subtract algebraic fractions'],
  animation: { title: 'Algebraic Fractions', duration: 2, description: 'Simplifying and operations with fractions', steps: [
    { duration: 2, title: 'Simplify', visual: '(x+2)/(x+2) cancels to 1', narration: 'Cancel common factors in numerator and denominator' },
    { duration: 2, title: 'Multiply', visual: '(a/b) × (c/d) = ac/bd', narration: 'Multiply numerators and denominators' },
  ] },
  explanation: { title: 'Working with Algebraic Fractions', sections: [
    { heading: 'Simplifying', content: 'Factor numerator and denominator, then cancel common factors. Only factors can be cancelled, not individual terms.' },
    { heading: 'Multiplying', content: '(a/b) × (c/d) = ac/bd. Simplify before or after multiplying.' },
    { heading: 'Dividing', content: '(a/b) ÷ (c/d) = (a/b) × (d/c). Flip and multiply.' },
  ] },
  workedExamples: [
    { level: 'basic', question: 'Simplify: (6x)/(9x²)', solution: [
      { step: 'Find common factors', result: 'GCF = 3x' },
      { step: 'Simplify', result: '2/3x' },
    ], explanation: '6x = 2·3x, 9x² = 3·3x², so 6x/9x² = 2/3x' },
    { level: 'intermediate', question: 'Simplify: (x² - 4)/(x + 2)', solution: [
      { step: 'Factor numerator', result: '(x + 2)(x - 2)/(x + 2)' },
      { step: 'Cancel (x + 2)', result: 'x - 2' },
    ], explanation: 'x² - 4 = (x + 2)(x - 2), cancel (x + 2) from numerator and denominator' },
    { level: 'advanced', question: 'Simplify: (2x + 4)/(x² - 4)', solution: [
      { step: 'Factor numerator', result: '2(x + 2)' },
      { step: 'Factor denominator', result: '(x + 2)(x - 2)' },
      { step: 'Cancel (x + 2)', result: '2/(x - 2)' },
    ], explanation: 'Factor both, then cancel common factors' },
  ],
  practiceQuestions: [
    { id: 'p1', question: 'Simplify: (4x)/(8)', answer: 'x/2', type: 'short-answer', hint: 'Find GCF of 4 and 8', difficulty: 'easy' },
    { id: 'p2', question: 'Simplify: (x² - 1)/(x + 1)', answer: 'x - 1', type: 'short-answer', hint: 'Factor numerator', difficulty: 'medium' },
    { id: 'p3', question: 'Simplify: (3x + 6)/(x + 2)', answer: '3', type: 'short-answer', hint: 'Factor numerator', difficulty: 'medium' },
  ],
  quiz: { passingScore: 70, questions: [
    { id: 'q1', question: 'Simplify: (9a)/(12)', options: ['3a/4', '9a/12', 'a/3', '9/12'], correct: 0, explanation: 'GCF(9,12) = 3, so (9a)/12 = (3a)/4' },
    { id: 'q2', question: 'Simplify: (x² - 9)/(x + 3)', options: ['x - 3', 'x + 3', 'x/3', '(x - 9)/3'], correct: 0, explanation: 'x² - 9 = (x + 3)(x - 3), cancel (x + 3)' },
    { id: 'q3', question: 'Which can be cancelled from (x + 2)/(2(x + 2))?', options: ['x + 2', '2', 'x', '+'], correct: 0, explanation: '(x + 2) appears in both numerator and denominator, so it cancels' },
  ] },
  test: { questions: [
    { id: 't1', question: 'Simplify: (6xy)/(9x)', type: 'short-answer', answer: '2y/3', difficulty: 'easy' },
    { id: 't2', question: 'Simplify: (x² + x)/(x)', type: 'short-answer', answer: 'x + 1', difficulty: 'easy' },
    { id: 't3', question: 'Simplify: (x² - 4)/(x - 2)', type: 'short-answer', answer: 'x + 2', difficulty: 'medium' },
    { id: 't4', question: 'Simplify: (2x + 4)/(x² - 4)', type: 'short-answer', answer: '2/(x - 2)', difficulty: 'hard' },
  ] },
  misconceptions: [
    { misconception: 'You can cancel individual terms, like cancelling the x in (x + 2)/x', correction: 'Only factors can be cancelled. You must factor first.' },
  ],
  relatedTopics: ['factorisation', 'expanding-brackets'],
  capsCodes: ['DBE/2014/04/Mathematics/Grade10/Term1'],
}

// Linear Equations
export const LinearEquations: LessonData = {
  id: 'g10-t1-math-linear-equations',
  subject: 'Mathematics',
  subjectId: 'maths',
  grade: 10,
  term: 1,
  topic: 'Linear Equations',
  topicId: 'linear-equations',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: ['Solve linear equations using inverse operations', 'Verify solutions', 'Solve equations with fractions'],
  animation: { title: 'Solving Linear Equations', duration: 2, description: 'Balance scale method for solving', steps: [
    { duration: 2, title: 'Balance Both Sides', visual: '2x + 3 = 11 with balance scale', narration: 'Keep the equation balanced by doing the same operation on both sides' },
    { duration: 2, title: 'Inverse Operations', visual: 'Subtract 3, then divide by 2', narration: 'Use inverse operations: addition ↔ subtraction, multiplication ↔ division' },
  ] },
  explanation: { title: 'Solving Linear Equations', sections: [
    { heading: 'Balance Method', content: 'Whatever you do to one side, do to the other. Goal: isolate the variable.' },
    { heading: 'Inverse Operations', content: 'Addition ↔ Subtraction, Multiplication ↔ Division. Example: 3x + 5 = 14 → 3x = 9 → x = 3' },
  ] },
  workedExamples: [
    { level: 'basic', question: 'Solve: x + 5 = 12', solution: [
      { step: 'Subtract 5 from both sides', result: 'x = 7' },
      { step: 'Check: 7 + 5 = 12 ✓', result: 'x = 7' },
    ], explanation: 'Inverse of +5 is -5' },
    { level: 'intermediate', question: 'Solve: 2x - 3 = 7', solution: [
      { step: 'Add 3 to both sides', result: '2x = 10' },
      { step: 'Divide by 2', result: 'x = 5' },
      { step: 'Check', result: '2(5) - 3 = 7 ✓' },
    ], explanation: 'First undo subtraction, then undo multiplication' },
    { level: 'advanced', question: 'Solve: (x + 2)/3 = 4', solution: [
      { step: 'Multiply both sides by 3', result: 'x + 2 = 12' },
      { step: 'Subtract 2', result: 'x = 10' },
      { step: 'Check', result: '(10 + 2)/3 = 4 ✓' },
    ], explanation: 'Work backwards through order of operations' },
  ],
  practiceQuestions: [
    { id: 'p1', question: 'Solve: x + 3 = 8', answer: '5', type: 'short-answer', hint: 'Subtract 3', difficulty: 'easy' },
    { id: 'p2', question: 'Solve: 3x = 15', answer: '5', type: 'short-answer', hint: 'Divide by 3', difficulty: 'easy' },
    { id: 'p3', question: 'Solve: 2x + 1 = 9', answer: '4', type: 'short-answer', hint: 'Subtract 1, then divide by 2', difficulty: 'medium' },
    { id: 'p4', question: 'Solve: (x + 4)/2 = 5', answer: '6', type: 'short-answer', hint: 'Multiply by 2, then subtract 4', difficulty: 'hard' },
  ],
  quiz: { passingScore: 70, questions: [
    { id: 'q1', question: 'Solve: x + 2 = 9', options: ['7', '11', '6', '2'], correct: 0, explanation: 'x = 9 - 2 = 7' },
    { id: 'q2', question: 'Solve: 4x = 20', options: ['5', '16', '24', '80'], correct: 0, explanation: 'x = 20 ÷ 4 = 5' },
    { id: 'q3', question: 'Solve: 2x - 3 = 5', options: ['1', '4', '1.5', '8'], correct: 1, explanation: '2x = 8, x = 4' },
  ] },
  test: { questions: [
    { id: 't1', question: 'Solve: x - 5 = 2', type: 'short-answer', answer: '7', difficulty: 'easy' },
    { id: 't2', question: 'Solve: 5x = 30', type: 'short-answer', answer: '6', difficulty: 'easy' },
    { id: 't3', question: 'Solve: 3x + 2 = 11', type: 'short-answer', answer: '3', difficulty: 'medium' },
    { id: 't4', question: 'Solve: (x + 1)/4 = 2', type: 'short-answer', answer: '7', difficulty: 'hard' },
    { id: 't5', question: 'Solve: 2(x + 3) = 14', type: 'short-answer', answer: '4', difficulty: 'hard' },
  ] },
  misconceptions: [
    { misconception: 'You only operate on one side of the equation', correction: 'You must keep both sides balanced by doing the same operation to both sides' },
  ],
  relatedTopics: ['quadratic-equations', 'linear-inequalities'],
  capsCodes: ['DBE/2014/04/Mathematics/Grade10/Term1'],
}

// Quadratic Equations
export const QuadraticEquations: LessonData = {
  id: 'g10-t1-math-quadratic-equations',
  subject: 'Mathematics',
  subjectId: 'maths',
  grade: 10,
  term: 1,
  topic: 'Quadratic Equations',
  topicId: 'quadratic-equations',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: ['Solve by factorisation', 'Understand zero product property', 'Apply to real-world problems'],
  animation: { title: 'Solving Quadratic Equations', duration: 2, description: 'Factorisation method', steps: [
    { duration: 2, title: 'Set to Zero', visual: 'x² + 5x + 6 = 0', narration: 'Rearrange so one side equals zero' },
    { duration: 2, title: 'Factor', visual: '(x + 2)(x + 3) = 0', narration: 'Factor the quadratic expression' },
    { duration: 2, title: 'Zero Product', visual: 'If (x+2)(x+3) = 0, then x+2 = 0 or x+3 = 0', narration: 'If a product equals zero, one factor must be zero' },
    { duration: 2, title: 'Solve', visual: 'x = -2 or x = -3', narration: 'Solve each equation separately' },
  ] },
  explanation: { title: 'Solving Quadratic Equations', sections: [
    { heading: 'Standard Form', content: 'ax² + bx + c = 0. Get everything on one side, equals zero.' },
    { heading: 'Factorisation Method', content: 'Factor the quadratic. Use zero product property: if AB = 0, then A = 0 or B = 0.' },
    { heading: 'Zero Product Property', content: 'The only way a product can be zero is if at least one factor is zero.' },
  ] },
  workedExamples: [
    { level: 'basic', question: 'Solve: x² - 4 = 0', solution: [
      { step: 'Factor difference of squares', result: '(x + 2)(x - 2) = 0' },
      { step: 'Zero product property', result: 'x + 2 = 0 or x - 2 = 0' },
      { step: 'Solve each', result: 'x = -2 or x = 2' },
    ], explanation: 'Difference of squares gives two solutions' },
    { level: 'intermediate', question: 'Solve: x² + 5x + 6 = 0', solution: [
      { step: 'Factor trinomial', result: '(x + 2)(x + 3) = 0' },
      { step: 'Zero product property', result: 'x + 2 = 0 or x + 3 = 0' },
      { step: 'Solve each', result: 'x = -2 or x = -3' },
    ], explanation: 'Two factors give two solutions' },
    { level: 'advanced', question: 'Solve: 2x² + 7x + 3 = 0', solution: [
      { step: 'Factor using AC method', result: '(2x + 1)(x + 3) = 0' },
      { step: 'Zero product property', result: '2x + 1 = 0 or x + 3 = 0' },
      { step: 'Solve each', result: 'x = -1/2 or x = -3' },
    ], explanation: 'Leading coefficient requires more care in factorisation' },
  ],
  practiceQuestions: [
    { id: 'p1', question: 'Solve: x² - 9 = 0', answer: 'x = 3 or x = -3', type: 'short-answer', hint: 'Difference of squares', difficulty: 'easy' },
    { id: 'p2', question: 'Solve: x² + 6x + 8 = 0', answer: 'x = -2 or x = -4', type: 'short-answer', hint: 'Factor the trinomial', difficulty: 'medium' },
    { id: 'p3', question: 'Solve: x² = 16', answer: 'x = 4 or x = -4', type: 'short-answer', hint: 'Rearrange first', difficulty: 'medium' },
  ],
  quiz: { passingScore: 70, questions: [
    { id: 'q1', question: 'Solve: x² - 1 = 0', options: ['x = 1', 'x = -1', 'x = 1 or x = -1', 'No solution'], correct: 2, explanation: 'x² - 1 = (x + 1)(x - 1) = 0, so x = 1 or x = -1' },
    { id: 'q2', question: 'Factor: x² + 7x + 12', options: ['(x + 3)(x + 4)', '(x + 2)(x + 6)', '(x + 1)(x + 12)', '(x + 4)(x + 3)'], correct: 0, explanation: '(x + 3)(x + 4) = x² + 7x + 12' },
  ] },
  test: { questions: [
    { id: 't1', question: 'Solve: x² - 25 = 0', type: 'short-answer', answer: 'x = 5 or x = -5', difficulty: 'easy' },
    { id: 't2', question: 'Solve: x² + 3x + 2 = 0', type: 'short-answer', answer: 'x = -1 or x = -2', difficulty: 'medium' },
    { id: 't3', question: 'Solve: x² - 6x = 0', type: 'short-answer', answer: 'x = 0 or x = 6', difficulty: 'medium' },
    { id: 't4', question: 'Solve: 2x² + 5x + 2 = 0', type: 'short-answer', answer: 'x = -2 or x = -1/2', difficulty: 'hard' },
  ] },
  misconceptions: [
    { misconception: 'A quadratic always has two different solutions', correction: 'A quadratic can have two solutions, one repeated solution, or no real solutions' },
  ],
  relatedTopics: ['linear-equations', 'expanding-brackets', 'factorisation'],
  capsCodes: ['DBE/2014/04/Mathematics/Grade10/Term1'],
}

// Linear Inequalities
export const LinearInequalities: LessonData = {
  id: 'g10-t1-math-linear-inequalities',
  subject: 'Mathematics',
  subjectId: 'maths',
  grade: 10,
  term: 1,
  topic: 'Linear Inequalities',
  topicId: 'linear-inequalities',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: ['Solve linear inequalities', 'Represent solutions on a number line', 'Understand when inequality sign flips'],
  animation: { title: 'Solving Inequalities', duration: 2, description: 'Like equations, but with a twist', steps: [
    { duration: 2, title: 'Like Equations', visual: '2x + 3 < 11 subtract 3 from both sides', narration: 'Solve just like equations... at first' },
    { duration: 2, title: 'The Flip', visual: '-2x > 6 divide by -2, flip to x < -3', narration: 'When multiply/divide by negative, flip the inequality sign!' },
    { duration: 2, title: 'Number Line', visual: 'x < 5 shown on number line with open circle at 5', narration: 'Show solution as interval on number line' },
  ] },
  explanation: { title: 'Linear Inequalities', sections: [
    { heading: 'Solving', content: 'Like equations, but preserve inequality direction. When you multiply or divide by a negative number, flip the inequality sign.' },
    { heading: 'Number Line Representation', content: 'Use open circle for < or >, filled circle for ≤ or ≥. Shade the region of solutions.' },
  ] },
  workedExamples: [
    { level: 'basic', question: 'Solve: x + 3 < 8', solution: [
      { step: 'Subtract 3 from both sides', result: 'x < 5' },
      { step: 'Number line', result: 'Open circle at 5, shade left' },
    ], explanation: 'No negative multiplication, sign stays <' },
    { level: 'intermediate', question: 'Solve: -2x + 5 > 1', solution: [
      { step: 'Subtract 5', result: '-2x > -4' },
      { step: 'Divide by -2, flip sign', result: 'x < 2' },
      { step: 'Number line', result: 'Open circle at 2, shade left' },
    ], explanation: 'Dividing by negative flips > to <' },
    { level: 'advanced', question: 'Solve: 3(x - 2) ≤ 9', solution: [
      { step: 'Expand', result: '3x - 6 ≤ 9' },
      { step: 'Add 6', result: '3x ≤ 15' },
      { step: 'Divide by 3', result: 'x ≤ 5' },
    ], explanation: 'Positive division keeps ≤ sign' },
  ],
  practiceQuestions: [
    { id: 'p1', question: 'Solve: x - 2 < 5', answer: 'x < 7', type: 'short-answer', hint: 'Add 2 to both sides', difficulty: 'easy' },
    { id: 'p2', question: 'Solve: -x > 3', answer: 'x < -3', type: 'short-answer', hint: 'Divide by -1, flip sign', difficulty: 'medium' },
    { id: 'p3', question: 'Solve: 2x + 1 ≤ 7', answer: 'x ≤ 3', type: 'short-answer', hint: 'Subtract 1, divide by 2', difficulty: 'medium' },
  ],
  quiz: { passingScore: 70, questions: [
    { id: 'q1', question: 'Solve: x + 2 > 5', options: ['x > 3', 'x < 3', 'x > 7', 'x < 7'], correct: 0, explanation: 'x > 5 - 2 = 3' },
    { id: 'q2', question: 'What happens to > when you multiply by -1?', options: ['Stays >', 'Becomes <', 'Becomes ≤', 'Becomes ≥'], correct: 1, explanation: 'Multiplying by negative flips inequality' },
    { id: 'q3', question: 'Solve: -2x < 8', options: ['x < 4', 'x > 4', 'x < -4', 'x > -4'], correct: 1, explanation: 'Divide by -2: x > -4' },
  ] },
  test: { questions: [
    { id: 't1', question: 'Solve: x + 1 < 6', type: 'short-answer', answer: 'x < 5', difficulty: 'easy' },
    { id: 't2', question: 'Solve: 3x ≥ 12', type: 'short-answer', answer: 'x ≥ 4', difficulty: 'easy' },
    { id: 't3', question: 'Solve: -x + 5 > 2', type: 'short-answer', answer: 'x < 3', difficulty: 'medium' },
    { id: 't4', question: 'Solve: 2(x - 1) ≤ 6', type: 'short-answer', answer: 'x ≤ 4', difficulty: 'hard' },
  ] },
  misconceptions: [
    { misconception: 'You never flip the inequality sign', correction: 'You flip when multiplying or dividing by a negative number' },
  ],
  relatedTopics: ['linear-equations'],
  capsCodes: ['DBE/2014/04/Mathematics/Grade10/Term1'],
}

// Arithmetic Sequences
export const ArithmeticSequences: LessonData = {
  id: 'g10-t1-math-arithmetic-sequences',
  subject: 'Mathematics',
  subjectId: 'maths',
  grade: 10,
  term: 1,
  topic: 'Arithmetic Sequences',
  topicId: 'arithmetic-sequences',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: ['Identify arithmetic sequences', 'Find common difference', 'Use general term formula: Tₙ = a + (n-1)d'],
  animation: { title: 'Arithmetic Sequences', duration: 2, description: 'Pattern finding in sequences', steps: [
    { duration: 2, title: 'Sequence Pattern', visual: '2, 5, 8, 11, ... with differences highlighted', narration: 'Look for the pattern in the sequence' },
    { duration: 2, title: 'Common Difference', visual: 'd = 3 (constant difference between terms)', narration: 'In an arithmetic sequence, consecutive terms differ by a constant amount' },
    { duration: 2, title: 'General Term', visual: 'Tₙ = a + (n-1)d where a is first term, d is common difference', narration: 'Use formula to find any term without listing all previous terms' },
  ] },
  explanation: { title: 'Arithmetic Sequences', sections: [
    { heading: 'Definition', content: 'An arithmetic sequence has a constant difference between consecutive terms. Example: 3, 7, 11, 15, ... has common difference d = 4' },
    { heading: 'General Term Formula', content: 'Tₙ = a + (n-1)d, where a is the first term and d is the common difference. Example: for 3, 7, 11, 15, ..., Tₙ = 3 + (n-1)·4' },
    { heading: 'Sum of Sequence', content: 'Sₙ = n/2(first term + last term) or Sₙ = n/2(2a + (n-1)d)' },
  ] },
  workedExamples: [
    { level: 'basic', question: 'Find the 5th term of: 2, 5, 8, 11, ...', solution: [
      { step: 'Find common difference', result: 'd = 3' },
      { step: 'Identify first term', result: 'a = 2' },
      { step: 'Use formula Tₙ = a + (n-1)d', result: 'T₅ = 2 + (5-1)·3 = 2 + 12 = 14' },
    ], explanation: 'The 5th term is 14' },
    { level: 'intermediate', question: 'Find which term equals 50 in: 4, 9, 14, 19, ...', solution: [
      { step: 'Find d', result: 'd = 5' },
      { step: 'First term a = 4', result: 'Tₙ = 4 + (n-1)·5' },
      { step: 'Set Tₙ = 50', result: '4 + (n-1)·5 = 50' },
      { step: 'Solve for n', result: '(n-1)·5 = 46, n-1 = 9.2, n = 10.2' },
      { step: 'Result', result: '50 is not a term (n must be a whole number)' },
    ], explanation: '50 does not appear in this sequence' },
    { level: 'advanced', question: 'Find sum of first 10 terms: 2, 5, 8, 11, ...', solution: [
      { step: 'First term a = 2, d = 3', result: 'T₁₀ = 2 + (10-1)·3 = 29' },
      { step: 'Use sum formula', result: 'S₁₀ = 10/2(2 + 29) = 5·31 = 155' },
    ], explanation: 'Sum of first 10 terms is 155' },
  ],
  practiceQuestions: [
    { id: 'p1', question: 'Find common difference: 5, 8, 11, 14', answer: '3', type: 'short-answer', hint: 'Subtract consecutive terms', difficulty: 'easy' },
    { id: 'p2', question: 'Find 4th term: 1, 4, 7, 10, ...', answer: '10', type: 'short-answer', hint: 'd = 3, a = 1, use Tₙ = a + (n-1)d', difficulty: 'easy' },
    { id: 'p3', question: 'Find T₆ where a = 2 and d = 5', answer: '27', type: 'short-answer', hint: 'T₆ = 2 + (6-1)·5', difficulty: 'medium' },
  ],
  quiz: { passingScore: 70, questions: [
    { id: 'q1', question: 'Is 2, 4, 8, 16, ... arithmetic?', options: ['Yes', 'No', 'Maybe', 'Cannot tell'], correct: 1, explanation: 'Differences are 2, 4, 8 (not constant), so not arithmetic' },
    { id: 'q2', question: 'Find T₃ of: 1, 4, 7, ...', options: ['7', '10', '4', '1'], correct: 0, explanation: 'a = 1, d = 3, T₃ = 1 + (3-1)·3 = 7' },
  ] },
  test: { questions: [
    { id: 't1', question: 'Find the common difference: 10, 7, 4, 1', type: 'short-answer', answer: '-3', difficulty: 'easy' },
    { id: 't2', question: 'Find T₅: 3, 6, 9, 12, ...', type: 'short-answer', answer: '15', difficulty: 'easy' },
    { id: 't3', question: 'Find Tₙ for sequence 5, 10, 15, 20, ...', type: 'short-answer', answer: 'Tₙ = 5n or Tₙ = 5 + (n-1)·5', difficulty: 'medium' },
    { id: 't4', question: 'Find sum of first 8 terms: 2, 5, 8, 11, ...', type: 'short-answer', answer: '116', difficulty: 'hard' },
  ] },
  misconceptions: [
    { misconception: 'All sequences are arithmetic', correction: 'Only sequences with constant differences between terms are arithmetic' },
  ],
  relatedTopics: ['functions'],
  capsCodes: ['DBE/2014/04/Mathematics/Grade10/Term1'],
}

// Functions
export const Functions: LessonData = {
  id: 'g10-t1-math-functions',
  subject: 'Mathematics',
  subjectId: 'maths',
  grade: 10,
  term: 1,
  topic: 'Functions',
  topicId: 'functions',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: ['Understand function concept', 'Identify domain and range', 'Graph linear and quadratic functions'],
  animation: { title: 'Understanding Functions', duration: 2, description: 'Function machine and mapping', steps: [
    { duration: 2, title: 'Function Machine', visual: 'x goes in, f(x) comes out', narration: 'A function takes an input and produces an output' },
    { duration: 2, title: 'Linear Function', visual: 'y = 2x + 1 graphed as a straight line', narration: 'Linear functions create straight line graphs' },
    { duration: 2, title: 'Quadratic Function', visual: 'y = x² graphed as a parabola', narration: 'Quadratic functions create U-shaped parabolas' },
  ] },
  explanation: { title: 'Functions', sections: [
    { heading: 'Definition', content: 'A function assigns each input (x) to exactly one output (y). Notation: f(x) = y' },
    { heading: 'Domain and Range', content: 'Domain: all possible input values. Range: all possible output values.' },
    { heading: 'Linear Functions', content: 'Form: f(x) = mx + c. Graph is a straight line with slope m and y-intercept c.' },
    { heading: 'Quadratic Functions', content: 'Form: f(x) = ax² + bx + c. Graph is a parabola opening up (a > 0) or down (a < 0).' },
  ] },
  workedExamples: [
    { level: 'basic', question: 'If f(x) = 2x + 1, find f(3)', solution: [
      { step: 'Substitute x = 3', result: 'f(3) = 2(3) + 1' },
      { step: 'Calculate', result: 'f(3) = 7' },
    ], explanation: 'Replace x with 3 in the function' },
    { level: 'intermediate', question: 'Find x-intercept of f(x) = 2x - 4', solution: [
      { step: 'Set f(x) = 0', result: '2x - 4 = 0' },
      { step: 'Solve', result: 'x = 2' },
      { step: 'x-intercept is (2, 0)', result: 'x = 2' },
    ], explanation: 'x-intercept is where graph crosses x-axis (y = 0)' },
    { level: 'advanced', question: 'Graph f(x) = x² - 4 and identify key features', solution: [
      { step: 'Vertex form: y = x² - 4', result: 'Vertex at (0, -4)' },
      { step: 'Opens upward (a > 0)', result: 'U-shaped parabola' },
      { step: 'x-intercepts: x² - 4 = 0', result: '(2, 0) and (-2, 0)' },
      { step: 'y-intercept: f(0) = -4', result: '(0, -4)' },
    ], explanation: 'Quadratic function has vertex and axis of symmetry' },
  ],
  practiceQuestions: [
    { id: 'p1', question: 'If f(x) = 3x - 2, find f(2)', answer: '4', type: 'short-answer', hint: 'Substitute x = 2', difficulty: 'easy' },
    { id: 'p2', question: 'Find y-intercept of f(x) = 2x + 5', answer: '5', type: 'short-answer', hint: 'Set x = 0', difficulty: 'easy' },
    { id: 'p3', question: 'Find x-intercept of f(x) = x + 3', answer: '-3', type: 'short-answer', hint: 'Set f(x) = 0', difficulty: 'medium' },
    { id: 'p4', question: 'If g(x) = x² + 1, find g(-2)', answer: '5', type: 'short-answer', hint: 'g(-2) = (-2)² + 1', difficulty: 'medium' },
  ],
  quiz: { passingScore: 70, questions: [
    { id: 'q1', question: 'If f(x) = 4x - 3, what is f(2)?', options: ['5', '11', '8', '1'], correct: 0, explanation: 'f(2) = 4(2) - 3 = 5' },
    { id: 'q2', question: 'What is the y-intercept of y = 3x + 2?', options: ['3', '2', '0', '-2'], correct: 1, explanation: 'y-intercept (where x = 0) is 2' },
    { id: 'q3', question: 'Is y = x² + 3x a function?', options: ['Yes', 'No', 'Maybe', 'Cannot determine'], correct: 0, explanation: 'Each x-value has exactly one y-value' },
  ] },
  test: { questions: [
    { id: 't1', question: 'If f(x) = 5x, find f(3)', type: 'short-answer', answer: '15', difficulty: 'easy' },
    { id: 't2', question: 'Find the y-intercept of y = 2x - 3', type: 'short-answer', answer: '-3', difficulty: 'easy' },
    { id: 't3', question: 'Find x-intercept of f(x) = 3x + 6', type: 'short-answer', answer: '-2', difficulty: 'medium' },
    { id: 't4', question: 'If h(x) = x² - 4, find h(3)', type: 'short-answer', answer: '5', difficulty: 'hard' },
  ] },
  misconceptions: [
    { misconception: 'f(x) means f times x', correction: 'f(x) denotes the output of function f when the input is x' },
  ],
  relatedTopics: ['arithmetic-sequences', 'linear-equations'],
  capsCodes: ['DBE/2014/04/Mathematics/Grade10/Term1'],
}

// Mathematical Modelling
export const MathematicalModelling: LessonData = {
  id: 'g10-t1-math-mathematical-modelling',
  subject: 'Mathematics',
  subjectId: 'maths',
  grade: 10,
  term: 1,
  topic: 'Mathematical Modelling',
  topicId: 'mathematical-modelling',
  duration: 45,
  estimatedTime: 45,
  learningObjectives: ['Translate real-world problems to math', 'Create and use mathematical models', 'Interpret solutions in context'],
  animation: { title: 'Mathematical Modelling', duration: 2, description: 'From problem to solution', steps: [
    { duration: 2, title: 'Real-World Problem', visual: 'A car travels at 60 km/h', narration: 'Start with a real-world situation' },
    { duration: 2, title: 'Translate to Math', visual: 'd = 60t (distance = speed × time)', narration: 'Create a mathematical equation' },
    { duration: 2, title: 'Solve', visual: 'If t = 2, then d = 120 km', narration: 'Use math to find answers' },
    { duration: 2, title: 'Interpret', visual: 'After 2 hours, the car has traveled 120 km', narration: 'Explain answer in real-world context' },
  ] },
  explanation: { title: 'Mathematical Modelling', sections: [
    { heading: 'Process', content: '1. Identify variables 2. Create equation/model 3. Solve using math 4. Interpret in context' },
    { heading: 'Distance-Time', content: 'Distance = Speed × Time, or d = vt. Used for motion problems.' },
    { heading: 'Cost-Quantity', content: 'Total Cost = Unit Price × Quantity. Linear model.' },
    { heading: 'Area/Perimeter', content: 'Use geometry formulas to model problems about shapes and spaces.' },
  ] },
  workedExamples: [
    { level: 'basic', question: 'A car travels at 80 km/h. How far in 3 hours?', solution: [
      { step: 'Identify: v = 80 km/h, t = 3 h', result: '' },
      { step: 'Formula: d = vt', result: 'd = 80 × 3' },
      { step: 'Solve', result: 'd = 240 km' },
      { step: 'Interpret', result: 'The car travels 240 km in 3 hours' },
    ], explanation: 'Direct application of distance formula' },
    { level: 'intermediate', question: 'A phone plan costs R50/month plus R1/min. Write model for total cost after m minutes.', solution: [
      { step: 'Fixed cost: 50', result: '' },
      { step: 'Variable cost: 1m', result: '' },
      { step: 'Total cost model', result: 'C = 50 + m' },
    ], explanation: 'Linear model: fixed + variable costs' },
    { level: 'advanced', question: 'A rectangular garden has perimeter 20m. If width is w, write area formula.', solution: [
      { step: 'Perimeter: 2l + 2w = 20', result: 'l + w = 10' },
      { step: 'Solve for length', result: 'l = 10 - w' },
      { step: 'Area formula', result: 'A = l × w = (10 - w) × w = 10w - w²' },
      { step: 'Area model', result: 'A(w) = 10w - w²' },
    ], explanation: 'Quadratic model derived from constraints' },
  ],
  practiceQuestions: [
    { id: 'p1', question: 'A taxi charges R20 + R2/km. Cost for 15 km journey?', answer: 'R50', type: 'short-answer', hint: 'C = 20 + 2(15)', difficulty: 'easy' },
    { id: 'p2', question: 'If y = 3x + 5, what does y represent when x = 10?', answer: '35', type: 'short-answer', hint: 'Substitute x = 10', difficulty: 'easy' },
    { id: 'p3', question: 'Create model: cost of photocopying R2 per page for n pages', answer: 'C = 2n', type: 'short-answer', hint: 'Total = rate × quantity', difficulty: 'medium' },
  ],
  quiz: { passingScore: 70, questions: [
    { id: 'q1', question: 'If distance = 60t (t in hours), what is distance after 2 hours?', options: ['30', '60', '120', '240'], correct: 2, explanation: 'd = 60 × 2 = 120' },
    { id: 'q2', question: 'What is the first step in mathematical modelling?', options: ['Solve the equation', 'Identify variables and create equation', 'Interpret results', 'Draw a graph'], correct: 1, explanation: 'Always start by understanding the problem and creating a model' },
  ] },
  test: { questions: [
    { id: 't1', question: 'If C = 50 + 3n, find C when n = 20', type: 'short-answer', answer: '110', difficulty: 'easy' },
    { id: 't2', question: 'A tank holds 100L and drains at 5L/min. Model remaining water after t minutes.', type: 'short-answer', answer: 'W = 100 - 5t or W(t) = 100 - 5t', difficulty: 'hard' },
    { id: 't3', question: 'Using W = 100 - 5t from above, when is tank empty?', type: 'short-answer', answer: 't = 20 minutes', difficulty: 'hard' },
  ] },
  misconceptions: [
    { misconception: 'Mathematical models are always perfect', correction: 'Models are approximations of reality; they have limitations and assumptions' },
  ],
  relatedTopics: ['functions', 'linear-equations'],
  capsCodes: ['DBE/2014/04/Mathematics/Grade10/Term1'],
}
