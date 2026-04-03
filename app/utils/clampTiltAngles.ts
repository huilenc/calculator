import * as THREE from "three";
import { MAX_TILT } from "./constants";

export function clampTiltAngles(group: THREE.Group) {
  group.rotation.x = THREE.MathUtils.clamp(
    group.rotation.x,
    -MAX_TILT,
    MAX_TILT,
  );
  group.rotation.y = THREE.MathUtils.clamp(
    group.rotation.y,
    -MAX_TILT,
    MAX_TILT,
  );
}
