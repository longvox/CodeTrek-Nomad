---
title: "Currying và Partial Application trong JavaScript/TypeScript"
draft: false
date: 2024-10-01
description: "Currying và Partial Application là hai kỹ thuật quan trọng trong lập trình hàm, cho phép biến đổi hàm nhiều tham số thành chuỗi các hàm một tham số. Bài viết này phân tích cách triển khai và ứng dụng của chúng trong JavaScript và TypeScript."
slug: "currying-partial-application-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Currying
  - Partial Application
  - Functional Programming
---

{{< sidenote >}}
Đây là bài viết thứ hai mươi tám trong series về các mẫu thiết kế trong JavaScript/TypeScript. Nếu bạn chưa đọc các bài trước, bạn có thể xem: [Giới thiệu về các mẫu thiết kế](/posts/gioi-thieu-ve-cac-mau-thiet-ke), [Singleton Pattern](/posts/singleton-pattern-trong-javascript-typescript), [Factory Method Pattern](/posts/factory-method-pattern-trong-javascript-typescript), [Abstract Factory Pattern](/posts/abstract-factory-pattern-trong-javascript-typescript), [Builder Pattern](/posts/builder-pattern-trong-javascript-typescript), [Prototype Pattern](/posts/prototype-pattern-trong-javascript-typescript), [Module Pattern](/posts/module-pattern-trong-javascript-typescript), [Adapter Pattern](/posts/adapter-pattern-trong-javascript-typescript), [Bridge Pattern](/posts/bridge-pattern-trong-javascript-typescript), [Facade Pattern](/posts/facade-pattern-trong-javascript-typescript), [Composite Pattern](/posts/composite-pattern-trong-javascript-typescript), [Decorator Pattern](/posts/decorator-pattern-trong-javascript-typescript), [Interpreter Pattern](/posts/interpreter-pattern-trong-javascript-typescript), [Iterator Pattern](/posts/iterator-pattern-trong-javascript-typescript), [Mediator Pattern](/posts/mediator-pattern-trong-javascript-typescript), [Memento Pattern](/posts/memento-pattern-trong-javascript-typescript), [Observer Pattern](/posts/observer-pattern-trong-javascript-typescript), [State Pattern](/posts/state-pattern-trong-javascript-typescript), [Strategy Pattern](/posts/strategy-pattern-trong-javascript-typescript), [Template Method Pattern](/posts/template-method-pattern-trong-javascript-typescript), [Visitor Pattern](/posts/visitor-pattern-trong-javascript-typescript), [Dependency Injection Pattern](/posts/dependency-injection-pattern-trong-javascript-typescript), [MVVM và MVC Pattern](/posts/mvvm-mvc-pattern-trong-javascript-typescript), [Repository Pattern](/posts/repository-pattern-trong-javascript-typescript), [Mixin Pattern](/posts/mixin-pattern-trong-javascript-typescript), [Monads Pattern](/posts/monads-pattern-trong-javascript-typescript), [Functors Pattern](/posts/functors-pattern-trong-javascript-typescript) và [Function Composition Pattern](/posts/function-composition-pattern-trong-javascript-typescript).
{{< /sidenote >}}

Trong bài viết trước, chúng ta đã tìm hiểu về Function Composition - một kỹ thuật kết hợp nhiều hàm để tạo ra hàm mới. Hôm nay, mình sẽ giới thiệu về hai kỹ thuật quan trọng khác trong lập trình hàm: Currying và Partial Application.

## 1. Currying là gì?

Currying là kỹ thuật biến đổi một hàm nhận nhiều tham số thành một chuỗi các hàm, mỗi hàm chỉ nhận một tham số. Tên gọi này được đặt theo nhà toán học Haskell Curry.

```javascript
// Hàm thông thường
const add = (a, b) => a + b;

// Hàm curry
const curriedAdd = a => b => a + b;

// Sử dụng
console.log(add(2, 3));        // 5
console.log(curriedAdd(2)(3)); // 5
```

## 2. Partial Application là gì?

Partial Application là kỹ thuật cố định một số tham số của hàm, tạo ra một hàm mới với ít tham số hơn.

```javascript
// Hàm gốc
const multiply = (a, b, c) => a * b * c;

// Partial application
const multiplyByTwo = multiply.bind(null, 2);
// hoặc
const multiplyByTwo2 = (b, c) => multiply(2, b, c);

console.log(multiplyByTwo(3, 4));  // 24 (2 * 3 * 4)
```

## 3. Triển khai trong JavaScript

### 3.1 Curry Helper Function

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...args2) {
      return curried.apply(this, args.concat(args2));
    }
  };
}

// Sử dụng
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3));   // 6
console.log(curriedSum(1, 2)(3));   // 6
console.log(curriedSum(1)(2, 3));   // 6
```

### 3.2 Partial Application Helper

```javascript
function partial(fn, ...args) {
  return function(...restArgs) {
    return fn.apply(this, [...args, ...restArgs]);
  }
}

// Sử dụng
const greet = (greeting, name) => `${greeting}, ${name}!`;
const sayHello = partial(greet, "Hello");

console.log(sayHello("John")); // "Hello, John!"
```

## 4. Triển khai trong TypeScript

### 4.1 Type-safe Currying

```typescript
type Curry<P extends any[], R> =
  P extends [infer First, ...infer Rest]
    ? (arg: First) => Rest extends []
      ? R
      : Curry<Rest, R>
    : R;

function curry<P extends any[], R>(
  fn: (...args: P) => R
): Curry<P, R> {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...args2: any[]) {
      return curried(...args.concat(args2));
    }
  } as any;
}

// Sử dụng với type safety
const add = (a: number, b: number, c: number): number => a + b + c;
const curriedAdd = curry(add);

// TypeScript sẽ bảo đảm type safety
const result = curriedAdd(1)(2)(3); // type: number
```

### 4.2 Type-safe Partial Application

```typescript
type Partial<T, P extends any[]> = 
  (...args: P) => T;

function partial<T, P extends any[], R extends any[]>(
  fn: (...args: [...P, ...R]) => T,
  ...partialArgs: P
): Partial<T, R> {
  return (...restArgs: R) => fn(...partialArgs, ...restArgs);
}

// Sử dụng với type safety
interface User {
  id: number;
  name: string;
}

const createUser = (role: string, id: number, name: string): User & { role: string } => ({
  id,
  name,
  role
});

const createAdmin = partial(createUser, "admin");
const admin = createAdmin(1, "John"); // type: User & { role: string }
```

## 5. Ví dụ Thực Tế: Xử Lý API Requests

```typescript
interface ApiConfig {
  baseUrl: string;
  headers: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

// Curried fetch function
const createApiClient = (config: ApiConfig) =>
  (method: string) =>
    (endpoint: string) =>
      async <T>(body?: any): Promise<ApiResponse<T>> => {
        const response = await fetch(`${config.baseUrl}${endpoint}`, {
          method,
          headers: config.headers,
          body: body ? JSON.stringify(body) : undefined
        });
        
        const data = await response.json();
        return {
          data,
          status: response.status
        };
      };

// Sử dụng
const config: ApiConfig = {
  baseUrl: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  }
};

const api = createApiClient(config);
const get = api('GET');
const post = api('POST');

// Endpoints
const getUser = get('/users');
const createUser = post('/users');

// Sử dụng
interface User {
  id: number;
  name: string;
}

async function example() {
  const user = await getUser<User>();
  const newUser = await createUser<User>({ name: 'John' });
}
```

## 6. Ưu điểm và Nhược điểm

### 6.1 Ưu điểm
- **Tái sử dụng**: Tạo ra các hàm chuyên biệt từ hàm tổng quát
- **Linh hoạt**: Dễ dàng tạo ra các biến thể của hàm
- **Type safety**: TypeScript hỗ trợ tốt cho cả hai kỹ thuật
- **Composition**: Dễ dàng kết hợp với Function Composition

### 6.2 Nhược điểm
- **Phức tạp**: Có thể khó hiểu với người mới
- **Debug**: Khó debug khi có nhiều lớp currying
- **Performance**: Overhead do tạo nhiều closure
- **Readability**: Syntax có thể khó đọc với nhiều dấu ngoặc

## 7. Khi nào nên sử dụng?

Currying và Partial Application phù hợp khi:
- Cần tạo ra các hàm chuyên biệt từ hàm tổng quát
- Muốn tái sử dụng logic với các tham số khác nhau
- Làm việc với Function Composition
- Xây dựng API linh hoạt

## 8. Kết luận

Currying và Partial Application là hai kỹ thuật mạnh mẽ trong lập trình hàm, cho phép tạo ra code linh hoạt và tái sử dụng. Kết hợp với Function Composition, chúng tạo nên nền tảng cho lập trình hàm hiện đại.

Trong bài viết tiếp theo, chúng ta sẽ tìm hiểu về Promises và Async/Await - hai mẫu thiết kế quan trọng cho xử lý bất đồng bộ trong JavaScript/TypeScript. 