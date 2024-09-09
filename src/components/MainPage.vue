<template lang="">
    <div class="row"> 
        <div class="col-4"> 
            <div class="circle-image">
                <img alt="profile image" src="../assets/profile.jpeg" />
            </div>
        </div>

        <div class="col-8">
            <h5> <b> 이용림🌿  </b></h5>
            <quote> 어제보다 나은 내가 됩시다.</quote>
            <p> 인생에서 제일 중요한 것은 가족과 내 주변 사람과의 관계라고 생각합니다.  <br/>
                디지털 세계에서 일하지만 현실 세계에서의 관계가 더욱 중요합니다. <br/>
                어떻게 하면 일을 잘 하는 것일까 고민하는 개발 노동자입니다.</p>

            <ul>
                <li> https://github.com/amissu89 </li> 
                <li> https://yonglimlee.tistory.com/ </li>
                <li> X @termidator1 </li>
                <li> Instagram @amissu89</li>
            </ul>

        </div>

    </div>
    
</template>
<script setup>
</script>
<style>
.circle-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    /* 이미지가 영역을 넘어가지 않게 */
}

.circle-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 이미지 비율을 유지하며 잘라내기 */
    filter: grayscale(100%);
    /* 이미지를 흑백으로 만듦 */
}
</style>