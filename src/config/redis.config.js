const redisExpiressIn = parseInt(process.env.REDIS_EXPRESS_IN, 10) || 60
const redisHost = process.env.REDIS_HOST
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10)

export { redisHost, redisPort, redisExpiressIn };