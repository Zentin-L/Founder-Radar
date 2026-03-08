import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import { useMemo } from "react";

type CameraRigProps = {
  progress: number;
  velocity: number;
  reducedMotion: boolean;
};

export function CameraRig({ progress, velocity, reducedMotion }: CameraRigProps) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new Vector3(0, 0, 0), []);

  useFrame(() => {
    const z = reducedMotion ? 8 : MathUtils.lerp(8, 4.5, progress);
    const y = reducedMotion ? 0.8 : MathUtils.lerp(0.8, -0.4, progress);
    const x = reducedMotion ? 0 : MathUtils.clamp(velocity * 0.02, -0.35, 0.35);

    camera.position.set(
      MathUtils.lerp(camera.position.x, x, 0.08),
      MathUtils.lerp(camera.position.y, y, 0.08),
      MathUtils.lerp(camera.position.z, z, 0.08)
    );

    lookAt.set(0, MathUtils.lerp(0, -0.2, progress), 0);
    camera.lookAt(lookAt);
  });

  return null;
}
