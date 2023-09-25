# xExportCsv
>
>客户端导出CSV，浏览器兼容，支持大文件导出。
>
>
[Demo](https://mikexia930.github.io/xExportCsv/)
## 版本
- v1.0.2

## 安装
```
npm install x-export-csv
```

## 使用
```
import xExportCsv from 'x-export-csv';
```

**初始化**
```
xExportCsv.exportCsv(filename, exportData).then(() => {
   // success
}).catch(err => {
   console.log(err)
})
```

|参数名| 类型          | 说明         |
| --- |-------------|------------|
| filename | string      | 下载时保存的文件名  |
| exportData | string[][] | number[][] |  需要导出的数据         |


