# 🎨 AI 다각형 미술 시간

AI 선생님과 함께하는 창의적인 도형 미술 앱입니다. 다양한 다각형을 조합하여 주어진 미션을 완성하면 AI가 작품을 평가해줍니다.

## ✨ 기능

- 🔷 다양한 다각형 (삼각형 ~ 팔각형) 조작
- 🎯 난이도별 미션 (2개 ~ 5개 도형)
- 🤖 Gemini Vision AI 기반 작품 평가
- 📱 모바일 터치 지원

## 🚀 배포 방법

### 1. Vercel 환경변수 설정

Vercel 대시보드에서 다음 환경변수를 설정하세요:

| 변수명 | 값 |
|--------|-----|
| `GEMINI_API_KEY` | Google AI Studio에서 발급받은 API 키 |

### 2. 배포

```bash
# Vercel CLI 설치 (처음 한 번만)
npm install -g vercel

# 배포
vercel --prod
```

## 🔑 API 키 발급

1. [Google AI Studio](https://aistudio.google.com/) 접속
2. "Get API Key" 클릭
3. 새 API 키 생성
4. Vercel 환경변수에 등록

## 📁 프로젝트 구조

```
polygon-ai/
├── public/
│   └── index.html      # 메인 프론트엔드
├── api/
│   └── evaluate.js     # Gemini API 프록시 (Serverless Function)
├── vercel.json         # Vercel 설정
├── package.json
└── README.md
```

## 🛡️ 보안

- API 키는 Vercel 환경변수로 관리되어 클라이언트에 노출되지 않습니다
- 모든 AI 요청은 서버사이드 Serverless Function을 통해 처리됩니다

## 📄 라이선스

MIT License
"# polygon-ai" 
