<template>
  <div class="rename-box">
    <h3>Rename file names in batches</h3>
    <label for="file2">
      <div class="upload-area rename-upload">
        <div class="top-line">
          <hr class="row-line row-line-top" />
        </div>
        <div class="collmn-line right-line"></div>
        <div class="bottom-line">
          <hr class="row-line row-line-bottom" />
        </div>
        <div class="collmn-line left-line"></div>
        <p class="upload-area-img"></p>
        <span class="upload-area-text">Please select to upload</span>
        <input
          id="file2"
          type="file"
          name="file2"
          style="display: none;"
          ref="inputBtn2"
          webkitdirectory=""
          directory=""
          @change="renameFileUpload"
        />
      </div>
    </label>
    <h3>Type your format</h3>
    <el-form
      :inline="true"
      :model="formInline"
      :rules="rules"
      ref="ruleForm"
      class="flex-around transbox"
    >
      <el-form-item label="from:" class="label" prop="oldSuffix">
        <el-input
          v-model="formInline.oldSuffix"
          placeholder="Please enter the format"
        ></el-input>
      </el-form-item>
      <el-form-item class="line">=></el-form-item>
      <el-form-item label="to:" class="label" prop="newSuffix">
        <el-input
          v-model="formInline.newSuffix"
          placeholder="Please enter the format"
        ></el-input>
      </el-form-item>
    </el-form>
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
      }
    }
  },
  mounted () {},
  methods: {
    renameFileUpload (e) {
      e.preventDefault()
      e.stopPropagation()
      let fileDataPath = document.querySelector('#file2').files[0].path
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$electron.ipcRenderer.send(
            'uploadMultipleRenames',
            fileDataPath,
            this.formInline.oldSuffix,
            this.formInline.newSuffix
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style>
h3 {
  padding-top: 2%;
  text-align: left;
  color: #fff;
}
.label .el-form-item__label,
.line {
  color: #fff !important;
}

.transbox {
  padding-top: 5%;
}
</style>
