---
title: "Mediator Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-06-11
description: "Mediator Pattern là một mẫu thiết kế hành vi giúp giảm sự phụ thuộc giữa các đối tượng bằng cách tập trung xử lý tương tác vào một đối tượng trung gian. Bài viết này phân tích cách triển khai Mediator Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "mediator-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Mediator
  - Behavioral Patterns
---

{{< sidenote >}}
Đây là bài viết thứ mười bốn trong series về các mẫu thiết kế trong JavaScript/TypeScript. Nếu bạn chưa đọc các bài trước, bạn có thể xem: [Giới thiệu về các mẫu thiết kế](/posts/gioi-thieu-ve-cac-mau-thiet-ke), [Singleton Pattern](/posts/singleton-pattern-trong-javascript-typescript), [Factory Method Pattern](/posts/factory-method-pattern-trong-javascript-typescript), [Abstract Factory Pattern](/posts/abstract-factory-pattern-trong-javascript-typescript), [Builder Pattern](/posts/builder-pattern-trong-javascript-typescript), [Prototype Pattern](/posts/prototype-pattern-trong-javascript-typescript), [Module Pattern](/posts/module-pattern-trong-javascript-typescript), [Adapter Pattern](/posts/adapter-pattern-trong-javascript-typescript), [Bridge Pattern](/posts/bridge-pattern-trong-javascript-typescript), [Facade Pattern](/posts/facade-pattern-trong-javascript-typescript), [Composite Pattern](/posts/composite-pattern-trong-javascript-typescript), [Decorator Pattern](/posts/decorator-pattern-trong-javascript-typescript), [Interpreter Pattern](/posts/interpreter-pattern-trong-javascript-typescript) và [Iterator Pattern](/posts/iterator-pattern-trong-javascript-typescript).
{{< /sidenote >}}

Trong bài viết trước, chúng ta đã tìm hiểu về Iterator Pattern - một mẫu thiết kế hành vi cho phép duyệt qua các phần tử của một tập hợp mà không cần biết về cấu trúc bên trong của nó. Hôm nay, mình sẽ giới thiệu về Mediator Pattern - một mẫu thiết kế hành vi khác giúp giảm sự phụ thuộc giữa các đối tượng bằng cách tập trung xử lý tương tác vào một đối tượng trung gian.

## 1. Mediator Pattern là gì?

Mediator Pattern là một mẫu thiết kế hành vi cho phép giảm sự phụ thuộc lẫn nhau giữa các đối tượng bằng cách tập trung xử lý tương tác vào một đối tượng trung gian. Pattern này giúp các đối tượng không cần biết về sự tồn tại của nhau, thay vào đó chúng chỉ cần giao tiếp thông qua mediator.

Các thành phần chính trong Mediator Pattern:
- **Mediator**: Interface định nghĩa các phương thức giao tiếp giữa các đối tượng
- **ConcreteMediator**: Triển khai Mediator interface và điều phối tương tác giữa các đối tượng
- **Colleague**: Interface cho các đối tượng tham gia tương tác
- **ConcreteColleague**: Triển khai Colleague interface và giao tiếp thông qua mediator

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về Chat Room

```javascript
// Mediator
class ChatRoom {
  constructor() {
    this.users = new Map();
  }

  register(user) {
    this.users.set(user.name, user);
    user.chatRoom = this;
  }

  send(message, from, to) {
    if (to) {
      // Private message
      const receiver = this.users.get(to);
      if (receiver) {
        receiver.receive(message, from);
      }
    } else {
      // Broadcast message
      this.users.forEach(user => {
        if (user.name !== from) {
          user.receive(message, from);
        }
      });
    }
  }
}

// Colleague
class User {
  constructor(name) {
    this.name = name;
    this.chatRoom = null;
  }

  send(message, to = null) {
    console.log(`${this.name} sends message: ${message}`);
    this.chatRoom.send(message, this.name, to);
  }

  receive(message, from) {
    console.log(`${this.name} receives message from ${from}: ${message}`);
  }
}

// Usage
const chatRoom = new ChatRoom();

const john = new User('John');
const jane = new User('Jane');
const bob = new User('Bob');

chatRoom.register(john);
chatRoom.register(jane);
chatRoom.register(bob);

john.send('Hello everyone!');
jane.send('Hi John!', 'John');
bob.send('Hey guys!');
```

### 2.2 Ví dụ về Air Traffic Control

```javascript
// Mediator
class AirTrafficControl {
  constructor() {
    this.aircraft = new Map();
  }

  register(aircraft) {
    this.aircraft.set(aircraft.id, aircraft);
    aircraft.atc = this;
  }

  requestLanding(aircraft) {
    const otherAircraft = Array.from(this.aircraft.values())
      .filter(a => a.id !== aircraft.id);
    
    const isSafeToLand = otherAircraft.every(a => 
      Math.abs(a.altitude - aircraft.altitude) > 1000
    );

    if (isSafeToLand) {
      aircraft.land();
      this.notifyOthers(`Aircraft ${aircraft.id} is landing`, aircraft.id);
    } else {
      aircraft.wait();
      this.notifyOthers(`Aircraft ${aircraft.id} is waiting to land`, aircraft.id);
    }
  }

  notifyOthers(message, excludeId) {
    this.aircraft.forEach((aircraft, id) => {
      if (id !== excludeId) {
        aircraft.receive(message);
      }
    });
  }
}

// Colleague
class Aircraft {
  constructor(id) {
    this.id = id;
    this.altitude = Math.floor(Math.random() * 10000);
    this.atc = null;
  }

  requestLanding() {
    console.log(`Aircraft ${this.id} requesting landing permission`);
    this.atc.requestLanding(this);
  }

  land() {
    console.log(`Aircraft ${this.id} landing`);
    this.altitude = 0;
  }

  wait() {
    console.log(`Aircraft ${this.id} holding position`);
  }

  receive(message) {
    console.log(`Aircraft ${this.id} receives message: ${message}`);
  }
}

// Usage
const atc = new AirTrafficControl();

const flight1 = new Aircraft('AA123');
const flight2 = new Aircraft('BA456');
const flight3 = new Aircraft('UA789');

atc.register(flight1);
atc.register(flight2);
atc.register(flight3);

flight1.requestLanding();
flight2.requestLanding();
flight3.requestLanding();
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về Event Bus

```typescript
// Event types
type EventType = string;
type EventHandler = (data: any) => void;

// Mediator interface
interface EventBus {
  subscribe(event: EventType, handler: EventHandler): void;
  unsubscribe(event: EventType, handler: EventHandler): void;
  publish(event: EventType, data: any): void;
}

// Concrete Mediator
class ApplicationEventBus implements EventBus {
  private handlers: Map<EventType, Set<EventHandler>>;

  constructor() {
    this.handlers = new Map();
  }

  subscribe(event: EventType, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  unsubscribe(event: EventType, handler: EventHandler): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
    }
  }

  publish(event: EventType, data: any): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.forEach(handler => handler(data));
    }
  }
}

// Components using the Event Bus
class UserService {
  constructor(private eventBus: EventBus) {}

  login(username: string, password: string): void {
    // Simulate login
    console.log(`User ${username} logging in...`);
    this.eventBus.publish('userLoggedIn', { username });
  }

  logout(username: string): void {
    console.log(`User ${username} logging out...`);
    this.eventBus.publish('userLoggedOut', { username });
  }
}

class NotificationService {
  constructor(private eventBus: EventBus) {
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    this.eventBus.subscribe('userLoggedIn', this.handleUserLogin.bind(this));
    this.eventBus.subscribe('userLoggedOut', this.handleUserLogout.bind(this));
  }

  private handleUserLogin(data: { username: string }): void {
    console.log(`Notification: Welcome back, ${data.username}!`);
  }

  private handleUserLogout(data: { username: string }): void {
    console.log(`Notification: Goodbye, ${data.username}!`);
  }
}

class AuditService {
  constructor(private eventBus: EventBus) {
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    this.eventBus.subscribe('userLoggedIn', this.logActivity.bind(this));
    this.eventBus.subscribe('userLoggedOut', this.logActivity.bind(this));
  }

  private logActivity(data: { username: string }): void {
    const timestamp = new Date().toISOString();
    console.log(`Audit Log [${timestamp}]: User activity recorded for ${data.username}`);
  }
}

// Usage
const eventBus = new ApplicationEventBus();
const userService = new UserService(eventBus);
const notificationService = new NotificationService(eventBus);
const auditService = new AuditService(eventBus);

userService.login('john.doe', 'password123');
userService.logout('john.doe');
```

### 3.2 Ví dụ về Form Validation

```typescript
// Mediator interface
interface FormMediator {
  notify(sender: FormComponent, event: string): void;
  validateForm(): boolean;
}

// Base component
abstract class FormComponent {
  protected mediator: FormMediator;
  protected value: string = '';

  constructor(mediator: FormMediator) {
    this.mediator = mediator;
  }

  setValue(value: string): void {
    this.value = value;
    this.mediator.notify(this, 'valueChanged');
  }

  getValue(): string {
    return this.value;
  }

  abstract validate(): boolean;
}

// Concrete components
class UsernameField extends FormComponent {
  validate(): boolean {
    return this.value.length >= 3;
  }
}

class EmailField extends FormComponent {
  validate(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
  }
}

class PasswordField extends FormComponent {
  validate(): boolean {
    return this.value.length >= 8;
  }
}

class ConfirmPasswordField extends FormComponent {
  validate(): boolean {
    const passwordField = (this.mediator as RegistrationFormMediator).getPasswordField();
    return this.value === passwordField.getValue();
  }
}

// Concrete mediator
class RegistrationFormMediator implements FormMediator {
  private username: UsernameField;
  private email: EmailField;
  private password: PasswordField;
  private confirmPassword: ConfirmPasswordField;
  private submitButton: HTMLButtonElement;

  constructor() {
    this.username = new UsernameField(this);
    this.email = new EmailField(this);
    this.password = new PasswordField(this);
    this.confirmPassword = new ConfirmPasswordField(this);
    this.submitButton = document.createElement('button');
  }

  notify(sender: FormComponent, event: string): void {
    if (event === 'valueChanged') {
      this.validateForm();
    }
  }

  validateForm(): boolean {
    const isValid = this.username.validate() &&
      this.email.validate() &&
      this.password.validate() &&
      this.confirmPassword.validate();

    this.submitButton.disabled = !isValid;
    return isValid;
  }

  getPasswordField(): PasswordField {
    return this.password;
  }

  setFormValues(data: {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  }): void {
    this.username.setValue(data.username);
    this.email.setValue(data.email);
    this.password.setValue(data.password);
    this.confirmPassword.setValue(data.confirmPassword);
  }
}

// Usage
const formMediator = new RegistrationFormMediator();

formMediator.setFormValues({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123'
});

console.log('Form is valid:', formMediator.validateForm());
```

## 4. Trường hợp sử dụng thực tế

### 4.1 Quản lý Giao tiếp trong Game

```typescript
interface GameMediator {
  notify(sender: GameObject, event: GameEvent): void;
}

interface GameEvent {
  type: string;
  data: any;
}

abstract class GameObject {
  protected mediator: GameMediator;
  protected position: { x: number; y: number };

  constructor(mediator: GameMediator, x: number, y: number) {
    this.mediator = mediator;
    this.position = { x, y };
  }

  abstract update(): void;
}

class Player extends GameObject {
  private health: number = 100;

  update(): void {
    // Player logic
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    this.mediator.notify(this, {
      type: 'playerDamaged',
      data: { health: this.health }
    });

    if (this.health <= 0) {
      this.mediator.notify(this, {
        type: 'playerDied',
        data: null
      });
    }
  }
}

class Enemy extends GameObject {
  private isActive: boolean = true;

  update(): void {
    if (this.isActive) {
      // Check collision with player
      this.mediator.notify(this, {
        type: 'enemyAttack',
        data: { position: this.position }
      });
    }
  }

  destroy(): void {
    this.isActive = false;
    this.mediator.notify(this, {
      type: 'enemyDestroyed',
      data: { position: this.position }
    });
  }
}

class GameUI {
  updateHealth(health: number): void {
    console.log(`Health updated: ${health}`);
  }

  showGameOver(): void {
    console.log('Game Over!');
  }
}

class ScoreSystem {
  private score: number = 0;

  addScore(points: number): void {
    this.score += points;
    console.log(`Score: ${this.score}`);
  }
}

class GameDirector implements GameMediator {
  private player: Player;
  private enemies: Enemy[] = [];
  private ui: GameUI;
  private scoreSystem: ScoreSystem;

  constructor() {
    this.ui = new GameUI();
    this.scoreSystem = new ScoreSystem();
    this.player = new Player(this, 0, 0);

    // Create some enemies
    for (let i = 0; i < 3; i++) {
      this.enemies.push(new Enemy(this, i * 100, i * 100));
    }
  }

  notify(sender: GameObject, event: GameEvent): void {
    switch (event.type) {
      case 'playerDamaged':
        this.ui.updateHealth(event.data.health);
        break;

      case 'playerDied':
        this.ui.showGameOver();
        break;

      case 'enemyAttack':
        this.handleEnemyAttack(sender as Enemy, event.data);
        break;

      case 'enemyDestroyed':
        this.scoreSystem.addScore(100);
        break;
    }
  }

  private handleEnemyAttack(enemy: Enemy, data: any): void {
    // Check if player is in range
    const distance = Math.sqrt(
      Math.pow(this.player.position.x - data.position.x, 2) +
      Math.pow(this.player.position.y - data.position.y, 2)
    );

    if (distance < 50) {
      this.player.takeDamage(10);
    }
  }

  update(): void {
    this.player.update();
    this.enemies.forEach(enemy => enemy.update());
  }
}

// Usage
const game = new GameDirector();

// Simulate game loop
game.update();

// Simulate enemy being destroyed
const enemy = game['enemies'][0];
enemy.destroy();
```

### 4.2 Quản lý Workflow

```typescript
interface WorkflowMediator {
  notify(sender: WorkflowComponent, event: string, data?: any): void;
}

abstract class WorkflowComponent {
  constructor(protected mediator: WorkflowMediator) {}

  abstract execute(): void;
}

class DataValidator extends WorkflowComponent {
  execute(): void {
    console.log('Validating data...');
    // Simulate validation
    const isValid = Math.random() > 0.1;
    
    if (isValid) {
      this.mediator.notify(this, 'validationComplete');
    } else {
      this.mediator.notify(this, 'validationFailed', {
        error: 'Invalid data format'
      });
    }
  }
}

class DataTransformer extends WorkflowComponent {
  execute(): void {
    console.log('Transforming data...');
    // Simulate transformation
    const success = Math.random() > 0.1;

    if (success) {
      this.mediator.notify(this, 'transformationComplete');
    } else {
      this.mediator.notify(this, 'transformationFailed', {
        error: 'Transformation error'
      });
    }
  }
}

class DataPersistence extends WorkflowComponent {
  execute(): void {
    console.log('Saving data...');
    // Simulate saving
    const success = Math.random() > 0.1;

    if (success) {
      this.mediator.notify(this, 'saveComplete');
    } else {
      this.mediator.notify(this, 'saveFailed', {
        error: 'Database error'
      });
    }
  }
}

class NotificationService extends WorkflowComponent {
  execute(): void {
    // This component only handles notifications
  }

  sendNotification(message: string): void {
    console.log(`Notification: ${message}`);
  }
}

class WorkflowOrchestrator implements WorkflowMediator {
  private validator: DataValidator;
  private transformer: DataTransformer;
  private persistence: DataPersistence;
  private notificationService: NotificationService;

  constructor() {
    this.validator = new DataValidator(this);
    this.transformer = new DataTransformer(this);
    this.persistence = new DataPersistence(this);
    this.notificationService = new NotificationService(this);
  }

  notify(sender: WorkflowComponent, event: string, data?: any): void {
    switch (event) {
      case 'validationComplete':
        this.notificationService.sendNotification('Validation successful');
        this.transformer.execute();
        break;

      case 'validationFailed':
        this.notificationService.sendNotification(
          `Validation failed: ${data.error}`
        );
        break;

      case 'transformationComplete':
        this.notificationService.sendNotification('Transformation successful');
        this.persistence.execute();
        break;

      case 'transformationFailed':
        this.notificationService.sendNotification(
          `Transformation failed: ${data.error}`
        );
        break;

      case 'saveComplete':
        this.notificationService.sendNotification('Save successful');
        break;

      case 'saveFailed':
        this.notificationService.sendNotification(
          `Save failed: ${data.error}`
        );
        break;
    }
  }

  startWorkflow(): void {
    this.validator.execute();
  }
}

// Usage
const workflow = new WorkflowOrchestrator();
workflow.startWorkflow();
```

## 5. Ưu điểm và Nhược điểm

### 5.1 Ưu điểm
1. **Giảm sự phụ thuộc**: Các đối tượng không cần biết về nhau, chỉ cần biết về mediator.
2. **Dễ bảo trì**: Tập trung logic tương tác vào một nơi, dễ dàng thay đổi và bảo trì.
3. **Tái sử dụng**: Các đối tượng có thể được tái sử dụng trong các ngữ cảnh khác nhau.

### 5.2 Nhược điểm
1. **Phức tạp hóa**: Mediator có thể trở nên phức tạp khi số lượng đối tượng tăng lên.
2. **Single Point of Failure**: Nếu mediator gặp vấn đề, toàn bộ hệ thống có thể bị ảnh hưởng.
3. **Hiệu năng**: Có thể tạo ra overhead khi tất cả tương tác phải thông qua mediator.

## 6. Kết luận

Mediator Pattern là một công cụ mạnh mẽ để quản lý tương tác giữa các đối tượng trong hệ thống phức tạp. Pattern này đặc biệt hữu ích trong các ứng dụng có nhiều thành phần tương tác với nhau như giao diện người dùng, hệ thống game, hoặc các workflow phức tạp. JavaScript và TypeScript cung cấp nhiều tính năng giúp triển khai pattern này một cách hiệu quả.

Trong bài viết tiếp theo, chúng ta sẽ tìm hiểu về Memento Pattern - một mẫu thiết kế hành vi khác giúp lưu trữ và khôi phục trạng thái của đối tượng mà không vi phạm nguyên tắc đóng gói. 