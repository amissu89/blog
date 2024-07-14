<template>
    <div class="container">
        <div v-if="loading">Loading...</div>
        <div v-else> 
            <h2>{{ meta.title }}</h2>
            <hr class="border border-dark border-1 opacity-100" />
            <p> 
                {{ new Date(meta.createDt).toLocaleString() }}  
                <span v-if="adminMode"> | 수정 </span>
                <span v-if="adminMode"> | 삭제 </span>
            </p>
            <ToastViewer :content="content.content"/>

            <button type="button" class="btn btn-outline-dark" @click="goRoute">목록으로</button>
        </div>
        
    </div>
</template>

<script setup>
import { useRoute} from 'vue-router'
import { onMounted, ref } from 'vue'
import {getDocument} from '../../firebase/firestore'
import { observeAuthState } from '../../firebase/auth'
import  Constant from '../../constant.js'
import ToastViewer from '../toast/ToastViewer.vue'

const route = useRoute()

const id = ref('')
const meta = ref('')
const content = ref('')
const loading = ref(true)
const adminMode = ref(false)

onMounted( async() =>{

    observeAuthState( async() => {
        observeAuthState( (user) =>{
            if(user){
                adminMode.value = true
            }
        })
    })
    try{
        id.value = route.params.id

        const docSnapshot = await getDocument(Constant.TIL_BOARD_META, id.value)
        if (docSnapshot.exists()) {
        meta.value = docSnapshot.data()

        const contentSnapshot = await getDocument(Constant.TIL_BOARD_CONTENT, id.value)
        if(contentSnapshot.exists()){
            content.value = contentSnapshot.data()
        }
        } else {
            console.log('No such document')
        }
    }
    catch(error){
        console.error("Error fetching document : " , error)
    } finally {
        loading.value = false
    }

})

</script>

<style>
    
</style>