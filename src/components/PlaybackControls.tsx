import React, { useEffect, useRef } from 'react';
import { usePlaybackStore } from '../stores/playbackStore';
import { IoPlay, IoPause, IoRefresh } from 'react-icons/io5';

export const PlaybackControls: React.FC = () => {
  const { isPlaying, currentTime, duration, speed, play, pause, setCurrentTime, setSpeed, reset } = usePlaybackStore();
  const animationRef = useRef<number | undefined>(undefined);

  // 재생 애니메이션
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        const newTime = currentTime + (16 * speed); // 60fps 기준, 밀리초 단위
        if (newTime >= duration) {
          pause();
          setCurrentTime(duration);
        } else {
          setCurrentTime(newTime);
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, duration, currentTime, setCurrentTime, pause]);

  // 시간 포맷팅 함수 (밀리초를 초로 변환)
  const formatTime = (time: number): string => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 슬라이더 변경 핸들러
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    // setCurrentTime에서 자동으로 해당 시간에 맞는 이벤트를 선택함
  };

  // 배속 변경 핸들러
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
  };

  return (
    <div className="youtube-player-controls">
      <div className="controls-main">
        <button
          onClick={isPlaying ? pause : play}
          className={`play-pause-btn ${isPlaying ? 'pause' : 'play'}`}
          title={isPlaying ? '일시정지' : '재생'}
        >
          {isPlaying ? (
            <IoPause size={22} />
          ) : (
            <IoPlay size={22} />
          )}
        </button>

        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="time-separator">/</span>
          <span className="total-time">{formatTime(duration)}</span>
        </div>

        <div className="progress-container">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSliderChange}
            className="progress-bar"
            title="진행 시간 조절"
          />
          <div
            className="progress-fill"
            style={{
              width: `${(currentTime / duration) * 100}%`
            }}
          />
        </div>

        <div className="speed-control">
          <select
            value={speed}
            onChange={handleSpeedChange}
            className="speed-select"
            title="재생 속도"
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
            <option value={3}>3x</option>
          </select>
        </div>

        <button
          onClick={reset}
          className="reset-btn"
          title="처음으로"
        >
          <IoRefresh size={22} />
        </button>
      </div>
    </div>
  );
};
