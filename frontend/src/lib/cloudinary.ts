/**
 * Uploads an audio blob to Cloudinary using unsigned upload
 * @param audioBlob - The audio blob to upload
 * @returns Promise with the secure URL of the uploaded audio
 */
export async function uploadAudioToCloudinary(
  audioBlob: Blob,
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration is missing");
  }

  const formData = new FormData();
  formData.append("file", audioBlob);
  formData.append("upload_preset", uploadPreset);
  formData.append("resource_type", "auto");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}
