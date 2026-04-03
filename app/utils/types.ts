export interface Calculator3DProps {
  isOn: boolean;
  input: string;
  handleClick: (character: Character) => void;
  children?: React.ReactNode;
}

export interface Character {
  id: string;
  name: string;
  symbol: string;
  display?: string;
  type: CharacterType;
  color?: string;
}

export type CharacterType = "number" | "operator" | "action";

export interface CalculatorKey3DProps {
  character: Character;
  position: [number, number, number];
  isOn: boolean;
  onPress: (character: Character) => void;
}
