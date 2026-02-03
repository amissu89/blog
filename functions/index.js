const { onDocumentCreated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');

const admin = require('firebase-admin');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

admin.initializeApp();
const db = admin.firestore();

const BOARD_INFO = "board-info"
const CUSTOM_DOMAIN = "https://yllee.pe.kr"
const REGION = "asia-northeast3"

// My Index 설정
const config = require('./config.js');


async function generateSitemap() {
    try {
        // 1. Firestore에서 전체 문서 가져오기
        const snapshot = await db.collection(BOARD_INFO).get();

        const links = [
            // 정적 페이지
            { url: '/', changefreq: 'daily', priority: 1.0 },
            { url: '/posts', changefreq: 'daily', priority: 0.9 },
        ];

        // 블로그 글 추가
        snapshot.forEach(doc => {
            links.push({
                url: `/view/${doc.id}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: doc.data().createDt?.toDate?.().toISOString?.() || new Date().toISOString(),
            });
        });

        // 2. Sitemap XML 생성
        const stream = new SitemapStream({ hostname: CUSTOM_DOMAIN });
        const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());

        // 3. Firebase Storage에 저장
        const bucket = admin.storage().bucket();
        const file = bucket.file('sitemap.xml');

        await file.save(xml, {
            metadata: {
                contentType: 'application/xml',
            },
            public: true,
        });

        console.log(`✅ sitemap.xml updated successfully. (${links.length} URLs)`);
    } catch (error) {
        console.error('❌ Failed to generate sitemap:', error);
    }
}


exports.generateSitemapOnCreate = onDocumentCreated(
    {
        document: `${BOARD_INFO}/{docId}`,
        region: REGION,
    },
    async (event) => {
        await generateSitemap();
    }
);

exports.generateSitemapOnDelete = onDocumentDeleted(
    {
        document: `${BOARD_INFO}/{docId}`,
        region: REGION,
    },
    async (event) => {
        await generateSitemap();
    }
);

exports.serveSitemap = onRequest(
    {
        region: REGION, // 옵션: 필요하면 설정
    },
    async (req, res) => {
        const file = admin.storage().bucket().file('sitemap.xml');
        try {
            const [contents] = await file.download();
            res.set('Content-Type', 'application/xml');
            res.status(200).send(contents);
        } catch (e) {
            res.status(500).send('Failed to load sitemap.');
        }
    }
);


// ============================================
// My Index - Google Sheets 동기화
// ============================================

/**
 * FRED API에서 금리 데이터 조회
 * @param {string} seriesId - FRED 시리즈 ID (예: DGS10, DGS2)
 * @returns {Promise<number|null>} 금리 값 또는 null
 */
async function fetchFredRate(seriesId) {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${config.FRED_API_KEY}&file_type=json&sort_order=desc&limit=5`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`FRED API error: ${response.status}`);
    }

    const data = await response.json();
    const observations = data.observations || [];

    // 최근 유효한 값 찾기 (가끔 "." 값이 있음)
    for (const obs of observations) {
        const value = parseFloat(obs.value);
        if (!isNaN(value)) {
            return value;
        }
    }
    return null;
}

/**
 * Google Sheets에서 데이터를 읽어 Firestore에 저장
 */
async function syncMyIndexData() {
    try {
        // 동적 import로 초기화 시간 단축
        const { google } = require('googleapis');

        // Google Sheets API 인증 (서비스 계정 사용)
        const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const sheets = google.sheets({ version: 'v4', auth });

        // 1. 보유자산 데이터 읽기
        const holdingsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: config.SHEETS_ID,
            range: `${config.SHEET_NAME}!${config.DATA_RANGE}`,
        });

        // 2. 환율 데이터 읽기
        const fxResponse = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: config.SHEETS_ID,
            ranges: [
                `${config.SHEET_NAME}!${config.FX_USD_CELL}`,
                `${config.SHEET_NAME}!${config.FX_EUR_CELL}`,
            ],
        });

        const rows = holdingsResponse.data.values || [];
        const fxValues = fxResponse.data.valueRanges || [];

        // 환율 파싱
        const usdKrw = parseFloat(fxValues[0]?.values?.[0]?.[0]) || null;
        const eurKrw = parseFloat(fxValues[1]?.values?.[0]?.[0]) || null;

        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        const batch = db.batch();

        // 3. 환율 저장 (Last Good Value 정책)
        if (usdKrw && eurKrw) {
            const fxRef = db.collection('market').doc('fx');
            batch.set(fxRef, {
                USDKRW: usdKrw,
                EURKRW: eurKrw,
                timestamp: timestamp,
            }, { merge: true });
            console.log(`✅ FX rates updated: USD/KRW=${usdKrw}, EUR/KRW=${eurKrw}`);
        } else {
            console.warn('⚠️ FX rates invalid, keeping last good value');
        }

        // 4. FRED에서 금리 데이터 조회
        try {
            const us10y = await fetchFredRate('DGS10');
            const us2y = await fetchFredRate('DGS2');

            if (us10y !== null && us2y !== null) {
                const spread = us10y - us2y;
                const ratesRef = db.collection('market').doc('rates');
                batch.set(ratesRef, {
                    US10Y: us10y,
                    US2Y: us2y,
                    spread10y2y: spread,
                    timestamp: timestamp,
                }, { merge: true });
                console.log(`✅ Rates updated: 10Y=${us10y}, 2Y=${us2y}, spread=${spread.toFixed(2)}`);
            } else {
                console.warn('⚠️ FRED rates invalid, keeping last good value');
            }
        } catch (fredError) {
            console.error('⚠️ FRED API error:', fredError.message);
        }

        // 4. 보유자산 저장
        const holdingsRef = db.collection('users').doc(config.FIRESTORE_USER_ID).collection('holdings');

        // 기존 holdings 삭제 후 새로 저장
        const existingHoldings = await holdingsRef.get();
        existingHoldings.forEach(doc => {
            batch.delete(doc.ref);
        });

        let validCount = 0;
        for (const row of rows) {
            const col = config.COLUMNS;
            const enabled = String(row[col.ENABLED]).toUpperCase() === 'TRUE';

            // enabled가 아니거나 필수 데이터가 없으면 스킵
            if (!row[col.NAME] || !row[col.QUANTITY]) continue;

            const holding = {
                market: row[col.MARKET] || 'KR',
                assetType: row[col.ASSET_TYPE] || 'STOCK',
                name: row[col.NAME],
                ticker: row[col.TICKER] || '',
                quantity: parseFloat(row[col.QUANTITY]) || 0,
                avgPrice: parseFloat(row[col.AVG_PRICE]) || 0,
                currency: row[col.CURRENCY] || 'KRW',
                lastPrice: parseFloat(row[col.LAST_PRICE]) || 0,
                valueKRW: parseFloat(row[col.VALUE_KRW]) || 0,
                pnlKRW: parseFloat(row[col.PNL_KRW]) || 0,
                enabled: enabled,
                memo: row[col.MEMO] || '',
                timestamp: timestamp,
            };

            const docId = holding.ticker || `${holding.assetType}_${holding.name}_${holding.currency}_${validCount}`;
            batch.set(holdingsRef.doc(docId), holding);
            validCount++;
        }

        await batch.commit();
        console.log(`✅ My Index sync completed: ${validCount} holdings saved`);

        return { success: true, holdingsCount: validCount };

    } catch (error) {
        console.error('❌ My Index sync failed:', error);
        throw error;
    }
}

/**
 * 스케줄 트리거 - 하루 4회 (6시, 12시, 18시, 24시 KST)
 */
exports.syncMyIndexScheduled = onSchedule(
    {
        schedule: '0 6,12,18,0 * * *',  // 매일 6시, 12시, 18시, 0시
        timeZone: 'Asia/Seoul',
        region: REGION,
    },
    async (event) => {
        await syncMyIndexData();
    }
);

/**
 * 수동 트리거 - HTTPS 호출로 즉시 동기화
 */
exports.syncMyIndexManual = onRequest(
    {
        region: REGION,
    },
    async (req, res) => {
        try {
            const result = await syncMyIndexData();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);