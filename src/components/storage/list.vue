<template lang="pug">
    el-container
        el-header(style={})
            el-button(type="primary") 上传
            el-button() 新建文件夹

        el-main
</template>

<script>
export default {
    name: "list",
    data() {
        return {
            path: '/',
            tableData: []
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            let _this = this;
            _this.getRequest(`/storage/fileList?path=${_this.path}`).then(resp => {
                console.log(resp);
            })
        }
    }
}
</script>

<style scoped>

</style>
