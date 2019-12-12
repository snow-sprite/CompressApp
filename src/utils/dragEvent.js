// vue mixin { dragEvent }
const mixin = {
  name: 'mixin',
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

export default mixin
