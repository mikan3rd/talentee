module.exports = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  extra: {
    socketPath: process.env.DB_SOCKET_PATH,
    charset: "utf8mb4_bin",
  },
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["typeorm/**/*.model.ts"],
  migrations: ["typeorm/migrations/*.ts"],
  cli: {
    migrationsDir: "typeorm/migrations",
  },
};
