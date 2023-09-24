# Welcome to your CDK TypeScript Lambda,  DynamoDB and API Gateway

AWS CDK Infra with Terraform , CloudFormation, VPC, Typescript, DynamoDB, Postgres, Kafka and API Gateway

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

![image](https://github.com/joelwembo/aws-cdk-infra-poc-1/assets/19718580/172f05c7-3c8f-4e2a-8567-b33fdf660d31)

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Deploy to aws steps

1. npm run build
2. cdk diff
3. Bootstrap
- export CDK_NEW_BOOTSTRAP=1
- cdk bootstrap --trust=374650000015 aws://374650000015/ap-southeast-1 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://374650000015/ap-southeast-1 --verbose --profile=default
  
3. cdk synth
4. cdk deploy 
5. cdk deploy --force --method=direct --require-approval never  --verbose --no-previous-parameters --profile=default

npm run cdk deploy--force --require-approval never --no-previous-parameters --verbose


Outputs:
CdkTsApiGatewayStack.RestAPIEndpointB14C3C54 = https://s5b5glvjw4.execute-api.ap-southeast-1.amazonaws.com/prod/
Stack ARN:
arn:aws:cloudformation:ap-southeast-1:374650000015:stack/CdkTsApiGatewayStack/73b36810-4db9-11ee-ae6d-063f7ebf7fe2

✨  Total time: 70.18s

CdkTsApiGatewayStack.RestAPIEndpointB14C3C54 = https://d99pvr7e0i.execute-api.ap-southeast-1.amazonaws.com/prod/
Stack ARN:
arn:aws:cloudformation:ap-southeast-1:374650000015:stack/CdkTsApiGatewayStack/2ef23350-51fb-11ee-973e-0a61cfcd84ee

✨  Total time: 75.15s

# API Keys

D
4bzmt49j29
Name
demo-api-key
API key
EW1MXeoBHn9qd3h8UBnTacdoPkCN5VB386a9AhAc
Description
Api Key used for Api Gateway YouTube tutorial
Enabled
Enabled 
