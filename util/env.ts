export const getEnvironmentValue = (env: string) => process.env[env] || import("../env.json")[env];
