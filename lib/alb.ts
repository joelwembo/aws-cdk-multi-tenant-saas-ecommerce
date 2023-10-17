import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from "constructs";
export interface albprops {
  readonly targetGroupArn: string;
  readonly url: string;
  readonly appName: string;
  readonly product: string;
  readonly loadBalancerArn: string;
  readonly listenerPort: number;
  readonly listenerProtocol?: elbv2.ApplicationProtocol;
}
export class alb extends Construct {
  constructor(scope: Construct, id: string, props: albprops) {
    super(scope, id);
    // Picks up the ALB
    const listener = elbv2.ApplicationListener.fromLookup(this, "ALBListener", {
      loadBalancerArn: props.loadBalancerArn,
      listenerProtocol: props.listenerProtocol,
      listenerPort: props.listenerPort,
    });
    // Picks up the target group
    const applicationTargetGroup =
      elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(
        this,
        props.product + "-fleet",
        {
          targetGroupArn: props.TargetGroupArn,
        }
      );
    // Create loadbalancer entry against the given target group.
    new elbv2.ApplicationListenerRule(this, props.appName + "-alb-rule", {
      listener: listener,
      priority: Math.floor(Math.random() * (1000 - 1) + 100),
      conditions: [elbv2.ListenerCondition.hostHeaders([props.url])],
      targetGroups: [applicationTargetGroup],
    });
  }
}