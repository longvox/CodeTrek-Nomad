---
title: "Visitor Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-08-06
description: "Visitor Pattern là một mẫu thiết kế hành vi cho phép thêm các thao tác mới vào một đối tượng mà không cần thay đổi đối tượng đó. Bài viết này phân tích cách triển khai Visitor Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "visitor-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Visitor
  - Behavioral Patterns
---

{{< sidenote >}}
Đây là bài viết thứ hai mươi trong series về các mẫu thiết kế trong JavaScript/TypeScript. Nếu bạn chưa đọc các bài trước, bạn có thể xem: [Giới thiệu về các mẫu thiết kế](/posts/gioi-thieu-ve-cac-mau-thiet-ke), [Singleton Pattern](/posts/singleton-pattern-trong-javascript-typescript), [Factory Method Pattern](/posts/factory-method-pattern-trong-javascript-typescript), [Abstract Factory Pattern](/posts/abstract-factory-pattern-trong-javascript-typescript), [Builder Pattern](/posts/builder-pattern-trong-javascript-typescript), [Prototype Pattern](/posts/prototype-pattern-trong-javascript-typescript), [Module Pattern](/posts/module-pattern-trong-javascript-typescript), [Adapter Pattern](/posts/adapter-pattern-trong-javascript-typescript), [Bridge Pattern](/posts/bridge-pattern-trong-javascript-typescript), [Facade Pattern](/posts/facade-pattern-trong-javascript-typescript), [Composite Pattern](/posts/composite-pattern-trong-javascript-typescript), [Decorator Pattern](/posts/decorator-pattern-trong-javascript-typescript), [Interpreter Pattern](/posts/interpreter-pattern-trong-javascript-typescript), [Iterator Pattern](/posts/iterator-pattern-trong-javascript-typescript), [Mediator Pattern](/posts/mediator-pattern-trong-javascript-typescript), [Memento Pattern](/posts/memento-pattern-trong-javascript-typescript), [Observer Pattern](/posts/observer-pattern-trong-javascript-typescript), [State Pattern](/posts/state-pattern-trong-javascript-typescript), [Strategy Pattern](/posts/strategy-pattern-trong-javascript-typescript) và [Template Method Pattern](/posts/template-method-pattern-trong-javascript-typescript).
{{< /sidenote >}}

Trong bài viết trước, chúng ta đã tìm hiểu về Template Method Pattern - một mẫu thiết kế hành vi định nghĩa bộ khung của một thuật toán trong một phương thức. Hôm nay, mình sẽ giới thiệu về Visitor Pattern - một mẫu thiết kế hành vi khác cho phép thêm các thao tác mới vào một đối tượng mà không cần thay đổi đối tượng đó.

## 1. Visitor Pattern là gì?

Visitor Pattern là một mẫu thiết kế hành vi cho phép bạn tách rời các thuật toán khỏi các đối tượng mà chúng hoạt động trên đó. Pattern này cho phép bạn thêm các hành vi mới vào cấu trúc đối tượng hiện có mà không cần sửa đổi cấu trúc đó.

Các thành phần chính trong Visitor Pattern:
- **Visitor**: Interface khai báo các phương thức visit cho mỗi loại element
- **ConcreteVisitor**: Triển khai các phương thức của Visitor
- **Element**: Interface khai báo phương thức accept
- **ConcreteElement**: Triển khai phương thức accept

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về Export Document

```javascript
// Visitor interface (implicit in JavaScript)
class DocumentExportVisitor {
  visitParagraph(paragraph) {
    throw new Error('visitParagraph() phải được triển khai');
  }

  visitHeading(heading) {
    throw new Error('visitHeading() phải được triển khai');
  }

  visitList(list) {
    throw new Error('visitList() phải được triển khai');
  }
}

// Element interface (implicit in JavaScript)
class DocumentElement {
  accept(visitor) {
    throw new Error('accept() phải được triển khai');
  }
}

// Concrete Elements
class Paragraph extends DocumentElement {
  constructor(text) {
    super();
    this.text = text;
  }

  accept(visitor) {
    return visitor.visitParagraph(this);
  }
}

class Heading extends DocumentElement {
  constructor(text, level) {
    super();
    this.text = text;
    this.level = level;
  }

  accept(visitor) {
    return visitor.visitHeading(this);
  }
}

class List extends DocumentElement {
  constructor(items) {
    super();
    this.items = items;
  }

  accept(visitor) {
    return visitor.visitList(this);
  }
}

// Concrete Visitors
class HTMLExportVisitor extends DocumentExportVisitor {
  visitParagraph(paragraph) {
    return `<p>${paragraph.text}</p>`;
  }

  visitHeading(heading) {
    return `<h${heading.level}>${heading.text}</h${heading.level}>`;
  }

  visitList(list) {
    const items = list.items.map(item => `<li>${item}</li>`).join('');
    return `<ul>${items}</ul>`;
  }
}

class MarkdownExportVisitor extends DocumentExportVisitor {
  visitParagraph(paragraph) {
    return `${paragraph.text}\n\n`;
  }

  visitHeading(heading) {
    return `${'#'.repeat(heading.level)} ${heading.text}\n\n`;
  }

  visitList(list) {
    return list.items.map(item => `- ${item}`).join('\n') + '\n\n';
  }
}

// Usage
const document = [
  new Heading('Tiêu đề chính', 1),
  new Paragraph('Đây là đoạn văn đầu tiên.'),
  new Heading('Tiêu đề phụ', 2),
  new List(['Mục 1', 'Mục 2', 'Mục 3']),
  new Paragraph('Đây là đoạn văn kết thúc.')
];

const htmlVisitor = new HTMLExportVisitor();
const markdownVisitor = new MarkdownExportVisitor();

console.log('HTML Export:');
console.log(document.map(element => element.accept(htmlVisitor)).join('\n'));

console.log('\nMarkdown Export:');
console.log(document.map(element => element.accept(markdownVisitor)).join(''));
```

### 2.2 Ví dụ về Shape Calculator

```javascript
// Visitor interface
class ShapeCalculator {
  visitCircle(circle) {
    throw new Error('visitCircle() phải được triển khai');
  }

  visitRectangle(rectangle) {
    throw new Error('visitRectangle() phải được triển khai');
  }

  visitTriangle(triangle) {
    throw new Error('visitTriangle() phải được triển khai');
  }
}

// Element interface
class Shape {
  accept(visitor) {
    throw new Error('accept() phải được triển khai');
  }
}

// Concrete Elements
class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  accept(visitor) {
    return visitor.visitCircle(this);
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  accept(visitor) {
    return visitor.visitRectangle(this);
  }
}

class Triangle extends Shape {
  constructor(base, height) {
    super();
    this.base = base;
    this.height = height;
  }

  accept(visitor) {
    return visitor.visitTriangle(this);
  }
}

// Concrete Visitors
class AreaCalculator extends ShapeCalculator {
  visitCircle(circle) {
    return Math.PI * circle.radius * circle.radius;
  }

  visitRectangle(rectangle) {
    return rectangle.width * rectangle.height;
  }

  visitTriangle(triangle) {
    return (triangle.base * triangle.height) / 2;
  }
}

class PerimeterCalculator extends ShapeCalculator {
  visitCircle(circle) {
    return 2 * Math.PI * circle.radius;
  }

  visitRectangle(rectangle) {
    return 2 * (rectangle.width + rectangle.height);
  }

  visitTriangle(triangle) {
    // Giả sử tam giác đều cho đơn giản
    return 3 * triangle.base;
  }
}

// Usage
const shapes = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4)
];

const areaCalculator = new AreaCalculator();
const perimeterCalculator = new PerimeterCalculator();

console.log('Tính diện tích:');
shapes.forEach(shape => {
  console.log(`- ${shape.constructor.name}: ${shape.accept(areaCalculator)}`);
});

console.log('\nTính chu vi:');
shapes.forEach(shape => {
  console.log(`- ${shape.constructor.name}: ${shape.accept(perimeterCalculator)}`);
});
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về File System

```typescript
// Visitor interface
interface FileSystemVisitor {
  visitFile(file: File): string;
  visitDirectory(directory: Directory): string;
  visitSymlink(symlink: Symlink): string;
}

// Element interface
interface FileSystemElement {
  accept(visitor: FileSystemVisitor): string;
  getName(): string;
}

// Concrete Elements
class File implements FileSystemElement {
  constructor(
    private name: string,
    private size: number,
    private type: string
  ) {}

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.size;
  }

  getType(): string {
    return this.type;
  }

  accept(visitor: FileSystemVisitor): string {
    return visitor.visitFile(this);
  }
}

class Directory implements FileSystemElement {
  private children: FileSystemElement[] = [];

  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }

  add(element: FileSystemElement): void {
    this.children.push(element);
  }

  getChildren(): FileSystemElement[] {
    return this.children;
  }

  accept(visitor: FileSystemVisitor): string {
    return visitor.visitDirectory(this);
  }
}

class Symlink implements FileSystemElement {
  constructor(
    private name: string,
    private target: FileSystemElement
  ) {}

  getName(): string {
    return this.name;
  }

  getTarget(): FileSystemElement {
    return this.target;
  }

  accept(visitor: FileSystemVisitor): string {
    return visitor.visitSymlink(this);
  }
}

// Concrete Visitors
class ListVisitor implements FileSystemVisitor {
  private indent: string = '';

  visitFile(file: File): string {
    return `${this.indent}- ${file.getName()} (${file.getSize()} bytes, ${file.getType()})\n`;
  }

  visitDirectory(directory: Directory): string {
    let result = `${this.indent}+ ${directory.getName()}/\n`;
    this.indent += '  ';
    
    for (const child of directory.getChildren()) {
      result += child.accept(this);
    }
    
    this.indent = this.indent.slice(0, -2);
    return result;
  }

  visitSymlink(symlink: Symlink): string {
    return `${this.indent}@ ${symlink.getName()} -> ${symlink.getTarget().getName()}\n`;
  }
}

class SearchVisitor implements FileSystemVisitor {
  private results: string[] = [];
  private searchTerm: string;

  constructor(searchTerm: string) {
    this.searchTerm = searchTerm.toLowerCase();
  }

  visitFile(file: File): string {
    if (file.getName().toLowerCase().includes(this.searchTerm)) {
      this.results.push(file.getName());
    }
    return '';
  }

  visitDirectory(directory: Directory): string {
    if (directory.getName().toLowerCase().includes(this.searchTerm)) {
      this.results.push(directory.getName());
    }
    
    for (const child of directory.getChildren()) {
      child.accept(this);
    }
    return '';
  }

  visitSymlink(symlink: Symlink): string {
    if (symlink.getName().toLowerCase().includes(this.searchTerm)) {
      this.results.push(symlink.getName());
    }
    return '';
  }

  getResults(): string[] {
    return this.results;
  }
}

// Usage
const root = new Directory('root');
const home = new Directory('home');
const user = new Directory('user');
const docs = new Directory('documents');

const file1 = new File('report.pdf', 1024, 'application/pdf');
const file2 = new File('photo.jpg', 2048, 'image/jpeg');
const file3 = new File('notes.txt', 512, 'text/plain');

const link = new Symlink('docs-link', docs);

user.add(docs);
docs.add(file1);
docs.add(file2);
home.add(user);
home.add(file3);
root.add(home);
root.add(link);

// Liệt kê cấu trúc thư mục
const listVisitor = new ListVisitor();
console.log('Cấu trúc thư mục:');
console.log(root.accept(listVisitor));

// Tìm kiếm file
const searchVisitor = new SearchVisitor('doc');
root.accept(searchVisitor);
console.log('Kết quả tìm kiếm cho "doc":');
console.log(searchVisitor.getResults());
```

### 3.2 Ví dụ về AST Processor

```typescript
// Visitor interface
interface ASTVisitor {
  visitBinaryExpression(node: BinaryExpression): string;
  visitNumberLiteral(node: NumberLiteral): string;
  visitIdentifier(node: Identifier): string;
}

// Node interface
interface ASTNode {
  accept(visitor: ASTVisitor): string;
}

// Concrete Nodes
class BinaryExpression implements ASTNode {
  constructor(
    private left: ASTNode,
    private operator: string,
    private right: ASTNode
  ) {}

  getLeft(): ASTNode {
    return this.left;
  }

  getOperator(): string {
    return this.operator;
  }

  getRight(): ASTNode {
    return this.right;
  }

  accept(visitor: ASTVisitor): string {
    return visitor.visitBinaryExpression(this);
  }
}

class NumberLiteral implements ASTNode {
  constructor(private value: number) {}

  getValue(): number {
    return this.value;
  }

  accept(visitor: ASTVisitor): string {
    return visitor.visitNumberLiteral(this);
  }
}

class Identifier implements ASTNode {
  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }

  accept(visitor: ASTVisitor): string {
    return visitor.visitIdentifier(this);
  }
}

// Concrete Visitors
class JavaScriptGenerator implements ASTVisitor {
  visitBinaryExpression(node: BinaryExpression): string {
    return `(${node.getLeft().accept(this)} ${node.getOperator()} ${node.getRight().accept(this)})`;
  }

  visitNumberLiteral(node: NumberLiteral): string {
    return node.getValue().toString();
  }

  visitIdentifier(node: Identifier): string {
    return node.getName();
  }
}

class PythonGenerator implements ASTVisitor {
  visitBinaryExpression(node: BinaryExpression): string {
    let operator = node.getOperator();
    // Chuyển đổi toán tử JavaScript sang Python
    if (operator === '&&') operator = 'and';
    if (operator === '||') operator = 'or';
    
    return `(${node.getLeft().accept(this)} ${operator} ${node.getRight().accept(this)})`;
  }

  visitNumberLiteral(node: NumberLiteral): string {
    return node.getValue().toString();
  }

  visitIdentifier(node: Identifier): string {
    return node.getName();
  }
}

// Usage
const ast = new BinaryExpression(
  new BinaryExpression(
    new NumberLiteral(5),
    '+',
    new NumberLiteral(3)
  ),
  '*',
  new Identifier('x')
);

const jsGenerator = new JavaScriptGenerator();
console.log('JavaScript:');
console.log(ast.accept(jsGenerator));

const pythonGenerator = new PythonGenerator();
console.log('\nPython:');
console.log(ast.accept(pythonGenerator));
```

## 4. Ưu điểm và Nhược điểm

### 4.1 Ưu điểm
1. **Tách biệt thuật toán**: Tách biệt các thuật toán khỏi đối tượng
2. **Dễ mở rộng**: Dễ dàng thêm các thao tác mới
3. **Tập trung logic**: Logic xử lý được tập trung trong visitor
4. **Nguyên tắc SRP**: Tuân thủ nguyên tắc Single Responsibility

### 4.2 Nhược điểm
1. **Phức tạp**: Có thể phức tạp hóa code với nhiều visitor
2. **Vi phạm đóng gói**: Visitor cần truy cập vào trạng thái nội bộ
3. **Khó thêm element**: Khó thêm loại element mới
4. **Tăng phụ thuộc**: Tăng sự phụ thuộc giữa các thành phần

## 5. Khi nào nên sử dụng Visitor Pattern?

1. **Thao tác phức tạp**: Khi cần thực hiện các thao tác phức tạp
2. **Cấu trúc ổn định**: Khi cấu trúc đối tượng ít thay đổi
3. **Nhiều thao tác**: Khi có nhiều thao tác khác nhau trên cùng đối tượng
4. **Tách biệt logic**: Khi muốn tách biệt logic xử lý khỏi đối tượng
5. **Xử lý theo loại**: Khi cần xử lý khác nhau cho từng loại đối tượng

## 6. Kết luận

Visitor Pattern là một mẫu thiết kế mạnh mẽ cho phép thêm các thao tác mới vào cấu trúc đối tượng mà không cần thay đổi cấu trúc đó. Pattern này đặc biệt hữu ích trong JavaScript/TypeScript khi làm việc với các cấu trúc đối tượng phức tạp và cần thực hiện nhiều thao tác khác nhau. Tuy nhiên, cần cân nhắc về tính phức tạp và sự phụ thuộc khi sử dụng pattern này.

Trong bài viết tiếp theo, chúng ta sẽ tìm hiểu về Dependency Injection Pattern - một mẫu thiết kế hiện đại giúp quản lý sự phụ thuộc giữa các thành phần trong ứng dụng. 