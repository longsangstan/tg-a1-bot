import AWS = require("aws-sdk");
import { APIGatewayProxyHandler } from "aws-lambda";
import { Update } from "node-telegram-bot-api";

export const webhook: APIGatewayProxyHandler = async (event, context) => {
  console.log("[Info] Start");
  console.log(JSON.stringify(event));

  context.callbackWaitsForEmptyEventLoop = false;

  const body: Update = JSON.parse(event.body);

  const chatId = body.message.chat.id;
  const text = body.message.text;

  if (chatId === parseInt(process.env.CHAT_ID) && text === "run job") {
    console.log("[Info] Run job.");
    try {
      const lambda = new AWS.Lambda();
      const params = {
        FunctionName: process.env.RUN_JOB_FUNCTION_NAME,
        InvocationType: "Event"
      };

      await lambda.invoke(params).promise();
      console.log("[Info] Invoked function.");
    } catch (e) {
      console.log(`[Error] ${e}`);
    }
  } else {
    console.log("[Info] X run job.");
  }

  return {
    headers: {
      "Access-Control-Allow-Origin": "*" // Required for CORS support to work
    },
    statusCode: 200,
    body: "OK"
  };
};
