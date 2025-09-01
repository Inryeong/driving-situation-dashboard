import { useEffect, useState } from 'react';
import { Scene3D } from './components/Scene3D';
import { PlaybackControls } from './components/PlaybackControls';
import { usePlaybackStore } from './stores/playbackStore';
import { sampleExperiment } from './data/sampleTrajectory';
import './App.css';

function App() {
  const { setExperiment, setCurrentTime, selectedEventId, setSelectedEvent } = usePlaybackStore();
  const [viewMode, setViewMode] = useState<'simulator' | 'ar'>('simulator');

  // 컴포넌트가 마운트될 때 샘플 데이터 로드
  useEffect(() => {
    setExperiment(sampleExperiment);
  }, [setExperiment]);

  // 타임라인 이벤트 데이터 생성
  const timelineEvents = [
    { id: 'start', time: 0, event: 'Start experiment', details: '33% min. 1/5', type: 'success' },
    { id: 'obstacle', time: 6000, event: 'Obstacle detected', details: '15 msec', type: 'warning' },
    { id: 'stop', time: 30000, event: 'Stopped at stop sign', details: '1.3s', type: 'info' },
    { id: 'speed', time: 50000, event: 'Speed reduced', details: '20 km/h', type: 'failure' }
  ];

  // 타임라인 이벤트 클릭 핸들러
  const handleTimelineClick = (eventTime: number, eventId: string) => {
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
          <h1 className="project-title">LiveWindow AR Studio</h1>
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
                    onClick={() => setViewMode('simulator')}
                    title="시뮬레이터 모드"
                  >
                    <span className="mode-label">시뮬레이터</span>
                  </button>
                  <button 
                    className={`mode-tab ${viewMode === 'ar' ? 'active' : ''}`}
                    onClick={() => setViewMode('ar')}
                    title="AR 모드"
                  >
                    <span className="mode-label">AR</span>
                  </button>
                </div>
              </div>
              <div className="simulation-container">
                <Scene3D viewMode={viewMode} />
                {/* 플로팅 재생 컨트롤 */}
                <div className="floating-playback-controls">
                  <PlaybackControls />
                </div>
              </div>
            </section>

            {/* 실험 로그 - 3D VIEW 아래 */}
            <section className="sidebar-panel experiment-log-main">
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

          {/* 사이드바 영역 (우측) */}
          <div className="sidebar-area">
            {/* 컨트롤 패널 */}
            <section className="sidebar-panel">
              <h2 className="panel-title">CONTROLS</h2>
              <div className="control-content">
                <div className="segment-selector">
                  <span>Scemîment</span>
                  <span className="arrow">▶</span>
                </div>
                
                <div className="vehicle-stats">
                  <div className="stat-item">
                    <span className="stat-label">BATTERY STATS</span>
                    <div className="stat-value">
                      <span>92.5%</span>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '92.5%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-label">SPEED</span>
                    <span className="stat-value">4.5 m/s</span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-label">TEMPERATURE</span>
                    <span className="stat-value">35.4°C</span>
                  </div>
                </div>
                
                <div className="realtime-data">
                  <h3>REAL-TIME DATA</h3>
                  <div className="data-grid">
                    <div className="data-item">
                      <span className="data-label">LIDAR</span>
                      <span className="data-value">510.2k</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">IMAGES</span>
                      <span className="data-value">29.7</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">TEXT</span>
                      <span className="data-value">1.3</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 데이터 시각화 */}
            <section className="sidebar-panel">
              <h2 className="panel-title">DATA VISUALIZATION</h2>
              <div className="chart-container">
                <div className="chart-item">
                  <h4>Speed</h4>
                  <div className="wave-chart">
                    <div className="wave-line"></div>
                  </div>
                </div>
                <div className="chart-item">
                  <h4>Performance</h4>
                  <div className="bar-chart">
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                    <div className="bar" style={{height: '45%'}}></div>
                    <div className="bar" style={{height: '90%'}}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* 성능 지표 */}
            <section className="sidebar-panel">
              <h2 className="panel-title">PERFORMANCE</h2>
              <div className="performance-content">
                <div className="performance-chart">
                  <div className="bar-group">
                    <div className="bar" style={{height: '70%'}}></div>
                    <div className="bar" style={{height: '85%'}}></div>
                    <div className="bar" style={{height: '60%'}}></div>
                  </div>
                </div>
                
                <div className="trajectory-indicator">
                  <h4>Trajectory</h4>
                  <div className="trajectory-circle">
                    <span className="percentage">93%</span>
                  </div>
                  <div className="mini-wave"></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
