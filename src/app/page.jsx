"use client"
import { useRouter } from "next/navigation";
import React from "react";



export default function Home() {
  const router = useRouter()
  const handleStartGame = () => {
    router.push("/users/game"); 
  };

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
      <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Jeopardy Quiz Game</h1>
      <p className="text-lg text-center max-w-2xl mb-6">
        Test your knowledge across various categories and compete for the highest score! Are you ready to challenge yourself?
      </p>
      
      <button onClick={handleStartGame} className="px-6 py-3 bg-yellow-400 text-black font-semibold text-xl rounded-lg shadow-lg hover:bg-yellow-500 transition-all">
        Start Game
      </button>
      
      <div className="mt-10 bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Game Rules</h2>
        <ul className="list-disc list-inside text-lg">
          <li>Each question has a set point value.</li>
          <li>Answer correctly to earn points.</li>
          <li>Wrong answers do not deduct points.</li>
          <li>Try to get the highest score possible!</li>
        </ul>
      </div>
</div>
    
  );
}
