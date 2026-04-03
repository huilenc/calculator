import { clampTiltAngles } from "@/app/utils/clampTiltAngles";
import {
  DRAG_THRESHOLD_PX,
  RETURN_SMOOTH,
  ROTATE_SPEED,
} from "@/app/utils/constants";
import { isTiltInteractiveTarget } from "@/app/utils/isTiltInteractiveTarget";
import { Calculator3DProps } from "@/app/utils/types";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { BackDetail } from "./BackDetail";
import { CalculatorBody } from "./CalculatorBody";
import { Display3D } from "./Display3D";

export function Tilt({ isOn, input, handleClick }: Calculator3DProps) {
  const tiltRef = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const downOrigin = useRef({ x: 0, y: 0 });
  const rotateArmed = useRef(false);
  const { gl } = useThree();

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (isTiltInteractiveTarget(e.target)) return;
      dragging.current = true;
      rotateArmed.current = false;
      downOrigin.current = { x: e.clientX, y: e.clientY };
      lastPointer.current = { x: e.clientX, y: e.clientY };
      gl.domElement.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current || !tiltRef.current) return;
      if (!rotateArmed.current) {
        const dist = Math.hypot(
          e.clientX - downOrigin.current.x,
          e.clientY - downOrigin.current.y,
        );
        if (dist < DRAG_THRESHOLD_PX) return;
        rotateArmed.current = true;
        lastPointer.current = { x: e.clientX, y: e.clientY };
        return;
      }
      const group = tiltRef.current;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      // Horizontal drag → spin around Y; vertical → tilt X
      group.rotation.y += dx * ROTATE_SPEED;
      group.rotation.x += dy * ROTATE_SPEED;
      clampTiltAngles(group);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      rotateArmed.current = false;
      try {
        gl.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* not capturing */
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointermove", onPointerMove, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("pointercancel", onPointerUp, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("pointercancel", onPointerUp, true);
    };
  }, [gl]);
  useFrame((_, delta) => {
    const group = tiltRef.current;
    if (!group) return;
    if (!dragging.current) {
      const t = 1 - Math.exp(-RETURN_SMOOTH * delta);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, t);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, t);
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, t);
      if (Math.abs(group.rotation.x) < 1e-4) group.rotation.x = 0;
      if (Math.abs(group.rotation.y) < 1e-4) group.rotation.y = 0;
      if (Math.abs(group.rotation.z) < 1e-4) group.rotation.z = 0;
    }
    clampTiltAngles(group);
  });

  return (
    <group ref={tiltRef}>
      <Display3D input={input} isOn={isOn} />
      <BackDetail isOn={isOn} />
      <CalculatorBody isOn={isOn} handleClick={handleClick} />
    </group>
  );
}
