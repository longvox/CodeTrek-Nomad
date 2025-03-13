---
title: "Module Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-04-23
description: "Module Pattern là một mẫu thiết kế đặc biệt quan trọng trong JavaScript để tổ chức và đóng gói code. Bài viết này phân tích cách triển khai Module Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "module-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Module
  - Creational Patterns
---

{{< sidenote >}}
Đây là bài viết thứ bảy trong series về các mẫu thiết kế trong JavaScript/TypeScript. Nếu bạn chưa đọc các bài trước, bạn có thể xem: [Giới thiệu về các mẫu thiết kế](/posts/gioi-thieu-ve-cac-mau-thiet-ke-javascript-typescript), [Singleton Pattern](/posts/singleton-pattern-trong-javascript-typescript), [Factory Method Pattern](/posts/factory-method-pattern-trong-javascript-typescript), [Abstract Factory Pattern](/posts/abstract-factory-pattern-trong-javascript-typescript), [Builder Pattern](/posts/builder-pattern-trong-javascript-typescript) và [Prototype Pattern](/posts/prototype-pattern-trong-javascript-typescript).
{{< /sidenote >}}

Trong bài viết trước, chúng ta đã tìm hiểu về Prototype Pattern - một mẫu thiết kế cho phép sao chép các đối tượng hiện có. Hôm nay, mình sẽ giới thiệu về Module Pattern - một mẫu thiết kế đặc biệt quan trọng trong JavaScript để tổ chức và đóng gói code.

## 1. Module Pattern là gì?

Module Pattern là một mẫu thiết kế được sử dụng để đóng gói dữ liệu và hành vi liên quan vào một đơn vị độc lập. Pattern này giúp tạo ra namespace riêng và giảm thiểu xung đột tên biến trong ứng dụng JavaScript. Module Pattern cũng cung cấp cách để triển khai tính đóng gói (encapsulation) trong JavaScript.

Các đặc điểm chính của Module Pattern:
- **Đóng gói (Encapsulation)**: Ẩn các chi tiết triển khai
- **Namespace**: Tạo không gian tên riêng cho code
- **Tái sử dụng (Reusability)**: Code có thể được tái sử dụng dễ dàng
- **Loose Coupling**: Giảm sự phụ thuộc giữa các module

## 2. Triển khai trong JavaScript

### 2.1 IIFE (Immediately Invoked Function Expression)

```javascript
const Calculator = (function() {
  // Private variables
  let result = 0;
  
  // Private functions
  function validate(number) {
    return typeof number === 'number' && !isNaN(number);
  }
  
  // Public interface
  return {
    add(number) {
      if (!validate(number)) {
        throw new Error('Invalid number');
      }
      result += number;
      return this;
    },
    
    subtract(number) {
      if (!validate(number)) {
        throw new Error('Invalid number');
      }
      result -= number;
      return this;
    },
    
    multiply(number) {
      if (!validate(number)) {
        throw new Error('Invalid number');
      }
      result *= number;
      return this;
    },
    
    divide(number) {
      if (!validate(number)) {
        throw new Error('Invalid number');
      }
      if (number === 0) {
        throw new Error('Cannot divide by zero');
      }
      result /= number;
      return this;
    },
    
    getResult() {
      return result;
    },
    
    clear() {
      result = 0;
      return this;
    }
  };
})();

// Usage
Calculator
  .add(5)
  .multiply(2)
  .subtract(3)
  .divide(2);

console.log(Calculator.getResult()); // 3.5
console.log(Calculator.result);      // undefined (private)
```

### 2.2 Revealing Module Pattern

```javascript
const UserManager = (function() {
  // Private state
  const users = new Map();
  
  // Private functions
  function validateUser(user) {
    return user && 
           typeof user === 'object' && 
           typeof user.id === 'string' && 
           typeof user.name === 'string';
  }
  
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // Public functions
  function addUser(name) {
    const id = generateId();
    const user = { id, name };
    users.set(id, user);
    return user;
  }
  
  function getUser(id) {
    return users.get(id);
  }
  
  function updateUser(id, updates) {
    const user = users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...user, ...updates };
    if (!validateUser(updatedUser)) {
      throw new Error('Invalid user data');
    }
    
    users.set(id, updatedUser);
    return updatedUser;
  }
  
  function deleteUser(id) {
    return users.delete(id);
  }
  
  function getAllUsers() {
    return Array.from(users.values());
  }
  
  // Reveal public interface
  return {
    add: addUser,
    get: getUser,
    update: updateUser,
    delete: deleteUser,
    getAll: getAllUsers
  };
})();

// Usage
const user1 = UserManager.add('John Doe');
const user2 = UserManager.add('Jane Smith');

console.log(UserManager.getAll());
// [{id: "abc123", name: "John Doe"}, {id: "def456", name: "Jane Smith"}]

UserManager.update(user1.id, { name: 'John Smith' });
console.log(UserManager.get(user1.id));
// {id: "abc123", name: "John Smith"}

UserManager.delete(user2.id);
console.log(UserManager.getAll());
// [{id: "abc123", name: "John Smith"}]
```

## 3. Triển khai trong TypeScript

TypeScript cung cấp các tính năng module tích hợp, giúp việc triển khai Module Pattern trở nên rõ ràng và an toàn hơn:

```typescript
// types.ts
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskManager {
  addTask(title: string): Task;
  getTask(id: string): Task | undefined;
  updateTask(id: string, updates: Partial<Task>): Task;
  deleteTask(id: string): boolean;
  getAllTasks(): Task[];
  getCompletedTasks(): Task[];
  getPendingTasks(): Task[];
}

// task-manager.ts
import { Task, TaskManager } from './types';

class TaskManagerImpl implements TaskManager {
  private tasks: Map<string, Task> = new Map();
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  addTask(title: string): Task {
    const task: Task = {
      id: this.generateId(),
      title,
      completed: false,
      createdAt: new Date()
    };
    
    this.tasks.set(task.id, task);
    return task;
  }
  
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }
  
  updateTask(id: string, updates: Partial<Task>): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    const updatedTask = { ...task, ...updates };
    
    if (updates.completed && !task.completed) {
      updatedTask.completedAt = new Date();
    } else if (updates.completed === false) {
      delete updatedTask.completedAt;
    }
    
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }
  
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }
  
  getCompletedTasks(): Task[] {
    return this.getAllTasks().filter(task => task.completed);
  }
  
  getPendingTasks(): Task[] {
    return this.getAllTasks().filter(task => !task.completed);
  }
}

// Singleton instance
export const TaskManager = new TaskManagerImpl();

// Usage
import { TaskManager } from './task-manager';

const task1 = TaskManager.addTask('Learn TypeScript');
const task2 = TaskManager.addTask('Learn Design Patterns');

console.log(TaskManager.getAllTasks());
// [{id: "abc123", title: "Learn TypeScript", ...}, {id: "def456", title: "Learn Design Patterns", ...}]

TaskManager.updateTask(task1.id, { completed: true });
console.log(TaskManager.getCompletedTasks());
// [{id: "abc123", title: "Learn TypeScript", completed: true, ...}]

console.log(TaskManager.getPendingTasks());
// [{id: "def456", title: "Learn Design Patterns", completed: false, ...}]
```

## 4. Ví dụ thực tế: Logger Module

Hãy xem xét một ví dụ thực tế về việc triển khai một logger module:

```typescript
// logger.ts
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface LogTransport {
  log(entry: LogEntry): void;
}

class ConsoleTransport implements LogTransport {
  private colors = {
    [LogLevel.DEBUG]: '\x1b[36m', // Cyan
    [LogLevel.INFO]: '\x1b[32m',  // Green
    [LogLevel.WARN]: '\x1b[33m',  // Yellow
    [LogLevel.ERROR]: '\x1b[31m', // Red
    reset: '\x1b[0m'
  };
  
  log(entry: LogEntry): void {
    const color = this.colors[entry.level];
    const reset = this.colors.reset;
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? JSON.stringify(entry.context) : '';
    
    console.log(
      `${color}[${entry.level}]${reset} ${timestamp} - ${entry.message} ${context}`
    );
  }
}

class FileTransport implements LogTransport {
  private filePath: string;
  
  constructor(filePath: string) {
    this.filePath = filePath;
  }
  
  log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? JSON.stringify(entry.context) : '';
    const logLine = `[${entry.level}] ${timestamp} - ${entry.message} ${context}\n`;
    
    // In a real implementation, we would write to file asynchronously
    // For demonstration purposes, we'll just console.log
    console.log(`Writing to ${this.filePath}: ${logLine}`);
  }
}

class Logger {
  private static instance: Logger;
  private transports: LogTransport[] = [];
  private minLevel: LogLevel = LogLevel.INFO;
  
  private constructor() {
    // Private constructor to enforce singleton
  }
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }
  
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
  
  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }
  
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) {
      return;
    }
    
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context
    };
    
    this.transports.forEach(transport => transport.log(entry));
  }
  
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }
  
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }
  
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }
  
  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Initialize with default transports
logger.addTransport(new ConsoleTransport());
logger.addTransport(new FileTransport('app.log'));

// Usage
import { logger, LogLevel } from './logger';

// Set minimum log level
logger.setMinLevel(LogLevel.DEBUG);

// Log messages with different levels
logger.debug('Debugging information', { module: 'auth', userId: 123 });
logger.info('User logged in successfully', { userId: 123 });
logger.warn('Rate limit approaching', { currentRate: 95 });
logger.error('Failed to process payment', { 
  orderId: 456,
  error: 'Insufficient funds'
});

// Output:
// [DEBUG] 2024-04-23T10:00:00.000Z - Debugging information {"module":"auth","userId":123}
// [INFO] 2024-04-23T10:00:00.000Z - User logged in successfully {"userId":123}
// [WARN] 2024-04-23T10:00:00.000Z - Rate limit approaching {"currentRate":95}
// [ERROR] 2024-04-23T10:00:00.000Z - Failed to process payment {"orderId":456,"error":"Insufficient funds"}
```

## 5. Khi nào nên sử dụng Module Pattern

Module Pattern phù hợp trong các tình huống sau:

1. **Khi cần đóng gói logic liên quan**
2. **Khi muốn tránh xung đột tên biến**
3. **Khi cần tạo API công khai cho module**
4. **Khi muốn ẩn chi tiết triển khai**
5. **Khi cần tổ chức code thành các đơn vị độc lập**

Ví dụ thực tế:
- Quản lý trạng thái ứng dụng
- Xử lý logging và debugging
- Quản lý cấu hình
- Xử lý authentication
- Quản lý cache

## 6. So sánh với các Pattern khác

### So sánh với Singleton Pattern

| Module Pattern | Singleton Pattern |
|---------------|------------------|
| Tập trung vào tổ chức code | Tập trung vào instance duy nhất |
| Có thể có nhiều instance | Chỉ có một instance |
| Linh hoạt trong việc export | Strict về việc truy cập |
| Dễ test hơn | Khó test hơn |

### So sánh với Namespace Pattern

| Module Pattern | Namespace Pattern |
|---------------|------------------|
| Private và public members | Chỉ có public members |
| Closure để bảo vệ state | Global object |
| Modern JavaScript | Legacy approach |
| Better encapsulation | Limited encapsulation |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Đóng gói tốt** cho dữ liệu private
- **Tổ chức code** rõ ràng và có cấu trúc
- **Tránh xung đột** tên biến
- **Dễ bảo trì** và mở rộng
- **Tái sử dụng code** hiệu quả

### Nhược điểm:
- **Khó truy cập** private members khi cần
- **Khó mở rộng** functionality sau khi định nghĩa
- **Memory usage** cao hơn với closure
- **Khó debug** private state
- **Không hỗ trợ** circular dependencies tốt

## 8. Kết luận

Module Pattern là một công cụ quan trọng trong JavaScript và TypeScript để tổ chức code thành các đơn vị độc lập và có thể tái sử dụng. Pattern này đặc biệt hữu ích trong việc triển khai tính đóng gói và tạo API rõ ràng cho các module.

Khi quyết định sử dụng Module Pattern, hãy cân nhắc yêu cầu về tính đóng gói và tổ chức code. Đối với các ứng dụng hiện đại, bạn có thể kết hợp Module Pattern với các tính năng module của ES6+ và TypeScript để có được lợi ích tốt nhất của cả hai thế giới.

Trong bài viết tiếp theo, chúng ta sẽ bắt đầu tìm hiểu về các mẫu thiết kế cấu trúc (Structural Patterns), bắt đầu với Adapter Pattern - một mẫu thiết kế giúp các interface không tương thích có thể làm việc cùng nhau.

## Tài liệu tham khảo

1. Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design Patterns: Elements of Reusable Object-Oriented Software.
2. Osmani, A. (2017). Learning JavaScript Design Patterns.
3. Freeman, E., Robson, E., Sierra, K., & Bates, B. (2004). Head First Design Patterns.
4. TypeScript Documentation: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
5. MDN Web Docs - JavaScript modules: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 