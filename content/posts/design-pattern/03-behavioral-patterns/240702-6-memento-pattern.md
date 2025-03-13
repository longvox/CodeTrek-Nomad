---
title: "Behavioral Pattern [6/11] - Memento Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-07-02
description: "Tìm hiểu về Memento Pattern - một mẫu thiết kế hành vi cho phép lưu trữ và khôi phục trạng thái của đối tượng mà không vi phạm nguyên tắc đóng gói."
slug: "memento-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Behavioral Patterns
---

## 1. Memento Pattern là gì?

Memento Pattern là một mẫu thiết kế hành vi cho phép lưu trữ và khôi phục trạng thái trước đó của một đối tượng mà không tiết lộ chi tiết triển khai của nó. Pattern này còn được gọi là "Token Pattern" hoặc "Snapshot Pattern".

### 1.1. Đặc điểm chính

- Cho phép tạo snapshot của trạng thái đối tượng
- Không vi phạm nguyên tắc đóng gói
- Dễ dàng thêm chức năng undo/redo
- Quản lý lịch sử trạng thái một cách hiệu quả

### 1.2. Cấu trúc

```typescript
// Originator - đối tượng có trạng thái cần lưu trữ
class Originator {
  private state: string;

  constructor(state: string) {
    this.state = state;
  }

  public getState(): string {
    return this.state;
  }

  public setState(state: string): void {
    this.state = state;
  }

  // Tạo memento
  public save(): Memento {
    return new ConcreteMemento(this.state);
  }

  // Khôi phục từ memento
  public restore(memento: Memento): void {
    this.state = memento.getState();
  }
}

// Memento interface
interface Memento {
  getState(): string;
  getDate(): string;
}

// Concrete Memento
class ConcreteMemento implements Memento {
  private state: string;
  private date: string;

  constructor(state: string) {
    this.state = state;
    this.date = new Date().toISOString();
  }

  public getState(): string {
    return this.state;
  }

  public getDate(): string {
    return this.date;
  }
}

// Caretaker - quản lý lịch sử các memento
class Caretaker {
  private mementos: Memento[] = [];
  private originator: Originator;

  constructor(originator: Originator) {
    this.originator = originator;
  }

  public backup(): void {
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (this.mementos.length === 0) {
      return;
    }

    const memento = this.mementos.pop();
    if (memento) {
      this.originator.restore(memento);
    }
  }
}
```

## 2. Khi nào nên sử dụng Memento Pattern?

### 2.1. Các trường hợp nên sử dụng

- Khi cần tạo snapshot của trạng thái đối tượng
- Khi cần triển khai chức năng undo/redo
- Khi cần lưu trữ checkpoint trong game hoặc ứng dụng
- Khi muốn tránh vi phạm nguyên tắc đóng gói

### 2.2. Ví dụ thực tế: Text Editor

```typescript
// Text Editor với chức năng undo/redo
class TextEditor {
  private content: string = '';

  getContent(): string {
    return this.content;
  }

  type(text: string): void {
    this.content += text;
  }

  save(): EditorMemento {
    return new EditorMemento(this.content);
  }

  restore(memento: EditorMemento): void {
    this.content = memento.getContent();
  }
}

class EditorMemento {
  private readonly content: string;
  private readonly timestamp: string;

  constructor(content: string) {
    this.content = content;
    this.timestamp = new Date().toISOString();
  }

  getContent(): string {
    return this.content;
  }

  getTimestamp(): string {
    return this.timestamp;
  }
}

class EditorHistory {
  private mementos: EditorMemento[] = [];
  private editor: TextEditor;

  constructor(editor: TextEditor) {
    this.editor = editor;
  }

  save(): void {
    this.mementos.push(this.editor.save());
  }

  undo(): void {
    if (this.mementos.length === 0) {
      return;
    }

    const memento = this.mementos.pop();
    if (memento) {
      this.editor.restore(memento);
    }
  }
}

// Usage
const editor = new TextEditor();
const history = new EditorHistory(editor);

editor.type('Hello');
history.save();

editor.type(' World');
history.save();

editor.type('!');
console.log(editor.getContent()); // "Hello World!"

history.undo();
console.log(editor.getContent()); // "Hello World"

history.undo();
console.log(editor.getContent()); // "Hello"
```

## 3. Triển khai Memento Pattern trong JavaScript/TypeScript

### 3.1. Ví dụ về Game State

```typescript
interface GameState {
  level: number;
  score: number;
  position: { x: number; y: number };
  inventory: string[];
}

class Game {
  private state: GameState;

  constructor() {
    this.state = {
      level: 1,
      score: 0,
      position: { x: 0, y: 0 },
      inventory: []
    };
  }

  public movePlayer(x: number, y: number): void {
    this.state.position = { x, y };
  }

  public collectItem(item: string): void {
    this.state.inventory.push(item);
    this.state.score += 10;
  }

  public levelUp(): void {
    this.state.level++;
  }

  public save(): GameMemento {
    return new GameMemento(JSON.parse(JSON.stringify(this.state)));
  }

  public restore(memento: GameMemento): void {
    this.state = JSON.parse(JSON.stringify(memento.getState()));
  }

  public getState(): GameState {
    return this.state;
  }
}

class GameMemento {
  private state: GameState;
  private timestamp: string;

  constructor(state: GameState) {
    this.state = state;
    this.timestamp = new Date().toISOString();
  }

  getState(): GameState {
    return this.state;
  }

  getTimestamp(): string {
    return this.timestamp;
  }
}

class GameHistory {
  private mementos: GameMemento[] = [];
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  createCheckpoint(): void {
    this.mementos.push(this.game.save());
  }

  restoreCheckpoint(): void {
    const memento = this.mementos.pop();
    if (memento) {
      this.game.restore(memento);
    }
  }

  getCheckpoints(): GameMemento[] {
    return this.mementos;
  }
}

// Usage
const game = new Game();
const history = new GameHistory(game);

// Playing the game
game.movePlayer(10, 20);
game.collectItem('Sword');
history.createCheckpoint();

game.movePlayer(30, 40);
game.collectItem('Shield');
game.levelUp();
console.log(game.getState());
// { level: 2, score: 20, position: { x: 30, y: 40 }, inventory: ['Sword', 'Shield'] }

// Restoring to previous checkpoint
history.restoreCheckpoint();
console.log(game.getState());
// { level: 1, score: 10, position: { x: 10, y: 20 }, inventory: ['Sword'] }
```

### 3.2. Ví dụ về Form State Management

```typescript
interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
  isDirty: boolean;
}

class FormManager {
  private state: FormState;

  constructor() {
    this.state = {
      values: {},
      errors: {},
      isDirty: false
    };
  }

  updateField(field: string, value: string): void {
    this.state.values[field] = value;
    this.state.isDirty = true;
  }

  setError(field: string, error: string): void {
    this.state.errors[field] = error;
  }

  save(): FormMemento {
    return new FormMemento({...this.state});
  }

  restore(memento: FormMemento): void {
    this.state = {...memento.getState()};
  }

  getState(): FormState {
    return this.state;
  }
}

class FormMemento {
  private state: FormState;
  private timestamp: string;

  constructor(state: FormState) {
    this.state = state;
    this.timestamp = new Date().toISOString();
  }

  getState(): FormState {
    return this.state;
  }

  getTimestamp(): string {
    return this.timestamp;
  }
}

// Usage
const form = new FormManager();
const snapshots: FormMemento[] = [];

form.updateField('name', 'John');
snapshots.push(form.save());

form.updateField('email', 'john@example.com');
form.setError('email', 'Invalid email');
snapshots.push(form.save());

console.log(form.getState());
// { values: { name: 'John', email: 'john@example.com' }, 
//   errors: { email: 'Invalid email' }, 
//   isDirty: true }

// Restore to first snapshot
form.restore(snapshots[0]);
console.log(form.getState());
// { values: { name: 'John' }, errors: {}, isDirty: true }
```

## 4. Ưu điểm và nhược điểm

### 4.1. Ưu điểm

1. **Đóng gói**: Không vi phạm nguyên tắc đóng gói của đối tượng
2. **Đơn giản**: Dễ dàng triển khai và sử dụng
3. **Linh hoạt**: Có thể lưu trữ nhiều trạng thái khác nhau
4. **Bảo mật**: Trạng thái được lưu trữ an toàn bên ngoài đối tượng gốc

### 4.2. Nhược điểm

1. **Bộ nhớ**: Có thể tiêu tốn nhiều bộ nhớ khi lưu trữ nhiều trạng thái
2. **Hiệu suất**: Việc tạo và khôi phục trạng thái có thể tốn thời gian
3. **Quản lý**: Cần quản lý cẩn thận các memento để tránh rò rỉ bộ nhớ

## 5. Best Practices và Lưu ý

### 5.1. Khi nào nên sử dụng

- Khi cần lưu trữ trạng thái tạm thời
- Khi triển khai chức năng undo/redo
- Khi cần tạo snapshot của hệ thống
- Khi muốn tránh vi phạm đóng gói

### 5.2. Tips và Tricks

1. **Quản lý bộ nhớ**: Giới hạn số lượng memento được lưu trữ
2. **Deep Copy**: Sử dụng deep copy để tránh tham chiếu chung
3. **Immutable State**: Nên sử dụng immutable state khi có thể
4. **Serialization**: Cân nhắc serialization để lưu trữ lâu dài

## 6. Kết luận

Memento Pattern là một công cụ mạnh mẽ cho việc quản lý trạng thái trong ứng dụng JavaScript/TypeScript. Pattern này đặc biệt hữu ích khi cần lưu trữ và khôi phục trạng thái của đối tượng một cách an toàn và hiệu quả.

Tuy nhiên, cần cân nhắc kỹ về việc quản lý bộ nhớ và hiệu suất khi sử dụng pattern này, đặc biệt là trong các ứng dụng có nhiều trạng thái cần lưu trữ.
