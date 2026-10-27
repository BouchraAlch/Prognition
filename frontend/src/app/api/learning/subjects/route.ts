import { NextResponse } from "next/server";

import {
  createSubject,
  updateSubject,
} from "@/lib/learning/subjects";

import type { SubjectStatus } from "@/lib/types/database";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "subject-images";
const DEFAULT_IMAGE = "/img2.jpg";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getExtension(file: File): string {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (
    extension &&
    ["jpg", "jpeg", "png", "webp"].includes(extension)
  ) {
    return extension;
  }

  return "jpg";
}

function validateImage(
  image: FormDataEntryValue | null
): string | null {
  if (!image) {
    return null;
  }

  if (!(image instanceof File)) {
    return "Invalid image.";
  }

  if (image.size === 0) {
    return null;
  }

  if (image.size > MAX_FILE_SIZE) {
    return "Image must be smaller than 5 MB.";
  }

  if (!ALLOWED_TYPES.includes(image.type)) {
    return "Only JPG, PNG and WebP images are allowed.";
  }

  return null;
}

/* =========================================================
   POST - CREATE SUBJECT
========================================================= */

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    /* ---------------------------------------------
       1. Check authentication
    --------------------------------------------- */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("AUTH ERROR:", authError);

      return NextResponse.json(
        { error: "Authentication failed." },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    /* ---------------------------------------------
       2. Read FormData
    --------------------------------------------- */

    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const status = formData.get("status");
    const image = formData.get("image");

    /* ---------------------------------------------
       3. Validate title
    --------------------------------------------- */

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       4. Validate image
    --------------------------------------------- */

    const imageError = validateImage(image);

    if (imageError) {
      return NextResponse.json(
        { error: imageError },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       5. Create subject first
    --------------------------------------------- */

    const subject = await createSubject({
      title: title.trim(),

      description:
        typeof description === "string"
          ? description.trim() || null
          : null,

      image: DEFAULT_IMAGE,

      gradient: null,

      status:
        typeof status === "string"
          ? (status as SubjectStatus)
          : "studying",
    });

    /* ---------------------------------------------
       6. No image selected
    --------------------------------------------- */

    if (
      !(image instanceof File) ||
      image.size === 0
    ) {
      return NextResponse.json(
        subject,
        { status: 201 }
      );
    }

    /* ---------------------------------------------
       7. Upload image
    --------------------------------------------- */

    const extension = getExtension(image);

    // Unique filename prevents the need for upsert/update.
    const uniqueId = crypto.randomUUID();

    const filePath =
      `${user.id}/${subject.id}-${uniqueId}.${extension}`;

    console.log(
      "Uploading subject image:",
      {
        bucket: BUCKET,
        filePath,
        userId: user.id,
        subjectId: subject.id,
        contentType: image.type,
      }
    );

    const {
      error: uploadError,
    } = await supabase.storage
      .from(BUCKET)
      .upload(
        filePath,
        image,
        {
          contentType: image.type,
          upsert: false,
        }
      );

    if (uploadError) {
      console.error(
        "SUPABASE STORAGE UPLOAD ERROR:",
        uploadError
      );

      // Remove subject if image upload fails.
      await supabase
        .from("subjects")
        .delete()
        .eq("id", subject.id);

      return NextResponse.json(
        {
          error:
            `Storage upload failed: ${uploadError.message}`,
          details: uploadError,
        },
        { status: 500 }
      );
    }

    /* ---------------------------------------------
       8. Get public image URL
    --------------------------------------------- */

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    const imageUrl =
      publicUrlData.publicUrl;

    console.log(
      "Subject image URL:",
      imageUrl
    );

    /* ---------------------------------------------
       9. Save image URL
    --------------------------------------------- */

    const {
      data: updatedSubject,
      error: updateError,
    } = await supabase
      .from("subjects")
      .update({
        image: imageUrl,
      })
      .eq("id", subject.id)
      .select()
      .single();

    if (updateError) {
      console.error(
        "SUBJECT IMAGE URL UPDATE ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            `Failed to save image URL: ${updateError.message}`,
        },
        { status: 500 }
      );
    }

    /* ---------------------------------------------
       10. Return final subject
    --------------------------------------------- */

    return NextResponse.json(
      updatedSubject,
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "CREATE SUBJECT ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/* =========================================================
   PATCH - UPDATE SUBJECT
========================================================= */

export async function PATCH(request: Request) {
  try {
    const supabase =
      await createSupabaseServerClient();

    /* ---------------------------------------------
       1. Check authentication
    --------------------------------------------- */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error(
        "AUTH ERROR:",
        authError
      );

      return NextResponse.json(
        { error: "Authentication failed." },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    /* ---------------------------------------------
       2. Read FormData
    --------------------------------------------- */

    const formData =
      await request.formData();

    const id =
      formData.get("id");

    const title =
      formData.get("title");

    const description =
      formData.get("description");

    const status =
      formData.get("status");

    const image =
      formData.get("image");

    /* ---------------------------------------------
       3. Validate ID
    --------------------------------------------- */

    if (
      typeof id !== "string" ||
      !id
    ) {
      return NextResponse.json(
        { error: "Subject ID is required." },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       4. Validate title
    --------------------------------------------- */

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       5. Validate image
    --------------------------------------------- */

    const imageError =
      validateImage(image);

    if (imageError) {
      return NextResponse.json(
        { error: imageError },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       6. Get existing subject
    --------------------------------------------- */

    const {
      data: currentSubject,
      error: currentError,
    } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (currentError) {
      console.error(
        "GET SUBJECT ERROR:",
        currentError
      );

      return NextResponse.json(
        {
          error:
            currentError.message,
        },
        { status: 500 }
      );
    }

    if (!currentSubject) {
      return NextResponse.json(
        { error: "Subject not found." },
        { status: 404 }
      );
    }

    /* ---------------------------------------------
       7. Keep current image by default
    --------------------------------------------- */

    let imageUrl =
      currentSubject.image ||
      DEFAULT_IMAGE;

    /* ---------------------------------------------
       8. Upload replacement image
    --------------------------------------------- */

    if (
      image instanceof File &&
      image.size > 0
    ) {
      const extension =
        getExtension(image);

      // Generate a unique filename.
      // This means we never need upsert/update.
      const uniqueId =
        crypto.randomUUID();

      const filePath =
        `${user.id}/${id}-${uniqueId}.${extension}`;

      console.log(
        "Uploading replacement image:",
        {
          bucket: BUCKET,
          filePath,
          userId: user.id,
          subjectId: id,
          contentType: image.type,
        }
      );

      const {
        error: uploadError,
      } = await supabase.storage
        .from(BUCKET)
        .upload(
          filePath,
          image,
          {
            contentType: image.type,
            upsert: false,
          }
        );

      if (uploadError) {
        console.error(
          "SUPABASE STORAGE UPLOAD ERROR:",
          uploadError
        );

        return NextResponse.json(
          {
            error:
              `Storage upload failed: ${uploadError.message}`,
            details: uploadError,
          },
          { status: 500 }
        );
      }

      /* ---------------------------------------------
         Get new public URL
      --------------------------------------------- */

      const {
        data: publicUrlData,
      } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      imageUrl =
        publicUrlData.publicUrl;

      console.log(
        "New subject image URL:",
        imageUrl
      );
    }

    /* ---------------------------------------------
       9. Update subject
    --------------------------------------------- */

    const subject =
      await updateSubject({
        id,

        title:
          title.trim(),

        description:
          typeof description === "string"
            ? description.trim() || null
            : null,

        image: imageUrl,

        gradient: null,

        status:
          typeof status === "string"
            ? (status as SubjectStatus)
            : "studying",
      });

    /* ---------------------------------------------
       10. Return updated subject
    --------------------------------------------- */

    return NextResponse.json(
      subject
    );

  } catch (error) {
    console.error(
      "UPDATE SUBJECT ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE - DELETE SUBJECT
========================================================= */

export async function DELETE(request: Request) {
  try {
    const supabase =
      await createSupabaseServerClient();

    /* ---------------------------------------------
       1. Check authentication
    --------------------------------------------- */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error(
        "AUTH ERROR:",
        authError
      );

      return NextResponse.json(
        { error: "Authentication failed." },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    /* ---------------------------------------------
       2. Read request body
    --------------------------------------------- */

    const body =
      await request.json();

    const id =
      body?.id;

    if (
      typeof id !== "string" ||
      !id
    ) {
      return NextResponse.json(
        { error: "Subject ID is required." },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       3. Get subject belonging to user
    --------------------------------------------- */

    const {
      data: subject,
      error: subjectError,
    } = await supabase
      .from("subjects")
      .select("id, user_id, image")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (subjectError) {
      console.error(
        "GET SUBJECT FOR DELETE ERROR:",
        subjectError
      );

      return NextResponse.json(
        {
          error:
            subjectError.message,
        },
        { status: 500 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found." },
        { status: 404 }
      );
    }

    /* ---------------------------------------------
       4. Delete subject
    --------------------------------------------- */

    const {
      error: deleteError,
    } = await supabase
      .from("subjects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error(
        "DELETE SUBJECT ERROR:",
        deleteError
      );

      return NextResponse.json(
        {
          error:
            deleteError.message,
        },
        { status: 500 }
      );
    }

    /* ---------------------------------------------
       5. Delete associated Storage files
    --------------------------------------------- */

    const {
      data: files,
      error: listError,
    } = await supabase.storage
      .from(BUCKET)
      .list(user.id);

    if (listError) {
      console.error(
        "STORAGE LIST ERROR:",
        listError
      );
    }

    if (files) {
      const subjectFiles =
        files
          .filter((file) =>
            file.name.startsWith(`${id}-`)
          )
          .map(
            (file) =>
              `${user.id}/${file.name}`
          );

      if (
        subjectFiles.length > 0
      ) {
        const {
          error: storageDeleteError,
        } = await supabase.storage
          .from(BUCKET)
          .remove(subjectFiles);

        if (storageDeleteError) {
          console.error(
            "STORAGE DELETE ERROR:",
            storageDeleteError
          );
        }
      }
    }

    /* ---------------------------------------------
       6. Done
    --------------------------------------------- */

    return NextResponse.json({
      ok: true,
    });

  } catch (error) {
    console.error(
      "DELETE SUBJECT ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}