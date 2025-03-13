---
title: "Structural Pattern [4/7] - Decorator Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-05-21
description: "Tìm hiểu về Decorator Pattern - một mẫu thiết kế cấu trúc cho phép thêm các hành vi mới vào đối tượng một cách linh hoạt mà không ảnh hưởng đến các đối tượng khác cùng lớp."
slug: "decorator-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Structural Patterns
---

## 1. Decorator Pattern là gì?

Decorator Pattern là một mẫu thiết kế cấu trúc cho phép thêm các hành vi mới vào đối tượng bằng cách đặt các đối tượng này vào trong một đối tượng bọc (wrapper) chứa các hành vi đó. Pattern này cung cấp một cách linh hoạt để mở rộng chức năng mà không cần sử dụng kế thừa.

### 1.1. Đặc điểm chính

- Cho phép thêm chức năng mới vào đối tượng mà không thay đổi cấu trúc
- Tuân thủ nguyên tắc Single Responsibility Principle
- Cho phép kết hợp nhiều decorator với nhau
- Linh hoạt hơn so với kế thừa

### 1.2. Cấu trúc

```typescript
// Component interface
interface Component {
  operation(): string;
}

// Concrete Component
class ConcreteComponent implements Component {
  operation(): string {
    return "ConcreteComponent";
  }
}

// Base Decorator
class Decorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  operation(): string {
    return this.component.operation();
  }
}

// Concrete Decorators
class ConcreteDecoratorA extends Decorator {
  operation(): string {
    return `ConcreteDecoratorA(${super.operation()})`;
  }
}

class ConcreteDecoratorB extends Decorator {
  operation(): string {
    return `ConcreteDecoratorB(${super.operation()})`;
  }
}
```

## 2. Khi nào nên sử dụng Decorator Pattern?

### 2.1. Các trường hợp nên sử dụng

- Khi cần thêm chức năng vào đối tượng mà không muốn ảnh hưởng đến các đối tượng khác
- Khi việc sử dụng kế thừa không phù hợp hoặc quá phức tạp
- Khi muốn thêm/bớt trách nhiệm của đối tượng trong thời gian chạy
- Khi cần kết hợp nhiều chức năng một cách linh hoạt

### 2.2. Ví dụ thực tế

```typescript
// Coffee shop example
interface Coffee {
  cost(): number;
  description(): string;
}

// Base coffee
class SimpleCoffee implements Coffee {
  cost(): number {
    return 10;
  }

  description(): string {
    return "Simple coffee";
  }
}

// Base decorator
abstract class CoffeeDecorator implements Coffee {
  protected coffee: Coffee;

  constructor(coffee: Coffee) {
    this.coffee = coffee;
  }

  cost(): number {
    return this.coffee.cost();
  }

  description(): string {
    return this.coffee.description();
  }
}

// Concrete decorators
class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 5;
  }

  description(): string {
    return `${this.coffee.description()}, with milk`;
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 2;
  }

  description(): string {
    return `${this.coffee.description()}, with sugar`;
  }
}

// Usage
const coffee = new SimpleCoffee();
console.log(coffee.description()); // "Simple coffee"
console.log(coffee.cost()); // 10

const coffeeWithMilk = new MilkDecorator(coffee);
console.log(coffeeWithMilk.description()); // "Simple coffee, with milk"
console.log(coffeeWithMilk.cost()); // 15

const coffeeWithMilkAndSugar = new SugarDecorator(coffeeWithMilk);
console.log(coffeeWithMilkAndSugar.description()); // "Simple coffee, with milk, with sugar"
console.log(coffeeWithMilkAndSugar.cost()); // 17
```

## 3. Triển khai Decorator Pattern trong JavaScript/TypeScript

### 3.1. Sử dụng Class Decorators trong TypeScript

TypeScript cung cấp tính năng decorators cho phép chúng ta thêm metadata và thay đổi hành vi của classes, methods, properties và parameters.

```typescript
// Method decorator
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Method ${propertyKey} returned:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3);
// Output:
// Calling add with args: [5, 3]
// Method add returned: 8
```

### 3.2. Sử dụng Object Composition trong JavaScript

```javascript
// Base object
const car = {
  price: 20000,
  getPrice() {
    return this.price;
  }
};

// Decorators
const withAC = (car) => ({
  price: car.price + 1000,
  getPrice() {
    return this.price;
  }
});

const withAlloyWheels = (car) => ({
  price: car.price + 2000,
  getPrice() {
    return this.price;
  }
});

// Usage
const carWithAC = withAC(car);
console.log(carWithAC.getPrice()); // 21000

const carWithACAndAlloyWheels = withAlloyWheels(carWithAC);
console.log(carWithACAndAlloyWheels.getPrice()); // 23000
```

## 4. Ưu điểm và nhược điểm

### 4.1. Ưu điểm

1. **Linh hoạt**: Cho phép thêm/bớt chức năng trong runtime
2. **Mở rộng**: Dễ dàng mở rộng chức năng mà không cần sửa đổi code hiện có
3. **Tái sử dụng**: Các decorator có thể được tái sử dụng cho nhiều đối tượng khác nhau
4. **Single Responsibility**: Mỗi decorator chỉ chịu trách nhiệm cho một chức năng cụ thể

### 4.2. Nhược điểm

1. **Phức tạp**: Nhiều lớp decorator có thể làm code khó hiểu và debug
2. **Thứ tự**: Thứ tự các decorator có thể ảnh hưởng đến kết quả cuối cùng
3. **Khởi tạo**: Việc khởi tạo đối tượng với nhiều decorator có thể phức tạp

## 5. Ví dụ thực tế: Xây dựng hệ thống logger

Dưới đây là một ví dụ về việc sử dụng Decorator Pattern để xây dựng hệ thống logger linh hoạt:

```typescript
// Base Logger interface
interface Logger {
  log(message: string): void;
}

// Concrete Logger
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

// Base Decorator
abstract class LoggerDecorator implements Logger {
  protected logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  log(message: string): void {
    this.logger.log(message);
  }
}

// Timestamp Decorator
class TimestampDecorator extends LoggerDecorator {
  log(message: string): void {
    const timestamp = new Date().toISOString();
    this.logger.log(`[${timestamp}] ${message}`);
  }
}

// Level Decorator
class LevelDecorator extends LoggerDecorator {
  private level: string;

  constructor(logger: Logger, level: string) {
    super(logger);
    this.level = level;
  }

  log(message: string): void {
    this.logger.log(`[${this.level}] ${message}`);
  }
}

// Format Decorator
class JsonDecorator extends LoggerDecorator {
  log(message: string): void {
    const jsonMessage = JSON.stringify({
      message,
      timestamp: new Date().toISOString()
    });
    this.logger.log(jsonMessage);
  }
}

// Usage
let logger: Logger = new ConsoleLogger();
logger = new TimestampDecorator(logger);
logger = new LevelDecorator(logger, "INFO");
logger = new JsonDecorator(logger);

logger.log("Hello World");
// Output: {"message":"[INFO] Hello World","timestamp":"2024-05-21T10:00:00.000Z"}
```

## 6. Best Practices và Lưu ý

### 6.1. Khi nào nên sử dụng Decorator Pattern

- Khi cần thêm chức năng vào đối tượng một cách động
- Khi muốn tránh explosion of subclasses
- Khi cần kết hợp nhiều chức năng khác nhau

### 6.2. Khi nào không nên sử dụng

- Khi cấu trúc đối tượng đã quá phức tạp
- Khi số lượng decorator quá nhiều
- Khi thứ tự các decorator quan trọng và khó kiểm soát

### 6.3. Tips và Tricks

1. **Giữ decorator đơn giản**: Mỗi decorator chỉ nên thêm một chức năng cụ thể
2. **Đặt tên rõ ràng**: Tên decorator nên phản ánh chức năng nó thêm vào
3. **Xử lý lỗi**: Đảm bảo decorator xử lý lỗi một cách phù hợp
4. **Documentation**: Ghi chú rõ ràng về thứ tự và tác động của các decorator

## 7. Kết luận

Decorator Pattern là một công cụ mạnh mẽ trong JavaScript và TypeScript, cho phép chúng ta mở rộng chức năng của đối tượng một cách linh hoạt. Pattern này đặc biệt hữu ích trong các tình huống cần thêm chức năng vào đối tượng mà không muốn thay đổi cấu trúc code hiện có.

Tuy nhiên, cần cân nhắc kỹ khi sử dụng pattern này để tránh làm cho code trở nên quá phức tạp. Việc sử dụng decorator một cách hợp lý sẽ giúp code của bạn dễ bảo trì và mở rộng hơn.