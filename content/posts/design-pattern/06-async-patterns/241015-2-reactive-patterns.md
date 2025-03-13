---
title: "Async Pattern [2/3] - Reactive Patterns trong JavaScript / TypeScript"
draft: false
date: 2024-10-15
description: "Reactive Patterns là cách tiếp cận lập trình theo luồng dữ liệu, cho phép xử lý các sự kiện và dữ liệu bất đồng bộ một cách hiệu quả. Bài viết này phân tích cách triển khai và ứng dụng của chúng trong JavaScript và TypeScript."
slug: "reactive-patterns-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Reactive Programming
  - RxJS
  - Event Streams
---

## 1. Reactive Programming là gì?

Reactive Programming là mô hình lập trình tập trung vào luồng dữ liệu (data streams) và lan truyền thay đổi (propagation of change). Mọi thứ đều có thể được xem như một luồng dữ liệu: biến, user input, properties, cache, data structures, etc.

```javascript
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

// Tạo stream từ sự kiện input
const input = document.querySelector('input');
const inputStream = fromEvent(input, 'input').pipe(
  map(event => event.target.value),
  debounceTime(300)
);

// Subscribe để xử lý thay đổi
inputStream.subscribe(value => {
  console.log('Search term:', value);
});
```

## 2. Các Khái Niệm Cơ Bản

### 2.1 Observable và Observer

```typescript
import { Observable, Observer } from 'rxjs';

// Observable - nguồn phát dữ liệu
const numberStream = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

// Observer - đối tượng lắng nghe
const observer: Observer<number> = {
  next: value => console.log('Next:', value),
  error: error => console.error('Error:', error),
  complete: () => console.log('Complete!')
};

// Subscription
numberStream.subscribe(observer);
```

### 2.2 Subjects

```typescript
import { Subject, BehaviorSubject } from 'rxjs';

// Subject - vừa là Observable vừa là Observer
const subject = new Subject<string>();
subject.subscribe(value => console.log('Observer 1:', value));
subject.next('Hello');
subject.subscribe(value => console.log('Observer 2:', value));

// BehaviorSubject - giữ giá trị hiện tại
const behaviorSubject = new BehaviorSubject<number>(0);
behaviorSubject.subscribe(value => console.log('Initial value:', value));
behaviorSubject.next(1);
behaviorSubject.subscribe(value => console.log('Late subscriber:', value));
```

## 3. Triển khai trong JavaScript

### 3.1 Event Streams

```javascript
import { fromEvent, merge } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// Mouse events
const clicks = fromEvent(document, 'click');
const moves = fromEvent(document, 'mousemove');
const ups = fromEvent(document, 'mouseup');

// Combine streams
const mouseEvents = merge(
  clicks.pipe(map(event => ({ type: 'click', event }))),
  moves.pipe(map(event => ({ type: 'move', event }))),
  ups.pipe(map(event => ({ type: 'up', event })))
);

// Filter and handle events
mouseEvents
  .pipe(
    filter(({ type }) => type === 'click')
  )
  .subscribe(({ event }) => {
    console.log('Click coordinates:', event.clientX, event.clientY);
  });
```

### 3.2 Data Transformation

```javascript
import { interval } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';

// Generate numbers every second
const numbers = interval(1000);

// Transform stream
const transformed = numbers.pipe(
  map(x => x * 2),
  filter(x => x % 4 === 0),
  scan((acc, curr) => acc + curr, 0)
);

// Handle results
transformed.subscribe(result => {
  console.log('Sum of even doubles:', result);
});
```

## 4. Triển khai trong TypeScript

### 4.1 Type-safe Observables

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: Error | null;
}

class UserService {
  private state = new BehaviorSubject<UserState>({
    users: [],
    loading: false,
    error: null
  });

  getState(): Observable<UserState> {
    return this.state.asObservable();
  }

  async fetchUsers(): Promise<void> {
    this.state.next({ ...this.state.value, loading: true });
    
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      this.state.next({
        users,
        loading: false,
        error: null
      });
    } catch (error) {
      this.state.next({
        users: [],
        loading: false,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }
}
```

### 4.2 Custom Operators

```typescript
import { Observable, pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface DataEvent<T> {
  type: string;
  payload: T;
}

// Custom operator
function filterByType<T>(eventType: string) {
  return pipe(
    filter((event: DataEvent<T>) => event.type === eventType),
    map((event: DataEvent<T>) => event.payload)
  );
}

// Usage
const events = new Observable<DataEvent<string>>(subscriber => {
  subscriber.next({ type: 'message', payload: 'Hello' });
  subscriber.next({ type: 'error', payload: 'Failed' });
  subscriber.next({ type: 'message', payload: 'World' });
});

const messages = events.pipe(filterByType<string>('message'));
messages.subscribe(message => console.log(message));
```

## 5. Ví dụ Thực Tế: Real-time Search với Debounce

```typescript
import { fromEvent, Observable } from 'rxjs';
import { 
  debounceTime, 
  distinctUntilChanged, 
  switchMap,
  map,
  catchError
} from 'rxjs/operators';

interface SearchResult {
  items: any[];
  total: number;
}

class SearchService {
  private searchInput: HTMLInputElement;
  private resultsDiv: HTMLDivElement;
  private searchStream: Observable<string>;

  constructor() {
    this.searchInput = document.querySelector('#search-input')!;
    this.resultsDiv = document.querySelector('#search-results')!;
    this.setupSearch();
  }

  private async searchAPI(term: string): Promise<SearchResult> {
    const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    return response.json();
  }

  private setupSearch(): void {
    // Create search stream
    this.searchStream = fromEvent(this.searchInput, 'input').pipe(
      map(event => (event.target as HTMLInputElement).value),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => 
        new Observable<SearchResult>(subscriber => {
          this.searchAPI(term)
            .then(result => {
              subscriber.next(result);
              subscriber.complete();
            })
            .catch(error => subscriber.error(error));
        }).pipe(
          catchError(error => {
            console.error('Search error:', error);
            return new Observable<SearchResult>(subscriber => {
              subscriber.next({ items: [], total: 0 });
              subscriber.complete();
            });
          })
        )
      )
    );

    // Subscribe to results
    this.searchStream.subscribe(result => {
      this.updateResults(result);
    });
  }

  private updateResults(result: SearchResult): void {
    this.resultsDiv.innerHTML = result.items
      .map(item => `<div class="result-item">${item.title}</div>`)
      .join('');
  }
}

// Initialize search
new SearchService();
```

## 6. Ưu điểm và Nhược điểm

### 6.1 Ưu điểm
- **Declarative**: Code dễ đọc và maintain hơn
- **Data flow**: Quản lý luồng dữ liệu hiệu quả
- **Composability**: Dễ dàng kết hợp và biến đổi streams
- **Error handling**: Xử lý lỗi nhất quán

### 6.2 Nhược điểm
- **Learning curve**: Khó học và làm quen
- **Debugging**: Khó debug khi có nhiều operators
- **Memory**: Có thể gây memory leaks nếu không unsubscribe
- **Bundle size**: Thư viện như RxJS có thể làm tăng kích thước bundle

## 7. Khi nào nên sử dụng?

Reactive Patterns phù hợp khi:
- Xử lý nhiều sự kiện bất đồng bộ
- Cần transform và combine dữ liệu từ nhiều nguồn
- Làm việc với real-time data
- Xây dựng ứng dụng phức tạp với nhiều state

## 8. Kết luận

Reactive Patterns cung cấp một cách mạnh mẽ để xử lý các sự kiện và dữ liệu bất đồng bộ. Mặc dù có learning curve cao, nhưng lợi ích mang lại là rất lớn, đặc biệt trong các ứng dụng phức tạp với nhiều tương tác và real-time data.
