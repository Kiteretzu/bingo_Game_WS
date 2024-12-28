import React, { useRef, useState, useEffect } from 'react';

const Messages: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // Function to delay video reset and play again
  const handleVideoEnd = () => {
    if (videoRef.current) {
      setIsVideoPlaying(false);
      // Set delay before restarting video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0; // Reset video to start
          videoRef.current.play(); // Play video again
          setIsVideoPlaying(true);
        }
      }, 3000); // 3-second delay before restarting
    }
  };

  return (
    <div className="relative text-4xl m-4 text-center flex items-center justify-center">
      {/* Video Background with Animation Delay */}
      <div className="relative w-24 h-24 overflow-hidden animate-bounce duration-1000">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          id="myVideo"
          className="object-cover absolute top-0 left-0 w-full h-full"
          onEnded={handleVideoEnd} // Trigger when video ends
        >
          <source src="/output.webm" type="video/webm" />
          <source src="/happy.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Text content */}
      <div className="relative z-10 text-white">
        <p>Wait for your turn</p>
      </div>
    </div>
  );
};

export default Messages;