import path from "path";
import * as fs from "fs";
export type Config = {
  db: {
    migrate: boolean;
    mongo: {
      uri: string;
    };
  };
  server: {
    port: number;
  };
};
export const loadConfig = (configPath: string): Config => {
  let conf = fs.readFileSync(configPath, { encoding: "utf-8" });
  return JSON.parse(conf);
};
export const loadConfigDir = (configDir: string): Config => {
  // const secretPath = path.join(configDir, "secret.json")
  // const secretConf = loadConfig(secretPath);
  const mainPath = path.join(configDir, "main.json");
  const mainConf = loadConfig(mainPath);
  return mainConf;
};
