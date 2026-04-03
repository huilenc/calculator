"use client";
import { evaluateExpression } from "@/app/utils/calc/evaluateExpression";
import { Character } from "@/app/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calculator3D } from "./components/Calculator3D";

export default function Home() {
  const [input, setInput] = useState("");
  const justEvaluatedRef = useRef(false);
  const [isOn, setIsOn] = useState(false);

  const POOL_SIZE = 5;
  const poolRef = useRef<HTMLAudioElement[]>([]);
  const poolIdxRef = useRef(0);

  useEffect(() => {
    poolRef.current = Array.from({ length: POOL_SIZE }, () => {
      const a = new Audio("/sounds/click.mp3");
      a.preload = "auto";
      a.volume = 0.5;
      return a;
    });
  }, []);

  const playClick = useCallback(() => {
    const pool = poolRef.current;
    if (!pool.length) return;
    const audio = pool[poolIdxRef.current];
    poolIdxRef.current = (poolIdxRef.current + 1) % POOL_SIZE;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  const handleOnOff = useCallback(() => {
    setInput(isOn ? "" : "0");
    setIsOn(!isOn);
  }, [isOn]);

  const clearEntry = useCallback(() => {
    if (justEvaluatedRef.current) {
      setInput("0");
      justEvaluatedRef.current = false;
    } else {
      setInput((prev) => {
        const next = prev.slice(0, -1);
        return next === "" || next === "-" ? "0" : next;
      });
    }
  }, []);

  const clearAll = useCallback(() => {
    setInput("0");
  }, []);

  const equals = useCallback(() => {
    setInput((prev) => {
      try {
        return String(evaluateExpression(prev));
      } catch (error) {
        return String(error);
      }
    });
    justEvaluatedRef.current = true;
  }, []);

  const handleOperator = useCallback((character: Character) => {
    setInput((prev) => {
      if (prev.length === 0) return prev;
      if (
        character.id === "fraction" ||
        character.id === "square" ||
        character.id === "squareRoot" ||
        character.id === "percentage"
      ) {
        try {
          return String(evaluateExpression(prev + character.symbol));
        } catch {
          return prev;
        }
      } else if (character.id === "sign") {
        return prev.startsWith("-")
          ? prev.slice(1)
          : prev === "0"
            ? "0"
            : "-" + prev;
      } else {
        const lastChar = prev[prev.length - 1];
        if (["+", "-", "*", "/"].includes(lastChar)) {
          return prev.slice(0, -1) + character.symbol;
        }
        return prev + character.symbol;
      }
    });
    const isUnaryResult =
      character.id === "fraction" ||
      character.id === "square" ||
      character.id === "squareRoot" ||
      character.id === "percentage";
    justEvaluatedRef.current = isUnaryResult;
  }, []);

  const handleNumber = useCallback((character: Character) => {
    const replaceResult = justEvaluatedRef.current;
    justEvaluatedRef.current = false;
    setInput((prev) => {
      if (replaceResult) {
        return character.id === "decimal" ? "0." : character.symbol;
      }
      if (character.id === "decimal") {
        const lastOpIdx = Math.max(
          prev.lastIndexOf("+"),
          prev.lastIndexOf("-"),
          prev.lastIndexOf("*"),
          prev.lastIndexOf("/"),
        );
        if (prev.slice(lastOpIdx + 1).includes(".")) return prev;
      }
      if (prev === "0") {
        return character.id === "decimal" ? "0." : character.symbol;
      }
      return prev + character.symbol;
    });
  }, []);

  const handleClick = useCallback(
    (character: Character) => {
      playClick();
      if (!isOn && character.id !== "onOff") return;
      switch (character.type) {
        case "action":
          if (character.id === "onOff") {
            // handleOnOff();
            handleOnOff();
          }

          if (character.id === "clearEntry") {
            clearEntry();
          }

          if (character.id === "clearAll") {
            clearAll();
          }
          if (character.id === "equals") {
            equals();
          }
          break;
        case "operator":
          handleOperator(character);
          break;
        case "number":
          handleNumber(character);
          break;
      }
    },
    [
      playClick,
      isOn,
      handleOnOff,
      clearEntry,
      clearAll,
      equals,
      handleOperator,
      handleNumber,
    ],
  );

  return (
    <div
      className={`${!isOn && "brightness-50"} overflow-hidden flex flex-col flex-1 items-center justify-center bg-blue-100 font-sans h-screen`}
    >
      <Calculator3D isOn={isOn} input={input} handleClick={handleClick} />
    </div>
  );
}
