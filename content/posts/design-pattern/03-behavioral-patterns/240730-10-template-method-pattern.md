---
title: "Behavioral Pattern [10/11] - Template Method Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-07-30
description: "Template Method Pattern là một mẫu thiết kế hành vi định nghĩa bộ khung của một thuật toán trong một phương thức, cho phép các lớp con ghi đè các bước cụ thể của thuật toán mà không thay đổi cấu trúc của nó. Bài viết này phân tích cách triển khai Template Method Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "template-method-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Template Method
  - Behavioral Patterns
---

## 1. Template Method Pattern là gì?

Template Method Pattern là một mẫu thiết kế hành vi định nghĩa bộ khung của một thuật toán trong một phương thức, cho phép các lớp con ghi đè các bước cụ thể của thuật toán mà không thay đổi cấu trúc của nó. Pattern này cho phép bạn định nghĩa một thuật toán cơ bản trong một lớp cơ sở và để các lớp con ghi đè các phần của thuật toán mà không thay đổi cấu trúc tổng thể.

Các thành phần chính trong Template Method Pattern:
- **Abstract Class**: Định nghĩa các phương thức trừu tượng và template method
- **Concrete Class**: Triển khai các phương thức trừu tượng
- **Template Method**: Định nghĩa bộ khung của thuật toán

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về Data Mining

```javascript
// Abstract Class
class DataMiner {
  // Template method
  mine() {
    const data = this.extractData();
    const cleanedData = this.cleanData(data);
    const analysis = this.analyzeData(cleanedData);
    return this.presentResults(analysis);
  }

  extractData() {
    throw new Error('extractData() phải được triển khai');
  }

  cleanData(data) {
    throw new Error('cleanData() phải được triển khai');
  }

  analyzeData(data) {
    throw new Error('analyzeData() phải được triển khai');
  }

  presentResults(analysis) {
    throw new Error('presentResults() phải được triển khai');
  }
}

// Concrete Classes
class PDFDataMiner extends DataMiner {
  extractData() {
    console.log('Đang trích xuất dữ liệu từ PDF...');
    return ['raw', 'pdf', 'data'];
  }

  cleanData(data) {
    console.log('Đang làm sạch dữ liệu PDF...');
    return data.map(item => item.trim());
  }

  analyzeData(data) {
    console.log('Đang phân tích dữ liệu PDF...');
    return {
      type: 'pdf',
      items: data,
      count: data.length
    };
  }

  presentResults(analysis) {
    console.log('Đang trình bày kết quả phân tích PDF...');
    return `PDF Analysis: ${JSON.stringify(analysis)}`;
  }
}

class CSVDataMiner extends DataMiner {
  extractData() {
    console.log('Đang trích xuất dữ liệu từ CSV...');
    return ['raw', 'csv', 'data'];
  }

  cleanData(data) {
    console.log('Đang làm sạch dữ liệu CSV...');
    return data.filter(item => item !== '');
  }

  analyzeData(data) {
    console.log('Đang phân tích dữ liệu CSV...');
    return {
      type: 'csv',
      items: data,
      count: data.length
    };
  }

  presentResults(analysis) {
    console.log('Đang trình bày kết quả phân tích CSV...');
    return `CSV Analysis: ${JSON.stringify(analysis)}`;
  }
}

// Usage
const pdfMiner = new PDFDataMiner();
console.log(pdfMiner.mine());

const csvMiner = new CSVDataMiner();
console.log(csvMiner.mine());
```

### 2.2 Ví dụ về Build Process

```javascript
class BuildProcess {
  // Template method
  build() {
    this.test();
    this.lint();
    this.compile();
    this.package();
    if (this.shouldNotify()) {
      this.notify();
    }
  }

  test() {
    throw new Error('test() phải được triển khai');
  }

  lint() {
    throw new Error('lint() phải được triển khai');
  }

  compile() {
    throw new Error('compile() phải được triển khai');
  }

  package() {
    throw new Error('package() phải được triển khai');
  }

  // Hook method
  shouldNotify() {
    return true;
  }

  notify() {
    console.log('Build hoàn thành!');
  }
}

class JavaScriptBuildProcess extends BuildProcess {
  test() {
    console.log('Chạy Jest tests...');
  }

  lint() {
    console.log('Chạy ESLint...');
  }

  compile() {
    console.log('Biên dịch với Babel...');
  }

  package() {
    console.log('Đóng gói với Webpack...');
  }

  shouldNotify() {
    // Chỉ thông báo khi build production
    return process.env.NODE_ENV === 'production';
  }
}

class TypeScriptBuildProcess extends BuildProcess {
  test() {
    console.log('Chạy Jest tests với ts-jest...');
  }

  lint() {
    console.log('Chạy TSLint...');
  }

  compile() {
    console.log('Biên dịch với TypeScript Compiler...');
  }

  package() {
    console.log('Đóng gói với Webpack và ts-loader...');
  }
}

// Usage
const jsBuild = new JavaScriptBuildProcess();
console.log('Building JavaScript project...');
jsBuild.build();

const tsBuild = new TypeScriptBuildProcess();
console.log('\nBuilding TypeScript project...');
tsBuild.build();
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về Document Generator

```typescript
// Abstract Class
abstract class DocumentGenerator {
  // Template method
  public generate(): string {
    this.validateData();
    const content = this.generateContent();
    const formatted = this.format(content);
    this.save(formatted);
    if (this.shouldSendNotification()) {
      this.sendNotification();
    }
    return formatted;
  }

  protected abstract validateData(): void;
  protected abstract generateContent(): string;
  protected abstract format(content: string): string;
  protected abstract save(document: string): void;

  // Hook method
  protected shouldSendNotification(): boolean {
    return false;
  }

  protected sendNotification(): void {
    console.log('Tài liệu đã được tạo thành công!');
  }
}

// Concrete Classes
class PDFGenerator extends DocumentGenerator {
  protected validateData(): void {
    console.log('Đang xác thực dữ liệu cho PDF...');
  }

  protected generateContent(): string {
    console.log('Đang tạo nội dung PDF...');
    return 'PDF Content';
  }

  protected format(content: string): string {
    console.log('Đang định dạng PDF...');
    return `Formatted PDF: ${content}`;
  }

  protected save(document: string): void {
    console.log(`Đang lưu PDF: ${document}`);
  }

  protected shouldSendNotification(): boolean {
    return true;
  }
}

class HTMLGenerator extends DocumentGenerator {
  protected validateData(): void {
    console.log('Đang xác thực dữ liệu cho HTML...');
  }

  protected generateContent(): string {
    console.log('Đang tạo nội dung HTML...');
    return 'HTML Content';
  }

  protected format(content: string): string {
    console.log('Đang định dạng HTML...');
    return `<html><body>${content}</body></html>`;
  }

  protected save(document: string): void {
    console.log(`Đang lưu HTML: ${document}`);
  }
}

// Usage
const pdfGenerator = new PDFGenerator();
console.log('Generating PDF...');
pdfGenerator.generate();

const htmlGenerator = new HTMLGenerator();
console.log('\nGenerating HTML...');
htmlGenerator.generate();
```

### 3.2 Ví dụ về Order Processing

```typescript
// Abstract Class
abstract class OrderProcessor {
  // Template method
  public processOrder(): void {
    this.validateOrder();
    this.calculateTotalAmount();
    if (this.isDiscountApplicable()) {
      this.applyDiscount();
    }
    this.collectPayment();
    this.sendConfirmation();
  }

  protected abstract validateOrder(): void;
  protected abstract calculateTotalAmount(): number;
  protected abstract collectPayment(): void;
  protected abstract sendConfirmation(): void;

  // Hook method
  protected isDiscountApplicable(): boolean {
    return false;
  }

  protected applyDiscount(): void {
    console.log('Áp dụng giảm giá mặc định 10%');
  }
}

interface OrderDetails {
  items: Array<{ name: string; price: number }>;
  customerEmail: string;
}

// Concrete Classes
class OnlineOrderProcessor extends OrderProcessor {
  constructor(private order: OrderDetails) {
    super();
  }

  protected validateOrder(): void {
    console.log('Xác thực đơn hàng online...');
    if (this.order.items.length === 0) {
      throw new Error('Đơn hàng không có sản phẩm');
    }
  }

  protected calculateTotalAmount(): number {
    const total = this.order.items.reduce((sum, item) => sum + item.price, 0);
    console.log(`Tổng giá trị đơn hàng: ${total}`);
    return total;
  }

  protected isDiscountApplicable(): boolean {
    const total = this.calculateTotalAmount();
    return total > 1000000; // Giảm giá cho đơn hàng trên 1 triệu
  }

  protected collectPayment(): void {
    console.log('Xử lý thanh toán online...');
  }

  protected sendConfirmation(): void {
    console.log(`Gửi email xác nhận đến ${this.order.customerEmail}`);
  }
}

class InStoreOrderProcessor extends OrderProcessor {
  constructor(private order: OrderDetails) {
    super();
  }

  protected validateOrder(): void {
    console.log('Xác thực đơn hàng tại cửa hàng...');
    if (this.order.items.length === 0) {
      throw new Error('Đơn hàng không có sản phẩm');
    }
  }

  protected calculateTotalAmount(): number {
    const total = this.order.items.reduce((sum, item) => sum + item.price, 0);
    console.log(`Tổng giá trị đơn hàng: ${total}`);
    return total;
  }

  protected collectPayment(): void {
    console.log('Xử lý thanh toán tại quầy...');
  }

  protected sendConfirmation(): void {
    console.log('In hóa đơn tại quầy...');
  }
}

// Usage
const onlineOrder: OrderDetails = {
  items: [
    { name: 'Laptop', price: 20000000 },
    { name: 'Chuột', price: 500000 }
  ],
  customerEmail: 'customer@example.com'
};

const inStoreOrder: OrderDetails = {
  items: [
    { name: 'Bàn phím', price: 800000 }
  ],
  customerEmail: 'walk-in@example.com'
};

console.log('Xử lý đơn hàng online:');
const onlineProcessor = new OnlineOrderProcessor(onlineOrder);
onlineProcessor.processOrder();

console.log('\nXử lý đơn hàng tại cửa hàng:');
const inStoreProcessor = new InStoreOrderProcessor(inStoreOrder);
inStoreProcessor.processOrder();
```

## 4. Ưu điểm và Nhược điểm

### 4.1 Ưu điểm
1. **Tái sử dụng code**: Tránh trùng lặp code giữa các lớp con
2. **Mở rộng linh hoạt**: Dễ dàng thêm các biến thể mới của thuật toán
3. **Kiểm soát thuật toán**: Lớp cha kiểm soát cấu trúc thuật toán
4. **Tùy chỉnh từng phần**: Cho phép tùy chỉnh các bước cụ thể

### 4.2 Nhược điểm
1. **Giới hạn khung**: Khó thay đổi cấu trúc thuật toán
2. **Vi phạm LSP**: Có thể vi phạm Liskov Substitution Principle
3. **Phức tạp hóa**: Có thể phức tạp hóa code nếu có nhiều bước
4. **Khó debug**: Khó debug khi có nhiều lớp con

## 5. Khi nào nên sử dụng Template Method Pattern?

1. **Thuật toán cố định**: Khi có thuật toán với cấu trúc cố định
2. **Tránh trùng lặp**: Khi có code trùng lặp giữa các lớp
3. **Mở rộng từng phần**: Khi cần cho phép tùy chỉnh một số bước
4. **Kiểm soát mở rộng**: Khi muốn kiểm soát cách lớp con mở rộng
5. **Xử lý theo bước**: Khi có quy trình xử lý theo các bước cố định

## 6. Kết luận

Template Method Pattern là một mẫu thiết kế mạnh mẽ cho phép định nghĩa bộ khung của thuật toán và cho phép các lớp con tùy chỉnh các bước cụ thể. Pattern này đặc biệt hữu ích trong JavaScript / TypeScript khi làm việc với các hệ thống có quy trình xử lý theo các bước cố định. Tuy nhiên, cần cân nhắc về tính linh hoạt và độ phức tạp khi sử dụng pattern này.