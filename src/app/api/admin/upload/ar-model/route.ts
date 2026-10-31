import { NextResponse } from "next/server";
import { AR_MODEL_EXTENSION, AR_MODEL_MAX_MB } from "@/config/arModels";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { uploadArModel } from "@/lib/cloudinary";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const file = (await request.formData()).get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(AR_MODEL_EXTENSION)) {
    return NextResponse.json({ error: `Please upload a ${AR_MODEL_EXTENSION} file.` }, { status: 400 });
  }

  if (file.size > AR_MODEL_MAX_MB * 1024 * 1024) {
    return NextResponse.json({ error: `AR models must be ${AR_MODEL_MAX_MB} MB or smaller.` }, { status: 400 });
  }

  try {
    const url = await uploadArModel(file);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
