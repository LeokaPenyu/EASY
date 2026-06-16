export interface Question {
  id: string;
  course: string;
  category: string;
  type: 'Objective' | 'Subjective';
  description: string;
  options: string[];
  answer: string;
  score: number;
}

const ALL_COURSES = ['800/2', 'CBFA1021', 'CERC1011', 'CHED1031', 'CHNU1041', 'PAFA1042', 'PIFA 1021'];
const ALL_CATEGORIES = ['Category A', 'Category B', 'Category C', 'Category D'];

const generateMockQuestions = (): Question[] => {
  const generated: Question[] = [];
  let qId = 1;
  ALL_COURSES.forEach(course => {
    ALL_CATEGORIES.forEach(category => {
      // 2 objective questions and 1 subjective question per category per course
      generated.push({
        id: `q${qId++}`,
        course,
        category,
        type: 'Objective',
        description: `Soalan objektif contoh 1 untuk ${course} - ${category}.`,
        options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
        answer: "A",
        score: 1
      });
      generated.push({
        id: `q${qId++}`,
        course,
        category,
        type: 'Objective',
        description: `Soalan objektif contoh 2 untuk ${course} - ${category}.`,
        options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
        answer: "B",
        score: 1
      });
      generated.push({
        id: `q${qId++}`,
        course,
        category,
        type: 'Subjective',
        description: `Soalan subjektif contoh untuk ${course} - ${category}. Terangkan dengan terperinci.`,
        options: [],
        answer: "Jawapan subjektif kriteria pemarkahan.",
        score: 5
      });
    });
  });
  return generated;
};

export let sharedQuestions: Question[] = generateMockQuestions();

export const updateSharedQuestions = (newQuestions: Question[]) => {
  sharedQuestions = newQuestions;
};
