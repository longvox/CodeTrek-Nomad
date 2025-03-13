---
title: "Behavioral Pattern [2/11] - Iterator Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-06-04
description: "Iterator Pattern là một mẫu thiết kế hành vi cho phép duyệt qua các phần tử của một tập hợp mà không cần biết về cấu trúc bên trong của nó. Bài viết này phân tích cách triển khai Iterator Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "iterator-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Iterator
  - Behavioral Patterns
---

## 1. Iterator Pattern là gì?

Iterator Pattern là một mẫu thiết kế hành vi cho phép duyệt qua các phần tử của một tập hợp tuần tự mà không cần phải biết chi tiết về cấu trúc bên trong của tập hợp đó. Pattern này tách biệt logic duyệt khỏi tập hợp, cho phép nhiều cách duyệt khác nhau trên cùng một tập hợp.

Các thành phần chính trong Iterator Pattern:
- **Iterator**: Interface định nghĩa các phương thức để duyệt qua tập hợp
- **ConcreteIterator**: Triển khai Iterator interface
- **Aggregate**: Interface định nghĩa phương thức tạo Iterator
- **ConcreteAggregate**: Triển khai Aggregate interface và trả về Iterator cụ thể

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về Collection Iterator

```javascript
// Iterator interface
class Iterator {
  hasNext() {
    throw new Error('hasNext() must be implemented');
  }

  next() {
    throw new Error('next() must be implemented');
  }

  current() {
    throw new Error('current() must be implemented');
  }

  reset() {
    throw new Error('reset() must be implemented');
  }
}

// Concrete Iterator
class ArrayIterator extends Iterator {
  constructor(collection) {
    super();
    this.collection = collection;
    this.position = 0;
  }

  hasNext() {
    return this.position < this.collection.length;
  }

  next() {
    const item = this.collection[this.position];
    this.position++;
    return item;
  }

  current() {
    return this.collection[this.position];
  }

  reset() {
    this.position = 0;
  }
}

// Aggregate interface
class Collection {
  getIterator() {
    throw new Error('getIterator() must be implemented');
  }
}

// Concrete Aggregate
class NumberCollection extends Collection {
  constructor() {
    super();
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  getItems() {
    return this.items;
  }

  getIterator() {
    return new ArrayIterator(this.items);
  }
}

// Usage
const numbers = new NumberCollection();
numbers.addItem(1);
numbers.addItem(2);
numbers.addItem(3);
numbers.addItem(4);
numbers.addItem(5);

const iterator = numbers.getIterator();

while (iterator.hasNext()) {
  console.log(iterator.next());
}

// Reset and iterate again
iterator.reset();
console.log('Iterating again...');

while (iterator.hasNext()) {
  console.log(iterator.next());
}
```

### 2.2 Ví dụ về Tree Iterator

```javascript
// Tree Node
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Tree Iterator Interface
class TreeIterator {
  hasNext() {
    throw new Error('hasNext() must be implemented');
  }

  next() {
    throw new Error('next() must be implemented');
  }
}

// In-order Iterator
class InOrderIterator extends TreeIterator {
  constructor(root) {
    super();
    this.stack = [];
    this.current = root;
  }

  hasNext() {
    return this.current || this.stack.length > 0;
  }

  next() {
    while (this.current) {
      this.stack.push(this.current);
      this.current = this.current.left;
    }

    const node = this.stack.pop();
    this.current = node.right;

    return node.value;
  }
}

// Pre-order Iterator
class PreOrderIterator extends TreeIterator {
  constructor(root) {
    super();
    this.stack = [root];
  }

  hasNext() {
    return this.stack.length > 0;
  }

  next() {
    const node = this.stack.pop();
    
    if (node.right) {
      this.stack.push(node.right);
    }
    if (node.left) {
      this.stack.push(node.left);
    }

    return node.value;
  }
}

// Binary Tree
class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const node = new TreeNode(value);

    if (!this.root) {
      this.root = node;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          break;
        }
        current = current.right;
      }
    }
  }

  getInOrderIterator() {
    return new InOrderIterator(this.root);
  }

  getPreOrderIterator() {
    return new PreOrderIterator(this.root);
  }
}

// Usage
const tree = new BinaryTree();
tree.insert(4);
tree.insert(2);
tree.insert(6);
tree.insert(1);
tree.insert(3);
tree.insert(5);
tree.insert(7);

console.log('In-order traversal:');
const inOrderIterator = tree.getInOrderIterator();
while (inOrderIterator.hasNext()) {
  console.log(inOrderIterator.next());
}

console.log('\nPre-order traversal:');
const preOrderIterator = tree.getPreOrderIterator();
while (preOrderIterator.hasNext()) {
  console.log(preOrderIterator.next());
}
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về Generic Iterator

```typescript
// Iterator interface
interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
  current(): T;
  reset(): void;
}

// Aggregate interface
interface Aggregate<T> {
  getIterator(): Iterator<T>;
}

// Concrete Iterator
class ListIterator<T> implements Iterator<T> {
  private position: number = 0;

  constructor(private collection: T[]) {}

  hasNext(): boolean {
    return this.position < this.collection.length;
  }

  next(): T {
    return this.collection[this.position++];
  }

  current(): T {
    return this.collection[this.position];
  }

  reset(): void {
    this.position = 0;
  }
}

// Concrete Aggregate
class List<T> implements Aggregate<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getItems(): T[] {
    return this.items;
  }

  getIterator(): Iterator<T> {
    return new ListIterator<T>(this.items);
  }
}

// Usage with different types
interface User {
  id: number;
  name: string;
}

const numberList = new List<number>();
numberList.add(1);
numberList.add(2);
numberList.add(3);

const numberIterator = numberList.getIterator();
while (numberIterator.hasNext()) {
  console.log(numberIterator.next());
}

const userList = new List<User>();
userList.add({ id: 1, name: 'John' });
userList.add({ id: 2, name: 'Jane' });
userList.add({ id: 3, name: 'Bob' });

const userIterator = userList.getIterator();
while (userIterator.hasNext()) {
  const user = userIterator.next();
  console.log(`${user.id}: ${user.name}`);
}
```

### 3.2 Ví dụ về Matrix Iterator

```typescript
// Matrix interface
interface Matrix<T> {
  get(row: number, col: number): T;
  set(row: number, col: number, value: T): void;
  getRows(): number;
  getCols(): number;
}

// Matrix Iterator interface
interface MatrixIterator<T> {
  hasNext(): boolean;
  next(): T;
}

// Matrix implementations
class SimpleMatrix<T> implements Matrix<T> {
  private data: T[][];

  constructor(rows: number, cols: number) {
    this.data = Array(rows).fill(null).map(() => Array(cols).fill(null));
  }

  get(row: number, col: number): T {
    return this.data[row][col];
  }

  set(row: number, col: number, value: T): void {
    this.data[row][col] = value;
  }

  getRows(): number {
    return this.data.length;
  }

  getCols(): number {
    return this.data[0].length;
  }
}

// Row-wise Iterator
class RowWiseIterator<T> implements MatrixIterator<T> {
  private currentRow: number = 0;
  private currentCol: number = 0;

  constructor(private matrix: Matrix<T>) {}

  hasNext(): boolean {
    return this.currentRow < this.matrix.getRows();
  }

  next(): T {
    const value = this.matrix.get(this.currentRow, this.currentCol);
    
    this.currentCol++;
    if (this.currentCol >= this.matrix.getCols()) {
      this.currentCol = 0;
      this.currentRow++;
    }

    return value;
  }
}

// Column-wise Iterator
class ColumnWiseIterator<T> implements MatrixIterator<T> {
  private currentRow: number = 0;
  private currentCol: number = 0;

  constructor(private matrix: Matrix<T>) {}

  hasNext(): boolean {
    return this.currentCol < this.matrix.getCols();
  }

  next(): T {
    const value = this.matrix.get(this.currentRow, this.currentCol);
    
    this.currentRow++;
    if (this.currentRow >= this.matrix.getRows()) {
      this.currentRow = 0;
      this.currentCol++;
    }

    return value;
  }
}

// Matrix with iterators
class IterableMatrix<T> extends SimpleMatrix<T> {
  getRowWiseIterator(): MatrixIterator<T> {
    return new RowWiseIterator<T>(this);
  }

  getColumnWiseIterator(): MatrixIterator<T> {
    return new ColumnWiseIterator<T>(this);
  }
}

// Usage
const matrix = new IterableMatrix<number>(3, 3);

// Fill matrix
let value = 1;
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    matrix.set(i, j, value++);
  }
}

console.log('Row-wise iteration:');
const rowIterator = matrix.getRowWiseIterator();
while (rowIterator.hasNext()) {
  console.log(rowIterator.next());
}

console.log('\nColumn-wise iteration:');
const colIterator = matrix.getColumnWiseIterator();
while (colIterator.hasNext()) {
  console.log(colIterator.next());
}
```

## 4. Trường hợp sử dụng thực tế

### 4.1 Custom Collection với Filtering Iterator

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

class FilteringIterator<T> implements Iterator<T> {
  private filteredItems: T[];
  private position: number = 0;

  constructor(
    items: T[],
    private predicate: (item: T) => boolean
  ) {
    this.filteredItems = items.filter(predicate);
  }

  hasNext(): boolean {
    return this.position < this.filteredItems.length;
  }

  next(): T {
    return this.filteredItems[this.position++];
  }

  current(): T {
    return this.filteredItems[this.position];
  }

  reset(): void {
    this.position = 0;
  }
}

class ProductCollection implements Aggregate<Product> {
  private products: Product[] = [];

  addProduct(product: Product): void {
    this.products.push(product);
  }

  getIterator(): Iterator<Product> {
    return new ListIterator<Product>(this.products);
  }

  getPriceFilterIterator(minPrice: number): Iterator<Product> {
    return new FilteringIterator<Product>(
      this.products,
      product => product.price >= minPrice
    );
  }

  getCategoryFilterIterator(category: string): Iterator<Product> {
    return new FilteringIterator<Product>(
      this.products,
      product => product.category === category
    );
  }
}

// Usage
const products = new ProductCollection();

products.addProduct({ id: 1, name: 'Laptop', price: 1200, category: 'Electronics' });
products.addProduct({ id: 2, name: 'Smartphone', price: 800, category: 'Electronics' });
products.addProduct({ id: 3, name: 'Book', price: 20, category: 'Books' });
products.addProduct({ id: 4, name: 'Tablet', price: 500, category: 'Electronics' });

console.log('Products over $1000:');
const expensiveProducts = products.getPriceFilterIterator(1000);
while (expensiveProducts.hasNext()) {
  const product = expensiveProducts.next();
  console.log(`${product.name}: $${product.price}`);
}

console.log('\nElectronics products:');
const electronicsProducts = products.getCategoryFilterIterator('Electronics');
while (electronicsProducts.hasNext()) {
  const product = electronicsProducts.next();
  console.log(`${product.name}: ${product.category}`);
}
```

### 4.2 File System Iterator

```typescript
interface FileSystemNode {
  name: string;
  isDirectory(): boolean;
  getSize(): number;
}

class File implements FileSystemNode {
  constructor(
    public name: string,
    private size: number
  ) {}

  isDirectory(): boolean {
    return false;
  }

  getSize(): number {
    return this.size;
  }
}

class Directory implements FileSystemNode {
  private children: FileSystemNode[] = [];

  constructor(public name: string) {}

  add(node: FileSystemNode): void {
    this.children.push(node);
  }

  isDirectory(): boolean {
    return true;
  }

  getSize(): number {
    return this.children.reduce((sum, node) => sum + node.getSize(), 0);
  }

  getChildren(): FileSystemNode[] {
    return this.children;
  }
}

// Depth-First Iterator
class DepthFirstIterator implements Iterator<FileSystemNode> {
  private stack: FileSystemNode[] = [];

  constructor(root: FileSystemNode) {
    this.stack.push(root);
  }

  hasNext(): boolean {
    return this.stack.length > 0;
  }

  next(): FileSystemNode {
    if (!this.hasNext()) {
      throw new Error('No more elements');
    }

    const node = this.stack.pop()!;

    if (node.isDirectory()) {
      const directory = node as Directory;
      const children = directory.getChildren();
      for (let i = children.length - 1; i >= 0; i--) {
        this.stack.push(children[i]);
      }
    }

    return node;
  }

  current(): FileSystemNode {
    return this.stack[this.stack.length - 1];
  }

  reset(): void {
    this.stack = [];
  }
}

// Usage
const root = new Directory('root');

const docs = new Directory('docs');
docs.add(new File('readme.md', 100));
docs.add(new File('contributing.md', 200));

const src = new Directory('src');
src.add(new File('index.ts', 300));
src.add(new File('app.ts', 400));

const tests = new Directory('tests');
tests.add(new File('app.test.ts', 500));

src.add(tests);
root.add(docs);
root.add(src);

const iterator = new DepthFirstIterator(root);

while (iterator.hasNext()) {
  const node = iterator.next();
  const indent = '  '.repeat(node.name.split('/').length - 1);
  console.log(`${indent}${node.name} (${node.getSize()} bytes)`);
}
```

## 5. Ưu điểm và Nhược điểm

### 5.1 Ưu điểm
1. **Nguyên tắc Single Responsibility**: Tách biệt logic duyệt khỏi tập hợp.
2. **Open/Closed Principle**: Dễ dàng thêm các iterator mới mà không thay đổi tập hợp.
3. **Đơn giản hóa interface**: Client không cần biết về cấu trúc bên trong của tập hợp.

### 5.2 Nhược điểm
1. **Phức tạp hóa**: Với tập hợp đơn giản, việc sử dụng iterator có thể là thừa.
2. **Hiệu năng**: Một số triển khai có thể kém hiệu quả hơn duyệt trực tiếp.
3. **Quản lý trạng thái**: Cần lưu ý về trạng thái của iterator trong môi trường đa luồng.

## 6. Kết luận

Iterator Pattern là một công cụ mạnh mẽ cho việc duyệt qua các tập hợp phức tạp một cách thống nhất. Pattern này đặc biệt hữu ích khi làm việc với các cấu trúc dữ liệu phức tạp hoặc khi cần nhiều cách duyệt khác nhau trên cùng một tập hợp. JavaScript và TypeScript cung cấp nhiều tính năng tích hợp cho iterator, nhưng việc hiểu và triển khai pattern này vẫn quan trọng cho việc xây dựng các giải pháp tùy chỉnh.
