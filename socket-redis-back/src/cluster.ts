import cluster from "cluster";
import http from "http";
import { setupMaster } from "@socket.io/sticky";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import os from "os";
import start from "./socket";

// const NUM_CPUS = os.cpus().length;
const NUM_CPUS = 4;

if (cluster.isMaster || cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  const httpServer = http.createServer();

  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  setupPrimary();

  cluster.setupPrimary();

  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`);
  });

  for (let i = 0; i < NUM_CPUS; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);
  const httpServer = http.createServer();

  start(httpServer, createAdapter());
}
