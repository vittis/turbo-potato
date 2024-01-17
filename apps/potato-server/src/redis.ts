import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;
const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => {
  console.log("RedisClient Error", err);
});

const redisSub = redisClient.duplicate();
redisSub.on("error", (err) => console.log("RedisSub Error", err));

function connectRedis() {
  return Promise.all([redisClient.connect(), redisSub.connect()]);
}

export { redisClient, redisSub, connectRedis };
