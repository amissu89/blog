<template lang="">

    <div class="row">
        <!-- 프로필 이미지 -->
        <div class="col-12 col-md-4 text-center">
            <div class="circle-image">
                <img alt="profile image" src="../../assets/profile.png" />
            </div>
        </div>

        <!-- 설명글 -->
        <div class="col-12 col-md-8 description">
            <blockquote class="hero-quote">
                <p>어제보다 나은 내가 됩시다.</p>
                <p>Let's be better than yesterday.</p>
            </blockquote>

            <p class="bio"> 살면서 제일 중요한 것은 가족과 내 주변의 사람들과의 관계입니다.<br/>
                디지털 세계에서 일하지만 현실 세계의 관계들이 더욱 중요합니다.<br/>
                일을 어떻게 하면 더 잘할지에 대해 항상 고민하고 있습니다.</p>

            <p class="bio"> I think the most important thing in life is my family and relationships with people around me.<br/>
                I work in the digital world, but relationships in the real world are even more important.<br/>
                I am a developer who is thinking about how to do a good job.</p>

            <h5>Contact. </h5>
                <ul>
                <li @click="copyMail('yonglimlee@gmail.com')" class="clickable"><a href="#"> 📧 yonglimlee@gmail.com </a></li>
                </ul>

                <h5>Channel. </h5>
                <ul>
                <li> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>
                    <a href="https://github.com/amissu89" target="_blank" style="text-decoration:none;">
                         @amissu89  </a>
                        </li>

                <li> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
</svg> <a href="https://www.instagram.com/rocky.yonglim.lee/" target="_blank"> @rocky.yonglim.lee </a></li>

                <li> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
</svg> <a href="https://www.linkedin.com/in/yonglimlee/" target="_blank"> @yonglimlee </a></li>

            <li> 📻<a href="https://youtube.com/channel/UC_Otsw37_JmNC0mNiOsFXSA?si=2g-Vnrs-OI_Nx9A5" target="_blank">Podcast 보통부부(Botong Booboo) </a> </li>
            </ul>
        </div>
    </div>

</template>
<script setup>
import { useToast } from "vue-toastification";
import logger from '../../utils/logger.js';

const toast = useToast()

const copyMail = (email) => {
    logger.debug('Copying email:', email)
    navigator.clipboard.writeText(email)
        .then(() => {
            logger.info(`Email copied: ${email}`)
            toast.info('Email address copied to clipboard!')
        })
        .catch(err => {
            logger.error('Failed to copy email:', err)
        })
}

</script>
<style scoped>
.row {
    background-color: var(--color-card);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin: var(--spacing-xl) auto;
    box-shadow: var(--shadow-md);
    max-width: 960px;
    transition: box-shadow var(--transition-slow);
}

.row:hover {
    box-shadow: var(--shadow-lg);
}

/* Hero Quote Styling */
.hero-quote {
    margin: 0 0 var(--spacing-xl) 0;
    padding: var(--spacing-lg);
    padding-left: var(--spacing-xl);
    border-left: 4px solid var(--color-accent);
    background: linear-gradient(to right, var(--color-bg-secondary), transparent);
    border-radius: var(--radius-sm);
}

.hero-quote p {
    font-style: italic;
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    line-height: 1.6;
    margin: 0;
}

.hero-quote p:first-child {
    margin-bottom: var(--spacing-sm);
}

/* Bio Text */
.description p.bio {
    font-size: var(--font-size-base);
    color: var(--color-text);
    line-height: 1.7;
    margin-bottom: var(--spacing-lg);
}

/* Section Headers */
.description h5 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    position: relative;
    display: inline-block;
}

.description h5::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, var(--color-accent), var(--color-accent-light));
    border-radius: var(--radius-full);
}

.description h5:not(:first-of-type) {
    margin-top: var(--spacing-2xl);
}

/* List Styling */
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

ul li {
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-base);
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: transform var(--transition-base);
}

ul li:hover {
    transform: translateX(4px);
}

ul li.clickable {
    cursor: pointer;
}

ul li svg {
    flex-shrink: 0;
    color: var(--color-text-secondary);
    transition: color var(--transition-base);
}

ul li:hover svg {
    color: var(--color-accent);
}

/* Link Styling */
a {
    text-decoration: none;
    color: var(--color-text);
    transition: color var(--transition-base);
}

a:hover {
    color: var(--color-accent);
}

/* Profile Image */
.circle-image {
    width: 240px;
    height: 240px;
    border-radius: var(--radius-full);
    overflow: hidden;
    margin: auto;
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    box-shadow: var(--shadow-md);
    border: 5px solid var(--color-accent-light);
    transition: all var(--transition-slow);
}

.circle-image:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-glow);
    border-color: var(--color-accent);
}

.circle-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-full);
    object-position: 50% 42%;
}

@media (min-width: 768px) {
    .description {
        margin-top: var(--spacing-xl);
    }
}

@media (max-width: 768px) {
    .hero-quote p {
        font-size: var(--font-size-base);
    }

    .circle-image {
        width: 200px;
        height: 200px;
    }
}
</style>