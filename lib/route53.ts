import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
interface route53ConstructProps extends cdk.StackProps {
  hostZoneName: string,
  customDomainName: any,
  cfDist: cdk.aws_cloudfront.IDistribution
}

export class route53Construct extends Construct {
  constructor(scope: Construct, id: string, props: route53ConstructProps) {
    super(scope, id);

    // 2
    // Route53
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: props.hostZoneName,
    });

    // 2 → 3
    // レコード
    const propsForRoute53Records = {
      zone: hostedZone,
      recordName: props.customDomainName,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(props.cfDist)
      ),
    };
    new route53.ARecord(this, "ARecord", propsForRoute53Records);
    new route53.AaaaRecord(this, "AaaaRecord", propsForRoute53Records);

  }
}