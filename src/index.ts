import { APIGatewayEvent } from 'aws-lambda';

const createResponse = (code:number, body: any) => {
    return {
        statusCode: code,
        headers: { 'Content-Type': 'application/json'},
        isBase64Encoded: false,
        body: JSON.stringify(body),
    };
}

export const handler = async (event:APIGatewayEvent) => {
    const { resource, httpMethod, pathParameters, body } = event;
    
    const getNameFromBody = () => {
        const parsedBody = JSON.parse(body as string);
        return parsedBody.name;
    }

    const getParam = () => {
        if(pathParameters?.param) return pathParameters?.param;
        return false;
    }

    switch (resource) {
        case '/v1/open': { 
            return createResponse(200, { result: `${httpMethod} on open resource was successful!`});
        }

        case '/v1/secure': { 
            if ( httpMethod === 'POST') {
                const name = getNameFromBody();
                return createResponse(200, { result: `${httpMethod} on secure resource with name: ${name} was successful!`});
            }
            return createResponse(200, { result: `${httpMethod} on secure resource was successful!`});
        }

        case '/v1/secure/{param}': {
            if ( httpMethod === 'PATCH') {
                const param = getParam();
                const name = getNameFromBody();
                return createResponse(200, { result: `${httpMethod} on secure resource with param: ${param} and name: ${name} was successful!`});
            }
            const param = getParam();
            return createResponse(200, { result: `${httpMethod} on secure resource with param: ${param} was successful!`});
        }

        default : {
            return createResponse(500, { result: 'Error: Resource was not found!'});
        }
    }
};