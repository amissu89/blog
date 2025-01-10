<template>
    <div class="container">
        <table class="table">
            <tbody>
                <tr v-for="(row, index) in rows" :key="index" ref="tableRows">
                    <th scope="row" style="display: none;">{{ row.id }}</th>
                    <td @click="loadPost(row.id)"> {{row.title}}</td>
                    <td style="text-align:right;"> {{row.createDt}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import {nextTick, onMounted, ref} from 'vue'
import { useRouter} from 'vue-router'
import { getCollection, getDocumentsByOrdering, getDocumentsByQuery } from '../../firebase/firestore'
import  Constant  from '../../constant.js'
import {formatterForDatetime} from '../../utility.js'

const rows = ref([])
const tableRows = ref([])
const router = useRouter()

onMounted( async ()=>{

    const fetchItems = async() =>{
        const collection = getCollection(Constant.BOARD_INFO)
        const q = getDocumentsByOrdering( collection, "createDt", Constant.DESC)
        const querySnapshot = await getDocumentsByQuery(q);

        querySnapshot.forEach((doc) => {
            let obj = doc.data();
            obj.id = doc.id;
            obj.createDt = formatterForDatetime(new Date(obj.createDt))
            rows.value.push(obj);
        })
    }

    await fetchItems()

    //wait for the DOM to update
    await nextTick()

    tableRows.value.forEach(tr => {
        tr.addEventListener('mouseenter', () => {
            tr.classList.add('table-dark')
        })

        tr.addEventListener('mouseleave', () => {
            tr.classList.remove('table-dark')
        })
    })
})

const loadPost = (postId) =>{
    router.push({
        name: 'viewer',
        params: {
            id : postId
        }
    })
}


</script>



<style scoped>
.table tr:hover{
    cursor:pointer;
}
</style>