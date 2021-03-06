<template lang="pug">
    el-container
        el-main
            el-table(:data="tableData")
                el-table-column(
                    v-for="column in tableColumn"
                    :key="column.id"
                    :prop="column.prod"
                    :label="column.label")
            el-pagination(
                style="text-align: center;"
                layout="prev, pager, next"
                :total="total"
                :current-page="pageNum"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
            )
</template>

<script>
export default {
    name: "list",
    data() {
        const tableColumn = [
            {id: 'id', prod: 'id', label: 'id'},
            {id: 'recordContent', prod: 'recordContent', label: '内容'},
            {id: 'recordDate', prod: 'recordDate', label: '时间'},
        ];

        return {
            tableColumn: tableColumn,
            tableData: [],
            total: 1,
            pageNum: 1,
            pageSize: 10,
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            let _this = this;
            this.postRequest(`/daily-record/page?pageNum=${_this.pageNum}&pageSize=${_this.pageSize}`, {})
                .then(resp => {
                    if(resp.data.status === 1){
                        _this.tableData = resp.data.data.list;
                        _this.total = resp.data.data.total;
                    } else {
                        this.$message({
                            message: resp.data.msg,
                            type: 'error'
                        });
                    }
                });
        },
        handleCurrentChange(val){
            let _this = this;
            _this.pageNum = val;
            _this.getData();
        }
    }
}
</script>

<style scoped>

</style>