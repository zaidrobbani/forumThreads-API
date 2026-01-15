import "dotenv/config";
import createServer from "./Infrastructures/http/createServer.js";
import container from "./Infrastructures/container.js";

const start = async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

start();
