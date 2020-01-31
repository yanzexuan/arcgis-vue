<template>
  <div class = "footer">
    <span>ICP备xxx号-1 CopyRight&copy; xxx 版权所有</span>
    <span></span>
  </div>
</template>

<script>
export default {
    name: 'Footer'
};
</script>

<style lang="less" scoped>
.footer {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  background: #000;
  color: gray;
  height: 16px;
  font-size: 12px;
  opacity: 0.3;
}
</style>
