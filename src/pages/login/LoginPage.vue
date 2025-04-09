<template>
    <div class="common-layout">
        <el-container class="container">
            <el-aside class="aside">
                <PageInfo />
            </el-aside>
            <el-main class="main">
                <div class="login-box">
                    <el-text size="large">{{ isLogin ? "登录" : "注册" }}</el-text>
                    <div class="login-form" v-if="isLogin">
                        <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="auto"
                            style="max-width: 600px">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="loginForm.username" placeholder="支持邮箱和手机号登录" />
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="loginForm.password" type="password" show-password
                                    placeholder="请输入密码" />
                            </el-form-item>
                            <el-form-item label="验证码" prop="captcha" class="validateMark">
                                <el-input v-model="loginForm.captcha" style="width: 60%;" placeholder="请输入验证码" />
                                <div @click="refreshCaptcha" class="validateImg"><img class="img-cover"
                                        :src="'data:image/png;base64,' + base64Image"></div>
                            </el-form-item>
                            <el-form-item>
                                <div class="button-box">
                                    <el-button type="primary" :loading="isLoginLoading"
                                        @click="onLogin(loginFormRef)">{{ loginButtonInfo
                                        }}</el-button>
                                    <el-button @click="onRegister(registerFormRef)">{{ registerButtonInfo }}</el-button>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="login-form" v-if="!isLogin">
                        <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="auto"
                            style="max-width: 600px">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="registerForm.username" placeholder="请使用邮箱作为用户名" />
                            </el-form-item>
                            <el-form-item label="手机号" prop="phoneNumber">
                                <el-input v-model="registerForm.phoneNumber" placeholder="支持手机号登录" />
                            </el-form-item>
                            <el-form-item label="密码" prop="password1">
                                <el-input v-model="registerForm.password1" type="password" show-password
                                    placeholder="请输入密码" />
                            </el-form-item>
                            <el-form-item label="确认密码" prop="password2">
                                <el-input v-model="registerForm.password2" type="password" show-password
                                    placeholder="请确认密码" />
                            </el-form-item>
                            <el-form-item label="所在单位" prop="unit">
                                <el-input v-model="registerForm.unit" placeholder="请输入所在单位" />
                            </el-form-item>
                            <!-- <el-form-item label="验证码" class="validateMark">
                                <el-input v-model="registerForm.validateMark" style="width: 60%;" />
                                <div class="validateImg"><img class="img-cover" src="../../assets/img1.png"></div>
                            </el-form-item> -->
                            <el-form-item>
                                <div class="button-box">
                                    <el-button type="primary" @click="onLogin(loginFormRef)">{{ loginButtonInfo
                                    }}</el-button>
                                    <el-button :loading="isRegisterLoading" @click="onRegister(registerFormRef)">{{
                                        registerButtonInfo }}</el-button>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import PageInfo from '@/components/PageInfo.vue';
import { getCaptcha, login, register } from '@/apis/user';
import { ElMessage } from 'element-plus';
import { useTokenStore } from '@/stores/token';
import { useRouter, useRoute } from 'vue-router';
//可以监听回车键来快速登录，同时管理下谷歌那个密码，好像要https传输
let base64Image = ref("")
let loginButtonInfo = ref("登录")
let registerButtonInfo = ref("前往注册")
let isLogin = ref(true)
const loginFormRef = ref()
const registerFormRef = ref()
let isLoginLoading = ref(false)
let isRegisterLoading = ref(false)
const router = useRouter()
const route = useRoute()
let tokenStore = null
onMounted(() => {
    tokenStore = useTokenStore()
    console.log(tokenStore.setTask);
})

const refreshCaptcha = () => {
    getCaptcha().then(res => {
        base64Image.value = res.data.captchaImage
        loginForm.key = res.data.key
    })
}

onMounted(() => {
    refreshCaptcha()
})

const changeToLogin = () => {
    loginButtonInfo.value = "登录"
    registerButtonInfo.value = "前往注册"
    isLogin.value = true
}
const changeToRegister = () => {
    loginButtonInfo.value = "前往登录"
    registerButtonInfo.value = "注册"
    isLogin.value = false
}
const loginForm: LoginData = reactive({
    username: '',
    password: '',
    captcha: '',
    key: ''
})
const registerForm: RegisterData = reactive({
    password1: "",
    password2: "",
    phoneNumber: "",
    unit: "",
    username: "",
})
const loginRules = reactive({
    username: [{ required: true, message: '请输入内容！', trigger: 'blur' }],
    password: [{ required: true, message: "请输入内容！", trigger: 'blur' }],
    captcha: [{ required: true, message: "请输入内容！", trigger: 'blur' }],
})
const registerRules = reactive({
    password1: [
        { required: true, message: '请输入内容！', trigger: 'blur' },
        { min: 6, max: 20, message: '密码应为6-20位', trigger: 'blur' },
    ],
    password2: [
        { required: true, message: "请输入内容！", trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== registerForm.password1) {
                    return Promise.reject(new Error("两次密码不一致"))
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        },
    ],
    phoneNumber: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '请输入11位合法手机号', trigger: 'blur' },
        { pattern: /^[0-9]+$/, message: '只能输入数字', trigger: 'blur' },
    ],
    unit: [{ required: true, message: "请输入内容！", trigger: 'blur' }],
    username: [
        { required: true, message: "请输入内容！", trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: '请输入有效的邮箱地址',
            trigger: 'blur'
        }
    ],
})
const onLogin = async (formEl) => {
    if (isLogin.value) {
        console.log("logging!", loginForm);
        if (!formEl) return
        await formEl.validate(async (valid, fields) => {
            if (valid) {
                console.log('submit!', document.cookie)
                login(loginForm).then(res => {
                    console.log(res);
                    if (res.data) {
                        console.log(res);
                        tokenStore.setToken(res.data)
                        ElMessage({
                            message: '登录成功！',
                            type: 'success',
                        })
                        router.push("/home/analyse")
                    } else {
                        ElMessage({
                            message: `${res.msg}`,
                            type: 'error',
                        })
                        refreshCaptcha()
                    }

                }).catch(err => {
                    console.error(err);
                    refreshCaptcha()
                })
                loginForm.captcha = ""
            } else {
                console.log('error submit!', fields)
            }
        })
    }
    changeToLogin()
}
const onRegister = async (formEl) => {
    if (!isLogin.value) {
        console.log("registering!", formEl);
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                register(registerForm).then(res => {
                    if (res.data) {
                        tokenStore.setToken(res.data)
                        formEl.resetFields()
                        ElMessage({
                            message: '注册成功！',
                            type: 'success',
                        })
                        router.push("/home/analyse")
                    } else {
                        ElMessage({
                            message: `${res.msg}`,
                            type: 'error',
                        })
                    }
                }).catch(err => {
                    console.error(err);
                })
            }
        })
    }
    changeToRegister()
}
</script>

<style lang="scss" scoped>
.login-bg {
    position: absolute;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    opacity: 0.8;
}

.common-layout {
    background-image: url("../../assets/login-bg.png");
    background-size: cover;
}

.container {
    align-items: center;
    height: 100vh;
    position: relative;

    .aside {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40%;
        transform: translateX(10px);
    }

    .main {
        height: auto;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        margin-top: 100px;
        width: 60%;
        transform: translateY(-30px);

        .login-box {
            border: 1.5px solid rgb(170, 170, 170);
            background-color: rgb(198, 198, 198);
            height: auto;
            padding: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            border-radius: 8px;
            box-shadow: 0 0 40px rgb(20, 86, 99);
            width: 400px;

            .button-box {
                margin: auto;
            }

            .login-form {
                margin-top: 50px;

                .validateMark {
                    display: flex;
                    flex-direction: row;

                    .validateImg {
                        display: flex;
                        width: 40%;
                        height: 32px;
                        border-radius: 4.5px;
                        border: 1px solid black;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }
        }


    }
}
</style>