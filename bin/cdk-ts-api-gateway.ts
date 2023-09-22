#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkTsApiGatewayStack } from '../lib/cdk-ts-api-gateway-stack';
import environmentConfig from './stack-config';

const app = new cdk.App();
new CdkTsApiGatewayStack(app, 'CdkTsApiGatewayStack', environmentConfig);