export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

export let sharedQuestions: Question[] = [
  {
    id: "q1",
    question: "Apakah prinsip pertama di dalam pergerakan Palang Merah?",
    options: ["Kemanusiaan", "Kesaksamaan", "Keberkecualian", "Kebebasan"],
    answer: "Kemanusiaan"
  },
  {
    id: "q2",
    question: "Berapakah bilangan prinsip asas pergerakan Palang Merah dan Bulan Sabit Merah?",
    options: ["5", "6", "7", "8"],
    answer: "7"
  }
];

export const updateSharedQuestions = (newQuestions: Question[]) => {
  sharedQuestions = newQuestions;
};
