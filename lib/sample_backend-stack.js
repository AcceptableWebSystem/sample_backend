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
class SampleBackendStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const bucket = new s3.Bucket(this, 'MyFirstBucket', {
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
        const customDomainName = `asai.${hostZoneName}`;
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
            viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(certifivateForStaticSite, { aliases: [customDomainName] }),
        });
        // 8
        // DynamoDB
        const table = new dynamodb.Table(this, 'Table', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        });
        // 7
        // Lambda
        const notificationMangaLambda = new lambda.NodejsFunction(this, 'NotificationMangaLambda', {
            entry: 'lambda/asaiWorld/index.ts',
            handler: 'handler',
            timeout: cdk.Duration.seconds(20),
            environment: { ASAI_TABLE_NAME: table.tableName } // tableNameは
        });
        // DynamoDBの読み込みの権限をLambdaに与える
        table.grantReadData(notificationMangaLambda);
        // 6
        // API Gateway
        const api = new apigateway.RestApi(this, 'ServerlessRestApi', { cloudWatchRole: false, defaultCorsPreflightOptions: { allowOrigins: ['*'], allowMethods: ['GET'] } });
        // 6 ←→ 7
        // LambdaとAPI Gatewayを紐づける
        api.root.addMethod('GET', new apigateway.LambdaIntegration(notificationMangaLambda));
        // Lamdaに権限を与える
        notificationMangaLambda.addToRolePolicy(new iam.PolicyStatement({
            actions: ["ses:SendEmail"],
            resources: ["*"],
            effect: iam.Effect.ALLOW,
        }));
        // コンソール出力
        new cdk.CfnOutput(this, "CloudFrontUrl", {
            value: `https://${cfDist.distributionDomainName}/`,
        });
        new route53_1.route53Construct(this, 'route53Parts', { hostZoneName: hostZoneName, customDomainName: customDomainName, cfDist: cfDist });
    }
}
exports.SampleBackendStack = SampleBackendStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlX2JhY2tlbmQtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzYW1wbGVfYmFja2VuZC1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMseUNBQXlDO0FBQ3pDLHlEQUF5RDtBQUN6RCwyQ0FBMkM7QUFDM0MsMERBQTBEO0FBRzFELHVDQUE0QztBQUM1Qyx3REFBd0Q7QUFDeEQseURBQXlEO0FBQ3pELHFEQUFxRDtBQUVyRCxNQUFhLGtCQUFtQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDbEQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUVILHdCQUF3QjtRQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQy9ELE9BQU8sRUFBRSwrQkFBK0I7U0FDekMsQ0FBQyxDQUFDO1FBRUgsOEJBQThCO1FBQzlCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN6QyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztZQUN6QixVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLENBQUMsc0JBQXNCLENBQzVCLEtBQUssQ0FBQywrQ0FBK0MsQ0FDdEQ7YUFDRjtZQUNELFNBQVMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDO1NBQ3JDLENB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Y0FBYyxFQUFFLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqSSxDQUFDO0NBQ0Y7QUF2R0QsZ0RBdUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgYWNtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInO1xuaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgKiBhcyByb3V0ZTUzVGFyZ2V0cyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtcm91dGU1My10YXJnZXRzJztcbmltcG9ydCB7IHJvdXRlNTNDb25zdHJ1Y3QgfSBmcm9tICcuL3JvdXRlNTMnXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ub2RlanMnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuXG5leHBvcnQgY2xhc3MgU2FtcGxlQmFja2VuZFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnTXlGaXJzdEJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIOOCs+ODvOODieOBjOa2iOOBiOOCi+OBqOODquOCveODvOOCueOCgua2iOOBmVxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsICAvLyBTM+OBruS4rei6q+OCkua2iOOBmeOCiOOBhuOBqkxhbWJkYeOCkuS9nOOBo+OBpuOBj+OCjOOCi1xuICAgIH0pO1xuXG4gICAgLy8gQ2xvdWRGcm9udOOBruODpuODvOOCtuODvOOBruOCiOOBhuOBquOCguOBrlxuICAgIGNvbnN0IGNmT2FpID0gbmV3IGNsb3VkZnJvbnQuT3JpZ2luQWNjZXNzSWRlbnRpdHkodGhpcywgXCJDZk9haVwiLCB7XG4gICAgICBjb21tZW50OiBcIkFjY2VzcyBpZGVudGl0eSBmb3IgUzMgYnVja2V0XCIsXG4gICAgfSk7XG5cbiAgICAvLyBDbG91ZEZyb25044GL44KJ44Gu44Ki44Kv44K744K544KS6Kix5Y+v44GZ44KLUzPjga7mqKnpmZBcbiAgICBjb25zdCBjZlMzQWNjZXNzID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgYWN0aW9uczogW1wiczM6R2V0T2JqZWN0XCJdLFxuICAgICAgcHJpbmNpcGFsczogW1xuICAgICAgICBuZXcgaWFtLkNhbm9uaWNhbFVzZXJQcmluY2lwYWwoXG4gICAgICAgICAgY2ZPYWkuY2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5UzNDYW5vbmljYWxVc2VySWRcbiAgICAgICAgKSxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFtgJHtidWNrZXQuYnVja2V0QXJufS8qYF0sXG4gICAgfSk7XG4gICAgYnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3koY2ZTM0FjY2Vzcyk7XG5cbiAgICAvLyA0XG4gICAgLy8gQ2VydGlmaWNhdGUgTWFuYWdlciDoqLzmmI7mm7hcbiAgICBjb25zdCBjZXJ0aWZpdmF0ZUZvclN0YXRpY1NpdGUgPSBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKFxuICAgICAgdGhpcyxcbiAgICAgIFwiY2VydGlmaXZhdGVGb3JTdGF0aWNTaXRlXCIsXG4gICAgICBcImFybjphd3M6YWNtOnVzLWVhc3QtMTozMTIzOTMzMDU0OTI6Y2VydGlmaWNhdGUvYmRkZjY2MDktMGVmNS00NjgwLTg4OGEtM2IxNzUyNjEyZjhhXCJcbiAgICApO1xuXG4gICAgLy8gM1xuICAgIC8vIENsb3VkRnJvbnTmnKzkvZNcbiAgICBjb25zdCBob3N0Wm9uZU5hbWUgPSBcIm15LXRoZW1lLnNpdGVcIjtcbiAgICBjb25zdCBjdXN0b21Eb21haW5OYW1lID0gYGFzYWkuJHtob3N0Wm9uZU5hbWV9YDtcbiAgICBjb25zdCBjZkRpc3QgPSBuZXcgY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiQ2ZEaXN0cmlidXRpb25cIixcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luQ29uZmlnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICAgIHMzQnVja2V0U291cmNlOiBidWNrZXQsXG4gICAgICAgICAgICAgIG9yaWdpbkFjY2Vzc0lkZW50aXR5OiBjZk9haSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIC8vIDMg4oaQ4oaSIDRcbiAgICAgICAgLy8gQ2xvdWRGcm9udOOBqENlcnRpZmljYXRlIE1hbmFnZXLjgpLnuYvjgYTjgadXZWLjgqLjg5fjg6rjga7lhaXlj6PjgavoqLzmmI7mm7jjgpLplqLpgKPku5jjgZHjgotcbiAgICAgICAgdmlld2VyQ2VydGlmaWNhdGU6IGNsb3VkZnJvbnQuVmlld2VyQ2VydGlmaWNhdGUuZnJvbUFjbUNlcnRpZmljYXRlKFxuICAgICAgICAgIGNlcnRpZml2YXRlRm9yU3RhdGljU2l0ZSxcbiAgICAgICAgICB7IGFsaWFzZXM6IFtjdXN0b21Eb21haW5OYW1lXSB9XG4gICAgICAgICksXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIDhcbiAgICAvLyBEeW5hbW9EQlxuICAgIGNvbnN0IHRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdUYWJsZScsIHtcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAnaWQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgIH0pO1xuXG4gICAgLy8gN1xuICAgIC8vIExhbWJkYVxuICAgIGNvbnN0IG5vdGlmaWNhdGlvbk1hbmdhTGFtYmRhID0gbmV3IGxhbWJkYS5Ob2RlanNGdW5jdGlvbih0aGlzLCAnTm90aWZpY2F0aW9uTWFuZ2FMYW1iZGEnLCB7XG4gICAgICBlbnRyeTogJ2xhbWJkYS9hc2FpV29ybGQvaW5kZXgudHMnLFxuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMjApLFxuICAgICAgZW52aXJvbm1lbnQ6IHsgQVNBSV9UQUJMRV9OQU1FOiB0YWJsZS50YWJsZU5hbWUgfSAvLyB0YWJsZU5hbWXjga9cbiAgICB9KTtcblxuICAgIC8vIER5bmFtb0RC44Gu6Kqt44G/6L6844G/44Gu5qip6ZmQ44KSTGFtYmRh44Gr5LiO44GI44KLXG4gICAgdGFibGUuZ3JhbnRSZWFkRGF0YShub3RpZmljYXRpb25NYW5nYUxhbWJkYSk7XG5cbiAgICAvLyA2XG4gICAgLy8gQVBJIEdhdGV3YXlcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdTZXJ2ZXJsZXNzUmVzdEFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHsgYWxsb3dPcmlnaW5zOiBbJyonXSwgYWxsb3dNZXRob2RzOiBbJ0dFVCddIH0gfSk7XG5cbiAgICAvLyA2IOKGkOKGkiA3XG4gICAgLy8gTGFtYmRh44GoQVBJIEdhdGV3YXnjgpLntJDjgaXjgZHjgotcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKG5vdGlmaWNhdGlvbk1hbmdhTGFtYmRhKSk7XG5cbiAgICAvLyBMYW1kYeOBq+aoqemZkOOCkuS4juOBiOOCi1xuICAgIG5vdGlmaWNhdGlvbk1hbmdhTGFtYmRhLmFkZFRvUm9sZVBvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1wic2VzOlNlbmRFbWFpbFwiXSwvLyDmqKnpmZBcbiAgICAgICAgcmVzb3VyY2VzOiBbXCIqXCJdLC8vIOOBmeOBueOBplxuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csIC8vIOioseWPr1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8g44Kz44Oz44K944O844Or5Ye65YqbXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJDbG91ZEZyb250VXJsXCIsIHtcbiAgICAgIHZhbHVlOiBgaHR0cHM6Ly8ke2NmRGlzdC5kaXN0cmlidXRpb25Eb21haW5OYW1lfS9gLFxuICAgIH0pO1xuXG4gICAgbmV3IHJvdXRlNTNDb25zdHJ1Y3QodGhpcywgJ3JvdXRlNTNQYXJ0cycsIHsgaG9zdFpvbmVOYW1lOiBob3N0Wm9uZU5hbWUsIGN1c3RvbURvbWFpbk5hbWU6IGN1c3RvbURvbWFpbk5hbWUsIGNmRGlzdDogY2ZEaXN0IH0pO1xuICB9XG59Il19