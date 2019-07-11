<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" clearable placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="searchitem">
        <el-button class="searchbtn" size="medium" round @click="onSubmit">查询</el-button>
        <!-- <el-button type="primary" @click="onSubmit">查询</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="projectlist" stripe style="width: 100%;text-align:center">
      <el-table-column prop="id" label="序号" width="180"></el-table-column>
      <el-table-column prop="name" label="项目名称" width="180"></el-table-column>
      <el-table-column prop="code" label="项目编号" width="180"></el-table-column>
      <el-table-column prop="dept_name" label="执行单位" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="180"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="operatingbtn" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑 </el-button>
          <el-button class="operatingbtn"  size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <my-pages
      :total="total"
      :page-size="pageSize"
      @handleSizeChangeSub="handleSizeChangeFun"
      @handleCurrentChangeSub="handleCurrentChangeFun"
    ></my-pages>

    <el-dialog
      :close-on-click-modal="false"
      :title="titleState"
      :visible.sync="dialogFormVisible"
      width="600px"
      v-if="dialogFormVisible"
      :show-close="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" maxlength="50" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="mycancelbtn" size="medium"  @click="callOf('ruleForm')">取 消</el-button>
        <el-button class="mysavebtn" size="medium" @click="submitForm('ruleForm')">保 存</el-button>
        <el-button class="mywarningbtn" size="medium" @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-dialog>
  </div>

  
</template>

<script>
import { findList } from "@/api/budgetaryrequest";
import myPages from "../../layout/components/Pagination";
export default {
  components: {
    myPages
  },
  data() {
    return {
      projectlist: null, //table数据
      total: 0, //默认数据总数
      pageSize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      listLoading: true,
      dialogTableVisible: false,
      dialogFormVisible: false,
      labelPosition: "left", //form表单字体默认向左
      formInline: {
          user: '',
          region: ''
        },
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    };
  },
  mounted() {
    //获取列表
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.listLoading = true;
      let params = {
        pageSize: this.pageSize, //当前分页条数
        currentPage: this.currentPage //当前页
      };
      findList(params).then(res => {
        console.log(res);
        this.projectlist = res.data.data.datalist;
        this.total = res.data.data.total;
        this.listLoading = false;
      });
    },
    //分页相关【下一页】操作
    handleSizeChangeFun(v) {
      this.pageSize = v;
      this.getTableData(); //更新列表
    },
    //分页相关【一页几条】操作
    handleCurrentChangeFun(v) {
      this.currentPage = v; //当前页
      this.getTableData(); //更新列表
    },
    //打开弹窗 操作按钮
    handleEdit(index, row) {
      this.clearForm("ruleForm");
      this.dialogFormVisible = true;
      this.titleState = "编辑";
    },
    //删除   操作按钮
    handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          confirmButtonClass:'mysavebtn',
          cancelButtonText: '取消',
          cancelButtonClass:'mycancelbtn',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //表单提交方法（保存方法）
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //关闭 取消 弹框方法
    callOf(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
      });
    },
    //清空form表单方法
    clearForm(formName) {
      this.$nextTick(() => {
        //this.ruleForm. = {};
        this.ruleForm.name = ""; 
        this.ruleForm.region = ""; 
        this.ruleForm.date1 = ""; 
        this.ruleForm.date2 = ""; 
        this.ruleForm.delivery = ""; 
      });
    },
    onSubmit() {
        console.log('submit!');
      }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

</style>
