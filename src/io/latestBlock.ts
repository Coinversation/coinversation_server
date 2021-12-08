import { latestBlocksRoom } from "./constant";

async function feedLatestBlocks(io) {
  try {
    io.to(latestBlocksRoom).emit("latestBlocks", "simpleBlocks");
  } catch (e) {
    console.error(e);
  }
}
export { feedLatestBlocks };
