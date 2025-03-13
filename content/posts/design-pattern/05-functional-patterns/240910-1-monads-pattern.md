---
title: "Functional Pattern [1/4] - Monads Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-09-10
description: "Monads là một mẫu thiết kế quan trọng trong lập trình hàm, giúp xử lý các giá trị có thể null và các tác vụ bất đồng bộ một cách an toàn. Bài viết này phân tích cách triển khai Monads trong JavaScript và TypeScript."
slug: "monads-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Monads Pattern
  - Functional Programming
---

## 1. Monads là gì?

Monads là một mẫu thiết kế trong lập trình hàm giúp xử lý các giá trị có thể null và các tác vụ bất đồng bộ một cách an toàn. Pattern này bao gồm ba thành phần chính:

- **Unit (return)**: Đưa một giá trị vào trong monad
- **Bind (flatMap)**: Áp dụng một hàm lên giá trị trong monad
- **Join**: Kết hợp các monad lồng nhau

## 2. Triển khai Monads trong JavaScript

### 2.1 Maybe Monad

```javascript
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  static nothing() {
    return new Maybe(null);
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(fn) {
    if (this.isNothing()) {
      return Maybe.nothing();
    }
    return Maybe.of(fn(this.value));
  }

  flatMap(fn) {
    if (this.isNothing()) {
      return Maybe.nothing();
    }
    return fn(this.value);
  }

  getOrElse(defaultValue) {
    if (this.isNothing()) {
      return defaultValue;
    }
    return this.value;
  }
}

// Ví dụ sử dụng
const user = {
  name: 'John',
  address: {
    street: '123 Main St',
    city: 'New York'
  }
};

const getUserCity = (user) => Maybe.of(user)
  .map(u => u.address)
  .map(addr => addr.city)
  .getOrElse('Unknown');

console.log(getUserCity(user)); // "New York"
console.log(getUserCity(null)); // "Unknown"
```

### 2.2 Either Monad

```javascript
class Either {
  constructor(value, isLeft) {
    this.value = value;
    this.isLeft = isLeft;
  }

  static left(value) {
    return new Either(value, true);
  }

  static right(value) {
    return new Either(value, false);
  }

  map(fn) {
    if (this.isLeft) {
      return Either.left(this.value);
    }
    return Either.right(fn(this.value));
  }

  flatMap(fn) {
    if (this.isLeft) {
      return Either.left(this.value);
    }
    return fn(this.value);
  }

  fold(leftFn, rightFn) {
    if (this.isLeft) {
      return leftFn(this.value);
    }
    return rightFn(this.value);
  }
}

// Ví dụ sử dụng
const divide = (a, b) => {
  if (b === 0) {
    return Either.left('Division by zero');
  }
  return Either.right(a / b);
};

const result = divide(10, 2)
  .map(x => x * 2)
  .fold(
    error => `Error: ${error}`,
    value => `Result: ${value}`
  );

console.log(result); // "Result: 10"
```

## 3. Triển khai Monads trong TypeScript

### 3.1 Maybe Monad với TypeScript

```typescript
class Maybe<T> {
  private constructor(private value: T | null) {}

  static of<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  static nothing<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  isNothing(): boolean {
    return this.value === null || this.value === undefined;
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    if (this.isNothing()) {
      return Maybe.nothing<U>();
    }
    return Maybe.of(fn(this.value!));
  }

  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    if (this.isNothing()) {
      return Maybe.nothing<U>();
    }
    return fn(this.value!);
  }

  getOrElse(defaultValue: T): T {
    if (this.isNothing()) {
      return defaultValue;
    }
    return this.value!;
  }
}

// Ví dụ sử dụng
interface User {
  name: string;
  address?: {
    street: string;
    city: string;
  };
}

const getUserCity = (user: User | null): string => 
  Maybe.of(user)
    .map(u => u.address)
    .map(addr => addr.city)
    .getOrElse('Unknown');

const user: User = {
  name: 'John',
  address: {
    street: '123 Main St',
    city: 'New York'
  }
};

console.log(getUserCity(user)); // "New York"
console.log(getUserCity(null)); // "Unknown"
```

### 3.2 Either Monad với TypeScript

```typescript
class Either<L, R> {
  private constructor(
    private value: L | R,
    private isLeft: boolean
  ) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either(value, true);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either(value, false);
  }

  map<U>(fn: (value: R) => U): Either<L, U> {
    if (this.isLeft) {
      return Either.left<L, U>(this.value as L);
    }
    return Either.right<L, U>(fn(this.value as R));
  }

  flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    if (this.isLeft) {
      return Either.left<L, U>(this.value as L);
    }
    return fn(this.value as R);
  }

  fold<U>(leftFn: (value: L) => U, rightFn: (value: R) => U): U {
    if (this.isLeft) {
      return leftFn(this.value as L);
    }
    return rightFn(this.value as R);
  }
}

// Ví dụ sử dụng
type ValidationError = string;
type User = {
  name: string;
  age: number;
};

const validateUser = (user: User): Either<ValidationError, User> => {
  if (!user.name) {
    return Either.left<ValidationError, User>('Name is required');
  }
  if (user.age < 0) {
    return Either.left<ValidationError, User>('Age must be positive');
  }
  return Either.right<ValidationError, User>(user);
};

const result = validateUser({ name: 'John', age: 30 })
  .map(user => ({ ...user, age: user.age + 1 }))
  .fold(
    error => `Error: ${error}`,
    user => `Valid user: ${user.name}, age: ${user.age}`
  );

console.log(result); // "Valid user: John, age: 31"
```

## 4. Ví dụ Thực Tế: Xử Lý API Calls

```typescript
// API Response type
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// API Client với Maybe Monad
class ApiClient {
  static async fetch<T>(url: string): Promise<Maybe<T>> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return Maybe.nothing<T>();
      }
      const data = await response.json();
      return Maybe.of<T>(data);
    } catch (error) {
      return Maybe.nothing<T>();
    }
  }
}

// Ví dụ sử dụng
interface Post {
  id: number;
  title: string;
  content: string;
}

const getPost = async (id: number): Promise<string> => {
  return ApiClient.fetch<Post>(`/api/posts/${id}`)
    .map(post => post.title)
    .getOrElse('Post not found');
};

// Sử dụng
const postTitle = await getPost(1);
console.log(postTitle); // "Post title" hoặc "Post not found"
```

## 5. Ưu điểm và Nhược điểm

### 5.1 Ưu điểm
- **Xử lý null an toàn**: Giúp xử lý các giá trị null một cách an toàn
- **Composition**: Cho phép kết hợp các tác vụ một cách dễ dàng
- **Type safety**: Đảm bảo type safety trong TypeScript
- **Error handling**: Xử lý lỗi một cách rõ ràng và có cấu trúc

### 5.2 Nhược điểm
- **Độ phức tạp**: Có thể làm code phức tạp hơn nếu sử dụng không đúng cách
- **Learning curve**: Yêu cầu hiểu biết về lập trình hàm
- **Verbose**: Có thể làm code dài hơn trong một số trường hợp
- **Debugging**: Có thể khó debug hơn do tính chất trừu tượng

## 6. Khi nào nên sử dụng Monads?

Monads phù hợp khi:
- Cần xử lý các giá trị có thể null
- Cần xử lý lỗi một cách có cấu trúc
- Cần kết hợp nhiều tác vụ có thể thất bại
- Cần đảm bảo type safety trong TypeScript

## 7. Kết luận

Monads là một mẫu thiết kế mạnh mẽ trong lập trình hàm, giúp xử lý các giá trị có thể null và các tác vụ bất đồng bộ một cách an toàn. Pattern này đặc biệt hữu ích trong việc xử lý lỗi và đảm bảo type safety trong TypeScript.
