import configPromise from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

    // Initialize payload
    const payload = await getPayload({
      config: configPromise,
    });

    // Authenticate user
    const { user } = await payload.auth({
      req: req as any,
      headers: req.headers,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await payload.sendEmail({
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Send email failed" },
      { status: 500 },
    );
  }
}
