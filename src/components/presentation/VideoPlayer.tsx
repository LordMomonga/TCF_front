import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface VideoProps {
  videoUrl: string;
  redirectTo: string;
}

const VideoPlayer: React.FC<VideoProps> = ({ videoUrl, redirectTo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
const [skip, setSkip] = useState(false)
  useEffect(() => {
    const handleVideoEnd = () => {
      navigate(redirectTo);
    };

    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.addEventListener('ended', handleVideoEnd);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [redirectTo, navigate]);

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause(); // Pause the video
    }
    navigate(redirectTo);
    
  };

  return (
    <div className="w-screen h-screen px-[5%] py-[5%] overflow-hidden flex justify-center items-center">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        src={videoUrl}
      />
      <button className='bg-gray-500 p-2 absolute right-2 bottom-5 text-white '  onClick={handleSkip} >passer</button>
    </div>
  );
};

export default VideoPlayer;
