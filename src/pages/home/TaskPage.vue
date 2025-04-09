<template>
    <div class="task-container">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="createDate" label="创建时间" width="200" />
            <el-table-column prop="startDate" label="开始时间" width="200" />
            <el-table-column prop="completionDate" label="完成时间" width="200" />
            <el-table-column prop="content" label="文章内容" min-width="200" max-width="300" />
            <el-table-column prop="state" label="状态" min-width="120">
                <template #default="scope">
                    <el-button link :type=typeDecider(scope.row.state) size="small" @click="handleClick(scope.row)">
                        {{ scope.row.state }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts" setup>
import { useTaskStore } from '@/stores/task';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import { v4 as uuidV4 } from 'uuid'
import { onMounted, reactive } from 'vue';
let taskStore = useTaskStore()
const router = useRouter()
let a = 0 //用于测试标签样式
let tableData = reactive([])
onMounted(() => {
    const newTableData = taskStore.tasks.map((item) => {
        a = (a + 1) % 3
        let state = ""
        if (a === 0) state = "等待"
        if (a === 1) state = "已完成"
        if (a === 2) state = "失败"
        if (item.content.length > 100) item.content = item.content.slice(0, 100) + "..."
        return {
            id: uuidV4(),
            createDate: item.createDate,
            content: item.content,
            startDate: "loading",
            completionDate: "loading",
            state
        }
    })
    tableData.splice(0, tableData.length, ...newTableData)
})

const handleClick = (info) => {
    const { state, id, content } = info
    if (state === "等待") {
        ElNotification({
            message: '系统正在分析，请您耐心等待',
            type: 'info',
            position: 'bottom-right',
        })
    }
    if (state === "失败") {
        ElNotification({
            message: '分析失败！请您稍后重试',
            type: 'error',
            position: 'bottom-right',
        })
    }
    if (state === "已完成") {
        router.push({ path: '/report', query: { id, content } })
    }
}
const typeDecider = (state) => {
    if (state === "等待") return "primary";
    if (state === "已完成") return "success";
    if (state === "失败") return "danger"
}
</script>
<style lang="scss" scoped>
.task-container {
    margin: 10px;
}
</style>