# 🚗 Driving Situation Dashboard

**시나리오 기반 실험 주행 데이터를 3D 시뮬레이션으로 분석할 수 있는 MVP 웹 애플리케이션**

## 🎥 Demo Video
[![Watch on YouTube](https://img.youtube.com/vi/YRmlgzOMEbc/0.jpg)](https://youtu.be/YRmlgzOMEbc)

**이 프로젝트는 회사에서 수행했던 업무 경험에서 얻은 인사이트를 바탕으로, 개인적으로 재구현한 데모입니다. 실제 상용 코드나 내부 데이터는 포함되지 않았으며, 공개 가능한 수준으로 단순화한 버전입니다.**

---

## 핵심 기능 및 구현 사항

#### **3D 주행 시뮬레이션 뷰**
- **GPS 로그(JSON)와 CAN 데이터 기반**: 차량 속도와 위치 정보를 받아 3D 환경에서 주행 궤적 시각화
- **Scene·Vehicle·TrajectoryPath 컴포넌트화**: R3F를 활용한 주요 오브젝트의 모듈화된 구조
- **자유로운 카메라 조작**: 전체 주행 경로를 다양한 각도에서 분석 가능

#### **성능 최적화된 데이터 렌더링**
- **useMemo와 이진 탐색 적용**: 다수 포인트의 주행 경로 데이터 렌더링 성능 개선
- **InstancedMesh 활용**: 보행자·차선 이탈 등 다양한 주행 상황별 이벤트 시각화 성능 최적화
- **60fps 기준 렌더링**: 부드러운 차량 애니메이션 및 궤적 시각화

#### **인터랙티브 시뮬레이터 컨트롤러**
- **타임라인 스크럽/클릭**: 특정 시점으로 즉시 이동 가능한 직관적인 UI
- **유튜브 스타일 컨트롤**: 재생/일시정지, 진행바 슬라이더, 0.25x ~ 3x 배속 조절
- **이벤트 기반 네비게이션**: 실험 로그 클릭으로 해당 상황으로 자동 이동

#### **실험 로그 분석**
- **Start experiment**: 실험 데이터 로딩, 시스템 초기화, 센서 캘리브레이션 등의 성공률
- **Obstacle detected**: 주행 중 장애물(차량, 보행자, 장애물)을 성공적으로 감지한 비율
- **Speed reduced**: 안전을 위해 자동으로 속도를 줄인 상황(정지 신호, 장애물 회피 등)의 발생률

---

## 기술 스택

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-0.179.1-000000?style=for-the-badge&logo=three.js&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-000000?style=for-the-badge&logo=three.js&logoColor=white)

</div>

---

## 문제 정의 & 해결 방식

### **문제 상황**
자율주행 차량 테스트 시 발생하는 **복잡한 주행 데이터**를 분석하기 어려웠습니다:
- 수천 개의 센서 데이터 포인트
- 시간별 궤적 변화 추적의 어려움
- 3D 공간에서의 위치 관계 파악 부족

### **해결 방식**

1. **3D 시뮬레이션**: Three.js/R3F를 활용한 직관적인 공간 시각화
2. **성능 최적화**: useMemo와 이진 탐색으로 대용량 데이터 렌더링 성능 개선
3. **컴포넌트화**: Scene·Vehicle·TrajectoryPath 등 주요 오브젝트의 모듈화
4. **인터랙티브 컨트롤**: 타임라인 스크럽/클릭으로 특정 상황 즉시 분석

### **결과**
- **사용자 경험**: 복잡한 데이터를 직관적으로 이해 가능
- **성능 향상**: 대용량 주행 경로 데이터의 효율적인 렌더링
- **개발 효율성**: 모듈화된 구조로 유지보수성 향상

### **배운점**
#### **기술적 성장**
- **3D 웹 개발**: Three.js와 React Three Fiber를 활용한 고성능 3D 애플리케이션 개발 경험
- **성능 최적화**: useMemo, 이진 탐색, InstancedMesh 등을 활용한 렌더링 성능 최적화 기법 습득
- **대용량 데이터 처리**: 수천 개의 데이터 포인트를 효율적으로 렌더링하는 방법론 이해

#### **UI/UX 디자인 인사이트**
- **데이터 시각화**: 복잡한 기술 데이터를 직관적으로 표현하는 시각적 설계의 중요성
- **사용자 중심 설계**: 기술적 기능성과 사용자 경험의 균형을 맞추는 디자인 철학
- **인터랙티브 요소**: 사용자가 능동적으로 데이터를 탐색할 수 있는 인터페이스 설계의 가치

#### **개발 프로세스 개선**
- **컴포넌트 아키텍처**: 재사용 가능하고 유지보수하기 쉬운 모듈화된 구조 설계의 중요성
- **성능 중심 개발**: 사용자 경험을 위한 성능 최적화의 지속적인 고려 필요성
- **기술 스택 선택**: 프로젝트 요구사항에 맞는 적절한 기술 스택 선택의 중요성

---

## 프로젝트 구조

### **폴더 구조**
```
AutoTestStudio/
├── src/                     # 메인 소스 코드
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── Scene3D.tsx        # 3D 씬 렌더링 및 카메라 제어
│   │   ├── Vehicle3D.tsx      # 3D 차량 모델링 및 애니메이션
│   │   ├── TrajectoryPath.tsx # 차량 주행 궤적 시각화
│   │   └── PlaybackControls.tsx # YouTube 스타일 재생 제어
│   ├── stores/             # 전역 상태 관리
│   │   └── playbackStore.ts   # 재생 상태, 실험 데이터, 타임라인 이벤트
│   ├── types/              # TypeScript 타입 정의
│   │   └── index.ts           # 인터페이스 및 타입 정의
│   ├── data/               # 샘플 데이터 및 데이터 생성 로직
│   │   └── sampleTrajectory.ts # 현실적인 주행 시나리오 데이터
│   ├── App.tsx             # 메인 애플리케이션 컴포넌트
│   ├── main.tsx            # 애플리케이션 진입점
│   └── index.css           # 전역 스타일
├── package.json            # 의존성 관리
└── .gitignore             # Git 제외 파일 설정
```

### **핵심 특징**
- **GPS 로그(JSON)와 CAN 데이터 기반**: 차량 속도와 위치 정보를 받아 3D 환경에서 주행 궤적 시각화
- **성능 최적화**: useMemo와 이진 탐색을 활용한 대용량 데이터 렌더링 성능 개선
- **모듈화된 구조**: R3F를 활용한 Scene·Vehicle·TrajectoryPath 등 주요 오브젝트의 컴포넌트화
- **인터랙티브 컨트롤**: 타임라인 스크럽/클릭으로 특정 시점 이동, 0.25x ~ 3x 배속 조절