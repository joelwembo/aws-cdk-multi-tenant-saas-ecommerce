# AWS CDK Restful APIs using API Gateway,  Lambda, RDS PostgreSQL, DynamoDB, VPC, Codepipeline and Terraform

This Proof of Concept is about a Restful APIs using AWS CDK  Infrastructure  with Terraform , CloudFormation, VPC, Typescript, DynamoDB, PostgreSQL, AWS EventBridge,  AWS CodePipeline, AWS SQS/SNS, Kafka and API Gateway.
![architecture-1](https://github.com/joelwembo/aws-cdk-infra-poc-1/assets/19718580/ccb09c1a-5cec-4eea-b8cc-22a94f3b82e9)
                                   AWS CDK Serverless Microservices Architecture



## Tools
You will need the following tools:

* Terraform
* AWS Account and User
* AWS CLI
* NodeJS Typescript
* AWS CDK Toolkit
* Docker
* CDKT
* Kafka
* Postman

## Useful commands
npm run build compile typescript to js
npm run watch watch for changes and compile
npm run test perform the jest unit tests
cdk deploy deploy this stack to your default AWS account/region
cdk diff compare deployed stack with current state
cdk synth emits the synthesized CloudFormation template

## Deploy to AWS 

1. npm run build
2. cdk diff
3. Bootstrap
- export CDK_NEW_BOOTSTRAP=1
- npx cdk bootstrap --trust=604020082473 aws://604020082473/ap-southeast-1 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://604020082473/ap-southeast-1 --verbose --profile=default
  
3. cdk synth

4. cdk deploy 

 - npx cdk deploy --force --require-approval never --method=direct  --no-previous-parameters --profile=default --verbose

 - npx cdk deploy --require-approval never --method=direct  --no-previous-parameters --profile=default --verbose --outputs-file ./cdk-outputs.json

# You can also install modules individually

npm install --save @aws-cdk/aws-apigateway
npm install --save  @aws-cdk/aws-lambda
npm install --save  @aws-cdk/aws-dynamodb

## AWS Codepipeline
![image](https://github.com/joelwembo/aws-cdk-infra-poc-1/assets/19718580/d97d25fc-76f1-4804-be0f-ea95a9d2a7fc)


- Create Github access token with permissions level ( Admin, webhooks, code editions,...)
- add the github access token to aws secret manager with same name
   - Settings --> Developer Settings -> Personal access tokens --> Fine-grained tokens
- Create Github AWS Environment Secrets  
      - Github --> Settings --> Actions --> new env

## Event Bridge
![image](https://github.com/joelwembo/aws-cdk-infra-poc-1/assets/19718580/883f86d5-a6e3-4330-b2de-c7704341d624)

# For RDS and API Gateway
 Create RDS Role by creating secret keys

# Get API gateway

aws apigateway get-api-key --api-key API_KEY_ID --include-value

# OutPut Report / Result

✨  Deployment time: 96.82s

Outputs: AwsCloudappStack

- AwsCloudappStack.ApiGatewaybasketApiEndpointEA878E69 = https://u1jtnat30j.execute-api.ap-southeast-1.amazonaws.com/prod/

- AwsCloudappStack.ApiGatewayorderApiEndpointAA9C4874 = https://rjx12rx44h.execute-api.ap-southeast-1.amazonaws.com/prod/

- AwsCloudappStack.ApiGatewayproductApiEndpoint84A1AEAC = https://6ajn8nqb08.execute-api.ap-southeast-1.amazonaws.com/prod/

Stack ARN:
arn:aws:cloudformation:ap-southeast-1:604020082473:stack/AwsCloudappStack/f5adca00-61e0-11ee-a748-028014dc3484

✨  Total time: 137.35s

# Fore more information Read:
 
- How to Setup SAM & Cloud Formation : https://medium.com/@joelotepawembo/how-to-build-lambda-based-rest-api-entirely-through-code-api-gateway-sam-terraform-b9c83d76ea1c
- AWS CDK Restful APIs with Typescript API Gateway DynamoDB: https://medium.com/@joelotepawembo/how-to-build-lambda-based-rest-api-entirely-through-code-api-gateway-sam-terraform-b9c83d76ea1c
 
 - Author : JOEL O. WEMBO
- Linkedin: https://www.linkedin.com/in/joelotepawembo/
- Twitter: https://twitter.com/joelwembo1
- Website: https://joelwembo.com



