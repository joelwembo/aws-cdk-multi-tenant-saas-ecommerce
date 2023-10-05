import { IAwsCdkCodepipelineStackProps } from './stack-config-types';

const environmentConfig: IAwsCdkCodepipelineStackProps = {
  tags: {
    Developer: 'Joel Wembo',
    Application: 'CicdPipelineStack',
  },
  role: {
    name: 'cdk-codepipeline-ap-southeast-3c',
    description: 'IAM role for Codepipeline',
    managedPolicy: 'AdministratorAccess',
  },
  keyDescription: 'KMS key used by Codepipeline',
  github: {
    tokenSecretName: 'aws-github-token-prod',
    owner: 'joelwembo',
    repo: 'aws-cdk-infra-poc-1',
    branch: 'master',
  },
  codebuild: {
    templateProject: 'BuildTemplate',
    lambdaProject: 'BuildLambda',
    targetStack: 'CicdPipelineStack',
    targetLambda: 'index.js',
  },
  pipelineName: 'LambdaDeploymentPipeline',
  bucketName:'codepipeline-bucket-1',
  topic: {
    name: 'codepipeline-topic',
    subEmails: [],
  },
};

export default environmentConfig;