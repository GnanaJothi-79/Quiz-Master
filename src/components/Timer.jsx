import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Timer({
  seconds = 0,      
  onEnd = () => {}, 
  autoStart = true 
}) {
  const [time, setTime] = useState(seconds);
  const timerRef = useRef(null);

  useEffect(() => {
    setTime(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!autoStart) return;
    if (time <= 0) {
      onEnd();
      return;
    }
    timerRef.current = setTimeout(() => {
      setTime(t => t - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [time, autoStart, onEnd]);

  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="timer"
      initial={{ scale: 1 }}
      animate={{
        scale: time <= 5 ? [1, 1.2, 1] : 1,
        color: time <= 5 ? "#ff3b3b" : "#333"
      }}
      transition={{
        duration: 0.5,
        repeat: time <= 5 ? Infinity : 0
      }}
      style={{
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "10px"
      }}
    >
      ⏱ {formatTime()}
    </motion.div>
  );
}
