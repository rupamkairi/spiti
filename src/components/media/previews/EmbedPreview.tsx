interface EmbedPreviewProps {
  url: string;
  type: string; // 'link/youtube', 'link/instagram', etc.
}

export function EmbedPreview({ url, type }: EmbedPreviewProps) {
  if (type === "link/youtube") {
    // Extract video ID (basic implementation)
    // Supports: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
    let videoId = "";
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop() || "";
      }
    } catch (e) {
      console.error("Invalid YouTube URL", e);
    }

    if (!videoId) return <div className="p-4 text-error">Invalid YouTube Link</div>;

    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (type === "link/instagram") {
      // Instagram embeds are tricky without an API or library like react-instagram-embed
      // For now, we'll link to it or try a simple iframe if possible (often blocked by CORS/Frame options)
      // A safe fallback is a card linking to the post.
      return (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-tr from-yellow-400 to-purple-600 text-white p-4 text-center">
              <span className="text-2xl font-bold mb-2">Instagram</span>
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-white text-black">
                  View Post ↗
              </a>
          </div>
      )
  }

  // Fallback for generic links
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-base-200 p-4 text-center">
      <span className="text-4xl mb-2">🔗</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="link link-primary text-xs break-all"
      >
        {url}
      </a>
    </div>
  );
}
