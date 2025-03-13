---
title: "Creational Pattern [2/6] - Factory Method Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-03-26
description: "Factory Method là một mẫu thiết kế tạo đối tượng linh hoạt và mạnh mẽ. Bài viết này phân tích cách triển khai Factory Method trong JavaScript và TypeScript, trường hợp sử dụng thực tế và so sánh với các mẫu tạo đối tượng khác."
slug: "factory-method-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Factory Method
  - Creational Patterns
---

## 1. Factory Method Pattern là gì?

Factory Method Pattern là một mẫu thiết kế tạo đối tượng cho phép các lớp con quyết định loại đối tượng nào sẽ được tạo ra. Nó cung cấp một interface để tạo đối tượng nhưng cho phép các lớp con thay đổi loại đối tượng được tạo ra.

Các thành phần chính trong Factory Method Pattern:
- **Product**: Interface hoặc lớp abstract định nghĩa đối tượng sẽ được tạo ra
- **Concrete Product**: Các lớp cụ thể của Product
- **Creator**: Lớp abstract định nghĩa factory method
- **Concrete Creator**: Các lớp con cụ thể triển khai factory method và tạo ra Concrete Product

Factory Method được xây dựng dựa trên nguyên tắc: "Tạo đối tượng trong một phương thức được thiết kế đặc biệt cho mục đích tạo đối tượng".

## 2. Triển khai trong JavaScript

JavaScript với tính năng linh hoạt của nó cho phép triển khai Factory Method Pattern theo nhiều cách khác nhau.

### 2.1 Triển khai cơ bản với hàm factory

Cách đơn giản nhất để triển khai Factory Method trong JavaScript là sử dụng một hàm factory.

```javascript
// Các sản phẩm cụ thể
class JSONFormatter {
  format(data) {
    return JSON.stringify(data, null, 2);
  }
}

class XMLFormatter {
  format(data) {
    // Giả lập chuyển đổi sang XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
    
    for (const [key, value] of Object.entries(data)) {
      xml += `  <${key}>${value}</${key}>\n`;
    }
    
    xml += '</root>';
    return xml;
  }
}

class CSVFormatter {
  format(data) {
    if (!Array.isArray(data)) {
      throw new Error('CSV formatter expects an array of objects');
    }
    
    // Lấy tất cả headers
    const headers = [...new Set(data.flatMap(obj => Object.keys(obj)))];
    
    // Tạo header row
    let csv = headers.join(',') + '\n';
    
    // Tạo data rows
    data.forEach(obj => {
      const row = headers.map(header => obj[header] || '').join(',');
      csv += row + '\n';
    });
    
    return csv;
  }
}

// Hàm Factory Method
function createFormatter(type) {
  switch (type.toLowerCase()) {
    case 'json':
      return new JSONFormatter();
    case 'xml':
      return new XMLFormatter();
    case 'csv':
      return new CSVFormatter();
    default:
      throw new Error(`Formatter type ${type} is not supported`);
  }
}

// Sử dụng
const jsonFormatter = createFormatter('json');
console.log(jsonFormatter.format({ name: 'John', age: 30 }));

const xmlFormatter = createFormatter('xml');
console.log(xmlFormatter.format({ name: 'John', age: 30 }));

const csvFormatter = createFormatter('csv');
console.log(csvFormatter.format([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]));
```

Trong ví dụ này, `createFormatter` là một factory method đơn giản, trả về các đối tượng formatter khác nhau dựa trên tham số đầu vào.

### 2.2 Triển khai với factory methods trong class

Chúng ta cũng có thể sử dụng factory methods trong class để tạo đối tượng:

```javascript
// Sản phẩm abstract: Không cần khai báo rõ ràng trong JavaScript
// nhưng tất cả các đối tượng Button nên có phương thức render và onClick

// Các sản phẩm cụ thể
class WindowsButton {
  render() {
    return '<button class="windows-button">Click Me</button>';
  }
  
  onClick(callback) {
    console.log('Windows button clicked');
    callback();
  }
}

class MacButton {
  render() {
    return '<button class="mac-button">Click Me</button>';
  }
  
  onClick(callback) {
    console.log('Mac button clicked');
    callback();
  }
}

class LinuxButton {
  render() {
    return '<button class="linux-button">Click Me</button>';
  }
  
  onClick(callback) {
    console.log('Linux button clicked');
    callback();
  }
}

// Creator abstract class
class Dialog {
  render() {
    // Tạo button sử dụng factory method
    const button = this.createButton();
    
    return `
      <div class="dialog">
        <div class="dialog-content">
          ${button.render()}
        </div>
      </div>
    `;
  }
  
  // Factory method: phải được ghi đè trong các lớp con
  createButton() {
    throw new Error('Factory method createButton() must be implemented by subclasses');
  }
}

// Concrete Creators
class WindowsDialog extends Dialog {
  createButton() {
    return new WindowsButton();
  }
}

class MacDialog extends Dialog {
  createButton() {
    return new MacButton();
  }
}

class LinuxDialog extends Dialog {
  createButton() {
    return new LinuxButton();
  }
}

// Phụ thuộc vào hệ điều hành
function getDialog() {
  const os = getOperatingSystem(); // Giả sử hàm này lấy OS hiện tại
  
  if (os === 'Windows') {
    return new WindowsDialog();
  } else if (os === 'Mac') {
    return new MacDialog();
  } else {
    return new LinuxDialog();
  }
}

// Giả lập hàm lấy OS
function getOperatingSystem() {
  // Trong thực tế, bạn sẽ detect OS thực sự
  return 'Windows';
}

// Sử dụng
const dialog = getDialog();
console.log(dialog.render());
```

Trong ví dụ này, phương thức `createButton()` là factory method. Mỗi lớp con của `Dialog` triển khai phương thức này để tạo ra loại button phù hợp với từng hệ điều hành.

### 2.3 Sử dụng Factory Method với object literals

JavaScript cho phép một cách triển khai đơn giản hơn bằng cách sử dụng object literals:

```javascript
// Các sản phẩm định nghĩa thông qua object literals
const userRoles = {
  admin: {
    permissions: ['create', 'read', 'update', 'delete'],
    accessLevel: 'all',
    canAccess(resource) {
      console.log(`Admin accessing ${resource}`);
      return true;
    }
  },
  
  editor: {
    permissions: ['read', 'update'],
    accessLevel: 'content',
    canAccess(resource) {
      console.log(`Editor accessing ${resource}`);
      return resource.startsWith('content');
    }
  },
  
  viewer: {
    permissions: ['read'],
    accessLevel: 'public',
    canAccess(resource) {
      console.log(`Viewer accessing ${resource}`);
      return resource.startsWith('public');
    }
  }
};

// Factory Method
const UserFactory = {
  createUser(name, roleName) {
    if (!userRoles[roleName]) {
      throw new Error(`Role ${roleName} does not exist`);
    }
    
    return {
      name,
      role: roleName,
      ...userRoles[roleName],
      createdAt: new Date()
    };
  }
};

// Sử dụng
const adminUser = UserFactory.createUser('John', 'admin');
console.log(adminUser.permissions); // ['create', 'read', 'update', 'delete']
console.log(adminUser.canAccess('settings')); // Admin accessing settings, true

const viewerUser = UserFactory.createUser('Jane', 'viewer');
console.log(viewerUser.permissions); // ['read']
console.log(viewerUser.canAccess('public/posts')); // Viewer accessing public/posts, true
console.log(viewerUser.canAccess('settings')); // Viewer accessing settings, false
```

Cách tiếp cận này đặc biệt phù hợp với JavaScript, khai thác tính linh hoạt của ngôn ngữ này.

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ cho phép triển khai Factory Method Pattern rõ ràng và an toàn về kiểu hơn.

### 3.1 Triển khai cơ bản với interfaces

```typescript
// Product interface
interface Payment {
  processPayment(amount: number): boolean;
}

// Concrete Products
class CreditCardPayment implements Payment {
  private cardNumber: string;
  private cvv: string;
  
  constructor(cardNumber: string, cvv: string) {
    this.cardNumber = cardNumber;
    this.cvv = cvv;
  }
  
  processPayment(amount: number): boolean {
    console.log(`Processing credit card payment of $${amount}`);
    // Xử lý thanh toán thẻ tín dụng
    return true;
  }
}

class PayPalPayment implements Payment {
  private email: string;
  
  constructor(email: string) {
    this.email = email;
  }
  
  processPayment(amount: number): boolean {
    console.log(`Processing PayPal payment of $${amount} for ${this.email}`);
    // Xử lý thanh toán PayPal
    return true;
  }
}

class BankTransferPayment implements Payment {
  private accountNumber: string;
  private routingNumber: string;
  
  constructor(accountNumber: string, routingNumber: string) {
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
  }
  
  processPayment(amount: number): boolean {
    console.log(`Processing bank transfer of $${amount}`);
    // Xử lý chuyển khoản ngân hàng
    return true;
  }
}

// Creator abstract class
abstract class PaymentProcessor {
  abstract createPayment(): Payment;
  
  processPayment(amount: number): boolean {
    const payment = this.createPayment();
    return payment.processPayment(amount);
  }
}

// Concrete Creators
class CreditCardProcessor extends PaymentProcessor {
  private cardNumber: string;
  private cvv: string;
  
  constructor(cardNumber: string, cvv: string) {
    super();
    this.cardNumber = cardNumber;
    this.cvv = cvv;
  }
  
  createPayment(): Payment {
    return new CreditCardPayment(this.cardNumber, this.cvv);
  }
}

class PayPalProcessor extends PaymentProcessor {
  private email: string;
  
  constructor(email: string) {
    super();
    this.email = email;
  }
  
  createPayment(): Payment {
    return new PayPalPayment(this.email);
  }
}

class BankTransferProcessor extends PaymentProcessor {
  private accountNumber: string;
  private routingNumber: string;
  
  constructor(accountNumber: string, routingNumber: string) {
    super();
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
  }
  
  createPayment(): Payment {
    return new BankTransferPayment(this.accountNumber, this.routingNumber);
  }
}

// Sử dụng
function processPaymentWithMethod(method: string, amount: number): boolean {
  let processor: PaymentProcessor;
  
  if (method === 'credit-card') {
    processor = new CreditCardProcessor('1234-5678-9012-3456', '123');
  } else if (method === 'paypal') {
    processor = new PayPalProcessor('example@email.com');
  } else if (method === 'bank-transfer') {
    processor = new BankTransferProcessor('9876543210', '987654');
  } else {
    throw new Error(`Payment method ${method} not supported`);
  }
  
  return processor.processPayment(amount);
}

// Sử dụng
processPaymentWithMethod('credit-card', 100);
processPaymentWithMethod('paypal', 50);
processPaymentWithMethod('bank-transfer', 200);
```

### 3.2 Sử dụng Static Factory Methods

TypeScript cũng cho phép triển khai static factory methods:

```typescript
// Product interface
interface Document {
  open(): void;
  save(): void;
}

// Concrete Products
class PDFDocument implements Document {
  private content: string = '';
  
  open(): void {
    console.log('Opening PDF document');
  }
  
  save(): void {
    console.log('Saving PDF document');
  }
  
  fillForm(data: Record<string, string>): void {
    console.log('Filling PDF form with:', data);
  }
}

class WordDocument implements Document {
  private content: string = '';
  
  open(): void {
    console.log('Opening Word document');
  }
  
  save(): void {
    console.log('Saving Word document');
  }
  
  addTable(rows: number, columns: number): void {
    console.log(`Adding table with ${rows} rows and ${columns} columns`);
  }
}

class TextDocument implements Document {
  private content: string = '';
  
  open(): void {
    console.log('Opening Text document');
  }
  
  save(): void {
    console.log('Saving Text document');
  }
  
  setPlainText(text: string): void {
    this.content = text;
    console.log('Setting plain text content');
  }
}

// Creator with static factory methods
class DocumentFactory {
  static createDocument(type: string): Document {
    switch (type.toLowerCase()) {
      case 'pdf':
        return new PDFDocument();
      case 'word':
        return new WordDocument();
      case 'text':
        return new TextDocument();
      default:
        throw new Error(`Document type ${type} not supported`);
    }
  }
  
  // Overloaded factory methods for specific types
  static createPDF(): PDFDocument {
    return new PDFDocument();
  }
  
  static createWord(): WordDocument {
    return new WordDocument();
  }
  
  static createText(): TextDocument {
    return new TextDocument();
  }
}

// Sử dụng generic factory method
const document1 = DocumentFactory.createDocument('pdf');
document1.open();
document1.save();

// Sử dụng specific factory methods (giữ kiểu cụ thể)
const pdfDoc = DocumentFactory.createPDF();
pdfDoc.fillForm({ name: 'John', email: 'john@example.com' });

const wordDoc = DocumentFactory.createWord();
wordDoc.addTable(3, 4);

const textDoc = DocumentFactory.createText();
textDoc.setPlainText('Hello, world!');
```

Trong ví dụ này, `DocumentFactory` cung cấp các static factory methods để tạo các loại Document khác nhau. Các phương thức chuyên biệt như `createPDF()` trả về đúng kiểu cụ thể, cho phép truy cập các phương thức đặc trưng của từng loại document.

## 4. Ví dụ thực tế

Hãy xem xét một số ví dụ thực tế về Factory Method Pattern trong JavaScript / TypeScript.

### 4.1 Factory Method trong UI Component Library

Giả sử bạn đang xây dựng một thư viện UI component:

```typescript
// Product interface
interface UIComponent {
  render(): string;
}

// Concrete Products
class Button implements UIComponent {
  constructor(private label: string) {}
  
  render(): string {
    return `<button class="btn">${this.label}</button>`;
  }
}

class Checkbox implements UIComponent {
  constructor(private checked: boolean, private label: string) {}
  
  render(): string {
    const checkedAttr = this.checked ? 'checked' : '';
    return `
      <div class="checkbox">
        <input type="checkbox" ${checkedAttr}>
        <label>${this.label}</label>
      </div>
    `;
  }
}

class TextField implements UIComponent {
  constructor(private placeholder: string, private value: string = '') {}
  
  render(): string {
    return `<input type="text" placeholder="${this.placeholder}" value="${this.value}">`;
  }
}

// Creator
class ComponentFactory {
  // Factory method
  static createComponent(type: string, options: Record<string, any>): UIComponent {
    switch (type) {
      case 'button':
        return new Button(options.label || 'Button');
      
      case 'checkbox':
        return new Checkbox(
          options.checked !== undefined ? options.checked : false,
          options.label || ''
        );
      
      case 'textfield':
        return new TextField(
          options.placeholder || '',
          options.value || ''
        );
      
      default:
        throw new Error(`Component type ${type} not supported`);
    }
  }
}

// Sử dụng
const form = document.createElement('form');

const button = ComponentFactory.createComponent('button', { label: 'Submit' });
form.innerHTML += button.render();

const name = ComponentFactory.createComponent('textfield', { 
  placeholder: 'Enter your name', 
  value: 'John'
});
form.innerHTML += name.render();

const rememberMe = ComponentFactory.createComponent('checkbox', { 
  label: 'Remember me', 
  checked: true
});
form.innerHTML += rememberMe.render();

document.body.appendChild(form);
```

### 4.2 Factory Method trong Network Request Adapters

Factory Method rất hữu ích cho việc tạo các adapter cho các API khác nhau:

```typescript
// Product interface
interface HttpClient {
  get(url: string): Promise<any>;
  post(url: string, data: any): Promise<any>;
  put(url: string, data: any): Promise<any>;
  delete(url: string): Promise<any>;
}

// Concrete Products
class FetchHttpClient implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }
  
  async post(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async put(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async delete(url: string): Promise<any> {
    const response = await fetch(url, { method: 'DELETE' });
    return response.json();
  }
}

class AxiosHttpClient implements HttpClient {
  // Giả định axios đã được import
  private axios: any;
  
  constructor(axios: any) {
    this.axios = axios;
  }
  
  async get(url: string): Promise<any> {
    const response = await this.axios.get(url);
    return response.data;
  }
  
  async post(url: string, data: any): Promise<any> {
    const response = await this.axios.post(url, data);
    return response.data;
  }
  
  async put(url: string, data: any): Promise<any> {
    const response = await this.axios.put(url, data);
    return response.data;
  }
  
  async delete(url: string): Promise<any> {
    const response = await this.axios.delete(url);
    return response.data;
  }
}

class XhrHttpClient implements HttpClient {
  private createXhr(): XMLHttpRequest {
    return new XMLHttpRequest();
  }
  
  private async makeRequest(method: string, url: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = this.createXhr();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`HTTP Error: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network Error'));
      
      if (data) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    });
  }
  
  async get(url: string): Promise<any> {
    return this.makeRequest('GET', url);
  }
  
  async post(url: string, data: any): Promise<any> {
    return this.makeRequest('POST', url, data);
  }
  
  async put(url: string, data: any): Promise<any> {
    return this.makeRequest('PUT', url, data);
  }
  
  async delete(url: string): Promise<any> {
    return this.makeRequest('DELETE', url);
  }
}

// Creator
class HttpClientFactory {
  static createClient(type: 'fetch' | 'axios' | 'xhr', options?: any): HttpClient {
    switch (type) {
      case 'fetch':
        return new FetchHttpClient();
      case 'axios':
        if (!options.axios) {
          throw new Error('Axios instance is required for AxiosHttpClient');
        }
        return new AxiosHttpClient(options.axios);
      case 'xhr':
        return new XhrHttpClient();
      default:
        throw new Error(`HTTP client type ${type} not supported`);
    }
  }
}

// Sử dụng
(async () => {
  // Chọn client dựa trên browser support hoặc config
  const client = HttpClientFactory.createClient('fetch');
  
  try {
    const users = await client.get('https://api.example.com/users');
    console.log(users);
    
    const newUser = await client.post('https://api.example.com/users', {
      name: 'John Doe',
      email: 'john@example.com'
    });
    console.log(newUser);
  } catch (error) {
    console.error('API Error:', error);
  }
})();
```

## 5. So sánh Factory Method với Abstract Factory

Factory Method và Abstract Factory là hai mẫu thiết kế tạo đối tượng có nhiều điểm tương đồng. Dưới đây là so sánh giữa chúng:

| Factory Method | Abstract Factory |
|----------------|-----------------|
| Tập trung vào việc tạo một sản phẩm duy nhất | Tập trung vào việc tạo các họ sản phẩm liên quan |
| Sử dụng kế thừa, lớp con quyết định sản phẩm được tạo | Sử dụng composition, đối tượng factory quyết định sản phẩm được tạo |
| Định nghĩa một phương thức duy nhất để tạo đối tượng | Định nghĩa nhiều phương thức tạo đối tượng |
| Dễ mở rộng bằng cách thêm lớp con | Khó mở rộng hơn vì phải thay đổi interface |

Ví dụ ngắn gọn về Abstract Factory:

```typescript
// Abstract Factory Pattern (để so sánh)
interface Button { render(): string; }
interface Checkbox { render(): string; }

// Products for Light theme
class LightButton implements Button {
  render(): string { return '<button class="light-button">Click</button>'; }
}

class LightCheckbox implements Checkbox {
  render(): string { return '<input type="checkbox" class="light-checkbox">'; }
}

// Products for Dark theme
class DarkButton implements Button {
  render(): string { return '<button class="dark-button">Click</button>'; }
}

class DarkCheckbox implements Checkbox {
  render(): string { return '<input type="checkbox" class="dark-checkbox">'; }
}

// Abstract Factory
interface ThemeFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Concrete Factories
class LightThemeFactory implements ThemeFactory {
  createButton(): Button { return new LightButton(); }
  createCheckbox(): Checkbox { return new LightCheckbox(); }
}

class DarkThemeFactory implements ThemeFactory {
  createButton(): Button { return new DarkButton(); }
  createCheckbox(): Checkbox { return new DarkCheckbox(); }
}

// Client code
function renderUI(factory: ThemeFactory): string {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  
  return `
    <div>
      ${button.render()}
      ${checkbox.render()}
    </div>
  `;
}

// Sử dụng
const lightTheme = renderUI(new LightThemeFactory());
const darkTheme = renderUI(new DarkThemeFactory());
```

Như bạn có thể thấy, Abstract Factory tập trung vào việc tạo ra các *họ* đối tượng liên quan (Button và Checkbox cho cùng một theme), trong khi Factory Method tập trung vào việc tạo ra *một* đối tượng.

## 6. Khi nào nên sử dụng Factory Method

Factory Method là một mẫu thiết kế linh hoạt, nhưng không phải lúc nào cũng cần thiết. Đây là một số hướng dẫn:

### 6.1 Nên sử dụng khi:

- Bạn không biết trước chính xác loại đối tượng nào sẽ được tạo ra
- Bạn muốn cung cấp một cách để mở rộng các thành phần của thư viện hoặc framework
- Bạn muốn tiết kiệm tài nguyên hệ thống bằng cách tái sử dụng các đối tượng hiện có
- Bạn cần tạo các đối tượng liên quan đến điều kiện môi trường hoặc cấu hình
- Muốn ẩn logic khởi tạo đối tượng khỏi client code

### 6.2 Không nên sử dụng khi:

- Khi việc tạo đối tượng là đơn giản và không cần gói gọn trong một phương thức riêng
- Khi bạn không có kế hoạch mở rộng hệ thống với các loại đối tượng mới
- Khi bạn đã có một giải pháp đơn giản hơn

## 7. Nhược điểm và lưu ý

Mặc dù Factory Method rất hữu ích, nó cũng có một số điểm cần lưu ý:

### 7.1 Tăng độ phức tạp

Thêm nhiều lớp có thể làm tăng độ phức tạp của code, đặc biệt khi mô hình truyền thống OOP được áp dụng trong JavaScript.

### 7.2 Quá mức cần thiết (over-engineering)

Đôi khi, một hàm factory đơn giản là đủ, và việc triển khai đầy đủ Factory Method Pattern có thể là thừa.

### 7.3 Khả năng mở rộng đi kèm với phức tạp

Mỗi loại product mới đòi hỏi một lớp product mới và có thể là một lớp creator mới, dẫn đến số lượng lớp tăng lên nhanh chóng.

## 8. Kết luận

Factory Method Pattern là một mẫu thiết kế linh hoạt, cho phép tạo đối tượng mà không cần biết chính xác loại đối tượng nào được tạo ra tại thời điểm viết code. Pattern này đặc biệt hữu ích trong JavaScript và TypeScript, nơi sự linh hoạt của ngôn ngữ cho phép nhiều cách triển khai.

Ưu điểm chính của Factory Method:
- Tạo đối tượng một cách linh hoạt
- Tuân thủ nguyên tắc Open/Closed (mở rộng, không sửa đổi)
- Code client không phụ thuộc vào các lớp cụ thể
- Tách biệt code tạo đối tượng khỏi code sử dụng đối tượng
