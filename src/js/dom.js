window.onload = function() {
  const { ipcRenderer } = require('electron')
  var localBtn = document.querySelector('.tab-local'),
    onlineBtn = document.querySelector('.tab-online'),
    settingsBtn = document.querySelector('.tab-settings'),
    localContent = document.querySelector('.local-content'),
    onlineContent = document.querySelector('.online-search-box'),
    settingsContent = document.querySelector('.settings-content'),
    uploadArea = document.querySelector('.upload-area');
  localBtn.addEventListener('click', function() {
    localContent.style.display = 'block'
    onlineContent.style.display = 'none'
    settingsContent.style.display = 'none'
  })
  onlineBtn.addEventListener('click', function () {
    onlineContent.style.display = 'block'
    localContent.style.display = 'none'
    settingsContent.style.display = 'none'
  });
  settingsBtn.addEventListener('click', function () {
    settingsContent.style.display = 'block'
    onlineContent.style.display = 'none'
    localContent.style.display = 'none'
  });
  // 上传区域点击或拖拽
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault()
    e.stopPropagation()
  })
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault()
    e.stopPropagation()
    console.log('e', e)
    for (f of e.dataTransfer.files) {
      // console.log('fpath', f.path)
      let filesPath = f.path
      ipcRenderer.send('dragEventMessage', filesPath)
    }
  })
  document.addEventListener('dragover', function(e) {
    e.preventDefault()
    e.stopPropagation()
  })

  ipcRenderer.on('dragEventReply', function(event, data) {
    if (data) {
      console.log('DONE')
    }
  })

  // 渲染待压缩图片列表
  // var appPicsList
  ipcRenderer.on('filesList', function(e, data) {
    console.log('wow', data)
    // if (data.length > 0) {
    //   $('#result-list').show()
    // }
    // appPicsList = data
    // var appPicsListHtml = doT.template($('#resultlisttmpl').text())
    // $('#result-list').html(appPicsListHtml(data))
  })
}