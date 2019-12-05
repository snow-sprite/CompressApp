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
    for (f of e.dataTransfer.files) {
      console.log('file', f.path)
      let filesPath = f.path
      ipcRenderer.send('dragEventMessage', filesPath)
    }
  })
  document.addEventListener('dragover', function(e) {
    e.preventDefault()
    e.stopPropagation()
  })

  ipcRenderer.on('dragEventReply', function(event, arg) {
    console.log('argsss', arg)
  })
}