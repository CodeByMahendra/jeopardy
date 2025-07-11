
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  {
    question: "Which one is not a programming language?",
    options: ["Python", "Cobra", "Java", "C++"],
    answer: "Cobra",
    points: 100,
  },
  {
    question: "Which is considered the laziest day of the week?",
    options: ["Monday", "Wednesday", "Saturday", "Sunday"],
    answer: "Sunday",
    points: 100,
  },
    {
    question: "What does CTRL + C do?",
    options: ["Closes tab", "Creates folder", "Copies content", "Clears screen"],
    answer: "Copies content",
    points: 100,
  },
  {
    question: "Which app is used for swiping left or right?",
    options: ["Facebook", "Tinder", "WhatsApp", "Uber"],
    answer: "Tinder",
    points: 300,
  },
  {
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    answer: "Canberra",
    points: 300,
  },
  {
    question: "Which gas do plants absorb during photosynthesis?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answer: "Carbon Dioxide",
    points: 300,
  },
   {
    question: "Which country gifted the Statue of Liberty to the USA?",
    options: ["Germany", "France", "Canada", "Italy"],
    answer: "France",
    points: 500,
  },
   {
    question: "Who wrote the epic 'Mahabharata'?",
    options: ["Tulsidas", "Valmiki", "Ved Vyas", "Kalidas"],
    answer: "Ved Vyas",
    points: 500,
  },
  {
    question: "Which metal is liquid at room temperature?",
    options: ["Iron", "Mercury", "Aluminium", "Zinc"],
    answer: "Mercury",
    points: 500,
  },
];

async function seed() {
  console.log("Seeding database...");

  for (const q of questions) {
    await prisma.question.create({
      data: {
        question: q.question,
        options: q.options,
        answer: q.answer,
        points: q.points,
      },
    });
  }

  console.log("Seeding completed!");
  await prisma.$disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});




