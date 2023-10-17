import { Stack, StackProps } from 'aws-cdk-lib';
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
import { BrokerPartner } from '../constructs/BrokerPartner';
export class DevBrokerPlatform extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
new BrokerPartner(this, 'dev-broker-partner', {
      TargetGroupArn: 'arn:aws:elasticloadbalancing:<region>:<account-id>:<target-group-arn>,
      loadBalancerArn: 'arn:aws:elasticloadbalancing:<region>:<account-id>:<load-balancer-arn',
      listenerPort: 443,
      listenerProtocol: ApplicationProtocol.HTTPS,
      product: <product>,
      appName: <app-name>,
      domainName: [<domain>],
      certificateArn: 'arn:aws:acm:us-east-1:<account-id>:<certificate-arn>',
      hostedZone: <hosted-zone>
    });
  }
}