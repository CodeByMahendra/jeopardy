
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Bangalore", "Kolkata"],
    answer: "New Delhi",
    points: 100,
  },
  {
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    answer: "7",
    points: 100,
  },
  {
    question: "Which river is known as the 'Ganga of the South'?",
    options: ["Krishna", "Godavari", "Kaveri", "Yamuna"],
    answer: "Godavari",
    points: 100,
  },
  {
    question: "Who was the first President of India?",
    options: ["Dr. B.R. Ambedkar", "Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Patel"],
    answer: "Dr. Rajendra Prasad",
    points: 300,
  },
  {
    question: "What is the national bird of India?",
    options: ["Sparrow", "Peacock", "Eagle", "Parrot"],
    answer: "Peacock",
    points: 300,
  },
  {
    question: "Which is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    answer: "Nile",
    points: 300,
  },
  {
    question: "Who discovered the sea route to India?",
    options: ["Christopher Columbus", "Ferdinand Magellan", "Vasco da Gama", "Marco Polo"],
    answer: "Vasco da Gama",
    points: 500,
  },
  {
    question: "Which is the smallest country in the world?",
    options: ["Monaco", "Maldives", "Vatican City", "Liechtenstein"],
    answer: "Vatican City",
    points: 500,
  },
  {
    question: "Which is the national animal of India?",
    options: ["Lion", "Tiger", "Elephant", "Leopard"],
    answer: "Tiger",
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




