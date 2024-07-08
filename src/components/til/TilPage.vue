<template>
    <div class="container">
        <table class="table">
            <tbody>
                <tr v-for="(row, index) in rows" :key="index" ref="tableRows">
                    <th scope="row" style="display: none;">{{ row.id }}</th>
                    <td> {{row.title}}</td>
                    <td> {{row.createDt}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import {nextTick, onMounted, ref} from 'vue'
import { getCollection, getDocumentsByOrdering, getDocumentsByQuery } from '../../firebase/firestore'
import  Constant  from '../../constant.js'
import {formatterForDatetime} from '../../utility.js'

const rows = ref([])
const tableRows = ref([])

onMounted( async ()=>{

    const fetchItems = async() =>{
        const collection = getCollection(Constant.TIL_BOARD_META)
        const q = getDocumentsByOrdering( collection, "createDt", Constant.DESC)
        const querySnapshot = await getDocumentsByQuery(q);

        querySnapshot.forEach((doc) => {
            let obj = doc.data();
            obj.id = doc.id;
            obj.createDt = formatterForDatetime(new Date(obj.createDt))
            rows.value.push(obj);
        })

        console.log(rows)
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


</script>



<style scoped>

</style>