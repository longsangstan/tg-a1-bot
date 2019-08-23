import runJob from "./run-job";
import { ScheduledHandler } from "aws-lambda";

export const scheduled: ScheduledHandler = async (event, context, callback) => {
  console.log("[Info] Start.");

  context.callbackWaitsForEmptyEventLoop = false;

  await runJob();

  console.log("[Info] Done.");

  callback(null, null);
};
