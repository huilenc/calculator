"use client";

import { Calculator3DProps } from "@/app/utils/types";
import { Canvas } from "@react-three/fiber";
import { BODY_H, BODY_W } from "../utils/constants";
import { CalculatorBody } from "./CalculatorBody";
import { Tilt } from "./Tilt";

function Scene({ isOn, input, handleClick }: Calculator3DProps) {
  return (
    <Tilt isOn={isOn} input={input} handleClick={handleClick}>
      <CalculatorBody isOn={isOn} handleClick={handleClick} />
    </Tilt>
  );
}

export default function Calculator3D({
  isOn,
  input,
  handleClick,
}: Calculator3DProps) {
  return (
    // <div className="w-[92vw] min-w-[350px] max-w-[420px] h-[60vh] min-h-[520px] max-h-[700px] box-border shrink-0">
    <div
      className="w-screen min-w-[350px] h-screen shrink-0"
      style={{
        aspectRatio: `${BODY_W} / ${BODY_H}`,
      }}
    >
      <Canvas
        style={{
          width: "100%",
          height: "100%",
        }}
        className="touch-none"
        camera={{ position: [0, 0, 6.4], fov: 85 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#DBEAFE"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 8]} intensity={1.15} />
        <Scene isOn={isOn} input={input} handleClick={handleClick} />
      </Canvas>
    </div>
  );
}
