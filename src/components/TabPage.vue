<template>
    <div>
      <ul class="nav nav-tabs">
        <li v-for="tab in tabs" role="presentation"
            :class="tab.id === activeId ? 'active' : ''" >
          <!--<a>{{tab.name}}</a>-->
          <router-link :to="tab.to">{{tab.name}}</router-link>
        </li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: 'TabPage',
    components: {},
    props: {
      tabs: {
        type: Array,
        required: true
      },
      activeId: {
        type: Number,
        default: 1
      }
    },
    data(){
      return {
        activeTabId: this.activeId
      }
    },
    methods: {
      // changeActiveTab: function (id) {
      //   this.activeTabId = id
      // }
    }
  }
</script>

<style scoped>
  .nav.nav-tabs {
    border-bottom-width: 3px;
  }

  .nav.nav-tabs li[role=presentation] {
    font-size: 18px;
    cursor: pointer;
  }

  .nav.nav-tabs li[role=presentation]:hover {
  }
  .nav.nav-tabs li[role=presentation] a {
    color: rgba(0,0,0,.87);
    border: none
  }
  .nav.nav-tabs li[role=presentation] a:hover {
    background-color: transparent;

  }
  .nav.nav-tabs li[role=presentation].active a {
    color: #32aa66!important;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 3px solid #32aa66!important;
    font-weight: 700;
    margin-bottom: -2px;
    cursor: pointer;
  }

</style>
