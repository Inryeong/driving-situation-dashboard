# 🚗 Driving Situation Dashboard

**시나리오 기반 주행 상황을 3D 시뮬레이션으로 분석할 수 있는 대시보드 애플리케이션**

---

## ✨ 핵심 기능

### 🎮 3D 시뮬레이션 뷰
- **시뮬레이터 모드**: 자유로운 카메라 조작으로 전체 주행 경로 분석
- **AR 모드**: 실제 AR 환경을 시뮬레이션한 1인칭 시점
- 실시간 차량 위치 및 궤적 시각화

### 📊 실시간 데이터 모니터링(가상)
- 차량의 CanData를 받아와 배터리 상태, 속도, 온도 등 차량 정보 실시간 표시
- 이미지, 텍스트 데이터 처리량 모니터링
- 성능 지표 및 궤적 완성도 시각화

### 🎯 스마트 재생 컨트롤
- 직관적인 재생 컨트롤
- 0.25x ~ 3x 배속 조절
- 타임라인 이벤트 클릭으로 특정 시점으로 즉시 이동
- 실험 로그 및 성공/경고/실패 이벤트 분류

---

## 🛠️ 기술 스택

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.179.1-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)

![Zustand](https://img.shields.io/badge/Zustand-5.0.8-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.12-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5.0-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

</div>

---

## 🏗️ 프로젝트 구조

```
DrivingSituationDashboard/
├── 📁 src/
│   ├── 🎨 components/          # UI 컴포넌트
│   │   ├── Scene3D.tsx        # 3D 씬 렌더링
│   │   ├── Vehicle3D.tsx      # 3D 차량 모델
│   │   ├── TrajectoryPath.tsx # 궤적 경로 시각화
│   │   └── PlaybackControls.tsx # 재생 제어
│   ├── 🗃️ stores/             # 상태 관리
│   │   └── playbackStore.ts   # 재생 상태 & 실험 데이터
│   ├── 📊 types/              # 타입 정의
│   │   └── index.ts           # 인터페이스 & 타입
│   ├── 📈 data/               # 샘플 데이터
│   │   └── sampleTrajectory.ts # 테스트 궤적 데이터
│   └── 🎯 App.tsx             # 메인 애플리케이션
├── ⚙️ vite.config.ts          # 빌드 설정
└── 📦 package.json            # 의존성 관리
```

### 🔄 데이터 흐름
```
실험 데이터 → Zustand Store → 3D 컴포넌트 → 사용자 인터랙션 → 상태 업데이트
```

---

## 🎯 문제 정의 & 해결 방식

### 🚨 **문제 상황**
자율주행 차량 테스트 시 발생하는 **복잡한 주행 데이터**를 분석하기 어려웠습니다:
- 📊 수천 개의 센서 데이터 포인트
- 🕐 시간별 궤적 변화 추적의 어려움
- 📍 3D 공간에서의 위치 관계 파악 부족
- 📈 실시간 성능 모니터링의 한계

### 💡 **해결 방식**
**"3D 시각화 + 실시간 재생"** 접근법으로 혁신적인 솔루션을 제시했습니다:

1. **🎮 3D 시뮬레이션**: Three.js를 활용한 직관적인 공간 시각화
2. **⏯️ 스마트 재생**: YouTube 스타일의 직관적인 재생 컨트롤
3. **📊 실시간 대시보드**: 모든 중요 지표를 한 화면에 통합
4. **🔍 이벤트 기반 분석**: 타임라인 클릭으로 특정 상황 즉시 분석

### 🚀 **결과**
- **개발자 경험**: 복잡한 데이터를 직관적으로 이해 가능
- **테스트 효율성**: 문제 상황을 3D로 재현하여 빠른 디버깅
- **팀 협업**: 시각적 데이터로 팀원들과 원활한 소통

---

## 🚀 시작하기

### 설치
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
```

### 환경 요구사항
- Node.js 18+
- pnpm 8+

---

## 📱 데모

**Live Demo**: [배포 링크 추가 예정]


<div align="center">

** 이 프로젝트는 회사에서 수행했던 업무 경험에서 얻은 인사이트를 바탕으로, 개인적으로 재구현한 데모입니다. 
실제 상용 코드나 내부 데이터는 포함되지 않았으며, 공개 가능한 수준으로 단순화한 버전입니다. **

</div>
