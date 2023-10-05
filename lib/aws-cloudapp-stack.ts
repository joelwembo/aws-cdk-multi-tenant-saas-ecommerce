import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cr from 'aws-cdk-lib/custom-resources';

import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnApiGateway } from './apigateway';
import { SwnDatabase } from './database';
import { SwnEventBus } from './eventbus';
import { SwnMicroservices } from './microservice';
import { SwnQueue } from './queue';


export class AwsCloudappStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    
    super(scope, id, props);

     // VPC and RDS Postgres Provisionning
     // VPC for RDS and Lambda resolvers
     const vpc = new ec2.Vpc(this, 'VPC', {
      vpcName: 'rds-vpc',
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
          name: 'rds'
        }
      ]
    })

    // Security Groups
    const securityGroupResolvers = new ec2.SecurityGroup(this, 'SecurityGroupResolvers', {
      vpc,
      securityGroupName: 'resolvers-sg',
      description: 'Security Group with Resolvers',
    })
    const securityGroupRds = new ec2.SecurityGroup(this, 'SecurityGroupRds', {
      vpc,
      securityGroupName: 'rds-sg',
      description: 'Security Group with RDS',
    })

    // Ingress and Egress Rules
    securityGroupRds.addIngressRule(
      securityGroupResolvers,
      ec2.Port.tcp(5432),
      'Allow inbound traffic to RDS'
    )
    
    // VPC Interfaces
    vpc.addInterfaceEndpoint('LAMBDA', {
      service: ec2.InterfaceVpcEndpointAwsService.LAMBDA,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [securityGroupResolvers],
    })
    vpc.addInterfaceEndpoint('SECRETS_MANAGER', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [securityGroupResolvers],
    })    

    // IAM Role
    const role = new iam.Role(this, 'Role', {
      roleName: 'MyRDS',
      description: 'Role used in the RDS stack',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('ec2.amazonaws.com'),
        new iam.ServicePrincipal('lambda.amazonaws.com'),
      )
    })
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudwatch:PutMetricData',
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeInstances",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeRouteTables",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          'lambda:InvokeFunction',
          'secretsmanager:GetSecretValue',
          'kms:decrypt',
          'rds-db:connect'
        ],
        resources: ['*']
      })
    )

    // RDS PostgreSQL Instance
    const rdsInstance = new rds.DatabaseInstance(this, 'PostgresRds', {
      vpc,
      securityGroups: [securityGroupRds],
      vpcSubnets: { subnets: vpc.isolatedSubnets },
      availabilityZone: vpc.isolatedSubnets[0].availabilityZone,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.SMALL),
      engine: rds.DatabaseInstanceEngine.postgres({version: rds.PostgresEngineVersion.VER_10_14}),
      port: 5432,
      instanceIdentifier: 'librarydb-instance',
      allocatedStorage: 10,
      maxAllocatedStorage: 10,
      deleteAutomatedBackups: true,
      backupRetention: cdk.Duration.millis(0),
      credentials: rds.Credentials.fromUsername('libraryadmin'),
      publiclyAccessible: false
    })
    rdsInstance.secret?.grantRead(role)

    // Secrets for database credentials.
    const credentials = secrets.Secret.fromSecretCompleteArn(this, 'CredentialsSecret' , 'arn:aws:secretsmanager:ap-southeast-1:xxxxxxxxxxxxx:secret:rds-db-creds-Zek0Nj')
    credentials.grantRead(role)

    // Returns function to connect with RDS instance.
    const createResolver = (name:string, entry:string) => new nodejs.NodejsFunction(this, name, {
      functionName: name,
      entry: entry,
      bundling: {
        externalModules: ['pg-native']
      },
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: cdk.Duration.minutes(2),
      role,
      vpc,
      vpcSubnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [ securityGroupResolvers ],
      environment: {
        RDS_ARN: rdsInstance.secret!.secretArn,
        CREDENTIALS_ARN: credentials.secretArn,
        HOST: rdsInstance.dbInstanceEndpointAddress
      }
    })

    // Instantiate new db with user and permissions also add table.
    const instantiate = createResolver('instantiate', 'src/instantiate.ts');
    instantiate.node.addDependency(rdsInstance);

      // Lambda function for adding a book in the RDS table.
      const addBook = createResolver('add-book', 'src/addBook.ts');
      addBook.node.addDependency(rdsInstance);
  
      // Lambda function for gettings books in the RDS table.
      const getBooks = createResolver('get-books', 'src/getBooks.ts');
      getBooks.node.addDependency(rdsInstance);
  
      // Custom Resource to execute instantiate function.
      const customResource = new cr.AwsCustomResource(this, 'TriggerInstantiate', {
        functionName: 'trigger-instantiate',
        role,
        onUpdate: {
          service: 'Lambda',
          action: 'invoke',
          parameters: {
            FunctionName: instantiate.functionName,
          },
          physicalResourceId: cr.PhysicalResourceId.of('TriggerInstantiate'),
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: [instantiate.functionArn],
        }),
      });
      customResource.node.addDependency(instantiate)

    // DynamoDB Database Table Provisionning
    const database = new SwnDatabase(this, 'Database');    

    const microservices = new SwnMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable
    });

    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderingMicroservices: microservices.orderingMicroservice
    });
    
    const queue = new SwnQueue(this, 'Queue', {
      consumer: microservices.orderingMicroservice
    });

    const eventbus = new SwnEventBus(this, 'EventBus', {
      publisherFuntion: microservices.basketMicroservice,
      targetQueue: queue.orderQueue   
    });   

    

  }
}
