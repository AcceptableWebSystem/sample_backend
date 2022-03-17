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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLG1DQUFtQztBQUNuQyxvREFJNkI7QUFFN0IsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLFdBQVcsS0FBc0I7SUFDdEQsUUFBUTtJQUNSLE1BQU0sU0FBUyxHQUFHLElBQUksc0JBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDOUQsTUFBTSxNQUFNLEdBQTBCO1FBQ3BDLE1BQU0sRUFBRSxvQkFBb0I7UUFDNUIsV0FBVyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsMkJBQTJCLENBQUMsRUFBRTtRQUMzRCxPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQzlCLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsRUFBRTtTQUN6QztLQUNGLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLE1BQU0sYUFBYSxHQUFHLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVwRCxPQUFPO1FBQ0wsVUFBVSxFQUFFLEdBQUc7UUFDZixPQUFPLEVBQUU7WUFDUCw4QkFBOEIsRUFBRSxjQUFjO1lBQzlDLDZCQUE2QixFQUFFLDRCQUE0QjtZQUMzRCw4QkFBOEIsRUFBRSxrQkFBa0I7U0FDbkQ7UUFDRCxJQUFJLEVBQUUscUJBQXFCO0tBQzVCLENBQUM7SUFDRixhQUFhO0lBQ2IsZ0RBQWdEO0lBQ2hELG1FQUFtRTtJQUVuRSx3Q0FBd0M7SUFDeEMsNEJBQTRCO0lBQzVCLDhCQUE4QjtJQUM5QiwyQ0FBMkM7SUFDM0MsS0FBSztJQUNMLDhDQUE4QztJQUM5QyxpREFBaUQ7SUFFakQscUJBQXFCO0lBQ3JCLDJCQUEyQjtJQUMzQiw2QkFBNkI7QUFDL0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJR2F0ZXdheUV2ZW50IH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcclxuLy8gRVM2KyBleGFtcGxlXHJcbmltcG9ydCB7XHJcbiAgRHluYW1vREJDbGllbnQsXHJcbiAgR2V0SXRlbUNvbW1hbmQsXHJcbiAgR2V0SXRlbUNvbW1hbmRJbnB1dCxcclxuICBQdXRJdGVtQ29tbWFuZCxcclxufSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCI7XHJcbi8vIG5wbSBpIEBhd3Mtc2RrL2NsaWVudC1zZXPjgafjgqTjg7Pjgrnjg4jjg7zjg6tcclxuaW1wb3J0IHtcclxuICBTRVNDbGllbnQsXHJcbiAgU2VuZEVtYWlsQ29tbWFuZCxcclxuICBTZW5kRW1haWxDb21tYW5kSW5wdXQsXHJcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1zZXNcIjtcclxuXHJcbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIGZ1bmN0aW9uIChldmVudDogQVBJR2F0ZXdheUV2ZW50KSB7XHJcbiAgLy8g44CQU0VT44CRXHJcbiAgY29uc3Qgc2VzQ2xpZW50ID0gbmV3IFNFU0NsaWVudCh7IHJlZ2lvbjogXCJhcC1ub3J0aGVhc3QtMVwiIH0pO1xyXG4gIGNvbnN0IHBhcmFtczogU2VuZEVtYWlsQ29tbWFuZElucHV0ID0ge1xyXG4gICAgU291cmNlOiBcImluZm9AbXktdGhlbWUuc2l0ZVwiLFxyXG4gICAgRGVzdGluYXRpb246IHsgVG9BZGRyZXNzZXM6IFtcImJhc2ViYWxsYm95MTAyNUBnbWFpbC5jb21cIl0gfSxcclxuICAgIE1lc3NhZ2U6IHtcclxuICAgICAgU3ViamVjdDogeyBEYXRhOiBcIkNES+OBp+S9nOOBo+OBn+OChOOBpFwiIH0sXHJcbiAgICAgIEJvZHk6IHsgVGV4dDogeyBEYXRhOiBcIkNES+OBp+S9nOOBo+OBn+OChOOBpOOBruacrOaWh1wiIH0gfSxcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY29tbWFuZCA9IG5ldyBTZW5kRW1haWxDb21tYW5kKHBhcmFtcyk7XHJcbiAgY29uc3Qgc2VzQ2xpZW50U2VuZCA9IGF3YWl0IHNlc0NsaWVudC5zZW5kKGNvbW1hbmQpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc3RhdHVzQ29kZTogMjAwLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIjogXCJDb250ZW50LVR5cGVcIixcclxuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCJodHRwczovL2FzYWkubXktdGhlbWUuc2l0ZVwiLFxyXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogXCJPUFRJT05TLFBPU1QsR0VUXCIsXHJcbiAgICB9LFxyXG4gICAgYm9keTogXCJUaGlzIGlzIFNhbXBsZUZ1bmMuXCIsXHJcbiAgfTtcclxuICAvLyDjgJBEeW5lbW9EQuOAkVxyXG4gIC8vIGEgY2xpZW50IGNhbiBiZSBzaGFyZWQgYnkgZGlmZmVyZW50IGNvbW1hbmRzLlxyXG4gIC8vIGNvbnN0IGNsaWVudCA9IG5ldyBEeW5hbW9EQkNsaWVudCh7IHJlZ2lvbjogXCJhcC1ub3J0aGVhc3QtMVwiIH0pO1xyXG5cclxuICAvLyBjb25zdCBwYXJhbXM6IEdldEl0ZW1Db21tYW5kSW5wdXQgPSB7XHJcbiAgLy8gICAvKiogaW5wdXQgcGFyYW1ldGVycyAqL1xyXG4gIC8vICAgS2V5OiB7aWQ6IHtTOidhc2FpLWlkJ319LFxyXG4gIC8vICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5BU0FJX1RBQkxFX05BTUVcclxuICAvLyB9O1xyXG4gIC8vIGNvbnN0IGNvbW1hbmQgPSBuZXcgR2V0SXRlbUNvbW1hbmQocGFyYW1zKTtcclxuICAvLyBjb25zdCBjbGllbnRTZW5kID0gYXdhaXQgY2xpZW50LnNlbmQoY29tbWFuZCk7XHJcblxyXG4gIC8vIHJldHVybiBjbGllbnRTZW5kO1xyXG4gIC8vIGNvbnNvbGUubG9nKGV2ZW50LmJvZHkpO1xyXG4gIC8vIHJldHVybiB7IFwiYXNhaVwiOiBcIldvcmxkXCIgfVxyXG59O1xyXG4iXX0=