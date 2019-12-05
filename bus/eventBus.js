const {
  ipcMain
} = require('electron')

ipcMain.on('dragEventMessage', function(event, arg) {
  console.log('arg', arg)
  event.reply('dragEventReply', arg)
})