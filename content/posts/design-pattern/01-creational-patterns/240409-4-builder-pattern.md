---
title: "Creational Pattern [4/6] - Builder Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-04-09
description: "Builder Pattern là một mẫu thiết kế tạo đối tượng cho phép xây dựng các đối tượng phức tạp từng bước một. Bài viết này phân tích cách triển khai Builder Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "builder-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Builder
  - Creational Patterns
---


## 1. Builder Pattern là gì?

Builder Pattern là một mẫu thiết kế tạo đối tượng cho phép bạn xây dựng các đối tượng phức tạp từng bước một. Mẫu này đặc biệt hữu ích khi bạn cần tạo một đối tượng với nhiều tham số tùy chọn và cấu hình linh hoạt.

Các thành phần chính trong Builder Pattern:
- **Builder**: Interface khai báo các phương thức xây dựng sản phẩm
- **Concrete Builder**: Các lớp cụ thể triển khai Builder, định nghĩa các bước xây dựng
- **Director**: (Tùy chọn) Định nghĩa thứ tự các bước xây dựng
- **Product**: Đối tượng phức tạp được tạo ra

Builder Pattern được xây dựng dựa trên nguyên tắc: "Tách biệt quá trình xây dựng một đối tượng phức tạp khỏi biểu diễn của nó".

## 2. Triển khai trong JavaScript

JavaScript với tính năng linh hoạt của nó cho phép triển khai Builder Pattern theo nhiều cách khác nhau.

### 2.1 Triển khai cơ bản

Hãy xem xét một ví dụ về xây dựng đối tượng Query cho database:

```javascript
class QueryBuilder {
  constructor() {
    this.query = {
      select: [],
      from: '',
      where: [],
      orderBy: [],
      limit: null
    };
  }
  
  select(fields) {
    this.query.select = fields;
    return this;
  }
  
  from(table) {
    this.query.from = table;
    return this;
  }
  
  where(condition) {
    this.query.where.push(condition);
    return this;
  }
  
  orderBy(field, direction = 'ASC') {
    this.query.orderBy.push({ field, direction });
    return this;
  }
  
  limit(limit) {
    this.query.limit = limit;
    return this;
  }
  
  build() {
    let query = 'SELECT ';
    
    // Build SELECT
    query += this.query.select.length > 0 
      ? this.query.select.join(', ') 
      : '*';
    
    // Build FROM
    query += ` FROM ${this.query.from}`;
    
    // Build WHERE
    if (this.query.where.length > 0) {
      query += ` WHERE ${this.query.where.join(' AND ')}`;
    }
    
    // Build ORDER BY
    if (this.query.orderBy.length > 0) {
      query += ' ORDER BY ' + this.query.orderBy
        .map(order => `${order.field} ${order.direction}`)
        .join(', ');
    }
    
    // Build LIMIT
    if (this.query.limit !== null) {
      query += ` LIMIT ${this.query.limit}`;
    }
    
    return query;
  }
}

// Usage
const query = new QueryBuilder()
  .select(['name', 'email', 'created_at'])
  .from('users')
  .where('age > 18')
  .where('status = "active"')
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();

console.log(query);
// SELECT name, email, created_at FROM users WHERE age > 18 AND status = "active" ORDER BY created_at DESC LIMIT 10
```

### 2.2 Triển khai với Director

Khi bạn có các chuỗi bước xây dựng phức tạp và thường xuyên tái sử dụng, bạn có thể sử dụng Director:

```javascript
class EmailBuilder {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.email = {
      from: '',
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      body: '',
      attachments: []
    };
    return this;
  }
  
  setFrom(from) {
    this.email.from = from;
    return this;
  }
  
  setTo(to) {
    this.email.to = Array.isArray(to) ? to : [to];
    return this;
  }
  
  setCC(cc) {
    this.email.cc = Array.isArray(cc) ? cc : [cc];
    return this;
  }
  
  setBCC(bcc) {
    this.email.bcc = Array.isArray(bcc) ? bcc : [bcc];
    return this;
  }
  
  setSubject(subject) {
    this.email.subject = subject;
    return this;
  }
  
  setBody(body) {
    this.email.body = body;
    return this;
  }
  
  addAttachment(attachment) {
    this.email.attachments.push(attachment);
    return this;
  }
  
  build() {
    const email = { ...this.email };
    this.reset();
    return email;
  }
}

class EmailDirector {
  constructor(builder) {
    this.builder = builder;
  }
  
  constructWelcomeEmail(userName, userEmail) {
    return this.builder
      .setFrom('support@example.com')
      .setTo(userEmail)
      .setSubject('Welcome to Our Platform!')
      .setBody(`Dear ${userName},\n\nWelcome to our platform! We're excited to have you on board.`)
      .build();
  }
  
  constructPasswordResetEmail(userEmail, resetLink) {
    return this.builder
      .setFrom('security@example.com')
      .setTo(userEmail)
      .setSubject('Password Reset Request')
      .setBody(`Click the following link to reset your password:\n${resetLink}`)
      .build();
  }
  
  constructNewsletterEmail(subscribers, content) {
    return this.builder
      .setFrom('newsletter@example.com')
      .setTo(subscribers)
      .setSubject('Monthly Newsletter')
      .setBody(content)
      .build();
  }
}

// Usage
const emailBuilder = new EmailBuilder();
const emailDirector = new EmailDirector(emailBuilder);

const welcomeEmail = emailDirector.constructWelcomeEmail(
  'John Doe',
  'john@example.com'
);

const resetEmail = emailDirector.constructPasswordResetEmail(
  'jane@example.com',
  'https://example.com/reset/token123'
);

console.log(welcomeEmail);
console.log(resetEmail);
```

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ cho phép chúng ta triển khai Builder Pattern một cách an toàn và rõ ràng hơn:

```typescript
interface Pizza {
  size: string;
  crust: string;
  sauce: string;
  toppings: string[];
  extras: string[];
}

class PizzaBuilder {
  private pizza: Pizza;
  
  constructor() {
    this.reset();
  }
  
  private reset(): void {
    this.pizza = {
      size: 'medium',
      crust: 'regular',
      sauce: 'tomato',
      toppings: [],
      extras: []
    };
  }
  
  setSize(size: 'small' | 'medium' | 'large'): PizzaBuilder {
    this.pizza.size = size;
    return this;
  }
  
  setCrust(crust: 'regular' | 'thin' | 'thick' | 'stuffed'): PizzaBuilder {
    this.pizza.crust = crust;
    return this;
  }
  
  setSauce(sauce: 'tomato' | 'bbq' | 'garlic'): PizzaBuilder {
    this.pizza.sauce = sauce;
    return this;
  }
  
  addTopping(topping: string): PizzaBuilder {
    this.pizza.toppings.push(topping);
    return this;
  }
  
  addExtra(extra: string): PizzaBuilder {
    this.pizza.extras.push(extra);
    return this;
  }
  
  build(): Pizza {
    const pizza = this.pizza;
    this.reset();
    return pizza;
  }
}

class PizzaDirector {
  private builder: PizzaBuilder;
  
  constructor(builder: PizzaBuilder) {
    this.builder = builder;
  }
  
  constructMargherita(): Pizza {
    return this.builder
      .setSize('medium')
      .setCrust('thin')
      .setSauce('tomato')
      .addTopping('mozzarella')
      .addTopping('basil')
      .build();
  }
  
  constructPepperoni(): Pizza {
    return this.builder
      .setSize('large')
      .setCrust('regular')
      .setSauce('tomato')
      .addTopping('mozzarella')
      .addTopping('pepperoni')
      .build();
  }
  
  constructVegetarian(): Pizza {
    return this.builder
      .setSize('medium')
      .setCrust('thin')
      .setSauce('tomato')
      .addTopping('mozzarella')
      .addTopping('mushrooms')
      .addTopping('peppers')
      .addTopping('onions')
      .addExtra('extra cheese')
      .build();
  }
}

// Usage
const builder = new PizzaBuilder();
const director = new PizzaDirector(builder);

const margherita = director.constructMargherita();
console.log('Margherita:', margherita);

const customPizza = builder
  .setSize('large')
  .setCrust('stuffed')
  .setSauce('bbq')
  .addTopping('mozzarella')
  .addTopping('chicken')
  .addTopping('bacon')
  .addExtra('ranch sauce')
  .build();

console.log('Custom Pizza:', customPizza);
```

## 4. Ví dụ thực tế: Form Builder

Hãy xem xét một ví dụ thực tế về việc xây dựng form động trong ứng dụng web:

```typescript
interface FormField {
  type: string;
  name: string;
  label: string;
  value?: any;
  required?: boolean;
  options?: { label: string; value: any }[];
  validators?: ((value: any) => boolean)[];
}

interface Form {
  id: string;
  fields: FormField[];
  submitUrl: string;
  method: 'GET' | 'POST';
}

class FormBuilder {
  private form: Form;
  
  constructor(id: string) {
    this.form = {
      id,
      fields: [],
      submitUrl: '',
      method: 'POST'
    };
  }
  
  addTextField(name: string, label: string, required = false): FormBuilder {
    this.form.fields.push({
      type: 'text',
      name,
      label,
      required
    });
    return this;
  }
  
  addEmailField(name: string, label: string, required = false): FormBuilder {
    this.form.fields.push({
      type: 'email',
      name,
      label,
      required,
      validators: [
        (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ]
    });
    return this;
  }
  
  addPasswordField(name: string, label: string, required = false): FormBuilder {
    this.form.fields.push({
      type: 'password',
      name,
      label,
      required,
      validators: [
        (value: string) => value.length >= 8
      ]
    });
    return this;
  }
  
  addSelectField(
    name: string,
    label: string,
    options: { label: string; value: any }[],
    required = false
  ): FormBuilder {
    this.form.fields.push({
      type: 'select',
      name,
      label,
      options,
      required
    });
    return this;
  }
  
  addCheckboxField(name: string, label: string): FormBuilder {
    this.form.fields.push({
      type: 'checkbox',
      name,
      label,
      value: false
    });
    return this;
  }
  
  setSubmitUrl(url: string): FormBuilder {
    this.form.submitUrl = url;
    return this;
  }
  
  setMethod(method: 'GET' | 'POST'): FormBuilder {
    this.form.method = method;
    return this;
  }
  
  build(): Form {
    if (!this.form.submitUrl) {
      throw new Error('Submit URL is required');
    }
    return { ...this.form };
  }
}

class FormDirector {
  private builder: FormBuilder;
  
  constructor(builder: FormBuilder) {
    this.builder = builder;
  }
  
  constructLoginForm(): Form {
    return this.builder
      .addEmailField('email', 'Email Address', true)
      .addPasswordField('password', 'Password', true)
      .addCheckboxField('remember', 'Remember me')
      .setSubmitUrl('/api/login')
      .setMethod('POST')
      .build();
  }
  
  constructRegistrationForm(): Form {
    return this.builder
      .addTextField('name', 'Full Name', true)
      .addEmailField('email', 'Email Address', true)
      .addPasswordField('password', 'Password', true)
      .addPasswordField('confirmPassword', 'Confirm Password', true)
      .addSelectField('role', 'Role', [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' }
      ], true)
      .addCheckboxField('terms', 'I agree to the terms and conditions')
      .setSubmitUrl('/api/register')
      .setMethod('POST')
      .build();
  }
  
  constructContactForm(): Form {
    return this.builder
      .addTextField('name', 'Your Name', true)
      .addEmailField('email', 'Your Email', true)
      .addTextField('subject', 'Subject', true)
      .addTextField('message', 'Message', true)
      .setSubmitUrl('/api/contact')
      .setMethod('POST')
      .build();
  }
}

// Usage
const formBuilder = new FormBuilder('user-form');
const formDirector = new FormDirector(formBuilder);

const loginForm = formDirector.constructLoginForm();
console.log('Login Form:', loginForm);

const registrationForm = formDirector.constructRegistrationForm();
console.log('Registration Form:', registrationForm);

const customForm = new FormBuilder('custom-form')
  .addTextField('title', 'Title', true)
  .addSelectField('category', 'Category', [
    { label: 'Technology', value: 'tech' },
    { label: 'Design', value: 'design' },
    { label: 'Business', value: 'business' }
  ])
  .addTextField('description', 'Description')
  .addCheckboxField('featured', 'Feature this post')
  .setSubmitUrl('/api/posts')
  .build();

console.log('Custom Form:', customForm);
```

## 5. Khi nào nên sử dụng Builder Pattern

Builder Pattern phù hợp trong các tình huống sau:

1. **Khi cần tạo đối tượng phức tạp với nhiều tham số tùy chọn**
2. **Khi muốn tránh constructor với quá nhiều tham số**
3. **Khi cần tạo các biến thể khác nhau của cùng một đối tượng**
4. **Khi quá trình xây dựng cần được kiểm soát chi tiết**
5. **Khi muốn code dễ đọc và bảo trì hơn**

Ví dụ thực tế:
- Xây dựng form động
- Tạo query database
- Cấu hình đối tượng
- Xây dựng đối tượng API request/response
- Tạo đối tượng document (PDF, Word, etc.)

## 6. So sánh với các Pattern khác

### So sánh với Factory Pattern

| Builder Pattern | Factory Pattern |
|----------------|-----------------|
| Tạo đối tượng từng bước một | Tạo đối tượng trong một bước |
| Cho phép kiểm soát chi tiết quá trình tạo | Ẩn chi tiết tạo đối tượng |
| Có thể tái sử dụng cùng một quá trình xây dựng | Tập trung vào tạo một loại đối tượng |
| Phù hợp với đối tượng phức tạp | Phù hợp với đối tượng đơn giản |

### So sánh với Abstract Factory

| Builder Pattern | Abstract Factory Pattern |
|----------------|-------------------------|
| Tập trung vào cách tạo một đối tượng phức tạp | Tập trung vào tạo họ các đối tượng liên quan |
| Cho phép tạo các biến thể của cùng một đối tượng | Tạo các đối tượng khác nhau nhưng liên quan |
| Sử dụng các bước tuần tự | Tạo đối tượng ngay lập tức |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Kiểm soát quá trình xây dựng** chi tiết
- **Tái sử dụng code** xây dựng đối tượng
- **Tách biệt code xây dựng** khỏi biểu diễn
- **Hỗ trợ tạo các biến thể** của cùng một đối tượng
- **Code dễ đọc và bảo trì** hơn

### Nhược điểm:
- **Tăng độ phức tạp** của code
- **Cần tạo nhiều lớp** mới
- **Có thể quá mức cần thiết** cho đối tượng đơn giản
- **Khó khăn trong việc thiết kế** interface Builder

## 8. Kết luận

Builder Pattern là một công cụ mạnh mẽ trong việc xây dựng các đối tượng phức tạp một cách linh hoạt và có tổ chức. Trong JavaScript và TypeScript, mẫu này đặc biệt hữu ích khi làm việc với các đối tượng có nhiều tham số tùy chọn hoặc khi quá trình xây dựng cần được kiểm soát chi tiết.

Khi quyết định sử dụng Builder Pattern, hãy cân nhắc độ phức tạp của đối tượng và yêu cầu về tính linh hoạt trong quá trình xây dựng. Đối với các đối tượng đơn giản, việc sử dụng constructor hoặc factory có thể lựa chọn tốt hơn. Tuy nhiên, đối với các đối tượng phức tạp với nhiều cấu hình, Builder Pattern cung cấp một cách tiếp cận có cấu trúc và dễ bảo trì.
