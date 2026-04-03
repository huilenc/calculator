import {
  CELL_X,
  CELL_Y,
  COLOR_KEY,
  COLOR_KEY_TEXT,
  KEY_THICKNESS,
} from "@/app/utils/constants";
import { CalculatorKey3DProps } from "@/app/utils/types";
import { RoundedBox, Text } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { memo, useCallback, useRef } from "react";
import * as THREE from "three";

export const CalculatorKey3D = memo(function CalculatorKey3D({
  character,
  position,
  isOn,
  onPress,
}: CalculatorKey3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pressedRef = useRef(false);
  const isOnOff = character.id === "onOff";
  const isFraction = character.id === "fraction";
  const baseColor = character.color ?? COLOR_KEY;
  const dim = !isOn && !isOnOff;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetZ = position[2] + (pressedRef.current ? -0.08 : 0);
    const t = 1 - Math.exp(-22 * delta);
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      targetZ,
      t,
    );
  });

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
      pressedRef.current = true;
      if (isOn || isOnOff) {
        onPress(character);
      }
    },
    [isOn, isOnOff, onPress, character],
  );

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    pressedRef.current = false;
    try {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <RoundedBox
      ref={meshRef}
      args={[CELL_X, CELL_Y * 0.92, KEY_THICKNESS]}
      radius={0.06}
      smoothness={4}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <meshStandardMaterial
        color={baseColor}
        roughness={0.45}
        metalness={0.12}
      />
      <Text
        position={[0, 0, KEY_THICKNESS / 2 + 0.01]}
        fontSize={isFraction ? CELL_X * 0.155 : CELL_X * 0.2}
        color={dim ? "#888888" : COLOR_KEY_TEXT}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {character.display ?? character.symbol}
      </Text>
    </RoundedBox>
  );
});
