<script setup lang="ts">
/**
 * 使用方式：
 *   <ImagePreview v-model:visible="previewVisible" :image-url="seatLayoutImageUrl" />
 */

import { ref, watch, onMounted, onUnmounted } from 'vue'
import {
  CloseOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  UndoOutlined,
  RedoOutlined,
  CompressOutlined,
} from '@ant-design/icons-vue'

interface Props {
  visible: boolean
  imageUrl: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  imageUrl: '',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

// 图片样式状态
const scale = ref(1) // 缩放比例
const rotate = ref(0) // 旋转角度

// 重置状态
const resetTransform = () => {
  scale.value = 1
  rotate.value = 0
}

// 关闭预览
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
  // 延迟重置，等待关闭动画完成
  setTimeout(() => {
    resetTransform()
  }, 300)
}

// 放大
const handleZoomIn = () => {
  if (scale.value < 3) {
    scale.value += 0.2
  }
}

// 缩小
const handleZoomOut = () => {
  if (scale.value > 0.2) {
    scale.value -= 0.2
  }
}

// 还原
const handleReset = () => {
  resetTransform()
}

// 顺时针旋转
const handleRotateRight = () => {
  rotate.value += 90
}

// 逆时针旋转
const handleRotateLeft = () => {
  rotate.value -= 90
}

// 监听 ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.visible) {
    handleClose()
  }
}

// 监听鼠标滚轮缩放
const handleWheel = (e: WheelEvent) => {
  if (!props.visible) return
  e.preventDefault()
  if (e.deltaY < 0) {
    handleZoomIn()
  } else {
    handleZoomOut()
  }
}

// 监听 visible 变化
watch(
  () => props.visible,
  (val) => {
    if (val) {
      // 阻止背景滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 恢复背景滚动
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="image-preview-overlay" @click.self="handleClose">
      <!-- 关闭按钮 -->
      <div class="close-btn" @click="handleClose">
        <CloseOutlined />
      </div>

      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="toolbar-btn" @click="handleZoomOut" title="缩小">
          <ZoomOutOutlined />
        </div>
        <div class="toolbar-btn" @click="handleZoomIn" title="放大">
          <ZoomInOutlined />
        </div>
        <div class="toolbar-btn" @click="handleReset" title="还原">
          <CompressOutlined />
        </div>
        <div class="toolbar-divider"></div>
        <div class="toolbar-btn" @click="handleRotateLeft" title="逆时针旋转">
          <UndoOutlined />
        </div>
        <div class="toolbar-btn" @click="handleRotateRight" title="顺时针旋转">
          <RedoOutlined />
        </div>
        <div class="scale-text">{{ Math.round(scale * 100) }}%</div>
      </div>

      <!-- 图片 -->
      <div class="image-wrapper" @wheel.prevent="handleWheel">
        <img
          :src="imageUrl"
          :style="{
            transform: `scale(${scale}) rotate(${rotate}deg)`,
          }"
          alt="预览图片" />
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  // 关闭按钮
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10001;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }
  }

  // 工具栏
  .toolbar {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 24px;
    backdrop-filter: blur(10px);
    z-index: 10001;

    .toolbar-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .toolbar-divider {
      width: 1px;
      height: 20px;
      background-color: rgba(255, 255, 255, 0.3);
      margin: 0 4px;
    }

    .scale-text {
      min-width: 50px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      margin-left: 8px;
    }
  }

  // 图片容器
  .image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
      user-select: none;
      pointer-events: none;
    }
  }
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
