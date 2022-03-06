<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录" />
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        label="手机号"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        name="mobile"
        maxlength="11"
        type="number"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        label="短信验证码"
        placeholder="请输入短信验证码"
        v-model="user.code"
        name="code"
        maxlength="6"
        type="number
        "
      >
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            slot="button"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            @click="onSendSms"
            size="small"
            type="default"
            class="send-msg-btn"
            >发送验证码
          </van-button>
        </template>
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="primary" class="login-btn" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
3
<script>
import { login, getSmsCode } from '../../api/user'
export default {
  name: 'LoginPage',
  components: {},
  methods: {
    async onSubmit () {
      // console.log(this.$store.state.name);
      // console.log(this.$router);
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载中...'
      })

      try {
        const res = await login(this.user)
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登陆成功', res)
      } catch (error) {
        console.log(error)
        if (error.response.status === 400) {
          this.$toast.fail('登录失败，手机号或验证码错误')
        }
      }
      this.$router.back()
    },

    async onSendSms () {
      // 1. 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      this.isCountDownShow = true
      try {
        await getSmsCode(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.router.status === 429) {
          this.$toast('发送太频繁了')
        } else {
          this.$toast('发送失败')
        }
      }
      // 2. 验证通过，显示倒计时
      // 3. 请求发送验证码
    }
  },
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isCountDownShow: false,
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      }
    }
  }
}
</script>

<style scope lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
}
.send-msg-btn {
  width: 152px;
  height: 46px;
  background-color: #ededed;
  border-radius: 23px;
  font-size: 22px;
}
.login-btn-wrap {
  margin: 53px 28px;
  .login-btn {
    width: 694px;
    height: 88px;
    background-color: #6db4fb;
    border: none;
  }
}
</style>
