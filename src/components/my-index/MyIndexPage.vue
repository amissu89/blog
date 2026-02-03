<template>
    <div class="my-index-page container">
        <!-- 로딩 상태 -->
        <div v-if="loading" class="loading-state">
            <span>데이터를 불러오는 중...</span>
        </div>

        <template v-else>
        <!-- A. 상단 바 -->
        <header class="top-bar">
            <span class="today">{{ formattedToday }}</span>
            <span class="separator">|</span>
            <span class="last-updated">갱신: {{ lastUpdated }}</span>
            <button class="sync-btn" @click="syncData" :disabled="syncing">
                {{ syncing ? '...' : '새로고침' }}
            </button>
        </header>

        <!-- B. KPI 카드 5개 -->
        <section class="kpi-section">
            <div class="kpi-grid">
                <!-- 1. 총자산 -->
                <div class="kpi-card">
                    <span class="kpi-label">총자산</span>
                    <span class="kpi-value">{{ formatKRW(totalAssets) }}</span>
                </div>
                <!-- 2. 현금비중 -->
                <div class="kpi-card">
                    <span class="kpi-label">현금비중</span>
                    <span class="kpi-value">{{ cashRatio.toFixed(1) }}%</span>
                </div>
                <!-- 3. 총손익 -->
                <div class="kpi-card">
                    <span class="kpi-label">총손익</span>
                    <span class="kpi-value" :class="totalPnLClass">
                        {{ formatKRW(totalPnL) }} ({{ totalPnLPercent >= 0 ? '+' : '' }}{{ totalPnLPercent.toFixed(2) }}%)
                    </span>
                </div>
                <!-- 4. 환율 -->
                <div class="kpi-card">
                    <span class="kpi-label">환율</span>
                    <div class="kpi-value fx-rates">
                        <div>USD/KRW {{ formatNumber(fxRates.USDKRW) }}</div>
                        <div>EUR/KRW {{ formatNumber(fxRates.EURKRW) }}</div>
                    </div>
                </div>
                <!-- 5. 장단기 금리차 -->
                <div class="kpi-card">
                    <span class="kpi-label">10Y-2Y 스프레드</span>
                    <span class="kpi-value" :class="spreadClass">
                        {{ rates.spread10y2y >= 0 ? '+' : '' }}{{ rates.spread10y2y.toFixed(2) }}%
                    </span>
                    <span class="kpi-sub">10Y: {{ rates.US10Y.toFixed(2) }}% / 2Y: {{ rates.US2Y.toFixed(2) }}%</span>
                </div>
            </div>
        </section>

        <!-- C. 보유자산 테이블 -->
        <section class="holdings-section">
            <!-- 국내 자산 -->
            <div class="holdings-group">
                <h2 class="group-title">
                    국내 (KR)
                    <span class="group-summary">(원금: {{ formatKRW(domesticCost) }} | 평가액: {{ formatKRW(domesticValue) }})</span>
                </h2>
                <div class="table-wrapper">
                    <table class="holdings-table">
                        <thead>
                            <tr>
                                <th>종목명</th>
                                <th>티커</th>
                                <th class="num">수량</th>
                                <th class="num">평단</th>
                                <th class="num">현재가</th>
                                <th class="num">평가액(KRW)</th>
                                <th class="num">손익</th>
                                <th class="num">비중</th>
                                <th>메모</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in domesticHoldings" :key="item.ticker">
                                <td>{{ item.name }}</td>
                                <td class="ticker">{{ item.ticker }}</td>
                                <td class="num">{{ formatNumber(item.quantity) }}</td>
                                <td class="num">{{ formatNumber(item.avgPrice) }}</td>
                                <td class="num">{{ formatNumber(item.lastPrice) }}</td>
                                <td class="num">{{ formatKRW(item.valueKRW) }}</td>
                                <td class="num" :class="getPnLClass(item.pnlKRW)">
                                    {{ formatKRW(item.pnlKRW) }} ({{ item.pnlPercent >= 0 ? '+' : '' }}{{ item.pnlPercent.toFixed(2) }}%)
                                </td>
                                <td class="num">{{ item.weight.toFixed(1) }}%</td>
                                <td class="memo">{{ item.memo }}</td>
                            </tr>
                            <tr v-if="domesticHoldings.length === 0">
                                <td colspan="9" class="empty">국내 보유 자산이 없습니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 해외 자산 -->
            <div class="holdings-group">
                <h2 class="group-title">
                    해외 (US/EU)
                    <span class="group-summary">(원금: {{ formatKRW(foreignCost) }} | 평가액: {{ formatKRW(foreignValue) }})</span>
                </h2>
                <div class="table-wrapper">
                    <table class="holdings-table">
                        <thead>
                            <tr>
                                <th>종목명</th>
                                <th>티커</th>
                                <th class="num">수량</th>
                                <th class="num">평단</th>
                                <th class="num">현재가</th>
                                <th class="num">평가액(KRW)</th>
                                <th class="num">손익</th>
                                <th class="num">비중</th>
                                <th>메모</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in foreignHoldings" :key="item.ticker">
                                <td>{{ item.name }}</td>
                                <td class="ticker">{{ item.ticker }}</td>
                                <td class="num">{{ formatNumber(item.quantity) }}</td>
                                <td class="num">{{ formatNumber(item.avgPrice) }}</td>
                                <td class="num">{{ formatNumber(item.lastPrice) }}</td>
                                <td class="num">{{ formatKRW(item.valueKRW) }}</td>
                                <td class="num" :class="getPnLClass(item.pnlKRW)">
                                    {{ formatKRW(item.pnlKRW) }} ({{ item.pnlPercent >= 0 ? '+' : '' }}{{ item.pnlPercent.toFixed(2) }}%)
                                </td>
                                <td class="num">{{ item.weight.toFixed(1) }}%</td>
                                <td class="memo">{{ item.memo }}</td>
                            </tr>
                            <tr v-if="foreignHoldings.length === 0">
                                <td colspan="9" class="empty">해외 보유 자산이 없습니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 현금 -->
            <div class="holdings-group">
                <h2 class="group-title">
                    현금 (CASH)
                    <span class="group-summary">(KRW: {{ formatKRW(cashKRW) }} | USD: {{ formatUSD(cashUSD) }})</span>
                </h2>
                <div class="table-wrapper">
                    <table class="holdings-table cash-table">
                        <thead>
                            <tr>
                                <th>구분</th>
                                <th>통화</th>
                                <th class="num">금액</th>
                                <th class="num">평가액(KRW)</th>
                                <th class="num">비중</th>
                                <th>메모</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in cashHoldings" :key="item.id">
                                <td>{{ item.name }}</td>
                                <td>{{ item.currency }}</td>
                                <td class="num">{{ formatNumber(item.quantity) }}</td>
                                <td class="num">{{ formatKRW(item.valueKRW) }}</td>
                                <td class="num">{{ item.weight.toFixed(1) }}%</td>
                                <td class="memo">{{ item.memo }}</td>
                            </tr>
                            <tr v-if="cashHoldings.length === 0">
                                <td colspan="6" class="empty">현금 자산이 없습니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { getDocument, getDocuments } from '../../firebase/firebase-app.js'

// SEO - noindex 적용
useHead({
    title: 'My Index | Rocky\'s Blog',
    meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'description', content: 'Personal portfolio dashboard' }
    ]
})

// 상태
const loading = ref(true)
const syncing = ref(false)
const lastUpdated = ref('-')

// Cloud Functions URL
const SYNC_URL = 'https://asia-northeast3-today-9d9e5.cloudfunctions.net/syncMyIndexManual'

// Firestore 데이터
const holdings = ref([])

const fxRates = ref({
    USDKRW: 0,
    EURKRW: 0,
    timestamp: null
})

const rates = ref({
    US10Y: 0,
    US2Y: 0,
    spread10y2y: 0,
    timestamp: null
})

// 계산된 속성
const formattedToday = computed(() => {
    const today = new Date()
    return today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })
})

// 국내/해외 분리 (비중 내림차순 정렬, 현금 제외)
const domesticHoldings = computed(() => {
    return processHoldings(holdings.value.filter(h => h.market === 'KR' && h.enabled && h.assetType !== 'CASH'))
})

const foreignHoldings = computed(() => {
    return processHoldings(holdings.value.filter(h => h.market !== 'KR' && h.enabled && h.assetType !== 'CASH'))
})

// 현금 목록
const cashHoldings = computed(() => {
    const total = totalAssets.value
    return holdings.value
        .filter(h => h.enabled && h.assetType === 'CASH')
        .map(h => {
            let valueKRW = h.quantity || 0
            if (h.currency === 'USD') valueKRW = (h.quantity || 0) * fxRates.value.USDKRW
            if (h.currency === 'EUR') valueKRW = (h.quantity || 0) * fxRates.value.EURKRW
            return {
                ...h,
                valueKRW,
                weight: total > 0 ? (valueKRW / total) * 100 : 0
            }
        })
        .sort((a, b) => b.valueKRW - a.valueKRW)
})

// 국내 원금/평가액
const domesticCost = computed(() => {
    return holdings.value
        .filter(h => h.market === 'KR' && h.enabled && h.assetType !== 'CASH')
        .reduce((sum, h) => sum + ((h.valueKRW || 0) - (h.pnlKRW || 0)), 0)
})

const domesticValue = computed(() => {
    return holdings.value
        .filter(h => h.market === 'KR' && h.enabled && h.assetType !== 'CASH')
        .reduce((sum, h) => sum + (h.valueKRW || 0), 0)
})

// 해외 원금/평가액
const foreignCost = computed(() => {
    return holdings.value
        .filter(h => h.market !== 'KR' && h.enabled && h.assetType !== 'CASH')
        .reduce((sum, h) => sum + ((h.valueKRW || 0) - (h.pnlKRW || 0)), 0)
})

const foreignValue = computed(() => {
    return holdings.value
        .filter(h => h.market !== 'KR' && h.enabled && h.assetType !== 'CASH')
        .reduce((sum, h) => sum + (h.valueKRW || 0), 0)
})

// 현금 통화별 합계
const cashKRW = computed(() => {
    return holdings.value
        .filter(h => h.enabled && h.assetType === 'CASH' && h.currency === 'KRW')
        .reduce((sum, h) => sum + (h.quantity || 0), 0)
})

const cashUSD = computed(() => {
    return holdings.value
        .filter(h => h.enabled && h.assetType === 'CASH' && h.currency === 'USD')
        .reduce((sum, h) => sum + (h.quantity || 0), 0)
})

// 현금 계산 (CASH 항목의 quantity가 금액)
const totalCashKRW = computed(() => {
    return holdings.value
        .filter(h => h.enabled && h.assetType === 'CASH')
        .reduce((sum, h) => {
            if (h.currency === 'KRW') return sum + (h.quantity || 0)
            if (h.currency === 'USD') return sum + (h.quantity || 0) * fxRates.value.USDKRW
            if (h.currency === 'EUR') return sum + (h.quantity || 0) * fxRates.value.EURKRW
            return sum
        }, 0)
})

// 총자산 계산 (투자자산 valueKRW + 현금)
const totalAssets = computed(() => {
    const investmentValue = holdings.value
        .filter(h => h.enabled && h.assetType !== 'CASH')
        .reduce((sum, h) => sum + (h.valueKRW || 0), 0)
    return investmentValue + totalCashKRW.value
})

// 현금비중
const cashRatio = computed(() => {
    if (totalAssets.value === 0) return 0
    return (totalCashKRW.value / totalAssets.value) * 100
})

// 총손익 (Sheets에서 계산된 pnlKRW 사용, 현금 제외)
const totalPnL = computed(() => {
    return holdings.value
        .filter(h => h.enabled && h.assetType !== 'CASH')
        .reduce((sum, h) => sum + (h.pnlKRW || 0), 0)
})

// 총 투자원금 (valueKRW - pnlKRW, 현금 제외)
const totalCost = computed(() => {
    return holdings.value
        .filter(h => h.enabled && h.assetType !== 'CASH')
        .reduce((sum, h) => sum + ((h.valueKRW || 0) - (h.pnlKRW || 0)), 0)
})

const totalPnLPercent = computed(() => {
    if (totalCost.value === 0) return 0
    return (totalPnL.value / totalCost.value) * 100
})

const totalPnLClass = computed(() => ({
    'positive': totalPnL.value > 0,
    'negative': totalPnL.value < 0
}))

const spreadClass = computed(() => ({
    'positive': rates.value.spread10y2y > 0,
    'negative': rates.value.spread10y2y < 0
}))

// 유틸리티 함수
function getValueKRW(holding) {
    const value = holding.quantity * holding.lastPrice
    if (holding.currency === 'KRW') return value
    if (holding.currency === 'USD') return value * fxRates.value.USDKRW
    if (holding.currency === 'EUR') return value * fxRates.value.EURKRW
    return value
}

function getCostKRW(holding) {
    const cost = holding.quantity * holding.avgPrice
    if (holding.currency === 'KRW') return cost
    if (holding.currency === 'USD') return cost * fxRates.value.USDKRW
    if (holding.currency === 'EUR') return cost * fxRates.value.EURKRW
    return cost
}

function getPnLKRW(holding) {
    return getValueKRW(holding) - getCostKRW(holding)
}

function processHoldings(list) {
    const total = totalAssets.value
    return list
        .map(h => ({
            ...h,
            valueKRW: getValueKRW(h),
            pnlKRW: getPnLKRW(h),
            pnlPercent: getCostKRW(h) > 0 ? (getPnLKRW(h) / getCostKRW(h)) * 100 : 0,
            weight: total > 0 ? (getValueKRW(h) / total) * 100 : 0
        }))
        .sort((a, b) => b.weight - a.weight)
}

function formatKRW(value) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0
    }).format(value)
}

function formatUSD(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    }).format(value)
}

function formatNumber(value) {
    return new Intl.NumberFormat('ko-KR').format(value)
}

function getPnLClass(pnl) {
    return {
        'positive': pnl > 0,
        'negative': pnl < 0
    }
}

async function syncData() {
    syncing.value = true
    try {
        const response = await fetch(SYNC_URL)
        const result = await response.json()
        if (result.success) {
            await loadData()
        } else {
            console.error('Sync failed:', result.error)
        }
    } catch (error) {
        console.error('Sync request failed:', error)
    } finally {
        syncing.value = false
    }
}

async function loadData() {
    loading.value = true
    try {
        // 1. Holdings 데이터 로드
        const holdingsData = await getDocuments('users/owner/holdings')
        holdings.value = holdingsData

        // 2. 환율 데이터 로드
        const fxDoc = await getDocument('market', 'fx')
        if (fxDoc.exists()) {
            const fxData = fxDoc.data()
            fxRates.value = {
                USDKRW: fxData.USDKRW || 0,
                EURKRW: fxData.EURKRW || 0,
                timestamp: fxData.timestamp
            }
            // 마지막 갱신 시간 표시
            if (fxData.timestamp) {
                const ts = fxData.timestamp.toDate ? fxData.timestamp.toDate() : new Date(fxData.timestamp)
                lastUpdated.value = ts.toLocaleString('ko-KR')
            }
        }

        // 3. 금리 데이터 로드
        const ratesDoc = await getDocument('market', 'rates')
        if (ratesDoc.exists()) {
            const ratesData = ratesDoc.data()
            rates.value = {
                US10Y: ratesData.US10Y || 0,
                US2Y: ratesData.US2Y || 0,
                spread10y2y: ratesData.spread10y2y || 0,
                timestamp: ratesData.timestamp
            }
        }

    } catch (error) {
        console.error('Failed to load data:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadData()
})
</script>

<style scoped>
.my-index-page {
    padding: var(--spacing-xl) var(--spacing-md);
    max-width: 1400px;
    margin: 0 auto;
}

/* 로딩 상태 */
.loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
}

/* 상단 바 */
.top-bar {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

.today {
    color: var(--color-primary);
    font-weight: 500;
}

.separator {
    color: var(--color-text-muted);
}

.last-updated {
    color: var(--color-text-tertiary);
}

.sync-btn {
    margin-left: auto;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.sync-btn:hover:not(:disabled) {
    background: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
}

.sync-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* KPI 섹션 */
.kpi-section {
    margin-bottom: var(--spacing-xl);
}

.kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
}

.kpi-card {
    background: var(--color-card);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    border: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.kpi-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: 500;
}

.kpi-value {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-primary);
}

.kpi-value.positive {
    color: var(--color-success);
}

.kpi-value.negative {
    color: var(--color-error);
}

.kpi-sub {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
}

.fx-rates {
    font-size: var(--font-size-base);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

/* 보유자산 섹션 */
.holdings-section {
    margin-bottom: var(--spacing-xl);
}

.holdings-group {
    margin-bottom: var(--spacing-xl);
}

.group-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-sm);
    border-left: 3px solid var(--color-accent);
}

.group-summary {
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--color-text-secondary);
    margin-left: var(--spacing-sm);
}

.table-wrapper {
    overflow-x: auto;
    background: var(--color-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
}

.holdings-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
}

.holdings-table th,
.holdings-table td {
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
    border-bottom: 1px solid var(--color-border-light);
}

.holdings-table th {
    background: var(--color-bg-secondary);
    font-weight: 600;
    color: var(--color-text-secondary);
    white-space: nowrap;
}

.holdings-table td.num,
.holdings-table th.num {
    text-align: right;
}

.holdings-table .ticker {
    font-family: monospace;
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
}

.holdings-table .memo {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text-tertiary);
}

.holdings-table .empty {
    text-align: center;
    color: var(--color-text-muted);
    padding: var(--spacing-xl);
}

.holdings-table .positive {
    color: var(--color-success);
}

.holdings-table .negative {
    color: var(--color-error);
}

.holdings-table tbody tr:hover {
    background: var(--color-bg-secondary);
}


/* 반응형 */
@media (max-width: 768px) {
    .my-index-page {
        padding: var(--spacing-md) var(--spacing-sm);
    }

    .top-bar {
        flex-direction: column;
        align-items: flex-start;
    }

    .kpi-grid {
        grid-template-columns: 1fr 1fr;
    }

    .kpi-value {
        font-size: var(--font-size-lg);
    }

    .holdings-table {
        font-size: var(--font-size-xs);
    }

    .holdings-table th,
    .holdings-table td {
        padding: var(--spacing-xs) var(--spacing-sm);
    }
}

@media (max-width: 480px) {
    .kpi-grid {
        grid-template-columns: 1fr;
    }
}
</style>
