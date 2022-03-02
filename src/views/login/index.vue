<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录" />
    <van-form @submit="onSubmit">
      <van-field
        label="手机号"
        placeholder="请输入手机号"
        v-model="user.mobile"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        label="短信验证码"
        placeholder="请输入短信验证码"
        v-model="user.code"
      >
        <template #button>
          <van-button size="small" type="default" class="send-msg-btn"
            >发送验证码</van-button
          >
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

<script>
import { login } from '../../api/user'
export default {
  name: 'LoginPage',
  components: {},
  methods: {
    async onSubmit () {
      this.$toast.loading({
        duration: 1,
        forbidClick: true,
        message: '加载中...'
      })
      try {
        const res = await login(this.user)
        this.$toast.success('登陆成功', res)
      } catch (error) {
        if (error.response.status === 400) {
          this.$toast.fail('登录失败，手机号或验证码错误')
        }
      }
    }
  },
  data () {
    return {
      user: {
        mobile: '',
        code: ''
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
