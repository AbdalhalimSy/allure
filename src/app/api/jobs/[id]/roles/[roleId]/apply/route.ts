import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; roleId: string }> }
) {
  try {
    const { id, roleId } = await params;
    const formData = await request.formData();
    
    const profile_id = formData.get("profile_id");
    const responsesJson = formData.get("responses");

    if (!profile_id) {
      return NextResponse.json(
        { status: "error", message: "Profile ID is required", data: null },
        { status: 400 }
      );
    }

    if (!responsesJson) {
      return NextResponse.json(
        { status: "error", message: "Responses are required", data: null },
        { status: 400 }
      );
    }

    const responses = JSON.parse(responsesJson as string);

    // Here you would typically:
    // 1. Validate the responses
    // 2. Check if the user has already applied
    // 3. Save to database
    // 4. Send confirmation email
    // 5. Notify the casting team

    // For now, we'll return a success response
    console.log("Job Application Received:", {
      jobId: id,
      roleId: roleId,
      profileId: profile_id,
      responses: responses,
    });

    // Simulate processing
    return NextResponse.json({
      status: "success",
      message: "Your application has been submitted successfully! The casting team will review it shortly.",
      data: {
        application_id: Math.floor(Math.random() * 10000),
        job_id: Number(id),
        role_id: Number(roleId),
        profile_id: Number(profile_id),
        status: "pending",
        submitted_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to process your application. Please try again.",
        data: null,
      },
      { status: 500 }
    );
  }
}
