import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import '../theme/index.css';
import router from './router';
import store from './store';
import {MessageBox} from "element-ui";
import axios from 'axios';
import {postFormRequest, putRequest, postRequest} from "./util/api";
import {connectSocket} from "./util/api";

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.postFormRequest = postFormRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.connectSocket = connectSocket;

router.beforeEach((to,from,next) => {
    if(to.path === '/login'){
        next();
        return;
    }
    let user = store.state.user;
    if(user === '未登录'){
        if(to.meta.requireAuth){
            next({path:'/',query:{redirect:to.path}})
        } else {
            next();
        }
    } else {
        next();
    }
});

axios.interceptors.response.use(response => {
    return response;
},error => {
    if(error.response && error.response.status === 401){
        let errorInfo = error.response.data.msg;
        MessageBox.alert(errorInfo,"提示",{
            confirmButtonText:'确定',
            callback:() => {
                postFormRequest('/logout',{}).then(resp => {
                    if(resp && resp.data.status){
                        router.push("/login");
                    }
                })
            }
        })
    } else {
        return Promise.reject(error);
    }
});


new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app');
