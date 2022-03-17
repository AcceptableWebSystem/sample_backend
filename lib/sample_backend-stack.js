"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleBackendStack = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const iam = require("aws-cdk-lib/aws-iam");
const acm = require("aws-cdk-lib/aws-certificatemanager");
const route53_1 = require("./route53");
const lambda = require("aws-cdk-lib/aws-lambda-nodejs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const cognito = require("aws-cdk-lib/aws-cognito");
class SampleBackendStack extends cdk.Stack {
    constructor(scope, id, props) {
        // 継承しているクラス（親クラス）のコンストラクタを呼び出す
        super(scope, id, props); // cdk.Stackを継承したクラスはCloudFormationの1レコードに相当する
        const bucket = new s3.Bucket(this, "MyFirstBucket", {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        // CloudFrontのユーザーのようなもの
        const cfOai = new cloudfront.OriginAccessIdentity(this, "CfOai", {
            comment: "Access identity for S3 bucket",
        });
        // CloudFrontからのアクセスを許可するS3の権限
        const cfS3Access = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["s3:GetObject"],
            principals: [
                new iam.CanonicalUserPrincipal(cfOai.cloudFrontOriginAccessIdentityS3CanonicalUserId),
            ],
            resources: [`${bucket.bucketArn}/*`],
        });
        bucket.addToResourcePolicy(cfS3Access);
        // 4
        // Certificate Manager 証明書
        const certifivateForStaticSite = acm.Certificate.fromCertificateArn(this, "certifivateForStaticSite", "arn:aws:acm:us-east-1:312393305492:certificate/bddf6609-0ef5-4680-888a-3b1752612f8a");
        // 3
        // CloudFront本体
        const hostZoneName = "my-theme.site";
        const appCustomDomainName = `asai-app.${hostZoneName}`;
        const apiCustomDomainName = `asai-api.${hostZoneName}`;
        const cfDist = new cloudfront.CloudFrontWebDistribution(this, "CfDistribution", {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: bucket,
                        originAccessIdentity: cfOai,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
            // 3 ←→ 4
            // CloudFrontとCertificate Managerを繋いでWebアプリの入口に証明書を関連付ける
            viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(certifivateForStaticSite, { aliases: [appCustomDomainName] }),
        });
        // 8
        // DynamoDB
        const table = new dynamodb.Table(this, "Table", {
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        });
        // 7
        // Lambda
        const notificationMangaLambda = new lambda.NodejsFunction(this, "NotificationMangaLambda", {
            entry: "lambda/asaiWorld/index.ts",
            handler: "handler",
            timeout: cdk.Duration.seconds(20),
            environment: { ASAI_TABLE_NAME: table.tableName },
        });
        // DynamoDBの読み込みの権限をLambdaに与える
        table.grantReadData(notificationMangaLambda);
        // 6
        // API Gateway
        const api = new apigateway.RestApi(this, "ServerlessRestApi", {
            cloudWatchRole: false,
            domainName: {
                domainName: apiCustomDomainName,
                certificate: certifivateForStaticSite,
                endpointType: apigateway.EndpointType.EDGE,
            },
        });
        // 6 ←→ 7
        // LambdaとAPI Gatewayを紐づける
        api.root.addMethod("GET", new apigateway.LambdaIntegration(notificationMangaLambda));
        // Lamdaに権限を与える
        notificationMangaLambda.addToRolePolicy(new iam.PolicyStatement({
            actions: ["ses:SendEmail"],
            resources: ["*"],
            effect: iam.Effect.ALLOW,
        }));
        //認証
        const myCognito = new cognito.UserPool(this, "myCognito", {
            signInAliases: { username: true, email: true, preferredUsername: true },
            standardAttributes: {
                email: { required: true, mutable: true },
                preferredUsername: { required: false, mutable: true },
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            selfSignUpEnabled: true,
        });
        myCognito.addClient("myClient", {
            authFlows: {},
            generateSecret: false,
        });
        // コンソール出力
        new cdk.CfnOutput(this, "CloudFrontUrl", {
            value: `https://${cfDist.distributionDomainName}/`,
        });
        // route53のやつに値を渡す
        new route53_1.route53Construct(this, "route53Parts", {
            hostZoneName: hostZoneName,
            appCustomDomainName: appCustomDomainName,
            cfDist: cfDist,
            apiCustomDomainName: apiCustomDomainName,
            api: api,
        });
    }
}
exports.SampleBackendStack = SampleBackendStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlX2JhY2tlbmQtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzYW1wbGVfYmFja2VuZC1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMseUNBQXlDO0FBQ3pDLHlEQUF5RDtBQUN6RCwyQ0FBMkM7QUFDM0MsMERBQTBEO0FBRzFELHVDQUE2QztBQUM3Qyx3REFBd0Q7QUFDeEQseURBQXlEO0FBQ3pELHFEQUFxRDtBQUNyRCxtREFBbUQ7QUFHbkQsTUFBYSxrQkFBbUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELCtCQUErQjtRQUMvQixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLDhDQUE4QztRQUV2RSxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNsRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3hDLGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsd0JBQXdCO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDL0QsT0FBTyxFQUFFLCtCQUErQjtTQUN6QyxDQUFDLENBQUM7UUFFSCw4QkFBOEI7UUFDOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3pDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDeEIsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQ3pCLFVBQVUsRUFBRTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxzQkFBc0IsQ0FDNUIsS0FBSyxDQUFDLCtDQUErQyxDQUN0RDthQUNGO1lBQ0QsU0FBUyxFQUFFLENBQUMs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LENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUN4RCxhQUFhLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFO1lBQ3ZFLGtCQUFrQixFQUFFO2dCQUNsQixLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7Z0JBQ3hDLGlCQUFpQixFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO2FBQ3REO1lBQ0QsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVTtZQUNuRCxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUNILFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFO1lBQzlCLFNBQVMsRUFBRSxFQUFFO1lBQ2IsY0FBYyxFQUFFLEtBQUs7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsVUFBVTtRQUNWLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxXQUFXLE1BQU0sQ0FBQyxzQkFBc0IsR0FBRztTQUNuRCxDQUFDLENBQUM7UUFFSCxrQkFBa0I7UUFDbEIsSUFBSSwwQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3pDLFlBQVksRUFBRSxZQUFZO1lBQzFCLG1CQUFtQixFQUFFLG1CQUFtQjtZQUN4QyxNQUFNLEVBQUUsTUFBTTtZQUNkLG1CQUFtQixFQUFFLG1CQUFtQjtZQUN4QyxHQUFHLEVBQUUsR0FBRztTQUNULENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTdJRCxnREE2SUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0ICogYXMgczMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1zM1wiO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnRcIjtcbmltcG9ydCAqIGFzIGlhbSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0ICogYXMgYWNtIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyXCI7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtcm91dGU1M1wiO1xuaW1wb3J0ICogYXMgcm91dGU1M1RhcmdldHMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1yb3V0ZTUzLXRhcmdldHNcIjtcbmltcG9ydCB7IHJvdXRlNTNDb25zdHJ1Y3QgfSBmcm9tIFwiLi9yb3V0ZTUzXCI7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzXCI7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSBcImF3cy1jZGstbGliL2F3cy1keW5hbW9kYlwiO1xuaW1wb3J0ICogYXMgY29nbml0byBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNvZ25pdG9cIjtcbmltcG9ydCB7IENlcnRpZmljYXRlIH0gZnJvbSBcImNyeXB0b1wiO1xuXG5leHBvcnQgY2xhc3MgU2FtcGxlQmFja2VuZFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIC8vIOe2meaJv+OBl+OBpuOBhOOCi+OCr+ODqeOCue+8iOimquOCr+ODqeOCue+8ieOBruOCs+ODs+OCueODiOODqeOCr+OCv+OCkuWRvOOBs+WHuuOBmVxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpOyAvLyBjZGsuU3RhY2vjgpLntpnmib/jgZfjgZ/jgq/jg6njgrnjga9DbG91ZEZvcm1hdGlvbuOBrjHjg6zjgrPjg7zjg4njgavnm7jlvZPjgZnjgotcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgXCJNeUZpcnN0QnVja2V0XCIsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIOOCs+ODvOODieOBjOa2iOOBiOOCi+OBqOODquOCveODvOOCueOCgua2iOOBmVxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsIC8vIFMz44Gu5Lit6Lqr44KS5raI44GZ44KI44GG44GqTGFtYmRh44KS5L2c44Gj44Gm44GP44KM44KLXG4gICAgfSk7XG5cbiAgICAvLyBDbG91ZEZyb25044Gu44Om44O844K244O844Gu44KI44GG44Gq44KC44GuXG4gICAgY29uc3QgY2ZPYWkgPSBuZXcgY2xvdWRmcm9udC5PcmlnaW5BY2Nlc3NJZGVudGl0eSh0aGlzLCBcIkNmT2FpXCIsIHtcbiAgICAgIGNvbW1lbnQ6IFwiQWNjZXNzIGlkZW50aXR5IGZvciBTMyBidWNrZXRcIixcbiAgICB9KTtcblxuICAgIC8vIENsb3VkRnJvbnTjgYvjgonjga7jgqLjgq/jgrvjgrnjgpLoqLHlj6/jgZnjgotTM+OBruaoqemZkFxuICAgIGNvbnN0IGNmUzNBY2Nlc3MgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICBhY3Rpb25zOiBbXCJzMzpHZXRPYmplY3RcIl0sXG4gICAgICBwcmluY2lwYWxzOiBbXG4gICAgICAgIG5ldyBpYW0uQ2Fub25pY2FsVXNlclByaW5jaXBhbChcbiAgICAgICAgICBjZk9haS5jbG91ZEZyb250T3JpZ2luQWNjZXNzSWRlbnRpdHlTM0Nhbm9uaWNhbFVzZXJJZFxuICAgICAgICApLFxuICAgICAgXSxcbiAgICAgIHJlc291cmNlczogW2Ake2J1Y2tldC5idWNrZXRBcm59LypgXSxcbiAgICB9KTtcbiAgICBidWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShjZlMzQWNjZXNzKTtcblxuICAgIC8vIDRcbiAgICAvLyBDZXJ0aWZpY2F0ZSBNYW5hZ2VyIOiovOaYjuabuFxuICAgIGNvbnN0IGNlcnRpZml2YXRlRm9yU3RhdGljU2l0ZSA9IGFjbS5DZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4oXG4gICAgICB0aGlzLFxuICAgICAgXCJjZXJ0aWZpdmF0ZUZvclN0YXRpY1NpdGVcIixcbiAgICAgIFwiYXJuOmF3czphY206dXMtZWFzdC0xOjMxMjM5MzMwNTQ5MjpjZXJ0aWZpY2F0ZS9iZGRmNjYwOS0wZWY1LTQ2ODAtODg4YS0zYjE3NTI2MTJmOGFcIlxuICAgICk7XG5cbiAgICAvLyAzXG4gICAgLy8gQ2xvdWRGcm9udOacrOS9k1xuICAgIGNvbnN0IGhvc3Rab25lTmFtZSA9IFwibXktdGhlbWUuc2l0ZVwiO1xuICAgIGNvbnN0IGFwcEN1c3RvbURvbWFpbk5hbWUgPSBgYXNhaS1hcHAuJHtob3N0Wm9uZU5hbWV9YDtcbiAgICBjb25zdCBhcGlDdXN0b21Eb21haW5OYW1lID0gYGFzYWktYXBpLiR7aG9zdFpvbmVOYW1lfWA7XG4gICAgY29uc3QgY2ZEaXN0ID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcIkNmRGlzdHJpYnV0aW9uXCIsXG4gICAgICB7XG4gICAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogYnVja2V0LFxuICAgICAgICAgICAgICBvcmlnaW5BY2Nlc3NJZGVudGl0eTogY2ZPYWksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAvLyAzIOKGkOKGkiA0XG4gICAgICAgIC8vIENsb3VkRnJvbnTjgahDZXJ0aWZpY2F0ZSBNYW5hZ2Vy44KS57mL44GE44GnV2Vi44Ki44OX44Oq44Gu5YWl5Y+j44Gr6Ki85piO5pu444KS6Zai6YCj5LuY44GR44KLXG4gICAgICAgIHZpZXdlckNlcnRpZmljYXRlOiBjbG91ZGZyb250LlZpZXdlckNlcnRpZmljYXRlLmZyb21BY21DZXJ0aWZpY2F0ZShcbiAgICAgICAgICBjZXJ0aWZpdmF0ZUZvclN0YXRpY1NpdGUsXG4gICAgICAgICAgeyBhbGlhc2VzOiBbYXBwQ3VzdG9tRG9tYWluTmFtZV0gfVxuICAgICAgICApLFxuICAgICAgfVxuICAgICk7XG5cbiAgICAvLyA4XG4gICAgLy8gRHluYW1vREJcbiAgICBjb25zdCB0YWJsZSA9IG5ldyBkeW5hbW9kYi5UYWJsZSh0aGlzLCBcIlRhYmxlXCIsIHtcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiBcImlkXCIsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgfSk7XG5cbiAgICAvLyA3XG4gICAgLy8gTGFtYmRhXG4gICAgY29uc3Qgbm90aWZpY2F0aW9uTWFuZ2FMYW1iZGEgPSBuZXcgbGFtYmRhLk5vZGVqc0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiTm90aWZpY2F0aW9uTWFuZ2FMYW1iZGFcIixcbiAgICAgIHtcbiAgICAgICAgZW50cnk6IFwibGFtYmRhL2FzYWlXb3JsZC9pbmRleC50c1wiLFxuICAgICAgICBoYW5kbGVyOiBcImhhbmRsZXJcIixcbiAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMjApLFxuICAgICAgICBlbnZpcm9ubWVudDogeyBBU0FJX1RBQkxFX05BTUU6IHRhYmxlLnRhYmxlTmFtZSB9LCAvLyB0YWJsZU5hbWXjga9cbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gRHluYW1vRELjga7oqq3jgb/ovrzjgb/jga7mqKnpmZDjgpJMYW1iZGHjgavkuI7jgYjjgotcbiAgICB0YWJsZS5ncmFudFJlYWREYXRhKG5vdGlmaWNhdGlvbk1hbmdhTGFtYmRhKTtcblxuICAgIC8vIDZcbiAgICAvLyBBUEkgR2F0ZXdheVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgXCJTZXJ2ZXJsZXNzUmVzdEFwaVwiLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogZmFsc2UsXG4gICAgICBkb21haW5OYW1lOiB7XG4gICAgICAgIGRvbWFpbk5hbWU6IGFwaUN1c3RvbURvbWFpbk5hbWUsXG4gICAgICAgIGNlcnRpZmljYXRlOiBjZXJ0aWZpdmF0ZUZvclN0YXRpY1NpdGUsXG4gICAgICAgIGVuZHBvaW50VHlwZTogYXBpZ2F0ZXdheS5FbmRwb2ludFR5cGUuRURHRSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyA2IOKGkOKGkiA3XG4gICAgLy8gTGFtYmRh44GoQVBJIEdhdGV3YXnjgpLntJDjgaXjgZHjgotcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoXG4gICAgICBcIkdFVFwiLFxuICAgICAgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obm90aWZpY2F0aW9uTWFuZ2FMYW1iZGEpXG4gICAgKTtcblxuICAgIC8vIExhbWRh44Gr5qip6ZmQ44KS5LiO44GI44KLXG4gICAgbm90aWZpY2F0aW9uTWFuZ2FMYW1iZGEuYWRkVG9Sb2xlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbXCJzZXM6U2VuZEVtYWlsXCJdLCAvLyDmqKnpmZBcbiAgICAgICAgcmVzb3VyY2VzOiBbXCIqXCJdLCAvLyDjgZnjgbnjgaZcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLCAvLyDoqLHlj69cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8v6KqN6Ki8XG4gICAgY29uc3QgbXlDb2duaXRvID0gbmV3IGNvZ25pdG8uVXNlclBvb2wodGhpcywgXCJteUNvZ25pdG9cIiwge1xuICAgICAgc2lnbkluQWxpYXNlczogeyB1c2VybmFtZTogdHJ1ZSwgZW1haWw6IHRydWUsIHByZWZlcnJlZFVzZXJuYW1lOiB0cnVlIH0sXG4gICAgICBzdGFuZGFyZEF0dHJpYnV0ZXM6IHtcbiAgICAgICAgZW1haWw6IHsgcmVxdWlyZWQ6IHRydWUsIG11dGFibGU6IHRydWUgfSxcbiAgICAgICAgcHJlZmVycmVkVXNlcm5hbWU6IHsgcmVxdWlyZWQ6IGZhbHNlLCBtdXRhYmxlOiB0cnVlIH0sXG4gICAgICB9LFxuICAgICAgYWNjb3VudFJlY292ZXJ5OiBjb2duaXRvLkFjY291bnRSZWNvdmVyeS5FTUFJTF9PTkxZLFxuICAgICAgc2VsZlNpZ25VcEVuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG4gICAgbXlDb2duaXRvLmFkZENsaWVudChcIm15Q2xpZW50XCIsIHtcbiAgICAgIGF1dGhGbG93czoge30sIC8vIOimgeS7tuOBp+W/heimgeOBquOCiei/veWKoFxuICAgICAgZ2VuZXJhdGVTZWNyZXQ6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8g44Kz44Oz44K944O844Or5Ye65YqbXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJDbG91ZEZyb250VXJsXCIsIHtcbiAgICAgIHZhbHVlOiBgaHR0cHM6Ly8ke2NmRGlzdC5kaXN0cmlidXRpb25Eb21haW5OYW1lfS9gLFxuICAgIH0pO1xuXG4gICAgLy8gcm91dGU1M+OBruOChOOBpOOBq+WApOOCkua4oeOBmVxuICAgIG5ldyByb3V0ZTUzQ29uc3RydWN0KHRoaXMsIFwicm91dGU1M1BhcnRzXCIsIHtcbiAgICAgIGhvc3Rab25lTmFtZTogaG9zdFpvbmVOYW1lLFxuICAgICAgYXBwQ3VzdG9tRG9tYWluTmFtZTogYXBwQ3VzdG9tRG9tYWluTmFtZSxcbiAgICAgIGNmRGlzdDogY2ZEaXN0LFxuICAgICAgYXBpQ3VzdG9tRG9tYWluTmFtZTogYXBpQ3VzdG9tRG9tYWluTmFtZSxcbiAgICAgIGFwaTogYXBpLFxuICAgIH0pO1xuICB9XG59XG4iXX0=