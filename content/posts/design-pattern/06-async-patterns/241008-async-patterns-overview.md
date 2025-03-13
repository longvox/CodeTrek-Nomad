---
title: "Async Patterns - Tổng quan về các mẫu thiết kế bất đồng bộ trong JavaScript/TypeScript"
draft: false
date: 2024-10-08
description: "Tổng quan về các Async Pattern (mẫu thiết kế bất đồng bộ) phổ biến trong JavaScript và TypeScript, bao gồm Promises & Async/Await, Reactive Programming, và Real-time Communication."
slug: "tong-quan-async-patterns-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Async Patterns
---

## Giới thiệu về Async Patterns

Async Patterns là các mẫu thiết kế giúp xử lý các tác vụ bất đồng bộ trong JavaScript và TypeScript. Các mẫu này giúp quản lý luồng thực thi, xử lý sự kiện và giao tiếp real-time một cách hiệu quả.

Các pattern này đặc biệt quan trọng trong phát triển web hiện đại, nơi các tác vụ bất đồng bộ như API calls, xử lý sự kiện và real-time updates là phổ biến.

## Các Async Pattern phổ biến

### 1. [Promises & Async/Await](/posts/promises-async-await-trong-javascript-typescript)

Promises và Async/Await là các pattern cơ bản cho việc xử lý tác vụ bất đồng bộ.

**Ứng dụng phổ biến:**
- API calls
- File operations
- Database queries
- Tác vụ timeout/interval

### 2. [Reactive Patterns](/posts/reactive-patterns-trong-javascript-typescript)

Reactive Patterns tập trung vào xử lý luồng dữ liệu và sự kiện theo cách reactive.

**Ứng dụng phổ biến:**
- Event handling
- State management
- Data streams
- Real-time updates

### 3. [Polling vs WebSockets](/posts/polling-vs-websockets-trong-javascript-typescript)

So sánh và phân tích hai cách tiếp cận chính cho real-time communication.

**Ứng dụng phổ biến:**
- Chat applications
- Live updates
- Notifications
- Real-time dashboards

## So sánh các Async Pattern

| Pattern | Mục đích chính | Khi nào sử dụng |
|---------|---------------|-----------------|
| Promises & Async/Await | Xử lý tác vụ bất đồng bộ | Khi cần xử lý các tác vụ tuần tự |
| Reactive | Xử lý luồng dữ liệu | Khi cần xử lý nhiều sự kiện và updates |
| Polling/WebSockets | Real-time communication | Khi cần giao tiếp real-time |

## Lợi ích của Async Patterns

1. **Hiệu năng tốt hơn**
   - Không block main thread
   - Xử lý nhiều tác vụ đồng thời
   - Tối ưu tài nguyên

2. **Code dễ đọc hơn**
   - Logic rõ ràng
   - Dễ maintain
   - Dễ debug

3. **Khả năng mở rộng**
   - Dễ thêm tính năng mới
   - Dễ scale
   - Linh hoạt

4. **Trải nghiệm người dùng**
   - UI responsive
   - Updates real-time
   - Không bị đóng băng

## Thách thức khi sử dụng Async Patterns

1. **Độ phức tạp**
   - Learning curve cao
   - Khó debug
   - Error handling phức tạp

2. **Memory management**
   - Memory leaks
   - Resource cleanup
   - Event listener management

3. **Race conditions**
   - Timing issues
   - State synchronization
   - Data consistency

4. **Testing**
   - Async test cases
   - Mocking/stubbing
   - Coverage

## Best Practices

1. **Error Handling**
   ```typescript
   async function safeAsync<T>(
     promise: Promise<T>
   ): Promise<[T | null, Error | null]> {
     try {
       const data = await promise;
       return [data, null];
     } catch (error) {
       return [null, error as Error];
     }
   }
   ```

2. **Cancellation**
   ```typescript
   const controller = new AbortController();
   const { signal } = controller;

   fetch(url, { signal })
     .then(response => response.json())
     .catch(error => {
       if (error.name === 'AbortError') {
         console.log('Fetch cancelled');
       }
     });

   // Cancel the fetch
   controller.abort();
   ```

3. **Resource Cleanup**
   ```typescript
   class ResourceManager {
     private cleanupFns: (() => void)[] = [];

     addCleanup(fn: () => void): void {
       this.cleanupFns.push(fn);
     }

     cleanup(): void {
       this.cleanupFns.forEach(fn => fn());
       this.cleanupFns = [];
     }
   }
   ```

4. **Progress Tracking**
   ```typescript
   interface ProgressCallback {
     (progress: number): void;
   }

   async function downloadWithProgress(
     url: string,
     onProgress: ProgressCallback
   ): Promise<Blob> {
     const response = await fetch(url);
     const reader = response.body!.getReader();
     const contentLength = +response.headers.get('Content-Length')!;

     let receivedLength = 0;
     const chunks = [];

     while(true) {
       const {done, value} = await reader.read();
       
       if (done) break;
       
       chunks.push(value);
       receivedLength += value.length;
       onProgress((receivedLength / contentLength) * 100);
     }

     return new Blob(chunks);
   }
   ```

## Khi nào nên sử dụng Async Patterns?

1. **API Interactions**
   - HTTP requests
   - GraphQL queries
   - WebSocket connections
   - Server-Sent Events

2. **UI Updates**
   - Form handling
   - Data visualization
   - Animation
   - User input

3. **Data Processing**
   - File uploads
   - Image processing
   - Data transformation
   - Batch operations

4. **Real-time Features**
   - Chat
   - Notifications
   - Live updates
   - Collaborative features

## Kết hợp các Pattern

1. **Promises với Reactive**
   ```typescript
   from(fetch('/api/data'))
     .pipe(
       switchMap(response => response.json()),
       retry(3),
       catchError(error => of({ error }))
     )
     .subscribe(data => console.log(data));
   ```

2. **WebSocket với Reactive**
   ```typescript
   const socket$ = webSocket('ws://example.com');
   
   socket$
     .pipe(
       filter(msg => msg.type === 'update'),
       debounceTime(300)
     )
     .subscribe(
       msg => console.log(msg),
       err => console.error(err),
       () => console.log('Complete')
     );
   ```

3. **Async/Await với Polling**
   ```typescript
   async function pollWithBackoff(
     fn: () => Promise<any>,
     options = { maxAttempts: 5, initialDelay: 1000 }
   ) {
     let attempts = 0;
     
     while (attempts < options.maxAttempts) {
       try {
         return await fn();
       } catch (error) {
         attempts++;
         await new Promise(resolve => 
           setTimeout(resolve, options.initialDelay * Math.pow(2, attempts))
         );
       }
     }
     
     throw new Error('Max attempts reached');
   }
   ```

## Kết luận

Async Patterns là công cụ thiết yếu trong phát triển ứng dụng web hiện đại. Việc hiểu và áp dụng đúng các pattern này sẽ giúp xây dựng ứng dụng có hiệu năng tốt, dễ bảo trì và mở rộng.

Tuy nhiên, việc lựa chọn pattern phù hợp cần dựa trên yêu cầu cụ thể của dự án, khả năng của team và các ràng buộc về hiệu năng. Không có một pattern nào là tối ưu cho mọi trường hợp, và việc kết hợp các pattern có thể là giải pháp tốt nhất cho nhiều tình huống. 