"use client";

import { useState } from "react";
import { Search, Download, CheckCircle, AlertCircle, Loader2, Play } from "lucide-react";
import { extractMetadata, downloadVideo } from "@/lib/api";
import { VideoMetadata } from "@/types/video";

export default function DownloaderForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setMetadata(null);

    try {
      const data = await extractMetadata(url);
      setMetadata(data);
    } catch (err: any) {
      setError(err.message || "Failed to extract video. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Search Input */}
      <form onSubmit={handleExtract} className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste video URL here (YouTube, Vimeo, etc.)"
          className="w-full pl-14 pr-36 py-5 bg-white/5 border border-white/10 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 top-3 bottom-3 px-8 rounded-xl gradient-btn text-white font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group-hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Extract</span>
            </>
          )}
        </button>
      </form>

      {/* Loading Overlay for the whole area when fetching */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-20 glass-card border-dashed border-white/20 animate-pulse">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h3 className="text-xl font-medium">Analyzing Video...</h3>
          <p className="text-gray-500 mt-2">This usually takes 2-5 seconds depending on the site.</p>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Video Preview & Formats */}
      {metadata && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6">
            <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass-card">
              <img
                src={metadata.thumbnail}
                alt={metadata.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                  <Play className="w-3 h-3 fill-current" />
                  {Math.floor(metadata.duration / 60)}:{(metadata.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold leading-tight text-white tracking-tight">{metadata.title}</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">{metadata.uploader}</span>
                <span>•</span>
                <span>{metadata.formats.length} Quality options available</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Download className="w-6 h-6 text-blue-500" />
                Select Quality
              </h3>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-4 pb-4">
              {metadata.formats.sort((a,b) => parseInt(b.resolution) - parseInt(a.resolution)).map((format, idx) => (
                <div
                  key={idx}
                  className="p-5 glass-card border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex items-center justify-between group cursor-pointer"
                  onClick={() => downloadVideo(format.url, metadata.title, format.extension)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs ${
                      idx === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400'
                    }`}>
                      {format.resolution === '0p' ? 'Audio' : format.resolution}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                        {format.extension.toUpperCase()} {format.resolution !== '0p' ? `• ${format.resolution}` : ''}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        {format.note || "Standard Quality"} 
                        {format.filesize ? ` • ${(format.filesize / (1024 * 1024)).toFixed(1)} MB` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all transform group-active:scale-90"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
