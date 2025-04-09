<template>
    <div class="common-layout">
        <el-container class="container">
            <WebHeader :username="username" />
            <el-container class="main-container">
                <el-main class="main">
                    <h1 style="font-size: 25px;">词汇分析</h1>
                    <div class="mb-2 ml-4">
                        <el-radio-group v-model="radio1">
                            <el-radio value="1" size="large">中考阶段 1%</el-radio>
                            <el-radio value="2" size="large">高考阶段 2%</el-radio>
                            <el-radio value="3" size="large">CET-4阶段 3%</el-radio>
                            <el-radio value="4" size="large">CET-6阶段 3%</el-radio>
                            <el-radio value="5" size="large">考研阶段 3%</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="report-content-ana">
                        {{ content }}
                        <div class="report-wowrds-generator">
                            <el-button type="primary" @click="GenerateWords">生成词表</el-button>
                        </div>
                    </div>
                    <div class="report-tip">
                        使用说明：
                        <br>
                        1. 单击红色超纲词汇，可使用“查询”和“替换”功能；
                        <br>
                        2. 超纲词汇右上角的绿色数字表示该词在“阅读真题基准库”中的出现频次；
                        <br>
                        3. 点击“生成词表”按钮，即可获得超纲词表。
                    </div>
                    <div class="report-button-box">
                        <el-button type="primary" @click="BackToHome">返回首页</el-button>
                        <el-button type="primary" @click="BackToReport">返回报告</el-button>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup lang="js">
import WebHeader from '@/components/WebHeader.vue';
import { ref, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const username = ref(userStore.userInfo.username)
const radio1 = ref('1')
const router = useRouter()
const route = useRoute()
const { query } = toRefs(route)
const { id, content } = query.value

const BackToHome = () => {
    const tab = localStorage.getItem("tab") || "/home/analyse"
    router.push(tab)
}
const BackToReport = () => {
    router.push({ path: '/report', query: { id, content } })
}
const GenerateWords = () => {
    console.log("Generating!");
}
</script>
<style lang="scss" scoped>
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .main-container {

        .main {
            display: flex;
            margin-top: 50px;
            align-items: center;
            flex-direction: column;
            width: 100%;

            .report-content-ana {
                width: 1200px;

                .report-wowrds-generator {
                    display: flex;
                    justify-content: center;
                }
            }

            .report-tip {
                width: 1200px;
            }

            .report-button-box {
                display: inline-flex;
                margin: 20px;
            }
        }

    }
}
</style>