---
title: "Behavioral Pattern [9/11] - Strategy Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-07-23
description: "Strategy Pattern là một mẫu thiết kế hành vi cho phép định nghĩa một họ các thuật toán, đóng gói từng thuật toán và làm cho chúng có thể hoán đổi cho nhau. Bài viết này phân tích cách triển khai Strategy Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "strategy-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Strategy
  - Behavioral Patterns
---

## 1. Strategy Pattern là gì?

Strategy Pattern là một mẫu thiết kế hành vi cho phép bạn định nghĩa một họ các thuật toán, đóng gói từng thuật toán và làm cho chúng có thể hoán đổi cho nhau. Pattern này cho phép thuật toán thay đổi độc lập với các client sử dụng nó.

Các thành phần chính trong Strategy Pattern:
- **Context**: Lớp chứa tham chiếu đến strategy và gọi thuật toán thông qua interface strategy
- **Strategy**: Interface chung cho tất cả các thuật toán cụ thể
- **ConcreteStrategy**: Các lớp triển khai Strategy interface với các thuật toán cụ thể

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về Payment Processing

```javascript
// Strategy interface (implicit in JavaScript)
class PaymentStrategy {
  pay(amount) {
    throw new Error('Phương thức pay() phải được triển khai');
  }
}

// Concrete Strategies
class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber, cvv, expiryDate) {
    super();
    this.cardNumber = cardNumber;
    this.cvv = cvv;
    this.expiryDate = expiryDate;
  }

  pay(amount) {
    console.log(`Thanh toán ${amount}đ bằng thẻ tín dụng ${this.cardNumber}`);
    return true;
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(email) {
    super();
    this.email = email;
  }

  pay(amount) {
    console.log(`Thanh toán ${amount}đ qua PayPal với tài khoản ${this.email}`);
    return true;
  }
}

class MomoPayment extends PaymentStrategy {
  constructor(phoneNumber) {
    super();
    this.phoneNumber = phoneNumber;
  }

  pay(amount) {
    console.log(`Thanh toán ${amount}đ qua Momo với số điện thoại ${this.phoneNumber}`);
    return true;
  }
}

// Context
class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  addItem(item) {
    this.items.push(item);
  }

  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  calculateTotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  checkout() {
    if (!this.paymentStrategy) {
      throw new Error('Vui lòng chọn phương thức thanh toán');
    }

    const amount = this.calculateTotal();
    return this.paymentStrategy.pay(amount);
  }
}

// Usage
const cart = new ShoppingCart();

// Thêm sản phẩm vào giỏ hàng
cart.addItem({ name: 'Laptop', price: 20000000 });
cart.addItem({ name: 'Chuột', price: 500000 });

// Thanh toán bằng thẻ tín dụng
cart.setPaymentStrategy(new CreditCardPayment('4111-1111-1111-1111', '123', '12/25'));
cart.checkout();

// Thanh toán qua PayPal
cart.setPaymentStrategy(new PayPalPayment('user@example.com'));
cart.checkout();

// Thanh toán qua Momo
cart.setPaymentStrategy(new MomoPayment('0123456789'));
cart.checkout();
```

### 2.2 Ví dụ về Text Formatting

```javascript
// Strategy interface
class TextFormattingStrategy {
  format(text) {
    throw new Error('Phương thức format() phải được triển khai');
  }
}

// Concrete Strategies
class PlainTextStrategy extends TextFormattingStrategy {
  format(text) {
    return text;
  }
}

class MarkdownStrategy extends TextFormattingStrategy {
  format(text) {
    // Định dạng tiêu đề
    text = text.replace(/^# (.+)$/gm, '# $1\n');
    text = text.replace(/^## (.+)$/gm, '## $1\n');

    // Định dạng in đậm và in nghiêng
    text = text.replace(/\*\*(.+?)\*\*/g, '**$1**');
    text = text.replace(/\*(.+?)\*/g, '*$1*');

    // Định dạng danh sách
    text = text.replace(/^- (.+)$/gm, '- $1');

    return text;
  }
}

class HTMLStrategy extends TextFormattingStrategy {
  format(text) {
    // Định dạng tiêu đề
    text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');

    // Định dạng in đậm và in nghiêng
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Định dạng danh sách
    text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
    text = text.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    return text;
  }
}

// Context
class TextEditor {
  constructor(formattingStrategy) {
    this.formattingStrategy = formattingStrategy;
    this.content = '';
  }

  setFormattingStrategy(strategy) {
    this.formattingStrategy = strategy;
  }

  setContent(content) {
    this.content = content;
  }

  formatText() {
    return this.formattingStrategy.format(this.content);
  }
}

// Usage
const editor = new TextEditor(new PlainTextStrategy());

const content = `# Tiêu đề chính
## Tiêu đề phụ

Đây là một **đoạn văn** với *định dạng* khác nhau.

- Mục 1
- Mục 2
- Mục 3`;

editor.setContent(content);

// Sử dụng Plain Text
console.log('Plain Text:');
console.log(editor.formatText());

// Chuyển sang Markdown
console.log('\nMarkdown:');
editor.setFormattingStrategy(new MarkdownStrategy());
console.log(editor.formatText());

// Chuyển sang HTML
console.log('\nHTML:');
editor.setFormattingStrategy(new HTMLStrategy());
console.log(editor.formatText());
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về Sorting Algorithms

```typescript
// Strategy interface
interface SortStrategy<T> {
  sort(data: T[]): T[];
}

// Concrete Strategies
class BubbleSortStrategy<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    console.log('Sử dụng Bubble Sort');
    const arr = [...data];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }

    return arr;
  }
}

class QuickSortStrategy<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    console.log('Sử dụng Quick Sort');
    const arr = [...data];

    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[0];
    const left: T[] = [];
    const right: T[] = [];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }

    return [...this.sort(left), pivot, ...this.sort(right)];
  }
}

class MergeSortStrategy<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    console.log('Sử dụng Merge Sort');
    const arr = [...data];

    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return this.merge(this.sort(left), this.sort(right));
  }

  private merge(left: T[], right: T[]): T[] {
    const result: T[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
  }
}

// Context
class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }

  sort(data: T[]): T[] {
    return this.strategy.sort(data);
  }
}

// Usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
const sorter = new Sorter<number>(new BubbleSortStrategy());

console.log('Mảng ban đầu:', numbers);

// Sử dụng Bubble Sort
console.log('Bubble Sort:', sorter.sort(numbers));

// Chuyển sang Quick Sort
sorter.setStrategy(new QuickSortStrategy());
console.log('Quick Sort:', sorter.sort(numbers));

// Chuyển sang Merge Sort
sorter.setStrategy(new MergeSortStrategy());
console.log('Merge Sort:', sorter.sort(numbers));
```

### 3.2 Ví dụ về Validation Strategies

```typescript
// Strategy interface
interface ValidationStrategy {
  validate(value: string): boolean;
  getErrorMessage(): string;
}

// Concrete Strategies
class EmailValidationStrategy implements ValidationStrategy {
  private errorMessage: string = '';

  validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    this.errorMessage = isValid ? '' : 'Email không hợp lệ';
    return isValid;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}

class PasswordValidationStrategy implements ValidationStrategy {
  private errorMessage: string = '';

  validate(password: string): boolean {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    if (!isValid) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
    } else {
      this.errorMessage = '';
    }

    return isValid;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}

class PhoneNumberValidationStrategy implements ValidationStrategy {
  private errorMessage: string = '';

  validate(phoneNumber: string): boolean {
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    const isValid = phoneRegex.test(phoneNumber);
    this.errorMessage = isValid ? '' : 'Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0 hoặc +84)';
    return isValid;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}

// Context
class FormValidator {
  private strategy: ValidationStrategy;

  constructor(strategy: ValidationStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ValidationStrategy): void {
    this.strategy = strategy;
  }

  validate(value: string): boolean {
    return this.strategy.validate(value);
  }

  getError(): string {
    return this.strategy.getErrorMessage();
  }
}

// Usage
const validator = new FormValidator(new EmailValidationStrategy());

// Kiểm tra email
console.log('\nKiểm tra email:');
console.log('test@example.com:', validator.validate('test@example.com'));
console.log('invalid-email:', validator.validate('invalid-email'));
console.log('Lỗi:', validator.getError());

// Kiểm tra mật khẩu
validator.setStrategy(new PasswordValidationStrategy());
console.log('\nKiểm tra mật khẩu:');
console.log('Abc123!@#:', validator.validate('Abc123!@#'));
console.log('weakpass:', validator.validate('weakpass'));
console.log('Lỗi:', validator.getError());

// Kiểm tra số điện thoại
validator.setStrategy(new PhoneNumberValidationStrategy());
console.log('\nKiểm tra số điện thoại:');
console.log('0123456789:', validator.validate('0123456789'));
console.log('+84123456789:', validator.validate('+84123456789'));
console.log('12345:', validator.validate('12345'));
console.log('Lỗi:', validator.getError());
```

## 4. Ưu điểm và Nhược điểm

### 4.1 Ưu điểm
1. **Tách biệt thuật toán**: Tách biệt các thuật toán khỏi code sử dụng chúng
2. **Dễ mở rộng**: Dễ dàng thêm thuật toán mới mà không ảnh hưởng đến code hiện có
3. **Thay đổi linh hoạt**: Có thể thay đổi thuật toán trong thời gian chạy
4. **Tái sử dụng**: Các thuật toán có thể được tái sử dụng trong nhiều context khác nhau

### 4.2 Nhược điểm
1. **Số lượng lớp tăng**: Mỗi thuật toán cần một lớp riêng
2. **Phức tạp hóa**: Có thể phức tạp hóa code nếu có ít thuật toán
3. **Client phải biết về strategies**: Client cần hiểu sự khác biệt giữa các strategies
4. **Overhead truyền dữ liệu**: Có thể cần truyền nhiều dữ liệu giữa context và strategy

## 5. Khi nào nên sử dụng Strategy Pattern?

1. **Nhiều thuật toán tương tự**: Khi có nhiều thuật toán tương tự nhau
2. **Thay đổi thuật toán**: Khi cần thay đổi thuật toán trong thời gian chạy
3. **Tránh điều kiện phức tạp**: Thay thế các câu lệnh điều kiện phức tạp
4. **Đóng gói thuật toán**: Khi cần đóng gói và tái sử dụng thuật toán
5. **Tách biệt concerns**: Khi muốn tách biệt logic thuật toán khỏi code sử dụng nó

## 6. Kết luận

Strategy Pattern là một mẫu thiết kế mạnh mẽ cho phép quản lý và thay đổi thuật toán một cách linh hoạt. Pattern này đặc biệt hữu ích trong JavaScript / TypeScript khi làm việc với các hệ thống cần thay đổi thuật toán trong thời gian chạy. Tuy nhiên, cần cân nhắc về số lượng lớp và độ phức tạp khi sử dụng pattern này.