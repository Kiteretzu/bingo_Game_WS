import useBingo from '@/hooks/useBingo';
import React, { useRef, useState, useEffect } from 'react';
import { emotes } from "@/assets/emotes";
import { motion } from 'framer-motion';

type BingoResponse = {
  response: string;
  emote: string;
};

const Messages = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [showEmote, setShowEmote] = useState<boolean>(false);
  const { response, emote }: BingoResponse = useBingo();
  const [emoteUrl, setEmoteUrl] = useState<string>("")

  console.log('This is emotes', showEmote, emote)
  // Handle new emote
  useEffect(() => {
    if (emote) {
      const emo = emotes.find((e) => e.name === emote);
      setShowEmote(true);
      setEmoteUrl(emo?.url || "");
      // Remove emote after animation
      const timer = setTimeout(() => {
        setShowEmote(false);
      }, 2000); // Match this with the total animation duration

      return () => clearTimeout(timer);
    }
  }, [emote]);

  const handleVideoEnd = () => {
    if (videoRef.current) {
      setIsVideoPlaying(false);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
          setIsVideoPlaying(true);
        }
      }, 3000);
    }
  };

  return (
    <div className="relative text-4xl m-4 text-center flex flex-col items-center justify-center">
      {/* Video Background */}
      <div className="relative w-24 h-24 overflow-hidden animate-bounce duration-1000">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          id="myVideo"
          className="object-cover absolute top-0 left-0 w-full h-full"
          onEnded={handleVideoEnd}
        >
          <source src="/output.webm" type="video/webm" />
          <source src="/happy.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Text content */}
      <div className="relative z-10 text-white">
        <p>{response}</p>
      </div>

      {/* Single Emote */}
      {showEmote && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 3 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-emote">
            <img src={emoteUrl} alt={emote} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Messages;