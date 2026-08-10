import React from "react";

const FeedbackMessage = ({ message }) => {
  if (!message) return null;

  const bgClasses = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    loading: "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`mb-4 p-3 rounded ${bgClasses[message.type] || "bg-gray-100"}`}>
      {message.text}
    </div>
  );
};

export default FeedbackMessage;