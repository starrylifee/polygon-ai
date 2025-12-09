// Vercel Serverless Function - Gemini Vision API Proxy
// 환경변수: GEMINI_API_KEY

const SHAPES_CONFIG = {
    3: { name: '삼각형' },
    4: { name: '사각형' },
    5: { name: '오각형' },
    6: { name: '육각형' },
    7: { name: '칠각형' },
    8: { name: '팔각형' },
};

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight 요청 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return res.status(500).json({
            error: 'Server configuration error',
            score: 0,
            isCorrect: false,
            message: 'AI 선생님이 잠시 쉬고 있어요. 관리자에게 문의해주세요!'
        });
    }

    try {
        const { image, mission } = req.body;

        if (!image || !mission) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const requirementsText = Object.entries(mission.requirements)
            .map(([s, c]) => `${SHAPES_CONFIG[s]?.name || s + '각형'} ${c}개`)
            .join(', ');

        const prompt = `
            당신은 아이들의 창의력을 높이 사는 **센스 있고 눈썰미 좋은 미술 선생님 AI**입니다.
            
            [미션]: '${mission.theme}' (${mission.icon}) 만들기
            [재료]: ${requirementsText}

            [평가 기준]:
            1. **핵심 특징**: 주어진 주제의 특징이 추상적으로라도 표현되었나요? (예: '나비'는 양쪽 날개 대칭, '로봇'은 머리와 몸통 연결)
            2. **연결성**: 도형들이 서로 떨어져 있지 않고 잘 연결되어 있나요? (떨어져 있으면 감점)
            3. **창의성**: 정해진 정답은 없습니다. 아이의 의도가 보이면 칭찬해주세요.

            [규칙]:
            - **60점 이상이면 정답(isCorrect: true)입니다.**
            - 엉뚱하거나 도형이 흩어져 있을 때만 오답 처리하세요.
            - 피드백은 칭찬을 먼저 하고, 더 멋지게 만들 팁을 덧붙여주세요.

            응답 형식: JSON
            {
                "score": number (0~100),
                "isCorrect": boolean (score >= 60),
                "message": "한국어 피드백 (다정하고 격려하는 말투)"
            }
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType: "image/png", data: image } }
                        ]
                    }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error('Gemini API Error:', data.error);
            throw new Error(data.error.message);
        }

        const result = JSON.parse(data.candidates[0].content.parts[0].text);

        return res.status(200).json({
            score: result.score,
            isCorrect: result.isCorrect,
            message: result.message
        });

    } catch (error) {
        console.error('Evaluation error:', error);
        return res.status(500).json({
            score: 0,
            isCorrect: false,
            message: 'AI 선생님이 잠시 쉬는 시간이네요. 다시 불러주세요!'
        });
    }
}
