<template>
    <div class="reply">
      <div class="head">
        引用来自"{{comment.user.username}}"的评论
      </div>
      <CommentReply v-if="comment.reply !== '0'" :comment="comment.parent" />
      <div class="content">
        {{comment.comment}}
      </div>
    </div>
</template>

<script>
  export default {
    name: 'CommentReply',
    props: {
      comment: {
        type: Object
      }
    }
  }
</script>

<style scoped>
  .reply {
    padding: 3px 10px 5px;
    border-left: 1px solid rgba(0,0,0,.2);
  }
  .head {
    font-weight: 700;
    color: rgba(0,0,0,.4);
    font-size: 14px;
  }
  .content {
    font-size: 14px;
    color: rgba(0,0,0,.4);
  }
</style>
