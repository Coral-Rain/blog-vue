<template>
    <div>
      <router-link to="/blog" class="item item-all" :class="typeof(tagId) === 'undefined' ? 'tag-checked' : ''" @click.native="onTagClick($event, '全部')">全部</router-link>
      <div v-for="l in list" class="item-tag-container">
        <h4 class="header">{{l.name}}</h4>
        <router-link @click.native="onTagClick($event, tag.name)" :class="tag.id === tagId ? 'tag-checked' : ''" class="item" :to="{path: '/blog', query:{item_tag: tag.id}}" v-for="tag in l.tags">
          <li class="item">{{tag.name}}</li>
        </router-link>
      </div>
    </div>
</template>

<script>

  import EventBus from '../EventBus'

  export default {
    name: 'TagList',
    props: {
      list: {
        type: Array
      }
    },
    methods: {
      onTagClick: function(event, tagName){
        console.log(event, tagName)
        const elements = document.getElementsByClassName("item")
        for(let i = 0; i < elements.length; i++) {
          const element = elements[i];
          element.classList.remove("tag-checked");
        }
        event.srcElement.classList.add("tag-checked")
        EventBus.$emit("changeTagName", tagName)
      }
    },
    data(){
      return{
        tagId: this.$route.query.item_tag
      }
    }
  }
</script>

<style scoped>
  h4{
    text-align: left;
    margin-left: 10px;
    margin-top: 30px;
    margin-bottom: 15px;
    font-weight: 700;
    font-size: 16px;
    color: rgba(0,0,0,.87);
  }

   a.item:hover,a.item:focus{
    color: black;
     text-decoration: none;
  }
  a.item{
    color: rgba(0,0,0,0.6);
    margin-top: 8px;
    margin-bottom: 8px;
    padding: 5px 0;
    display: block;
    text-align: left;
    margin-left: 20px;
  }
  .item-all{
    margin-left: 10px!important;
    margin-bottom: 20px!important;
  }
  .tag-checked{
    color: #32aa66!important;
  }
</style>
