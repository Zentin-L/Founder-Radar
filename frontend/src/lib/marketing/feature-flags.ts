export const featureFlags = {
  enable3D: process.env.NEXT_PUBLIC_ENABLE_3D !== "false",
  enableGyroscope: process.env.NEXT_PUBLIC_ENABLE_GYRO === "true",
};
