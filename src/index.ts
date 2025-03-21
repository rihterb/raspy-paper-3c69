export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {
    try {
      // Parse the incoming request to extract the prompt (which is dynamically passed)
      const { prompt } = await request.json();

      // Ensure we have a valid prompt
      if (!prompt || typeof prompt !== 'string') {
        return new Response("Invalid prompt received", { status: 400 });
      }

      // Prepare the input for the AI model, including the dynamically received prompt
      const inputs = {
        prompt: prompt,  // The prompt from the incoming request
        guidance_scale: 7.5,  // Optional: guidance parameter set to 7.5 for more control
      };

      // Run the AI model with the given inputs
      const response = await env.AI.run(
        "@cf/lykon/dreamshaper-8-lcm",  // Model to use
        inputs
      );

      // Assuming the response contains the image data as base64
      const imgBuffer = Buffer.from(response.image, 'base64');

      // Return the image in the response
      return new Response(imgBuffer, {
        headers: {
          "content-type": "image/jpg",
        },
      });
    } catch (error) {
      console.error("Error generating image:", error);

      // If there's an error, return it as a response
      return new Response("Error generating image: " + error.message, {
        status: 500,
        headers: { "content-type": "text/plain" },
      });
    }
  },
} satisfies ExportedHandler<Env>;
