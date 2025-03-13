---
title: "State Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-07-16
description: "State Pattern là một mẫu thiết kế hành vi cho phép một đối tượng thay đổi hành vi của nó khi trạng thái nội bộ thay đổi. Bài viết này phân tích cách triển khai State Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "state-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - State
  - Behavioral Patterns
---

{{< sidenote >}}
Đây là bài viết thứ mười bảy trong series về các mẫu thiết kế trong JavaScript/TypeScript. Nếu bạn chưa đọc các bài trước, bạn có thể xem: [Giới thiệu về các mẫu thiết kế](/posts/gioi-thieu-ve-cac-mau-thiet-ke), [Singleton Pattern](/posts/singleton-pattern-trong-javascript-typescript), [Factory Method Pattern](/posts/factory-method-pattern-trong-javascript-typescript), [Abstract Factory Pattern](/posts/abstract-factory-pattern-trong-javascript-typescript), [Builder Pattern](/posts/builder-pattern-trong-javascript-typescript), [Prototype Pattern](/posts/prototype-pattern-trong-javascript-typescript), [Module Pattern](/posts/module-pattern-trong-javascript-typescript), [Adapter Pattern](/posts/adapter-pattern-trong-javascript-typescript), [Bridge Pattern](/posts/bridge-pattern-trong-javascript-typescript), [Facade Pattern](/posts/facade-pattern-trong-javascript-typescript), [Composite Pattern](/posts/composite-pattern-trong-javascript-typescript), [Decorator Pattern](/posts/decorator-pattern-trong-javascript-typescript), [Interpreter Pattern](/posts/interpreter-pattern-trong-javascript-typescript), [Iterator Pattern](/posts/iterator-pattern-trong-javascript-typescript), [Mediator Pattern](/posts/mediator-pattern-trong-javascript-typescript), [Memento Pattern](/posts/memento-pattern-trong-javascript-typescript) và [Observer Pattern](/posts/observer-pattern-trong-javascript-typescript).
{{< /sidenote >}}

Trong bài viết trước, chúng ta đã tìm hiểu về Observer Pattern - một mẫu thiết kế hành vi cho phép định nghĩa cơ chế đăng ký để thông báo cho nhiều đối tượng về sự thay đổi. Hôm nay, mình sẽ giới thiệu về State Pattern - một mẫu thiết kế hành vi khác cho phép một đối tượng thay đổi hành vi của nó khi trạng thái nội bộ thay đổi.

## 1. State Pattern là gì?

State Pattern là một mẫu thiết kế hành vi cho phép một đối tượng thay đổi hành vi của nó khi trạng thái nội bộ của nó thay đổi. Pattern này tạo ra một cách để đối tượng có thể thay đổi lớp của nó tại thời điểm chạy, làm cho nó xuất hiện như thể đối tượng đã thay đổi lớp của nó.

Các thành phần chính trong State Pattern:
- **Context**: Đối tượng chứa trạng thái và ủy quyền hành vi cho trạng thái hiện tại
- **State**: Interface định nghĩa các hành vi cho mỗi trạng thái
- **ConcreteState**: Các lớp cụ thể triển khai State interface

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về Order Processing

```javascript
// State interface (implicit in JavaScript)
class OrderState {
  constructor(order) {
    this.order = order;
  }

  proceedToNext() {
    throw new Error('Phương thức proceedToNext() phải được triển khai');
  }

  cancel() {
    throw new Error('Phương thức cancel() phải được triển khai');
  }

  getStatus() {
    throw new Error('Phương thức getStatus() phải được triển khai');
  }
}

// Concrete States
class PendingState extends OrderState {
  proceedToNext() {
    console.log('Đơn hàng được xác nhận và chuyển sang trạng thái xử lý');
    this.order.setState(new ProcessingState(this.order));
  }

  cancel() {
    console.log('Đơn hàng đã bị hủy từ trạng thái chờ xử lý');
    this.order.setState(new CancelledState(this.order));
  }

  getStatus() {
    return 'Đang chờ xử lý';
  }
}

class ProcessingState extends OrderState {
  proceedToNext() {
    console.log('Đơn hàng đã được xử lý và chuyển sang trạng thái vận chuyển');
    this.order.setState(new ShippingState(this.order));
  }

  cancel() {
    console.log('Đơn hàng đã bị hủy từ trạng thái đang xử lý');
    this.order.setState(new CancelledState(this.order));
  }

  getStatus() {
    return 'Đang xử lý';
  }
}

class ShippingState extends OrderState {
  proceedToNext() {
    console.log('Đơn hàng đã được giao thành công');
    this.order.setState(new DeliveredState(this.order));
  }

  cancel() {
    console.log('Không thể hủy đơn hàng đang vận chuyển');
  }

  getStatus() {
    return 'Đang vận chuyển';
  }
}

class DeliveredState extends OrderState {
  proceedToNext() {
    console.log('Đơn hàng đã ở trạng thái cuối cùng');
  }

  cancel() {
    console.log('Không thể hủy đơn hàng đã giao');
  }

  getStatus() {
    return 'Đã giao hàng';
  }
}

class CancelledState extends OrderState {
  proceedToNext() {
    console.log('Không thể xử lý đơn hàng đã hủy');
  }

  cancel() {
    console.log('Đơn hàng đã bị hủy rồi');
  }

  getStatus() {
    return 'Đã hủy';
  }
}

// Context
class Order {
  constructor() {
    this.state = new PendingState(this);
    this.orderNumber = Math.floor(Math.random() * 1000000);
  }

  setState(state) {
    this.state = state;
    console.log(`Đơn hàng #${this.orderNumber} - Trạng thái mới: ${this.getStatus()}`);
  }

  proceedToNext() {
    this.state.proceedToNext();
  }

  cancel() {
    this.state.cancel();
  }

  getStatus() {
    return this.state.getStatus();
  }
}

// Usage
const order = new Order();
console.log(`Trạng thái ban đầu: ${order.getStatus()}`);

// Xử lý đơn hàng qua các trạng thái
order.proceedToNext(); // Pending -> Processing
order.proceedToNext(); // Processing -> Shipping
order.proceedToNext(); // Shipping -> Delivered

// Thử hủy đơn hàng đã giao
order.cancel(); // Không thể hủy

// Tạo đơn hàng mới và hủy ở trạng thái đang xử lý
const order2 = new Order();
order2.proceedToNext(); // Pending -> Processing
order2.cancel(); // Hủy thành công
order2.proceedToNext(); // Không thể xử lý tiếp
```

### 2.2 Ví dụ về Document Editor

```javascript
// State interface
class DocumentState {
  constructor(document) {
    this.document = document;
  }

  edit() {
    throw new Error('Phương thức edit() phải được triển khai');
  }

  review() {
    throw new Error('Phương thức review() phải được triển khai');
  }

  publish() {
    throw new Error('Phương thức publish() phải được triển khai');
  }

  getPermissions() {
    throw new Error('Phương thức getPermissions() phải được triển khai');
  }
}

// Concrete States
class DraftState extends DocumentState {
  edit() {
    console.log('Chỉnh sửa bản nháp...');
  }

  review() {
    console.log('Gửi bản nháp để xem xét');
    this.document.setState(new ReviewState(this.document));
  }

  publish() {
    console.log('Không thể xuất bản bản nháp trực tiếp');
  }

  getPermissions() {
    return ['edit', 'review'];
  }
}

class ReviewState extends DocumentState {
  edit() {
    console.log('Chuyển về trạng thái nháp để chỉnh sửa');
    this.document.setState(new DraftState(this.document));
  }

  review() {
    console.log('Tài liệu đang được xem xét');
  }

  publish() {
    console.log('Phê duyệt và xuất bản tài liệu');
    this.document.setState(new PublishedState(this.document));
  }

  getPermissions() {
    return ['edit', 'publish'];
  }
}

class PublishedState extends DocumentState {
  edit() {
    console.log('Tạo phiên bản mới để chỉnh sửa');
    return new DraftState(this.document);
  }

  review() {
    console.log('Tài liệu đã xuất bản không cần xem xét');
  }

  publish() {
    console.log('Tài liệu đã được xuất bản rồi');
  }

  getPermissions() {
    return ['view'];
  }
}

// Context
class Document {
  constructor(title) {
    this.title = title;
    this.state = new DraftState(this);
    this.content = '';
  }

  setState(state) {
    this.state = state;
    console.log(`Tài liệu "${this.title}" - Trạng thái mới: ${this.state.constructor.name}`);
  }

  edit() {
    this.state.edit();
  }

  review() {
    this.state.review();
  }

  publish() {
    this.state.publish();
  }

  getPermissions() {
    return this.state.getPermissions();
  }
}

// Usage
const doc = new Document('Bài viết về State Pattern');
console.log('Quyền hiện tại:', doc.getPermissions());

doc.edit(); // Có thể chỉnh sửa trong trạng thái nháp
doc.review(); // Chuyển sang trạng thái xem xét

console.log('Quyền sau khi review:', doc.getPermissions());

doc.publish(); // Xuất bản tài liệu
console.log('Quyền sau khi xuất bản:', doc.getPermissions());

doc.review(); // Không thể xem xét tài liệu đã xuất bản
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về Audio Player

```typescript
// State interface
interface AudioPlayerState {
  play(): void;
  pause(): void;
  stop(): void;
  next(): void;
  previous(): void;
}

// Context
class AudioPlayer {
  private state: AudioPlayerState;
  private playlist: string[];
  private currentTrack: number;

  constructor(playlist: string[]) {
    this.playlist = playlist;
    this.currentTrack = 0;
    this.state = new StoppedState(this);
  }

  setState(state: AudioPlayerState): void {
    this.state = state;
    console.log(`Chuyển sang trạng thái: ${state.constructor.name}`);
  }

  play(): void {
    this.state.play();
  }

  pause(): void {
    this.state.pause();
  }

  stop(): void {
    this.state.stop();
  }

  next(): void {
    this.state.next();
  }

  previous(): void {
    this.state.previous();
  }

  getCurrentTrack(): string {
    return this.playlist[this.currentTrack];
  }

  setNextTrack(): void {
    this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
  }

  setPreviousTrack(): void {
    this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
  }
}

// Concrete States
class PlayingState implements AudioPlayerState {
  constructor(private player: AudioPlayer) {}

  play(): void {
    console.log('Đã đang phát nhạc rồi');
  }

  pause(): void {
    console.log('Tạm dừng phát nhạc');
    this.player.setState(new PausedState(this.player));
  }

  stop(): void {
    console.log('Dừng phát nhạc');
    this.player.setState(new StoppedState(this.player));
  }

  next(): void {
    this.player.setNextTrack();
    console.log(`Chuyển sang bài tiếp theo: ${this.player.getCurrentTrack()}`);
  }

  previous(): void {
    this.player.setPreviousTrack();
    console.log(`Chuyển về bài trước: ${this.player.getCurrentTrack()}`);
  }
}

class PausedState implements AudioPlayerState {
  constructor(private player: AudioPlayer) {}

  play(): void {
    console.log('Tiếp tục phát nhạc');
    this.player.setState(new PlayingState(this.player));
  }

  pause(): void {
    console.log('Đã tạm dừng rồi');
  }

  stop(): void {
    console.log('Dừng phát nhạc');
    this.player.setState(new StoppedState(this.player));
  }

  next(): void {
    this.player.setNextTrack();
    console.log(`Chuyển sang bài tiếp theo: ${this.player.getCurrentTrack()}`);
  }

  previous(): void {
    this.player.setPreviousTrack();
    console.log(`Chuyển về bài trước: ${this.player.getCurrentTrack()}`);
  }
}

class StoppedState implements AudioPlayerState {
  constructor(private player: AudioPlayer) {}

  play(): void {
    console.log(`Bắt đầu phát: ${this.player.getCurrentTrack()}`);
    this.player.setState(new PlayingState(this.player));
  }

  pause(): void {
    console.log('Không thể tạm dừng khi đã dừng');
  }

  stop(): void {
    console.log('Đã dừng rồi');
  }

  next(): void {
    this.player.setNextTrack();
    console.log(`Chuyển sang bài tiếp theo: ${this.player.getCurrentTrack()}`);
  }

  previous(): void {
    this.player.setPreviousTrack();
    console.log(`Chuyển về bài trước: ${this.player.getCurrentTrack()}`);
  }
}

// Usage
const playlist = [
  'Shape of You - Ed Sheeran',
  'Blinding Lights - The Weeknd',
  'Dance Monkey - Tones and I'
];

const player = new AudioPlayer(playlist);

// Thử nghiệm các trạng thái
player.play();  // Stopped -> Playing
player.next();  // Chuyển bài tiếp theo
player.pause(); // Playing -> Paused
player.play();  // Paused -> Playing
player.stop();  // Playing -> Stopped

// Thử các hành động không hợp lệ
player.pause(); // Không thể pause khi stopped
```

### 3.2 Ví dụ về Task Management

```typescript
// Task states
interface TaskState {
  setName(name: string): void;
  assignTo(user: string): void;
  start(): void;
  complete(): void;
  reopen(): void;
}

// Task class
class Task {
  private state: TaskState;
  private name: string;
  private assignee: string | null;

  constructor(name: string) {
    this.name = name;
    this.assignee = null;
    this.state = new TodoState(this);
  }

  setState(state: TaskState): void {
    this.state = state;
  }

  setName(name: string): void {
    this.state.setName(name);
  }

  assignTo(user: string): void {
    this.state.assignTo(user);
  }

  start(): void {
    this.state.start();
  }

  complete(): void {
    this.state.complete();
  }

  reopen(): void {
    this.state.reopen();
  }

  // Getters and setters
  getName(): string {
    return this.name;
  }

  updateName(name: string): void {
    this.name = name;
  }

  getAssignee(): string | null {
    return this.assignee;
  }

  updateAssignee(user: string): void {
    this.assignee = user;
  }
}

// Concrete states
class TodoState implements TaskState {
  constructor(private task: Task) {}

  setName(name: string): void {
    this.task.updateName(name);
    console.log(`Cập nhật tên task: ${name}`);
  }

  assignTo(user: string): void {
    this.task.updateAssignee(user);
    console.log(`Task được gán cho ${user}`);
  }

  start(): void {
    if (this.task.getAssignee()) {
      console.log('Bắt đầu thực hiện task');
      this.task.setState(new InProgressState(this.task));
    } else {
      console.log('Không thể bắt đầu task chưa được gán');
    }
  }

  complete(): void {
    console.log('Không thể hoàn thành task chưa bắt đầu');
  }

  reopen(): void {
    console.log('Task đang ở trạng thái Todo');
  }
}

class InProgressState implements TaskState {
  constructor(private task: Task) {}

  setName(name: string): void {
    this.task.updateName(name);
    console.log(`Cập nhật tên task: ${name}`);
  }

  assignTo(user: string): void {
    this.task.updateAssignee(user);
    console.log(`Task được chuyển cho ${user}`);
  }

  start(): void {
    console.log('Task đã đang thực hiện');
  }

  complete(): void {
    console.log('Hoàn thành task');
    this.task.setState(new CompletedState(this.task));
  }

  reopen(): void {
    console.log('Task đang thực hiện, không cần mở lại');
  }
}

class CompletedState implements TaskState {
  constructor(private task: Task) {}

  setName(name: string): void {
    console.log('Không thể đổi tên task đã hoàn thành');
  }

  assignTo(user: string): void {
    console.log('Không thể gán lại task đã hoàn thành');
  }

  start(): void {
    console.log('Không thể bắt đầu task đã hoàn thành');
  }

  complete(): void {
    console.log('Task đã hoàn thành rồi');
  }

  reopen(): void {
    console.log('Mở lại task');
    this.task.setState(new TodoState(this.task));
  }
}

// Usage
const task = new Task('Triển khai State Pattern');

// Workflow bình thường
console.log('\n--- Workflow bình thường ---');
task.assignTo('John');
task.start();
task.complete();

// Thử các hành động không hợp lệ
console.log('\n--- Thử các hành động không hợp lệ ---');
task.start();
task.setName('New Name');

// Mở lại task
console.log('\n--- Mở lại task ---');
task.reopen();
task.setName('Triển khai State Pattern v2');
task.assignTo('Jane');
task.start();
```

## 4. Ưu điểm và Nhược điểm

### 4.1 Ưu điểm
1. **Single Responsibility**: Tách biệt logic của từng trạng thái
2. **Open/Closed**: Dễ dàng thêm trạng thái mới mà không sửa code hiện có
3. **Loại bỏ điều kiện phức tạp**: Thay thế các câu lệnh if/else bằng các lớp trạng thái
4. **Quản lý trạng thái rõ ràng**: Mỗi trạng thái được đóng gói trong một lớp riêng

### 4.2 Nhược điểm
1. **Số lượng lớp tăng**: Mỗi trạng thái cần một lớp riêng
2. **Phức tạp hóa**: Có thể phức tạp hóa code nếu có ít trạng thái
3. **Chuyển đổi trạng thái**: Cần quản lý cẩn thận việc chuyển đổi giữa các trạng thái
4. **Chia sẻ trạng thái**: Khó khăn trong việc chia sẻ dữ liệu giữa các trạng thái

## 5. Khi nào nên sử dụng State Pattern?

1. **Đối tượng có nhiều trạng thái**: Khi đối tượng có nhiều trạng thái khác nhau
2. **Hành vi phụ thuộc trạng thái**: Khi hành vi thay đổi theo trạng thái
3. **Code có nhiều điều kiện**: Thay thế các câu lệnh điều kiện phức tạp
4. **Quản lý workflow**: Trong các hệ thống quản lý quy trình làm việc
5. **Máy trạng thái**: Triển khai máy trạng thái hữu hạn

## 6. Kết luận

State Pattern là một mẫu thiết kế mạnh mẽ cho phép quản lý trạng thái và hành vi của đối tượng một cách linh hoạt. Pattern này đặc biệt hữu ích trong JavaScript/TypeScript khi làm việc với các đối tượng có nhiều trạng thái và hành vi phức tạp. Tuy nhiên, cần cân nhắc về số lượng lớp và độ phức tạp khi sử dụng pattern này.

Trong bài viết tiếp theo, chúng ta sẽ tìm hiểu về Strategy Pattern - một mẫu thiết kế hành vi khác cho phép định nghĩa một họ các thuật toán, đóng gói từng thuật toán và làm cho chúng có thể hoán đổi cho nhau. 