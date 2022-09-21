export default () => ({
  JWT_DURATION: process.env.JWT_DURATION,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
});
