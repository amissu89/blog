<template>
    <nav class="navbar sticky-top navbar-expand-lg">
        <div class="container-fluid">
            <a href="#" class="navbar-brand">Archaiving</a>

            <!--모바일버전일때 메뉴 버튼-->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link"><button type="button" class="btn btn-outline-dark">Home</button></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/about" class="nav-link"><button type="button" class="btn btn-outline-dark">About</button></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/til" class="nav-link"><button type="button" class="btn btn-outline-dark">TIL;</button></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/diary" class="nav-link"><button type="button" class="btn btn-outline-dark">Diary</button></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/profile" class="nav-link"><button type="button" class="btn btn-outline-dark">Profile</button></router-link>
                    </li>

                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>

</script>
<style scoped>
.btn {
    margin-right: 1%;
}

</style>