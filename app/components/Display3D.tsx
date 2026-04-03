import {
  BODY_D,
  CLIP_H,
  CLIP_W,
  COLOR_DISPLAY,
  DISPLAY_DEPTH,
  DISPLAY_FACE_Z,
  DISPLAY_H,
  DISPLAY_W,
  DISPLAY_Y,
} from "@/app/utils/constants";
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Minimal troika surface we touch imperatively in useFrame
interface TroikaText extends THREE.Mesh {
  textRenderInfo?: { blockBounds: [number, number, number, number] };
  clipRect: [number, number, number, number] | null;
}

export function Display3D({ input, isOn }: { input: string; isOn: boolean }) {
  const textRef = useRef<TroikaText>(null);
  const frontZ = BODY_D / 2 + 0.003;

  useFrame(() => {
    const mesh = textRef.current;
    if (!mesh) return;

    // textW from troika; falls back to 0 until the first sync completes
    const bb = mesh.textRenderInfo?.blockBounds;
    const textW = bb ? bb[2] - bb[0] : 0;

    // With anchorX="left", mesh.position.x is the text's left edge in group space.
    // We want the RIGHT edge (= position.x + textW) to sit at CLIP_W/2 (display right).
    const targetX = CLIP_W / 2 - textW;

    // Mesh offset: lerp left edge toward the target — this IS the scroll
    mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, 1);

    // Keep the clip window fixed at the display bounds in group space.
    // group_x = local_x + mesh.position.x  →  local_x = group_x − mesh.position.x
    mesh.clipRect = [
      -CLIP_W / 2 - mesh.position.x,
      -CLIP_H / 2,
      CLIP_W / 2 - mesh.position.x,
      CLIP_H / 2,
    ];
  });

  return (
    <group position={[0, DISPLAY_Y, frontZ]}>
      <RoundedBox
        args={[DISPLAY_W, DISPLAY_H, DISPLAY_DEPTH]}
        radius={0.09}
        smoothness={4}
      >
        <meshStandardMaterial
          color={COLOR_DISPLAY}
          roughness={0.4}
          metalness={0.05}
          opacity={isOn ? 1 : 0.85}
          transparent
        />
      </RoundedBox>
      <Text
        ref={textRef}
        position={[0, -0.2, DISPLAY_FACE_Z]}
        anchorX="left"
        anchorY="top-baseline"
        fontSize={0.5}
        letterSpacing={0.05}
        color={isOn ? "#3d1a1a" : "#9a7a7a"}
        clipRect={[-CLIP_W, -CLIP_H / 2, 0, CLIP_H / 2]}
        font="/fonts/Technology.ttf"
      >
        {input || "0"}
      </Text>
    </group>
  );
}
