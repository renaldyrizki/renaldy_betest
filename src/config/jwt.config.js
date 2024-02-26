const jwtSecret = process.env.JWT_SECRET || ''
const jwtExpressIn = process.env.JWT_EXPRESS_IN || '1d'

export { jwtSecret, jwtExpressIn };