<template>
    <!-- 通用的对话框组件 -->
    <el-dialog :title="props.dialogTitle" v-model="currentDialogVisible" width="500" :show-close="false">
        <span>{{ props.dialogMessage }}</span>
        <el-form :rules="currentRules" ref="formRef" :model="currentFormData" label-width="auto"
            style="max-width: 600px; margin-top: 10px;">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="currentFormData.email" placeholder="请输入新的邮箱" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="currentFormData.username" placeholder="请输入新的用户名" />
            </el-form-item>
            <el-form-item label="所在机构" prop="unit">
                <el-input v-model="currentFormData.unit" placeholder="请输入新的机构名称" />
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNumber">
                <el-input v-model="currentFormData.phoneNumber" placeholder="请输入新的手机号" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="currentFormData.password" placeholder="请输入新的密码" type="password" show-password />
            </el-form-item>
            <!-- 动态显示 salt 字段 -->
            <el-form-item v-if="props.showSalt" label="salt值" prop="salt">
                <el-input v-model="currentFormData.salt" placeholder="请输入新的salt值" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="onCancel">取消</el-button>
                <el-button type="primary" @click="onConfirm">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { AdminUpdateUser, AdminWriteUser } from '@/apis/user';
import { ElMessage, ElMessageBox } from 'element-plus';

const props = defineProps({
    dialogVisible: {
        type: Boolean,
        required: true
    },
    formData: {
        type: Object,
        required: true
    },
    rules: {
        type: Object,
        required: true
    },
    sendDialogVisible: {
        type: Function,
        required: true
    },
    searchUser: {
        type: Function,
        default: () => { }
    },
    searchPageInfo: {
        type: Object,
        default: () => ({})
    },
    type: {
        type: String,
        default: 'default'
    },
    rowInfo: {
        type: Object,
        default: () => ({})
    },
    showSalt: {
        type: Boolean,
        default: false,
    },
    dialogTitle: {
        type: String,
        default: '修改信息',
    },
    dialogMessage: {
        type: String,
        default: '请填写您需要修改的信息',
    },
})
const formRef = ref(null);
const currentFormData = ref(props.formData);
const currentRules = ref(props.rules);
let currentDialogVisible = ref(props.dialogVisible)
let currentRowInfo = ref(props.rowInfo);

watch(
    () => props.dialogVisible, (newValue) => {
        currentDialogVisible.value = newValue
    }
);

watch(
    () => props.rowInfo, (newValue) => {
        currentRowInfo.value = newValue
    }
);
const onCancel = () => {
    if (Object.values(currentFormData.value).some(value => value !== '')) {
        ElMessageBox.confirm(
            '退出将导致当前表单信息丢失，是否继续?',
            '警告',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            props.sendDialogVisible(false)
            formRef.value.resetFields();
        })
    } else {
        props.sendDialogVisible(false)
        formRef.value.resetFields();
    }
};

const onConfirm = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            if (props.type === 'update') {
                const queryData = {}
                for (const key in currentFormData.value) {
                    if (currentFormData.value[key]) {
                        queryData[key] = currentFormData.value[key]
                    }
                }
                queryData.uid = currentRowInfo.value.uid
                AdminUpdateUser(queryData).then(res => {
                    if (res.status === 0) {
                        ElMessage({
                            message: '修改失败！请检查是否有重复信息',
                            type: 'error',
                        })
                        return
                    }
                    ElMessage({
                        message: '修改成功！',
                        type: 'success',
                    })
                    props.searchUser(props.searchPageInfo.currentPage, props.searchPageInfo.pageSize)
                    formRef.value.resetFields();
                    props.sendDialogVisible(false)
                }).catch(err => {
                    console.log(err);
                    ElMessage({
                        message: '请求失败！',
                        type: 'error',
                    })
                })
            }
            if (props.type === 'write') {
                const queryData = currentFormData.value
                console.log(queryData);
                AdminWriteUser(queryData).then(res => {
                    if (res.status === 0) {
                        ElMessage({
                            message: '修改失败！请检查是否有重复信息',
                            type: 'error',
                        })
                        return
                    }
                    ElMessage({
                        message: '修改成功！',
                        type: 'success',
                    })
                    props.searchUser(props.searchPageInfo.currentPage, props.searchPageInfo.pageSize)
                    formRef.value.resetFields();
                    props.sendDialogVisible(false)
                }).catch(err => {
                    console.log(err);
                    ElMessage({
                        message: '请求失败！',
                        type: 'error',
                    })
                })
            }
        } else {
            console.log('表单验证失败');
        }
    });
};


</script>