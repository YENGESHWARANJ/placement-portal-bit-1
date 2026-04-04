import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import app from "./app";
import connectDB from "./config/db.config";
import { initSocket } from "./config/socket.config";
import { ScraperService } from "./modules/scraper/scraper.service";
import { connectRedis } from "./utils/redis";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

initSocket(httpServer);

(async () => {
  await connectDB();
  await connectRedis();

  // Start Job Aggregation Cron (Every 30 mins)
  import("./modules/job-aggregator/job-aggregator.service").then(({ JobAggregatorService }) => {
    import("node-cron").then((cron) => {
      cron.schedule("*/30 * * * *", () => JobAggregatorService.fetchAndSaveJobs());
      JobAggregatorService.fetchAndSaveJobs(); // Initial run
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT} with WebSockets`);
  });
})();
