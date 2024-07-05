<template>
    <div class="container">
        <table class="table">
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td colspan="2">Larry the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>

const trList = document.getElementsByTagName('tr')

trList.forEach(tr => {
    tr.addEventListener('mouseenter', () => {
    
    })
})

</script>



<style scoped>

</style>