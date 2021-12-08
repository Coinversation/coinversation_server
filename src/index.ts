import program from "commander";
import Database from "./db/dbIndex";
import Server from "./server/serverIndex";
import { loadConfigDir } from "./config/configIndex";
import logger from "./logger/loggerIndex";

const start = async (cmd: { config: string }) => {
  const config = loadConfigDir(cmd.config);
  const db = await Database.create(config.db.mongo.uri);
  logger.info(`db ok`);

  const server = new Server(db, config);
  server.start();
};

const catchAndQuit = async (fn: any) => {
  try {
    await fn;
  } catch (e) {
    console.error(e.toString());
    process.exit(1);
  }
};
program
  .option(
    "--config <directory>",
    "this path to the config directory.",
    "config"
  )
  .action((cmd: { config: string }) => catchAndQuit(start(cmd)));
program.version("0.0.1");
program.parse(process.argv);
