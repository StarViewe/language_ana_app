<template>
    <div class="common-layout">
        <el-container class="container">
            <WebHeader :username="username" />
            <el-container class="main-container">
                <el-main class="main">
                    <h1 style="font-size: 25px;">句法分析</h1>
                    <div class="mb-2 ml-4">
                        <el-radio-group v-model="radio1">
                            <el-radio value="1" size="large">限定性从属子句 1</el-radio>
                            <el-radio value="2" size="large">复杂名词短语 2</el-radio>
                            <el-radio value="3" size="large">非限定性动词短语 3</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="report-content-ana">
                        {{ content }}
                        <div class="report-content-ana-statistics">
                            本文共计{{ result.totalWordCount }}词，最长句子{{ result.maxWordCount }}词
                        </div>
                    </div>
                    <div class="report-tip">
                        注：
                        <br>
                        1.“限定性从属子句”包括定语从句、状语从句和名词性从句等；“复杂名词短语”包括由形容词、所有格、介词短语、定语从句、现在分词或过去分词等修饰的名词短语；“非限定性动词短语”包括动词不定式、动名词短语和过去分词短语等；
                        <br>
                        2. 工具已对子句或短语中的核心单词进行标注、提供结构提示，用户可根据提示划分完整的子句或短语；
                        <br>
                        3. 工具已使用下划线对文本中的最长句子进行标注；
                        <br>
                        4. 分析结果可能存在少量误差，请人工校对。
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
import { WordsNumberCalculator } from '@/utils/calculator';

const userStore = useUserStore()
const username = ref(userStore.userInfo.username)
const radio1 = ref('1')
const router = useRouter()
const route = useRoute()
const { query } = toRefs(route)
const { id, content } = query.value
const result = ref({})
result.value = WordsNumberCalculator(content)

const BackToHome = () => {
    const tab = localStorage.getItem("tab") || "/home/analyse"
    router.push(tab)
}
const BackToReport = () => {
    router.push({ path: '/report', query: { id, content } })
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

                .report-content-ana-statistics {
                    display: flex;
                    justify-content: end;
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