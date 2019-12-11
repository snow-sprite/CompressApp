<template>
  <div class="work-area">
    <ul class="tabs">
      <li class="tab tab-settings"
        v-for="(item, ind) in navList" :key="ind"
        @click="jumpMap(ind)"
      >
        <span
          :class="{'icon-local': item.name === 'Local', 'icon-online': item.name === 'Online', 'icon-settings': item.name === 'Settings'}"
          class="icon-left"
        ></span>
        <span class="tab-text">{{ item.name }}</span>
        <i :class="{'after-icon': activeNavInd === ind}"></i>
      </li>
      <p class="statement">
        <span>Compress and generate</span>
      </p>
      <i class="copyright">&copy;zhiozhou&lt;Cid&gt;</i>
    </ul>
    <div class="content">
      <Local v-show="activeNavInd === 0"/>
      <Online v-show="activeNavInd === 1"/>
      <Settings v-show="activeNavInd === 2"/>
    </div>
  </div>
</template>

<script>
  import Local from '@/components/Local'
  import Online from '@/components/Online'
  import Settings from '@/components/Settings'

  export default {
    name: 'minify_your_images',
    data () {
      return {
        activeNavInd: 0, // 激活的nav
        navList: [{
          name: 'Local'
        }, {
          name: 'Online'
        }, {
          name: 'Settings'
        }]
      }
    },
    components: {
      Local,
      Online,
      Settings
    },
    methods: {
      jumpMap (ind) {
        this.activeNavInd = ind
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
