---
title: "Abstract Factory Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-04-02
description: "Abstract Factory là một mẫu thiết kế tạo đối tượng mạnh mẽ cho phép tạo các họ đối tượng liên quan. Bài viết này phân tích cách triển khai Abstract Factory trong JavaScript và TypeScript, so sánh với Factory Method và các trường hợp sử dụng thực tế."
slug: "abstract-factory-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Abstract Factory
  - Creational Patterns
---

{{< sidenote >}}
Đây là bài viết thứ tư trong series về các mẫu thiết kế trong JavaScript/TypeScript. Nếu bạn chưa đọc các bài trước, bạn có thể xem: [Giới thiệu về các mẫu thiết kế](/posts/gioi-thieu-ve-cac-mau-thiet-ke-javascript-typescript), [Singleton Pattern](/posts/singleton-pattern-trong-javascript-typescript) và [Factory Method Pattern](/posts/factory-method-pattern-trong-javascript-typescript).
{{< /sidenote >}}

Trong bài viết trước, chúng ta đã tìm hiểu về Factory Method Pattern - một mẫu thiết kế tạo đối tượng linh hoạt. Tuy nhiên, đôi khi chúng ta cần tạo ra không chỉ một đối tượng mà là cả một họ các đối tượng liên quan đến nhau. Đó chính là lúc Abstract Factory Pattern phát huy tác dụng.

Hôm nay mình sẽ giới thiệu về Abstract Factory - một mẫu thiết kế tạo đối tượng (creational pattern) mạnh mẽ và phức tạp hơn Factory Method.

## 1. Abstract Factory Pattern là gì?

Abstract Factory Pattern là một mẫu thiết kế tạo đối tượng cung cấp một interface để tạo ra các họ đối tượng liên quan hoặc phụ thuộc lẫn nhau mà không cần chỉ định các lớp cụ thể của chúng.

Các thành phần chính trong Abstract Factory Pattern:
- **Abstract Factory**: Interface khai báo các phương thức tạo đối tượng
- **Concrete Factory**: Các lớp cụ thể triển khai Abstract Factory, tạo ra các sản phẩm cụ thể
- **Abstract Product**: Interface khai báo các sản phẩm
- **Concrete Product**: Các lớp cụ thể triển khai Abstract Product
- **Client**: Sử dụng các interface được khai báo bởi Abstract Factory và Abstract Product

Abstract Factory được xây dựng dựa trên nguyên tắc: "Cung cấp một interface để tạo ra các họ đối tượng liên quan mà không cần chỉ định các lớp cụ thể".

## 2. Triển khai trong JavaScript

JavaScript với tính năng linh hoạt của nó cho phép triển khai Abstract Factory Pattern theo nhiều cách khác nhau.

### 2.1 Triển khai cơ bản

Hãy xem xét một ví dụ về hệ thống UI cho các nền tảng khác nhau (Web và Mobile):

```javascript
// Abstract Products
class Button {
  render() {
    throw new Error("Abstract method!");
  }
}

class Checkbox {
  render() {
    throw new Error("Abstract method!");
  }
}

// Concrete Products for Web
class WebButton extends Button {
  render() {
    return "<button>Web Button</button>";
  }
}

class WebCheckbox extends Checkbox {
  render() {
    return "<input type='checkbox'>";
  }
}

// Concrete Products for Mobile
class MobileButton extends Button {
  render() {
    return "Mobile Button Component";
  }
}

class MobileCheckbox extends Checkbox {
  render() {
    return "Mobile Checkbox Component";
  }
}

// Abstract Factory
class UIFactory {
  createButton() {
    throw new Error("Abstract method!");
  }
  
  createCheckbox() {
    throw new Error("Abstract method!");
  }
}

// Concrete Factories
class WebUIFactory extends UIFactory {
  createButton() {
    return new WebButton();
  }
  
  createCheckbox() {
    return new WebCheckbox();
  }
}

class MobileUIFactory extends UIFactory {
  createButton() {
    return new MobileButton();
  }
  
  createCheckbox() {
    return new MobileCheckbox();
  }
}

// Client code
function renderUI(factory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  
  console.log(button.render());
  console.log(checkbox.render());
}

// Usage
const webFactory = new WebUIFactory();
const mobileFactory = new MobileUIFactory();

console.log("Web UI:");
renderUI(webFactory);

console.log("Mobile UI:");
renderUI(mobileFactory);
```

Trong ví dụ trên:
- `UIFactory` là Abstract Factory định nghĩa các phương thức để tạo Button và Checkbox
- `WebUIFactory` và `MobileUIFactory` là Concrete Factory triển khai các phương thức tạo đối tượng cụ thể
- `Button` và `Checkbox` là Abstract Product
- `WebButton`, `WebCheckbox`, `MobileButton`, và `MobileCheckbox` là Concrete Product

### 2.2 Triển khai với Object Literal

Trong JavaScript, chúng ta có thể triển khai Abstract Factory Pattern một cách đơn giản hơn bằng cách sử dụng object literal:

```javascript
// Abstract Factory using object literals
const UIFactories = {
  web: {
    createButton: () => ({
      render: () => "<button>Web Button</button>"
    }),
    createCheckbox: () => ({
      render: () => "<input type='checkbox'>"
    })
  },
  
  mobile: {
    createButton: () => ({
      render: () => "Mobile Button Component"
    }),
    createCheckbox: () => ({
      render: () => "Mobile Checkbox Component"
    })
  }
};

// Client code
function renderUI(factory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  
  console.log(button.render());
  console.log(checkbox.render());
}

// Usage
console.log("Web UI:");
renderUI(UIFactories.web);

console.log("Mobile UI:");
renderUI(UIFactories.mobile);
```

Cách tiếp cận này đơn giản hơn và phù hợp với tính chất động của JavaScript.

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ cho phép chúng ta triển khai Abstract Factory Pattern một cách rõ ràng và an toàn hơn:

```typescript
// Abstract Products
interface Button {
  render(): string;
}

interface Checkbox {
  render(): string;
}

// Concrete Products for Web
class WebButton implements Button {
  render(): string {
    return "<button>Web Button</button>";
  }
}

class WebCheckbox implements Checkbox {
  render(): string {
    return "<input type='checkbox'>";
  }
}

// Concrete Products for Mobile
class MobileButton implements Button {
  render(): string {
    return "Mobile Button Component";
  }
}

class MobileCheckbox implements Checkbox {
  render(): string {
    return "Mobile Checkbox Component";
  }
}

// Abstract Factory
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Concrete Factories
class WebUIFactory implements UIFactory {
  createButton(): Button {
    return new WebButton();
  }
  
  createCheckbox(): Checkbox {
    return new WebCheckbox();
  }
}

class MobileUIFactory implements UIFactory {
  createButton(): Button {
    return new MobileButton();
  }
  
  createCheckbox(): Checkbox {
    return new MobileCheckbox();
  }
}

// Client code
function renderUI(factory: UIFactory): void {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  
  console.log(button.render());
  console.log(checkbox.render());
}

// Usage
const webFactory = new WebUIFactory();
const mobileFactory = new MobileUIFactory();

console.log("Web UI:");
renderUI(webFactory);

console.log("Mobile UI:");
renderUI(mobileFactory);
```

TypeScript cho phép chúng ta định nghĩa rõ ràng các interface và đảm bảo tính an toàn kiểu khi triển khai Abstract Factory Pattern.

## 4. Ví dụ thực tế: Hệ thống đa nền tảng

Hãy xem xét một ví dụ thực tế hơn về hệ thống đa nền tảng cho một ứng dụng thương mại điện tử:

```typescript
// Abstract Products
interface ProductCard {
  display(product: any): string;
}

interface ShoppingCart {
  addItem(item: any): void;
  checkout(): string;
}

interface ThemeProvider {
  getTheme(): string;
}

// Concrete Products for Web
class WebProductCard implements ProductCard {
  display(product: any): string {
    return `<div class="product-card">
      <img src="${product.image}" />
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    </div>`;
  }
}

class WebShoppingCart implements ShoppingCart {
  private items: any[] = [];
  
  addItem(item: any): void {
    this.items.push(item);
  }
  
  checkout(): string {
    return `Processing web checkout for ${this.items.length} items...`;
  }
}

class WebThemeProvider implements ThemeProvider {
  getTheme(): string {
    return "Web Light Theme";
  }
}

// Concrete Products for Mobile
class MobileProductCard implements ProductCard {
  display(product: any): string {
    return `MobileProductCard: ${product.name} - ${product.price}`;
  }
}

class MobileShoppingCart implements ShoppingCart {
  private items: any[] = [];
  
  addItem(item: any): void {
    this.items.push(item);
  }
  
  checkout(): string {
    return `Processing mobile app checkout for ${this.items.length} items...`;
  }
}

class MobileThemeProvider implements ThemeProvider {
  getTheme(): string {
    return "Mobile Dark Theme";
  }
}

// Abstract Factory
interface ECommerceUIFactory {
  createProductCard(): ProductCard;
  createShoppingCart(): ShoppingCart;
  createThemeProvider(): ThemeProvider;
}

// Concrete Factories
class WebECommerceUIFactory implements ECommerceUIFactory {
  createProductCard(): ProductCard {
    return new WebProductCard();
  }
  
  createShoppingCart(): ShoppingCart {
    return new WebShoppingCart();
  }
  
  createThemeProvider(): ThemeProvider {
    return new WebThemeProvider();
  }
}

class MobileECommerceUIFactory implements ECommerceUIFactory {
  createProductCard(): ProductCard {
    return new MobileProductCard();
  }
  
  createShoppingCart(): ShoppingCart {
    return new MobileShoppingCart();
  }
  
  createThemeProvider(): ThemeProvider {
    return new MobileThemeProvider();
  }
}

// Client code
class ECommerceApp {
  private productCard: ProductCard;
  private cart: ShoppingCart;
  private themeProvider: ThemeProvider;
  
  constructor(factory: ECommerceUIFactory) {
    this.productCard = factory.createProductCard();
    this.cart = factory.createShoppingCart();
    this.themeProvider = factory.createThemeProvider();
  }
  
  displayProduct(product: any): void {
    console.log(`Theme: ${this.themeProvider.getTheme()}`);
    console.log(this.productCard.display(product));
  }
  
  addToCart(product: any): void {
    this.cart.addItem(product);
    console.log(`Added to cart: ${product.name}`);
  }
  
  checkout(): void {
    console.log(this.cart.checkout());
  }
}

// Usage
const product = { name: "Smartphone", price: "$999", image: "smartphone.jpg" };

// Web version
const webApp = new ECommerceApp(new WebECommerceUIFactory());
console.log("Web Application:");
webApp.displayProduct(product);
webApp.addToCart(product);
webApp.checkout();

// Mobile version
const mobileApp = new ECommerceApp(new MobileECommerceUIFactory());
console.log("\nMobile Application:");
mobileApp.displayProduct(product);
mobileApp.addToCart(product);
mobileApp.checkout();
```

Trong ví dụ này, chúng ta đã tạo một hệ thống e-commerce hoàn chỉnh với các thành phần UI khác nhau cho web và mobile. Abstract Factory Pattern cho phép chúng ta dễ dàng chuyển đổi giữa các nền tảng mà không cần thay đổi mã client.

## 5. So sánh với Factory Method

Mặc dù cả Factory Method và Abstract Factory đều là các mẫu thiết kế tạo đối tượng, nhưng chúng có một số khác biệt quan trọng:

| Factory Method | Abstract Factory |
|----------------|-----------------|
| Tạo một đối tượng | Tạo họ các đối tượng liên quan |
| Sử dụng kế thừa để tạo đối tượng | Sử dụng composition để tạo đối tượng |
| Thông qua một phương thức trong lớp | Thông qua một đối tượng factory |
| Dễ mở rộng bằng cách thêm lớp con | Khó mở rộng khi cần thêm sản phẩm mới |

Ví dụ, Factory Method tập trung vào việc tạo một loại đối tượng (như Button), trong khi Abstract Factory tạo ra nhiều loại đối tượng liên quan (như Button, Checkbox, và các thành phần UI khác).

## 6. Khi nào nên sử dụng Abstract Factory

Abstract Factory Pattern phù hợp trong các tình huống sau:

1. **Khi hệ thống cần độc lập với cách tạo, cấu hình và biểu diễn của các sản phẩm**
2. **Khi hệ thống cần được cấu hình với một trong nhiều họ sản phẩm**
3. **Khi bạn muốn cung cấp thư viện lớp sản phẩm và chỉ muốn tiết lộ interface, không phải triển khai**
4. **Khi các sản phẩm liên quan cần được sử dụng cùng nhau**
5. **Khi bạn cần đảm bảo tính nhất quán giữa các sản phẩm**

Ví dụ thực tế:
- Hệ thống UI đa nền tảng (Web, Mobile, Desktop)
- Hệ thống kết nối đa database (MySQL, MongoDB, PostgreSQL)
- Hệ thống rendering đa engine (OpenGL, DirectX, Vulkan)
- Hệ thống theme (Light, Dark, Custom)

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Đảm bảo tính tương thích** giữa các sản phẩm được tạo ra
- **Tách biệt code cụ thể** khỏi code client
- **Dễ dàng thay đổi họ sản phẩm** toàn bộ
- **Thúc đẩy nguyên tắc Open/Closed**: Có thể thêm factory mới mà không cần sửa đổi code hiện có
- **Thúc đẩy nguyên tắc Single Responsibility**: Tách biệt code tạo đối tượng khỏi logic sử dụng

### Nhược điểm:
- **Phức tạp hơn** so với Factory Method
- **Khó mở rộng** khi cần thêm sản phẩm mới (cần sửa đổi interface factory và tất cả các triển khai)
- **Có thể dẫn đến quá nhiều lớp** trong hệ thống
- **Overhead** khi chỉ cần một phần nhỏ của họ sản phẩm

## 8. Kết luận

Abstract Factory Pattern là một công cụ mạnh mẽ trong bộ công cụ thiết kế của bạn, đặc biệt khi làm việc với các hệ thống phức tạp cần tạo ra các họ đối tượng liên quan. Trong JavaScript và TypeScript, mẫu này có thể được triển khai với nhiều cách khác nhau, từ cách tiếp cận OOP truyền thống đến cách tiếp cận hàm và object literal.

Khi quyết định sử dụng Abstract Factory, hãy cân nhắc cẩn thận về độ phức tạp mà nó thêm vào hệ thống của bạn. Đối với các ứng dụng đơn giản, Factory Method có thể là lựa chọn tốt hơn. Tuy nhiên, đối với các hệ thống phức tạp với nhiều biến thể sản phẩm, Abstract Factory cung cấp một cách tiếp cận có cấu trúc và dễ bảo trì.

Trong bài viết tiếp theo, chúng ta sẽ tìm hiểu về Builder Pattern - một mẫu thiết kế tạo đối tượng khác giúp xây dựng các đối tượng phức tạp từng bước một.

## Tài liệu tham khảo

1. Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design Patterns: Elements of Reusable Object-Oriented Software.
2. Osmani, A. (2017). Learning JavaScript Design Patterns.
3. Freeman, E., Robson, E., Sierra, K., & Bates, B. (2004). Head First Design Patterns.
4. TypeScript Documentation: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
5. Refactoring Guru - Abstract Factory: [https://refactoring.guru/design-patterns/abstract-factory](https://refactoring.guru/design-patterns/abstract-factory) 