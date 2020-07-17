<template>
  <Card style="margin: 0 auto;">
    <i-form v-if="isRender" ref="form" :model="formData" :rules="rules" :label-width="90">
      <template v-for="item in formItemList">
        <!-- input 输入框 -->
        <!-- 通用 -->
        <form-item
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          v-if="item.template=='input'"
        >
          <i-input :type="item.type" v-model="formData[item.key]" :placeholder="item.placeholder"></i-input>
        </form-item>
        <!-- 密码 -->
        <form-item
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          v-if="item.template=='input-pwd'"
        >
          <i-input
            type="password"
            password
            v-model="formData[item.key]"
            :placeholder="item.placeholder"
          ></i-input>
        </form-item>
        <!-- radio 单选框 -->
        <!-- 通用分组 -->
        <form-item
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          v-if="item.template=='radio'"
        >
          <radio-group v-model="formData[item.key]">
            <Radio :label="list.value" v-for="list in item.list" :key="list.label">{{list.label}}</Radio>
          </radio-group>
        </form-item>
        <!-- 性别 -->
        <form-item
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          v-if="item.template=='radio-sex'"
        >
          <radio-group v-model="formData[item.key]">
            <Radio label="1" key="男">男</Radio>
            <Radio label="0" key="女">女</Radio>
          </radio-group>
        </form-item>
        <!-- Checkbox 多选框 -->
        <!-- 真假 -->
        <form-item
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          v-if="item.template=='checkbox-boolean'"
        >
          <Checkbox v-model="formData[item.key]">{{item.connent}}</Checkbox>
        </form-item>
        <!-- 通用分组 -->
        <form-item
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          v-if="item.template=='checkbox'"
        >
          <Checkbox-Group v-model="formData[item.key]">
            <Checkbox
              :label="list.value"
              v-for="list in item.list"
              :key="list.label"
              :disabled="item.disabled"
            >{{list.label}}</Checkbox>
          </Checkbox-Group>
        </form-item>
        <!-- Switch 开关 -->
        <form-item
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          v-if="item.template=='switch'"
        >
          <i-switch v-model="formData[item.key]" @on-change="item.change" />
        </form-item>
        <!-- Select 选择器 -->
        <form-item
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          v-if="item.template=='select'"
        >
          <i-select v-model="formData[item.key]" :style="item.style">
            <i-option
              v-for="list in item.list"
              :value="list.value"
              :key="list.value"
            >{{ list.label }}</i-option>
          </i-select>
        </form-item>
        <!-- AutoComlete 自动完成 -->
        <!-- Slider 滑块 -->
        <!-- DatePicker 日期选择器 -->
        <!-- TimePicker 时间选择器 -->
        <!-- Cascader 级联选择 -->
        <!-- Trasfer 穿梭框 -->
        <!-- inpuNumber 数字输入框 -->
        <!-- Tate 评分 -->
        <!-- Upload 评分 -->
        <!-- ColorPicker 颜色选择器 -->

        <form-item :key="item.key" v-if="item.template=='form-button'">
          <i-button
            v-if="item.submit"
            :type="item.submit.type"
            @click="handleSubmit"
          >{{item.submit.label}}</i-button>
          <i-button
            v-if="item.reset"
            :type="item.reset.type"
            @click="handleReset"
          >{{item.reset.label}}</i-button>
        </form-item>
      </template>
    </i-form>
  </Card>
</template>

<script>
export default {
  name: "DynamicIviewForm",
  props: {},
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("必填项!"));
      } else if (value !== this.formData.pwd) {
        callback(new Error("两次密码不匹配!"));
      } else {
        callback();
      }
    };
    return {
      isRender: false,
      // 循环规则
      formItemList: [
        {
          template: "input",
          key: "name",
          label: "用户名：",
          type: "text",
          placeholder: "请输入用户名",
          rules: ["required"]
        },
        {
          template: "input",
          key: "email",
          label: "邮箱：",
          type: "text",
          placeholder: "请输入邮箱",
          rules: ["required", "email"]
        },
        {
          template: "input-pwd",
          key: "pwd",
          label: "密码：",
          type: "",
          placeholder: "请输入密码",
          rules: ["required"]
        },
        {
          template: "input-pwd",
          key: "rpwd",
          label: "密码：",
          type: "",
          placeholder: "请确认密码",
          rules: ["required", "chekcPassword:pwd"]
        },
        {
          template: "radio",
          key: "sex",
          label: "性别：",
          type: "radio",
          list: [
            {
              label: "男",
              value: "1"
            },
            {
              label: "女",
              value: "0"
            }
          ]
        },
        {
          template: "radio-sex",
          key: "sex2",
          label: "男女"
        },
        // Checkbox
        {
          template: "checkbox",
          key: "like",
          label: "爱好",
          list: [
            {
              label: "抽烟",
              value: "1"
            },
            {
              label: "喝酒",
              value: "2"
            },
            {
              label: "烫头",
              value: "3"
            }
          ]
        },
        {
          template: "checkbox-boolean",
          key: "isOk",
          label: "同意",
          connent: "协议"
        },
        // switch
        {
          template: "switch",
          key: "isUse",
          label: "开关",
          change: () => this.change()
        },
        // 选择器
        {
          template: "select",
          key: "bumen",
          label: "部门",
          list: [
            {
              label: "智慧环保1",
              value: "1"
            },
            {
              label: "智慧环保2",
              value: "2"
            },
            {
              label: "智慧环保3",
              value: "3"
            }
          ]
        },

        {
          template: "form-button",
          key: "form-button",
          submit: {
            label: "提交",
            type: "primary",
            mode: "submit",
            style: ""
          },
          reset: {
            label: "重置",
            type: "default",
            mode: "reset",
            style: "margin-left: 8px"
          }
        }
      ],
      rules: {
        // name: [],
        // email: [
        //     { required: true, message: '必填项!', trigger: 'blur' },
        //     { type: 'email', message: '请输入正确的邮箱!', trigger: 'blur' },
        // ],
        // pwd: [
        //     { required: true, message: '必填项!', trigger: 'blur' }
        // ],
        // rpwd: [
        //     { validator: validatePassCheck, trigger: 'blur' }
        // ],
        // bumen: [
        //     { required: true, message: '必填项!', trigger: 'change' }
        // ],
      },
      formData: {
        name: 1
      }
    };
  },
  methods: {
    // 提交
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.formData);
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
          this.$emit();
        }
      });
    },
    // 重置
    handleReset: function() {
      this.$refs["form"].resetFields();
    },
    // 生成规则
    generateRules(data) {
      const getTrigger = template => {
        let map = {
          input: "blur",
          "input-pwd": "blur",
          "checkbox-boolean": "change"
        };
        return map[template] || template.includes("input") ? "blur" : "change";
      };
      const getRule = (rule, template) => {
        let arr = rule.split(":");
        rule = arr[0];
        let map = {
          required: {
            required: true,
            message: "必填项!",
            trigger: getTrigger(template)
          },
          email: {
            type: "email",
            message: "请输入正确邮箱!",
            trigger: getTrigger(template)
          },
          chekcPassword: {
            validator: function(passwordKey, rule, value, callback) {
              if (value === "") {
                callback(new Error("必填项!"));
              } else if (value !== this.formData[passwordKey]) {
                callback(new Error("两次密码不匹配!"));
              } else {
                callback();
              }
            }.bind(this, arr[1]),
            trigger: getTrigger(template)
          }
        };
        return map[rule] || {};
      };
      // this.rules = {};
      let tem = {};
      data.forEach(item => {
        const { template, key, rules } = item;
        // this.rules[key] = [];
        tem[key] = [];
        // rules && rules.forEach(rule => this.rules[key].push(getRule(rule, template)))
        rules && rules.forEach(rule => tem[key].push(getRule(rule, template)));
        // this.$set(this.rules, key, tem[key])
      });
      return tem;
    },
    //
    change() {
      console.log(111);
    }
  },
  mounted() {
    this.rules = this.generateRules(this.formItemList);
    this.isRender = true;
  }
};
</script>

<style>
</style>