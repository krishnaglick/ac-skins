export const getEnvironmentValue = (env: string) => {
    if (process.env[env]) {
        return process.env[env];
    }
    return import("../env.json")[env];
};
