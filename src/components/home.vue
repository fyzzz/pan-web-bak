<template>
    <el-container>
        <el-header style="margin-top: 0">
            <div style="">
                <el-menu :default-active="defaultActive"
                         class="el-menu-demo"
                         mode="horizontal"
                         router
                         >
                    <el-menu-item v-for="(item,i) in menuList" :key="i" :index="item.name">
                        {{ item.menuItem }}
                    </el-menu-item>
                    <div style="float: right;margin: auto 10px">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            你好，{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="logout">登出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-menu>
            </div>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
        <el-footer>footer</el-footer>
    </el-container>
</template>


<script>
    export default {
        name: "home",
        data() {
            return {
                activeIndex: '1',
                activeIndex2: '1',
                menuList:[
                    {name:'/fileList',menuItem:'文件列表'},
                    {name:'/personal',menuItem:'个人中心'},
                ],
                defaultActive:'/fileList',
                username:''
            }
        },
        mounted() {
            let _this = this;
            this.$router.push(_this.defaultActive);
            this.username=this.$store.state.user.username;
        },
        methods : {
            handleCommand(val){
                if(val === 'logout'){
                    this.logout();
                }
            },
            logout(){
                this.postRequest("/logout",{}).then(resp => {
                    if(resp && resp.data.status === 1){
                        this.$store.commit('logout');
                        this.$router.push('/');
                    } else {
                        this.$message({
                            message:resp.data.msg,
                            type:'error'
                        });
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .el-dropdown-link {
        cursor: pointer;
        /*color: #409EFF;*/
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>