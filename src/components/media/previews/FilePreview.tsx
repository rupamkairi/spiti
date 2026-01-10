interface FilePreviewProps {
  url: string;
  name: string;
  type: string;
}

export function ImagePreview({ url, name }: FilePreviewProps) {
  return (
    <img
      src={url}
      alt={name}
      className="object-cover w-full h-full"
      loading="lazy"
    />
  );
}

export function VideoPreview({ url }: FilePreviewProps) {
  return (
    <video controls className="w-full h-full object-cover">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export function AudioPreview({ url }: FilePreviewProps) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-base-200 p-4">
      <audio controls className="w-full">
        <source src={url} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export function DefaultFilePreview({ type }: { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-base-content/50">
      <span className="text-4xl mb-2">📄</span>
      <span className="text-xs uppercase font-bold">
        {type.split("/")[1] || "FILE"}
      </span>
    </div>
  );
}
