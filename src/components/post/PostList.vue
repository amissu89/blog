<template>
    <div class="container">
        <table class="table">
            <tbody>
                <tr v-for="(row, index) in rows" :key="index" ref="tableRows">
                    <th scope="row" style="display: none;">{{ row.id }}</th>
                    <td class="category-cell"> [ {{ row.category }} ] </td>
                    <td @click="loadPost(row.id)"> {{ row.title }}</td>
                    <td style="text-align:right;"> {{ row.createDt }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>

import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCollection, getDocumentsByOrdering, getDocumentsByQuery } from '../../firebase/firestore'
import Constant from '../../constant.js'
import { formatterForDatetime } from '../../utility.js'

const rows = ref([])
const tableRows = ref([])
const router = useRouter()

onMounted(async () => {

    const fetchItems = async () => {
        const collection = getCollection(Constant.BOARD_INFO)
        const q = getDocumentsByOrdering(collection, "createDt", Constant.DESC)
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

const loadPost = (postId) => {
    router.push({
        name: 'viewer',
        params: {
            id: postId
        }
    })
}


</script>



<style scoped>
.table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 12px;
}

.table tr {
    background-color: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    transition: all 0.2s ease;
}

.table td {
    padding: 16px 20px;
    vertical-align: middle;
    color: #2B2B2B;
    border: none;
}


.table td:nth-child(2) {
    font-size: 0.9rem;
    font-weight: 500;
    color: #666;
    width: 120px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}

.table td:last-child {
    font-size: 0.85rem;
    color: #888;
    text-align: right;
    white-space: nowrap;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
}

.table tr:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
    cursor: pointer;
}

.table tr:hover td {
    background-color: #000000;
    color: #ffffff;
}

@media (max-width: 768px) {
    .table td {
        font-size: 0.9rem;
        padding: 12px 14px;
    }

    .table td:first-child {
        width: 90px;
    }

    .category-cell {
        display: none;
    }

    .table td:nth-child(3) {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }
}
</style>