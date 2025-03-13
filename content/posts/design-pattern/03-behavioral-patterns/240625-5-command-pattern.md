---
title: "Behavioral Pattern [5/11] - Command Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-06-25
description: "Command Pattern là một mẫu thiết kế hành vi cho phép bạn đóng gói một yêu cầu thành một đối tượng độc lập. Bài viết này phân tích cách triển khai Command Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "command-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Command
  - Behavioral Patterns
---

## 1. Command Pattern là gì?

Command Pattern là một mẫu thiết kế hành vi cho phép bạn đóng gói một yêu cầu thành một đối tượng độc lập. Điều này cho phép bạn tham số hóa các đối tượng với các yêu cầu khác nhau, xếp hàng đợi hoặc ghi nhật ký các yêu cầu, và hỗ trợ các thao tác hoàn tác.

Các thành phần chính trong Command Pattern:
- **Command**: Interface định nghĩa phương thức thực thi yêu cầu
- **ConcreteCommand**: Triển khai cụ thể của Command, liên kết Receiver với hành động
- **Invoker**: Yêu cầu Command thực hiện hành động
- **Receiver**: Biết cách thực hiện các thao tác liên quan đến yêu cầu
- **Client**: Tạo ConcreteCommand và thiết lập Receiver

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ cơ bản về Remote Control

```javascript
// Receiver
class Light {
  constructor(location) {
    this.location = location;
    this.isOn = false;
  }
  
  turnOn() {
    this.isOn = true;
    console.log(`${this.location} light is now ON`);
  }
  
  turnOff() {
    this.isOn = false;
    console.log(`${this.location} light is now OFF`);
  }
}

// Command interface
class Command {
  execute() {
    throw new Error('execute() must be implemented');
  }
  
  undo() {
    throw new Error('undo() must be implemented');
  }
}

// Concrete Commands
class LightOnCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }
  
  execute() {
    this.light.turnOn();
  }
  
  undo() {
    this.light.turnOff();
  }
}

class LightOffCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }
  
  execute() {
    this.light.turnOff();
  }
  
  undo() {
    this.light.turnOn();
  }
}

// Invoker
class RemoteControl {
  constructor() {
    this.commands = new Map();
    this.history = [];
  }
  
  setCommand(buttonId, command) {
    this.commands.set(buttonId, command);
  }
  
  pressButton(buttonId) {
    const command = this.commands.get(buttonId);
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }
  
  undoLastCommand() {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }
}

// Usage
const livingRoomLight = new Light('Living Room');
const kitchenLight = new Light('Kitchen');

const livingRoomLightOn = new LightOnCommand(livingRoomLight);
const livingRoomLightOff = new LightOffCommand(livingRoomLight);
const kitchenLightOn = new LightOnCommand(kitchenLight);
const kitchenLightOff = new LightOffCommand(kitchenLight);

const remote = new RemoteControl();
remote.setCommand(1, livingRoomLightOn);
remote.setCommand(2, livingRoomLightOff);
remote.setCommand(3, kitchenLightOn);
remote.setCommand(4, kitchenLightOff);

// Test the remote
console.log('Testing remote control:');
remote.pressButton(1); // Turn on living room light
remote.pressButton(3); // Turn on kitchen light
remote.pressButton(2); // Turn off living room light
remote.undoLastCommand(); // Undo: Turn living room light back on
remote.pressButton(4); // Turn off kitchen light
```

### 2.2 Ví dụ về Text Editor

```javascript
// Receiver
class TextEditor {
  constructor() {
    this.text = '';
    this.selectionStart = 0;
    this.selectionEnd = 0;
  }
  
  insertText(text, position) {
    const before = this.text.slice(0, position);
    const after = this.text.slice(position);
    this.text = before + text + after;
    this.selectionStart = this.selectionEnd = position + text.length;
  }
  
  deleteText(start, end) {
    const deletedText = this.text.slice(start, end);
    const before = this.text.slice(0, start);
    const after = this.text.slice(end);
    this.text = before + after;
    this.selectionStart = this.selectionEnd = start;
    return deletedText;
  }
  
  getSelection() {
    return {
      text: this.text.slice(this.selectionStart, this.selectionEnd),
      start: this.selectionStart,
      end: this.selectionEnd
    };
  }
  
  setSelection(start, end) {
    this.selectionStart = start;
    this.selectionEnd = end;
  }
  
  getCurrentState() {
    return {
      text: this.text,
      selection: this.getSelection()
    };
  }
}

// Commands
class InsertTextCommand extends Command {
  constructor(editor, text, position) {
    super();
    this.editor = editor;
    this.text = text;
    this.position = position;
    this.oldState = null;
  }
  
  execute() {
    this.oldState = this.editor.getCurrentState();
    this.editor.insertText(this.text, this.position);
  }
  
  undo() {
    if (this.oldState) {
      this.editor.text = this.oldState.text;
      this.editor.setSelection(
        this.oldState.selection.start,
        this.oldState.selection.end
      );
    }
  }
}

class DeleteTextCommand extends Command {
  constructor(editor, start, end) {
    super();
    this.editor = editor;
    this.start = start;
    this.end = end;
    this.deletedText = '';
    this.oldState = null;
  }
  
  execute() {
    this.oldState = this.editor.getCurrentState();
    this.deletedText = this.editor.deleteText(this.start, this.end);
  }
  
  undo() {
    if (this.oldState) {
      this.editor.text = this.oldState.text;
      this.editor.setSelection(
        this.oldState.selection.start,
        this.oldState.selection.end
      );
    }
  }
}

// Command Manager (Invoker)
class CommandManager {
  constructor() {
    this.history = [];
    this.redoStack = [];
  }
  
  execute(command) {
    command.execute();
    this.history.push(command);
    this.redoStack = []; // Clear redo stack
  }
  
  undo() {
    const command = this.history.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }
  
  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }
}

// Usage
const editor = new TextEditor();
const commandManager = new CommandManager();

// Test the editor
console.log('\nTesting text editor:');

// Insert some text
commandManager.execute(new InsertTextCommand(editor, 'Hello', 0));
console.log('After insert:', editor.getCurrentState());

// Insert more text
commandManager.execute(new InsertTextCommand(editor, ' World', 5));
console.log('After second insert:', editor.getCurrentState());

// Delete some text
commandManager.execute(new DeleteTextCommand(editor, 5, 11));
console.log('After delete:', editor.getCurrentState());

// Undo last operation
commandManager.undo();
console.log('After undo:', editor.getCurrentState());

// Redo last operation
commandManager.redo();
console.log('After redo:', editor.getCurrentState());
```

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ giúp triển khai Command Pattern an toàn và rõ ràng hơn:

```typescript
// Game character example
interface Position {
  x: number;
  y: number;
}

interface GameState {
  position: Position;
  health: number;
  inventory: string[];
}

// Receiver
class GameCharacter {
  private position: Position;
  private health: number;
  private inventory: string[];
  
  constructor() {
    this.position = { x: 0, y: 0 };
    this.health = 100;
    this.inventory = [];
  }
  
  move(dx: number, dy: number): void {
    this.position.x += dx;
    this.position.y += dy;
    console.log(`Moved to position (${this.position.x}, ${this.position.y})`);
  }
  
  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    console.log(`Took ${amount} damage. Health: ${this.health}`);
  }
  
  heal(amount: number): void {
    this.health = Math.min(100, this.health + amount);
    console.log(`Healed ${amount} points. Health: ${this.health}`);
  }
  
  addItem(item: string): void {
    this.inventory.push(item);
    console.log(`Added ${item} to inventory`);
  }
  
  removeItem(item: string): boolean {
    const index = this.inventory.indexOf(item);
    if (index !== -1) {
      this.inventory.splice(index, 1);
      console.log(`Removed ${item} from inventory`);
      return true;
    }
    return false;
  }
  
  getState(): GameState {
    return {
      position: { ...this.position },
      health: this.health,
      inventory: [...this.inventory]
    };
  }
  
  setState(state: GameState): void {
    this.position = { ...state.position };
    this.health = state.health;
    this.inventory = [...state.inventory];
  }
}

// Command interface
interface Command {
  execute(): void;
  undo(): void;
}

// Concrete commands
class MoveCommand implements Command {
  private previousState: GameState | null = null;
  
  constructor(
    private character: GameCharacter,
    private dx: number,
    private dy: number
  ) {}
  
  execute(): void {
    this.previousState = this.character.getState();
    this.character.move(this.dx, this.dy);
  }
  
  undo(): void {
    if (this.previousState) {
      this.character.setState(this.previousState);
      console.log('Move undone');
    }
  }
}

class AttackCommand implements Command {
  private previousState: GameState | null = null;
  
  constructor(
    private character: GameCharacter,
    private damage: number
  ) {}
  
  execute(): void {
    this.previousState = this.character.getState();
    this.character.takeDamage(this.damage);
  }
  
  undo(): void {
    if (this.previousState) {
      this.character.setState(this.previousState);
      console.log('Attack undone');
    }
  }
}

class HealCommand implements Command {
  private previousState: GameState | null = null;
  
  constructor(
    private character: GameCharacter,
    private amount: number
  ) {}
  
  execute(): void {
    this.previousState = this.character.getState();
    this.character.heal(this.amount);
  }
  
  undo(): void {
    if (this.previousState) {
      this.character.setState(this.previousState);
      console.log('Heal undone');
    }
  }
}

class PickupItemCommand implements Command {
  private previousState: GameState | null = null;
  
  constructor(
    private character: GameCharacter,
    private item: string
  ) {}
  
  execute(): void {
    this.previousState = this.character.getState();
    this.character.addItem(this.item);
  }
  
  undo(): void {
    if (this.previousState) {
      this.character.setState(this.previousState);
      console.log('Pickup undone');
    }
  }
}

class UseItemCommand implements Command {
  private previousState: GameState | null = null;
  
  constructor(
    private character: GameCharacter,
    private item: string
  ) {}
  
  execute(): void {
    this.previousState = this.character.getState();
    if (this.character.removeItem(this.item)) {
      console.log(`Used ${this.item}`);
    } else {
      console.log(`${this.item} not found in inventory`);
    }
  }
  
  undo(): void {
    if (this.previousState) {
      this.character.setState(this.previousState);
      console.log('Item use undone');
    }
  }
}

// Command invoker
class GameController {
  private commandHistory: Command[] = [];
  private redoStack: Command[] = [];
  
  executeCommand(command: Command): void {
    command.execute();
    this.commandHistory.push(command);
    this.redoStack = []; // Clear redo stack
  }
  
  undo(): void {
    const command = this.commandHistory.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    } else {
      console.log('No commands to undo');
    }
  }
  
  redo(): void {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.commandHistory.push(command);
    } else {
      console.log('No commands to redo');
    }
  }
}

// Usage
const character = new GameCharacter();
const controller = new GameController();

// Test game commands
console.log('\nTesting game character:');

// Move character
controller.executeCommand(new MoveCommand(character, 5, 3));
controller.executeCommand(new MoveCommand(character, -2, 1));

// Take damage and heal
controller.executeCommand(new AttackCommand(character, 30));
controller.executeCommand(new HealCommand(character, 20));

// Pickup and use items
controller.executeCommand(new PickupItemCommand(character, 'Health Potion'));
controller.executeCommand(new PickupItemCommand(character, 'Sword'));
controller.executeCommand(new UseItemCommand(character, 'Health Potion'));

// Undo last action
console.log('\nUndo last action:');
controller.undo();

// Redo last action
console.log('\nRedo last action:');
controller.redo();

// Show final state
console.log('\nFinal state:', character.getState());
```

## 4. Ví dụ thực tế: Task Queue System

Hãy xem xét một ví dụ thực tế về việc sử dụng Command Pattern để xây dựng hệ thống quản lý hàng đợi tác vụ:

```typescript
// Task interfaces
interface TaskResult {
  success: boolean;
  message: string;
  data?: any;
}

interface TaskContext {
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: TaskResult;
}

// Command interface
interface TaskCommand {
  execute(): Promise<TaskResult>;
  undo(): Promise<void>;
  getContext(): TaskContext;
}

// Base task command
abstract class BaseTaskCommand implements TaskCommand {
  protected context: TaskContext;
  
  constructor() {
    this.context = {
      startTime: new Date(),
      status: 'pending'
    };
  }
  
  abstract execute(): Promise<TaskResult>;
  abstract undo(): Promise<void>;
  
  getContext(): TaskContext {
    return { ...this.context };
  }
  
  protected updateContext(result: TaskResult): void {
    this.context.endTime = new Date();
    this.context.status = result.success ? 'completed' : 'failed';
    this.context.result = result;
  }
}

// Concrete commands
class FileProcessingTask extends BaseTaskCommand {
  constructor(
    private filename: string,
    private operation: 'read' | 'write' | 'delete'
  ) {
    super();
  }
  
  async execute(): Promise<TaskResult> {
    this.context.status = 'running';
    console.log(`Processing file ${this.filename} with operation ${this.operation}`);
    
    // Simulate file operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result: TaskResult = {
      success: true,
      message: `File ${this.operation} operation completed`
    };
    
    this.updateContext(result);
    return result;
  }
  
  async undo(): Promise<void> {
    console.log(`Undoing ${this.operation} operation on ${this.filename}`);
    // Implement undo logic
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

class DataTransformationTask extends BaseTaskCommand {
  constructor(
    private data: any,
    private transformationType: string
  ) {
    super();
  }
  
  async execute(): Promise<TaskResult> {
    this.context.status = 'running';
    console.log(`Transforming data with type ${this.transformationType}`);
    
    try {
      // Simulate data transformation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result: TaskResult = {
        success: true,
        message: 'Data transformation completed',
        data: { transformed: this.data }
      };
      
      this.updateContext(result);
      return result;
    } catch (error) {
      const result: TaskResult = {
        success: false,
        message: `Transformation failed: ${error.message}`
      };
      
      this.updateContext(result);
      return result;
    }
  }
  
  async undo(): Promise<void> {
    console.log(`Undoing ${this.transformationType} transformation`);
    // Implement undo logic
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

class APIRequestTask extends BaseTaskCommand {
  constructor(
    private url: string,
    private method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    private data?: any
  ) {
    super();
  }
  
  async execute(): Promise<TaskResult> {
    this.context.status = 'running';
    console.log(`Making ${this.method} request to ${this.url}`);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const result: TaskResult = {
        success: true,
        message: 'API request completed',
        data: { response: 'Sample response' }
      };
      
      this.updateContext(result);
      return result;
    } catch (error) {
      const result: TaskResult = {
        success: false,
        message: `API request failed: ${error.message}`
      };
      
      this.updateContext(result);
      return result;
    }
  }
  
  async undo(): Promise<void> {
    console.log(`Undoing ${this.method} request to ${this.url}`);
    // Implement undo logic
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Task Queue Manager
class TaskQueueManager {
  private queue: TaskCommand[] = [];
  private history: TaskCommand[] = [];
  private isProcessing: boolean = false;
  
  addTask(task: TaskCommand): void {
    this.queue.push(task);
    this.processQueue();
  }
  
  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      console.log('\nExecuting task:', task.constructor.name);
      
      try {
        const result = await task.execute();
        console.log('Task result:', result);
        this.history.push(task);
      } catch (error) {
        console.error('Task failed:', error);
      }
    }
    
    this.isProcessing = false;
  }
  
  async undoLastTask(): Promise<void> {
    const task = this.history.pop();
    if (task) {
      console.log('\nUndoing task:', task.constructor.name);
      await task.undo();
    }
  }
  
  getTaskHistory(): TaskContext[] {
    return this.history.map(task => task.getContext());
  }
}

// Usage
async function main() {
  const taskQueue = new TaskQueueManager();
  
  // Add various tasks
  taskQueue.addTask(new FileProcessingTask('data.txt', 'read'));
  taskQueue.addTask(new DataTransformationTask({ name: 'John' }, 'uppercase'));
  taskQueue.addTask(new APIRequestTask('https://api.example.com/data', 'GET'));
  
  // Wait for tasks to complete
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Show task history
  console.log('\nTask History:');
  console.log(taskQueue.getTaskHistory());
  
  // Undo last task
  await taskQueue.undoLastTask();
}

main();
```

## 5. Khi nào nên sử dụng Command Pattern

Command Pattern phù hợp trong các tình huống sau:

1. **Khi cần tham số hóa các đối tượng với các hành động**
2. **Khi cần hỗ trợ hoàn tác/làm lại**
3. **Khi cần xếp hàng đợi và thực thi yêu cầu**
4. **Khi cần ghi nhật ký các thao tác**
5. **Khi muốn tách rời người gửi và người nhận yêu cầu**

Ví dụ thực tế:
- Text editors
- Remote controls
- Task schedulers
- Transaction systems
- Game input handling

## 6. So sánh với các Pattern khác

### So sánh với Strategy Pattern

| Command Pattern | Strategy Pattern |
|----------------|------------------|
| Đóng gói yêu cầu | Đóng gói thuật toán |
| Hỗ trợ undo/redo | Không hỗ trợ undo/redo |
| Có thể xếp hàng đợi | Thực thi ngay lập tức |
| Focus on actions | Focus on algorithms |

### So sánh với Chain of Responsibility Pattern

| Command Pattern | Chain of Responsibility Pattern |
|----------------|--------------------------------|
| Đóng gói yêu cầu | Xử lý yêu cầu theo chuỗi |
| Một receiver | Nhiều handler |
| Hỗ trợ undo/redo | Không hỗ trợ undo/redo |
| Independent execution | Sequential processing |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Tách rời người gửi và người nhận**
- **Dễ dàng thêm lệnh mới**
- **Hỗ trợ undo/redo**
- **Hỗ trợ xếp hàng đợi**
- **Tuân thủ Single Responsibility Principle**

### Nhược điểm:
- **Tăng số lượng lớp**
- **Phức tạp hóa code**
- **Khó quản lý với nhiều lệnh**
- **Overhead bộ nhớ**
- **Khó debug với chuỗi lệnh dài**

## 8. Kết luận

Command Pattern là một công cụ mạnh mẽ để đóng gói yêu cầu thành đối tượng, cho phép bạn tham số hóa client với các yêu cầu khác nhau và hỗ trợ các thao tác như hoàn tác/làm lại. Pattern này đặc biệt hữu ích trong các tình huống cần xử lý yêu cầu theo hàng đợi hoặc cần ghi nhật ký các thao tác.

Khi quyết định sử dụng Command Pattern, hãy cân nhắc kỹ giữa lợi ích về tính linh hoạt và độ phức tạp của code. Pattern này có thể giúp tăng tính module hóa và khả năng mở rộng của hệ thống, nhưng cũng có thể làm cho code khó maintain hơn.
