export const getEnvironmentValue = (env: string): string | undefined => {
    if (process.env[env]) {
        return process.env[env];
    }
    try {
        return import("../env.json")[env];
    } catch (err) {
        console.error(err);
    }
};
