
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [editing, setEditing] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    points: 0,
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/api/questions");
        setQuestions(response.data);
        if (response.status === 200) {
          toast.success("Questions Loaded Successfully!");
        } else {
          toast.error("Something went wrong!");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions!");
      }
    };

    fetchQuestions();
  }, []);

  const handleEdit = (q) => {
    setEditing(q.id);
    setFormData({
      id: q.id,
      question: q.question,
      options: q.options || ["", "", "", ""],
      answer: q.answer,
      points: q.points || 0,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const updateQuestion = async () => {
    try {
      const response = await axios.put("/api/questions", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setEditing(null);
        setQuestions(
          questions.map((q) => (q.id === response.data.id ? response.data : q))
        );
        toast.success("Question updated successfully!");
      } else {
        toast.error("Error updating question!");
      }
    } catch (error) {
      console.error("Error while updating question:", error);
      toast.error("Error occurred while updating the question!");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="p-6 w-full">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Questions</h2>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-white shadow-md rounded-lg p-5 border">
              {editing === q.id ? (
                <div className="space-y-3">
                  <label className="block font-medium text-gray-700">Question</label>
                  <input
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block font-medium text-gray-700">Options</label>
                  {formData.options.map((option, index) => (
                    <input
                      key={index}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                  ))}

                  <label className="block font-medium text-gray-700">Correct Answer</label>
                  <input
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block font-medium text-gray-700">Points</label>
                  <input
                    name="points"
                    type="number"
                    value={formData.points}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={updateQuestion}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-lg">{q.question}</p>
                  <div className="mt-2">
                    {q.options.map((option, index) => (
                      <p key={index} className="text-gray-600">
                        {String.fromCharCode(65 + index)}: {option}
                      </p>
                    ))}
                  </div>
                  <p className="font-bold text-green-600 mt-2">Answer: {q.answer}</p>
                  <p className="font-bold text-blue-600">Points: {q.points}</p>
                  <button
                    onClick={() => handleEdit(q)}
                    className="bg-gray-600 text-white px-4 py-2 mt-3 rounded-lg hover:bg-gray-700 transition duration-300"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
