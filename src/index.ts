export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {
    try {
      // Parse the incoming request for the prompt (e.g., translated text)
      const { prompt } = await request.json();

      // Ensure we have a valid prompt
      if (!prompt || typeof prompt !== 'string') {
        return new Response("Invalid prompt received", { status: 400 });
      }

      // Prepare the input for the AI model, including the translated prompt
      const inputs = {
        prompt: prompt,  // The translated Ancient Greek text or whatever text you receive
        guidance_scale: 7.5,  // Guidance parameter set to 7.5
      };

      // Run the AI model with the given inputs
      const response = await env.AI.run(
        "@cf/lykon/dreamshaper-8-lcm",  // Model to use
        inputs
      );

      // Log the response for debugging
      console.log("AI Model Response:", response);

      // Assuming the response contains image data as a base64-encoded string
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
