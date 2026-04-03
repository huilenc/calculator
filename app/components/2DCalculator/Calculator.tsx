"use client";
import { Character, characters } from "@/app/utils/calc/characters";
import { Button } from "./Button";
import { Display } from "./Display";

interface CalculatorProps {
  isOn: boolean;
  input: string;
  handleClick: (character: Character) => void;
  embedded?: boolean;
}

export const Calculator = ({
  isOn,
  input,
  handleClick,
  embedded = false,
}: CalculatorProps) => {
  return (
    <div
      className={`${!isOn && "brightness-50"} ${embedded && "pointer-events-none"} flex w-[92vw] min-w-[350px] max-w-[420px] h-[60vh] min-h-[520px] max-h-[700px] p-6 flex-col items-center justify-between bg-[#F47C7C] border-3 border-[#D46B6B] shadow-[6px_6px_0_0px_#D46B6B] rounded-xl`}
    >
      <Display
        input={input}
        isOn={isOn}
        className={embedded ? "pointer-events-none" : ""}
        width={100}
        height={100}
      />
      <div className="grid grid-cols-4 gap-4 w-full p-4 pointer-events-none">
        {characters.map((character: Character) => {
          const isOnOff = character.id === "onOff";
          return (
            <Button
              key={character.id}
              character={character}
              isOn={isOn}
              isOnOff={isOnOff}
              handleClick={handleClick}
            />
          );
        })}
      </div>
    </div>
  );
};
