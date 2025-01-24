"use client"; // Ensures this component runs on the client

import { useState, useEffect } from "react";

type TypewriterProps = {
  textArray: string[];
  typingSpeed?: number; // Optional: Speed of typing in milliseconds
  delayBetweenTexts?: number; // Optional: Delay between texts in milliseconds
};

export const Typewriter: React.FC<TypewriterProps> = ({
  textArray,
  typingSpeed = 100,
  delayBetweenTexts = 2000,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = textArray[currentIndex];
      const isTextFullyTyped = currentText === fullText;
      const isTextFullyDeleted = currentText === "";

      if (isTextFullyTyped && !isDeleting) {
        setTimeout(() => setIsDeleting(true), delayBetweenTexts); // Pause before deleting
      } else if (isTextFullyDeleted && isDeleting) {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % textArray.length); // Move to next text
      } else {
        const updatedText = isDeleting
          ? fullText.slice(0, currentText.length - 1) // Deleting
          : fullText.slice(0, currentText.length + 1); // Typing

        setCurrentText(updatedText);
      }
    };

    const typingInterval = setInterval(handleTyping, typingSpeed);
    return () => clearInterval(typingInterval);
  }, [
    currentText,
    isDeleting,
    textArray,
    currentIndex,
    typingSpeed,
    delayBetweenTexts,
  ]);

  return (
    <div className=" font-mono text-primary">
      {currentText}
      <span className="animate-pulse">|</span> {/* Cursor animation */}
    </div>
  );
};
