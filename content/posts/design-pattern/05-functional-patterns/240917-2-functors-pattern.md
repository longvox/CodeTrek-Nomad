---
title: "Functional Pattern [2/4] - Functors Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-09-17
description: "Functors là một mẫu thiết kế quan trọng trong lập trình hàm, cho phép áp dụng các hàm lên các giá trị được bọc trong một container. Bài viết này phân tích cách triển khai Functors trong JavaScript và TypeScript."
slug: "functors-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Functors Pattern
  - Functional Programming
---

## 1. Functors là gì?

Functors là các đối tượng có thể map qua - nghĩa là chúng có thể áp dụng một hàm lên các giá trị được bọc trong chúng. Một Functor phải tuân thủ hai quy tắc:

1. **Identity**: Khi map qua một hàm identity (x => x), kết quả phải giống với giá trị ban đầu
2. **Composition**: Khi map qua một hàm kết hợp (f ∘ g), kết quả phải giống với việc map qua f rồi map qua g

## 2. Triển khai Functors trong JavaScript

### 2.1 Array Functor

```javascript
// Array là một Functor có sẵn trong JavaScript
const numbers = [1, 2, 3, 4, 5];

// Map qua một hàm
const doubled = numbers.map(x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Map qua nhiều hàm (composition)
const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;

const result1 = numbers.map(addOne).map(multiplyByTwo);
const result2 = numbers.map(x => multiplyByTwo(addOne(x)));

console.log(result1); // [4, 6, 8, 10, 12]
console.log(result2); // [4, 6, 8, 10, 12]
```

### 2.2 Custom Functor

```javascript
class Box {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Box(value);
  }

  map(fn) {
    return Box.of(fn(this.value));
  }

  fold(fn) {
    return fn(this.value);
  }
}

// Ví dụ sử dụng
const box = Box.of(5);
const result = box
  .map(x => x * 2)
  .map(x => x + 1)
  .fold(x => x);

console.log(result); // 11
```

## 3. Triển khai Functors trong TypeScript

### 3.1 Generic Functor Interface

```typescript
interface Functor<T> {
  map<U>(fn: (value: T) => U): Functor<U>;
}

class Box<T> implements Functor<T> {
  constructor(private value: T) {}

  static of<T>(value: T): Box<T> {
    return new Box(value);
  }

  map<U>(fn: (value: T) => U): Box<U> {
    return Box.of(fn(this.value));
  }

  fold<U>(fn: (value: T) => U): U {
    return fn(this.value);
  }
}

// Ví dụ sử dụng
interface User {
  name: string;
  age: number;
}

const user = Box.of<User>({ name: 'John', age: 30 });
const result = user
  .map(u => ({ ...u, age: u.age + 1 }))
  .map(u => `${u.name} is ${u.age} years old`)
  .fold(x => x);

console.log(result); // "John is 31 years old"
```

### 3.2 Maybe Functor

```typescript
class Maybe<T> implements Functor<T> {
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

  fold<U>(fn: (value: T) => U, defaultValue: U): U {
    if (this.isNothing()) {
      return defaultValue;
    }
    return fn(this.value!);
  }
}

// Ví dụ sử dụng
interface Post {
  title: string;
  author?: {
    name: string;
    email: string;
  };
}

const getAuthorEmail = (post: Post): string => 
  Maybe.of(post.author)
    .map(author => author.email)
    .fold(email => email, 'No author email');

const post1: Post = {
  title: 'Hello World',
  author: {
    name: 'John',
    email: 'john@example.com'
  }
};

const post2: Post = {
  title: 'No Author'
};

console.log(getAuthorEmail(post1)); // "john@example.com"
console.log(getAuthorEmail(post2)); // "No author email"
```

## 4. Ví dụ Thực Tế: Xử Lý Dữ Liệu

```typescript
// Functor cho xử lý dữ liệu
class DataProcessor<T> implements Functor<T> {
  constructor(private data: T) {}

  static of<T>(data: T): DataProcessor<T> {
    return new DataProcessor(data);
  }

  map<U>(fn: (value: T) => U): DataProcessor<U> {
    return DataProcessor.of(fn(this.data));
  }

  validate(predicate: (value: T) => boolean): DataProcessor<T> {
    if (!predicate(this.data)) {
      throw new Error('Validation failed');
    }
    return this;
  }

  transform<U>(fn: (value: T) => U): U {
    return fn(this.data);
  }
}

// Ví dụ sử dụng
interface UserInput {
  name: string;
  email: string;
  age: number;
}

const processUserInput = (input: UserInput): string => {
  return DataProcessor.of(input)
    .validate(u => u.name.length > 0)
    .validate(u => u.email.includes('@'))
    .validate(u => u.age >= 0)
    .map(u => ({
      ...u,
      name: u.name.trim(),
      email: u.email.toLowerCase()
    }))
    .transform(u => `${u.name} (${u.email}) is ${u.age} years old`);
};

const userInput: UserInput = {
  name: '  John Doe  ',
  email: 'JOHN@EXAMPLE.COM',
  age: 30
};

console.log(processUserInput(userInput)); // "John Doe (john@example.com) is 30 years old"
```

## 5. Ưu điểm và Nhược điểm

### 5.1 Ưu điểm
- **Composition**: Cho phép kết hợp các tác vụ một cách dễ dàng
- **Type safety**: Đảm bảo type safety trong TypeScript
- **Reusability**: Có thể tái sử dụng các hàm xử lý dữ liệu
- **Immutability**: Không thay đổi giá trị gốc

### 5.2 Nhược điểm
- **Độ phức tạp**: Có thể làm code phức tạp hơn nếu sử dụng không đúng cách
- **Learning curve**: Yêu cầu hiểu biết về lập trình hàm
- **Verbose**: Có thể làm code dài hơn trong một số trường hợp
- **Debugging**: Có thể khó debug hơn do tính chất trừu tượng

## 6. Khi nào nên sử dụng Functors?

Functors phù hợp khi:
- Cần xử lý dữ liệu một cách có cấu trúc
- Cần kết hợp nhiều tác vụ xử lý dữ liệu
- Cần đảm bảo type safety trong TypeScript
- Cần xử lý các giá trị có thể null hoặc undefined

## 7. Kết luận

Functors là một mẫu thiết kế cơ bản nhưng mạnh mẽ trong lập trình hàm, cho phép xử lý dữ liệu một cách có cấu trúc và an toàn. Pattern này đặc biệt hữu ích trong việc xử lý dữ liệu và đảm bảo type safety trong TypeScript.
