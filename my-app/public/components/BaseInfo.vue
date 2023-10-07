<template>
  <div class="section big-section" id="baseInfo">
    <div class="form-content">
      <div class="form-list">
        <div class="input-item">
          <div class="input-name">
            <i>*</i> 1、酒店名称<span>（字数最多34个）</span>
          </div>
          <input
            class="input-info"
            type="text"
            maxlength="34"
            v-model="options.hotelName"
          />
        </div>
        <div class="input-item">
          <div class="input-name">
            <i>*</i> 2、酒店地址<span>（字数最多50个）</span>
          </div>
          <input
            maxlength="50"
            class="input-info"
            type="text"
            v-model="options.hotelAddress"
          />
        </div>
        <button class="custom-btn btn-11" @click="saveImgToBoard">
          {{ saveStatus ? "已保存" : "保存" }}
        </button>
      </div>
      <div class="img-box">
        <img id="baseInfoImg" class="item-img" src="" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "../utils/toast";
export default {
  name: "BaseInfo",
  data() {
    return {
      saveStatus: false,
      options: {
        hotelName: "",
        hotelAddress: "",
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
  },
  mounted() {
    this.drawImg();
  },
  methods: {
    drawImg() {
      const data = {
        width: 750,
        height: 1165,
        quality: 1,
        ratio: 2,
        elements: [
          {
            type: "img",
            x: 0,
            y: 0,
            width: 750,
            height: 1165,
            radius: 0,
            autoHeight: false,
            content:
              "https://fp.yangcong345.com/middle/1.0.0/base_new.png",
          },
          {
            type: "text",
            x: 68,
            y: 930,
            width: 608,
            autoHeight: true,
            lineHeight: 3,
            letterSpacing: "1px",
            fontFamily: '"PingFang SC","sans-serif"',
            content: [
              {
                fontSize: 30,
                bold: 800,
                color: "#fff",
                content: this.options.hotelName + "\n",
              },
              {
                content: this.options.hotelAddress,
                color: "#fff",
                fontSize: 26,
              },
            ],
          },
        ],
      };
      var img = document.getElementById("baseInfoImg");
      json2image(
        data,
        (url) => {
          img.src = url;
        },
        (err) => console.error(err)
      );
    },

    saveImgToBoard() {
      const options = this.options;
      for (var i in options) {
        if (options[i] === "") {
          this.$toast("每一项都需要按规则填写哦");
          return;
        }
      }
      if (!this.saveStatus) {
        this.$emit("saveImgToDownLoad", {
          id: "baseInfoImg",
          options: this.options,
          name: "酒店基本信息",
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
