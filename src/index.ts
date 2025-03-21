export default {
  async fetch(request, env) {
    try {
      // Ensure the request is a POST request
      if (request.method !== "POST") {
        return new Response("Only POST requests are allowed", { status: 405 });
      }

      // Parse the request body as JSON
      const requestBody = await request.json();

      // Extract the prompt from the request body
      const prompt = requestBody.prompt;

      // Check if the prompt is provided
      if (!prompt) {
        return new Response("Prompt is required", { status: 400 });
      }

      // Set up the inputs for the AI model with the dynamic prompt
      const inputs = {
        prompt: prompt,  // Use the dynamic prompt from the request
      };

      // Make the request to the AI model
      const response = await env.AI.run(
        "@cf/lykon/dreamshaper-8-lcm",
        inputs,
      );

      // Return the generated image as a response
      return new Response(response, {
        headers: {
          "content-type": "image/png",  // Image type as PNG
        },
      });

    } catch (error) {
      // Return an error response if something goes wrong
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
