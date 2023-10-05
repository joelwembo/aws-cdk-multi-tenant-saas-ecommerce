#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCloudappStack } from '../lib/aws-cloudapp-stack';
import { CicdPipelineStack } from "../lib/pipeline-stack";
import environmentConfig from './stack-config';

const app = new cdk.App();

new CicdPipelineStack(app, 'CicdPipelineStack' , environmentConfig)


new AwsCloudappStack(app, 'AwsCloudappStack', {
});

