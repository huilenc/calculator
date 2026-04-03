import { Character } from "@/app/utils/types";

interface ButtonProps {
  character: Character;
  isOn: boolean;
  isOnOff: boolean;
  handleClick: (character: Character) => void;
}

export const Button = ({
  character,
  isOn,
  isOnOff,
  handleClick,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`pointer-events-auto ${!isOn && !isOnOff && "brightness-50"} ${!isOn && isOnOff && "shadow-[0_0_18px_4px_rgba(250,204,21,0.65)] brightness-150"} active:translate-y-0.5 active:shadow-[3px_1px_0_0_#FAD4D4] text-[#FFF2F2] font-semibold p-1 rounded-xl text-sm xs:text-xs xs:p-2 shadow-[3px_3px_0_0px_#FAD4D4] border-3 border-[#FAD4D4]`}
      aria-disabled={!isOn && character.id !== "onOff"}
      onClick={() => handleClick(character)}
      style={{ backgroundColor: character.color ?? "#EF9F9F" }}
    >
      {character.display ?? character.symbol}
    </button>
  );
};
