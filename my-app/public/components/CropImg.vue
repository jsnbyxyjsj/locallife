<template>
  <div class="model-mask">
    <div class="cropperContent">
      <vue-cropper
        ref="cropper"
        :img="cropProps.img"
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="true"
        :full="option.full"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :fixed="option.fixed"
        :fixedNumber="option.fixedNumber"
        :centerBox="option.centerBox"
        :infoTrue="option.infoTrue"
        :fixedBox="option.fixedBox"
        @realTime="realTime"
      ></vue-cropper>
      <div class="button-box">
        <button class="custom-btn btn-11" @click="onSelect">确定</button>
        <button class="custom-btn btn-2" @click="onBack">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";

export default {
  components: {
    VueCropper,
  },

  props: {
    cropProps: {},
  },
  data() {
    return {
      //裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 400, // 默认生成截图框宽度
        autoCropHeight: 300, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [4, 3], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
    };
  },
  methods: {
    //放大/缩小
    changeScale(num) {
      console.log("changeScale");
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    }, //坐旋转
    rotateLeft() {
      console.log("rotateLeft");
      this.$refs.cropper.rotateLeft();
    }, //右旋转
    rotateRight() {
      console.log("rotateRight");
      this.$refs.cropper.rotateRight();
    }, // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    imgLoad(msg) {
      console.log(msg);
    },
    cropImage() {},
    onSelect() {
      this.$refs.cropper.getCropBlob((data) => {
        var img = window.URL.createObjectURL(data);
        this.$emit("setCropImg", {
          status: false,
          img,
          id: this.cropProps.id,
        });
      });
    },
    onReset(param) {
      this.target = param.target;
      this.option.img = param.url;
      this.preview = param.url;
    },
    onBack() {
      this.$emit("changeCropModel", {
        status: false,
        img: "",
        id: "",
      });
    },
  },
};
</script>

<style>
.model-mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 90;
  background: #333333c2;
  align-items: center;
  display: flex;
  justify-content: center;
}
.cropperContent { 
  width: 70%;
  height: 50%;
}
.button-box {
  width: 300px;
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
}
.button-box button {
  flex: 1;
    margin-top: 20px;
}
</style>
