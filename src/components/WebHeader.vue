<template>
    <el-header class="header">
        <div class="logo">
            <a href="http://www.baidu.com"><img src="../assets/img1.png"></a>
        </div>
        <div class="title">
            <span>this is the name</span>
        </div>
        <div class="exit">
            <el-text size="large" style="margin-right: 20px;">您好! {{ props.username }}</el-text>
            <el-button v-if="tokenStore.token" type="danger" round @click="onBeforeExit">退出登录</el-button>
            <el-button v-if="!tokenStore.token" type="primary" round
                @click="router.push({ path: '/login' })">前往登录</el-button>
        </div>
    </el-header>
</template>
<script setup>
import { useUserStore } from '@/stores/user';
import { useTokenStore } from '@/stores/token';
import { useHomeStore } from '@/stores/home';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
const userStore = useUserStore()
const tokenStore = useTokenStore()
const homeStore = useHomeStore()
const router = useRouter()
const props = defineProps({
    username: {
        type: String,
        required: true
    }
});

const onBeforeExit = () => {
    console.log(homeStore.content);
    if (homeStore.content) {
        ElMessageBox.confirm(
            '退出登录会导致当前输入的文章信息丢失，是否继续?',
            'Warning',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            onExit()
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '取消操作',
            })
        })
    } else {
        onExit()
    }
}

const onExit = () => {
    ElMessage({
        type: 'success',
        message: '退出登录成功',
    })
    tokenStore.setToken('')
    userStore.setUserInfo({
        username: '游客',
        email: 'none',
        phoneNumber: 'none',
        unit: 'none',
    })
    router.push({ path: '/home/analyse' }).then(() => {
        localStorage.setItem("tab", "/home/analyse");
        window.location.reload();
    }).catch((err) => {
        console.error('Route change failed:', err);
    });
}
</script>
<style lang="scss" scoped>
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
</style>