<template>
  <div class="inline field">
    <div class="item" :class="checked ? 'checked' : ''" @click="checked = !checked">
      <label class="item-label">{{text}}</label>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CheckBox',
    props: {
      text: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        checked: false
      }
    }
  }
</script>

<style scoped>
  .item {
    display: inline-block;
    position: relative;
  }

  .item:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 17px;
    height: 17px;
    content: '';
    background: #fff;
    border-radius: .21428571rem;
    -webkit-transition: border .1s ease, opacity .1s ease, -webkit-transform .1s ease, -webkit-box-shadow .1s ease;
    transition: border .1s ease, opacity .1s ease, transform .1s ease, box-shadow .1s ease, -webkit-transform .1s ease, -webkit-box-shadow .1s ease;
    border: 1px solid #d4d4d5;
  }

  .item.checked:before {
    background: #1cab43;
    border-color: #1cab43;
    content: '\e800';
    font-family: Checkbox;
    opacity: 1;
    color: white;
  }

  .item label {
    width: auto;
    height: 17px;
    line-height: 17px;
    padding-left: 27px;
    font-weight: normal;
    cursor: pointer;
    color: rgba(0, 0, 0, .87);
  }
</style>
