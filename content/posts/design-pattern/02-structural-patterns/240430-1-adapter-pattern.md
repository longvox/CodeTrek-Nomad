---
title: "Structural Pattern [1/7] - Adapter Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-04-30
description: "Adapter Pattern là một mẫu thiết kế cấu trúc cho phép các interface không tương thích có thể làm việc cùng nhau. Bài viết này phân tích cách triển khai Adapter Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "adapter-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Adapter
  - Structural Patterns
---

## 1. Adapter Pattern là gì?

Adapter Pattern là một mẫu thiết kế cấu trúc cho phép các đối tượng với interface không tương thích có thể làm việc cùng nhau. Pattern này hoạt động như một wrapper, chuyển đổi interface của một đối tượng thành một interface khác mà client mong đợi.

Các thành phần chính trong Adapter Pattern:
- **Target**: Interface mà client sử dụng
- **Adaptee**: Interface cần được thích nghi
- **Adapter**: Lớp chuyển đổi interface của Adaptee thành Target
- **Client**: Đối tượng sử dụng Target interface

## 2. Triển khai trong JavaScript

### 2.1 Object Adapter Pattern

```javascript
// Old interface (Adaptee)
class OldPaymentGateway {
  processPayment(amount) {
    return `Processing payment of $${amount} through old gateway`;
  }
  
  verifyPayment(transactionId) {
    return `Verifying payment ${transactionId} through old gateway`;
  }
}

// New interface (Target)
class PaymentProcessor {
  pay(amount) {
    throw new Error('pay() must be implemented');
  }
  
  verify(payment) {
    throw new Error('verify() must be implemented');
  }
}

// Adapter
class PaymentGatewayAdapter extends PaymentProcessor {
  constructor(oldGateway) {
    super();
    this.oldGateway = oldGateway;
  }
  
  pay(amount) {
    // Adapt the old processPayment method to the new pay interface
    return this.oldGateway.processPayment(amount);
  }
  
  verify(payment) {
    // Adapt the old verifyPayment method to the new verify interface
    return this.oldGateway.verifyPayment(payment.id);
  }
}

// Client code
function processOrder(paymentProcessor, order) {
  const payment = paymentProcessor.pay(order.total);
  console.log(payment);
  
  const verification = paymentProcessor.verify({ id: 'TX123' });
  console.log(verification);
}

// Usage
const oldGateway = new OldPaymentGateway();
const adapter = new PaymentGatewayAdapter(oldGateway);

const order = { total: 100 };
processOrder(adapter, order);
// Output:
// Processing payment of $100 through old gateway
// Verifying payment TX123 through old gateway
```

### 2.2 Class Adapter Pattern

```javascript
// Third-party API (Adaptee)
class ThirdPartyAPI {
  fetchData(query) {
    return `Data for query: ${query}`;
  }
  
  saveData(data) {
    return `Saving data: ${data}`;
  }
}

// Our application interface (Target)
class DataService {
  getData(params) {
    throw new Error('getData() must be implemented');
  }
  
  putData(data) {
    throw new Error('putData() must be implemented');
  }
}

// Adapter using multiple inheritance (not available in JavaScript)
// We can simulate it using composition
class APIAdapter extends DataService {
  constructor() {
    super();
    this.api = new ThirdPartyAPI();
  }
  
  getData(params) {
    // Convert params to query format expected by ThirdPartyAPI
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    return this.api.fetchData(query);
  }
  
  putData(data) {
    // Convert data to format expected by ThirdPartyAPI
    const formattedData = JSON.stringify(data);
    return this.api.saveData(formattedData);
  }
}

// Usage
const dataService = new APIAdapter();

console.log(dataService.getData({ user: 'john', id: 123 }));
// Output: Data for query: user=john&id=123

console.log(dataService.putData({ name: 'John', age: 30 }));
// Output: Saving data: {"name":"John","age":30}
```

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ giúp triển khai Adapter Pattern an toàn và rõ ràng hơn:

```typescript
// External service interfaces
interface ExternalUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
}

interface ExternalUserService {
  fetchUser(id: number): Promise<ExternalUser>;
  updateUser(user: ExternalUser): Promise<void>;
  listUsers(): Promise<ExternalUser[]>;
}

// Our application interfaces
interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface UserService {
  getUser(id: number): Promise<User>;
  saveUser(user: User): Promise<void>;
  getAllUsers(): Promise<User[]>;
}

// External service implementation (Adaptee)
class LegacyUserService implements ExternalUserService {
  private users: Map<number, ExternalUser> = new Map();
  
  constructor() {
    // Simulate some initial data
    this.users.set(1, {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    });
  }
  
  async fetchUser(id: number): Promise<ExternalUser> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  
  async updateUser(user: ExternalUser): Promise<void> {
    this.users.set(user.id, user);
  }
  
  async listUsers(): Promise<ExternalUser[]> {
    return Array.from(this.users.values());
  }
}

// Adapter
class UserServiceAdapter implements UserService {
  constructor(private legacyService: ExternalUserService) {}
  
  private convertToUser(externalUser: ExternalUser): User {
    return {
      id: externalUser.id,
      fullName: `${externalUser.firstName} ${externalUser.lastName}`,
      email: externalUser.email,
      isAdmin: externalUser.role === 'admin',
      canEdit: externalUser.permissions.includes('write'),
      canDelete: externalUser.permissions.includes('delete')
    };
  }
  
  private convertToExternalUser(user: User): ExternalUser {
    const [firstName, ...lastNameParts] = user.fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    return {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      role: user.isAdmin ? 'admin' : 'user',
      permissions: [
        'read',
        ...(user.canEdit ? ['write'] : []),
        ...(user.canDelete ? ['delete'] : [])
      ]
    };
  }
  
  async getUser(id: number): Promise<User> {
    const externalUser = await this.legacyService.fetchUser(id);
    return this.convertToUser(externalUser);
  }
  
  async saveUser(user: User): Promise<void> {
    const externalUser = this.convertToExternalUser(user);
    await this.legacyService.updateUser(externalUser);
  }
  
  async getAllUsers(): Promise<User[]> {
    const externalUsers = await this.legacyService.listUsers();
    return externalUsers.map(user => this.convertToUser(user));
  }
}

// Usage
async function main() {
  const legacyService = new LegacyUserService();
  const userService = new UserServiceAdapter(legacyService);
  
  // Get user
  const user = await userService.getUser(1);
  console.log('User:', user);
  
  // Update user
  user.fullName = 'John Smith';
  await userService.saveUser(user);
  
  // Get all users
  const users = await userService.getAllUsers();
  console.log('All users:', users);
}

main().catch(console.error);
```

## 4. Ví dụ thực tế: API Adapter

Hãy xem xét một ví dụ thực tế về việc sử dụng Adapter Pattern để tích hợp các API khác nhau:

```typescript
// Different payment gateway interfaces
interface StripePayment {
  processPayment(amount: number, currency: string, source: string): Promise<{
    id: string;
    status: string;
    amount: number;
  }>;
}

interface PayPalPayment {
  createPayment(data: {
    sum: number;
    currency: string;
    method: string;
  }): Promise<{
    paymentId: string;
    state: string;
    amount: {
      total: number;
      currency: string;
    };
  }>;
}

// Common payment interface for our application
interface PaymentProvider {
  pay(amount: number, currency: string, method: string): Promise<{
    transactionId: string;
    success: boolean;
    amount: number;
    currency: string;
  }>;
}

// Stripe implementation
class StripeAPI implements StripePayment {
  async processPayment(amount: number, currency: string, source: string) {
    // Simulate Stripe API call
    return {
      id: `stripe_${Math.random().toString(36).substr(2, 9)}`,
      status: 'succeeded',
      amount
    };
  }
}

// PayPal implementation
class PayPalAPI implements PayPalPayment {
  async createPayment(data: { sum: number; currency: string; method: string }) {
    // Simulate PayPal API call
    return {
      paymentId: `paypal_${Math.random().toString(36).substr(2, 9)}`,
      state: 'approved',
      amount: {
        total: data.sum,
        currency: data.currency
      }
    };
  }
}

// Adapters
class StripeAdapter implements PaymentProvider {
  constructor(private stripe: StripePayment) {}
  
  async pay(amount: number, currency: string, method: string) {
    try {
      const result = await this.stripe.processPayment(amount, currency, method);
      
      return {
        transactionId: result.id,
        success: result.status === 'succeeded',
        amount: result.amount,
        currency
      };
    } catch (error) {
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  }
}

class PayPalAdapter implements PaymentProvider {
  constructor(private paypal: PayPalPayment) {}
  
  async pay(amount: number, currency: string, method: string) {
    try {
      const result = await this.paypal.createPayment({
        sum: amount,
        currency,
        method
      });
      
      return {
        transactionId: result.paymentId,
        success: result.state === 'approved',
        amount: result.amount.total,
        currency: result.amount.currency
      };
    } catch (error) {
      throw new Error(`PayPal payment failed: ${error.message}`);
    }
  }
}

// Payment processor using the common interface
class PaymentProcessor {
  constructor(private provider: PaymentProvider) {}
  
  async processPayment(amount: number, currency: string, method: string) {
    try {
      const result = await this.provider.pay(amount, currency, method);
      
      if (result.success) {
        console.log(`Payment successful: ${result.transactionId}`);
        console.log(`Amount: ${result.amount} ${result.currency}`);
      } else {
        console.log('Payment failed');
      }
      
      return result;
    } catch (error) {
      console.error('Payment error:', error.message);
      throw error;
    }
  }
}

// Usage
async function main() {
  // Setup payment providers
  const stripeProvider = new StripeAdapter(new StripeAPI());
  const paypalProvider = new PayPalAdapter(new PayPalAPI());
  
  // Process payments using different providers
  const stripeProcessor = new PaymentProcessor(stripeProvider);
  await stripeProcessor.processPayment(100, 'USD', 'card');
  
  const paypalProcessor = new PaymentProcessor(paypalProvider);
  await paypalProcessor.processPayment(50, 'EUR', 'paypal');
}

main().catch(console.error);
```

## 5. Khi nào nên sử dụng Adapter Pattern

Adapter Pattern phù hợp trong các tình huống sau:

1. **Khi cần tích hợp code cũ với code mới**
2. **Khi làm việc với third-party libraries**
3. **Khi cần chuyển đổi interface**
4. **Khi muốn tái sử dụng code hiện có**
5. **Khi cần tương thích ngược**

Ví dụ thực tế:
- Tích hợp các payment gateways
- Chuyển đổi dữ liệu giữa các API
- Kết nối với legacy systems
- Wrapper cho third-party libraries
- Chuẩn hóa interface

## 6. So sánh với các Pattern khác

### So sánh với Bridge Pattern

| Adapter Pattern | Bridge Pattern |
|----------------|----------------|
| Làm việc với interface hiện có | Thiết kế cho interface mới |
| Thường triển khai sau | Thiết kế từ đầu |
| Giải quyết tương thích | Giải quyết tính trừu tượng |
| Một chiều | Hai chiều |

### So sánh với Decorator Pattern

| Adapter Pattern | Decorator Pattern |
|----------------|-------------------|
| Thay đổi interface | Thêm chức năng mới |
| Không thay đổi behavior | Mở rộng behavior |
| Tập trung vào tương thích | Tập trung vào chức năng |
| Wrapper bên ngoài | Wrapper có cấu trúc |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Tách biệt code** client và code được adapt
- **Dễ dàng thêm adapters** mới
- **Tăng tính tái sử dụng** của code
- **Cải thiện khả năng bảo trì**
- **Tuân thủ Single Responsibility Principle**

### Nhược điểm:
- **Tăng độ phức tạp** của code
- **Có thể cần nhiều adapter** cho một hệ thống
- **Khó khăn trong việc debug**
- **Overhead về performance**
- **Có thể tạo ra nhiều lớp trung gian**

## 8. Kết luận

Adapter Pattern là một công cụ quan trọng trong việc giải quyết vấn đề tương thích giữa các interface khác nhau. Pattern này đặc biệt hữu ích trong các dự án thực tế, nơi chúng ta thường xuyên phải làm việc với các hệ thống và thư viện khác nhau.

Khi quyết định sử dụng Adapter Pattern, hãy cân nhắc mức độ phức tạp của việc chuyển đổi interface và số lượng adapter cần thiết. Trong nhiều trường hợp, lợi ích của việc có một interface thống nhất và code dễ bảo trì sẽ lớn hơn chi phí của việc triển khai các adapter.
