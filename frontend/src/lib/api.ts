import { VideoMetadata } from "@/types/video";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function extractMetadata(url: string): Promise<VideoMetadata> {
  const response = await fetch(`${API_BASE_URL}/extract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || "Failed to extract video metadata.");
  }

  return response.json();
}

export function downloadVideo(url: string, title: string, ext: string) {
  // Use a form to submit to the backend for streaming
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${API_BASE_URL}/download`;
  form.target = "_blank";

  const urlInput = document.createElement("input");
  urlInput.type = "hidden";
  urlInput.name = "url";
  urlInput.value = url;
  form.appendChild(urlInput);

  const titleInput = document.createElement("input");
  titleInput.type = "hidden";
  titleInput.name = "title";
  titleInput.value = title;
  form.appendChild(titleInput);

  const extInput = document.createElement("input");
  extInput.type = "hidden";
  extInput.name = "ext";
  extInput.value = ext;
  form.appendChild(extInput);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
