// vue mixin { dragEvent }
export const defaultDragEvent = {
  name: 'defaultDragEvent',
  data () {
    return {}
  },
  mounted () {
    this.disableDocumentDrag()
  },
  methods: {
    disableDocumentDrag () {
      document.addEventListener('dragenter', this.disableDragEvent)
      document.addEventListener('dragover', this.disableDragEvent)
      document.addEventListener('drop', this.disableDragEvent)
    },
    disableDragEvent (e) {
      e.stopPropagation()
      e.preventDefault()
    }
  }
}

// vue mixin { refreshEvent }
export const defaultRefreshEvent = {
  name: 'defaultRefreshEvent',
  data () {
    return {}
  },
  mounted () {
    this.disableRefreshEvent()
  },
  methods: {
    disableRefreshEvent () {
      // 1. bad
      document.addEventListener('keydown', function (event) {
        event = event || window.event
        let code = event.keyCode || event.which
        if ((event.metaKey || event.ctrlKey) && code === 82) {
          event.preventDefault()
          event.stopPropagation()
          event.cancelBubble = true
          return false
        }
      })

      // 2. bad
      // document.onkeydown = function (e) {
      //   var ev = window.event || e
      //   var code = ev.keyCode || ev.which
      //   if (code === 116) { // 禁止页面F5刷新
      //     if (ev.preventDefault) {
      //       ev.preventDefault()
      //     } else {
      //       ev.keyCode = 0
      //       ev.returnValue = false
      //     }
      //   } else if (event.ctrlKey && code === 82) { // 禁用 ctrl+R 刷新
      //     return false
      //   }
      // }
    }
  }
}
