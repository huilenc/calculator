import {
  BACK_DEATIL_Z,
  BACK_DETAIL_D,
  BACK_DETAIL_H,
  BACK_DETAIL_W,
  BACK_EPSILON,
  BACK_FACE_Z,
  BODY_D,
  BODY_H,
  BODY_W,
  COLOR_BACK_INSET,
  DISPLAY_Y,
} from "@/app/utils/constants";
import { RoundedBox, Text } from "@react-three/drei";
import { memo } from "react";

export const BackDetail = memo(function BackDetail({
  isOn,
}: {
  isOn: boolean;
}) {
  const materialInset = {
    roughness: 0.9,
    metalness: 0,
  } as const;

  const panelW = BODY_W * 0.62;
  const panelH = BODY_H * 0.42;
  const panelY = 0.15;
  const recessDepth = 0.04;

  const fade = isOn ? 1 : 0.5;

  return (
    <group position={[0, 0, 0]}>
      {/* --- Recess: thin frame (4 strips) + dark floor --- */}
      <group position={[0, panelY, BACK_FACE_Z + recessDepth / 2]}>
        {/* Floor of recess (darker) */}
        <mesh position={[0, 0, -recessDepth / 2 + BACK_EPSILON]}>
          <planeGeometry args={[panelW - 0.12, panelH + 0.5]} />
          <meshStandardMaterial
            color={COLOR_BACK_INSET}
            opacity={fade}
            transparent={fade < 1}
            {...materialInset}
          />
        </mesh>
      </group>
      <RoundedBox
        args={[BACK_DETAIL_W, BACK_DETAIL_H, BACK_DETAIL_D]}
        radius={0.09}
        smoothness={4}
        position={[0, DISPLAY_Y - 0.05, BACK_DEATIL_Z - 0.009]}
      >
        <meshStandardMaterial
          color={COLOR_BACK_INSET}
          roughness={0.4}
          metalness={0.05}
          opacity={isOn ? 1 : 0.5}
          transparent
        />
      </RoundedBox>
      <Text
        position={[0, BACK_DETAIL_H * 1.7, BACK_DEATIL_Z - 0.27]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.1}
        color="#A55C5C"
        anchorX="center"
        maxWidth={panelW - 0.2}
        font="/fonts/Geist-Bold.ttf"
      >
        @huicanu
      </Text>
      {/* Corner screws */}
      {(
        [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ] as [number, number][]
      ).map(([sx, sy]) => {
        const cx = sx * (BODY_W / 2 - 0.4);
        const cy = sy * (BODY_H / 2 - 0.4);
        // Sit proud of the back surface: body back = -BODY_D/2, cylinder half-depth = 0.009
        const z = -BODY_D / 2 - 0.009;
        const screwColor = "#9a6a6a";
        const slotColor = "#7a4a4a";
        return (
          <group key={`${sx}${sy}`} position={[cx, cy, z]}>
            {/* Head */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.072, 0.072, 0.018, 20]} />
              <meshStandardMaterial
                color={screwColor}
                roughness={0.35}
                metalness={0.7}
              />
            </mesh>
            {/* Cross slot — horizontal bar */}
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[0.09, 0.018, 0.06]} />
              <meshStandardMaterial
                color={slotColor}
                roughness={0.5}
                metalness={0.4}
              />
            </mesh>
            {/* Cross slot — vertical bar */}
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[0.018, 0.09, 0.06]} />
              <meshStandardMaterial
                color={slotColor}
                roughness={0.5}
                metalness={0.4}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
});
