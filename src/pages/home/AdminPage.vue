<template>
    <div class="task-container">
        <el-form :inline="true" :model="formData" ref="formRef">
            <el-form-item label="用户名" prop="username">
                <el-input placeholder="请输入用户名" v-model="formData.username"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNumber">
                <el-input placeholder="请输入手机号" v-model="formData.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" type="primary"
                    @click="SearchUser(currentPage, pageSize, formData.phoneNumber, formData.username)">搜索</el-button>
                <el-button icon="Search" @click="onReset()">重置</el-button>
                <el-button type="danger" @click="writeUser()">强制写入</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="displayedTableData" style="width: 100%" v-loading="isLoading">
            <el-table-column prop="username" label="用户名" width="200" />
            <el-table-column prop="email" label="邮箱" width="200" />
            <el-table-column prop="unit" label="所在单位" width="200" />
            <el-table-column prop="phoneNumber" label="手机号" min-width="200" max-width="300" />
            <el-table-column prop="state" label="操作" min-width="120">
                <template #default="scope">
                    <el-button type="primary" v-if="scope.row.uid !== 1" @click="updateUser(scope)">修改</el-button>
                    <el-button type="danger" v-if="scope.row.uid !== 1" @click="deleteUser(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="example-pagination-block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                layout="prev, pager, next, sizes" :total="total" />
            <span>共 {{ total }} 条</span>
        </div>
        <InfoForm :dialogVisible="dialogVisible1" :formData="InfoFormData1" :rules="rules1"
            :sendDialogVisible="getDialogVisible" type="update" :rowInfo="currentRowInfo" :search-user="SearchUser"
            :search-page-info="{ pageSize, currentPage }" />
        <InfoForm :dialogVisible="dialogVisible2" :formData="InfoFormData2" :rules="rules2"
            :sendDialogVisible="getDialogVisible" :showSalt="showSalt" type="write" :search-user="SearchUser"
            :search-page-info="{ pageSize, currentPage }" dialogMessage="请确保只在修复数据或特殊情况下使用此功能" />
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { AdminDeleteUser, AdminSearchUser } from '@/apis/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import InfoForm from '@/components/InfoForm.vue';

const formRef = ref(null)
const dialogVisible1 = ref(false)
const dialogVisible2 = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const showSalt = ref(true)
const total = ref(10)
const isLoading = ref(false)
let currentRowInfo = ref({})

const formData = reactive({
    username: "",
    phoneNumber: "",
})
const InfoFormData1 = reactive({
    email: "",
    unit: "",
    phoneNumber: '',
    password: '',
    username: '',
})
const InfoFormData2 = reactive({
    email: "",
    unit: "",
    phoneNumber: '',
    password: '',
    salt: '',
    username: '',
})
const rules1 = reactive({
    email: [
        {
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: '请输入有效的邮箱地址',
            trigger: 'blur'
        }
    ],
    phoneNumber: [
        { min: 11, max: 11, message: '请输入11位合法手机号', trigger: 'blur' },
        { pattern: /^[0-9]+$/, message: '只能输入数字', trigger: 'blur' },
    ],
    password: [
        { min: 6, message: '密码长度至少为6位', trigger: 'blur' },
    ],
})
const rules2 = reactive({
    email: [
        {
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: '请输入有效的邮箱地址',
            trigger: 'blur'
        },
        { required: true, message: '请输入邮箱', trigger: 'blur' }
    ],
    phoneNumber: [
        { min: 11, max: 11, message: '请输入11位合法手机号', trigger: 'blur' },
        { pattern: /^[0-9]+$/, message: '只能输入数字', trigger: 'blur' },
        { required: true, message: '请输入手机号', trigger: 'blur' }
    ],
    password: [
        { min: 6, message: '密码长度至少为6位', trigger: 'blur' },
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    salt: [
        { required: true, message: '请输入盐值', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (!/^\d{16}$/.test(value)) {
                    callback(new Error('必须为 16 位数字'));
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        },
    ],
    unit: [{ required: true, message: "请输入内容！", trigger: 'blur' }],
    username: [{ required: true, message: "请输入内容", trigger: 'blur' }],
})
const displayedTableData = reactive([
    {
        username: "admin",
        email: "admin",
        unit: "admin",
        phoneNumber: "admin",
    }
])
const getDialogVisible = (value) => {
    dialogVisible1.value = value
    dialogVisible2.value = value
}
const onReset = () => {
    formRef.value.resetFields()
    SearchUser(1, pageSize.value)
}

const handleSizeChange = (val) => {
    pageSize.value = val
    SearchUser(currentPage.value, pageSize.value)
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    SearchUser(currentPage.value, pageSize.value)
}

const SearchUser = (currentPage, pageSize, phoneNumber = "", username = "") => {
    isLoading.value = true
    const queryData = {
        currentPage,
        pageSize,
        phoneNumber,
        username
    }
    console.log(queryData);

    AdminSearchUser(queryData).then(res => {
        total.value = res.total;
        displayedTableData.splice(0, displayedTableData.length, ...res.data);
        isLoading.value = false
        total.value = res.total
    }).catch(err => {
        console.log(err);
        isLoading.value = false
    })
}

onMounted(() => {
    SearchUser(1, pageSize.value)
})

const updateUser = (data) => {
    dialogVisible1.value = true
    currentRowInfo.value = data.row
}
const deleteUser = (data) => {
    ElMessageBox.confirm(
        "是否删除该用户？",
        "Warning",
        {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
        }
    ).then(() => {
        const queryData = {
            uid: data.row.uid,
        }
        AdminDeleteUser(queryData).then(res => {
            console.log(res);
            SearchUser(1, pageSize.value)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        }).catch(err => {
            console.log(err);
            ElMessage({
                type: 'error',
                message: '删除失败',
            })
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '操作取消',
        })
    })
}
const writeUser = () => {
    dialogVisible2.value = true
}
</script>
<style lang="scss" scoped>
.task-container {
    margin: 10px;
}

.example-pagination-block {
    margin-top: 20px;
    display: flex;

    span {
        transform: translate(10px, 5px);
    }
}
</style>