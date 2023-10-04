import { Handler } from 'aws-lambda';
import { SecretsManager } from 'aws-sdk';
import { Client } from 'pg';

const RDS_ARN = process.env.RDS_ARN!;
const CREDENTIALS_ARN = process.env.CREDENTIALS_ARN!;

const secrets = new SecretsManager();

export const handler: Handler = async () => {
    try {
      // Retrieve RDS Admin credentials
      console.log('retrieving admin credentials...');
      const adminSecret = await secrets.getSecretValue({ SecretId: RDS_ARN }).promise();
      const admin = JSON.parse(adminSecret.SecretString as string);
  
      // Retrieve RDS User credentials
      console.log('retrieving library credentials...');
      const credentialsSecret = await secrets.getSecretValue({ SecretId: CREDENTIALS_ARN }).promise();
      const credentials = JSON.parse(credentialsSecret.SecretString as string);
  
      // Instantiate RDS Client with Admin
      console.log('instantiating client with admin...');
      const client = new Client({
        host: admin.host,
        user: admin.username,
        password: admin.password,
        database: 'postgres',
        port: 5432,
      });
  
      // Connect to RDS instance with Admin
      console.log('connecting to rds with admin...');
      await client.connect();
      console.log('setting up new database...');
      await client.query('CREATE DATABASE librarydb;');
      await client.query(`CREATE USER ${credentials.user} WITH PASSWORD '${credentials.password}';`);
      await client.query(`GRANT ALL PRIVILEGES ON DATABASE librarydb TO ${credentials.user};`);
      console.log('setup completed!');
      await client.end();
  
      // Instantiate RDS Client with new user
      console.log('instantiating client with new user...');
      const userClient = new Client({
        host: admin.host,
        user: credentials.user,
        password: credentials.password,
        database: 'librarydb',
        port: 5432,
      });

      // Connect to RDS instance
      console.log('connecting to rds with new user...');
      await userClient.connect();
      console.log('creating new table...');
      const createTableCommand = [
        'CREATE TABLE library (',
        'isbn VARCHAR(50) UNIQUE NOT NULL, ',
        'name VARCHAR(50) NOT NULL, ',
        'authors VARCHAR(50)[] NOT NULL, ',
        'languages VARCHAR(50)[] NOT NULL, ',
        'countries VARCHAR(50)[] NOT NULL, ',
        'numberOfPages integer, ',
        'releaseDate VARCHAR(50) NOT NULL);',
      ]
      await userClient.query(createTableCommand.join(''))
      console.log('tasks completed!');
      await userClient.end();

    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  };