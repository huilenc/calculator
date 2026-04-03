import { characters } from "@/app/utils/calc/characters";
import {
  BODY_D,
  BODY_H,
  BODY_W,
  COLOR_FACE,
  KEY_Y_OFFSET,
} from "@/app/utils/constants";
import { keyLayout } from "@/app/utils/keyLayout";
import { Calculator3DProps } from "@/app/utils/types";
import { RoundedBox } from "@react-three/drei";
import { memo } from "react";
import { CalculatorKey3D } from "./CalculatorKey3D";

export const CalculatorBody = memo(function CalculatorBody({
  isOn,
  handleClick,
}: Omit<Calculator3DProps, "input">) {
  const keyZ = BODY_D / 2 + 0.06;

  return (
    <>
      <RoundedBox args={[BODY_W, BODY_H, BODY_D]} radius={0.18} smoothness={4}>
        <meshStandardMaterial
          color={COLOR_FACE}
          roughness={0.45}
          metalness={0.15}
        />
      </RoundedBox>
      {characters.map((character, index) => {
        const [x, y] = keyLayout(index);

        return (
          <CalculatorKey3D
            key={character.id}
            character={character}
            isOn={isOn}
            onPress={handleClick}
            position={[x, y + KEY_Y_OFFSET, keyZ]}
          />
        );
      })}
    </>
  );
});
