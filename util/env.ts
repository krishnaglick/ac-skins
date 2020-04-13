export const getEnvironmentValue = (env: string) => {
    console.log("asdf: ", Object.keys(process.env));
    return process.env[env] || import("../env.json")[env];
};
