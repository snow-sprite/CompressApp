import {
  Menu,
  Tray,
  dialog,
  shell
} from 'electron'
import path from 'path'
import pkg from '../../../package.json'

// 创建系统托盘工具
let trayIcon
export function createTray () {
  const BugsIssues = 'https://github.com/snow-sprite/CompressApp/issues'
  // 自定义任务栏
  trayIcon = new Tray(path.join(__static, './tray/32x32.ico'))
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

  trayIcon.on('right-click', () => {
    trayIcon.popUpContextMenu(contextMenu)
  })
}

export const destryTray = function () {
  trayIcon && trayIcon.destroy()
}
