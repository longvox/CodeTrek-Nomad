---
title: "Proxy Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-06-11
description: "Proxy Pattern là một mẫu thiết kế cấu trúc cho phép bạn cung cấp một đối tượng thay thế hoặc placeholder cho một đối tượng khác. Bài viết này phân tích cách triển khai Proxy Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "proxy-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Proxy
  - Structural Patterns
---

{{< sidenote >}}
Đây là bài viết thứ mười bốn trong series về các mẫu thiết kế trong JavaScript/TypeScript. Nếu bạn chưa đọc các bài trước, bạn có thể xem: [Giới thiệu về các mẫu thiết kế](/posts/gioi-thieu-ve-cac-mau-thiet-ke-javascript-typescript), [Singleton Pattern](/posts/singleton-pattern-trong-javascript-typescript), [Factory Method Pattern](/posts/factory-method-pattern-trong-javascript-typescript), [Abstract Factory Pattern](/posts/abstract-factory-pattern-trong-javascript-typescript), [Builder Pattern](/posts/builder-pattern-trong-javascript-typescript), [Prototype Pattern](/posts/prototype-pattern-trong-javascript-typescript), [Module Pattern](/posts/module-pattern-trong-javascript-typescript), [Adapter Pattern](/posts/adapter-pattern-trong-javascript-typescript), [Bridge Pattern](/posts/bridge-pattern-trong-javascript-typescript), [Composite Pattern](/posts/composite-pattern-trong-javascript-typescript), [Decorator Pattern](/posts/decorator-pattern-trong-javascript-typescript), [Facade Pattern](/posts/facade-pattern-trong-javascript-typescript) và [Flyweight Pattern](/posts/flyweight-pattern-trong-javascript-typescript).
{{< /sidenote >}}

Trong bài viết trước, chúng ta đã tìm hiểu về Flyweight Pattern - một mẫu thiết kế cấu trúc giúp tối ưu hóa việc sử dụng bộ nhớ khi làm việc với một số lượng lớn các đối tượng. Hôm nay, mình sẽ giới thiệu về Proxy Pattern - một mẫu thiết kế cấu trúc khác giúp kiểm soát truy cập đến đối tượng.

## 1. Proxy Pattern là gì?

Proxy Pattern là một mẫu thiết kế cấu trúc cho phép bạn cung cấp một đối tượng thay thế hoặc placeholder cho một đối tượng khác. Proxy kiểm soát truy cập đến đối tượng gốc, cho phép bạn thực hiện một số xử lý trước hoặc sau khi yêu cầu được chuyển đến đối tượng gốc.

Các thành phần chính trong Proxy Pattern:
- **Subject**: Interface chung cho RealSubject và Proxy
- **RealSubject**: Đối tượng thực mà Proxy đại diện
- **Proxy**: Đối tượng thay thế, duy trì tham chiếu đến RealSubject
- **Client**: Sử dụng Proxy để tương tác với RealSubject

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ cơ bản về Image Loading

```javascript
// Subject interface
class Image {
  display() {
    throw new Error('display() must be implemented');
  }
}

// RealSubject
class RealImage extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.loadFromDisk();
  }
  
  loadFromDisk() {
    console.log(`Loading ${this.filename} from disk...`);
    // Simulate loading delay
    const start = Date.now();
    while (Date.now() - start < 1000) {} // Wait 1 second
  }
  
  display() {
    console.log(`Displaying ${this.filename}`);
  }
}

// Proxy
class ProxyImage extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.realImage = null;
  }
  
  display() {
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

// Usage
console.log('Creating image proxies...');
const image1 = new ProxyImage('photo1.jpg');
const image2 = new ProxyImage('photo2.jpg');

console.log('Images will be loaded only when needed...');
image1.display(); // Loading will happen now
image1.display(); // Loading will not happen, already loaded
image2.display(); // Loading will happen now
```

### 2.2 Ví dụ về API Cache

```javascript
// Subject interface
class APIClient {
  async fetch(url) {
    throw new Error('fetch() must be implemented');
  }
}

// RealSubject
class RealAPIClient extends APIClient {
  async fetch(url) {
    console.log(`Fetching data from ${url}...`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: `Response from ${url}`,
      timestamp: Date.now()
    };
  }
}

// Proxy
class CachedAPIClient extends APIClient {
  constructor(expireTime = 60000) { // 1 minute by default
    super();
    this.realClient = new RealAPIClient();
    this.cache = new Map();
    this.expireTime = expireTime;
  }
  
  async fetch(url) {
    const cached = this.cache.get(url);
    const now = Date.now();
    
    if (cached && now - cached.timestamp < this.expireTime) {
      console.log(`Returning cached data for ${url}`);
      return cached;
    }
    
    const response = await this.realClient.fetch(url);
    this.cache.set(url, response);
    return response;
  }
  
  clearCache() {
    this.cache.clear();
    console.log('Cache cleared');
  }
}

// Usage
async function main() {
  const client = new CachedAPIClient(5000); // 5 seconds cache
  
  console.log('First request - will fetch from API');
  await client.fetch('https://api.example.com/data');
  
  console.log('\nSecond request - will use cache');
  await client.fetch('https://api.example.com/data');
  
  console.log('\nWaiting 6 seconds...');
  await new Promise(resolve => setTimeout(resolve, 6000));
  
  console.log('\nThird request - cache expired, will fetch from API');
  await client.fetch('https://api.example.com/data');
}

main();
```

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ giúp triển khai Proxy Pattern an toàn và rõ ràng hơn:

```typescript
// Property validation example
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Subject interface
interface UserService {
  getUser(id: number): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
}

// RealSubject
class RealUserService implements UserService {
  private users: Map<number, User> = new Map();
  
  constructor() {
    // Initialize with some dummy data
    this.users.set(1, {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
  }
  
  async getUser(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
}

// Proxy
class UserServiceProxy implements UserService {
  private service: RealUserService;
  
  constructor() {
    this.service = new RealUserService();
  }
  
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  private validateAge(age: number): boolean {
    return age >= 0 && age <= 120;
  }
  
  private validateName(name: string): boolean {
    return name.length >= 2 && name.length <= 50;
  }
  
  async getUser(id: number): Promise<User> {
    console.log(`[Proxy] Getting user ${id}`);
    return this.service.getUser(id);
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    console.log(`[Proxy] Validating update for user ${id}`);
    
    // Validate email
    if (data.email !== undefined) {
      if (!this.validateEmail(data.email)) {
        throw new Error('Invalid email format');
      }
    }
    
    // Validate age
    if (data.age !== undefined) {
      if (!this.validateAge(data.age)) {
        throw new Error('Invalid age value');
      }
    }
    
    // Validate name
    if (data.name !== undefined) {
      if (!this.validateName(data.name)) {
        throw new Error('Invalid name length');
      }
    }
    
    console.log('[Proxy] Validation passed, updating user');
    return this.service.updateUser(id, data);
  }
}

// Usage
async function main() {
  const userService = new UserServiceProxy();
  
  try {
    // Get user
    const user = await userService.getUser(1);
    console.log('Current user:', user);
    
    // Try to update with valid data
    const updatedUser = await userService.updateUser(1, {
      name: 'John Smith',
      email: 'john.smith@example.com',
      age: 31
    });
    console.log('Updated user:', updatedUser);
    
    // Try to update with invalid email
    await userService.updateUser(1, {
      email: 'invalid-email'
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  try {
    // Try to update with invalid age
    await userService.updateUser(1, {
      age: 150
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  try {
    // Try to update with invalid name
    await userService.updateUser(1, {
      name: 'A'
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

## 4. Ví dụ thực tế: Lazy Loading và Access Control

Hãy xem xét một ví dụ thực tế về việc sử dụng Proxy Pattern để triển khai lazy loading và kiểm soát truy cập trong một hệ thống quản lý tài liệu:

```typescript
// Document types and interfaces
interface Document {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface DocumentService {
  getDocument(id: string): Promise<Document>;
  updateDocument(id: string, content: string): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
}

// Real document service
class RealDocumentService implements DocumentService {
  private documents: Map<string, Document> = new Map();
  
  constructor() {
    // Initialize with sample document
    this.documents.set('doc1', {
      id: 'doc1',
      title: 'Important Document',
      content: 'This is a very important document with sensitive information.',
      author: 'John Doe',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    });
  }
  
  async getDocument(id: string): Promise<Document> {
    console.log(`[RealService] Loading document ${id} from database...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate DB delay
    
    const document = this.documents.get(id);
    if (!document) {
      throw new Error(`Document ${id} not found`);
    }
    
    return document;
  }
  
  async updateDocument(id: string, content: string): Promise<Document> {
    console.log(`[RealService] Updating document ${id}...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate DB delay
    
    const document = this.documents.get(id);
    if (!document) {
      throw new Error(`Document ${id} not found`);
    }
    
    const updatedDocument = {
      ...document,
      content,
      updatedAt: new Date()
    };
    
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: string): Promise<void> {
    console.log(`[RealService] Deleting document ${id}...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate DB delay
    
    if (!this.documents.has(id)) {
      throw new Error(`Document ${id} not found`);
    }
    
    this.documents.delete(id);
  }
}

// Authentication service
class AuthService {
  private currentUser: string | null = null;
  private userPermissions: Map<string, DocumentPermissions> = new Map();
  
  constructor() {
    // Initialize with sample permissions
    this.userPermissions.set('user1', {
      canView: true,
      canEdit: true,
      canDelete: false
    });
    
    this.userPermissions.set('user2', {
      canView: true,
      canEdit: false,
      canDelete: false
    });
  }
  
  login(userId: string): void {
    this.currentUser = userId;
    console.log(`[Auth] User ${userId} logged in`);
  }
  
  logout(): void {
    this.currentUser = null;
    console.log('[Auth] User logged out');
  }
  
  getCurrentUser(): string | null {
    return this.currentUser;
  }
  
  getPermissions(userId: string): DocumentPermissions {
    const permissions = this.userPermissions.get(userId);
    if (!permissions) {
      return {
        canView: false,
        canEdit: false,
        canDelete: false
      };
    }
    return permissions;
  }
}

// Proxy with lazy loading and access control
class DocumentServiceProxy implements DocumentService {
  private realService: RealDocumentService;
  private authService: AuthService;
  private documentCache: Map<string, Document>;
  
  constructor(authService: AuthService) {
    this.realService = new RealDocumentService();
    this.authService = authService;
    this.documentCache = new Map();
  }
  
  private checkAccess(operation: 'view' | 'edit' | 'delete'): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }
    
    const permissions = this.authService.getPermissions(currentUser);
    
    switch (operation) {
      case 'view':
        if (!permissions.canView) {
          throw new Error('No permission to view document');
        }
        break;
      case 'edit':
        if (!permissions.canEdit) {
          throw new Error('No permission to edit document');
        }
        break;
      case 'delete':
        if (!permissions.canDelete) {
          throw new Error('No permission to delete document');
        }
        break;
    }
  }
  
  async getDocument(id: string): Promise<Document> {
    console.log(`[Proxy] Getting document ${id}`);
    this.checkAccess('view');
    
    // Check cache first
    const cachedDocument = this.documentCache.get(id);
    if (cachedDocument) {
      console.log(`[Proxy] Returning cached document ${id}`);
      return cachedDocument;
    }
    
    // Load from real service and cache
    const document = await this.realService.getDocument(id);
    this.documentCache.set(id, document);
    return document;
  }
  
  async updateDocument(id: string, content: string): Promise<Document> {
    console.log(`[Proxy] Updating document ${id}`);
    this.checkAccess('edit');
    
    // Update in real service
    const updatedDocument = await this.realService.updateDocument(id, content);
    
    // Update cache
    this.documentCache.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: string): Promise<void> {
    console.log(`[Proxy] Deleting document ${id}`);
    this.checkAccess('delete');
    
    // Delete from real service
    await this.realService.deleteDocument(id);
    
    // Remove from cache
    this.documentCache.delete(id);
  }
  
  clearCache(): void {
    this.documentCache.clear();
    console.log('[Proxy] Cache cleared');
  }
}

// Usage
async function main() {
  const authService = new AuthService();
  const documentService = new DocumentServiceProxy(authService);
  
  // Try to access without authentication
  try {
    await documentService.getDocument('doc1');
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Login as user with view-only permissions
  authService.login('user2');
  
  try {
    // Should work (has view permission)
    const doc = await documentService.getDocument('doc1');
    console.log('Document:', doc);
    
    // Should fail (no edit permission)
    await documentService.updateDocument('doc1', 'Updated content');
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Login as user with edit permissions
  authService.login('user1');
  
  try {
    // Should work (has view permission)
    const doc = await documentService.getDocument('doc1');
    console.log('Document:', doc);
    
    // Should work (has edit permission)
    const updatedDoc = await documentService.updateDocument(
      'doc1',
      'Updated content by user1'
    );
    console.log('Updated document:', updatedDoc);
    
    // Should fail (no delete permission)
    await documentService.deleteDocument('doc1');
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Clear cache
  documentService.clearCache();
  
  // Logout
  authService.logout();
}

main();
```

## 5. Khi nào nên sử dụng Proxy Pattern

Proxy Pattern phù hợp trong các tình huống sau:

1. **Lazy initialization (Virtual Proxy)**
2. **Access control (Protection Proxy)**
3. **Logging và monitoring (Logging Proxy)**
4. **Caching (Cache Proxy)**
5. **Remote resource access (Remote Proxy)**

Ví dụ thực tế:
- Lazy loading images
- API caching
- Access control systems
- Virtual file systems
- Remote service proxies

## 6. So sánh với các Pattern khác

### So sánh với Decorator Pattern

| Proxy Pattern | Decorator Pattern |
|--------------|------------------|
| Kiểm soát truy cập | Thêm chức năng |
| Không thay đổi interface | Mở rộng interface |
| Một lớp wrapper | Nhiều lớp wrapper |
| Focus on access | Focus on functionality |

### So sánh với Adapter Pattern

| Proxy Pattern | Adapter Pattern |
|--------------|----------------|
| Cùng interface | Khác interface |
| Kiểm soát truy cập | Chuyển đổi interface |
| Không thay đổi hành vi | Thay đổi hành vi |
| Same domain | Different domains |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Kiểm soát truy cập** chặt chẽ
- **Lazy loading** hiệu quả
- **Caching** và logging dễ dàng
- **Tách biệt concerns**
- **Tuân thủ Open/Closed Principle**

### Nhược điểm:
- **Tăng độ phức tạp** của code
- **Có thể ảnh hưởng hiệu năng**
- **Khó debug** với nhiều proxy
- **Có thể gây nhầm lẫn** với các pattern khác
- **Khó maintain** nếu logic phức tạp

## 8. Kết luận

Proxy Pattern là một công cụ mạnh mẽ để kiểm soát truy cập đến đối tượng và thêm các chức năng phụ trợ như caching, logging, hoặc lazy loading. Pattern này đặc biệt hữu ích trong các tình huống cần bảo vệ đối tượng, tối ưu hiệu năng, hoặc thêm các chức năng cross-cutting.

Khi quyết định sử dụng Proxy Pattern, hãy cân nhắc kỹ giữa lợi ích về kiểm soát truy cập và độ phức tạp của code. Pattern này có thể giúp tăng tính bảo mật và hiệu năng của hệ thống, nhưng cũng có thể làm cho code khó hiểu và maintain hơn.

Trong bài viết tiếp theo, chúng ta sẽ bắt đầu tìm hiểu về các mẫu thiết kế hành vi (Behavioral Patterns), bắt đầu với Chain of Responsibility Pattern - một mẫu thiết kế giúp xử lý yêu cầu theo chuỗi.

## Tài liệu tham khảo

1. Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design Patterns: Elements of Reusable Object-Oriented Software.
2. Osmani, A. (2017). Learning JavaScript Design Patterns.
3. Freeman, E., Robson, E., Sierra, K., & Bates, B. (2004). Head First Design Patterns.
4. TypeScript Documentation: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
5. Refactoring Guru - Proxy Pattern: [https://refactoring.guru/design-patterns/proxy](https://refactoring.guru/design-patterns/proxy) 