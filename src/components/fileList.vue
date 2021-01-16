<template>
    <div>
        <div class="file-upload">
            <el-upload
                    :action="formAction"
                    ref="upload"
                    name="uploadFile"
                    :auto-upload="false"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :on-change="handleChange"
                    :file-list="fileList"
            >
                <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                <el-input size="small" style="margin-left: 10px;display: inline-block;width: 150px" v-model="uploadRemark" placeholder="请输入备注"></el-input>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            </el-upload>
        </div>
        <div>
            <el-input
                    size="small"
                    style="display: inline-block;width: 150px"
                    v-model="query.fileUploadName" placeholder="请输入文件名">
            </el-input>
            <el-input
                    size="small"
                    style="margin-left: 10px;display: inline-block;width: 150px"
                    v-model="query.remark" placeholder="请输入备注">
            </el-input>
            <el-button style="margin-left: 10px;" icon="el-icon-search" size="small" @click="refresh">搜索</el-button>
            <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="id"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="上传时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="fileUploadName"
                        label="文件名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="owner.username"
                        label="归属人"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="备注">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="downloadFile(scope.row)" type="text" size="small">下载</el-button>
                        <el-button @click="deleteFile(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    style="text-align: center;"
                    layout="prev, pager, next"
                    :total="total"
                    :current-page="pageNum"
                    :page-size="pageSize"
                    @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import env from "@/env";
    export default {
        name: "upload",
        data(){
            return{
                fileList: [],
                tableData:[],
                total:0,
                pageNum:1,
                pageSize:5,
                uploadRemark:'',
                query:{
                    remark:'',
                    fileUploadName:'',
                },
                formAction: env.baseUrl + '/fileInfo/upload',
            }
        },
        mounted(){
           this.queryData();
        },
        methods: {
            submitUpload(){
                this.$refs.upload.submit();
            },
            handleChange(file, fileList) {
                this.fileList = fileList.slice(-1);
            },
            handleSuccess(response){
                let _this = this;
                axios.post(env.baseUrl + '/fileInfo/save',{
                    id: response.data,
                    remark: _this.uploadRemark
                }).then(resp => {
                    if(resp.data.status === 1){
                        _this.$message({
                            type: 'success',
                            message: '上传成功!'
                        });
                        _this.pageNum = 1;
                        _this.queryData();
                    } else {
                        _this.handleError();
                    }
                });
            },
            handleError(){
                this.$message({
                    type: 'error',
                    message: '上传失败!'
                });
            },
            handleCurrentChange(val){
                let _this = this;
                _this.pageNum = val;
                _this.queryData();
            },
            queryData(){
                let _this = this;
                axios.post(env.baseUrl + "/fileInfo/page?pageNum="+_this.pageNum
                    +"&pageSize="+_this.pageSize,_this.query).then(resp => {
                        if(resp.data.status === 1){
                            _this.tableData = resp.data.data.list;
                            _this.total = resp.data.data.total;
                        } else {
                            this.$message({
                                message: resp.data.msg,
                                type: 'error'
                            });
                        }
                })
            },
            downloadFile(row){
                window.top.location.href = env.baseUrl + "/fileInfo/download/"+row.id
            },
            deleteFile(row){
                let _this = this;
                _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.post(env.baseUrl + "/fileInfo/delete/"+row.id).then(resp => {
                        if(resp.data.status === 1){
                            _this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            _this.queryData();
                        } else {
                            this.$message({
                                message: resp.data.msg,
                                type: 'error'
                            });
                        }
                    });
                }).catch(() => {
                    _this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            refresh(){
                this.pageNum = 1;
                this.queryData();
            }
        }
    }
</script>

<style scoped>
.file-upload{
    width:355px;
    height: 90px;
}

</style>