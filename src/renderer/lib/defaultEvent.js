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
      // windows默认禁用f5刷新， 这里主要是禁止ctrl+R刷新
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
    }
  }
}
