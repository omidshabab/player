"use client";

import { useEffect, useRef, useState } from "react";
import PlayIcon from "./icons/PlayIcon";
import PauseIcon from "./icons/PauseIcon";
import ControlButton from "./ControlButton";
import { motion } from "framer-motion";
import { Squircle } from "corner-smoothing";
import { cn } from "@/lib/utils";
import { formatTime } from "media-chrome/dist/utils/time.js";
import UnMuteIcon from "./icons/UnMuteIcon";
import MuteIcon from "./icons/MuteIcon";
import FullscreenIcon from "./icons/FullscreenIcon";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  // Seek video to a specific time
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (videoRef.current) {
      const rect = (e.target as HTMLDivElement).getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newTime = (offsetX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  // Start seeking
  const startSeeking = () => {
    togglePlayPause();
    setIsSeeking(true);
  };

  // Stop seeking
  const stopSeeking = () => {
    togglePlayPause();
    setIsSeeking(false);
  };

  // Handle mouse move during seeking
  const handleMouseMove = (e: MouseEvent) => {
    if (isSeeking && videoRef.current) {
      const rect = (e.target as HTMLDivElement).getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newTime = (offsetX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {


    if (isSeeking) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopSeeking);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopSeeking);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopSeeking);
    };
  }, [duration, isSeeking]);

  return (
    <Squircle cornerRadius={35} cornerSmoothing={0.5} className="w-full h-full">
      <div className="group relative flex w-full h-full aspect-video rounded-[35px] bg-zinc-50">
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onEnded={handleVideoEnd}
          className="w-full h-full overflow-hidden rounded-[35px]"
          src="/sample-02.mp4"
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
              className="flex bg-white/10 backdrop-blur-xl rounded-full p-[35px] aspect-square cursor-pointer hover:scale-125 transition-all duration-500"
            >
              {!isPlaying && <PlayIcon className="ml-[8px] mt-[5px]" />}
              {isPlaying && <PauseIcon />}
            </div>
          </div>

          <div
            className={cn(
              "absolute flex controls gap-x-[10px] w-full bottom-0 items-center px-[15px] py-[15px] text-black opacity-0 duration-500 transition-all",
              videoRef.current &&
              videoRef.current.currentTime > 0 &&
              "group-hover:opacity-100",
              videoRef.current &&
              videoRef.current.currentTime > 0 &&
              !isPlaying &&
              "opacity-100",
            )}
          >
            <ControlButton onClick={togglePlayPause}>
              {isPlaying ? (
                <PauseIcon width={20} height={20} />
              ) : (
                <PlayIcon
                  width={20}
                  height={20}
                  className="ml-[2px] mt-[1px]"
                />
              )}
            </ControlButton>

            <ControlButton onClick={toggleMute}>
              {isMuted ? (
                <UnMuteIcon width={20} height={20} />
              ) : (
                <MuteIcon width={20} height={20} />
              )}
            </ControlButton>

            {/* -- Progress Bar -- */}
            <div className="flex flex-grow items-center justify-center px-[15px] py-[5px] gap-x-[10px] bg-white/5 backdrop-blur-md rounded-full h-[40px] z-10">
              <div className="text-[15px] text-white">
                {videoRef.current && formatTime(videoRef.current.currentTime)}
              </div>
              <div
                onMouseDown={startSeeking}
                onClick={handleSeek}
                className="relative flex-grow h-[8px] rounded-full bg-zinc-50/25 cursor-pointer"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${videoRef.current && (videoRef.current.currentTime / videoRef.current.duration) * 100}%`, }}
                  className="absolute h-[8px] rounded-full bg-zinc-100/35"
                />
              </div>
              <div className="text-[15px] text-white">
                {videoRef.current && formatTime(videoRef.current.duration)}
              </div>
            </div>

            <ControlButton onClick={toggleFullscreen}>
              {isMuted ? (
                <FullscreenIcon width={20} height={20} />
              ) : (
                <FullscreenIcon width={20} height={20} />
              )}
            </ControlButton>
          </div>
        </div>
      </div>
    </Squircle>
  );
};

export default VideoPlayer;
