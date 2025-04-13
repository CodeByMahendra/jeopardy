
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession,signOut } from "next-auth/react";

import axios from "axios";

export default function QuizGame() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [attemptedQuestions, setAttemptedQuestions] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();




  useEffect(() => {
    const initializeGame = async () => {
      if (status === "loading") return;
      if (!session || !session.user || !session.accessToken) {
        console.log("🔴 No valid session or token. Logging out...");
        router.push("/sign-in");
        return;
      }
  
      const userId = session.user.id;
      const token = session.accessToken;
      console.log("token hai ===", token);
  
      try {
        setLoading(true);
        const [questionRes, scoreRes, attemptRes] = await Promise.all([
          axios.get("/api/questions"),
          axios.get(`/api/game/get-score?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/game/get-attempts", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
  
        setQuestions(questionRes.data);
        setScore(scoreRes.data?.score || 0);
  
        const attemptMap = {};
        if (attemptRes.data && Array.isArray(attemptRes.data.attempts)) {
          attemptRes.data.attempts.forEach(({ questionId, isCorrect }) => {
            attemptMap[questionId] = isCorrect ? "correct" : "wrong";
          });
        }
        setAttemptedQuestions(attemptMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    initializeGame();
  }, [session, status, router]);
  



  const handleQuestionClick = (question) => {
    if (!attemptedQuestions[question.id]) {
      setSelectedQuestion(question);
    }
  };

  const handleAnswer = async (option) => {
    if (!selectedQuestion || attemptedQuestions[selectedQuestion.id] !== undefined) return;

    const token = session.accessToken;
    const isCorrect = option === selectedQuestion.answer;
    setAttemptedQuestions((prev) => ({
      ...prev,
      [selectedQuestion.id]: isCorrect ? "correct" : "wrong",
    }));

    if (isCorrect) {
      setScore((prevScore) => prevScore + selectedQuestion.points);
    }

    try {
      await axios.post("/api/game/attempts", {
        questionId: selectedQuestion.id,
        selectedOption: option,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error updating score:", error);
    }

    setTimeout(() => {
      setSelectedQuestion(null);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-300 to-purple-600 p-6">
      <h1 className="text-2xl mt-4 text-yellow-500 font-bold text-center bg-gray-800 p-2 rounded-lg">Quiz Game</h1>
      <p className="text-lg font-semibold mt-4">Score: {score}</p>

      {loading ? (
        <div className="mt-4 text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => handleQuestionClick(q)}
              disabled={attemptedQuestions[q.id] !== undefined}
              className={`p-4 border rounded-lg flex justify-center items-center ${
                attemptedQuestions[q.id] === "correct"
                  ? "bg-green-300"
                  : attemptedQuestions[q.id] === "wrong"
                  ? "bg-red-300"
                  : "bg-gray-200"
              }`}
            >
              Question {index + 1} {attemptedQuestions[q.id] === "correct" ? "✅" : attemptedQuestions[q.id] === "wrong" ? "❌" : ""}
            </button>
          ))}
        </div>
      )}

      {selectedQuestion && (
        <div className="mt-6 p-4 border rounded-lg bg-white shadow-lg w-80">
          <h2 className="text-xl font-bold">{selectedQuestion?.question || "Question not available"}</h2>
          <div className="mt-4">
            {(selectedQuestion?.options || []).map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="block w-full p-2 mt-2 border rounded-lg bg-blue-100 hover:bg-blue-300"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


