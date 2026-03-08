import { AmbientLight, DirectionalLight, PointLight } from "three";

export function LightingRig() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} color="#dde7ff" />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#7c8cff" />
    </>
  );
}

export type LightingRefs = {
  ambient?: AmbientLight | null;
  directional?: DirectionalLight | null;
  rim?: PointLight | null;
};
