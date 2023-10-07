<template>
  <div class="form-content">
    <div class="form-list">
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 1、服务设施名称<span>（字数限制12个）</span>
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
        <input
          maxlength="52"
          class="input-info"
          type="text"
          v-model="options.des"
          v-on:blur="onInputBlur('des')"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i> 3、开放时间<span>（字数最多18个）</span>
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
          <i>*</i> 4、位置<span>（字数最多18个）</span>
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
          <i>*</i> 5、补充信息<span
            >（如是否收费、是否需要预约、前台电话等，字数最多36个）</span
          >
        </div>
        <textarea
          maxlength="36"
          class="input-info"
          type="text"
          v-model="options.other"
        />
      </div>
      <div class="input-item">
        <div class="input-name">
          <i>*</i>6、上传图片<span>（照片比例为4:3，大小限制为0.3-2M）</span>
          <div class="upload-file">
            <input
              type="file"
              class="input-file"
              @change="handleSuccess"
              multiple="true"
            />
            <span class="tip" :id="'hotel-tip' + id">点击上传图片</span>
          </div>
        </div>
      </div>
      <button class="custom-btn btn-11" @click="saveImgToBoard">
        {{ saveStatus ? "已保存" : "保存" }}
      </button>
      <button
        v-if="id !== 'hotel'"
        class="custom-btn btn-2"
        @click="removeSection"
      >
        删除模块
      </button>
    </div>
    <div class="img-box">
      <img :id="'hotel-' + id" class="item-img" src="" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Hotel",
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
        address: "",
        time: "",
        other: "",
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
            content: "https://fp.yangcong345.com/middle/1.0.0/hotel_new.png",
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
            type: "img",
            x: 67.5,
            y: 452,
            width: 615,
            height: 461.25,
            content: this.options.img_url,
          },

          {
            type: "text",
            x: 66,
            y: 950,
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
            x: 130,
            y: 1067,
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
            x: 130,
            y: 1104,
            width: 480,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 22,
            color: "#333",
            fontFamily: '"buer-b"',
            content: this.options.address,
          },

          {
            type: "text",
            x: 130,
            y: 1143,
            width: 480,
            autoHeight: true,
            lineHeight: 1.6,
            letterSpacing: "1px",
            fontSize: 22,
            color: "#333",
            fontFamily: '"buer-b"',
            content: this.options.other,
          },
        ],
      };
      var img = document.getElementById("hotel-" + this.id);
      json2image(
        data,
        (url) => {
          img.src = url;
        },
        (err) => console.error(err)
      );
    },

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
      this.$emit("removeSection", { type: "hotel", id: this.id });
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
          id: "hotel-" + this.id,
          options: this.options,
          name: `酒店特色服务${this.itemIndex === 0 ? "" : this.itemIndex}`,
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
