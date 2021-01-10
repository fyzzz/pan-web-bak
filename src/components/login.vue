<template>
    <el-form :rules="rules" :model="loginForm" class="login-container" label-position="left"
             label-width="0" v-loading="loading"
            >
        <h3 class="login_title">系统登录</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username"
                      placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password"
                      placeholder="密码" @keyup.enter.native="submitClick"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%" @click="submitClick">登录</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import md5 from 'js-md5';
    export default{
        data(){
            return {
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                },
                loginForm: {
                    username: '',
                    password: ''
                },
                loading: false,
                name:''
            }
        },
        methods: {
            submitClick: function () {
                let _this = this;
                this.postRequest('/login',{
                    username: _this.loginForm.username,
                    password:md5(_this.loginForm.password)
                }).then(resp => {
                   if(resp && resp.data.status === 1){
                       let user = resp.data.data;
                       //需要webSocket的页面自己去连接
                       //this.connectSocket(user.id);
                       this.$store.commit('login', user);
                       this.$router.push('/home');
                   } else {
                       this.$message({
                           message:resp.data.msg,
                           type:'error'
                       });
                   }
                });
            }
        }
    }
</script>
<style>
    .login-container {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .login_title {
        margin: 0 auto 40px auto;
        text-align: center;
        color: #505458;
    }
    .login_remember {
        margin: 0 0 35px 0;
        text-align: left;
    }
</style>