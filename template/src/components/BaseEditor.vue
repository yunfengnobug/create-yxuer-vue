<template>
  <div ref="editorRef" style="height: auto"></div>
</template>

<script setup lang="ts">
/**
 * 使用方式：
 *   <BaseEditor v-model:html-content="htmlContent" />
 *
 * 参数：
 *   htmlContent: 富文本内容
 *
 */
import { uploadFile } from '@/utils/upload'
import { AiEditor, type Uploader } from 'aieditor'
import 'aieditor/dist/style.css'
import { onMounted, onUnmounted, ref } from 'vue'
const htmlContent = defineModel<string>('htmlContent', { default: '' }) // html 字符串
const editorRef = ref()
const aiEditor = ref<AiEditor | null>(null)

onMounted(async () => {
  aiEditor.value = new AiEditor({
    element: editorRef.value as Element,
    onChange: (editor: any) => {
      htmlContent.value = editor.getHtml()
    },
    image: {
      allowBase64: false,

      uploader: (async (file: File) => {
        //可自定义图片上传逻辑
        const res: any = await uploadFile(file)
        if (res.status === 1) {
          return {
            errorCode: 0,
            data: {
              src: res.result.url,
              alt: res.result.fileName,
              align: 'center',
              width: '100%',
              height: 'auto',
              class: 'aieditor-img',
              loading: true,
              'data-src': res.result.url,
            },
          }
        }
      }) as Uploader,

      bubbleMenuItems: ['AlignLeft', 'AlignCenter', 'AlignRight', 'delete'],
    },
    video: {
      uploader: (async (file: File) => {
        //可自定义图片上传逻辑
        const res: any = await uploadFile(file)
        if (res.status === 1) {
          return {
            errorCode: 0,
            data: {
              src: res.result.url,
              // poster: 'http://your-domain.com/poster.jpg',
              width: '100%',
              controls: 'true',
            },
          }
        }
      }) as Uploader,
    },
    attachment: {
      uploader: (async (file: File) => {
        //可自定义图片上传逻辑
        const res: any = await uploadFile(file)
        if (res.status === 1) {
          return {
            errorCode: 0,
            data: {
              href: res.result.url,
              fileName: res.result.fileName,
            },
          }
        }
      }) as Uploader,
    },
    textSelectionBubbleMenu: {
      enable: true,
      items: [
        //'ai',
        'Bold',
        'Italic',
        'Underline',
        'Strike',
        'code',
        'comment',
      ],
    },
    // 排除部分工具
    toolbarExcludeKeys: [
      'source-code', // 源代码
      'printer', // 打印
      'fullscreen', // 全屏
      'ai', // AI
      'quote', // 引用
      'container', // 高亮块
      'code-block', // 代码块
      'code', // 行内代码
      'table', // 表格
    ],
    placeholder: '点击输入内容...',
    content: htmlContent.value || '',
  })
})

onUnmounted(() => {
  aiEditor.value?.destroy()
})
</script>
