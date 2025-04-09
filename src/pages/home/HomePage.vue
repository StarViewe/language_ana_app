<template>
    <div class="common-layout">
        <el-container class="container">
            <WebHeader :username="username" />
            <el-container class="main-container">
                <el-aside class="aside" width="200px">
                    <el-menu :default-active="currentTab" class="el-menu-vertical-demo" router>
                        <el-menu-item index="/home/analyse" @click="MenuClickHandler('/home/analyse')">
                            <el-icon><icon-menu /></el-icon>
                            <span>文章分析</span>
                        </el-menu-item>
                        <el-menu-item index="/home/task" @click="MenuClickHandler('/home/task')">
                            <el-icon><icon-menu /></el-icon>
                            <span>任务进程</span>
                        </el-menu-item>
                        <el-menu-item index="/home/userinfo" @click="MenuClickHandler('/home/userinfo')">
                            <el-icon><icon-menu /></el-icon>
                            <span>用户信息</span>
                        </el-menu-item>
                        <el-menu-item v-if="username === 'administrator'" index="/home/admin"
                            @click="MenuClickHandler('/home/admin')">
                            <el-icon><icon-menu /></el-icon>
                            <span>用户管理</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main class="main">
                    <RouterView></RouterView>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import WebHeader from '@/components/WebHeader.vue';
import { RouterView } from 'vue-router';
import { Menu as IconMenu } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';
import { GetUserInfo } from '@/apis/user';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
const currentTab = localStorage.getItem("tab") || "/home/analyse"
let username = ref("游客")
onMounted(() => {
    GetUserInfo().then(res => {
        console.log(res);
        userStore.setUserInfo(res.data)
        localStorage.setItem("userInfo", JSON.stringify(res.data))
        username.value = res.data.username
    }).catch(err => {
        console.error(err);
    })
})

const MenuClickHandler = (val) => {
    localStorage.setItem("tab", val)
}
</script>
<style lang="scss" scoped>
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .header {
        height: 80px;
        background-color: rgb(240, 240, 240);
        border-bottom: 2px solid rgb(175, 175, 175);
        display: flex;
        flex-direction: row;

        .logo {
            width: 100px;
            height: 40px;
            transform: translateY(20px);
        }

        .title {
            transform: translateY(10px);
            margin-left: 20px;

            span {
                font-size: 40px;
            }
        }

        .exit {
            position: absolute;
            right: 0px;
            margin: 25px;
        }
    }

    .main-container {
        .aside {
            border-right: 1px solid rgb(138, 138, 138);
        }
    }
}
</style>