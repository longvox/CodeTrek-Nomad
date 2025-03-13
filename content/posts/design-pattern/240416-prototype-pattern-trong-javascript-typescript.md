---
title: "Prototype Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-04-16
description: "Prototype Pattern là một mẫu thiết kế tạo đối tượng cho phép sao chép các đối tượng hiện có mà không làm code phụ thuộc vào các lớp cụ thể của chúng. Bài viết này phân tích cách triển khai Prototype Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "prototype-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Prototype
  - Creational Patterns
---

{{< sidenote >}}
Đây là bài viết thứ sáu trong series về các mẫu thiết kế trong JavaScript/TypeScript. Nếu bạn chưa đọc các bài trước, bạn có thể xem: [Giới thiệu về các mẫu thiết kế](/posts/gioi-thieu-ve-cac-mau-thiet-ke-javascript-typescript), [Singleton Pattern](/posts/singleton-pattern-trong-javascript-typescript), [Factory Method Pattern](/posts/factory-method-pattern-trong-javascript-typescript), [Abstract Factory Pattern](/posts/abstract-factory-pattern-trong-javascript-typescript) và [Builder Pattern](/posts/builder-pattern-trong-javascript-typescript).
{{< /sidenote >}}

Trong bài viết trước, chúng ta đã tìm hiểu về Builder Pattern - một mẫu thiết kế cho phép xây dựng các đối tượng phức tạp từng bước một. Hôm nay, mình sẽ giới thiệu về Prototype Pattern - một mẫu thiết kế tập trung vào việc sao chép các đối tượng hiện có.

## 1. Prototype Pattern là gì?

Prototype Pattern là một mẫu thiết kế tạo đối tượng cho phép sao chép các đối tượng hiện có mà không làm cho code phụ thuộc vào các lớp cụ thể của chúng. Mẫu này đặc biệt hữu ích khi việc tạo một đối tượng mới tốn kém tài nguyên hơn việc sao chép một đối tượng hiện có.

Các thành phần chính trong Prototype Pattern:
- **Prototype**: Interface khai báo phương thức clone()
- **Concrete Prototype**: Các lớp cụ thể triển khai phương thức clone()
- **Client**: Tạo đối tượng mới bằng cách yêu cầu prototype thực hiện clone

JavaScript là một ngôn ngữ prototype-based, vì vậy Prototype Pattern có thể được triển khai một cách tự nhiên và hiệu quả.

## 2. Triển khai trong JavaScript

### 2.1 Triển khai cơ bản

```javascript
class Shape {
  constructor() {
    this.type = '';
    this.color = '';
  }
  
  clone() {
    const clone = Object.create(Object.getPrototypeOf(this));
    clone.type = this.type;
    clone.color = this.color;
    return clone;
  }
}

class Rectangle extends Shape {
  constructor(width, height, color) {
    super();
    this.type = 'Rectangle';
    this.width = width;
    this.height = height;
    this.color = color;
  }
  
  clone() {
    const clone = super.clone();
    clone.width = this.width;
    clone.height = this.height;
    return clone;
  }
  
  calculateArea() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius, color) {
    super();
    this.type = 'Circle';
    this.radius = radius;
    this.color = color;
  }
  
  clone() {
    const clone = super.clone();
    clone.radius = this.radius;
    return clone;
  }
  
  calculateArea() {
    return Math.PI * this.radius * this.radius;
  }
}

// Usage
const redRectangle = new Rectangle(10, 5, 'red');
const blueRectangle = redRectangle.clone();
blueRectangle.color = 'blue';

console.log(redRectangle.calculateArea());  // 50
console.log(blueRectangle.calculateArea()); // 50
console.log(redRectangle.color);           // 'red'
console.log(blueRectangle.color);          // 'blue'

const greenCircle = new Circle(5, 'green');
const yellowCircle = greenCircle.clone();
yellowCircle.color = 'yellow';
yellowCircle.radius = 7;

console.log(greenCircle.calculateArea());   // ~78.54
console.log(yellowCircle.calculateArea());  // ~153.94
```

### 2.2 Triển khai với Registry

```javascript
class ShapeRegistry {
  constructor() {
    this.shapes = new Map();
  }
  
  register(key, shape) {
    this.shapes.set(key, shape);
  }
  
  unregister(key) {
    this.shapes.delete(key);
  }
  
  clone(key) {
    const shape = this.shapes.get(key);
    if (!shape) {
      throw new Error(`Shape with key ${key} not found in registry`);
    }
    return shape.clone();
  }
}

// Usage
const registry = new ShapeRegistry();

const prototypeRectangle = new Rectangle(0, 0, 'white');
const prototypeCircle = new Circle(0, 'white');

registry.register('rectangle', prototypeRectangle);
registry.register('circle', prototypeCircle);

const customRectangle = registry.clone('rectangle');
customRectangle.width = 15;
customRectangle.height = 8;
customRectangle.color = 'purple';

const customCircle = registry.clone('circle');
customCircle.radius = 10;
customCircle.color = 'orange';

console.log(customRectangle.calculateArea()); // 120
console.log(customCircle.calculateArea());    // ~314.16
```

## 3. Triển khai trong TypeScript

TypeScript cho phép chúng ta định nghĩa interface và kiểu dữ liệu rõ ràng hơn:

```typescript
interface Prototype<T> {
  clone(): T;
}

interface Document extends Prototype<Document> {
  name: string;
  content: string[];
  metadata: {
    author: string;
    createdAt: Date;
    tags: string[];
  };
}

class TextDocument implements Document {
  name: string;
  content: string[];
  metadata: {
    author: string;
    createdAt: Date;
    tags: string[];
  };
  
  constructor(
    name: string,
    content: string[],
    author: string,
    tags: string[] = []
  ) {
    this.name = name;
    this.content = content;
    this.metadata = {
      author,
      createdAt: new Date(),
      tags
    };
  }
  
  clone(): TextDocument {
    const clone = new TextDocument(
      this.name,
      [...this.content],
      this.metadata.author,
      [...this.metadata.tags]
    );
    clone.metadata.createdAt = new Date(this.metadata.createdAt);
    return clone;
  }
  
  addContent(text: string): void {
    this.content.push(text);
  }
  
  addTag(tag: string): void {
    this.metadata.tags.push(tag);
  }
}

// Usage
const originalDoc = new TextDocument(
  'Design Patterns',
  ['Introduction to design patterns...'],
  'John Doe',
  ['programming', 'design']
);

const clonedDoc = originalDoc.clone();
clonedDoc.name = 'Design Patterns - Copy';
clonedDoc.addContent('More content in the clone...');
clonedDoc.addTag('copy');

console.log(originalDoc.content.length);      // 1
console.log(clonedDoc.content.length);        // 2
console.log(originalDoc.metadata.tags);       // ['programming', 'design']
console.log(clonedDoc.metadata.tags);         // ['programming', 'design', 'copy']
```

## 4. Ví dụ thực tế: Component Library

Hãy xem xét một ví dụ thực tế về việc sử dụng Prototype Pattern trong thư viện component UI:

```typescript
interface ComponentPrototype<T> {
  clone(): T;
  render(): string;
}

interface ButtonProps {
  text: string;
  style?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

class Button implements ComponentPrototype<Button> {
  private props: ButtonProps;
  
  constructor(props: ButtonProps) {
    this.props = {
      text: props.text,
      style: props.style || 'primary',
      size: props.size || 'medium',
      disabled: props.disabled || false,
      onClick: props.onClick
    };
  }
  
  clone(): Button {
    return new Button({ ...this.props });
  }
  
  render(): string {
    const { text, style, size, disabled } = this.props;
    return `<button class="btn btn-${style} btn-${size}" ${disabled ? 'disabled' : ''}>${text}</button>`;
  }
  
  setText(text: string): void {
    this.props.text = text;
  }
  
  setStyle(style: 'primary' | 'secondary' | 'danger'): void {
    this.props.style = style;
  }
  
  setSize(size: 'small' | 'medium' | 'large'): void {
    this.props.size = size;
  }
  
  setDisabled(disabled: boolean): void {
    this.props.disabled = disabled;
  }
}

class ComponentRegistry {
  private components: Map<string, ComponentPrototype<any>>;
  
  constructor() {
    this.components = new Map();
  }
  
  register(key: string, component: ComponentPrototype<any>): void {
    this.components.set(key, component);
  }
  
  unregister(key: string): void {
    this.components.delete(key);
  }
  
  clone(key: string): ComponentPrototype<any> {
    const component = this.components.get(key);
    if (!component) {
      throw new Error(`Component with key ${key} not found`);
    }
    return component.clone();
  }
}

// Usage
const registry = new ComponentRegistry();

// Register prototype buttons
const primaryButton = new Button({
  text: 'Click me',
  style: 'primary',
  size: 'medium'
});

const secondaryButton = new Button({
  text: 'Cancel',
  style: 'secondary',
  size: 'medium'
});

const dangerButton = new Button({
  text: 'Delete',
  style: 'danger',
  size: 'small'
});

registry.register('primary-button', primaryButton);
registry.register('secondary-button', secondaryButton);
registry.register('danger-button', dangerButton);

// Create buttons from prototypes
const submitButton = registry.clone('primary-button') as Button;
submitButton.setText('Submit');
console.log(submitButton.render());
// <button class="btn btn-primary btn-medium">Submit</button>

const cancelButton = registry.clone('secondary-button') as Button;
console.log(cancelButton.render());
// <button class="btn btn-secondary btn-medium">Cancel</button>

const deleteButton = registry.clone('danger-button') as Button;
deleteButton.setDisabled(true);
console.log(deleteButton.render());
// <button class="btn btn-danger btn-small" disabled>Delete</button>
```

## 5. Khi nào nên sử dụng Prototype Pattern

Prototype Pattern phù hợp trong các tình huống sau:

1. **Khi cần tránh tạo các lớp factory phức tạp**
2. **Khi các lớp cần được tạo chỉ khác nhau về cấu hình**
3. **Khi việc tạo đối tượng mới tốn kém tài nguyên**
4. **Khi cần giảm số lượng lớp con**
5. **Khi muốn tránh code bị phụ thuộc vào các lớp cụ thể**

Ví dụ thực tế:
- Sao chép các đối tượng UI phức tạp
- Tạo các bản sao của đối tượng cấu hình
- Clone các đối tượng game
- Tạo các template cho tài liệu
- Sao chép các đối tượng từ database

## 6. So sánh với các Pattern khác

### So sánh với Factory Pattern

| Prototype Pattern | Factory Pattern |
|------------------|-----------------|
| Sao chép đối tượng hiện có | Tạo đối tượng mới từ đầu |
| Không cần biết chi tiết lớp | Cần biết lớp cụ thể |
| Hiệu quả với đối tượng phức tạp | Phù hợp với đối tượng đơn giản |
| Giảm số lượng lớp | Có thể tạo nhiều lớp con |

### So sánh với Builder Pattern

| Prototype Pattern | Builder Pattern |
|------------------|-----------------|
| Sao chép đối tượng hoàn chỉnh | Xây dựng đối tượng từng bước |
| Nhanh hơn với đối tượng phức tạp | Kiểm soát chi tiết quá trình tạo |
| Duy trì trạng thái đối tượng | Tạo đối tượng mới mỗi lần |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Giảm code trùng lặp** khi tạo đối tượng
- **Tránh khởi tạo phức tạp** cho các đối tượng
- **Tạo đối tượng động** trong runtime
- **Thay thế kế thừa phức tạp** bằng sao chép
- **Tạo đối tượng mà không cần biết chi tiết lớp**

### Nhược điểm:
- **Phức tạp trong việc clone** đối tượng có tham chiếu vòng
- **Khó khăn khi clone** đối tượng có phương thức private
- **Có thể gây nhầm lẫn** giữa shallow và deep copy
- **Tăng độ phức tạp** khi cần quản lý registry
- **Khó debug** khi có nhiều bản sao

## 8. Kết luận

Prototype Pattern là một công cụ mạnh mẽ trong JavaScript và TypeScript, đặc biệt khi làm việc với các đối tượng phức tạp cần được sao chép thường xuyên. Pattern này tận dụng được bản chất prototype-based của JavaScript và cung cấp một cách tiếp cận linh hoạt để tạo các đối tượng mới.

Khi quyết định sử dụng Prototype Pattern, hãy cân nhắc độ phức tạp của đối tượng và tần suất cần sao chép. Đối với các đối tượng đơn giản, việc tạo mới có thể là lựa chọn tốt hơn. Tuy nhiên, đối với các đối tượng phức tạp hoặc khi cần tránh phụ thuộc vào các lớp cụ thể, Prototype Pattern là một giải pháp hiệu quả.

Trong bài viết tiếp theo, chúng ta sẽ tìm hiểu về Module Pattern - một mẫu thiết kế đặc biệt quan trọng trong JavaScript để tổ chức và đóng gói code.

## Tài liệu tham khảo

1. Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design Patterns: Elements of Reusable Object-Oriented Software.
2. Osmani, A. (2017). Learning JavaScript Design Patterns.
3. Freeman, E., Robson, E., Sierra, K., & Bates, B. (2004). Head First Design Patterns.
4. TypeScript Documentation: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
5. Refactoring Guru - Prototype Pattern: [https://refactoring.guru/design-patterns/prototype](https://refactoring.guru/design-patterns/prototype) 