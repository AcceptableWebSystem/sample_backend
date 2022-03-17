import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
interface route53ConstructProps extends cdk.StackProps {
  hostZoneName: string;
  appCustomDomainName: string;
  cfDist: cdk.aws_cloudfront.IDistribution;
  apiCustomDomainName: string;
  api: cdk.aws_apigateway.RestApi;
}

// スタックではないけど、スタックの部品として小分けにできる
export class route53Construct extends Construct {
  constructor(scope: Construct, id: string, props: route53ConstructProps) {
    super(scope, id); // 中身の動きは知らなくていい。スタックを作るうえで必要だから渡してあげる。

    // 2
    // Route53
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: props.hostZoneName,
    });

    // 2 → 3
    // レコード
    const appPropsForRoute53Records = {
      zone: hostedZone,
      recordName: props.appCustomDomainName,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(props.cfDist)
      ),
    };

    const apiPropsForRoute53Records = {
      zone: hostedZone, // route53のどのホストゾーンに対してのやつか
      recordName: props.apiCustomDomainName, // 実際に使用したいドメイン名
      target: route53.RecordTarget.fromAlias(
        // CloudFrontだったりAPI Gatewayだったりのターゲット（普通はIPアドレス）
        new route53Targets.ApiGateway(props.api)
      ),
    };
    // レコードを追加
    new route53.ARecord(this, "appARecord", appPropsForRoute53Records);
    new route53.AaaaRecord(this, "appAaaaRecord", appPropsForRoute53Records);
    new route53.ARecord(this, "apiARecord", apiPropsForRoute53Records);
    new route53.AaaaRecord(this, "apiAaaaRecord", apiPropsForRoute53Records);
  }
}
