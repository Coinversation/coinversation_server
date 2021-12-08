import { latestBlocksRoom } from "./constant";
import { feedLatestBlocks } from "./latestBlock";

function IO(io) {
  io.on("connection", function (socket) {
    socket.on("subscribe", (room) => {
      console.log(room);
      if (room === latestBlocksRoom) {
        socket.emit("lastBlock", room);
      }
      socket.join(room);
    });
    socket.on("unsubscribe", (room) => {
      socket.leave(room);
    });
  });
  // await feedLatestBlocks(io);
  return io;
}
export { IO };
