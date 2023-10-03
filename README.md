# AWS CDK Restful APIs with Typescript API Gateway DynamoDB

## Tools
You will need the following tools:

* Terraform
* AWS Account and User
* AWS CLI
* NodeJS Typescript
* AWS CDK Toolkit
* Docker


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


 # AWS Codepipeline

- Create Github access token with permissions level ( Admin, webhooks, code editions,...)
- add the github access token to aws secret manager with same name
   - Settings --> Developer Settings -> Personal access tokens --> Fine-grained tokens
- Create Github AWS Environment Secrets  
      - Github --> Settings --> Actions --> new env


# For RDS and API Gateway
 Create RDS Role by creating secret keys

# Get API gateway

aws apigateway get-api-key --api-key API_KEY_ID --include-value

# OutPut Report / Result
   Deployment time: 185.51s

* **Product API -> https://xxx**
* **Basket API -> https://xxx.**
* **Ordering API -> https://xxx.**

# Fore more information read:
 
- How to Setup SAM & Cloud Formation : https://medium.com/@joelotepawembo/how-to-build-lambda-based-rest-api-entirely-through-code-api-gateway-sam-terraform-b9c83d76ea1c
- AWS CDK Restful APIs with Typescript API Gateway DynamoDB: https://medium.com/@joelotepawembo/how-to-build-lambda-based-rest-api-entirely-through-code-api-gateway-sam-terraform-b9c83d76ea1c
 
 - Linkedin: https://www.linkedin.com/in/joelotepawembo/
 

