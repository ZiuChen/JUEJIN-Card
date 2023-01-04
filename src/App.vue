<template>
  <h1>掘金名片生成器</h1>
  <input
    id="user-id"
    v-model.lazy="userLink"
    placeholder="输入你的个人主页掘金链接 失焦触发"
    type="text"
  />
  <div class="card-wrapper">
    <div class="card" @click="handleCardClick">
      <Spin v-show="loadingStatus" tip="我知道你很急，但你先别急" />
      <svg
        class="icon"
        aria-hidden="true"
        :style="{ width: '150px', height: '50px' }"
        v-show="face"
      >
        <use xlink:href="#icon-juejin-full"></use>
      </svg>
      <div class="header" v-show="!loadingStatus && !face">
        <img class="avatar" :src="userInfo.avatar_large" alt="avatar" />
        <div>
          <div class="name">{{ userInfo.user_name }}</div>
          <div class="job">
            {{ userInfo.job_title }}
          </div>
        </div>
        <svg class="icon juejin-icon" aria-hidden="true">
          <use xlink:href="#icon-juejin"></use>
        </svg>
      </div>
      <div class="body" v-show="!loadingStatus && !face">
        {{ userInfo.description }}
      </div>
      <div class="footer" v-show="!loadingStatus && !face">
        <div class="footer-item">
          <svg class="icon" aria-hidden="true" :style="{ fill: '#23c9ed' }">
            <use xlink:href="#icon-account-outline"></use>
          </svg>
          <span>{{ userInfo.follower_count }}</span>
        </div>
        <div class="footer-item">
          <svg class="icon" aria-hidden="true" :style="{ fill: '#ff5d47' }">
            <use xlink:href="#icon-thumb-up-outline"></use>
          </svg>
          <span>{{ userInfo.got_digg_count }}</span>
        </div>
        <div class="user-id">{{ userInfo.user_id }}</div>
      </div>
    </div>
  </div>
  <div class="operation">
    <Tooltip content="深色模式" position="bottom">
      <div class="button" @click="toggleDark">
        {{ darkState ? '🌛' : '🌞' }}
      </div>
    </Tooltip>
    <Tooltip content="切换朝向" position="bottom">
      <div class="button" @click="toggleFace">
        {{ face ? '🔒' : '🔓' }}
      </div>
    </Tooltip>
    <Tooltip content="保存为图片" position="bottom">
      <div class="button" @click="saveToImage">
        {{ '⛺' }}
      </div>
    </Tooltip>
    <Tooltip content="重置" position="bottom">
      <div class="button" @click="resetUserInfo">
        {{ '😎' }}
      </div>
    </Tooltip>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import fetchUserInfo from './hooks/fetchUserInfo'
import { Message, Spin, Tooltip } from '@arco-design/web-vue'
import html2canvas from 'html2canvas'

const defaultUserInfo = {
  user_name: 'Ziu',
  avatar_large:
    'https://p26-passport.byteacctimg.com/img/user-avatar/0193e504561e58346739b61df5e7cf0c~300x300.image',
  job_title: '前端首席摸鱼师',
  description: '你好，世界 👋',
  follower_count: 99,
  got_digg_count: 400,
  user_id: 4420463502826087
}

const loadingStatus = ref(false)
const userInfo = ref(defaultUserInfo)
const userLink = ref('')

watch(userLink, (val) => {
  // 正则匹配掘金链接中的 uid
  if (val === '') return
  const uid = val.match(/\/user\/(\d+)/)?.[1]
  if (!uid) {
    Message.warning({
      content: '请输入正确的掘金链接',
      duration: 2500
    })
    return
  } else {
    loadingStatus.value = true
    fetchUserInfo(uid)
      .then(({ data }) => {
        console.log(data)
        userInfo.value = data
        loadingStatus.value = false
      })
      .catch((err) => {
        Message.error({
          content: err,
          duration: 2500
        })
      })
  }
})

onMounted(() => {
  const multiple = 10
  const element = document.querySelector('.card')

  function transformElement(x, y) {
    const box = element.getBoundingClientRect()
    // 计算鼠标位置与卡片中心的距离
    // 除以 multiple 使得旋转角度不会太大
    const calcX = -(y - box.y - box.height / 2) / multiple
    const calcY = (x - box.x - box.width / 2) / multiple
    const transform = 'rotateX(' + calcX + 'deg) ' + 'rotateY(' + calcY + 'deg)'
    element.style.transform = transform

    // 更新user-id的颜色 实现类似彩虹的效果
    const userId = document.querySelector('.user-id')
    userId.style['background-position'] = `${calcY * 5}% 0`
  }

  element.addEventListener('mousemove', (e) => {
    window.requestAnimationFrame(function () {
      // 每次重绘 获取最新的鼠标位置并对卡片执行变换
      transformElement(e.clientX, e.clientY)
    })
  })
  element.addEventListener('mouseleave', (e) => {
    // 鼠标移出时重置卡片的变换
    setTimeout(() => {
      element.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }, 100)
  })
})

const darkState = ref(false)
const toggleDark = () => {
  const root = document.querySelector('html')
  root.classList.toggle('dark')
  darkState.value = !darkState.value
}

const face = ref(false) // false: 正面 true: 反面
const toggleFace = () => {
  const card = document.querySelector('.card')
  card.classList.toggle('back')
  face.value = !face.value
}

const resetUserInfo = () => {
  userInfo.value = defaultUserInfo
  userLink.value = ''
}

const saveToImage = () => {
  const card = document.querySelector('.card')
  html2canvas(card, {
    backgroundColor: null,
    useCORS: true
  })
    .then((canvas) => {
      const link = document.createElement('a')
      link.download = '掘金名片.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    })
    .then(() => {
      Message.success({
        content: '保存成功',
        duration: 2500
      })
    })
    .catch((err) => {
      Message.error({
        content: err,
        duration: 2500
      })
    })
}
const handleCardClick = () => window.open('https://juejin.cn/user/' + userInfo.value.user_id)
</script>

<style lang="less" scoped>
#user-id {
  height: 25px;
  width: 350px;
  outline: none;
  font-size: 1.1em;
  text-align: center;
  border: var(--border-color) 1px solid;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 20px;
}
.card-wrapper {
  padding: 50px;
  border-radius: 5px;
  background: linear-gradient(135deg, #f54ea2, #ff7676);
}
.card {
  width: 350px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: var(--bg-color);
  border: var(--border-color) 1px solid;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.15s;
  cursor: pointer;
  user-select: none;
  .header {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    .avatar {
      position: relative;
      height: 50px;
      clip-path: circle(50% at 50% 50%);
    }
    & > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      margin-left: 20px;
      .name {
        font-size: 1.2em;
        font-weight: bold;
        color: var(--primary-color);
      }
      .job {
        color: var(--text-color);
      }
    }
    .juejin-icon {
      position: absolute;
      right: 0px;
      height: 45px;
      width: 45px;
    }
  }
  .body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    color: var(--text-color);
    overflow: hidden;
  }
  .footer {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    .footer-item {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      svg {
        height: 20px;
        width: 20px;
        margin-right: 5px;
      }
      span {
        color: var(--text-color);
      }
    }
    .user-id {
      position: absolute;
      right: 0;
      background: linear-gradient(
        90deg,
        rgba(131, 58, 180, 1) 0%,
        rgba(253, 29, 29, 1) 33.3%,
        rgba(252, 176, 69, 1) 66.6%,
        rgba(131, 58, 180, 1) 100%
      );
      background-clip: text; /*截取背景区域为文字*/
      -webkit-background-clip: text; /*截取背景区域为文字*/
      -webkit-text-fill-color: transparent; /*文字颜色透明*/
      color: transparent;
      background-size: 300% 100%; /*扩大背景区域*/
    }
  }
}
.operation {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  padding-right: 10px;
  > div {
    margin-left: 10px;
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 30px;
    background-color: var(--primary-color);
    cursor: pointer;
    user-select: none;
    transition: all 0.15s;
    border-radius: 10px;
    &:hover {
      transform: scale(1.2);
    }
    &:active {
      transform: scale(1.4);
    }
    img {
      height: 20px;
    }
  }
}
</style>
