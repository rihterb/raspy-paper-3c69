export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {

    // Get the incoming request body
    const requestBody = await request.json();
    const { prompt } = requestBody;

    // Check if a prompt is provided, if not return an error
    if (!prompt) {
      return new Response("No prompt provided", { status: 400 });
    }

    // Example of text parsing if you need to process the Ancient Greek text specifically (you can adjust this depending on the need)
    const parsedPrompt = `Close-up view of an ancient stone tablet with Greek letters carved into it. The text on the tablet says: ${prompt}. The engraving should be realistic and historical, resembling a stone carving.`;

    const inputs = {
      prompt: parsedPrompt,
      image: null,  // Here, you could attach an image URL or binary data if you're processing images
      mask: null,   // If applicable, you could include a mask (for inpainting tasks)
    };

    try {
      // Run the AI model with the inputs
      const response = await env.AI.run(
        "@cf/runwayml/stable-diffusion-v1-5-inpainting",
        inputs
      );

      // Return the generated image as a PNG response
      return new Response(response, {
        headers: {
          "content-type": "image/png",
        },
      });

    } catch (error) {
      console.error("Error in AI generation:", error);
      return new Response("Internal server error", { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
