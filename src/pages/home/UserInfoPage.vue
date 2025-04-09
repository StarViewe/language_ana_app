<template>
    <el-descriptions class="margin-top" title="用户详细信息" :column="3" size="default" border>
        <template #extra>
            <el-button type="primary" @click="UpdateInfo">修改信息 </el-button>
        </template>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <user />
                    </el-icon>
                    用户名
                </div>
            </template>
            {{ userInfo.username }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <iphone />
                    </el-icon>
                    手机号
                </div>
            </template>
            {{ userInfo.phoneNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <location />
                    </el-icon>
                    邮箱地址
                </div>
            </template>
            {{ userInfo.email }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon>
                        <office-building />
                    </el-icon>
                    所在单位
                </div>
            </template>
            {{ userInfo.unit }}
        </el-descriptions-item>
    </el-descriptions>
    <el-dialog v-model="dialogVisible" title="修改信息" width="500">
        <span>请填写您需要修改的信息</span>
        <el-form :rules="rules" ref="formRef" :model="formData" label-width="auto"
            style="max-width: 600px; margin-top: 10px;">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData.email" placeholder="请输入新的邮箱" />
            </el-form-item>
            <el-form-item label="所在机构" prop="unit">
                <el-input v-model="formData.unit" placeholder="请输入新的机构名称" />
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNumber">
                <el-input v-model="formData.phoneNumber" placeholder="请输入新的手机号" />
            </el-form-item>
            <el-form-item label="新密码" prop="password1">
                <el-input v-model="formData.password1" placeholder="如不需要更改请留空" type="password" show-password />
            </el-form-item>
            <el-form-item label="重复密码" prop="password2">
                <el-input v-model="formData.password2" placeholder="请与新密码保持一致" type="password" show-password />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="onCancel">取消</el-button>
                <el-button type="primary" @click="onSubmit(formRef)">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 缺个子传父，子表关了后父的vis要改回来 -->
</template>
<script setup lang="ts">
import {
    Iphone,
    Location,
    OfficeBuilding,
    User,
} from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus';
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { UpdateUserInfo } from '@/apis/user';

let userStore = useUserStore()
//表单的一些属性和数据
const formRef = ref()
let userInfo = reactive({
    username: undefined,
    email: undefined,
    phoneNumber: undefined,
    unit: undefined,
})
let formData = reactive({
    email: userInfo.email,
    unit: userInfo.unit,
    phoneNumber: userInfo.phoneNumber,
    password1: '',
    password2: ''
})
const changeInfo = () => {
    Object.assign(userInfo, {
        username: userStore.userInfo.username,
        email: userStore.userInfo.email,
        phoneNumber: userStore.userInfo.phoneNumber,
        unit: userStore.userInfo.unit
    })
    Object.assign(formData, {
        email: userStore.userInfo.email,
        phoneNumber: userStore.userInfo.phoneNumber,
        unit: userStore.userInfo.unit,
        password1: '',
        password2: ''
    })
}
onMounted(() => {
    changeInfo()
})
const rules = reactive({
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: '请输入有效的邮箱地址',
            trigger: 'blur'
        }
    ],
    unit: [
        { required: true, message: '请输入所在组织名称', trigger: 'blur' },
    ],
    phoneNumber: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '请输入11位合法手机号', trigger: 'blur' },
        { pattern: /^[0-9]+$/, message: '只能输入数字', trigger: 'blur' },
    ],
    password1: [
        { min: 6, message: '密码长度至少为6位', trigger: 'blur' },
    ],
    password2: [
        {
            validator: (rule, value, callback) => {
                if (value !== formData.password1) {
                    return Promise.reject(new Error("两次密码不一致"))
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        },
    ]
})

//对话框显示与否
let dialogVisible = ref(false)

//一些函数
const UpdateInfo = () => {
    dialogVisible.value = true
    console.log("updating");
    if (formRef.value) {
        formRef.value.resetFields()
    }
}
const onSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            dialogVisible.value = false
            UpdateUserInfo(formData).then(res => {
                const newUserInfo = {
                    username: userStore.userInfo.username,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    unit: formData.unit,
                }
                userStore.setUserInfo(newUserInfo)
                changeInfo()
                ElNotification({
                    message: '提交成功！',
                    type: 'success',
                    position: 'bottom-right',
                })
            }).catch(err => {
                console.error(err);
                ElNotification({
                    message: '提交失败！',
                    type: 'error',
                    position: 'bottom-right',
                })
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
const onCancel = () => {
    dialogVisible.value = false
    ElNotification({
        message: '提交取消',
        type: 'info',
        position: 'bottom-right',
    })
}


</script>