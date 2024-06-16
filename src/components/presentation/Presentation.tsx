import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';

import { BiPlayCircle } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';

const Presentation: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isExiting = useRef(false);

  const handleVideoClick = () => {
    if (videoRef.current && !isFullScreen) {
      videoRef.current.requestFullscreen();
      setIsFullScreen(true);
      videoRef.current.play();
    }
  };

  const handleExitFullScreen = () => {
    if (document.fullscreenElement && videoRef.current && document.fullscreenElement === videoRef.current) {
      isExiting.current = true;
      document.exitFullscreen();
    }
    setIsFullScreen(false);
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && isFullScreen && !isExiting.current && videoRef.current) {
      videoRef.current.requestFullscreen();
    }
    isExiting.current = false;
  };

  const handleVideoEnd = () => {
    handleExitFullScreen();
  };

  const handleKeyDown = (e: globalThis.KeyboardEvent) => { // Utiliser globalThis.KeyboardEvent pour éviter l'erreur
    if (e.key === 'Escape' && isFullScreen && videoRef.current) {
      e.preventDefault();
      videoRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown); // Pas d'erreur ici avec globalThis.KeyboardEvent
    videoElement?.addEventListener('ended', handleVideoEnd);
    videoElement?.addEventListener('pause', () => videoElement.play());

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      videoElement?.removeEventListener('ended', handleVideoEnd);
      videoElement?.removeEventListener('pause', () => videoElement.play());
    };
  }, [isFullScreen]);

  return (
    <>
      <div className='w-full'>
        <nav className='px-5 py-5 flex items-center bg-prim'>
          <span className='font-bold text-3xl text-white'>Tolkin</span>
        </nav>
      
        <div className='mt-5'>
          <h1 className='text-center text-[14px] text-gray-500'>
            Lisez la vidéo complètement avant de commencer votre test
          </h1>
        </div>
      
        <div className='w-full flex justify-center mt-5'>
          <div className='w-[55%] px-5 rounded-xd'>
            <video className='object-contain' ref={videoRef}>
              <source src='portail.mp4' type='video/mp4' />
            </video>
            <div className='w-full flex justify-center'>
              <NavLink to='/CO'><button 
                onClick={handleVideoClick}
                className='flex gap-5 items-center bg-prim text-white font-bold px-5 py-1 mt-5 rounded-sm'>
              < BiPlayCircle/>  Lire
              </button></NavLink>
            </div>
          </div>
        </div>
      
        <footer className='absolute bottom-3 w-full'>
          <div className='flex justify-between px-10'>
            <button className='bg-red-500 px-2 py-1 text-white font-bold rounded-md'>Quitter</button>
            <button className='p-2 px-3 bg-transparent border-2 border-gray-500 rounded-md'>Commencer</button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Presentation;
