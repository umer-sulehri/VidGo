import DownloaderForm from "@/components/DownloaderForm";
import { Code, Globe, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12 md:py-24 max-w-7xl mx-auto space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-bounce-subtle">
          <Zap className="w-4 h-4" />
          Ultra Fast & Secure Downloads
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Download Any Video <br />
          <span className="gradient-text">In Seconds.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The ultimate high-speed video downloader. Paste your URL below to get started. Supporting YouTube, Vimeo, Instagram, and 1000+ more sites.
        </p>
      </section>

      {/* Downloader Form */}
      <DownloaderForm />

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Shield className="w-10 h-10 text-blue-500" />,
            title: "Safe & Secure",
            desc: "Zero tracking, zero malware. Your privacy is our top priority."
          },
          {
            icon: <Zap className="w-10 h-10 text-indigo-500" />,
            title: "Lightning Fast",
            desc: "Optimized servers for the fastest possible extraction and download."
          },
          {
            icon: <Globe className="w-10 h-10 text-purple-500" />,
            title: "1000+ Sites",
            desc: "Full support for all major social media and video hosting platforms."
          }
        ].map((feature, i) => (
          <div key={i} className="p-8 glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <div className="mb-6">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="pt-24 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">V</div>
          <span className="font-bold text-xl">VidGo</span>
        </div>
        <p className="text-gray-500 text-sm flex items-center gap-4">
          Built with Next.js & Laravel • © 2026
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="p-2 hover:text-blue-500 transition-colors"><Code className="w-5 h-5" /></a>
          <a href="#" className="p-2 hover:text-blue-500 transition-colors"><Globe className="w-5 h-5" /></a>
        </div>
      </footer>
    </main>
  );
}
