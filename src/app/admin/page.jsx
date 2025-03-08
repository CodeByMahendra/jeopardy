"use client";

import axios from 'axios'

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    points: 0,
  });

  useEffect( async() => {
  try {
    const response = await axios.get("api/questions")
    setQuestions(response.data)
    if (response.status === 200) {
    toast.success("Question Loaded Successfully!")
    }
    else{
      toast.error("Something went wrong!")
    }


  } catch (error) {
    
    console.log("Error=".error)
  }

  


  }, []);

  const handleEdit = (q) => {
    console.log("Handle Edit Data =",q)
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
  
      console.log("Server Response:", response.data);
  
      if (response.status === 200) {
        setEditing(null);
        setQuestions(questions.map(q => (q.id === response.data.id ? response.data : q))); 
        toast.success("Question updated successfully!")
      } else {
        toast.error("Error updating question!");
      }
    } catch (error) {
      console.error("Error while updating question:", error);
      toast.error("error occurred  updating the question!");
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Questions</h2>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />

      {questions.map((q) => (
        <div key={q.id} className="border p-4 mb-4">
          {editing === q.id ? (
            <div className="space-y-2">
              <input name="question" value={formData.question} onChange={handleChange} className="border p-2 w-full" />

              {formData.options.map((option, index) => (
                <input
                  key={index}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="border p-2 w-full"
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
              ))}

              <input name="answer" value={formData.answer} onChange={handleChange} className="border p-2 w-full" placeholder="Correct Answer" />
              <input name="points" type="number" value={formData.points} onChange={handleChange} className="border p-2 w-full" placeholder="Points" />

              <button onClick={updateQuestion} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          ) : (
            <div>
              <p className="font-semibold">{q.question}</p>
              {q.options.map((option, index) => (
                <p key={index}>{String.fromCharCode(65 + index)}: {option}</p>
              ))}
              <p className="font-bold">Answer: {q.answer}</p>
              <p className="font-bold">Points: {q.points}</p>
              <button onClick={() => handleEdit(q)} className="bg-gray-500 text-white px-4 py-2 mt-2 rounded">Edit</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
