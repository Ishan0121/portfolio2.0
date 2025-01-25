"use client";

import { useState } from "react";
import { Download, CheckCircle, Ghost } from "lucide-react";
import { Button } from "./ui/button";

type DownloadAnimationButtonProps = {
  filePath?: string; // Location of the file (default: public/files/resume.pdf)
  fileName?: string; // Name of the file after download (default: My_Resume.pdf)
  delay?: number; // Delay in ms before marking download as complete (default: 3000)
  buttonClassName?: string; // Custom button styles
  iconClassName?: string; // Custom icon styles
};

export default function DownloadAnimationButton({
  filePath = "/files/resume.pdf", // Default file location
  fileName = "My_Resume.pdf", // Default file name
  delay = 3000, // Default delay of 3 seconds
  buttonClassName = "glass",
  iconClassName = "h-5 w-5 mr-2",
}: DownloadAnimationButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    setTimeout(() => {
    // Trigger the file download after the specified delay
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mark as complete
      setIsDownloading(false);
      setDownloadDone(true);
    }, delay);
  };

  return (
    <Button
      size="lg"
      variant="ghost"
      onClick={handleDownload}
      className={buttonClassName}
      // disabled={isDownloading || downloadDone} // Disable while downloading or completed
    >
      {downloadDone ? (
        <>
          Download Started
          <CheckCircle
            className={`animate-pulse text-green-500 ${iconClassName}`}
          />
        </>
      ) : (
        <>
          {isDownloading ? "Downloading..." : "Download Resume"}
          <Download className={`${iconClassName}`} />
        </>
      )}
    </Button>
  );
}
