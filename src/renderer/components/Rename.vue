<template>
  <div class="rename-box">
    <h3>Rename file names in batches</h3>
    <el-form
      :inline="true"
      :model="formInline"
      :rules="rules"
      size="mini"
      ref="ruleForm"
      class="flex-start transbox"
    >
      <el-form-item class="line">
        <img class="right-icon" src="../../../static/img/right.svg" alt="">
      </el-form-item>
      <el-form-item label="from:" class="label" prop="oldSuffix">
        <el-input
          v-model="formInline.oldSuffix"
          placeholder="Please enter the format"
        ></el-input>
      </el-form-item>
      <el-form-item class="line">
        <span class="">=</span><span class="right-span">></span>
      </el-form-item>
      <el-form-item label="to:" class="label" prop="newSuffix">
        <el-input
          v-model="formInline.newSuffix"
          placeholder="Please enter the format"
        ></el-input>
      </el-form-item>
    </el-form>
    <label for="file2">
      <div class="upload-area rename-upload" 
        @dragstart="dragRenameEnterArea"
        @drop="renameFileUpload"
      >
        <div class="top-line">
          <hr class="row-line row-line-top" />
        </div>
        <div class="collmn-line right-line"></div>
        <div class="bottom-line">
          <hr class="row-line row-line-bottom" />
        </div>
        <div class="collmn-line left-line"></div>
        <p class="upload-area-img"></p>
        <span class="upload-area-text">Please drag or click to upload</span>
        <input
          id="file2"
          type="file"
          name="file2"
          style="display: none"
          ref="inputBtn2"
          webkitdirectory="true"
          directory="true"
          @change="renameFileUpload"
        />
      </div>
    </label>
    <!-- <h3>Type your format</h3> -->
    <div class="info" v-if="totalCount >= 0 && finishCount >= 0">
      A total of 
      <span class="total-count">{{ totalCount }}</span>
      matching files were found, 
      <span class="finish-count">{{ finishCount }}</span>
      of which were successfully processed.
      <p v-if="totalCount > 0 && finishCount > 0">🎉🎉🎉🎉🎉</p>
      <p v-if="totalCount == 0 && finishCount == 0">😑😑😑😑😑</p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      formInline: {
        oldSuffix: 'jpg',
        newSuffix: 'png'
      },
      rules: {
        oldSuffix: [
          {
            required: true,
            message: 'Please enter the format',
            trigger: 'blur'
          }
        ],
        newSuffix: [
          {
            required: true,
            message: 'Please enter the format',
            trigger: 'blur'
          }
        ]
      },
      inputEvent: null,
      // 设置小于0是为了默认不显示class="info"中的信息
      totalCount: -1,
      finishCount: -1
    }
  },
  mounted () {
    this.listenRenameEvent()
  },
  methods: {
    dragRenameEnterArea (e) {
      e.preventDefault()
    },
    renameFileUpload (e) {
      let event = e || window.event
      event.preventDefault()
      event.stopPropagation()
      this.inputEvent = event

      // 上传的单文件夹绝对目录
      let fileDataPath = ''

      if (event.type === 'drop') {
        // 拖拽上传文件夹
        let files = event.dataTransfer.files
        let items = event.dataTransfer.items
        if (files.length > 1) {
          this.alertMessage()
          return
        }

        if (items && items.length && items[0].webkitGetAsEntry != null) {
          // 上传的单个目录
          let entry
          for (var i = 0; i < items.length; i++) {
            let item = items[i]
            if (
              item.webkitGetAsEntry &&
                (entry = item.webkitGetAsEntry())
            ) {
              if (entry.isDirectory) {
                console.log('This is a directory.')
                fileDataPath = files[0].path
              } else {
                console.log('This is a file.')
                this.alertMessage()
                return
              }
            }
          }
        }
      } else {
        // 选择上传文件夹
        fileDataPath = document.querySelector('#file2').files[0].path
      }

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$electron.ipcRenderer.send(
            'uploadMultipleRenames',
            fileDataPath,
            this.formInline.oldSuffix,
            this.formInline.newSuffix
          )
        } else {
          this.$message.warning('Please enter the "from" and "to" text boxes')
          return false
        }
      })
    },
    listenRenameEvent () {
      this.$electron.ipcRenderer.on('renameing', (e, totalCount) => {
        this.totalCount = totalCount
      })
      this.$electron.ipcRenderer.on('renameDone', (ev, finishCount) => {
        this.finishCount = finishCount
        if (this.inputEvent && this.inputEvent.target) this.inputEvent.target.value = ''
      })
    },
    alertMessage () {
      this.$message.warning('Please select a single directory!')
    }
  }
}
</script>
<style>
h3 {
  /* padding-top: 2%; */
  text-align: left;
  color: #fff;
}
.label .el-form-item__label,
.line {
  color: #fff !important;
}
.transbox .el-form-item {
  margin-bottom: 0;
}
.right-icon {
  width: 16px;
  height: 16px;
}
.right-span {
  position: relative;
  bottom: 1px;
}
.info {
  text-align: left;
  padding-top: 30px;
  color: #fff;
}
.total-count {
  color: #1989fa;
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 2px;
  font-family: PangMenZhengDao;
}
.finish-count {
  color: #5cb87a;
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 2px;
  font-family: PangMenZhengDao;
}
</style>
