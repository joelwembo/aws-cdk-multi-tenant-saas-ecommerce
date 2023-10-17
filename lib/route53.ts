import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { IDistribution } from "aws-cdk-lib/aws-cloudfront";

export interface cfprops {
  hostedZone: string;
  distribution: IDistribution;
  domainName: string;
}

export class dns extends Construct {
  // Looks for hosted zone we want to create A record under.
  constructor(scope: Construct, id: string, props: cfprops) {
    super(scope, id);
    const zone = HostedZone.fromLookup(this, "r53", {
      domainName: props.hostedZone,
    });
    // Creates new A record under the hosted zone.
    new ARecord(this, "AliasRecord", {
      zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(props.distribution)),
      recordName: props.domainName,
    });
  }
}