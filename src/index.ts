export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {
    try {
      // Parse the incoming request body for the prompt
      const requestBody = await request.json();
      const { prompt } = requestBody;

      // Check if a prompt is provided, return an error if not
      if (!prompt) {
        return new Response("No prompt provided", { status: 400 });
      }

      // Run the AI model with the prompt
      const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
        prompt: prompt, // Pass the provided prompt
      });

      // Ensure the response contains the image field
      if (!response.image) {
        return new Response("Image not generated", { status: 500 });
      }

      // Decode the base64 image string to binary
      const binaryString = atob(response.image); 
      const img = Uint8Array.from(binaryString, (m) => m.codePointAt(0));

      // Return the image as a JPEG response
      return new Response(img.buffer, {
        headers: {
          'Content-Type': 'image/jpeg', // Ensure the correct content type for JPEG
        },
      });

    } catch (error) {
      console.error("Error generating image:", error);
      return new Response("Internal server error", { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
