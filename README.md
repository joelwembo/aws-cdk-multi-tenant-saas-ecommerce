# AWS CDK Multi-Tenant SaaS E-Commerce Application  using API Gateway, Lambda, RDS PostgreSQL, DynamoDB, VPC, Codepipeline and Terraform

This Proof of Concept is about a multi tenant microservices ecommerce application using AWS CDK  Infrastructure  with Terraform , CloudFormation, VPC, Typescript, DynamoDB, PostgreSQL, AWS EventBridge,  AWS CodePipeline, AWS SQS/SNS, Kafka and API Gateway.
![architecture-1](https://github.com/joelwembo/aws-cdk-infra-poc-1/assets/19718580/ccb09c1a-5cec-4eea-b8cc-22a94f3b82e9)
                                   AWS CDK Serverless Microservices Architecture

## Tools
You will need the following tools:

* Terraform
* AWS Account and User
* AWS CLI
* AWS SAM
* Git
* NodeJS Typescript
* AWS CDK Toolkit 
* Docker
* CDKT
* Kafka
* Postman

## Useful commands
- npm run build compile typescript to js
- npm run watch watch for changes and compile
- npm run test perform the jest unit tests
- cdk deploy deploy this stack to your default AWS account/region
- cdk diff compare deployed stack with current state
- cdk synth emits the synthesized CloudFormation template

## Deploy to AWS 

1. npm run build
2. cdk diff
3. Bootstrap
- export CDK_NEW_BOOTSTRAP=1
- npx cdk bootstrap --trust=xxxxxxxxxx aws://xxxxxxxxxx/ap-southeast-1 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://xxxxxxxxxx/ap-southeast-1 --verbose --profile=default
  
3. cdk synth

4. cdk deploy 

 - npx cdk deploy --force --require-approval never --method=direct  --no-previous-parameters --profile=default --verbose

 - npx cdk deploy --require-approval never --method=direct  --no-previous-parameters --profile=default --verbose --outputs-file ./cdk-outputs.json

# You can also install modules individually

- npm install -g aws-cdk
- npm install --save @aws-cdk/aws-apigateway
- npm install --save  @aws-cdk/aws-lambda
- npm install --save  @aws-cdk/aws-dynamodb

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


## Kubernetes cluster using cdk8s
npm run compile && cdk8s synth

Synthesizing application
  - dist/kubernetes.k8s.yaml
========================================================================================================

 Your cdk8s typescript project is ready!

   cat help         Print this message

  Compile:
   npm run compile     Compile typescript code to javascript (or "yarn watch")
   npm run watch       Watch for changes and compile typescript in the background
   npm run build       Compile + synth

  Synthesize:
   npm run synth       Synthesize k8s manifests from charts to dist/ (ready for 'kubectl apply -f')

 Deploy:
   kubectl apply -f dist/

 Upgrades:
   npm run import        Import/update k8s apis (you should check-in this directory)
   npm run upgrade       Upgrade cdk8s modules to latest version
   npm run upgrade:next  Upgrade cdk8s modules to latest "@next" version (last commit)

========================================================================================================

# Fore more information Read:
 
- How to Build Lambda based REST API entirely through code — API Gateway, SAM & Terraform : https://medium.com/@joelotepawembo/how-to-build-lambda-based-rest-api-entirely-through-code-api-gateway-sam-terraform-b9c83d76ea1c

- AWS CDK multi-tenant SaaS application using API Gateway, Lambda, DynamoDB and Codepipeline: https://medium.com/@joelotepawembo/aws-cdk-restful-apis-using-api-gateway-lambda-rds-postgresql-dynamodb-vpc-codepipeline-and-cbb61a6ee0b3