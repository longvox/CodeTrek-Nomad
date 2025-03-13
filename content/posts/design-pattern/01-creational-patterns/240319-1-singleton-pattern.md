---
title: "Creational Pattern [1/6] - Singleton Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-03-19
description: "Singleton là một trong những mẫu thiết kế đơn giản và phổ biến nhất. Bài viết này phân tích cách triển khai Singleton trong JavaScript và TypeScript, khi nào nên sử dụng và những cạm bẫy cần tránh."
slug: "singleton-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Singleton
  - Creational Patterns
---

## 1. Singleton Pattern là gì?

Singleton là một mẫu thiết kế đảm bảo một lớp chỉ có một thể hiện (instance) duy nhất và cung cấp một điểm truy cập toàn cục đến instance đó.

Các đặc điểm chính của Singleton:
- Hạn chế khởi tạo một lớp với một đối tượng duy nhất
- Cung cấp một điểm truy cập toàn cục đến thể hiện đó
- Khởi tạo thể hiện duy nhất chỉ khi được yêu cầu lần đầu (lazy initialization)

## 2. Triển khai trong JavaScript

Có nhiều cách để triển khai Singleton trong JavaScript. Hãy xem xét một số cách tiếp cận phổ biến.

### 2.1 Sử dụng Object Literal

Cách đơn giản nhất để triển khai Singleton trong JavaScript là sử dụng object literal. Đây là cách tiếp cận đơn giản nhưng hiệu quả.

```javascript
// Singleton sử dụng Object Literal
const ConfigManager = {
  config: {},
  
  loadConfig() {
    console.log("Loading configuration...");
    this.config = {
      apiUrl: "https://api.example.com",
      timeout: 5000,
      retryCount: 3
    };
    return this.config;
  },
  
  getConfig() {
    if (Object.keys(this.config).length === 0) {
      return this.loadConfig();
    }
    return this.config;
  }
};

// Sử dụng
const config1 = ConfigManager.getConfig();
const config2 = ConfigManager.getConfig();

console.log(config1 === config2); // true
```

Cách tiếp cận này rất đơn giản và hoạt động tốt cho các trường hợp đơn giản. Tuy nhiên, nó không hỗ trợ tính private hoặc khởi tạo phức tạp.

### 2.2 Sử dụng Class với static instance

Trong JavaScript hiện đại, chúng ta có thể sử dụng class để triển khai Singleton theo cách OOP truyền thống hơn.

```javascript
// Singleton sử dụng Class
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connectionString = "mongodb://localhost:27017";
    this.isConnected = false;
    DatabaseConnection.instance = this;
  }
  
  connect() {
    if (this.isConnected) {
      console.log("Already connected");
      return;
    }
    
    console.log(`Connecting to ${this.connectionString}...`);
    this.isConnected = true;
  }
  
  query(sql) {
    if (!this.isConnected) {
      this.connect();
    }
    
    console.log(`Executing query: ${sql}`);
    return `Results for ${sql}`;
  }
}

// Sử dụng
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();

console.log(db1 === db2); // true

db1.connect();
db2.query("SELECT * FROM users"); // Không cần gọi connect vì đã được kết nối qua db1
```

### 2.3 Sử dụng Module Pattern

JavaScript's module pattern cũng là một cách tuyệt vời để triển khai Singleton, đặc biệt nếu bạn muốn ẩn các biến và phương thức private.

```javascript
// Singleton sử dụng Module Pattern
const LoggerModule = (function() {
  // Private variables
  let instance;
  let logs = [];
  
  // Private methods
  function formatLog(message, type) {
    return `[${new Date().toISOString()}] [${type}]: ${message}`;
  }
  
  // Singleton instance creator
  function createInstance() {
    return {
      log(message) {
        const logEntry = formatLog(message, "INFO");
        logs.push(logEntry);
        console.log(logEntry);
      },
      
      error(message) {
        const logEntry = formatLog(message, "ERROR");
        logs.push(logEntry);
        console.error(logEntry);
      },
      
      getLogs() {
        return [...logs]; // Return a copy of logs
      }
    };
  }
  
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// Sử dụng
const logger1 = LoggerModule.getInstance();
const logger2 = LoggerModule.getInstance();

console.log(logger1 === logger2); // true

logger1.log("Application started");
logger2.error("Something went wrong");

console.log(logger1.getLogs()); // Hiển thị cả hai log entries
```

Module pattern cung cấp tính đóng gói tốt hơn, cho phép bạn giữ phương thức và biến private.

## 3. Triển khai trong TypeScript

TypeScript cung cấp nhiều tính năng hơn để triển khai Singleton, bao gồm các access modifiers, readonly properties, và các tính năng OOP khác.

### 3.1 Singleton với Private Constructor

```typescript
// Singleton trong TypeScript với private constructor
class ApiService {
  private static instance: ApiService;
  private apiKey: string;
  
  private constructor() {
    this.apiKey = "your-api-key";
  }
  
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    
    return ApiService.instance;
  }
  
  public get(endpoint: string): Promise<any> {
    console.log(`GET ${endpoint} with key ${this.apiKey}`);
    return fetch(`https://api.example.com/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    }).then(response => response.json());
  }
  
  public post(endpoint: string, data: any): Promise<any> {
    console.log(`POST ${endpoint} with key ${this.apiKey}`);
    return fetch(`https://api.example.com/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(data)
    }).then(response => response.json());
  }
}

// Sử dụng
// const api = new ApiService(); // Error: Constructor of class 'ApiService' is private
const api1 = ApiService.getInstance();
const api2 = ApiService.getInstance();

console.log(api1 === api2); // true

api1.get('users');
api2.post('users', { name: 'John' });
```

Với TypeScript, chúng ta có thể sử dụng private constructor để ngăn chặn việc tạo instance mới, bảo đảm rằng getInstance() là cách duy nhất để có được instance của class.

### 3.2 Singleton với Generic Type

Một cách tiếp cận thú vị khác là tạo một decorator Singleton hoặc abstract class cho các lớp của bạn.

```typescript
// Singleton Generic base class
abstract class Singleton<T> {
  protected static instance: any;
  
  protected constructor() {}
  
  public static getInstance<T extends Singleton<T>>(this: new () => T): T {
    if (!this.instance) {
      this.instance = new this();
    }
    
    return this.instance;
  }
}

// Sử dụng base class
class ThemeManager extends Singleton<ThemeManager> {
  private currentTheme: string = 'light';
  
  // Constructor still protected from base class
  constructor() {
    super();
  }
  
  public getTheme(): string {
    return this.currentTheme;
  }
  
  public setTheme(theme: string): void {
    this.currentTheme = theme;
    console.log(`Theme set to: ${theme}`);
  }
}

// Sử dụng
const themeManager1 = ThemeManager.getInstance();
const themeManager2 = ThemeManager.getInstance();

console.log(themeManager1 === themeManager2); // true

themeManager1.setTheme('dark');
console.log(themeManager2.getTheme()); // 'dark'
```

## 4. Ví dụ thực tế

Trong thực tế, Singleton thường được sử dụng trong các trường hợp sau:

### 4.1 Quản lý cấu hình ứng dụng

Một ứng dụng thường chỉ cần một đối tượng cấu hình toàn cục.

```typescript
// Configuration Manager Singleton
class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, any> = {};
  
  private constructor() {}
  
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
  
  public loadConfig(environment: string): void {
    switch(environment) {
      case 'development':
        this.config = {
          apiUrl: 'http://localhost:3000',
          debug: true
        };
        break;
      case 'production':
        this.config = {
          apiUrl: 'https://api.production.com',
          debug: false
        };
        break;
      default:
        throw new Error(`Unknown environment: ${environment}`);
    }
    console.log(`Loaded ${environment} configuration`);
  }
  
  public get<T>(key: string): T {
    if (!this.config[key]) {
      throw new Error(`Configuration key "${key}" not found`);
    }
    return this.config[key] as T;
  }
}

// Sử dụng
const config = ConfigManager.getInstance();
config.loadConfig('development');

const apiUrl = config.get<string>('apiUrl');
console.log(apiUrl); // http://localhost:3000
```

### 4.2 Kết nối database

Kết nối database là một tài nguyên đắt tiền và thường được chia sẻ trong toàn bộ ứng dụng.

```typescript
// Database Connection Singleton
class Database {
  private static instance: Database;
  private connection: any = null;
  
  private constructor() {}
  
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  
  public async connect(connectionString: string): Promise<void> {
    if (this.connection) {
      console.log('Already connected to database');
      return;
    }
    
    console.log(`Connecting to database: ${connectionString}`);
    // Giả lập kết nối
    this.connection = {
      connected: true,
      timestamp: new Date()
    };
    
    // Trong thực tế, bạn sẽ sử dụng một thư viện như mongoose, typeorm, etc.
    return Promise.resolve();
  }
  
  public async query(sql: string): Promise<any[]> {
    if (!this.connection) {
      throw new Error('Not connected to database. Call connect() first');
    }
    
    console.log(`Executing query: ${sql}`);
    // Giả lập kết quả truy vấn
    return Promise.resolve([{ id: 1, name: 'Test' }]);
  }
  
  public async close(): Promise<void> {
    if (!this.connection) {
      console.log('No active connection to close');
      return;
    }
    
    console.log('Closing database connection');
    this.connection = null;
    return Promise.resolve();
  }
}

// Sử dụng
async function main() {
  const db = Database.getInstance();
  await db.connect('mongodb://localhost:27017/myapp');
  
  const results = await db.query('SELECT * FROM users');
  console.log(results);
  
  await db.close();
}

main().catch(console.error);
```

### 4.3 Logger

Một hệ thống ghi log tập trung là ứng dụng phổ biến khác của Singleton.

```typescript
// Logger Singleton
class Logger {
  private static instance: Logger;
  private logs: string[] = [];
  private logLevel: 'info' | 'warn' | 'error' = 'info';
  
  private constructor() {}
  
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  public setLogLevel(level: 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }
  
  private formatMessage(message: string, level: string): string {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  }
  
  private shouldLog(messageLevel: string): boolean {
    const levels = { 'info': 0, 'warn': 1, 'error': 2 };
    return levels[messageLevel as keyof typeof levels] >= levels[this.logLevel];
  }
  
  public info(message: string): void {
    if (this.shouldLog('info')) {
      const formattedMessage = this.formatMessage(message, 'info');
      this.logs.push(formattedMessage);
      console.log(formattedMessage);
    }
  }
  
  public warn(message: string): void {
    if (this.shouldLog('warn')) {
      const formattedMessage = this.formatMessage(message, 'warn');
      this.logs.push(formattedMessage);
      console.warn(formattedMessage);
    }
  }
  
  public error(message: string): void {
    if (this.shouldLog('error')) {
      const formattedMessage = this.formatMessage(message, 'error');
      this.logs.push(formattedMessage);
      console.error(formattedMessage);
    }
  }
  
  public getLogs(): string[] {
    return [...this.logs];
  }
}

// Sử dụng
const logger = Logger.getInstance();
logger.setLogLevel('warn'); // Chỉ log warn và error

logger.info('This is info'); // Không được log
logger.warn('This is a warning'); // Được log
logger.error('This is an error'); // Được log

console.log(logger.getLogs()); // Hiển thị 2 log entries
```

## 5. Cân nhắc khi kiểm thử

Singleton có thể gây khó khăn cho việc kiểm thử vì chúng duy trì trạng thái giữa các test cases. Đây là một số cách tiếp cận để giải quyết vấn đề này:

### 5.1 Reset Singleton giữa các test

```typescript
// Thêm phương thức reset cho Singleton
class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, any> = {};
  
  private constructor() {}
  
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
  
  // Thêm phương thức reset cho testing
  public static resetInstance(): void {
    ConfigManager.instance = undefined as any;
  }
  
  // ... các phương thức khác
}

// Trong test
beforeEach(() => {
  ConfigManager.resetInstance();
});

test('should configure correctly', () => {
  const config = ConfigManager.getInstance();
  // Test case...
});
```

### 5.2 Sử dụng Dependency Injection

Một cách tốt hơn là thiết kế hệ thống của bạn để không phụ thuộc trực tiếp vào Singleton. Thay vào đó, hãy sử dụng dependency injection.

```typescript
// Interface cho service
interface LoggerService {
  info(message: string): void;
  error(message: string): void;
}

// Singleton Logger triển khai interface
class Logger implements LoggerService {
  private static instance: Logger;
  
  private constructor() {}
  
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  public info(message: string): void {
    console.log(`[INFO] ${message}`);
  }
  
  public error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

// Lớp sử dụng logger thông qua interface
class UserService {
  private logger: LoggerService;
  
  // Inject logger interface thay vì gọi Singleton trực tiếp
  constructor(logger: LoggerService) {
    this.logger = logger;
  }
  
  public createUser(username: string): void {
    this.logger.info(`Creating user: ${username}`);
    // Logic tạo user
  }
}

// Production code
const realLogger = Logger.getInstance();
const userService = new UserService(realLogger);

// Trong test code, bạn có thể mock logger
const mockLogger: LoggerService = {
  info: jest.fn(),
  error: jest.fn()
};

const testUserService = new UserService(mockLogger);
testUserService.createUser('testuser');

expect(mockLogger.info).toHaveBeenCalledWith('Creating user: testuser');
```

## 6. Khi nào nên sử dụng Singleton

Singleton rất hữu ích trong một số trường hợp, nhưng cũng có thể bị lạm dụng. Đây là một số hướng dẫn:

### 6.1 Nên sử dụng khi:

- Bạn cần đảm bảo một lớp có duy nhất một instance
- Bạn cần một điểm truy cập toàn cục đến instance đó
- Instance đó cần được khởi tạo một lần duy nhất
- Bạn quản lý những tài nguyên chia sẻ như database connections, thread pools, bộ nhớ đệm

### 6.2 Không nên sử dụng khi:

- State của đối tượng là không quan trọng và không ảnh hưởng đến ứng dụng
- Bạn có thể dễ dàng truyền instance đến nơi cần nó (dependency injection)
- Bạn cần nhiều instance có cấu hình khác nhau
- Việc kiểm thử là ưu tiên hàng đầu (Singleton làm phức tạp việc kiểm thử)

## 7. Nhược điểm và lưu ý

Singleton có một số nhược điểm bạn cần lưu ý:

### 7.1 Global State

Singleton tạo ra global state, điều này có thể dẫn đến code khó hiểu và dễ gặp bug.

### 7.2 Khó kiểm thử

Như đã đề cập, Singleton khó kiểm thử vì trạng thái được duy trì giữa các test cases.

### 7.3 Tight Coupling

Các lớp phụ thuộc trực tiếp vào Singleton bị ràng buộc chặt chẽ với nó, làm giảm tính linh hoạt và khả năng tái sử dụng.

### 7.4 Thread Safety

Trong môi trường đa luồng (như Node.js với worker threads), bạn cần đảm bảo việc khởi tạo Singleton là thread-safe.

## 8. Kết luận

Singleton là một mẫu thiết kế đơn giản nhưng mạnh mẽ khi được sử dụng đúng cách. Nó cung cấp một cách để đảm bảo một lớp chỉ có một instance duy nhất và cung cấp điểm truy cập toàn cục đến instance đó.

Tuy nhiên, hãy cẩn thận khi sử dụng Singleton. Khi được sử dụng không đúng cách, nó có thể dẫn đến code khó bảo trì và kiểm thử. Hãy xem xét các lựa chọn thay thế như dependency injection khi phù hợp.