<template>
    <div class="mortgage-calculator container">
        <div class="page-header">
            <router-link to="/tools/calculator" class="back-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                Back to Calculator
            </router-link>
            <h1>대출 계산기</h1>
            <p class="subtitle">다양한 상환 방식과 시나리오를 비교해보세요</p>
        </div>

        <!-- Input Form -->
        <div class="calculator-form card">
            <h3>대출 구성 요소 입력</h3>

            <div class="form-row">
                <div class="form-group">
                    <label>대출금액 (원)</label>
                    <input
                        :value="formattedLoanAmount"
                        @input="updateLoanAmount"
                        type="text"
                        class="form-control"
                        placeholder="100,000,000"
                    >
                    <div class="quick-buttons">
                        <button @click="addAmount(1000000)" type="button" class="btn btn-outline-secondary btn-xs">+100만</button>
                        <button @click="addAmount(10000000)" type="button" class="btn btn-outline-secondary btn-xs">+1000만</button>
                        <button @click="addAmount(100000000)" type="button" class="btn btn-outline-secondary btn-xs">+1억</button>
                        <button @click="resetLoanAmount" type="button" class="btn btn-outline-danger btn-xs">초기화</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>연 이자 (%)</label>
                    <input
                        v-model.number="interestRate"
                        type="number"
                        class="form-control"
                        placeholder="3.5"
                        step="0.1"
                    >
                    <div class="quick-buttons">
                        <button @click="adjustInterestRate(0.1)" type="button" class="btn btn-outline-secondary btn-xs">+0.1</button>
                        <button @click="adjustInterestRate(-0.1)" type="button" class="btn btn-outline-secondary btn-xs">-0.1</button>
                        <button @click="resetInterestRate" type="button" class="btn btn-outline-danger btn-xs">초기화</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>대출 기간 (월)</label>
                    <input
                        v-model.number="loanPeriod"
                        type="number"
                        class="form-control"
                        placeholder="360"
                        step="12"
                    >
                    <div class="quick-buttons">
                        <button @click="setLoanPeriod(120)" type="button" class="btn btn-outline-secondary btn-xs">10년(120)</button>
                        <button @click="setLoanPeriod(240)" type="button" class="btn btn-outline-secondary btn-xs">20년(240)</button>
                        <button @click="setLoanPeriod(360)" type="button" class="btn btn-outline-secondary btn-xs">30년(360)</button>
                        <button @click="resetLoanPeriod" type="button" class="btn btn-outline-danger btn-xs">초기화</button>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>상환 방식</label>
                <div class="radio-group">
                    <div class="radio-option">
                        <label class="radio-label">
                            <input type="radio" v-model="repaymentType" value="equal-payment" name="repaymentType">
                            <span>원리금균등상환</span>
                        </label>
                        <p class="radio-description">매월 동일한 금액(원금+이자)을 상환합니다.</p>
                    </div>
                    <div class="radio-option">
                        <label class="radio-label">
                            <input type="radio" v-model="repaymentType" value="equal-principal" name="repaymentType">
                            <span>원금균등상환</span>
                        </label>
                        <p class="radio-description">매월 동일한 원금을 상환하며, 이자는 점차 감소합니다.</p>
                    </div>
                    <div class="radio-option">
                        <label class="radio-label">
                            <input type="radio" v-model="repaymentType" value="bullet" name="repaymentType">
                            <span>원금만기일시상환</span>
                        </label>
                        <p class="radio-description">매월 이자만 납부하고, 만기에 원금을 일시 상환합니다.</p>
                    </div>
                </div>
            </div>

            <button @click="calculate" class="btn btn-primary btn-calculate">
                계산하기
            </button>
        </div>

        <!-- Single Result Display -->
        <div v-if="currentResult && !comparisonMode" class="result-section">
            <div class="result-summary card">
                <h3>{{ getRepaymentTypeName(repaymentType) }}</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="label">총 상환금액</span>
                        <span class="value">{{ formatCurrency(currentResult.summary.totalPayment) }}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">총 이자금액</span>
                        <span class="value accent">{{ formatCurrency(currentResult.summary.totalInterest) }}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">월 상환금액</span>
                        <span class="value">{{ formatCurrency(currentResult.summary.avgMonthlyPayment) }}</span>
                    </div>
                </div>

                <!-- Quick Comparison -->
                <div v-if="quickComparison" class="quick-comparison">
                    <h4>상환 방식 비교</h4>
                    <div class="comparison-table-small">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>상환 방식</th>
                                    <th>총 상환액</th>
                                    <th>총 이자</th>
                                    <th>평균 월 상환액</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="method in quickComparison" :key="method.type" :class="{ 'highlight': method.type === repaymentType }">
                                    <td>{{ method.name }}</td>
                                    <td>{{ formatCurrency(method.totalPayment) }}</td>
                                    <td class="accent">{{ formatCurrency(method.totalInterest) }}</td>
                                    <td>{{ formatCurrency(method.avgMonthly) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="result-table card">
                <div class="table-header">
                    <h4>상환 스케쥴</h4>
                    <button @click="enableComparisonMode" class="btn btn-secondary btn-sm">
                        +비교
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>납입원금 (Principal)</th>
                                <th>이자 (Interest)</th>
                                <th>상환금 (Payment)</th>
                                <th>납입원금계 (Cumul. Principal)</th>
                                <th>잔금 (Balance)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in currentResult.schedule" :key="row.month">
                                <td>{{ row.month }}</td>
                                <td>{{ formatCurrency(row.principal) }}</td>
                                <td>{{ formatCurrency(row.interest) }}</td>
                                <td>{{ formatCurrency(row.payment) }}</td>
                                <td>{{ formatCurrency(row.cumulativePrincipal) }}</td>
                                <td>{{ formatCurrency(row.balance) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Comparison Mode -->
        <div v-if="comparisonMode" class="comparison-section">
            <div class="comparison-header">
                <h3>시나리오 비교</h3>
                <button @click="clearComparison" class="btn btn-secondary btn-sm">
                    Clear All
                </button>
            </div>

            <!-- Add Scenario Form -->
            <div class="add-scenario card">
                <h4>시나리오 추가</h4>
                <div class="scenario-inputs">
                    <input
                        :value="formattedScenarioLoanAmount"
                        @input="updateScenarioLoanAmount"
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="100,000,000"
                    >
                    <input
                        v-model.number="scenarioInterestRate"
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="Interest Rate"
                        step="0.1"
                    >
                    <select v-model="scenarioRepaymentType" class="form-control form-control-sm">
                        <option value="equal-payment">원리금균등상환</option>
                        <option value="equal-principal">원금균등상환</option>
                        <option value="bullet">원금만기일시상환</option>
                    </select>
                    <button @click="addScenario" class="btn btn-primary btn-sm">
                        Add
                    </button>
                </div>
            </div>

            <!-- Comparison Summary -->
            <div class="comparison-summary card">
                <h4>비교 요약</h4>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>시나리오</th>
                                <th>대출금액</th>
                                <th>이자</th>
                                <th>타입</th>
                                <th>총 상환금액</th>
                                <th>총 이자</th>
                                <th>월 평균 상환금액</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(scenario, index) in scenarios" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ formatCurrency(scenario.params.loanAmount) }}</td>
                                <td>{{ scenario.params.interestRate }}%</td>
                                <td>{{ getRepaymentTypeShortName(scenario.params.repaymentType) }}</td>
                                <td>{{ formatCurrency(scenario.result.summary.totalPayment) }}</td>
                                <td class="accent">{{ formatCurrency(scenario.result.summary.totalInterest) }}</td>
                                <td>{{ formatCurrency(scenario.result.summary.avgMonthlyPayment) }}</td>
                                <td>
                                    <button @click="removeScenario(index)" class="btn btn-danger btn-sm">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Stacked Bar Chart -->
            <div v-if="scenarios.length > 0" class="chart-section card">
                <h4>상환금액 비교</h4>
                <div class="chart-container">
                    <svg :width="chartWidth" :height="chartHeight" class="bar-chart">
                        <!-- Y-axis labels -->
                        <g class="y-axis">
                            <line
                                :x1="chartPadding.left"
                                :y1="chartPadding.top"
                                :x2="chartPadding.left"
                                :y2="chartHeight - chartPadding.bottom"
                                stroke="#ccc"
                            />
                            <text
                                v-for="tick in yAxisTicks"
                                :key="tick.value"
                                :x="chartPadding.left - 10"
                                :y="tick.y"
                                text-anchor="end"
                                class="axis-label"
                            >
                                {{ formatCurrencyShort(tick.value) }}
                            </text>
                        </g>

                        <!-- Bars -->
                        <g class="bars">
                            <g v-for="(scenario, index) in scenarios" :key="index">
                                <!-- Principal bar -->
                                <rect
                                    :x="getBarX(index)"
                                    :y="getBarY(scenario.result.summary.totalPayment)"
                                    :width="barWidth"
                                    :height="getBarHeight(scenario.params.loanAmount)"
                                    fill="#5A9F8A"
                                    class="bar-segment"
                                >
                                    <title>원금: {{ formatCurrency(scenario.params.loanAmount) }}</title>
                                </rect>
                                <!-- Interest bar -->
                                <rect
                                    :x="getBarX(index)"
                                    :y="getBarY(scenario.result.summary.totalInterest)"
                                    :width="barWidth"
                                    :height="getBarHeight(scenario.result.summary.totalInterest)"
                                    fill="#E07A5F"
                                    class="bar-segment"
                                >
                                    <title>이자: {{ formatCurrency(scenario.result.summary.totalInterest) }}</title>
                                </rect>
                                <!-- X-axis label -->
                                <text
                                    :x="getBarX(index) + barWidth / 2"
                                    :y="chartHeight - chartPadding.bottom + 20"
                                    text-anchor="middle"
                                    class="axis-label"
                                >
                                    시나리오 {{ index + 1 }}
                                </text>
                            </g>
                        </g>
                    </svg>

                    <!-- Legend below chart -->
                    <div class="chart-legend">
                        <div class="legend-item">
                            <span class="legend-color" style="background-color: #5A9F8A;"></span>
                            <span class="legend-text">원금</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color" style="background-color: #E07A5F;"></span>
                            <span class="legend-text">이자</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
    title: 'Mortgage Calculator | Rocky\'s Blog',
    meta: [
        {
            name: 'description',
            content: 'Calculate and compare mortgage repayment methods'
        }
    ]
})

// Form inputs
const loanAmount = ref(100000000)
const interestRate = ref(3.5)
const loanPeriod = ref(360)
const repaymentType = ref('equal-payment')

// Current result
const currentResult = ref(null)

// Comparison mode
const comparisonMode = ref(false)
const scenarios = ref([])
const scenarioLoanAmount = ref(100000000)
const scenarioInterestRate = ref(3.5)
const scenarioRepaymentType = ref('equal-payment')

// Chart dimensions
const chartWidth = ref(800)
const chartHeight = ref(400)
const chartPadding = { top: 40, right: 20, bottom: 60, left: 80 }

// Update chart width based on window size
function updateChartWidth() {
    const container = document.querySelector('.chart-container')
    if (container) {
        const containerWidth = container.offsetWidth
        chartWidth.value = Math.max(300, containerWidth - 40) // min 300px, subtract padding
    }
}

// Set up resize listener
onMounted(() => {
    updateChartWidth()
    window.addEventListener('resize', updateChartWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateChartWidth)
})

// Loan amount formatting
const formattedLoanAmount = computed(() => {
    return loanAmount.value.toLocaleString('ko-KR')
})

function updateLoanAmount(event) {
    const value = event.target.value.replace(/,/g, '')
    const numValue = parseInt(value) || 0
    loanAmount.value = numValue
}

function addAmount(amount) {
    loanAmount.value += amount
}

function resetLoanAmount() {
    loanAmount.value = 0
}

// Scenario loan amount formatting
const formattedScenarioLoanAmount = computed(() => {
    return scenarioLoanAmount.value.toLocaleString('ko-KR')
})

function updateScenarioLoanAmount(event) {
    const value = event.target.value.replace(/,/g, '')
    const numValue = parseInt(value) || 0
    scenarioLoanAmount.value = numValue
}

// Interest rate controls
function adjustInterestRate(amount) {
    interestRate.value = Math.max(0, parseFloat((interestRate.value + amount).toFixed(1)))
}

function resetInterestRate() {
    interestRate.value = 3.5
}

// Loan period controls
function setLoanPeriod(months) {
    loanPeriod.value = months
}

function resetLoanPeriod() {
    loanPeriod.value = 360
}

// Calculation functions
function calculateEqualPayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 100 / 12
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)

    const schedule = []
    let balance = principal
    let cumulativePrincipal = 0

    for (let month = 1; month <= months; month++) {
        const interest = balance * monthlyRate
        const principalPayment = monthlyPayment - interest
        cumulativePrincipal += principalPayment
        balance -= principalPayment

        schedule.push({
            month,
            payment: monthlyPayment,
            principal: principalPayment,
            interest,
            cumulativePrincipal,
            balance: Math.max(0, balance)
        })
    }

    return schedule
}

function calculateEqualPrincipal(principal, annualRate, months) {
    const monthlyRate = annualRate / 100 / 12
    const principalPayment = principal / months

    const schedule = []
    let balance = principal
    let cumulativePrincipal = 0

    for (let month = 1; month <= months; month++) {
        const interest = balance * monthlyRate
        const payment = principalPayment + interest
        cumulativePrincipal += principalPayment
        balance -= principalPayment

        schedule.push({
            month,
            payment,
            principal: principalPayment,
            interest,
            cumulativePrincipal,
            balance: Math.max(0, balance)
        })
    }

    return schedule
}

function calculateBulletPayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 100 / 12
    const monthlyInterest = principal * monthlyRate

    const schedule = []

    for (let month = 1; month <= months; month++) {
        const isLastMonth = month === months
        const principalPayment = isLastMonth ? principal : 0
        const payment = isLastMonth ? principal + monthlyInterest : monthlyInterest
        const cumulativePrincipal = isLastMonth ? principal : 0
        const balance = isLastMonth ? 0 : principal

        schedule.push({
            month,
            payment,
            principal: principalPayment,
            interest: monthlyInterest,
            cumulativePrincipal,
            balance
        })
    }

    return schedule
}

function calculate() {
    let schedule

    switch (repaymentType.value) {
        case 'equal-payment':
            schedule = calculateEqualPayment(loanAmount.value, interestRate.value, loanPeriod.value)
            break
        case 'equal-principal':
            schedule = calculateEqualPrincipal(loanAmount.value, interestRate.value, loanPeriod.value)
            break
        case 'bullet':
            schedule = calculateBulletPayment(loanAmount.value, interestRate.value, loanPeriod.value)
            break
    }

    const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0)
    const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0)

    currentResult.value = {
        schedule,
        summary: {
            totalPayment,
            totalInterest,
            avgMonthlyPayment: totalPayment / loanPeriod.value
        }
    }

    // Clear comparison mode when calculating
    comparisonMode.value = false
    scenarios.value = []
}

function enableComparisonMode() {
    comparisonMode.value = true
    if (currentResult.value) {
        scenarios.value.push({
            params: {
                loanAmount: loanAmount.value,
                interestRate: interestRate.value,
                repaymentType: repaymentType.value
            },
            result: currentResult.value
        })
    }
}

function addScenario() {
    let schedule

    switch (scenarioRepaymentType.value) {
        case 'equal-payment':
            schedule = calculateEqualPayment(scenarioLoanAmount.value, scenarioInterestRate.value, loanPeriod.value)
            break
        case 'equal-principal':
            schedule = calculateEqualPrincipal(scenarioLoanAmount.value, scenarioInterestRate.value, loanPeriod.value)
            break
        case 'bullet':
            schedule = calculateBulletPayment(scenarioLoanAmount.value, scenarioInterestRate.value, loanPeriod.value)
            break
    }

    const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0)
    const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0)

    scenarios.value.push({
        params: {
            loanAmount: scenarioLoanAmount.value,
            interestRate: scenarioInterestRate.value,
            repaymentType: scenarioRepaymentType.value
        },
        result: {
            schedule,
            summary: {
                totalPayment,
                totalInterest,
                avgMonthlyPayment: totalPayment / loanPeriod.value
            }
        }
    })
}

function removeScenario(index) {
    scenarios.value.splice(index, 1)
    if (scenarios.value.length === 0) {
        comparisonMode.value = false
    }
}

function clearComparison() {
    scenarios.value = []
    comparisonMode.value = false
}

// Chart calculations
const maxValue = computed(() => {
    if (scenarios.value.length === 0) return 0
    return Math.max(...scenarios.value.map(s => s.result.summary.totalPayment))
})

const barWidth = computed(() => {
    const availableWidth = chartWidth.value - chartPadding.left - chartPadding.right
    const barSpacing = 20
    return (availableWidth - (scenarios.value.length - 1) * barSpacing) / scenarios.value.length
})

const yAxisTicks = computed(() => {
    const numTicks = 5
    const tickInterval = maxValue.value / numTicks
    const ticks = []

    for (let i = 0; i <= numTicks; i++) {
        const value = i * tickInterval
        const y = chartHeight.value - chartPadding.bottom - (i / numTicks) * (chartHeight.value - chartPadding.top - chartPadding.bottom)
        ticks.push({ value, y })
    }

    return ticks
})

function getBarX(index) {
    const barSpacing = 20
    return chartPadding.left + index * (barWidth.value + barSpacing)
}

function getBarY(value) {
    const availableHeight = chartHeight.value - chartPadding.top - chartPadding.bottom
    const ratio = value / maxValue.value
    return chartHeight.value - chartPadding.bottom - (ratio * availableHeight)
}

function getBarHeight(value) {
    const availableHeight = chartHeight.value - chartPadding.top - chartPadding.bottom
    const ratio = value / maxValue.value
    return ratio * availableHeight
}

// Quick comparison for all 3 methods
const quickComparison = computed(() => {
    if (!currentResult.value || !loanAmount.value || !interestRate.value || !loanPeriod.value) {
        return null
    }

    const methods = [
        { type: 'equal-payment', name: '원리금균등상환', calc: calculateEqualPayment },
        { type: 'equal-principal', name: '원금균등상환', calc: calculateEqualPrincipal },
        { type: 'bullet', name: '원금만기일시상환', calc: calculateBulletPayment }
    ]

    return methods.map(method => {
        const schedule = method.calc(loanAmount.value, interestRate.value, loanPeriod.value)
        const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0)
        const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0)

        return {
            type: method.type,
            name: method.name,
            totalPayment,
            totalInterest,
            avgMonthly: totalPayment / loanPeriod.value
        }
    })
})

// Formatting functions
function formatCurrency(value) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.round(value))
}

function formatCurrencyShort(value) {
    if (value >= 100000000) {
        return `${(value / 100000000).toFixed(1)}억`
    } else if (value >= 10000) {
        return `${(value / 10000).toFixed(0)}만`
    }
    return formatCurrency(value)
}

function getRepaymentTypeName(type) {
    const names = {
        'equal-payment': '원리금균등상환 (Equal Payment)',
        'equal-principal': '원금균등상환 (Equal Principal)',
        'bullet': '원금만기일시상환 (Bullet Payment)'
    }
    return names[type] || type
}

function getRepaymentTypeShortName(type) {
    const names = {
        'equal-payment': '원리금균등',
        'equal-principal': '원금균등',
        'bullet': '만기일시'
    }
    return names[type] || type
}
</script>

<style scoped>
.mortgage-calculator {
    padding: var(--spacing-2xl) var(--spacing-md);
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-lg);
    transition: color var(--transition-base);
}

.back-link:hover {
    color: var(--color-accent);
}

.page-header h1 {
    font-size: var(--font-size-4xl);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
}

.subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
}

.card {
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--color-border);
    margin-bottom: var(--spacing-xl);
}

.card h3, .card h4 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-lg);
    font-weight: 600;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
    color: var(--color-text);
    font-size: var(--font-size-sm);
}

.form-control {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    transition: border-color var(--transition-base);
}

.form-control:focus {
    outline: none;
    border-color: var(--color-accent);
}

.form-control-sm {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
}

.quick-buttons {
    display: flex;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-xs);
}

.radio-group {
    display: flex;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
    margin-top: var(--spacing-sm);
}

.radio-option {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.radio-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    cursor: pointer;
    font-size: var(--font-size-base);
    color: var(--color-text);
    font-weight: 500;
}

.radio-label input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--color-accent);
}

.radio-label:hover {
    color: var(--color-accent);
}

.radio-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
    margin-left: 26px;
    line-height: 1.4;
    max-width: 250px;
}

.btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
    font-size: var(--font-size-base);
}

.btn-xs {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
}

.btn-sm {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-sm);
}

.btn-primary {
    background-color: var(--color-accent);
    color: white;
}

.btn-primary:hover {
    background-color: #c96950;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.btn-secondary {
    background-color: var(--color-text-secondary);
    color: white;
}

.btn-secondary:hover {
    background-color: var(--color-primary);
}

.btn-outline-secondary {
    background-color: transparent;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
}

.btn-outline-secondary:hover {
    background-color: var(--color-text-secondary);
    color: white;
    border-color: var(--color-text-secondary);
}

.btn-danger {
    background-color: #dc3545;
    color: white;
}

.btn-danger:hover {
    background-color: #bb2d3b;
}

.btn-outline-danger {
    background-color: transparent;
    color: #dc3545;
    border: 1px solid #dc3545;
}

.btn-outline-danger:hover {
    background-color: #dc3545;
    color: white;
}

.btn-calculate {
    width: 100%;
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    font-size: var(--font-size-lg);
}

.result-summary {
    margin-top: var(--spacing-2xl);
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
}

.summary-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.summary-item .label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: 500;
}

.summary-item .value {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--color-primary);
}

.summary-item .value.accent {
    color: var(--color-accent);
}

.quick-comparison {
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--color-border);
}

.quick-comparison h4 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
}

.comparison-table-small {
    overflow-x: auto;
}

.comparison-table-small .table {
    font-size: var(--font-size-sm);
}

.comparison-table-small .table tbody tr {
    transition: background-color var(--transition-base);
}

.comparison-table-small .table tbody tr.highlight {
    background-color: rgba(224, 122, 95, 0.1);
    font-weight: 600;
}

.comparison-table-small .table tbody tr:hover {
    background-color: rgba(224, 122, 95, 0.05);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.table-responsive {
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table thead {
    background-color: var(--color-primary);
    color: white;
}

.table th, .table td {
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: right;
    border-bottom: 1px solid var(--color-border);
}

.table th:first-child, .table td:first-child {
    text-align: center;
}

.table tbody tr:hover {
    background-color: rgba(224, 122, 95, 0.05);
}

.table-sm th, .table-sm td {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
}

.comparison-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
}

.comparison-header h3 {
    color: var(--color-primary);
    font-weight: 700;
}

.add-scenario {
    margin-bottom: var(--spacing-xl);
}

.scenario-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: var(--spacing-md);
    align-items: end;
}

.accent {
    color: var(--color-accent);
}

.chart-container {
    overflow-x: auto;
    padding: var(--spacing-lg);
}

.bar-chart {
    max-width: 100%;
}

.bar-segment {
    transition: opacity var(--transition-base);
}

.bar-segment:hover {
    opacity: 0.8;
}

.axis-label {
    font-size: 12px;
    fill: var(--color-text-secondary);
}

.chart-legend {
    display: flex;
    justify-content: center;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.legend-color {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-sm);
    display: inline-block;
}

.legend-text {
    font-size: var(--font-size-base);
    color: var(--color-text);
    font-weight: 500;
}

@media (max-width: 768px) {
    .mortgage-calculator {
        padding: var(--spacing-xl) var(--spacing-sm);
    }

    .page-header h1 {
        font-size: var(--font-size-3xl);
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .summary-grid {
        grid-template-columns: 1fr;
    }

    .scenario-inputs {
        grid-template-columns: 1fr;
    }

    .table th, .table td {
        padding: var(--spacing-xs);
        font-size: var(--font-size-sm);
    }

    .chart-container {
        padding: var(--spacing-sm);
    }
}
</style>
