<template>
  <div id="app">
    <v-header :seller='seller'></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
       <div class="tab-item">
         <router-link to='/ratings'>评论</router-link>
       </div>
       <div class="tab-item">
         <router-link to='/seller'>商家</router-link>
       </div>
    </div>
    <keep-alive>
      <router-view :seller='seller'></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from './components/header/header'
  import axios from 'axios'
  import {urlParse} from './common/js/util.js'

  export default{
    data(){
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            // console.log(queryParam);
            return queryParam.id;
          })()
        }
      };
    },
    components: {
      'v-header':header
    },
    created(){
        //常用商品
        axios.get('http://localhost:8080/api/seller?id='+this.seller.id)
        .then(response=>{
          // console.log(response.data.data);
          this.seller=Object.assign({},this.seller,response.data.data);
          console.log(this.seller.id);
        })
        .catch(error=>{
          alert('网络错误，不能访问');
        })
    }
  }
</script>

<style type="text/css" lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl';
  #app
   .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
     flex: 1
     text-align: center
     & > a
      display: block
      font-size: 14px
      color: rgb(77,85,93)
      &.router-link-active
       color: rgb(240,20,20)
</style>
