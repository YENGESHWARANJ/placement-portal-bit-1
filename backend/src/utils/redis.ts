export const connectRedis = async () => {
    console.log("Redis disabled (local testing mode)");
};

export const getCache = async (key: string) => {
    return null;
};

export const setCache = async (key: string, value: string, ttl: number = 3600) => {
    return;
};

const client = { isOpen: false };
export default client;
