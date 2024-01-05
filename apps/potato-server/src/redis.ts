import { createClient } from "redis";

// todo add to env
const REDIS_HOST = "rds"; // this is the internal docker ip
const REDIS_PORT = 6379;

const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});
redisClient.on("error", (err) => {
  console.log("RedisClient Error", err);
});

const redisSub = redisClient.duplicate();
redisSub.on("error", (err) => console.log("RedisSub Error", err));

function connectRedis() {
  return Promise.all([redisClient.connect(), redisSub.connect()]);
}

export { redisClient, redisSub, connectRedis };
