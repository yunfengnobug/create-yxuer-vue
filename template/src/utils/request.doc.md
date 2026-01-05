# Request 网络请求使用文档

## 参数说明

网络请求方法支持以下参数：

- **第一个参数 url**：请求地址 [必填]
- **第二个参数 data**：传参对象 [可选]
- **第三个参数 paramType**：传参方式（get请求默认为query，可不传，post请求默认为body，可不传）[可选]
- **第四个参数 config**：其他配置（如额外headers项）[可选]

## 使用示例

### 1. GET 请求 - 无参数

```typescript
const getDataNoQuery = async () => {
  try {
    // 无参只传url即可
    const res = await request.get('/api/list')
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}
```

### 2. GET 请求 - 带参数

```typescript
const getDataWithQuery = async () => {
  try {
    // 有参数时 get 请求默认为 query 传参方式
    const res = await request.get('/api/list', {
      userId: 1,
    })
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}
```

### 3. POST 请求 - 默认 body 传参

```typescript
const postData = async () => {
  try {
    // 有参数时 post 请求默认为 body 传参方式
    const res = await request.post('/api/list', {
      userId: 1,
    })
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}
```

### 4. POST 请求 - 指定 query 传参

```typescript
const postDataWithQuery = async () => {
  try {
    // 有参数时 post 请求默认为 body 传参方式, 若使用 query 传参方式, 则需要指定第三个参数为 'query'
    const res = await request.post(
      '/api/list',
      {
        userId: 1,
      },
      'query',
    )
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}
```

### 5. POST 请求 - 添加额外配置

```typescript
const postDataAddHeaders = async () => {
  try {
    // 其他配置，第四个参数，例如此接口额外的Headers
    const res = await request.post(
      '/api/list',
      {
        userId: 1,
      },
      'body',
      {
        headers: {
          deviceId: '1234567890',
        },
      },
    )
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}
```
