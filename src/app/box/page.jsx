"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

// Rewards array with icons, colors, and labels
const rewards = [
  { label: "20 Gems", icon: "💎", color: "from-blue-500 to-purple-500" },
  { label: "50 Coins", icon: "🪙", color: "from-yellow-400 to-orange-500" },
  { label: "Mystery Item", icon: "🎁", color: "from-pink-400 to-red-500" },
  { label: "Power Boost", icon: "⚡", color: "from-red-400 to-yellow-400" },
];

export default function MagicBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [reward, setReward] = useState(null);

  // Function to handle the box opening
  const openBox = () => {
    if (isOpen) return;  // Prevent opening if already opened
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    setReward(randomReward);
    setIsOpen(true);
  };

  // Reset the box to its initial state
  const resetBox = () => {
    setIsOpen(false);
    setReward(null);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-800 to-black px-4">
      <div className="flex flex-col items-center">
        {/* Reward Display */}
        {isOpen && reward && (
          <motion.div
            className={`mb-10 w-64 h-64 bg-gradient-to-br ${reward.color} rounded-xl shadow-xl text-white flex flex-col items-center justify-center`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-5xl">{reward.icon}</div>
            <div className="text-2xl font-semibold mt-4">{reward.label}</div>
          </motion.div>
        )}

        {/* Magic Box */}
        <motion.div
          onClick={openBox}
          className={`w-64 h-64 bg-yellow-500 border-4 border-yellow-400 rounded-xl shadow-2xl cursor-pointer text-5xl flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'opacity-0 scale-50' : 'opacity-100'
          }`}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          📦
        </motion.div>

        {/* Button to open another box */}
        {isOpen && (
          <button
            onClick={resetBox}
            className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            Open Another Box
          </button>
        )}

        {/* Prompt to open the box */}
        {!isOpen && (
          <p className="text-white mt-4 text-lg animate-pulse">
            Tap the Sandook to Unlock!
          </p>
        )}
      </div>
    </div>
  );
}
