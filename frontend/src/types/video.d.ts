export interface VideoFormat {
  format_id: string;
  extension: string;
  resolution: string;
  note: string;
  filesize: number | null;
  url: string;
  has_video: boolean;
  has_audio: boolean;
}

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  formats: VideoFormat[];
  raw_url: string;
}
