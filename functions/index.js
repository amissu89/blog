const { onDocumentCreated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { onRequest } = require('firebase-functions/v2/https');

const admin = require('firebase-admin');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const { Storage } = require('@google-cloud/storage');

admin.initializeApp();
const db = admin.firestore();

const BOARD_INFO = "board-info"
const CUSTOM_DOMAIN = "https://yllee.pe.kr"
const REGION = "asia-northeast3"


async function generateSitemap() {
    try {
        // 1. Firestore에서 전체 문서 가져오기
        const snapshot = await db.collection(BOARD_INFO).get();

        const links = [];
        snapshot.forEach(doc => {
            links.push({
                url: `/posts/${doc.id}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: doc.data().createDt?.toDate?.().toISOString?.() || new Date().toISOString(),
            });
        });

        // 2. Sitemap XML 생성
        const stream = new SitemapStream({ hostname: CUSTOM_DOMAIN });
        const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());

        // 3. Firebase Storage에 저장
        const bucket = admin.storage().bucket(); // 기본 버킷 사용
        const file = bucket.file('sitemap.xml');

        await file.save(xml, {
            metadata: {
                contentType: 'application/xml',
            },
            public: true,
        });

        console.log('✅ sitemap.xml updated successfully.');
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