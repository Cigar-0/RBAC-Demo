export function downloadFile (resp,fileName) {
    if(!resp.data){
      return
    }
    if (!fileName) {//如果后台返回文件名称
      //注意一定要和后端协调好返回的数据格式，不然会出现中文乱码问题
      // 前提是服务端要在header设置Access-Control-Expose-Headers: Content-Disposition
      // 前端才能正常获取到Content-Disposition内容
      debugger;
      const disposition = resp.headers['content-disposition'];
      if(disposition){
        fileName = disposition.split('filename=').pop();
        fileName = decodeURI(fileName);
      }      
    }
    const content = resp.data;
    const blob = new Blob([content],{type: "application/vnd.ms-excel"})
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  }
