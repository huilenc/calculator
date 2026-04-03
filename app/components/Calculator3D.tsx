"use client";

import { Calculator3DProps } from "@/app/utils/types";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
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
  const [fov, setFov] = useState(85);

  useEffect(() => {
    const update = () => setFov(window.innerWidth < 600 ? 100 : 85);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="w-screen min-w-[350px] sm:w-screen  h-screen shrink-0">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        className="touch-none"
        gl={{ antialias: true, alpha: false }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6.4]} fov={fov} />
        <color attach="background" args={["#DBEAFE"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 8]} intensity={1.15} />
        <Scene isOn={isOn} input={input} handleClick={handleClick} />
      </Canvas>
    </div>
  );
}
