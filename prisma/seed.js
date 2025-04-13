
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  {
    question: "Which sound do CSK fans hear in their dreams?",
    options: ["Thala… Thala…", "Dhoni finishes off in style!", "Roar of the lion", "Whistle podu"],
    answer: "Dhoni finishes off in style!",
    points: 100,
  },
  {
    question: "Who runs faster between the wickets than some people on bikes?",
    options: ["Virat Kohli", "MS Dhoni", "Ruturaj Gaikwad", "Hardik Pandya"],
    answer: "MS Dhoni",
    points: 100,
  },
  {
    question: "What does RCB usually stand for in memes?",
    options: ["Royal Challengers Bangalore", "Real Chokers of Bangalore", "Really Confused Batsmen", "Runners Coming Back"],
    answer: "Real Chokers of Bangalore",
    points: 100,
  },
  {
    question: "Whistle podu ka matlab kya hai?",
    options: ["Support karo", "Nacho", "Trophy lao", "Thala aaya toh game gaya"],
    answer: "Thala aaya toh game gaya",
    points: 300,
  },
  {
    question: "CSK ka real home ground kya hai?",
    options: ["Wankhede", "Chepauk", "Dubai", "Playoffs table"],
    answer: "Playoffs table",
    points: 300,
  },
  {
    question: "Kohli ne IPL trophy kab jeeti hai?",
    options: ["2011", "2016",  "Agle janam mein","None of the above"],
    answer: "None of the above",
    points: 300,
  },
  {
    question: "Which team’s fans say ‘Ee Sala Cup Lolipop’ every year... and still wait?",
    options: ["SRH", "RCB", "DC", "PBKS"],
    answer: "RCB",
    points: 500,
  },
  {
    question: "Who is the real owner of Wankhede Stadium according to memes?",
    options: ["Rohit Sharma", "MS Dhoni", "Virat Kohli", "Hardik Pandya"],
    answer: "MS Dhoni",
    points: 500,
  },
  {
    question: "Which IPL team is best at making fans say 'next year pakka jeetenge'?",
    options: ["RCB", "PBKS", "DC", "All of the above"],
    answer: "All of the above",
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




