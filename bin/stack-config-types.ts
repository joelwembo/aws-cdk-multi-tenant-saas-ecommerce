import { StackProps } from 'aws-cdk-lib';

export interface ICdkTsApiGatewayStackProps extends StackProps {
  lambda: {
    name: string,
    desc: string,
    memory: number,
    timeout: number,
  },
  api: {
    name: string,
    desc: string,
    modelName: string,
    rootResource: string,
  },
  usageplan: {
    name: string,
    desc: string,
    limit: number,
    rateLimit: number,
    burstLimit: number
  },
  apiKey: {
    name: string,
    desc: string,
  },
  validators: {
    bodyValidator: IValidators,
    paramValidator: IValidators,
    bodyAndParamValidator: IValidators,
  }
}

export interface IValidators {
    requestValidatorName:string,
    validateRequestBody: boolean,
    validateRequestParameters: boolean
}