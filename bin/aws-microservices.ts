#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCloudappStack } from '../lib/aws-cloudapp-stack';

const app = new cdk.App();
new AwsCloudappStack(app, 'AwsCloudappStack', {
  // env: {
  //   account: 'xxxxxxxxx',
  //   region: 'ap-southeast-1',
  // }
});