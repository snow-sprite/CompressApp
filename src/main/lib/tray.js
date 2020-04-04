import {
  Menu,
  Tray,
  dialog,
  shell
} from 'electron'
import path from 'path'
import pkg from '../../../package.json'

// 创建系统托盘工具
export function createTray () {
  const BugsIssues = 'https://github.com/snow-sprite/CompressApp/issues'
  // 自定义任务栏
  const taryIcon = new Tray(path.join(__static, './tray/18x18.png'))
  const contextMenu = Menu.buildFromTemplate([{
    label: 'Reload',
    role: 'reload'
  }, {
    label: 'About',
    type: 'normal',
    toolTip: 'about',
    click: () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'About',
        message: `
        ${pkg.description}\n
        version: ${pkg.version}\n
        ${pkg.author.name}<${pkg.author.email}>`
      })
      // process.exit()
    }
  }, {
    label: 'Bugs Report',
    type: 'normal',
    click: () => {
      shell.openExternal(BugsIssues)
    }
  }, {
    label: 'Quit',
    role: 'quit'
  }])
  // 鼠标左击和右击都打开托盘工具
  taryIcon.on('click', () => {
    taryIcon.popUpContextMenu(contextMenu)
  })
  taryIcon.on('right-click', () => {
    taryIcon.popUpContextMenu(contextMenu)
  })
}

// 销毁系统托盘工具
export function destroyTray () {
  Tray.destroy()
}
// export default createTray
