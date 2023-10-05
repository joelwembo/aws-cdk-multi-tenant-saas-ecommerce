import { StackProps } from 'aws-cdk-lib';

export interface IAwsCdkCodepipelineStackProps extends StackProps {
  role: {
    name: string,
    description: string,
    managedPolicy: string,
  },
  keyDescription: string,
  github: {
    tokenSecretName: string,
    owner: string,
    repo: string,
    branch: string,
  },
  codebuild: {
    templateProject: string,
    lambdaProject: string,
    targetStack: string,
    targetLambda: string,
  },
  pipelineName: string,
  bucketName: string,
  topic: {
    name: string,
    subEmails: string[],
  },
}