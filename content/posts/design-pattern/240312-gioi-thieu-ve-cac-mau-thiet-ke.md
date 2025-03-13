---
title: "Giới thiệu về các mẫu thiết kế trong JavaScript/TypeScript"
draft: false
date: 2024-03-12
description: "Khi làm việc với JavaScript và TypeScript, việc hiểu và áp dụng các mẫu thiết kế không chỉ giúp code sạch hơn mà còn giúp giải quyết các vấn đề phức tạp một cách hiệu quả. Bài viết này sẽ giới thiệu tổng quan về các mẫu thiết kế và tại sao chúng quan trọng trong JS/TS."
slug: "gioi-thieu-ve-cac-mau-thiet-ke-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Clean Code
---

{{< sidenote >}}
Mình làm việc với JavaScript và TypeScript đã được một thời gian và mình thấy việc áp dụng các mẫu thiết kế đã giúp mình giải quyết nhiều vấn đề phức tạp. Series blog này là cách mình chia sẻ kiến thức và cũng để bản thân hệ thống lại kiến thức.
{{< /sidenote >}}

Chắc hẳn trong quá trình làm việc với các dự án lớn, các bạn đều đã từng gặp những câu hỏi kiểu như:
- "Code đang rối quá, làm sao để tổ chức lại cho dễ bảo trì?"
- "Làm thế nào để viết code mà không phải lặp lại nhiều lần?"
- "Làm sao để code của mình linh hoạt, dễ mở rộng trong tương lai?"

Và các mẫu thiết kế (design patterns) chính là câu trả lời cho những câu hỏi đó. Mình sẽ bắt đầu series blog về các mẫu thiết kế trong JavaScript và TypeScript với bài đầu tiên giới thiệu tổng quan về chúng.

## 1. Mẫu thiết kế là gì?

Mẫu thiết kế (design patterns) là các giải pháp đã được kiểm chứng cho các vấn đề thường gặp trong thiết kế phần mềm. Chúng giống như các bản thiết kế đã được tối ưu sẵn mà các lập trình viên có thể tùy chỉnh để giải quyết các vấn đề lặp đi lặp lại trong code của mình.

Ví dụ đơn giản, khi bạn cần một đối tượng duy nhất trong toàn bộ ứng dụng (như một kết nối database), bạn sẽ dùng mẫu Singleton. Hoặc khi bạn cần tạo ra các đối tượng phức tạp từng bước một, bạn sẽ dùng mẫu Builder.

```javascript
// Ví dụ đơn giản về Singleton trong JavaScript
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    // Giả lập kết nối database
    this.connection = "Connected to DB";
    DatabaseConnection.instance = this;
  }
  
  query(sql) {
    console.log(`Executing: ${sql}`);
    return `Results for ${sql}`;
  }
}

// Sử dụng
const connection1 = new DatabaseConnection();
const connection2 = new DatabaseConnection();

console.log(connection1 === connection2); // true - cùng một instance
```

## 2. Tại sao sử dụng mẫu thiết kế trong JavaScript/TypeScript?

JavaScript và TypeScript có những đặc thù riêng khiến việc áp dụng các mẫu thiết kế trở nên thú vị và đôi khi khác biệt so với các ngôn ngữ khác. Có một số lý do chính để sử dụng các mẫu thiết kế:

### 2.1. Giải quyết vấn đề hiệu quả

Các mẫu thiết kế đã được thử nghiệm và tối ưu bởi nhiều lập trình viên qua thời gian. Khi áp dụng chúng, bạn đang sử dụng những giải pháp đã được chứng minh là hiệu quả.

### 2.2. Cải thiện khả năng bảo trì

Code được tổ chức theo các mẫu thiết kế thường dễ hiểu và bảo trì hơn. Các thành phần được phân tách rõ ràng với trách nhiệm cụ thể.

### 2.3. Giao tiếp hiệu quả giữa các lập trình viên

Khi cả team đều hiểu về các mẫu thiết kế, việc trao đổi ý tưởng và giải pháp trở nên dễ dàng hơn. Thay vì giải thích chi tiết cách thức hoạt động, bạn có thể đơn giản nói "Chúng ta sẽ dùng Observer pattern ở đây".

### 2.4. Tận dụng tính linh hoạt của JavaScript

JavaScript là ngôn ngữ linh hoạt với hỗ trợ cho cả lập trình hướng đối tượng và lập trình hàm. Điều này cho phép áp dụng các mẫu thiết kế theo nhiều cách khác nhau và đôi khi còn sáng tạo hơn so với các ngôn ngữ tĩnh khác.

## 3. Lợi ích và hạn chế tiềm ẩn

### 3.1. Lợi ích

- **Tái sử dụng code**: Giảm thiểu việc viết lại các đoạn code tương tự
- **Khả năng mở rộng**: Dễ dàng mở rộng hệ thống mà không làm thay đổi code hiện tại
- **Code dễ đọc hơn**: Với các mẫu chuẩn, người đọc dễ hiểu hơn ý định của code
- **Giảm bugs**: Các mẫu đã được kiểm chứng giúp tránh được nhiều lỗi phổ biến

### 3.2. Hạn chế

- **Quá mức cần thiết**: Áp dụng mẫu thiết kế khi không cần thiết có thể làm code phức tạp hơn
- **Hiệu suất**: Một số mẫu có thể làm giảm hiệu suất nếu không được triển khai đúng cách
- **Đường cong học tập**: Cần thời gian để hiểu và áp dụng các mẫu hiệu quả

## 4. Sự khác biệt khi áp dụng trong JS/TS so với các ngôn ngữ OOP cổ điển

JavaScript và TypeScript có một số đặc điểm khiến việc áp dụng các mẫu thiết kế khác với các ngôn ngữ OOP cổ điển như Java hay C++:

### 4.1. Tính động của JavaScript

JavaScript là ngôn ngữ động, cho phép thay đổi đối tượng trong thời gian chạy, điều này tạo ra các cách tiếp cận linh hoạt hơn cho nhiều mẫu thiết kế.

```javascript
// Ví dụ về tính động trong JavaScript
const user = { name: "John" };

// Thêm phương thức trong runtime
user.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

user.sayHello(); // "Hello, my name is John"
```

### 4.2. First-class functions

JavaScript coi hàm như các giá trị bình thường, có thể truyền, gán và trả về. Điều này cho phép các triển khai linh hoạt của các mẫu như Strategy, Command, hay Observer.

```javascript
// Strategy pattern với first-class functions
const paymentStrategies = {
  creditCard: (amount) => {
    console.log(`Paid ${amount} using credit card`);
  },
  
  paypal: (amount) => {
    console.log(`Paid ${amount} using PayPal`);
  },
  
  crypto: (amount) => {
    console.log(`Paid ${amount} using cryptocurrency`);
  }
};

function processPayment(amount, strategy) {
  paymentStrategies[strategy](amount);
}

// Sử dụng
processPayment(100, "creditCard"); // "Paid 100 using credit card"
processPayment(50, "paypal");      // "Paid 50 using PayPal"
```

### 4.3. Prototype inheritance

Hệ thống kế thừa prototype của JavaScript khác với kế thừa class truyền thống, điều này ảnh hưởng đến cách triển khai các mẫu dựa trên kế thừa.

### 4.4. TypeScript và type system

TypeScript bổ sung các tính năng như interface, generics và type checking, giúp việc triển khai các mẫu thiết kế gần hơn với các ngôn ngữ OOP truyền thống nhưng vẫn giữ được tính linh hoạt của JavaScript.

```typescript
// Observer pattern trong TypeScript
interface Observer {
  update(data: any): void;
}

class Subject {
  private observers: Observer[] = [];
  
  attach(observer: Observer): void {
    this.observers.push(observer);
  }
  
  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notify(data: any): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Sử dụng
class Logger implements Observer {
  update(data: any): void {
    console.log(`Logger received: ${JSON.stringify(data)}`);
  }
}

const subject = new Subject();
const logger = new Logger();

subject.attach(logger);
subject.notify({ message: "Hello World" });
// Output: "Logger received: {"message":"Hello World"}"
```

## 5. Các nhóm mẫu thiết kế chính

Trong loạt bài tiếp theo, mình sẽ đi sâu vào từng mẫu thiết kế, nhưng trước tiên hãy nhìn qua ba nhóm chính:

### 5.1. Creational Patterns (Mẫu Tạo Đối Tượng)

Các mẫu này liên quan đến cách tạo đối tượng. Chúng giúp làm cho việc tạo đối tượng linh hoạt hơn và tách biệt khỏi logic của chương trình.

Một số mẫu tiêu biểu: Singleton, Factory Method, Abstract Factory, Builder, Prototype.

### 5.2. Structural Patterns (Mẫu Cấu Trúc)

Các mẫu này liên quan đến việc tổ chức các lớp và đối tượng. Chúng giúp đảm bảo khi một phần của hệ thống thay đổi, toàn bộ cấu trúc không bị ảnh hưởng.

Một số mẫu tiêu biểu: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.

### 5.3. Behavioral Patterns (Mẫu Hành Vi)

Các mẫu này tập trung vào cách các đối tượng giao tiếp với nhau. Chúng giúp đảm bảo giao tiếp linh hoạt giữa các đối tượng.

Một số mẫu tiêu biểu: Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Observer, Strategy, Template Method.

## 6. Kết luận

Mẫu thiết kế là công cụ mạnh mẽ trong hộp công cụ của mọi lập trình viên JavaScript và TypeScript. Chúng không phải là giải pháp cho mọi vấn đề, nhưng khi được sử dụng đúng cách, chúng có thể cải thiện đáng kể chất lượng, khả năng bảo trì và khả năng mở rộng của code.

Trong các bài viết tiếp theo, mình sẽ đi sâu vào từng mẫu thiết kế cụ thể, cách triển khai chúng trong JavaScript và TypeScript, và các trường hợp thực tế nên áp dụng chúng.

Nếu bạn có bất kỳ câu hỏi hoặc ý kiến nào, hãy để lại comment bên dưới nhé!

---

Bài tiếp theo trong series: [Singleton Pattern trong JavaScript/TypeScript](/posts/singleton-pattern-in-javascript-typescript) (Coming soon) 