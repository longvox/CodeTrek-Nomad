---
title: "Functional Pattern [3/4] - Function Composition Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-09-24
description: "Function Composition là một mẫu thiết kế quan trọng trong lập trình hàm, cho phép kết hợp nhiều hàm đơn giản để tạo ra các hàm phức tạp hơn. Bài viết này phân tích cách triển khai Function Composition trong JavaScript và TypeScript."
slug: "function-composition-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Function Composition
  - Functional Programming
---

## 1. Function Composition là gì?

Function Composition là kỹ thuật kết hợp hai hoặc nhiều hàm để tạo ra một hàm mới. Kết quả của hàm đầu tiên sẽ được truyền vào hàm thứ hai, và cứ tiếp tục như vậy. Trong toán học, điều này được biểu diễn như sau:

\[ (f ∘ g)(x) = f(g(x)) \]

## 2. Triển khai Function Composition trong JavaScript

### 2.1 Composition cơ bản

```javascript
// Các hàm đơn giản
const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const square = x => x * x;

// Composition thủ công
const result = square(multiplyByTwo(addOne(5)));
console.log(result); // 144 = ((5 + 1) * 2)^2

// Helper function cho composition
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// Sử dụng compose
const calculate = compose(square, multiplyByTwo, addOne);
console.log(calculate(5)); // 144
```

### 2.2 Point-free Style

```javascript
// Các hàm utility
const prop = key => obj => obj[key];
const map = fn => arr => arr.map(fn);
const filter = predicate => arr => arr.filter(predicate);
const join = separator => arr => arr.join(separator);

// Ví dụ sử dụng
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
];

const getNames = compose(
  join(', '),
  map(prop('name')),
  filter(user => user.age > 25)
);

console.log(getNames(users)); // "John, Bob"
```

## 3. Triển khai Function Composition trong TypeScript

### 3.1 Type-safe Composition

```typescript
type Func<T, R> = (arg: T) => R;

function compose<A, B, C>(
  f: Func<B, C>,
  g: Func<A, B>
): Func<A, C> {
  return x => f(g(x));
}

// Ví dụ sử dụng với type safety
const toString = (x: number): string => x.toString();
const length = (x: string): number => x.length;
const isEven = (x: number): boolean => x % 2 === 0;

const isLengthEven = compose(isEven, compose(length, toString));
console.log(isLengthEven(123)); // false (length is 3)
console.log(isLengthEven(12)); // true (length is 2)
```

### 3.2 Pipeline Operator (Stage 1 Proposal)

```typescript
// Hiện tại cần sử dụng Babel hoặc TypeScript với flag --experimentalDecorators
const double = (x: number): number => x * 2;
const addTen = (x: number): number => x + 10;
const toString = (x: number): string => `Result: ${x}`;

// Thay vì viết:
const result = toString(addTen(double(5)));

// Có thể viết:
const result = 5
  |> double
  |> addTen
  |> toString;

console.log(result); // "Result: 20"
```

## 4. Ví dụ Thực Tế: Xử Lý Dữ Liệu

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserViewModel {
  displayName: string;
  contact: string;
  isAdmin: boolean;
}

// Các hàm transform
const normalizeEmail = (email: string): string => email.toLowerCase();
const formatName = (name: string): string => 
  name.split(' ').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  ).join(' ');

const transformUser = (user: User): UserViewModel => ({
  displayName: formatName(user.name),
  contact: normalizeEmail(user.email),
  isAdmin: user.role === 'admin'
});

const sortByName = (users: UserViewModel[]): UserViewModel[] =>
  [...users].sort((a, b) => a.displayName.localeCompare(b.displayName));

const filterAdmins = (users: UserViewModel[]): UserViewModel[] =>
  users.filter(user => user.isAdmin);

// Composition của các transform
const processUsers = compose(
  filterAdmins,
  sortByName,
  map(transformUser)
);

// Sử dụng
const users: User[] = [
  { id: 1, name: 'john doe', email: 'JOHN@example.com', role: 'admin' },
  { id: 2, name: 'jane smith', email: 'jane@EXAMPLE.com', role: 'user' },
  { id: 3, name: 'bob wilson', email: 'BOB@example.com', role: 'admin' }
];

const result = processUsers(users);
console.log(result);
/*
[
  {
    displayName: "Bob Wilson",
    contact: "bob@example.com",
    isAdmin: true
  },
  {
    displayName: "John Doe",
    contact: "john@example.com",
    isAdmin: true
  }
]
*/
```

## 5. Ưu điểm và Nhược điểm

### 5.1 Ưu điểm
- **Tái sử dụng**: Các hàm nhỏ có thể được tái sử dụng và kết hợp
- **Dễ test**: Các hàm nhỏ dễ test hơn
- **Dễ đọc**: Code trở nên rõ ràng và có cấu trúc
- **Không có side effects**: Khuyến khích pure functions

### 5.2 Nhược điểm
- **Performance**: Có thể chậm hơn do nhiều lần gọi hàm
- **Debugging**: Có thể khó debug khi chuỗi composition dài
- **Learning curve**: Yêu cầu tư duy khác với lập trình hướng đối tượng
- **Type inference**: Có thể phức tạp trong TypeScript

## 6. Khi nào nên sử dụng Function Composition?

Function Composition phù hợp khi:
- Cần xử lý dữ liệu qua nhiều bước
- Muốn tái sử dụng các hàm nhỏ
- Cần code dễ test và maintain
- Muốn tránh side effects và mutation

## 7. Kết luận

Function Composition là một mẫu thiết kế mạnh mẽ trong lập trình hàm, cho phép xây dựng các hàm phức tạp từ các hàm đơn giản. Pattern này đặc biệt hữu ích trong việc xử lý dữ liệu và tạo ra code dễ maintain.
