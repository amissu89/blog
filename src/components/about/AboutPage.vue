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
body {
    background-color: #F4F4F5;
    font-family: 'Noto Sans KR', sans-serif;
    color: #2B2B2B;
}

.row {
    background-color: #FFFFFF;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 32px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.row > h3 {
    background-color: #2E2E2E;
    color: #FFFFFF;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 16px;
}

.row > p {
    font-size: 0.95rem;
    color: #444444;
    line-height: 1.6;
}

.row > ul {
    margin-left: 20px;
    color: #333333;
    line-height: 1.6;
}

.row > ul li {
    margin-bottom: 16px;
}

.row > ul li b {
    color: #2E2E2E;
    font-weight: 600;
}

</style>