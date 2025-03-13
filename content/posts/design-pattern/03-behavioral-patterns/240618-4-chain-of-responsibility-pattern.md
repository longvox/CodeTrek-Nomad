---
title: "Behavioral Pattern [4/11] - Chain of Responsibility Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-06-18
description: "Chain of Responsibility Pattern là một mẫu thiết kế hành vi cho phép bạn chuyển yêu cầu dọc theo một chuỗi các handler. Bài viết này phân tích cách triển khai Chain of Responsibility Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "chain-of-responsibility-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Chain of Responsibility
  - Behavioral Patterns
---

## 1. Chain of Responsibility Pattern là gì?

Chain of Responsibility Pattern là một mẫu thiết kế hành vi cho phép bạn chuyển yêu cầu dọc theo một chuỗi các handler. Khi nhận được yêu cầu, mỗi handler quyết định xử lý yêu cầu hoặc chuyển nó cho handler tiếp theo trong chuỗi.

Các thành phần chính trong Chain of Responsibility Pattern:
- **Handler**: Interface hoặc abstract class định nghĩa phương thức xử lý yêu cầu
- **ConcreteHandler**: Triển khai cụ thể của Handler, quyết định xử lý yêu cầu hoặc chuyển tiếp
- **Client**: Tạo và gửi yêu cầu đến chuỗi handler
- **Request**: Yêu cầu cần được xử lý

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ cơ bản về Approval System

```javascript
// Handler interface
class Approver {
  constructor() {
    this.nextApprover = null;
  }
  
  setNext(approver) {
    this.nextApprover = approver;
    return approver;
  }
  
  approve(request) {
    if (this.nextApprover) {
      return this.nextApprover.approve(request);
    }
    return null;
  }
}

// Concrete handlers
class TeamLead extends Approver {
  approve(request) {
    if (request.amount <= 1000) {
      return `Team Lead approved request #${request.id} for $${request.amount}`;
    }
    return super.approve(request);
  }
}

class Manager extends Approver {
  approve(request) {
    if (request.amount <= 5000) {
      return `Manager approved request #${request.id} for $${request.amount}`;
    }
    return super.approve(request);
  }
}

class Director extends Approver {
  approve(request) {
    if (request.amount <= 10000) {
      return `Director approved request #${request.id} for $${request.amount}`;
    }
    return super.approve(request);
  }
}

class CEO extends Approver {
  approve(request) {
    if (request.amount <= 100000) {
      return `CEO approved request #${request.id} for $${request.amount}`;
    }
    return `Request #${request.id} requires board approval`;
  }
}

// Usage
class PurchaseRequest {
  constructor(id, amount, purpose) {
    this.id = id;
    this.amount = amount;
    this.purpose = purpose;
  }
}

// Create the chain
const teamLead = new TeamLead();
const manager = new Manager();
const director = new Director();
const ceo = new CEO();

teamLead.setNext(manager);
manager.setNext(director);
director.setNext(ceo);

// Create requests
const requests = [
  new PurchaseRequest(1, 800, 'Office supplies'),
  new PurchaseRequest(2, 4000, 'Software licenses'),
  new PurchaseRequest(3, 8000, 'Training program'),
  new PurchaseRequest(4, 50000, 'New department setup'),
  new PurchaseRequest(5, 200000, 'Company acquisition')
];

// Process requests
requests.forEach(request => {
  console.log(`\nRequest #${request.id} for $${request.amount} (${request.purpose})`);
  const result = teamLead.approve(request);
  console.log(result);
});
```

### 2.2 Ví dụ về Middleware System

```javascript
// Handler interface
class Middleware {
  constructor() {
    this.next = null;
  }
  
  setNext(middleware) {
    this.next = middleware;
    return middleware;
  }
  
  handle(request) {
    if (this.next) {
      return this.next.handle(request);
    }
    return true;
  }
}

// Concrete handlers
class AuthenticationMiddleware extends Middleware {
  handle(request) {
    console.log('AuthenticationMiddleware: Checking authentication...');
    
    if (!request.token) {
      throw new Error('Authentication required');
    }
    
    if (request.token !== 'valid-token') {
      throw new Error('Invalid authentication token');
    }
    
    console.log('AuthenticationMiddleware: Authentication successful');
    return super.handle(request);
  }
}

class AuthorizationMiddleware extends Middleware {
  handle(request) {
    console.log('AuthorizationMiddleware: Checking authorization...');
    
    if (!request.role) {
      throw new Error('Role required');
    }
    
    const allowedRoles = ['admin', 'editor'];
    if (!allowedRoles.includes(request.role)) {
      throw new Error('Insufficient permissions');
    }
    
    console.log('AuthorizationMiddleware: Authorization successful');
    return super.handle(request);
  }
}

class ValidationMiddleware extends Middleware {
  handle(request) {
    console.log('ValidationMiddleware: Validating request...');
    
    if (!request.data) {
      throw new Error('Data required');
    }
    
    if (!request.data.title || !request.data.content) {
      throw new Error('Invalid data format');
    }
    
    console.log('ValidationMiddleware: Validation successful');
    return super.handle(request);
  }
}

class LoggingMiddleware extends Middleware {
  handle(request) {
    const timestamp = new Date().toISOString();
    console.log(`LoggingMiddleware: [${timestamp}] Processing request...`);
    
    const result = super.handle(request);
    
    console.log(`LoggingMiddleware: [${timestamp}] Request processed`);
    return result;
  }
}

// Usage
class Request {
  constructor(token, role, data) {
    this.token = token;
    this.role = role;
    this.data = data;
  }
}

// Create middleware chain
const middleware = new LoggingMiddleware();
middleware
  .setNext(new AuthenticationMiddleware())
  .setNext(new AuthorizationMiddleware())
  .setNext(new ValidationMiddleware());

// Test valid request
try {
  const validRequest = new Request(
    'valid-token',
    'admin',
    {
      title: 'New Post',
      content: 'Post content'
    }
  );
  
  console.log('\nProcessing valid request:');
  middleware.handle(validRequest);
} catch (error) {
  console.error('Error:', error.message);
}

// Test invalid authentication
try {
  const invalidAuthRequest = new Request(
    'invalid-token',
    'admin',
    {
      title: 'New Post',
      content: 'Post content'
    }
  );
  
  console.log('\nProcessing request with invalid token:');
  middleware.handle(invalidAuthRequest);
} catch (error) {
  console.error('Error:', error.message);
}

// Test invalid authorization
try {
  const invalidAuthzRequest = new Request(
    'valid-token',
    'user',
    {
      title: 'New Post',
      content: 'Post content'
    }
  );
  
  console.log('\nProcessing request with invalid role:');
  middleware.handle(invalidAuthzRequest);
} catch (error) {
  console.error('Error:', error.message);
}

// Test invalid data
try {
  const invalidDataRequest = new Request(
    'valid-token',
    'admin',
    {
      title: 'New Post'
      // Missing content
    }
  );
  
  console.log('\nProcessing request with invalid data:');
  middleware.handle(invalidDataRequest);
} catch (error) {
  console.error('Error:', error.message);
}
```

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ giúp triển khai Chain of Responsibility Pattern an toàn và rõ ràng hơn:

```typescript
// Event handling system
interface Event {
  type: string;
  data: any;
  handled: boolean;
}

abstract class EventHandler {
  protected nextHandler: EventHandler | null = null;
  
  setNext(handler: EventHandler): EventHandler {
    this.nextHandler = handler;
    return handler;
  }
  
  handle(event: Event): void {
    if (this.nextHandler) {
      this.nextHandler.handle(event);
    }
  }
  
  protected canHandle(eventType: string): boolean {
    return false;
  }
}

// Concrete handlers
class UserEventHandler extends EventHandler {
  protected canHandle(eventType: string): boolean {
    return eventType.startsWith('user:');
  }
  
  handle(event: Event): void {
    if (this.canHandle(event.type) && !event.handled) {
      console.log('UserEventHandler processing event:', event.type);
      
      switch (event.type) {
        case 'user:login':
          this.handleUserLogin(event.data);
          break;
        case 'user:logout':
          this.handleUserLogout(event.data);
          break;
        case 'user:update':
          this.handleUserUpdate(event.data);
          break;
        default:
          console.log('Unknown user event:', event.type);
      }
      
      event.handled = true;
    } else {
      super.handle(event);
    }
  }
  
  private handleUserLogin(data: any): void {
    console.log('Processing user login:', data);
  }
  
  private handleUserLogout(data: any): void {
    console.log('Processing user logout:', data);
  }
  
  private handleUserUpdate(data: any): void {
    console.log('Processing user update:', data);
  }
}

class ContentEventHandler extends EventHandler {
  protected canHandle(eventType: string): boolean {
    return eventType.startsWith('content:');
  }
  
  handle(event: Event): void {
    if (this.canHandle(event.type) && !event.handled) {
      console.log('ContentEventHandler processing event:', event.type);
      
      switch (event.type) {
        case 'content:create':
          this.handleContentCreate(event.data);
          break;
        case 'content:update':
          this.handleContentUpdate(event.data);
          break;
        case 'content:delete':
          this.handleContentDelete(event.data);
          break;
        default:
          console.log('Unknown content event:', event.type);
      }
      
      event.handled = true;
    } else {
      super.handle(event);
    }
  }
  
  private handleContentCreate(data: any): void {
    console.log('Processing content creation:', data);
  }
  
  private handleContentUpdate(data: any): void {
    console.log('Processing content update:', data);
  }
  
  private handleContentDelete(data: any): void {
    console.log('Processing content deletion:', data);
  }
}

class SystemEventHandler extends EventHandler {
  protected canHandle(eventType: string): boolean {
    return eventType.startsWith('system:');
  }
  
  handle(event: Event): void {
    if (this.canHandle(event.type) && !event.handled) {
      console.log('SystemEventHandler processing event:', event.type);
      
      switch (event.type) {
        case 'system:error':
          this.handleSystemError(event.data);
          break;
        case 'system:warning':
          this.handleSystemWarning(event.data);
          break;
        case 'system:info':
          this.handleSystemInfo(event.data);
          break;
        default:
          console.log('Unknown system event:', event.type);
      }
      
      event.handled = true;
    } else {
      super.handle(event);
    }
  }
  
  private handleSystemError(data: any): void {
    console.error('System error:', data);
  }
  
  private handleSystemWarning(data: any): void {
    console.warn('System warning:', data);
  }
  
  private handleSystemInfo(data: any): void {
    console.info('System info:', data);
  }
}

class DefaultEventHandler extends EventHandler {
  handle(event: Event): void {
    if (!event.handled) {
      console.log('DefaultEventHandler: Unhandled event:', event.type);
      event.handled = true;
    } else {
      super.handle(event);
    }
  }
}

// Event dispatcher
class EventDispatcher {
  private handler: EventHandler;
  
  constructor() {
    // Create the chain
    const userHandler = new UserEventHandler();
    const contentHandler = new ContentEventHandler();
    const systemHandler = new SystemEventHandler();
    const defaultHandler = new DefaultEventHandler();
    
    userHandler
      .setNext(contentHandler)
      .setNext(systemHandler)
      .setNext(defaultHandler);
    
    this.handler = userHandler;
  }
  
  dispatch(event: Event): void {
    this.handler.handle(event);
  }
}

// Usage
const dispatcher = new EventDispatcher();

// Dispatch various events
console.log('\nDispatching user events:');
dispatcher.dispatch({
  type: 'user:login',
  data: { userId: '123', username: 'john_doe' },
  handled: false
});

dispatcher.dispatch({
  type: 'user:update',
  data: { userId: '123', newEmail: 'john@example.com' },
  handled: false
});

console.log('\nDispatching content events:');
dispatcher.dispatch({
  type: 'content:create',
  data: { title: 'New Post', content: 'Post content' },
  handled: false
});

dispatcher.dispatch({
  type: 'content:update',
  data: { id: '456', title: 'Updated Post' },
  handled: false
});

console.log('\nDispatching system events:');
dispatcher.dispatch({
  type: 'system:error',
  data: { code: 500, message: 'Internal server error' },
  handled: false
});

dispatcher.dispatch({
  type: 'system:info',
  data: { message: 'System maintenance scheduled' },
  handled: false
});

console.log('\nDispatching unknown event:');
dispatcher.dispatch({
  type: 'unknown:event',
  data: { message: 'This is an unknown event' },
  handled: false
});
```

## 4. Ví dụ thực tế: Form Validation System

Hãy xem xét một ví dụ thực tế về việc sử dụng Chain of Responsibility Pattern để xây dựng hệ thống validation cho form:

```typescript
// Validation interfaces
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface ValidationContext {
  value: any;
  fieldName: string;
  formData: Record<string, any>;
}

// Base validator
abstract class Validator {
  protected nextValidator: Validator | null = null;
  
  setNext(validator: Validator): Validator {
    this.nextValidator = validator;
    return validator;
  }
  
  validate(context: ValidationContext): ValidationResult {
    const result = this.doValidate(context);
    
    if (this.nextValidator && result.isValid) {
      return this.nextValidator.validate(context);
    }
    
    return result;
  }
  
  protected abstract doValidate(context: ValidationContext): ValidationResult;
}

// Concrete validators
class RequiredValidator extends Validator {
  protected doValidate(context: ValidationContext): ValidationResult {
    if (context.value === undefined || context.value === null || context.value === '') {
      return {
        isValid: false,
        errors: [`${context.fieldName} is required`]
      };
    }
    
    return {
      isValid: true,
      errors: []
    };
  }
}

class TypeValidator extends Validator {
  constructor(private expectedType: string) {
    super();
  }
  
  protected doValidate(context: ValidationContext): ValidationResult {
    const actualType = typeof context.value;
    
    if (actualType !== this.expectedType) {
      return {
        isValid: false,
        errors: [`${context.fieldName} must be a ${this.expectedType}`]
      };
    }
    
    return {
      isValid: true,
      errors: []
    };
  }
}

class MinLengthValidator extends Validator {
  constructor(private minLength: number) {
    super();
  }
  
  protected doValidate(context: ValidationContext): ValidationResult {
    if (typeof context.value === 'string' && context.value.length < this.minLength) {
      return {
        isValid: false,
        errors: [`${context.fieldName} must be at least ${this.minLength} characters long`]
      };
    }
    
    return {
      isValid: true,
      errors: []
    };
  }
}

class MaxLengthValidator extends Validator {
  constructor(private maxLength: number) {
    super();
  }
  
  protected doValidate(context: ValidationContext): ValidationResult {
    if (typeof context.value === 'string' && context.value.length > this.maxLength) {
      return {
        isValid: false,
        errors: [`${context.fieldName} must be no more than ${this.maxLength} characters long`]
      };
    }
    
    return {
      isValid: true,
      errors: []
    };
  }
}

class EmailValidator extends Validator {
  protected doValidate(context: ValidationContext): ValidationResult {
    if (typeof context.value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(context.value)) {
        return {
          isValid: false,
          errors: [`${context.fieldName} must be a valid email address`]
        };
      }
    }
    
    return {
      isValid: true,
      errors: []
    };
  }
}

class PasswordValidator extends Validator {
  protected doValidate(context: ValidationContext): ValidationResult {
    if (typeof context.value === 'string') {
      const errors: string[] = [];
      
      if (!/[A-Z]/.test(context.value)) {
        errors.push(`${context.fieldName} must contain at least one uppercase letter`);
      }
      
      if (!/[a-z]/.test(context.value)) {
        errors.push(`${context.fieldName} must contain at least one lowercase letter`);
      }
      
      if (!/\d/.test(context.value)) {
        errors.push(`${context.fieldName} must contain at least one number`);
      }
      
      if (!/[!@#$%^&*]/.test(context.value)) {
        errors.push(`${context.fieldName} must contain at least one special character`);
      }
      
      if (errors.length > 0) {
        return {
          isValid: false,
          errors
        };
      }
    }
    
    return {
      isValid: true,
      errors: []
    };
  }
}

class ConfirmPasswordValidator extends Validator {
  protected doValidate(context: ValidationContext): ValidationResult {
    const password = context.formData.password;
    
    if (context.value !== password) {
      return {
        isValid: false,
        errors: [`${context.fieldName} must match password`]
      };
    }
    
    return {
      isValid: true,
      errors: []
    };
  }
}

// Form validator
class FormValidator {
  private validators: Map<string, Validator> = new Map();
  
  addFieldValidator(fieldName: string, validator: Validator): void {
    this.validators.set(fieldName, validator);
  }
  
  validate(formData: Record<string, any>): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    for (const [fieldName, validator] of this.validators.entries()) {
      const context: ValidationContext = {
        value: formData[fieldName],
        fieldName,
        formData
      };
      
      const result = validator.validate(context);
      
      if (!result.isValid) {
        errors[fieldName] = result.errors;
      }
    }
    
    return errors;
  }
}

// Usage
function createRegistrationFormValidator(): FormValidator {
  const formValidator = new FormValidator();
  
  // Username validation chain
  const usernameValidator = new RequiredValidator();
  usernameValidator
    .setNext(new TypeValidator('string'))
    .setNext(new MinLengthValidator(3))
    .setNext(new MaxLengthValidator(20));
  
  // Email validation chain
  const emailValidator = new RequiredValidator();
  emailValidator
    .setNext(new TypeValidator('string'))
    .setNext(new EmailValidator());
  
  // Password validation chain
  const passwordValidator = new RequiredValidator();
  passwordValidator
    .setNext(new TypeValidator('string'))
    .setNext(new MinLengthValidator(8))
    .setNext(new PasswordValidator());
  
  // Confirm password validation chain
  const confirmPasswordValidator = new RequiredValidator();
  confirmPasswordValidator
    .setNext(new TypeValidator('string'))
    .setNext(new ConfirmPasswordValidator());
  
  // Add validators to form
  formValidator.addFieldValidator('username', usernameValidator);
  formValidator.addFieldValidator('email', emailValidator);
  formValidator.addFieldValidator('password', passwordValidator);
  formValidator.addFieldValidator('confirmPassword', confirmPasswordValidator);
  
  return formValidator;
}

// Test the form validator
const formValidator = createRegistrationFormValidator();

console.log('\nTesting valid form data:');
const validFormData = {
  username: 'john_doe',
  email: 'john.doe@example.com',
  password: 'P@ssw0rd123',
  confirmPassword: 'P@ssw0rd123'
};
console.log('Validation errors:', formValidator.validate(validFormData));

console.log('\nTesting invalid form data:');
const invalidFormData = {
  username: 'a',
  email: 'invalid-email',
  password: 'weak',
  confirmPassword: 'different'
};
console.log('Validation errors:', formValidator.validate(invalidFormData));
```

## 5. Khi nào nên sử dụng Chain of Responsibility Pattern

Chain of Responsibility Pattern phù hợp trong các tình huống sau:

1. **Khi cần xử lý yêu cầu theo nhiều cách khác nhau**
2. **Khi không biết trước handler nào sẽ xử lý yêu cầu**
3. **Khi thứ tự xử lý là quan trọng**
4. **Khi tập hợp các handler có thể thay đổi động**
5. **Khi muốn tách rời người gửi và người nhận yêu cầu**

Ví dụ thực tế:
- Middleware trong web frameworks
- Event handling systems
- Form validation
- Logging systems
- Authentication và authorization

## 6. So sánh với các Pattern khác

### So sánh với Command Pattern

| Chain of Responsibility Pattern | Command Pattern |
|--------------------------------|----------------|
| Xử lý tuần tự | Xử lý độc lập |
| Chuyển tiếp yêu cầu | Đóng gói yêu cầu |
| Dynamic chain | Static commands |
| Focus on handlers | Focus on commands |

### So sánh với Observer Pattern

| Chain of Responsibility Pattern | Observer Pattern |
|--------------------------------|-----------------|
| Một handler xử lý | Nhiều observer nhận |
| Tuần tự | Đồng thời |
| Có thể dừng chuỗi | Tất cả đều nhận |
| One-to-one | One-to-many |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Giảm sự phụ thuộc** giữa người gửi và người nhận
- **Tuân thủ Single Responsibility Principle**
- **Linh hoạt trong việc thêm/bớt handler**
- **Kiểm soát thứ tự xử lý**
- **Dễ dàng mở rộng**

### Nhược điểm:
- **Yêu cầu có thể không được xử lý**
- **Khó debug** với chuỗi dài
- **Có thể tạo ra overhead**
- **Thứ tự handler quan trọng**
- **Có thể phức tạp hóa code**

## 8. Kết luận

Chain of Responsibility Pattern là một công cụ mạnh mẽ để xử lý yêu cầu theo chuỗi, cho phép bạn tách rời người gửi và người nhận yêu cầu. Pattern này đặc biệt hữu ích trong các tình huống cần xử lý yêu cầu theo nhiều cách khác nhau hoặc khi thứ tự xử lý là quan trọng.

Khi quyết định sử dụng Chain of Responsibility Pattern, hãy cân nhắc kỹ giữa lợi ích về tính linh hoạt và độ phức tạp của code. Pattern này có thể giúp tăng tính module hóa và khả năng mở rộng của hệ thống, nhưng cũng có thể làm cho code khó debug và maintain hơn.
