import { Duration } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  Distribution,
  SecurityPolicyProtocol,
  OriginProtocolPolicy,
  ViewerProtocolPolicy,
  AllowedMethods,
  CachedMethods,
  CachePolicy,
  CacheHeaderBehavior,
  IDistribution,
} from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from "constructs";
export interface cfprops {
  domainName?: string[];
  product: string;
  loadBalancerArn: string;
  certificateArn: string;
}
export class cloudfront extends Construct {
  // making it public so that other constructs can use it.
  public readonly dist: IDistribution;
  constructor(scope: Construct, id: string, props: cfprops) {
    super(scope, id);
    // Looking up for the loadbalancer we want to create entry in.
    const loadBalancer = elbv2.ApplicationLoadBalancer.fromLookup(this, "ALB", {
      loadBalancerArn: props.loadBalancerArn,
    });
    // Registering the load balancer that communicates on 443 as origin for cloudfront.
    const origin = new origins.LoadBalancerV2Origin(loadBalancer, {
      httpsPort: 443,
      protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
    });
    // Creating the cache
    const cachePolicy = new CachePolicy(this, "allow-host-headers", {
      headerBehavior: CacheHeaderBehavior.allowList("Host"),
      minTtl: Duration.seconds(180),
      maxTtl: Duration.seconds(0),
      defaultTtl: Duration.seconds(180),
    });
    // Finally creating the distribution that consumes the policy we just created.
    this.dist = new Distribution(
      this,
      props.product + "cloudfront-distribution",
      {
        defaultBehavior: {
          origin: origin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
          cachePolicy: cachePolicy,
        },
        certificate: Certificate.fromCertificateArn(
          this,
          props.product + "-certificate",
          props.certificateArn
        ),
        domainNames: props.domainName,
        minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2019,
      }
    );
  }
}