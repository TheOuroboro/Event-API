if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const _env = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d'
};

// Safety Check: Make sure critical variables exist
for (const [key, value] of Object.entries(_env)) {
  if (!value) {
    throw new Error(`MISSING CONFIG: The environment variable ${key} is not set in .env`);
  }
}

module.exports = _env;