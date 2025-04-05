import React, { useState, useEffect, useRef } from "react";
import { FiPlay, FiPause, FiRefreshCw, FiCheck } from "react-icons/fi";

/**
 * Компонент секундомера для отслеживания времени тренировки
 */
const Timer = ({ onFinish, initialSeconds = 0 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Эффект для запуска/остановки таймера
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  // Форматирует время в часы:минуты:секунды
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  // Запускает или приостанавливает секундомер
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  // Приостанавливает секундомер
  const handlePause = () => {
    setIsPaused(true);
  };

  // Сбрасывает секундомер до нуля
  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setSeconds(0);
  };

  // Управляет окончанием тренировки
  const handleFinish = () => {
    setIsActive(false);
    setIsPaused(false);
    if (onFinish) {
      onFinish(seconds);
    }
  };

  const calculateCalories = (seconds) => {
    // Простой расчет калорий: примерно 0.1 калорий в секунду при средней интенсивности
    // (это около 360 калорий в час)
    return Math.round(seconds * 0.1);
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <h2 className="timer-title">Секундомер тренировки</h2>
        <div className="timer-value">{formatTime(seconds)}</div>

        <div className="timer-stats">
          <div className="timer-stat">
            <span className="timer-stat-label">Примерный расход калорий:</span>
            <span className="timer-stat-value">
              {calculateCalories(seconds)} ккал
            </span>
          </div>
        </div>

        <div className="timer-controls">
          {!isActive ? (
            <button onClick={handleStart} className="timer-btn">
              <FiPlay />
            </button>
          ) : !isPaused ? (
            <button onClick={handlePause} className="timer-btn">
              <FiPause />
            </button>
          ) : (
            <button onClick={handleStart} className="timer-btn">
              <FiPlay />
            </button>
          )}

          <button onClick={handleReset} className="timer-btn">
            <FiRefreshCw />
          </button>

          <button
            onClick={handleFinish}
            className="timer-btn finish"
            disabled={seconds === 0}
          >
            <FiCheck />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
