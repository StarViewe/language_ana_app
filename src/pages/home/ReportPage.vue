<template>
    <div class="common-layout">
        <el-container class="container">
            <WebHeader :username="username" />
            <el-container class="main-container">
                <el-main class="main">
                    <div class="report-chart">
                        <BarChart />
                    </div>
                    <div class="report-table">
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column prop="class" label="类别" width="180" />
                            <el-table-column prop="index" label="量化指标" width="180" />
                            <el-table-column prop="level" label="对应等级" width="180" />
                        </el-table>
                    </div>
                    <div class="report-button-box">
                        <el-button type="primary" @click="ToLexicalAnaPage">词汇分析</el-button>
                        <el-button type="primary" @click="ToSyntacticAnaPage">句法分析</el-button>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import BarChart from '@/components/BarChart.vue';
import WebHeader from '@/components/WebHeader.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref, toRefs } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const username = ref(userStore.userInfo.username)
const router = useRouter()
const route = useRoute()
const { query } = toRefs(route)
const { id, content } = query.value
console.log(id, content);

const ToLexicalAnaPage = () => {
    router.push({ path: '/lexicalAnaPage', query: { id, content } })
}
const ToSyntacticAnaPage = () => {
    router.push({ path: '/syntacticAnaPage', query: { id, content } })
}
const DifficultyHandler = (val) => {
    if (3 <= val && val < 4) return "三级（中考）"
    else if (val < 5) return "四级（高考）"
    else if (val < 6) return "五级（CET-4）"
    else if (val < 7) return "六级（CET-6）"
    else if (val <= 8) return "七级（考研）"
    return "Error!"
}
const lexicalDifficultyIndex = 5.61
const syntacticDifficultyIndex = 6.25
const textDifficultyIndex = 4.23
const lexicalDifficulty = DifficultyHandler(lexicalDifficultyIndex)
const syntacticDifficulty = DifficultyHandler(syntacticDifficultyIndex)
const textDifficulty = DifficultyHandler(textDifficultyIndex)

const tableData = [
    {
        class: '词汇难度',
        index: lexicalDifficultyIndex,
        level: lexicalDifficulty,
    },
    {
        class: '句法难度',
        index: syntacticDifficultyIndex,
        level: syntacticDifficulty,
    },
    {
        class: '文本难度',
        index: textDifficultyIndex,
        level: textDifficulty,
    },
]

</script>
<style lang="scss" scoped>
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .main-container {

        .main {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;

            .report-chart {
                width: 540px
            }

            .report-table {
                width: 540px;
            }

            .report-button-box {
                display: inline-flex;
                margin: 20px;
            }
        }

    }
}
</style>