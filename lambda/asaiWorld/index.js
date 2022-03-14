"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// npm i @aws-sdk/client-sesでインストール
const client_ses_1 = require("@aws-sdk/client-ses");
exports.handler = async function (event) {
    // 【SES】
    const sesClient = new client_ses_1.SESClient({ region: "ap-northeast-1" });
    const params = {
        Source: "info@my-theme.site",
        Destination: { ToAddresses: ["baseballboy1025@gmail.com"] },
        Message: {
            Subject: { Data: "CDKで作ったやつ" },
            Body: { Text: { Data: "CDKで作ったやつの本文" } },
        },
    };
    const command = new client_ses_1.SendEmailCommand(params);
    const sesClientSend = await sesClient.send(command);
    return {};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLG1DQUFtQztBQUNuQyxvREFJNkI7QUFFN0IsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLFdBQVcsS0FBc0I7SUFDdEQsUUFBUTtJQUNSLE1BQU0sU0FBUyxHQUFHLElBQUksc0JBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDOUQsTUFBTSxNQUFNLEdBQTBCO1FBQ3BDLE1BQU0sRUFBRSxvQkFBb0I7UUFDNUIsV0FBVyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsMkJBQTJCLENBQUMsRUFBRTtRQUMzRCxPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQzlCLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsRUFBRTtTQUN6QztLQUNGLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLE1BQU0sYUFBYSxHQUFHLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVwRCxPQUFPLEVBQUUsQ0FBQztJQUNWLGFBQWE7SUFDYixnREFBZ0Q7SUFDaEQsbUVBQW1FO0lBRW5FLHdDQUF3QztJQUN4Qyw0QkFBNEI7SUFDNUIsOEJBQThCO0lBQzlCLDJDQUEyQztJQUMzQyxLQUFLO0lBQ0wsOENBQThDO0lBQzlDLGlEQUFpRDtJQUVqRCxxQkFBcUI7SUFDckIsMkJBQTJCO0lBQzNCLDZCQUE2QjtBQUMvQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElHYXRld2F5RXZlbnQgfSBmcm9tICdhd3MtbGFtYmRhJztcclxuLy8gRVM2KyBleGFtcGxlXHJcbmltcG9ydCB7IER5bmFtb0RCQ2xpZW50LCBHZXRJdGVtQ29tbWFuZCwgR2V0SXRlbUNvbW1hbmRJbnB1dCwgUHV0SXRlbUNvbW1hbmQgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCI7XHJcbi8vIG5wbSBpIEBhd3Mtc2RrL2NsaWVudC1zZXPjgafjgqTjg7Pjgrnjg4jjg7zjg6tcclxuaW1wb3J0IHtcclxuICBTRVNDbGllbnQsXHJcbiAgU2VuZEVtYWlsQ29tbWFuZCxcclxuICBTZW5kRW1haWxDb21tYW5kSW5wdXQsXHJcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1zZXNcIjtcclxuXHJcbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIGZ1bmN0aW9uIChldmVudDogQVBJR2F0ZXdheUV2ZW50KSB7XHJcbiAgLy8g44CQU0VT44CRXHJcbiAgY29uc3Qgc2VzQ2xpZW50ID0gbmV3IFNFU0NsaWVudCh7IHJlZ2lvbjogXCJhcC1ub3J0aGVhc3QtMVwiIH0pO1xyXG4gIGNvbnN0IHBhcmFtczogU2VuZEVtYWlsQ29tbWFuZElucHV0ID0ge1xyXG4gICAgU291cmNlOiBcImluZm9AbXktdGhlbWUuc2l0ZVwiLFxyXG4gICAgRGVzdGluYXRpb246IHsgVG9BZGRyZXNzZXM6IFtcImJhc2ViYWxsYm95MTAyNUBnbWFpbC5jb21cIl0gfSxcclxuICAgIE1lc3NhZ2U6IHtcclxuICAgICAgU3ViamVjdDogeyBEYXRhOiBcIkNES+OBp+S9nOOBo+OBn+OChOOBpFwiIH0sXHJcbiAgICAgIEJvZHk6IHsgVGV4dDogeyBEYXRhOiBcIkNES+OBp+S9nOOBo+OBn+OChOOBpOOBruacrOaWh1wiIH0gfSxcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY29tbWFuZCA9IG5ldyBTZW5kRW1haWxDb21tYW5kKHBhcmFtcyk7XHJcbiAgY29uc3Qgc2VzQ2xpZW50U2VuZCA9IGF3YWl0IHNlc0NsaWVudC5zZW5kKGNvbW1hbmQpO1xyXG5cclxuICByZXR1cm4ge307XHJcbiAgLy8g44CQRHluZW1vRELjgJFcclxuICAvLyBhIGNsaWVudCBjYW4gYmUgc2hhcmVkIGJ5IGRpZmZlcmVudCBjb21tYW5kcy5cclxuICAvLyBjb25zdCBjbGllbnQgPSBuZXcgRHluYW1vREJDbGllbnQoeyByZWdpb246IFwiYXAtbm9ydGhlYXN0LTFcIiB9KTtcclxuXHJcbiAgLy8gY29uc3QgcGFyYW1zOiBHZXRJdGVtQ29tbWFuZElucHV0ID0ge1xyXG4gIC8vICAgLyoqIGlucHV0IHBhcmFtZXRlcnMgKi9cclxuICAvLyAgIEtleToge2lkOiB7UzonYXNhaS1pZCd9fSxcclxuICAvLyAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuQVNBSV9UQUJMRV9OQU1FXHJcbiAgLy8gfTtcclxuICAvLyBjb25zdCBjb21tYW5kID0gbmV3IEdldEl0ZW1Db21tYW5kKHBhcmFtcyk7XHJcbiAgLy8gY29uc3QgY2xpZW50U2VuZCA9IGF3YWl0IGNsaWVudC5zZW5kKGNvbW1hbmQpO1xyXG5cclxuICAvLyByZXR1cm4gY2xpZW50U2VuZDtcclxuICAvLyBjb25zb2xlLmxvZyhldmVudC5ib2R5KTtcclxuICAvLyByZXR1cm4geyBcImFzYWlcIjogXCJXb3JsZFwiIH1cclxufTsiXX0=