import { reactive } from 'vue';
<template>
  <div class="checkBox">
    <div class="board-img-box" >
      <img :src="item.src" alt="" /> 
      <div>✓</div>
    </div> 
  </div>
</template>
<script>
export default {
  props: {
    item: {},
  },
  name: "CheckBox",
  methods: { 
  },
};
</script>
<style>
.checkBox {
  padding: 10px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px; 
}

.board-img-box { 
  border:2px solid rgba(225, 225, 225, 0);
  overflow: hidden;
  display: flex;
  position:relative;
  border-radius: 4px  ;

}
.board-img-box img {
  width: 300px;
}
.board-img-box div {
  width: 30px;
  height:30px;
  opacity: 0;
  position:absolute;
  right:0;
  background: #f55f37;
  color:#fff;
  border-radius: 4px 0 0 0 ;
  bottom:0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.check-input {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
}
.board-label {
  width: 375px;
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: center;
}
label span {
  margin-left: 10px;
} 
</style>
