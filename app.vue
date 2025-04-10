<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="container">
      <h1>Nuxt SSR Amplify テスト</h1>

      <div class="content">
        <h2>サーバーサイドレンダリング</h2>
        <div class="data-box">
          <p>レンダリング時刻: {{ formatTime(serverTime) }}</p>
          <p>リクエスト時刻: {{ serverData.requestTime }}</p>
          <p>IPアドレス: {{ serverData.ip }}</p>
          <p>User-Agent: {{ serverData.userAgent }}</p>
          <div class="headers">
            <h4>ヘッダー情報</h4>
            <pre>{{ JSON.stringify(serverData.headers, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <ClientOnly>
        <div class="content">
          <h2>クライアントサイドレンダリング</h2>
          <div class="data-box">
            <p>レンダリング時刻: {{ formatTime(clientTime) }}</p>
            <p>リクエスト時刻: {{ clientData.requestTime }}</p>
            <p>IPアドレス: {{ clientData.ip }}</p>
            <p>User-Agent: {{ clientData.userAgent }}</p>
            <div class="headers">
              <h4>ヘッダー情報</h4>
              <pre>{{ JSON.stringify(clientData.headers, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </ClientOnly>

      <div class="explanation">
        <h3>違いの説明</h3>
        <ul>
          <li>サーバーサイドレンダリングは、ページの初回ロード時にサーバーで実行されます</li>
          <li>クライアントサイドレンダリングは、ブラウザで実行されます</li>
          <li>ページのソースコードを表示すると、サーバーサイドのデータが含まれています</li>
          <li>IPアドレスやヘッダー情報の違いから、SSRとCSRの違いを確認できます</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// 時刻フォーマット関数
const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.toLocaleString('ja-JP')}.${d.getMilliseconds().toString().padStart(3, '0')}`
}

// サーバーサイドで実行されるデータ取得
const { data: initialServerData } = await useFetch('/api/request-info')

// サーバーサイドの状態管理
const serverTime = useState('serverTime', () => new Date())
const serverData = useState('serverData', () => ({
  ...initialServerData.value
}))

// クライアントサイドのデータ
const clientTime = ref(null)
const clientData = ref({
  ip: '',
  userAgent: '',
  requestTime: '',
  headers: {}
})

onMounted(async () => {
  // クライアントサイドでデータを取得
  const { data } = await useFetch('/api/request-info')
  clientData.value = data.value

  // クライアントサイドの時刻を設定
  clientTime.value = new Date()
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.content {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.data-box {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.headers {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.headers h4 {
  margin: 0 0 0.5rem 0;
  color: #666;
}

pre {
  margin: 0;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
}

h3 {
  color: #666;
  margin: 2rem 0 1rem;
}

p {
  margin: 0.5rem 0;
  font-family: monospace;
}

.explanation {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

li {
  margin: 0.5rem 0;
}
</style>
