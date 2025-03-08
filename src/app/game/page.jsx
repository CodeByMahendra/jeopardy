"use client";

import { useState, useEffect } from "react";
import {  Trophy } from "lucide-react";

import { useRouter } from "next/navigation";

export default function QuizGame() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [attemptedQuestions, setAttemptedQuestions] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const userId = "380e3a80-22a6-4c33-bbf6-16d71fc4a135"; // Replace with actual userId


  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/sign-in");
  //     return;
  //   }

  //   const fetchData = async () => {
  //     try {
  //       // Fetch questions
  //       const res = await fetch("/api/questions", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const data = await res.json();
  //       setQuestions(data);

  //       // Fetch score from localStorage or API
  //       const storedScore = localStorage.getItem("score");
  //       if (storedScore) {
  //         setScore(parseInt(storedScore, 10));
  //       } else {
  //         const scoreRes = await fetch("/api/get-score", {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         const scoreData = await scoreRes.json();
  //         setScore(scoreData.score || 0);
  //       }

  //       // Load attempted questions from API
  //       const attemptRes = await fetch("/api/get-attempts", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const attemptData = await attemptRes.json();

  //       const attemptMap = {};
  //       attemptData.attempts.forEach(({ questionId, isCorrect }) => {
  //         attemptMap[questionId] = isCorrect ? "correct" : "wrong";
  //       });
  //       setAttemptedQuestions(attemptMap);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
      return;
    }
  
    const fetchData = async () => {
      try {
        // Fetch questions
        const res = await fetch("/api/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setQuestions(data);
  
        // Fetch score from API instead of localStorage
        const scoreRes =await fetch(`/api/get-score?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const scoreData = await scoreRes.json();
        setScore(scoreData.score || 0); // Score from API
  
        // Load attempted questions from API
        const attemptRes = await fetch("/api/get-attempts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const attemptData = await attemptRes.json();
  
        const attemptMap = {};
        attemptData.attempts.forEach(({ questionId, isCorrect }) => {
          attemptMap[questionId] = isCorrect ? "correct" : "wrong";
        });
        setAttemptedQuestions(attemptMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  const handleQuestionClick = (question) => {
    if (!attemptedQuestions[question.id]) {
      console.log("Selected Question:", question); // Debugging
      setSelectedQuestion(question);
    }
  };
  

  const handleAnswer = async (option) => {
    if (!selectedQuestion || attemptedQuestions[selectedQuestion.id] !== undefined) return;

    const isCorrect = option === selectedQuestion.answer;
    setAttemptedQuestions((prev) => ({
      ...prev,
      [selectedQuestion.id]: isCorrect ? "correct" : "wrong",
    }));

    if (isCorrect) {
      const newScore = score + selectedQuestion.points;
      setScore(newScore);
      localStorage.setItem("score", newScore);
    }

    // Save attempted answers in localStorage
    localStorage.setItem(
      "attemptedQuestions",
      JSON.stringify({
        ...attemptedQuestions,
        [selectedQuestion.id]: isCorrect ? "correct" : "wrong",
      })
    );

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          selectedOption: option,
        }),
      });

      const data = await response.json();
      console.log("Attempts Data=", data);
      if (!response.ok) {
        console.error("Score update failed:", data.error);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }

    setTimeout(() => {
      setSelectedQuestion(null);
    }, 500);
  };

 

  console.log("Daata=",selectedQuestion)

  return (
    // <div className="flex flex-col items-center p-4">
    <div  className="flex flex-col items-center  min-h-screen bg-gradient-to-br from-blue-300 to-purple-600 p-6">
      {/* <div className="flex justify-between w-full max-w-lg">
        <h1 className="text-2xl  font-bold text-center">Quiz Game</h1>
        
      </div> */}
      <h1 className="text-2xl mt-4 text-yellow-500 font-bold text-center bg-gray-800 p-2 rounded-lg">Quiz Game</h1>


      <p className="text-lg font-semibold mt-4">Score: {score}</p>
{questions.points}

      {loading ? (
        <div className="mt-4 text-lg">Loading...</div>
      ):(
      <div className="grid grid-cols-3 gap-4 mt-4">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => handleQuestionClick(q)}
            disabled={attemptedQuestions[q.id] !== undefined} // Disable after attempt
            className={`p-4 border rounded-lg flex justify-center items-center ${
              attemptedQuestions[q.id] === "correct"
                ? "bg-green-300"
                : attemptedQuestions[q.id] === "wrong"
                ? "bg-red-300"
                : "bg-gray-200"
            }`}
          >
            $ {index+1}{" "}
            {attemptedQuestions[q.id] === "correct"
              ? "✅"
              : attemptedQuestions[q.id] === "wrong"
              ? "❌"
              : ""}
          </button>
        ))}
      </div>

      )}
      {/* {selectedQuestion && (
        <div className="mt-6 p-4 border rounded-lg bg-white shadow-lg w-80">
          <h2 className="text-xl font-bold">{selectedQuestion.questionText}</h2>
          <div className="mt-4">
            {selectedQuestion.options.map((option) => (
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
      )} */}

{selectedQuestion && (
  <div className="mt-6 p-4 border rounded-lg bg-white shadow-lg w-80">
    <h2 className="text-xl font-bold">
      {selectedQuestion?.question || "Question not available"}
    </h2>
    <div className="mt-4">
      {selectedQuestion?.options?.map((option) => (
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

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function QuizGame() {
//   const [questions, setQuestions] = useState([]);
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [attemptedQuestions, setAttemptedQuestions] = useState({});
//   const [score, setScore] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const userId = "380e3a80-22a6-4c33-bbf6-16d71fc4a135"; // Replace with actual userId

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/sign-in");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/questions", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setQuestions(data);

//         const scoreRes = await fetch(`/api/get-score?userId=${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const scoreData = await scoreRes.json();
//         setScore(scoreData.score || 0);

//         const attemptRes = await fetch("/api/get-attempts", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const attemptData = await attemptRes.json();

//         const attemptMap = {};
//         attemptData.attempts.forEach(({ questionId, isCorrect }) => {
//           attemptMap[questionId] = isCorrect ? "correct" : "wrong";
//         });
//         setAttemptedQuestions(attemptMap);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleQuestionClick = (question) => {
//     if (!attemptedQuestions[question.id]) {
//       setSelectedQuestion(question);
//     }
//   };

//   const handleAnswer = async (option) => {
//     if (!selectedQuestion || attemptedQuestions[selectedQuestion.id] !== undefined) return;

//     const isCorrect = option === selectedQuestion.answer;
//     setAttemptedQuestions((prev) => ({
//       ...prev,
//       [selectedQuestion.id]: isCorrect ? "correct" : "wrong",
//     }));

//     if (isCorrect) {
//       const newScore = score + selectedQuestion.points;
//       setScore(newScore);
//       localStorage.setItem("score", newScore);
//     }

//     localStorage.setItem(
//       "attemptedQuestions",
//       JSON.stringify({
//         ...attemptedQuestions,
//         [selectedQuestion.id]: isCorrect ? "correct" : "wrong",
//       })
//     );

//     try {
//       const token = localStorage.getItem("token");
//       await fetch("/api/attempts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           questionId: selectedQuestion.id,
//           selectedOption: option,
//         }),
//       });
//     } catch (error) {
//       console.error("Error updating score:", error);
//     }

//     setTimeout(() => {
//       setSelectedQuestion(null);
//     }, 500);
//   };

//   return (
//     <div className="flex flex-col items-center p-4">
//       <h1 className="text-2xl font-bold">Quiz Game</h1>
//       <p className="text-lg font-semibold mt-2">Score: {score}</p>

//       {loading ? (
//         <div className="mt-4 text-lg">Loading...</div>
//       ) : (
//         <div className="grid grid-cols-3 gap-4 mt-4">
//           {[100, 300, 500].map((points, rowIndex) => (
//             <div key={rowIndex} className="grid grid-cols-3 gap-4">
//               {questions
//                 .filter((q) => q.points === points)
//                 .map((q) => (
//                   <button
//                     key={q.id}
//                     onClick={() => handleQuestionClick(q)}
//                     disabled={attemptedQuestions[q.id] !== undefined}
//                     className={`p-4 border rounded-lg flex justify-center items-center text-xl font-semibold w-24 h-16
//                       ${
//                         attemptedQuestions[q.id] === "correct"
//                           ? "bg-green-300"
//                           : attemptedQuestions[q.id] === "wrong"
//                           ? "bg-red-300"
//                           : "bg-yellow-300"
//                       }`
//                     }
//                   >
//                     ${points}
//                   </button>
//                 ))}
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedQuestion && (
//         <div className="mt-6 p-4 border rounded-lg bg-white shadow-lg w-80">
//           <h2 className="text-xl font-bold">
//             {selectedQuestion?.question || "Question not available"}
//           </h2>
//           <div className="mt-4">
//             {selectedQuestion?.options?.map((option) => (
//               <button
//                 key={option}
//                 onClick={() => handleAnswer(option)}
//                 className="block w-full p-2 mt-2 border rounded-lg bg-blue-100 hover:bg-blue-300"
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
