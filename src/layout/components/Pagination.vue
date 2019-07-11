<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :page-sizes="[10, 30, 40, 50]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    style="float:right;"
  ></el-pagination>
</template>
<script type="text/ecmascript-6">
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 1
    }
  },
  watch: {},
  methods: {
    //每页展示条数
    handleSizeChange(val) {
      //事件传递
      this.$emit("handleSizeChangeSub", val);
    },
    //当前页
    handleCurrentChange(val) {
      //事件传递
      this.$emit("handleCurrentChangeSub", val);
    }
  },
  // 过滤器设计目的就是用于简单的文本转换
  filters: {},
  // 若要实现更复杂的数据变换，你应该使用计算属性
  computed: {},
  created() {},
  mounted() {},
  destroyed() {}
};
</script>
<style type="text/css" scoped>
</style>