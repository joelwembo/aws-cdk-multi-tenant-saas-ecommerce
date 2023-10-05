export const handler = async (event: { name: any; }) => {
    const result = event.name ? `Good Job Joel` : 'Good Job joel'
    
    return {
        statusCode: 200,
        body: JSON.stringify({
         result
        }),
      };
}
