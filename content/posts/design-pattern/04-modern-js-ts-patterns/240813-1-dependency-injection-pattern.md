---
title: "Modern JS/TS Pattern [1/4] - Dependency Injection Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-08-13
description: "Dependency Injection Pattern là một mẫu thiết kế hiện đại giúp quản lý sự phụ thuộc giữa các thành phần trong ứng dụng. Bài viết này phân tích cách triển khai Dependency Injection Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "dependency-injection-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Dependency Injection
  - Modern Patterns
---

## 1. Dependency Injection Pattern là gì?

Dependency Injection (DI) là một mẫu thiết kế trong đó các đối tượng được cung cấp các dependency (phụ thuộc) của chúng thay vì tự tạo ra chúng. Pattern này giúp tăng tính module hóa, dễ test và bảo trì code bằng cách giảm sự phụ thuộc chặt chẽ giữa các thành phần.

Các thành phần chính trong Dependency Injection Pattern:
- **Service**: Đối tượng cần được inject
- **Client**: Đối tượng nhận dependency
- **Container**: Quản lý việc tạo và inject các dependency
- **Interface**: Định nghĩa cách client sử dụng service

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về User Service

```javascript
// Interfaces (implicit in JavaScript)
class UserRepository {
  getUsers() {
    throw new Error('getUsers() phải được triển khai');
  }

  getUserById(id) {
    throw new Error('getUserById() phải được triển khai');
  }

  saveUser(user) {
    throw new Error('saveUser() phải được triển khai');
  }
}

class Logger {
  log(message) {
    throw new Error('log() phải được triển khai');
  }

  error(message) {
    throw new Error('error() phải được triển khai');
  }
}

// Concrete implementations
class MySQLUserRepository extends UserRepository {
  constructor(connection) {
    super();
    this.connection = connection;
  }

  getUsers() {
    console.log('Lấy danh sách users từ MySQL');
    return [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' }
    ];
  }

  getUserById(id) {
    console.log(`Lấy user với id ${id} từ MySQL`);
    return { id, name: `User ${id}` };
  }

  saveUser(user) {
    console.log('Lưu user vào MySQL:', user);
    return true;
  }
}

class ConsoleLogger extends Logger {
  log(message) {
    console.log(`[INFO] ${message}`);
  }

  error(message) {
    console.error(`[ERROR] ${message}`);
  }
}

// Service that depends on UserRepository and Logger
class UserService {
  constructor(userRepository, logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  getAllUsers() {
    try {
      this.logger.log('Đang lấy danh sách users...');
      const users = this.userRepository.getUsers();
      this.logger.log(`Đã lấy ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error(`Lỗi khi lấy users: ${error.message}`);
      throw error;
    }
  }

  getUserById(id) {
    try {
      this.logger.log(`Đang lấy user với id ${id}...`);
      const user = this.userRepository.getUserById(id);
      this.logger.log(`Đã lấy user: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(`Lỗi khi lấy user ${id}: ${error.message}`);
      throw error;
    }
  }

  createUser(userData) {
    try {
      this.logger.log('Đang tạo user mới...');
      const success = this.userRepository.saveUser(userData);
      if (success) {
        this.logger.log('User đã được tạo thành công');
      }
      return success;
    } catch (error) {
      this.logger.error(`Lỗi khi tạo user: ${error.message}`);
      throw error;
    }
  }
}

// Simple DI Container
class Container {
  constructor() {
    this.services = new Map();
  }

  register(name, implementation) {
    this.services.set(name, implementation);
  }

  get(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} không tồn tại`);
    }
    return service;
  }
}

// Usage
const container = new Container();

// Register services
container.register('logger', new ConsoleLogger());
container.register('userRepository', new MySQLUserRepository('mysql://localhost'));
container.register('userService', new UserService(
  container.get('userRepository'),
  container.get('logger')
));

// Use the service
const userService = container.get('userService');

console.log('Lấy tất cả users:');
const users = userService.getAllUsers();

console.log('\nLấy user theo id:');
const user = userService.getUserById(1);

console.log('\nTạo user mới:');
userService.createUser({ name: 'New User' });
```

### 2.2 Ví dụ về Notification System

```javascript
// Interfaces
class NotificationSender {
  send(message, recipient) {
    throw new Error('send() phải được triển khai');
  }
}

class NotificationFormatter {
  format(message, type) {
    throw new Error('format() phải được triển khai');
  }
}

// Concrete implementations
class EmailSender extends NotificationSender {
  constructor(smtpConfig) {
    super();
    this.smtpConfig = smtpConfig;
  }

  send(message, recipient) {
    console.log(`Gửi email đến ${recipient}:`, message);
    return true;
  }
}

class SMSSender extends NotificationSender {
  constructor(smsGateway) {
    super();
    this.smsGateway = smsGateway;
  }

  send(message, recipient) {
    console.log(`Gửi SMS đến ${recipient}:`, message);
    return true;
  }
}

class HTMLFormatter extends NotificationFormatter {
  format(message, type) {
    return `<div class="notification ${type}">${message}</div>`;
  }
}

class PlainTextFormatter extends NotificationFormatter {
  format(message, type) {
    return `[${type.toUpperCase()}] ${message}`;
  }
}

// Service using dependency injection
class NotificationService {
  constructor(sender, formatter) {
    this.sender = sender;
    this.formatter = formatter;
  }

  notify(message, recipient, type = 'info') {
    const formattedMessage = this.formatter.format(message, type);
    return this.sender.send(formattedMessage, recipient);
  }

  notifyMany(message, recipients, type = 'info') {
    return recipients.map(recipient => 
      this.notify(message, recipient, type)
    );
  }
}

// Decorators for notification senders
class RetryDecorator extends NotificationSender {
  constructor(sender, maxRetries = 3) {
    super();
    this.sender = sender;
    this.maxRetries = maxRetries;
  }

  async send(message, recipient) {
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await this.sender.send(message, recipient);
      } catch (error) {
        if (i === this.maxRetries - 1) throw error;
        console.log(`Retry ${i + 1}/${this.maxRetries}`);
      }
    }
  }
}

// Factory for creating notification services
class NotificationServiceFactory {
  static createEmailService(smtpConfig, useHTML = true) {
    const sender = new RetryDecorator(new EmailSender(smtpConfig));
    const formatter = useHTML ? new HTMLFormatter() : new PlainTextFormatter();
    return new NotificationService(sender, formatter);
  }

  static createSMSService(smsGateway) {
    const sender = new RetryDecorator(new SMSSender(smsGateway));
    const formatter = new PlainTextFormatter();
    return new NotificationService(sender, formatter);
  }
}

// Usage
const emailService = NotificationServiceFactory.createEmailService({
  host: 'smtp.example.com',
  port: 587
});

const smsService = NotificationServiceFactory.createSMSService({
  apiKey: 'your-api-key'
});

// Send notifications
console.log('Gửi email:');
emailService.notify(
  'Chào mừng bạn đến với hệ thống!',
  'user@example.com',
  'welcome'
);

console.log('\nGửi SMS:');
smsService.notifyMany(
  'Khuyến mãi đặc biệt!',
  ['0123456789', '0987654321'],
  'promotion'
);
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về Authentication System

```typescript
// Interfaces
interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

interface ITokenGenerator {
  generate(payload: object): string;
  verify(token: string): object;
}

// Types
interface User {
  id: string;
  email: string;
  password: string;
  roles: string[];
}

interface LoginResult {
  user: Omit<User, 'password'>;
  token: string;
}

// Implementations
class MongoUserRepository implements IUserRepository {
  constructor(private connection: any) {}

  async findByEmail(email: string): Promise<User | null> {
    console.log(`Tìm user với email ${email} từ MongoDB`);
    return {
      id: '1',
      email,
      password: 'hashed_password',
      roles: ['user']
    };
  }

  async save(user: User): Promise<void> {
    console.log('Lưu user vào MongoDB:', user);
  }
}

class BCryptPasswordHasher implements IPasswordHasher {
  constructor(private rounds: number = 10) {}

  async hash(password: string): Promise<string> {
    console.log('Mã hóa mật khẩu với BCrypt');
    return `hashed_${password}`;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    console.log('So sánh mật khẩu với BCrypt');
    return hash === `hashed_${password}`;
  }
}

class JWTTokenGenerator implements ITokenGenerator {
  constructor(private secret: string) {}

  generate(payload: object): string {
    console.log('Tạo JWT token với payload:', payload);
    return 'jwt_token';
  }

  verify(token: string): object {
    console.log('Xác thực JWT token:', token);
    return { userId: '1', roles: ['user'] };
  }
}

// Service
class AuthenticationService {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenGenerator: ITokenGenerator
  ) {}

  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email đã tồn tại');
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const user: User = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      roles: ['user']
    };

    await this.userRepository.save(user);
    return user;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User không tồn tại');
    }

    const isValid = await this.passwordHasher.compare(password, user.password);
    if (!isValid) {
      throw new Error('Mật khẩu không đúng');
    }

    const token = this.tokenGenerator.generate({
      userId: user.id,
      roles: user.roles
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  }

  verifyToken(token: string): object {
    return this.tokenGenerator.verify(token);
  }
}

// DI Container
class Container {
  private services: Map<string, any> = new Map();

  register<T>(name: string, implementation: T): void {
    this.services.set(name, implementation);
  }

  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} không tồn tại`);
    }
    return service;
  }
}

// Usage
const container = new Container();

// Register services
container.register('userRepository', new MongoUserRepository('mongodb://localhost'));
container.register('passwordHasher', new BCryptPasswordHasher(12));
container.register('tokenGenerator', new JWTTokenGenerator('your-secret-key'));
container.register('authService', new AuthenticationService(
  container.get('userRepository'),
  container.get('passwordHasher'),
  container.get('tokenGenerator')
));

// Use the service
async function demo() {
  const authService = container.get<AuthenticationService>('authService');

  console.log('Đăng ký user mới:');
  const user = await authService.register('user@example.com', 'password123');
  console.log('User đã đăng ký:', user);

  console.log('\nĐăng nhập:');
  const loginResult = await authService.login('user@example.com', 'password123');
  console.log('Kết quả đăng nhập:', loginResult);

  console.log('\nXác thực token:');
  const tokenPayload = authService.verifyToken(loginResult.token);
  console.log('Token payload:', tokenPayload);
}

demo().catch(console.error);
```

### 3.2 Ví dụ về Payment Processing

```typescript
// Interfaces
interface IPaymentGateway {
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
  refundPayment(paymentId: string): Promise<boolean>;
}

interface IPaymentValidator {
  validate(amount: number, currency: string): boolean;
}

interface IPaymentLogger {
  logPayment(payment: Payment): void;
  logError(error: Error): void;
}

// Types
interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  timestamp: Date;
}

interface PaymentResult {
  success: boolean;
  paymentId: string;
  error?: string;
}

enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// Implementations
class StripeGateway implements IPaymentGateway {
  constructor(private apiKey: string) {}

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    console.log(`Xử lý thanh toán ${amount} ${currency} qua Stripe`);
    return {
      success: true,
      paymentId: `stripe_${Date.now()}`
    };
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    console.log(`Hoàn tiền cho thanh toán ${paymentId} qua Stripe`);
    return true;
  }
}

class PaymentValidator implements IPaymentValidator {
  validate(amount: number, currency: string): boolean {
    if (amount <= 0) {
      throw new Error('Số tiền phải lớn hơn 0');
    }
    if (!['USD', 'EUR', 'VND'].includes(currency)) {
      throw new Error('Loại tiền tệ không được hỗ trợ');
    }
    return true;
  }
}

class DatabaseLogger implements IPaymentLogger {
  constructor(private dbConnection: any) {}

  logPayment(payment: Payment): void {
    console.log('Lưu log thanh toán vào database:', payment);
  }

  logError(error: Error): void {
    console.error('Lưu log lỗi vào database:', error.message);
  }
}

// Service
class PaymentService {
  constructor(
    private gateway: IPaymentGateway,
    private validator: IPaymentValidator,
    private logger: IPaymentLogger
  ) {}

  async processPayment(amount: number, currency: string): Promise<Payment> {
    try {
      this.validator.validate(amount, currency);

      const payment: Payment = {
        id: `payment_${Date.now()}`,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        timestamp: new Date()
      };

      const result = await this.gateway.processPayment(amount, currency);

      if (result.success) {
        payment.status = PaymentStatus.COMPLETED;
      } else {
        payment.status = PaymentStatus.FAILED;
      }

      this.logger.logPayment(payment);
      return payment;
    } catch (error) {
      this.logger.logError(error as Error);
      throw error;
    }
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    try {
      const success = await this.gateway.refundPayment(paymentId);
      
      if (success) {
        const refundPayment: Payment = {
          id: `refund_${paymentId}`,
          amount: 0, // Số tiền hoàn lại sẽ được lấy từ payment gốc
          currency: 'USD',
          status: PaymentStatus.REFUNDED,
          timestamp: new Date()
        };

        this.logger.logPayment(refundPayment);
      }

      return success;
    } catch (error) {
      this.logger.logError(error as Error);
      throw error;
    }
  }
}

// Usage
const paymentService = new PaymentService(
  new StripeGateway('stripe-api-key'),
  new PaymentValidator(),
  new DatabaseLogger('db-connection')
);

async function demo() {
  console.log('Xử lý thanh toán:');
  const payment = await paymentService.processPayment(100, 'USD');
  console.log('Kết quả thanh toán:', payment);

  console.log('\nHoàn tiền:');
  const refunded = await paymentService.refundPayment(payment.id);
  console.log('Kết quả hoàn tiền:', refunded);
}

demo().catch(console.error);
```

## 4. Ưu điểm và Nhược điểm

### 4.1 Ưu điểm
1. **Tách biệt dependencies**: Giảm sự phụ thuộc giữa các thành phần
2. **Dễ test**: Dễ dàng mock các dependencies trong testing
3. **Linh hoạt**: Dễ dàng thay đổi implementation mà không ảnh hưởng code
4. **Tái sử dụng**: Tăng khả năng tái sử dụng code

### 4.2 Nhược điểm
1. **Phức tạp**: Có thể phức tạp hóa code với nhiều dependencies
2. **Khó debug**: Khó debug khi có nhiều layer của injection
3. **Overhead**: Tăng thời gian khởi tạo và tài nguyên
4. **Học tập**: Đòi hỏi thời gian học và hiểu pattern

## 5. Khi nào nên sử dụng Dependency Injection Pattern?

1. **Ứng dụng lớn**: Khi làm việc với ứng dụng có nhiều thành phần
2. **Testing**: Khi cần viết unit test với mock dependencies
3. **Thay đổi implementation**: Khi cần thay đổi implementation thường xuyên
4. **Tái sử dụng**: Khi muốn tăng khả năng tái sử dụng code
5. **Quản lý phụ thuộc**: Khi cần quản lý phụ thuộc một cách hiệu quả

## 6. Kết luận

Dependency Injection Pattern là một mẫu thiết kế mạnh mẽ giúp quản lý sự phụ thuộc giữa các thành phần trong ứng dụng. Pattern này đặc biệt hữu ích trong JavaScript / TypeScript khi làm việc với các ứng dụng lớn và cần tính module hóa cao. Tuy nhiên, cần cân nhắc về tính phức tạp và overhead khi sử dụng pattern này.