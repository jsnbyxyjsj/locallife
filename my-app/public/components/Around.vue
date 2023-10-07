<template>
  <div class="form-content">
    <div class="form-list">
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 1、门店/游乐场景/街道等名称<span>（字数限制12个）</span>
        </div>
        <input
          class="input-info"
          type="text"
          maxlength="12"
          v-model="options.name"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 2、亮点介绍<span>（字数限制10-52个）</span>
        </div>
        <textarea
          maxlength="52"
          class="input-info"
          type="text"
          v-on:blur="onInputBlur('des')"
          v-model="options.des"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 3、推荐人<span
            >（字数最多12个，例如隔壁邻居张叔、成都20年土著小李）</span
          >
        </div>
        <input
          maxlength="12"
          class="input-info"
          type="text"
          v-model="options.person"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 4、推荐尝试<span>（字数最多18个）</span>
        </div>
        <input
          maxlength="18"
          class="input-info"
          type="text"
          v-model="options.recommend"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 5、距离酒店<span>（字数最多18个）</span>
        </div>
        <input
          maxlength="18"
          class="input-info"
          type="text"
          v-model="options.distance"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 6、人均消费<span>（字数最多18个）</span>
        </div>
        <input
          maxlength="18"
          class="input-info"
          type="text"
          v-model="options.per"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 7、营业时间<span>（字数最多18个）</span>
        </div>
        <input
          maxlength="18"
          class="input-info"
          type="text"
          v-model="options.time"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 8、店铺地址<span>（字数最多18个）</span>
        </div>
        <input
          maxlength="18"
          class="input-info"
          type="text"
          v-model="options.address"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 9、上传图片<span>（照片比例为4:3，大小限制为0.3-2M）</span>

          <div class="upload-file">
            <input
              type="file"
              class="input-file"
              @change="handleSuccess"
              multiple="true"
            />
            <span class="tip" :id="'around-tip' + id">点击上传图片</span>
          </div>
        </div>
      </div>
      <button class="custom-btn btn-11" @click="saveImgToBoard">
        {{ saveStatus ? "已保存" : "保存" }}
      </button>
      <button
        v-if="id !== 'around'"
        class="custom-btn btn-2"
        @click="removeSection"
      >
        删除模块
      </button>
    </div>
    <div class="img-box">
      <img :id="'around-' + id" class="item-img" src="" alt="" />
    </div>
  </div>
</template>

<script>
//使用

export default {
  name: "Around",
  props: {
    id: "",
    itemIndex: "",
    cropedImg: {},
  },
  data() {
    return {
      saveStatus: false,
      options: {
        des: "",
        name: "",
        person: "",
        recommend: "",
        distance: "",
        per: "",
        address: "",
        time: "",
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
        if (this.cropedImg.id === this.id) {
          this.options.img_url = this.cropedImg.img;
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
        height: 1415,
        quality: 1,
        ratio: 2,
        output: "png",
        elements: [
          {
            type: "img",
            x: 0,
            y: 0,
            width: 750,
            height: 1415,
            radius: 0,
            content: "https://fp.yangcong345.com/middle/1.0.0/around_new.png",
          },
          {
            type: "text",
            x: 68,
            y: 248,
            width: 608,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 36,
            bold: 800,
            color: "#333",
            fontFamily: '"buer"',
            content: this.options.des,
          },
          {
            type: "text",
            x: 66,
            y: 457,
            width: 492,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 28,
            textAlign: "right",
            color: "#333",
            fontFamily: '"buer"',
            content: "——" + this.options.person,
          },
          {
            type: "img",
            x: 67.5,
            y: 532,
            width: 616,
            height: 461.25,
            content: this.options.img_url,
          },

          {
            type: "text",
            x: 66,
            y: 1032,
            width: 608,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 36,
            bold: 800,
            color: "#333",
            fontFamily: '"buer"',
            content: this.options.name,
          },
          {
            type: "text",
            x: 180,
            y: 1128,
            width: 480,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 22,
            color: "#333",
            fontFamily: '"buer-b"',
            content: this.options.recommend,
          },

          {
            type: "text",
            x: 180,
            y: 1165,
            width: 480,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 22,
            color: "#333",
            fontFamily: '"buer-b"',
            content: this.options.distance,
          },

          {
            type: "text",
            x: 180,
            y: 1204,
            width: 480,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 22,
            color: "#333",
            fontFamily: '"buer-b"',
            content: this.options.per,
          },
          {
            type: "text",
            x: 180,
            y: 1242,
            width: 480,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 22,
            color: "#333",
            fontFamily: '"buer-b"',
            content: this.options.time,
          },

          {
            type: "text",
            x: 180,
            y: 1281,
            width: 480,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 22,
            color: "#333",
            fontFamily: '"buer-b"',
            content: this.options.address,
          },
        ],
      };
      var img = document.getElementById("around-" + this.id);
      json2image(
        data,
        (url) => {
          img.src = url;
        },
        (err) => console.error(err)
      );
    },

    // 文件上传成功
    handleSuccess(e) {
      const file = e.target.files[0];
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$toast("图片类型要求：jpeg、jpg、png");
        return false;
      }
      if (file.size / (1024 * 1024) > 2) {
        this.$toast("图片大小不超过3M");
        return false;
      }
      var reader = new FileReader();
      reader.onload = (data) => {
        this.$emit("changeCropModel", {
          status: true,
          img: data.target.result,
          id: this.id,
        });
      };
      reader.readAsDataURL(file);
    },

    onInputBlur(type) {
      switch (type) {
        case "des":
          if (this.options.des.length < 10) {
            this.$toast("亮点介绍至少要10个字");
          }
          break;
      }
    },
    removeSection() {
      this.$emit("removeSection", { type: "around", id: this.id });
    },
    saveImgToBoard() {
      const options = this.options;
      for (var i in options) {
        if (
          options[i] === "" ||
          options["img_url"] ===
            "https://fp.yangcong345.com/middle/1.0.0/asset/blank.png" ||
          options["des"].length < 10
        ) {
          this.$toast("每一项都需要按规则填写哦");
          return;
        }
      }
      if (!this.saveStatus) {
        this.$emit("saveImgToBoard", {
          id: "around-" + this.id,
          options: this.options,
          name: `周边吃喝玩乐${this.itemIndex === 0 ? "" : this.itemIndex}`,
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
