import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ICdkTsApiGatewayStackProps, IValidators } from '../bin/stack-config-types';

export class CdkTsApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ICdkTsApiGatewayStackProps) {
    super(scope, id, props);

    // Lambda for resolving API requests
    const resolver = new lambda.Function(this, 'LambdaResolver', {
      functionName: props.lambda.name,
      description: props.lambda.desc,
      handler: 'index.handler',
      code: new lambda.AssetCode('dist/src'),
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: props.lambda.memory,
      timeout: cdk.Duration.seconds(props.lambda.timeout),
    });

    const integration = new apigateway.LambdaIntegration(resolver);

    // API Gateway RestApi
    const api = new apigateway.RestApi(this, 'RestAPI', {
      restApiName: props.api.name,
      description: props.api.desc,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PATCH', 'DELETE']
      },
    });
    
    // Request Validators
    const createValidator = (input: IValidators) => new apigateway.RequestValidator(
      this,
      input.requestValidatorName,
      {
        restApi: api,
        requestValidatorName: input.requestValidatorName,
        validateRequestBody: input.validateRequestBody,
        validateRequestParameters: input.validateRequestParameters,
      },
    );

    const bodyValidator = createValidator(props.validators.bodyValidator);
    const paramValidator = createValidator(props.validators.paramValidator);
    const bodyAndParamValidator = createValidator(props.validators.bodyAndParamValidator);

    // API Gateway Model
    const model = new apigateway.Model(this, 'Model', {
      modelName: props.api.modelName,
      restApi: api,
      schema: {
        type: apigateway.JsonSchemaType.OBJECT,
        required: ['name'],
        properties: {
          name: { type: apigateway.JsonSchemaType.STRING },
        },
      },
    });

    // Root Resources
    const rootResource = api.root.addResource(props.api.rootResource);

    // Open Resource and Methods
    const openResource = rootResource.addResource('open');

    ['GET', 'POST', 'PATCH', 'DELETE'].map((method) => {
      openResource.addMethod(method, integration, {
        operationName: `${method} Open Resource`,
      });
    });

    // Secure Resources and Methods
    const secureResource = rootResource.addResource('secure');
    const paramResource = secureResource.addResource('{param}');

    secureResource.addMethod('GET', integration, {
      operationName: 'Get Secure Resource',
      apiKeyRequired: true,
    });

    secureResource.addMethod('POST', integration, {
      operationName: 'POST Secure Resource',
      apiKeyRequired: true,
      requestValidator: bodyValidator,
      requestModels: { 'application/json': model },
    });

    ['GET', 'DELETE'].map((method) => {
      paramResource.addMethod(method, integration, {
        operationName: `${method} Secure Param Resource`,
        apiKeyRequired: true,
        requestValidator: paramValidator,
        requestParameters: { 'method.request.path.param': true },
      });
    });

    paramResource.addMethod('PATCH', integration, {
      operationName: 'PATCH Secure Param Resource',
      apiKeyRequired: true,
      requestValidator: bodyAndParamValidator,
      requestParameters: { 'method.request.path.param': true },
      requestModels: { 'application/json': model },
    });

    // API Usageplan
    const usageplan = api.addUsagePlan('UsagePlan', {
      name: props.usageplan.name,
      description: props.usageplan.desc,
      apiStages: [{
        api: api,
        stage: api.deploymentStage,
      }],
      quota: {
        limit: props.usageplan.limit,
        period: apigateway.Period.DAY,
      },
      throttle: {
        rateLimit: props.usageplan.rateLimit,
        burstLimit: props.usageplan.burstLimit,
      },
    });

    // API Key for authorization
    const apiKey = api.addApiKey('ApiKey', {
      apiKeyName: props.apiKey.name,
      description: props.apiKey.desc,
    });
    
    usageplan.addApiKey(apiKey);

    new CfnOutput(this, 'API Key ID', {
      value: apiKey.keyId,
    });
  }
}
