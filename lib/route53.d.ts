import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
interface route53ConstructProps extends cdk.StackProps {
    hostZoneName: string;
    appCustomDomainName: string;
    cfDist: cdk.aws_cloudfront.IDistribution;
    apiCustomDomainName: string;
    api: cdk.aws_apigateway.RestApi;
}
export declare class route53Construct extends Construct {
    constructor(scope: Construct, id: string, props: route53ConstructProps);
}
export {};
