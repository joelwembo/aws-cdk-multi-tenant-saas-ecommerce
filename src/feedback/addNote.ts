import { Handler } from 'aws-lambda';
import { SecretsManager } from 'aws-sdk';
import { Client } from 'pg';

const CREDENTIALS_ARN = process.env.CREDENTIALS_ARN!;
const HOST = process.env.HOST!;

const secrets = new SecretsManager();

interface IAddEvent {
  isbn: string,
  name: string,
  authors: string[],
  languages: string[],
  countries: string[],
  numberOfPages: number,
  releaseDate: string,
}

export const handler: Handler = async (event:IAddEvent) => {
    try {
      // Retrieve RDS User credentials
      console.log('retrieving library credentials...');
      const credentialsSecret = await secrets.getSecretValue({ SecretId: CREDENTIALS_ARN }).promise();
      const credentials = JSON.parse(credentialsSecret.SecretString as string);
  
      // Instantiate RDS Client
      console.log('instantiating rds client...');
      const client = new Client({
        host: HOST,
        user: credentials.user,
        password: credentials.password,
        database: 'librarydb',
        port: 5432,
      });
  
      // Connect to RDS instance
      console.log('connecting to rds...');
      await client.connect();

      console.log('adding book...');
      await client.query(`INSERT INTO library (isbn, name, authors, languages, countries, numberOfPages, releaseDate) VALUES('${
        event.isbn
      }', '${
        event.name
      }', '{${
        event.authors
      }}', '{${
        event.languages
      }}', '{${
        event.countries
      }}', '${
        event.numberOfPages
      }', '${
        event.releaseDate
      }')`);

      // Break connection
      console.log('tasks completed!');
      await client.end();
    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  };