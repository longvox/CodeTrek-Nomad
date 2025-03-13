---
title: "Modern JS/TS Pattern [3/4] - Repository Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-08-27
description: "Repository Pattern là một mẫu thiết kế giúp tách biệt logic truy cập dữ liệu khỏi logic nghiệp vụ. Bài viết này phân tích cách triển khai Repository Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "repository-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Repository Pattern
  - Modern Patterns
---

## 1. Repository Pattern là gì?

Repository Pattern là một mẫu thiết kế tạo ra một lớp trung gian giữa tầng logic nghiệp vụ và tầng truy cập dữ liệu. Pattern này giúp:

- Tách biệt logic truy cập dữ liệu khỏi logic nghiệp vụ
- Cung cấp interface thống nhất cho việc truy cập dữ liệu
- Dễ dàng thay đổi nguồn dữ liệu mà không ảnh hưởng đến code nghiệp vụ
- Đơn giản hóa việc kiểm thử bằng cách mock repository

## 2. Triển khai trong TypeScript

### 2.1 Định nghĩa Interface và Model

```typescript
// User model
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Repository interface
interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
```

### 2.2 Triển khai Repository với SQLite

```typescript
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

class SQLiteUserRepository implements IUserRepository {
  private db: Database | null = null;

  constructor() {
    this.initializeDB();
  }

  private async initializeDB() {
    this.db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    });

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async findAll(): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const users = await this.db.all<User[]>('SELECT * FROM users');
    return users.map(user => ({
      ...user,
      createdAt: new Date(user.created_at)
    }));
  }

  async findById(id: number): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const user = await this.db.get<User>(
      'SELECT * FROM users WHERE id = ?',
      id
    );

    if (!user) return null;

    return {
      ...user,
      createdAt: new Date(user.created_at)
    };
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      userData.name,
      userData.email
    );

    const user = await this.findById(result.lastID!);
    if (!user) throw new Error('Failed to create user');
    
    return user;
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const existingUser = await this.findById(id);
    if (!existingUser) return null;

    const updates = Object.entries(userData)
      .filter(([key]) => key !== 'id' && key !== 'createdAt')
      .map(([key, value]) => `${key} = ?`)
      .join(', ');

    const values = Object.entries(userData)
      .filter(([key]) => key !== 'id' && key !== 'createdAt')
      .map(([_, value]) => value);

    await this.db.run(
      `UPDATE users SET ${updates} WHERE id = ?`,
      ...values,
      id
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(
      'DELETE FROM users WHERE id = ?',
      id
    );

    return result.changes > 0;
  }
}
```

### 2.3 Triển khai Repository với MongoDB

```typescript
import { MongoClient, Db, ObjectId } from 'mongodb';

class MongoUserRepository implements IUserRepository {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  constructor() {
    this.initializeDB();
  }

  private async initializeDB() {
    this.client = await MongoClient.connect('mongodb://localhost:27017');
    this.db = this.client.db('test');
  }

  async findAll(): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    const users = await this.db
      .collection('users')
      .find()
      .toArray();

    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }));
  }

  async findById(id: number): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const user = await this.db
      .collection('users')
      .findOne({ _id: new ObjectId(id) });

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.collection('users').insertOne({
      ...userData,
      createdAt: new Date()
    });

    const user = await this.findById(result.insertedId.toString());
    if (!user) throw new Error('Failed to create user');

    return user;
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: userData }
      );

    if (result.matchedCount === 0) return null;

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db
      .collection('users')
      .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0;
  }
}
```

## 3. Sử dụng Repository trong Service Layer

```typescript
class UserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(name: string, email: string): Promise<User> {
    // Validate input
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }

    // Create user
    return this.userRepository.create({ name, email });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate email if provided
    if (data.email && !data.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    return this.userRepository.update(id, data);
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return this.userRepository.delete(id);
  }
}
```

## 4. Kiểm thử với Mock Repository

```typescript
class MockUserRepository implements IUserRepository {
  private users: User[] = [];
  private nextId = 1;

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      id: this.nextId++,
      ...userData,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...userData
    };

    return this.users[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}

// Test cases
describe('UserService', () => {
  let userService: UserService;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    userService = new UserService(mockRepository);
  });

  it('should create a user', async () => {
    const user = await userService.createUser('John Doe', 'john@example.com');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });

  it('should throw error for invalid email', async () => {
    await expect(
      userService.createUser('John Doe', 'invalid-email')
    ).rejects.toThrow('Invalid email format');
  });

  it('should update a user', async () => {
    const user = await userService.createUser('John Doe', 'john@example.com');
    const updated = await userService.updateUser(user.id, { name: 'Jane Doe' });
    expect(updated?.name).toBe('Jane Doe');
  });

  it('should delete a user', async () => {
    const user = await userService.createUser('John Doe', 'john@example.com');
    const result = await userService.deleteUser(user.id);
    expect(result).toBe(true);
  });
});
```

## 5. Ưu điểm và Nhược điểm

### 5.1 Ưu điểm
- **Tách biệt quan tâm**: Logic truy cập dữ liệu được tách biệt khỏi logic nghiệp vụ
- **Dễ kiểm thử**: Có thể dễ dàng mock repository cho việc kiểm thử
- **Linh hoạt**: Dễ dàng thay đổi nguồn dữ liệu mà không ảnh hưởng đến code nghiệp vụ
- **Tái sử dụng**: Code truy cập dữ liệu có thể được tái sử dụng giữa các service

### 5.2 Nhược điểm
- **Phức tạp hóa**: Thêm một lớp trừu tượng có thể làm tăng độ phức tạp của code
- **Boilerplate**: Cần viết nhiều code hơn cho các interface và implementation
- **Hiệu suất**: Có thể tạo ra overhead nhỏ do thêm một lớp trừu tượng

## 6. Khi nào nên sử dụng Repository Pattern?

Repository Pattern phù hợp khi:
- Ứng dụng cần tương tác với nhiều nguồn dữ liệu khác nhau
- Cần tách biệt logic truy cập dữ liệu để dễ kiểm thử
- Muốn chuẩn hóa cách truy cập dữ liệu trong toàn bộ ứng dụng
- Có kế hoạch thay đổi nguồn dữ liệu trong tương lai

## 7. Kết luận

Repository Pattern là một mẫu thiết kế quan trọng trong việc tổ chức code truy cập dữ liệu. Pattern này giúp tách biệt logic truy cập dữ liệu khỏi logic nghiệp vụ, làm cho code dễ bảo trì và kiểm thử hơn. Trong TypeScript, việc sử dụng interface giúp định nghĩa rõ ràng contract của repository và đảm bảo type safety.
