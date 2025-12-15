<template lang="">
    <div>


        <div class="row">
            <h3>Language</h3>
            <p>
                OPIc, IM - 3, 2020.02 <br/>
            </p>
        </div>

        <div class="row">
            <h3>Education</h3>
            <p>
                한국기술교육대학교 Korea University of Technology and Education <br/>
                2008.03 ~ 2013.02 <br/>
                컴퓨터 공학부 학사 졸업 Bachelor's Degree in Computer Engineering
            </p>
        </div>

        <div class="row">
            <h3>Trainning & Experience</h3>
            <ul>
                <li>
                    <b>University Appropriate Technology Project</b> <br/>
                    2012.06 <br/>   
                    GIS Development Using Google Maps <br/>
                </li>

                <li>
                    <b>Dale Carnegie Training</b> <br/>
                    2012.02 <br/>
                    Leadership development and personal growth sessions focused on goal setting to achieve both short-term and long-term personal objectives. <br/>
                </li>
            </ul>

        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
/* Card Container */
.row {
    background-color: var(--color-card);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-slow);
    animation: fadeInUp 0.6s ease-out backwards;
}

.row:nth-child(1) { animation-delay: 0.1s; }
.row:nth-child(2) { animation-delay: 0.2s; }
.row:nth-child(3) { animation-delay: 0.3s; }

.row:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
}

/* Section Headers with Warm Gradient */
.row > h3 {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    color: #FFFFFF;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    position: relative;
    overflow: hidden;
}

.row > h3::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.row:hover > h3::before {
    left: 100%;
}

/* Content Text */
.row > p {
    font-size: var(--font-size-base);
    color: var(--color-text);
    line-height: 1.7;
}

/* List Styling */
.row > ul {
    margin-left: var(--spacing-lg);
    color: var(--color-text);
    line-height: 1.7;
    list-style-type: none;
    padding-left: 0;
}

.row > ul li {
    margin-bottom: var(--spacing-lg);
    padding-left: var(--spacing-lg);
    position: relative;
}

.row > ul li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--color-accent);
    font-size: var(--font-size-lg);
}

.row > ul li b {
    color: var(--color-primary);
    font-weight: 600;
    font-size: var(--font-size-lg);
}

/* Fade In Animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .row {
        padding: var(--spacing-lg);
    }

    .row > h3 {
        font-size: var(--font-size-lg);
    }
}
</style>