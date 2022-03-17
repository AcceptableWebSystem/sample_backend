import { APIGatewayEvent } from "aws-lambda";
// ES6+ example
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
// npm i @aws-sdk/client-sesでインストール
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";

exports.handler = async function (event: APIGatewayEvent) {
  // 【SES】
  const sesClient = new SESClient({ region: "ap-northeast-1" });
  const params: SendEmailCommandInput = {
    Source: "info@my-theme.site",
    Destination: { ToAddresses: ["baseballboy1025@gmail.com"] },
    Message: {
      Subject: { Data: "CDKで作ったやつ" },
      Body: { Text: { Data: "CDKで作ったやつの本文" } },
    },
  };

  const command = new SendEmailCommand(params);
  const sesClientSend = await sesClient.send(command);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "https://asai.my-theme.site",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: "This is SampleFunc.",
  };
  // 【DynemoDB】
  // a client can be shared by different commands.
  // const client = new DynamoDBClient({ region: "ap-northeast-1" });

  // const params: GetItemCommandInput = {
  //   /** input parameters */
  //   Key: {id: {S:'asai-id'}},
  //   TableName: process.env.ASAI_TABLE_NAME
  // };
  // const command = new GetItemCommand(params);
  // const clientSend = await client.send(command);

  // return clientSend;
  // console.log(event.body);
  // return { "asai": "World" }
};
