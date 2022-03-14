import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import { route53Construct } from './route53'
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class SampleBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'MyFirstBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // コードが消えるとリソースも消す
      autoDeleteObjects: true,  // S3の中身を消すようなLambdaを作ってくれる
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
        new iam.CanonicalUserPrincipal(
          cfOai.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ),
      ],
      resources: [`${bucket.bucketArn}/*`],
    });
    bucket.addToResourcePolicy(cfS3Access);

    // 4
    // Certificate Manager 証明書
    const certifivateForStaticSite = acm.Certificate.fromCertificateArn(
      this,
      "certifivateForStaticSite",
      "arn:aws:acm:us-east-1:312393305492:certificate/bddf6609-0ef5-4680-888a-3b1752612f8a"
    );

    // 3
    // CloudFront本体
    const hostZoneName = "my-theme.site";
    const customDomainName = `asai.${hostZoneName}`;
    const cfDist = new cloudfront.CloudFrontWebDistribution(
      this,
      "CfDistribution",
      {
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
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certifivateForStaticSite,
          { aliases: [customDomainName] }
        ),
      }
    );

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
    notificationMangaLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail"],// 権限
        resources: ["*"],// すべて
        effect: iam.Effect.ALLOW, // 許可
      })
    );

    // コンソール出力
    new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: `https://${cfDist.distributionDomainName}/`,
    });

    new route53Construct(this, 'route53Parts', { hostZoneName: hostZoneName, customDomainName: customDomainName, cfDist: cfDist });
  }
}