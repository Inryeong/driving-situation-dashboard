import { useEffect, useState } from 'react';
import { Scene3D } from './components/Scene3D';
import { PlaybackControls } from './components/PlaybackControls';
import { usePlaybackStore } from './stores/playbackStore';
import { sampleExperiment } from './data/sampleTrajectory';
import './App.css';

function App() {
  const { setExperiment, setCurrentTime, selectedEventId, setSelectedEvent, pause, setTimelineEvents } = usePlaybackStore();
  const [viewMode, setViewMode] = useState<'simulator' | 'ar'>('simulator');
  const [cameraMode, setCameraMode] = useState<'follow' | 'free'>('free');

  // 타임라인 이벤트 데이터 생성
  const timelineEvents = [
    { id: 'start', time: 0, event: 'Start experiment', details: '33% min. 1/5', type: 'success' },
    { id: 'obstacle', time: 12000, event: 'Obstacle detected', details: '15 msec', type: 'warning' },
    { id: 'stop', time: 30000, event: 'Stopped at stop sign', details: '2.0s', type: 'info' },
    { id: 'speed', time: 50000, event: 'Speed reduced', details: '5.0s', type: 'failure' }
  ];

  // 컴포넌트가 마운트될 때 샘플 데이터와 타임라인 이벤트 로드
  useEffect(() => {
    setExperiment(sampleExperiment);
    setTimelineEvents(timelineEvents);
    // 초기 모드에 따라 cameraMode 설정
    setCameraMode(viewMode === 'ar' ? 'follow' : 'free');
  }, [setExperiment, setTimelineEvents, viewMode]);

  // 타임라인 이벤트 클릭 핸들러
  const handleTimelineClick = (eventTime: number, eventId: string) => {
    // 재생 중이면 일시정지
    pause();
    // 시간 설정 및 이벤트 선택
    setCurrentTime(eventTime);
    setSelectedEvent(eventId);
  };

  // 시간 포맷팅 함수
  const formatTime = (time: number): string => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="App">
      {/* 헤더 */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="project-title">Driving Situation Dashboard</h1>
        </div>
        
        <div className="header-right">
          {/* 우측 영역 비워두기 */}
        </div>
      </header>

      {/* 메인 컨텐츠 - 유튜브 형태 레이아웃 */}
      <main className="main-content">
        <div className="youtube-layout">
          {/* 메인 콘텐츠 영역 (왼쪽) */}
          <div className="main-content-area">
            {/* 3D 뷰 */}
            <section className="view-panel main-video">
              <div className="panel-title-row">
                <h2 className="panel-title">3D VIEW</h2>
                <div className="mode-toggle">
                  <button 
                    className={`mode-tab ${viewMode === 'simulator' ? 'active' : ''}`}
                    onClick={() => {
                      setViewMode('simulator');
                      setCameraMode('free'); // 시뮬레이터 모드일 때는 Free 모드
                    }}
                    title="시뮬레이터 모드 - 자유로운 카메라 컨트롤"
                  >
                    <span className="mode-label">시뮬레이터</span>
                  </button>
                  <button 
                    className={`mode-tab ${viewMode === 'ar' ? 'active' : ''}`}
                    onClick={() => {
                      setViewMode('ar');
                      setCameraMode('follow'); // AR 모드일 때는 Follow 모드
                    }}
                    title="AR 모드 - 큐브를 따라가는 카메라"
                  >
                    <span className="mode-label">AR</span>
                  </button>
                </div>
              </div>
              <div className="simulation-container">
                <Scene3D viewMode={viewMode} cameraMode={cameraMode} />
                {/* AR 모드일 때는 Follow 모드 버튼 표시하지 않음 */}
                {/* 플로팅 재생 컨트롤 */}
                <div className="floating-playback-controls">
                  <PlaybackControls />
                </div>
              </div>
            </section>
          </div>

          {/* 사이드바 영역 (우측) - EXPERIMENT LOG 배치 */}
          <div className="sidebar-area">
            {/* 실험 로그 */}
            <section className="sidebar-panel experiment-log-sidebar">
              <h2 className="panel-title">EXPERIMENT LOG</h2>
              <div className="log-summary">
                <div className="log-item success">
                  <span className="log-label">Start experiment</span>
                  <span className="log-status">success 93%</span>
                </div>
                <div className="log-item warning">
                  <span className="log-label">Obstacle detected</span>
                  <span className="log-status">Warning 6%</span>
                </div>
                <div className="log-item failure">
                  <span className="log-label">Speed reduced</span>
                  <span className="log-status">Failure 1%</span>
                </div>
              </div>
              
              {/* 타임라인 로그 */}
              <div className="log-timeline">
                <h3 className="timeline-title">Timeline</h3>
                {timelineEvents.map((event, index) => {
                  const isSelected = selectedEventId === event.id;
                  return (
                    <div 
                      key={index} 
                      className={`timeline-item ${isSelected ? 'active' : ''}`}
                      onClick={() => handleTimelineClick(event.time, event.id)}
                      title={`${event.event} - ${formatTime(event.time)}로 이동`}
                    >
                      <span className="time">{formatTime(event.time)}</span>
                      <span className="event">{event.event}</span>
                      <span className="details">{event.details}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
