<template lang="pug">
    el-container
        el-header(style="margin-top: 0")
            div
                el-menu(:default-active="defaultActive"
                    class="el-menu-demo"
                    mode="horizontal"
                    router)
                    el-menu-item(v-for="(item,i) in menuList" :key="i" :index="item.name") {{ item.menuItem }}
                    div(style="float: right;margin: auto 10px")
                        el-dropdown(@command="handleCommand")
                            span.el-dropdown-link 你好，{{username}}
                                i.el-icon-arrow-down.el-icon-arrow-down
                                el-dropdown-menu(slot="dropdown")
                                    el-dropdown-item(command="password") 修改密码
                                    el-dropdown-item(command="logout") 登出

            el-dialog(title="修改密码" :visible.sync="dialogPasswordVisible" width="450px" )
                el-form.password-form(:model="passwordForm" label-position="left" label-width="80px" :rules="rules" ref="passwordForm")
                    el-form-item(label="旧密码" prop="oldPassword")
                        el-input.w256(v-model="passwordForm.oldPassword" show-password)
                    el-form-item(label="新密码" prop="newPassword")
                        el-input.w256(v-model="passwordForm.newPassword" show-password )
                    el-form-item(label="确认密码" prop="confirmPassword")
                        el-input.w256(v-model="passwordForm.confirmPassword" show-password )
                div(slot="footer")
                    el-button(@click="dialogPasswordVisible=false") 取消
                    el-button(@click="submitForm" type="primary") 确定
        el-main
            router-view
        el-footer footer
</template>


<script>
import md5 from "js-md5";

export default {
    name: "home",
    data() {
        const validateNewPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else {
                if (this.passwordForm.newPassword !== '') {
                    this.$refs.passwordForm.validateField('confirmPassword');
                }
                callback();
            }
        };
        const validateConfirmPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入确认密码'));
            } else if (value !== this.passwordForm.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            activeIndex: '1',
            activeIndex2: '1',
            menuList: [
                {name: '/fileList', menuItem: '文件列表'},
                {name: '/personal', menuItem: '个人中心'},
            ],
            defaultActive: '/fileList',
            username: '',
            dialogPasswordVisible: false,
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            rules: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' },
                ],
                newPassword: [
                    { validator: validateNewPassword, trigger: 'blur' },
                ],
                confirmPassword: [
                    { validator: validateConfirmPassword, trigger: 'blur' },
                ],
            }
        }
    },
    mounted() {
        let _this = this;
        this.$router.push(_this.defaultActive);
        this.username = this.$store.state.user.username;
    },
    methods: {
        handleCommand(val) {
            if (val === 'logout') {
                this.logout();
            } else if (val === 'password') {
                this.dialogPasswordVisible = true;
            }
        },
        logout() {
            this.postFormRequest("/logout", {}).then(resp => {
                if (resp && resp.data.status === 1) {
                    this.$store.commit('logout');
                    this.$router.push('/');
                } else {
                    this.$message({
                        message: resp.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        submitForm() {
            this.$refs.passwordForm.validate((valid) => {
                if (valid) {
                    this.updatePassword();
                } else {
                    return false;
                }
            });
        },
        updatePassword() {
            let _this = this;
            _this.putRequest("/user-info/updatePassword", {
                oldPassword: md5(_this.passwordForm.oldPassword),
                newPassword: md5(_this.passwordForm.newPassword)
            }).then(resp => {
                if (resp.data.status === 1) {
                    _this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    _this.dialogPasswordVisible = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: resp.data.msg
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

.w256 {
    width: 256px;
}

.password-form {
    margin-left: 10px;
}
</style>