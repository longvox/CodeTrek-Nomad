---
title: "Structural Pattern [3/7] - Composite Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-05-14
description: "Composite Pattern là một mẫu thiết kế cấu trúc cho phép bạn tổ chức các đối tượng thành cấu trúc cây và làm việc với chúng như với các đối tượng riêng lẻ. Bài viết này phân tích cách triển khai Composite Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "composite-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Composite
  - Structural Patterns
---

## 1. Composite Pattern là gì?

Composite Pattern là một mẫu thiết kế cấu trúc cho phép bạn tổ chức các đối tượng thành cấu trúc cây và làm việc với chúng như với các đối tượng riêng lẻ. Pattern này rất hữu ích khi bạn cần xử lý một nhóm đối tượng giống như xử lý một đối tượng đơn lẻ.

Các thành phần chính trong Composite Pattern:
- **Component**: Interface hoặc abstract class định nghĩa các phương thức chung cho tất cả các thành phần
- **Leaf**: Đối tượng cơ bản không có con
- **Composite**: Đối tượng chứa các đối tượng con (có thể là Leaf hoặc Composite khác)

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về File System

```javascript
// Component
class FileSystemItem {
  constructor(name) {
    this.name = name;
  }
  
  getSize() {
    throw new Error('getSize() must be implemented');
  }
  
  print(indent = '') {
    throw new Error('print() must be implemented');
  }
}

// Leaf
class File extends FileSystemItem {
  constructor(name, size) {
    super(name);
    this.size = size;
  }
  
  getSize() {
    return this.size;
  }
  
  print(indent = '') {
    console.log(`${indent}📄 ${this.name} (${this.size} bytes)`);
  }
}

// Composite
class Directory extends FileSystemItem {
  constructor(name) {
    super(name);
    this.items = [];
  }
  
  add(item) {
    this.items.push(item);
  }
  
  remove(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
  
  getSize() {
    return this.items.reduce((sum, item) => sum + item.getSize(), 0);
  }
  
  print(indent = '') {
    console.log(`${indent}📁 ${this.name}/`);
    this.items.forEach(item => item.print(indent + '  '));
  }
}

// Usage
const root = new Directory('root');
const docs = new Directory('docs');
const pictures = new Directory('pictures');

const resume = new File('resume.pdf', 1024);
const avatar = new File('avatar.jpg', 2048);
const photo = new File('photo.jpg', 3072);

docs.add(resume);
pictures.add(avatar);
pictures.add(photo);

root.add(docs);
root.add(pictures);

root.print();
console.log(`Total size: ${root.getSize()} bytes`);
```

### 2.2 Ví dụ về UI Component Tree

```javascript
// Component
class UIComponent {
  constructor(name) {
    this.name = name;
  }
  
  render() {
    throw new Error('render() must be implemented');
  }
  
  add(component) {
    throw new Error('add() not supported');
  }
  
  remove(component) {
    throw new Error('remove() not supported');
  }
  
  getChild(index) {
    throw new Error('getChild() not supported');
  }
}

// Leaf components
class Button extends UIComponent {
  constructor(name, text) {
    super(name);
    this.text = text;
  }
  
  render() {
    return `<button>${this.text}</button>`;
  }
}

class Input extends UIComponent {
  constructor(name, type = 'text', placeholder = '') {
    super(name);
    this.type = type;
    this.placeholder = placeholder;
  }
  
  render() {
    return `<input type="${this.type}" placeholder="${this.placeholder}">`;
  }
}

// Composite component
class Container extends UIComponent {
  constructor(name, className = '') {
    super(name);
    this.className = className;
    this.children = [];
  }
  
  add(component) {
    this.children.push(component);
  }
  
  remove(component) {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
  
  getChild(index) {
    return this.children[index];
  }
  
  render() {
    const childrenHtml = this.children.map(child => child.render()).join('\n');
    return `
<div class="${this.className}">
  ${childrenHtml}
</div>`;
  }
}

// Usage
const form = new Container('loginForm', 'form');
const header = new Container('header', 'form-header');
const body = new Container('body', 'form-body');

const title = new Container('title', 'title');
title.add(new Button('titleText', 'Login Form'));

const username = new Input('username', 'text', 'Enter username');
const password = new Input('password', 'password', 'Enter password');
const submitBtn = new Button('submit', 'Submit');

header.add(title);
body.add(username);
body.add(password);
body.add(submitBtn);

form.add(header);
form.add(body);

console.log(form.render());
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về Menu System

```typescript
// Component interface
interface MenuComponent {
  getName(): string;
  getDescription(): string;
  getPrice(): number;
  isVegetarian(): boolean;
  print(): void;
}

// Leaf
class MenuItem implements MenuComponent {
  constructor(
    private name: string,
    private description: string,
    private vegetarian: boolean,
    private price: number
  ) {}

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  isVegetarian(): boolean {
    return this.vegetarian;
  }

  print(): void {
    console.log(
      `  ${this.getName()} ${this.isVegetarian() ? '(v)' : ''}, ${this.getPrice()}đ`
    );
    console.log(`     -- ${this.getDescription()}`);
  }
}

// Composite
class Menu implements MenuComponent {
  private menuComponents: MenuComponent[] = [];

  constructor(
    private name: string,
    private description: string
  ) {}

  add(menuComponent: MenuComponent): void {
    this.menuComponents.push(menuComponent);
  }

  remove(menuComponent: MenuComponent): void {
    const index = this.menuComponents.indexOf(menuComponent);
    if (index !== -1) {
      this.menuComponents.splice(index, 1);
    }
  }

  getChild(index: number): MenuComponent {
    return this.menuComponents[index];
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.menuComponents.reduce((sum, item) => sum + item.getPrice(), 0);
  }

  isVegetarian(): boolean {
    return this.menuComponents.every(item => item.isVegetarian());
  }

  print(): void {
    console.log(`\n${this.getName()}`);
    console.log(`${'-'.repeat(this.getName().length)}`);
    console.log(`${this.getDescription()}\n`);

    this.menuComponents.forEach(menuComponent => {
      menuComponent.print();
    });
  }
}

// Usage
const allMenus = new Menu('LONG RESTAURANT MENU', 'All menus combined');

const dinerMenu = new Menu(
  'DINNER MENU',
  'Dinner menu available from 5pm to 10pm'
);

const cafeMenu = new Menu(
  'CAFE MENU',
  'Available all day'
);

const dessertMenu = new Menu(
  'DESSERT MENU',
  'Enjoy our homemade desserts'
);

allMenus.add(dinerMenu);
allMenus.add(cafeMenu);
dinerMenu.add(dessertMenu);

dinerMenu.add(new MenuItem(
  'Pasta',
  'Spaghetti with marinara sauce',
  true,
  120000
));

cafeMenu.add(new MenuItem(
  'Cafe Latte',
  'Coffee with steamed milk',
  true,
  45000
));

dessertMenu.add(new MenuItem(
  'Apple Pie',
  'Apple pie with vanilla ice cream',
  true,
  65000
));

allMenus.print();
```

## 4. Trường hợp sử dụng thực tế

### 4.1 Xây dựng UI Component Library

Composite Pattern rất phổ biến trong các thư viện UI như React, Vue.js, nơi các component có thể chứa các component con khác. Ví dụ:

```typescript
interface Props {
  children?: React.ReactNode;
  className?: string;
}

// Component base
abstract class UIComponent<P extends Props = Props> {
  abstract render(props: P): React.ReactNode;
}

// Leaf components
class Button extends UIComponent {
  render({ children, className }: Props) {
    return <button className={className}>{children}</button>;
  }
}

class Input extends UIComponent<Props & { type?: string; placeholder?: string }> {
  render({ type = 'text', placeholder, className }: Props & { type?: string; placeholder?: string }) {
    return <input type={type} placeholder={placeholder} className={className} />;
  }
}

// Composite component
class Container extends UIComponent {
  render({ children, className }: Props) {
    return <div className={className}>{children}</div>;
  }
}
```

### 4.2 Quản lý Cấu trúc Tổ chức

Composite Pattern hữu ích khi xây dựng hệ thống quản lý cấu trúc tổ chức phân cấp:

```typescript
interface Employee {
  getName(): string;
  getSalary(): number;
  getRole(): string;
  add?(employee: Employee): void;
  remove?(employee: Employee): void;
  getSubordinates?(): Employee[];
}

// Leaf
class Developer implements Employee {
  constructor(
    private name: string,
    private salary: number
  ) {}

  getName(): string {
    return this.name;
  }

  getSalary(): number {
    return this.salary;
  }

  getRole(): string {
    return 'Developer';
  }
}

// Composite
class Manager implements Employee {
  private subordinates: Employee[] = [];

  constructor(
    private name: string,
    private salary: number
  ) {}

  getName(): string {
    return this.name;
  }

  getSalary(): number {
    return this.salary;
  }

  getRole(): string {
    return 'Manager';
  }

  add(employee: Employee): void {
    this.subordinates.push(employee);
  }

  remove(employee: Employee): void {
    const index = this.subordinates.indexOf(employee);
    if (index !== -1) {
      this.subordinates.splice(index, 1);
    }
  }

  getSubordinates(): Employee[] {
    return [...this.subordinates];
  }

  getTotalSalary(): number {
    return this.salary + this.subordinates.reduce(
      (sum, employee) => sum + employee.getSalary(),
      0
    );
  }
}
```

## 5. Ưu điểm và Nhược điểm

### 5.1 Ưu điểm
1. **Đơn giản hóa cấu trúc phân cấp**: Client có thể xử lý các đối tượng đơn lẻ và tổ hợp một cách thống nhất.
2. **Dễ dàng mở rộng**: Có thể thêm các loại component mới mà không ảnh hưởng đến code hiện có.
3. **Tái sử dụng code**: Các component có thể được tái sử dụng trong các cấu trúc phân cấp khác nhau.

### 5.2 Nhược điểm
1. **Khó thiết kế interface chung**: Đôi khi khó để thiết kế một interface phù hợp cho cả leaf và composite.
2. **Có thể trở nên phức tạp**: Khi cấu trúc cây quá sâu, việc debug và bảo trì có thể trở nên khó khăn.
3. **Hiệu năng**: Với cấu trúc cây lớn, việc duyệt qua tất cả các node có thể tốn nhiều tài nguyên.

## 6. Kết luận

Composite Pattern là một mẫu thiết kế mạnh mẽ cho phép xây dựng các cấu trúc phân cấp phức tạp. Pattern này đặc biệt hữu ích trong phát triển UI, quản lý file system, và các hệ thống có cấu trúc cây. Tuy nhiên, cần cân nhắc kỹ về thiết kế interface và độ phức tạp của cấu trúc để đảm bảo tính bảo trì và hiệu năng của hệ thống.
