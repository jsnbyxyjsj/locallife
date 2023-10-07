<template>
  <div class="section big-section" id="about">
    <div class="form-content">
      <div class="form-list">
        <div class="input-item">
          <div class="input-name">
            <i>*</i> 1、一句话介绍酒店亮点<span>（字数限制10-52个）</span>
          </div>
          <textarea
            class="input-info"
            type="text"
            maxlength="52"
            v-model="options.point"
            v-on:blur="onInputBlur('point')"
          />
        </div>
        <div class="input-item">
          <div class="input-name">
            <i>*</i> 2、酒店介绍<span>（字数限制50-180个）</span>
          </div>
          <textarea
            maxlength="180"
            class="input-info"
            type="text"
            v-model="options.des"
            v-on:blur="onInputBlur('des')"
          />
        </div>
        <div class="input-item">
          <div class="input-name">
            <i>*</i> 3、上传图片<span>（照片比例为4:3，大小限制为0.3-2M）</span>
            <div class="upload-file">
              <input
                type="file"
                class="input-file"
                @change="handleSuccess"
                multiple="true"
              />
              <span class="tip">点击上传图片</span>
            </div>
          </div>
        </div>

        <button class="custom-btn btn-11" @click="saveImgToBoard">
          {{ saveStatus ? "已保存" : "保存" }}
        </button>
      </div>
      <div class="img-box">
        <img id="aboutImg" class="item-img" src="" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "about",
  props:{
    cropedImg:{}
  },
  data() {
    return {
      saveStatus: false,
      options: {
        point: "",
        des: "",
        img_url: "https://fp.yangcong345.com/middle/1.0.0/asset/blank.png",
      },
    };
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.drawImg();
        this.saveStatus = false;
      },
    },
    cropedImg: {
      deep: true,
      handler() { 
        if(this.cropedImg.id==='about'){
          this.options.img_url=this.cropedImg.img
        }
      },
    },
  },
  mounted() {
    this.drawImg();
  },
  methods: {
    drawImg() {
      const data = {
        width: 750,
        height: 1265,
        quality: 1,
        ratio: 2,
        output: "png",
        elements: [
          {
            type: "img",
            x: 0,
            y: 0,
            width: 750,
            height: 1265,
            radius: 0,
            content: "https://fp.yangcong345.com/middle/1.0.0/about_new.png",
          },
          {
            type: "text",
            x: 68,
            y: 244,
            width: 608,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 36,
            bold: 800,
            color: "#333",
            fontFamily: '"buer"',
            content: this.options.point,
          },
          {
            type: "img",
            x: 67.5,
            y: 471,
            width: 615,
            height: 461.25,
            content: this.options.img_url,
          },
          {
            type: "text",
            x: 68,
            y: 959,
            width: 608,
            height: 280,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 22,
            color: "#333",
            fontFamily: '"buer-b"',
            content: this.options.des,
          },
        ],
      };
      var img = document.getElementById("aboutImg");
      json2image(
        data,
        (url) => {
          img.src = url;
        },
        (err) => console.error(err)
      );
    },

    onInputBlur(type) {
      switch (type) {
        case "point":
          if (this.options.point.length < 10) {
            this.$toast("酒店亮点至少要10个字");
          }
          break;
        case "des":
          if (this.options.des.length < 50) {
            this.$toast("酒店介绍至少要50个字");
          }
          break;
      }
    },
    handleSuccess(e) {
      const file = e.target.files[0];
      // 限制上传图片类型
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$toast("图片类型要求：jpeg、jpg、png");
        return false;
      }
      // 图片大小不超过1M
      if (file.size / (1024 * 1024) > 3) {
        this.$toast("图片大小不超过3M");
        return false;
      }
      // 文件转化base64格式，用于页面预览（或调用接口上传图片，获取图片地址，再赋值
      var reader = new FileReader();
      reader.onload = (data) => {
        // this.options.img_url = data.target.result;
        this.$emit("changeCropModel", {
          status: true,
          img: data.target.result,
          id: "about",
        }); 
      };
      reader.readAsDataURL(file);
    },

    saveImgToBoard() {
      const options = this.options;
      for (var i in options) {
        if (
          options[i] === "" ||
          options["img_url"] ===
            "https://fp.yangcong345.com/middle/1.0.0/asset/blank.png" ||
          options["des"].length < 50 ||
          options["point"].length < 10
        ) {
          this.$toast("每一项都需要按规则填写哦");
          return;
        }
      }
      if (!this.saveStatus) {
        this.$emit("saveImgToDownLoad", {
          id: "aboutImg",
          options: this.options,
          name: "关于本店",
        });
        this.$toast("保存成功");
        this.saveStatus = true;
      } else {
        this.$toast("当前图片已经保存过了，请重新修改后重试");
      }
    },
  },
};
</script>

<style></style>
