"use client";
import { evaluateExpression } from "@/app/utils/calc/evaluateExpression";
import { Character } from "@/app/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";
import Calculator3D from "./components/Calculator3D";

export const playClick = (
  clickRef: React.RefObject<HTMLAudioElement | null>,
) => {
  const click = clickRef.current;
  if (!click) return;
  click.currentTime = 0;
  click.play().catch(() => {});
};

export default function Home() {
  const [input, setInput] = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [isOn, setIsOn] = useState(false);

  const clickRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickRef.current = new Audio("/sounds/click.mp3");
    clickRef.current.preload = "auto";
    clickRef.current.volume = 0.5;
  }, []);

  const handleOnOff = useCallback(() => {
    setInput(isOn ? "" : "0");
    setIsOn(!isOn);
  }, [isOn]);

  const clearEntry = useCallback(() => {
    if (justEvaluated) {
      setInput("0");
      setJustEvaluated(false);
    } else {
      setInput((prev) => {
        const next = prev.slice(0, -1);
        if (next === "" || next === "-") {
          return "0";
        }
        return next;
      });
    }
  }, [justEvaluated]);

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
    setJustEvaluated(true);
  }, []);

  const handleOperator = useCallback(
    (character: Character) => {
      if (input.length > 0) {
        if (
          character.id === "fraction" ||
          character.id === "square" ||
          character.id === "squareRoot" ||
          character.id === "percentage"
        ) {
          setInput((prev) => {
            try {
              return String(evaluateExpression(prev + character.symbol));
            } catch {
              return prev;
            }
          });
        } else if (character.id === "sign") {
          setInput((prev) =>
            prev.startsWith("-")
              ? prev.slice(1)
              : prev === "0"
                ? "0"
                : "-" + prev,
          );
        } else {
          setInput((prev) => {
            const lastChar = prev[prev.length - 1];
            if (["+", "-", "*", "/"].includes(lastChar)) {
              return prev.slice(0, -1) + character.symbol;
            }
            return prev + character.symbol;
          });
        }
      }
      setJustEvaluated(false);
    },
    [input],
  );

  const handleNumber = useCallback(
    (character: Character) => {
      if (character.id === "decimal") {
        const lastOpIdx = Math.max(
          input.lastIndexOf("+"),
          input.lastIndexOf("-"),
          input.lastIndexOf("*"),
          input.lastIndexOf("/"),
        );
        if (input.slice(lastOpIdx + 1).includes(".")) return;
      }

      if (justEvaluated) {
        setInput(character.id === "decimal" ? "0." : character.symbol);
        setJustEvaluated(false);
      } else {
        if (input === "0") {
          setInput(character.id === "decimal" ? "0." : character.symbol);
        } else {
          setInput((prev) => prev + character.symbol);
        }
      }
    },
    [input, justEvaluated],
  );

  const handleClick = useCallback(
    (character: Character) => {
      playClick(clickRef);
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
      className={`${!isOn && "brightness-50"} overflow-visible flex flex-col flex-1 items-center justify-center bg-blue-100 font-sans h-screen`}
    >
      <Calculator3D isOn={isOn} input={input} handleClick={handleClick} />
    </div>
  );
}
