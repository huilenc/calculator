"use client";

import { Calculator3DProps } from "@/app/utils/types";
import { Canvas } from "@react-three/fiber";
import { CalculatorBody } from "./CalculatorBody";
import { Tilt } from "./Tilt";

function Scene({ isOn, input, handleClick }: Calculator3DProps) {
  return (
    <Tilt isOn={isOn} input={input} handleClick={handleClick}>
      <CalculatorBody isOn={isOn} handleClick={handleClick} />
    </Tilt>
  );
}

export function Calculator3D({ isOn, input, handleClick }: Calculator3DProps) {
  return (
    <div className="w-screen min-w-[350px] h-screen shrink-0">
      <Canvas
        style={{
          width: "100%",
          height: "100%",
        }}
        className="touch-none"
        camera={{ position: [0, 0, 6.4], fov: 85 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#DBEAFE"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 8]} intensity={1.15} />
        <Scene isOn={isOn} input={input} handleClick={handleClick} />
      </Canvas>
    </div>
  );
}
