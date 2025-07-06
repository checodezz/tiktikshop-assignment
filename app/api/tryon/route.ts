import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userImage, clothingId, clothingImage, clothingData } =
      await request.json();

    // Validate required fields
    if (!userImage || !clothingImage) {
      return NextResponse.json(
        { error: "User image and clothing image are required" },
        { status: 400 }
      );
    }

    // Check for Fashn.ai API key
    const fashnApiKey = process.env.FASHN_API_KEY;
    if (!fashnApiKey) {
      console.error("FASHN_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "API configuration error. Please contact support." },
        { status: 500 }
      );
    }

    console.log("Starting virtual try-on process with Fashn.ai...");

    // Prepare the request payload for Fashn.ai
    const fashnPayload = {
      model_name: "tryon-v1.6",
      inputs: {
        model_image: userImage,
        garment_image: clothingImage,
      },
    };

    console.log("Try-on payload to Fashn.ai:", fashnPayload);

    // Start the virtual try-on job
    const fashnResponse = await fetch("https://api.fashn.ai/v1/run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${fashnApiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "VirtualTryOn/1.0",
      },
      body: JSON.stringify(fashnPayload),
    });

    if (!fashnResponse.ok) {
      const errorData = await fashnResponse.text();
      console.error("Fashn.ai API error:", {
        status: fashnResponse.status,
        statusText: fashnResponse.statusText,
        error: errorData,
      });

      // Handle specific error cases
      if (fashnResponse.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key. Please check your Fashn.ai configuration." },
          { status: 401 }
        );
      } else if (fashnResponse.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      } else if (fashnResponse.status === 402) {
        return NextResponse.json(
          { error: "Insufficient credits. Please check your Fashn.ai balance." },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { error: "Virtual try-on processing failed. Please try again." },
        { status: 500 }
      );
    }

    const result = await fashnResponse.json();
    console.log("Fashn.ai API response:", result);

    const jobId = result.job_id || result.id;
    if (!jobId) {
      return NextResponse.json(
        { error: "No job ID returned from Fashn API." },
        { status: 500 }
      );
    }

    // Polling the status endpoint until completed
    let outputUrl: string | null = null;
    let status: string | null = null;
    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 seconds
      const statusResponse = await fetch(
        `https://api.fashn.ai/v1/status/${jobId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${fashnApiKey}`,
          },
        }
      );

      if (!statusResponse.ok) {
        console.error(
          `Polling failed with status ${statusResponse.status}`,
          await statusResponse.text()
        );
        break;
      }

      const statusResult = await statusResponse.json();
      status = statusResult.status;
      console.log(`Polling attempt ${retries + 1}: status=${status}`);

      if (status === "completed" && statusResult.output?.[0]) {
        outputUrl = statusResult.output[0];
        break;
      }

      retries++;
    }

    if (outputUrl) {
      return NextResponse.json({
        success: true,
        result_image: outputUrl,
        fashn_job_id: jobId,
      });
    } else {
      return NextResponse.json(
        {
          error: "Timed out waiting for virtual try-on to complete.",
          fashn_job_id: jobId,
        },
        { status: 504 }
      );
    }
  } catch (error) {
    console.error("Try-on API error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error:
            "Network error. Please check your internet connection and try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during try-on processing." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const fashnApiKey = process.env.FASHN_API_KEY;

  if (!fashnApiKey) {
    return NextResponse.json({
      status: "error",
      message: "FASHN_API_KEY not configured",
      configured: false,
    });
  }

  try {
    const response = await fetch("https://api.fashn.ai/v1/status", {
      headers: {
        Authorization: `Bearer ${fashnApiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: "success",
        message: "Fashn.ai API is accessible",
        configured: true,
        api_status: data,
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: "Fashn.ai API is not accessible",
        configured: true,
        http_status: response.status,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to connect to Fashn.ai API",
      configured: true,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
