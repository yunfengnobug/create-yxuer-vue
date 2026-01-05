<script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
const locale = zhCN
</script>

<template>
  <Suspense>
    <a-config-provider :locale="locale">
      <RouterView />
    </a-config-provider>
  </Suspense>
</template>
<style scoped></style>
