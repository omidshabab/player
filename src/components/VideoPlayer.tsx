"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import PlayIcon from "./icons/PlayIcon";
import PauseIcon from "./icons/PauseIcon";
import ControlButton from "./ControlButton";
import { motion } from "framer-motion";
import Squircle from './Squircle';
import { cn, formatTime } from "@/lib/utils";
import UnMuteIcon from "./icons/UnMuteIcon";
import MuteIcon from "./icons/MuteIcon";
import FullscreenIcon from "./icons/FullscreenIcon";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

interface VideoPlayerProps {
  video: string;
  minCornerRadius?: number;
  maxCornerRadius?: number;
  breakpoint?: number;
}

const VideoPlayer = ({
  video,
  minCornerRadius = 20,
  maxCornerRadius = 35,
  breakpoint = BREAKPOINTS.md,
}: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [cornerRadius, setCornerRadius] = useState(20);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState(0);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);

        const newRadius = width >= breakpoint ? maxCornerRadius : minCornerRadius;
        setCornerRadius(newRadius);
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updateDimensions();

    return () => {
      resizeObserver.disconnect();
    };
  }, [breakpoint, minCornerRadius, maxCornerRadius]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    if (video.readyState >= 1) {
      setDuration(video.duration);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || isSeeking) return;
    setCurrentTime(videoRef.current.currentTime);
    if (!isVideoStarted && videoRef.current.currentTime > 0) {
      setIsVideoStarted(true);
    }
  };

  const handleDurationChange = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const getResponsiveClasses = () => {
    return {
      playButton: cn(
        "flex justify-center items-center bg-white/10 backdrop-blur-xl rounded-full transition-all duration-500",
        containerWidth >= breakpoint ? "p-[35px]" : "p-[15px]",
        "hover:scale-125"
      ),
      playIcon: cn(
        containerWidth >= breakpoint
          ? "w-[100px] h-[100px] ml-[8px] mt-[5px]"
          : "w-[35px] h-[35px] ml-[2px] mt-[1px]"
      ),
      controls: cn(
        "absolute flex opacity-0 controls gap-x-[10px] w-full bottom-0 items-center px-[15px] py-[15px] text-black duration-500 transition-all",
        isVideoStarted && "group-hover:opacity-100",
        isVideoStarted && !isPlaying && "opacity-100"
      ),
    };
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((error) => {
        console.error("Error exiting fullscreen:", error);
      });
    } else {
      videoRef.current.requestFullscreen().catch((error) => {
        console.error("Error entering fullscreen:", error);
      });
    }
  };

  const calculateTimeAndPosition = (e: React.MouseEvent | MouseEvent) => {
    if (!progressBarRef.current || !videoRef.current) return { time: 0, position: 0 };

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const time = (offsetX / rect.width) * (videoRef.current.duration || 0);
    const position = Math.max(0, Math.min(offsetX, rect.width));

    return { time, position };
  };

  const handleProgressBarHover = (e: React.MouseEvent) => {
    if (!videoRef.current || isSeeking) return;

    const { time, position } = calculateTimeAndPosition(e);
    setPreviewTime(time);
    setPreviewPosition(position);
    setShowPreview(true);

    if (previewVideoRef.current) {
      previewVideoRef.current.currentTime = time;
    }
  };

  const handleProgressBarLeave = () => {
    if (!isSeeking) {
      setShowPreview(false);
    }
  };

  const startSeeking = (e: React.MouseEvent) => {
    if (!videoRef.current) return;

    setWasPlaying(isPlaying);
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    setIsSeeking(true);
    const { time, position } = calculateTimeAndPosition(e);
    setPreviewTime(time);
    setPreviewPosition(position);
    setShowPreview(true);
  };

  const handleSeeking = (e: MouseEvent) => {
    if (!isSeeking || !videoRef.current) return;

    const { time, position } = calculateTimeAndPosition(e);
    setPreviewTime(time);
    setPreviewPosition(position);

    if (previewVideoRef.current) {
      previewVideoRef.current.currentTime = time;
    }
  };

  const stopSeeking = () => {
    if (!videoRef.current || !isSeeking) return;

    videoRef.current.currentTime = previewTime;
    setCurrentTime(previewTime);
    setIsSeeking(false);
    setShowPreview(false);

    if (wasPlaying) {
      videoRef.current.play().catch((error) => {
        console.error("Error resuming video:", error);
      });
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isSeeking) {
      window.addEventListener("mousemove", handleSeeking);
      window.addEventListener("mouseup", stopSeeking);
    }
    return () => {
      window.removeEventListener("mousemove", handleSeeking);
      window.removeEventListener("mouseup", stopSeeking);
    };
  }, [isSeeking, previewTime]);

  const getProgressBarWidth = (): number => {
    if (!videoRef.current) return 0;
    const time = isSeeking ? previewTime : currentTime;
    const videoDuration = duration || 0;
    return videoDuration > 0 ? (time / videoDuration) * 100 : 0;
  };

  useEffect(() => {
    if (showPreview && previewVideoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        requestAnimationFrame(() => {
          ctx.drawImage(previewVideoRef.current!, 0, 0, 160, 90);
        });
      }
    }
  }, [showPreview, previewTime]);

  const responsiveClasses = getResponsiveClasses();

  return (
    <div ref={containerRef} className="w-full h-full">
      <Squircle
        className="w-full h-full block overflow-hidden"
        cornerSmoothing={90}
        cornerRadius={cornerRadius}>
        <div className="group relative flex w-full h-full aspect-video bg-zinc-100">
          <video
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            onLoadedMetadata={handleDurationChange}
            onEnded={handleVideoEnd}
            className="w-full h-full overflow-hidden object-cover"
            src={video}
            preload="metadata"
          />

          <video
            ref={previewVideoRef}
            className="hidden"
            src={video}
            preload="metadata"
          />

          <div className="absolute flex flex-col w-full h-full">
            <div
              className={cn(
                "w-full flex flex-grow justify-center items-center opacity-0 group-hover:opacity-100 duration-500 transition-all",
                !isPlaying && "opacity-100",
              )}
            >
              <div
                onClick={togglePlayPause}
                className="flex justify-center items-center bg-white/10 backdrop-blur-xl rounded-full p-[15px] md:p-[35px] aspect-square cursor-pointer hover:scale-110 transition-all duration-500">
                {!isPlaying && <PlayIcon className="w-[35px] h-[35px] md:w-[100px] md:h-[100px] ml-[2px] mt-[1px] md:ml-[8px] md:mt-[5px]" />}
                {isPlaying && <PauseIcon className="w-[35px] h-[35px] md:w-[100px] md:h-[100px]" />}
              </div>
            </div>

            <div
              className={cn(
                "absolute flex flex-col gap-y-[5px] sm:flex-row opacity-0 controls gap-x-[10px] w-full bottom-0 items-center px-[15px] py-[15px] text-black duration-500 transition-all",
                isVideoStarted && "group-hover:opacity-100",
                isVideoStarted && !isPlaying && "opacity-100",
              )}
            >
              <ControlButton
                onClick={togglePlayPause}
                className="hidden sm:block">
                {isPlaying ? (
                  <PauseIcon className="w-[20px] h-[20px]" />
                ) : (
                  <PlayIcon
                    className="w-[20px] h-[20px] ml-[2px] mt-[1px]"
                  />
                )}
              </ControlButton>

              <ControlButton
                onClick={toggleMute}
                className="hidden sm:block">
                {isMuted ? (
                  <UnMuteIcon />
                ) : (
                  <MuteIcon />
                )}
              </ControlButton>

              <div className="hidden sm:flex w-full flex-grow items-center justify-center px-[15px] py-[5px] gap-x-[10px] bg-white/5 backdrop-blur-md rounded-full h-[40px] z-10">
                <div className="text-[15px] text-white">
                  {formatTime(isSeeking ? previewTime : currentTime)}
                </div>
                <div
                  ref={progressBarRef}
                  onMouseDown={startSeeking}
                  onMouseMove={handleProgressBarHover}
                  onMouseLeave={handleProgressBarLeave}
                  className="relative flex-grow h-[8px] rounded-full bg-zinc-50/25 cursor-pointer group/progress"
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${getProgressBarWidth()}%` }}
                    transition={{ duration: isSeeking ? 0 : 0.1 }}
                    className="absolute h-full rounded-full bg-zinc-100/35"
                  />
                  <div
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 transition-opacity",
                      "group-hover/progress:opacity-0",
                      isSeeking && "opacity-0"
                    )}
                    style={{
                      left: `${getProgressBarWidth()}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />

                  {showPreview && (
                    <div
                      className="absolute bottom-[20px] w-[107px] h-[60px] md:w-[160px] md:h-[90px] transform -translate-x-1/2 bg-black rounded-[10px] overflow-hidden"
                      style={{
                        left: `${previewPosition}px`,
                      }}>
                      <canvas
                        ref={canvasRef}
                        width={160}
                        height={90}
                      />
                      <div className="absolute bottom-0 w-full px-[5px] py-[5px]">
                        <div className="flex justify-center items-center w-min px-[5px] border-white/5 border-[1px] backdrop-blur-md bg-black/5 text-[12px] sm:text-[12px] text-white text-center rounded-full">
                          {formatTime(previewTime)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-[15px] text-white">
                  {formatTime(duration)}
                </div>
              </div>

              <ControlButton
                onClick={toggleFullscreen}
                className="hidden sm:block">
                <FullscreenIcon />
              </ControlButton>
            </div>
          </div>
        </div>
      </Squircle>
    </div>
  );
};

export default VideoPlayer;