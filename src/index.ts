export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {

    // Define the prompt and guidance parameter to generate the image
    const inputs = {
      prompt: "cyberpunk cat",
      guidance_scale: 7.5,  // Add the guidance parameter with a value of 7.5
    };

    // Run the AI model with the inputs
    const response = await env.AI.run(
      "@cf/lykon/dreamshaper-8-lcm",  // Specify the model
      inputs
    );

    // Assuming the response contains image data, return it as a JPEG
    const imgBuffer = Buffer.from(response.image, 'base64');  // Convert base64 to buffer

    // Return the image in the response with the appropriate content type
    return new Response(imgBuffer, {
      headers: {
        "content-type": "image/jpg",
      },
    });
  },
} satisfies ExportedHandler<Env>;
