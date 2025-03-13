---
title: "Async Pattern [1/3] - Promises & Async/Await trong JavaScript / TypeScript"
draft: false
date: 2024-10-08
description: "Promises và Async/Await là hai mẫu thiết kế cơ bản cho xử lý bất đồng bộ trong JavaScript và TypeScript. Bài viết này phân tích cách triển khai và ứng dụng của chúng trong các tình huống thực tế."
slug: "promises-async-await-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Promises
  - Async/Await
  - Asynchronous Programming
---

## 1. Promises là gì?

Promise là một đối tượng đại diện cho kết quả của một tác vụ bất đồng bộ. Nó có thể ở một trong ba trạng thái:
- Pending: Đang chờ kết quả
- Fulfilled: Hoàn thành thành công
- Rejected: Hoàn thành thất bại

```javascript
const promise = new Promise((resolve, reject) => {
  // Tác vụ bất đồng bộ
  setTimeout(() => {
    const random = Math.random();
    if (random > 0.5) {
      resolve('Success!');
    } else {
      reject('Failed!');
    }
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## 2. Async/Await là gì?

Async/Await là cú pháp "syntactic sugar" giúp viết code bất đồng bộ theo kiểu đồng bộ, giúp code dễ đọc và maintain hơn.

```javascript
async function example() {
  try {
    const result = await promise;
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

## 3. Triển khai trong JavaScript

### 3.1 Promise Chaining

```javascript
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(user => fetch(`/api/posts?userId=${user.id}`))
    .then(response => response.json())
    .then(posts => {
      return {
        user,
        posts
      };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

// Sử dụng
fetchUserData(1)
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 3.2 Promise Combinators

```javascript
// Promise.all - chờ tất cả promises hoàn thành
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.all(promises)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Promise.race - lấy kết quả của promise hoàn thành đầu tiên
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 5000)
);

Promise.race([fetch('/api/data'), timeoutPromise])
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Promise.allSettled - chờ tất cả promises kết thúc (thành công hoặc thất bại)
Promise.allSettled(promises)
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Success:', result.value);
      } else {
        console.log('Error:', result.reason);
      }
    });
  });
```

## 4. Triển khai trong TypeScript

### 4.1 Type-safe Promises

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function fetchUserPosts(userId: number): Promise<Post[]> {
  const response = await fetch(`/api/posts?userId=${userId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Generic Promise utility types
type AsyncResult<T> = Promise<{
  data: T;
  error: null;
} | {
  data: null;
  error: Error;
}>;

async function safeAsync<T>(
  promise: Promise<T>
): AsyncResult<T> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}
```

### 4.2 Custom Promise Implementations

```typescript
class AsyncQueue<T> {
  private queue: Promise<T>[];
  private concurrency: number;
  private running: number;

  constructor(concurrency: number = 1) {
    this.queue = [];
    this.concurrency = concurrency;
    this.running = 0;
  }

  async add<R>(task: () => Promise<R>): Promise<R> {
    while (this.running >= this.concurrency) {
      await Promise.race(this.queue);
    }

    this.running++;
    const promise = task().finally(() => {
      this.running--;
      this.queue = this.queue.filter(p => p !== promise);
    });

    this.queue.push(promise);
    return promise;
  }
}

// Sử dụng
const queue = new AsyncQueue(2);

async function processTask(id: number): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
  return `Task ${id} completed`;
}

async function example() {
  const tasks = Array.from({ length: 5 }, (_, i) => i);
  const results = await Promise.all(
    tasks.map(id => queue.add(() => processTask(id)))
  );
  console.log(results);
}
```

## 5. Ví dụ Thực Tế: API Client với Retry và Cache

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiClient {
  private cache: Map<string, CacheEntry<any>>;
  private cacheDuration: number;
  private maxRetries: number;

  constructor(cacheDuration: number = 5 * 60 * 1000, maxRetries: number = 3) {
    this.cache = new Map();
    this.cacheDuration = cacheDuration;
    this.maxRetries = maxRetries;
  }

  private async retryFetch<T>(
    url: string,
    options: RequestInit,
    retries: number = 0
  ): Promise<T> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      if (retries < this.maxRetries) {
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryFetch<T>(url, options, retries + 1);
      }
      throw error;
    }
  }

  private isCacheValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < this.cacheDuration;
  }

  async get<T>(url: string, forceRefresh: boolean = false): Promise<T> {
    const cacheKey = url;
    const cachedData = this.cache.get(cacheKey);

    if (!forceRefresh && cachedData && this.isCacheValid(cachedData)) {
      return cachedData.data;
    }

    const data = await this.retryFetch<T>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  async post<T>(url: string, body: any): Promise<T> {
    return this.retryFetch<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
}

// Sử dụng
interface User {
  id: number;
  name: string;
}

const api = new ApiClient();

async function example() {
  try {
    // Lấy dữ liệu với cache
    const users = await api.get<User[]>('/api/users');
    console.log(users);

    // Force refresh cache
    const freshUsers = await api.get<User[]>('/api/users', true);
    console.log(freshUsers);

    // Post dữ liệu mới
    const newUser = await api.post<User>('/api/users', {
      name: 'John Doe'
    });
    console.log(newUser);
  } catch (error) {
    console.error('API Error:', error);
  }
}
```

## 6. Ưu điểm và Nhược điểm

### 6.1 Ưu điểm
- **Dễ đọc**: Code bất đồng bộ trở nên dễ đọc và maintain hơn
- **Error handling**: Xử lý lỗi tập trung và nhất quán
- **Composability**: Dễ dàng kết hợp nhiều tác vụ bất đồng bộ
- **Type safety**: TypeScript hỗ trợ tốt cho Promises và Async/Await

### 6.2 Nhược điểm
- **Memory**: Promises có thể giữ tài nguyên lâu hơn cần thiết
- **Complexity**: Có thể phức tạp khi xử lý nhiều promises đồng thời
- **Error propagation**: Lỗi có thể bị "nuốt" nếu không xử lý cẩn thận
- **Performance**: Overhead nhỏ so với callbacks thuần túy

## 7. Khi nào nên sử dụng?

Promises và Async/Await phù hợp khi:
- Xử lý các tác vụ bất đồng bộ như API calls
- Cần xử lý lỗi một cách nhất quán
- Muốn code dễ đọc và maintain
- Làm việc với nhiều tác vụ bất đồng bộ đồng thời

## 8. Kết luận

Promises và Async/Await là hai mẫu thiết kế cơ bản và quan trọng trong JavaScript / TypeScript hiện đại. Chúng giúp xử lý code bất đồng bộ một cách dễ dàng và hiệu quả, đồng thời cung cấp cách xử lý lỗi nhất quán.
