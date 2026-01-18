const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 1909,
  },
  db: {
    port: process.env.DEV_DB_PORT || 27017,
    host: process.env.DEV_DB_HOST || "local",
    name: process.env.DEV_APP_NAME || "shopDEV",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 1909,
  },
  db: {
    port: process.env.PRO_DB_PORT || 27017,
    host: process.env.PRO_DB_HOST || "product",
    name: process.env.PRO_APP_NAME || "shopPRO",
  },
};

const config = { dev, pro };
env = process.env.NODE_ENV || "dev";

modules.export = config[env];
