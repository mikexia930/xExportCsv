<template>
  <div>
    <button @click="handleExport">Export</button>
  </div>
</template>

<script setup lang="ts">
import JsonExportCSVIns from '../packages/XExportCsv/src/index';
function handleExport() {
  JsonExportCSVIns.exportCsv('游戏下载', [['1','2'], ['3','4']]).then(() => {
    alert('export successfully')
  }).catch((err) => {
    console.log('err', err)
  });
}
</script>
