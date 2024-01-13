import { createClient } from "redis";

// todo add to env
/* const REDIS_HOST = "rds"; // this is the internal docker ip
const REDIS_PORT = 6379; */
const REDIS_HOST =
  "redis://default:86b83a6ef4e948c48d26d461d22d9c81@us1-dear-bug-39462.upstash.io:39462";

/* const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
}); */

const redisClient = createClient({ url: REDIS_HOST });

redisClient.on("error", (err) => {
  console.log("RedisClient Error", err);
});

const redisSub = redisClient.duplicate();
redisSub.on("error", (err) => console.log("RedisSub Error", err));

function connectRedis() {
  return Promise.all([redisClient.connect(), redisSub.connect()]);
}

export { redisClient, redisSub, connectRedis };
