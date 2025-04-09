<template>
    <div class="analyse-container">
        <el-form :model="form" label-width="auto" :rules="rules" ref="formRef">
            <el-form-item label="文章" prop="content">
                <el-input v-model="form.content" type="textarea" style="width: 800px;"
                    :autosize="{ minRows: 10, maxRows: 20 }" @change="homeStore.setContent(form.content)" />
            </el-form-item>
            <el-form-item label="验证码" prop="validateMark" class="validateMark">
                <el-input v-model="form.validateMark" style="width: 100px; margin-right: 10px;" />
                <div class="validateImg"><img class="img-cover" src="../../assets/img1.png"></div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit(formRef)">开始分析</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import { ElNotification } from 'element-plus';
import { reactive, ref } from 'vue'
import { useTaskStore } from '@/stores/task';
import { useHomeStore } from '@/stores/home';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const taskStore = useTaskStore()
const homeStore = useHomeStore()
const router = useRouter()

const form = reactive({
    content: homeStore.content,
    validateMark: ''
})
const formRef = ref()
const rules = reactive({
    content: [
        { required: true, message: '请输入文章', trigger: 'blur' },
    ],
    validateMark: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
})

const onSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        const isLogged = localStorage.getItem("TokenInfo")
        if (valid && isLogged) {
            taskStore.setTasks({ content: form.content, createDate: dayjs().format("YYYY-MM-DD HH:mm:ss") })
            ElNotification({
                message: '提交成功！',
                type: 'success',
                position: 'bottom-right',
            })
            if (formEl) {
                formEl.resetFields()
                form.content = ""
                homeStore.setContent("")
            }
        } else if (!isLogged) {
            console.log('提交失败!', fields)
            router.push({ path: '/login' })
            ElNotification({
                message: '请您登录！',
                type: 'error',
                position: 'bottom-right',
            })
        } else {
            console.log('提交失败!', fields)
            ElNotification({
                message: '提交失败！',
                type: 'error',
                position: 'bottom-right',
            })
        }
    })
}
</script>
<style lang="scss" scoped>
.analyse-container {
    margin: 10px;
}

.validateMark {
    display: flex;
    flex-direction: row;

    .validateImg {
        display: flex;
        width: 96px;
        height: 32px;
        border-radius: 4.5px;
        border: 1px solid black;
        align-items: center;
        justify-content: center;
    }
}
</style>