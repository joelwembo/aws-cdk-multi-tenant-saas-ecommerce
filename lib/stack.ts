import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
import { alb } from './ApplicationLoadBalancer';
import { cloudfront } from './cloudFront';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { dns } from './Route53'
export interface BrokerPartnerProps {
  TargetGroupArn: string;
  loadBalancerArn: string;
  listenerPort: number;
  listenerProtocol: ApplicationProtocol;
  product: string;
  appName: string;
  domainName: string[];
  certificateArn: string;
  hostedZone: string;
}
export class BrokerPartner extends Construct {
  constructor(scope: Construct, id: string, props: BrokerPartnerProps) {
    super(scope, id);
// Stitching all the pieces together.
props.domainName.forEach(element => {
      
      new alb(this, props.product + '-alb-' + element, {
        TargetGroupArn: props.TargetGroupArn,
        url: element,
        loadBalancerArn: props.loadBalancerArn,
        listenerPort: props.listenerPort,
        listenerProtocol: props.listenerProtocol,
        product: props.product,
        appName: props.appName,
      })
      
    });
const cf = new cloudfront(this, 'gateway-partner', {
      domainName: props.domainName,
      loadBalancerArn: props.loadBalancerArn,
      certificateArn: props.certificateArn,
      product: props.product,
    });
    
    // Dependable.implement()
props.domainName.forEach(element => {
      
      const cname = CloudFrontWebDistribution.fromDistributionAttributes(this, props.appName + '-cname-' + element, {
        domainName: element,
        distributionId: cf.dist.distributionId
      })
cname.node.addDependency(cf)
const arecord = new dns(this, element + '-dns', {
        hostedZone: props.hostedZone,
        distribution: cf.dist,
        domainName: element
      })
arecord.node.addDependency(cname)
    });
}
}