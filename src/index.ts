export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {
    // Parse the incoming request JSON to extract the prompt
    const { prompt } = await request.json();

    // Prepare the inputs for the AI model, including the dynamically received prompt
    const inputs = {
      prompt: prompt || "default prompt",  // Use the received prompt or a default one if not provided
    };

    // Run the AI model with the given inputs
    const response = await env.AI.run(
      "@cf/lykon/dreamshaper-8-lcm",
      inputs
    );

    // Return the generated image in the response
    return new Response(response, {
      headers: {
        "content-type": "image/jpg",  // Set the content type as image/jpg
      },
    });
  },
} satisfies ExportedHandler<Env>;
