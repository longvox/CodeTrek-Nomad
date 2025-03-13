---
title: "Modern JS/TS Pattern [2/4] - MVVM & MVC Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-08-20
description: "MVVM và MVC là hai mẫu thiết kế kiến trúc phổ biến trong phát triển ứng dụng web. Bài viết này phân tích cách triển khai MVVM và MVC Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "mvvm-mvc-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - MVVM
  - MVC
  - Modern Patterns
---

## 1. MVVM và MVC Pattern là gì?

### 1.1 MVC (Model-View-Controller)
MVC là một mẫu thiết kế kiến trúc chia ứng dụng thành ba thành phần chính:
- **Model**: Quản lý dữ liệu và logic nghiệp vụ
- **View**: Hiển thị dữ liệu cho người dùng
- **Controller**: Xử lý tương tác người dùng và cập nhật Model/View

### 1.2 MVVM (Model-View-ViewModel)
MVVM là một biến thể của MVC, phù hợp hơn với ứng dụng web hiện đại:
- **Model**: Tương tự MVC, quản lý dữ liệu và logic nghiệp vụ
- **View**: Giao diện người dùng
- **ViewModel**: Trung gian giữa Model và View, xử lý logic hiển thị

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về MVC với Todo App

```javascript
// Model
class TodoModel {
  constructor() {
    this.todos = [];
    this.observers = [];
  }

  addTodo(title) {
    const todo = {
      id: Date.now(),
      title,
      completed: false
    };
    this.todos.push(todo);
    this.notify();
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.notify();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.notify();
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify() {
    this.observers.forEach(observer => observer(this.todos));
  }
}

// View
class TodoView {
  constructor() {
    this.app = this.getElement('#root');
    this.title = this.createElement('h1');
    this.title.textContent = 'Todos';

    this.form = this.createElement('form');
    this.input = this.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Add todo';
    this.submitButton = this.createElement('button');
    this.submitButton.textContent = 'Add';

    this.todoList = this.createElement('ul');

    this.form.append(this.input, this.submitButton);
    this.app.append(this.title, this.form, this.todoList);
  }

  createElement(tag) {
    return document.createElement(tag);
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  displayTodos(todos) {
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }

    if (todos.length === 0) {
      const p = this.createElement('p');
      p.textContent = 'Nothing to do! Add a task?';
      this.todoList.append(p);
    } else {
      todos.forEach(todo => {
        const li = this.createElement('li');
        li.id = todo.id;

        const checkbox = this.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;

        const span = this.createElement('span');
        span.contentEditable = true;
        span.textContent = todo.title;

        const deleteButton = this.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';

        li.append(checkbox, span, deleteButton);
        this.todoList.append(li);
      });
    }
  }

  bindAddTodo(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      const title = this.input.value.trim();
      if (title) {
        handler(title);
        this.input.value = '';
      }
    });
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener('click', event => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener('change', event => {
      if (event.target.type === 'checkbox') {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }
}

// Controller
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.subscribe(todos => this.view.displayTodos(todos));
    this.view.bindAddTodo(this.handleAddTodo.bind(this));
    this.view.bindDeleteTodo(this.handleDeleteTodo.bind(this));
    this.view.bindToggleTodo(this.handleToggleTodo.bind(this));

    this.model.notify();
  }

  handleAddTodo(title) {
    this.model.addTodo(title);
  }

  handleDeleteTodo(id) {
    this.model.deleteTodo(id);
  }

  handleToggleTodo(id) {
    this.model.toggleTodo(id);
  }
}

// Usage
const app = new TodoController(new TodoModel(), new TodoView());
```

### 2.2 Ví dụ về MVVM với Counter App

```javascript
// Model
class CounterModel {
  constructor() {
    this.value = 0;
    this.step = 1;
  }

  increment() {
    this.value += this.step;
    return this.value;
  }

  decrement() {
    this.value -= this.step;
    return this.value;
  }

  setStep(step) {
    this.step = Number(step);
    return this.step;
  }

  getValue() {
    return this.value;
  }

  getStep() {
    return this.step;
  }
}

// ViewModel
class CounterViewModel {
  constructor(model) {
    this.model = model;
    this.subscribers = new Map();
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
  }

  notify(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(callback => callback(data));
    }
  }

  increment() {
    const value = this.model.increment();
    this.notify('valueChanged', value);
  }

  decrement() {
    const value = this.model.decrement();
    this.notify('valueChanged', value);
  }

  setStep(step) {
    const newStep = this.model.setStep(step);
    this.notify('stepChanged', newStep);
  }

  getFormattedValue() {
    return `Counter: ${this.model.getValue()}`;
  }

  getFormattedStep() {
    return `Step: ${this.model.getStep()}`;
  }
}

// View
class CounterView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.initializeView();
    this.bindEvents();
  }

  initializeView() {
    this.container = document.createElement('div');
    this.container.className = 'counter-container';

    this.valueDisplay = document.createElement('h2');
    this.valueDisplay.textContent = this.viewModel.getFormattedValue();

    this.stepDisplay = document.createElement('p');
    this.stepDisplay.textContent = this.viewModel.getFormattedStep();

    this.incrementButton = document.createElement('button');
    this.incrementButton.textContent = '+';

    this.decrementButton = document.createElement('button');
    this.decrementButton.textContent = '-';

    this.stepInput = document.createElement('input');
    this.stepInput.type = 'number';
    this.stepInput.value = '1';
    this.stepInput.min = '1';

    this.container.append(
      this.valueDisplay,
      this.stepDisplay,
      this.decrementButton,
      this.incrementButton,
      this.stepInput
    );

    document.body.appendChild(this.container);
  }

  bindEvents() {
    this.incrementButton.addEventListener('click', () => {
      this.viewModel.increment();
    });

    this.decrementButton.addEventListener('click', () => {
      this.viewModel.decrement();
    });

    this.stepInput.addEventListener('change', (e) => {
      this.viewModel.setStep(e.target.value);
    });

    this.viewModel.subscribe('valueChanged', () => {
      this.valueDisplay.textContent = this.viewModel.getFormattedValue();
    });

    this.viewModel.subscribe('stepChanged', () => {
      this.stepDisplay.textContent = this.viewModel.getFormattedStep();
    });
  }
}

// Usage
const counterModel = new CounterModel();
const counterViewModel = new CounterViewModel(counterModel);
const counterView = new CounterView(counterViewModel);
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về MVC với User Management

```typescript
// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Model
class UserModel {
  private users: User[] = [];
  private observers: ((users: User[]) => void)[] = [];

  async fetchUsers(): Promise<void> {
    // Giả lập API call
    this.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
    ];
    this.notify();
  }

  addUser(user: Omit<User, 'id'>): void {
    const newUser: User = {
      ...user,
      id: Date.now()
    };
    this.users.push(newUser);
    this.notify();
  }

  updateUser(id: number, updates: Partial<User>): void {
    const user = this.users.find(u => u.id === id);
    if (user) {
      Object.assign(user, updates);
      this.notify();
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
    this.notify();
  }

  getUsers(): User[] {
    return [...this.users];
  }

  subscribe(observer: (users: User[]) => void): void {
    this.observers.push(observer);
  }

  private notify(): void {
    this.observers.forEach(observer => observer(this.getUsers()));
  }
}

// View
class UserView {
  private container: HTMLElement;
  private userList: HTMLElement;
  private form: HTMLFormElement;

  constructor() {
    this.container = document.createElement('div');
    this.setupUserList();
    this.setupForm();
    document.body.appendChild(this.container);
  }

  private setupUserList(): void {
    this.userList = document.createElement('div');
    this.userList.className = 'user-list';
    this.container.appendChild(this.userList);
  }

  private setupForm(): void {
    this.form = document.createElement('form');
    this.form.innerHTML = `
      <input type="text" name="name" placeholder="Name" required>
      <input type="email" name="email" placeholder="Email" required>
      <select name="role" required>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Add User</button>
    `;
    this.container.appendChild(this.form);
  }

  displayUsers(users: User[]): void {
    this.userList.innerHTML = '';
    users.forEach(user => {
      const userElement = document.createElement('div');
      userElement.className = 'user-item';
      userElement.innerHTML = `
        <span>${user.name} (${user.email}) - ${user.role}</span>
        <button class="edit" data-id="${user.id}">Edit</button>
        <button class="delete" data-id="${user.id}">Delete</button>
      `;
      this.userList.appendChild(userElement);
    });
  }

  bindAddUser(handler: (user: Omit<User, 'id'>) => void): void {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(this.form);
      handler({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as 'admin' | 'user'
      });
      this.form.reset();
    });
  }

  bindDeleteUser(handler: (id: number) => void): void {
    this.userList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.className === 'delete') {
        const id = Number(target.dataset.id);
        handler(id);
      }
    });
  }

  bindUpdateUser(handler: (id: number, updates: Partial<User>) => void): void {
    this.userList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.className === 'edit') {
        const id = Number(target.dataset.id);
        const name = prompt('Enter new name:');
        if (name) {
          handler(id, { name });
        }
      }
    });
  }
}

// Controller
class UserController {
  constructor(
    private model: UserModel,
    private view: UserView
  ) {
    this.model.subscribe(users => this.view.displayUsers(users));
    this.view.bindAddUser(this.handleAddUser.bind(this));
    this.view.bindDeleteUser(this.handleDeleteUser.bind(this));
    this.view.bindUpdateUser(this.handleUpdateUser.bind(this));
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.model.fetchUsers();
  }

  private handleAddUser(user: Omit<User, 'id'>): void {
    this.model.addUser(user);
  }

  private handleDeleteUser(id: number): void {
    this.model.deleteUser(id);
  }

  private handleUpdateUser(id: number, updates: Partial<User>): void {
    this.model.updateUser(id, updates);
  }
}

// Usage
const userApp = new UserController(new UserModel(), new UserView());
```

### 3.2 Ví dụ về MVVM với Shopping Cart

```typescript
// Types
interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

// Model
class ShoppingCartModel {
  private items: CartItem[] = [];

  addItem(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
  }

  removeItem(productId: number): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}

// ViewModel
class ShoppingCartViewModel {
  private subscribers = new Map<string, Function[]>();

  constructor(private model: ShoppingCartModel) {}

  subscribe(event: string, callback: Function): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)?.push(callback);
  }

  private notify(event: string, data?: any): void {
    this.subscribers.get(event)?.forEach(callback => callback(data));
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.model.addItem(product, quantity);
    this.notifyCartUpdated();
  }

  removeFromCart(productId: number): void {
    this.model.removeItem(productId);
    this.notifyCartUpdated();
  }

  updateQuantity(productId: number, quantity: number): void {
    this.model.updateQuantity(productId, quantity);
    this.notifyCartUpdated();
  }

  private notifyCartUpdated(): void {
    this.notify('cartUpdated', {
      items: this.getFormattedItems(),
      total: this.getFormattedTotal(),
      itemCount: this.getFormattedItemCount()
    });
  }

  getFormattedItems(): string[] {
    return this.model.getItems().map(item =>
      `${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    );
  }

  getFormattedTotal(): string {
    return `Total: $${this.model.getTotalPrice().toFixed(2)}`;
  }

  getFormattedItemCount(): string {
    return `Items in cart: ${this.model.getTotalItems()}`;
  }
}

// View
class ShoppingCartView {
  private container: HTMLElement;
  private itemList: HTMLElement;
  private totalDisplay: HTMLElement;
  private itemCountDisplay: HTMLElement;

  constructor(private viewModel: ShoppingCartViewModel) {
    this.setupUI();
    this.bindEvents();
  }

  private setupUI(): void {
    this.container = document.createElement('div');
    this.container.className = 'shopping-cart';

    this.itemList = document.createElement('ul');
    this.totalDisplay = document.createElement('p');
    this.itemCountDisplay = document.createElement('p');

    const addItemForm = document.createElement('form');
    addItemForm.innerHTML = `
      <input type="text" id="productName" placeholder="Product name" required>
      <input type="number" id="productPrice" placeholder="Price" required>
      <input type="number" id="quantity" value="1" min="1" required>
      <button type="submit">Add to Cart</button>
    `;

    this.container.append(
      this.itemCountDisplay,
      this.itemList,
      this.totalDisplay,
      addItemForm
    );

    document.body.appendChild(this.container);
  }

  private bindEvents(): void {
    this.viewModel.subscribe('cartUpdated', (data: {
      items: string[],
      total: string,
      itemCount: string
    }) => {
      this.updateDisplay(data);
    });

    const form = this.container.querySelector('form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('productName') as HTMLInputElement;
      const priceInput = document.getElementById('productPrice') as HTMLInputElement;
      const quantityInput = document.getElementById('quantity') as HTMLInputElement;

      this.viewModel.addToCart({
        id: Date.now(),
        name: nameInput.value,
        price: Number(priceInput.value)
      }, Number(quantityInput.value));

      form.reset();
    });

    this.itemList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.className === 'remove-item') {
        const productId = Number(target.dataset.id);
        this.viewModel.removeFromCart(productId);
      }
    });
  }

  private updateDisplay(data: {
    items: string[],
    total: string,
    itemCount: string
  }): void {
    this.itemList.innerHTML = data.items
      .map(item => `<li>${item}</li>`)
      .join('');
    this.totalDisplay.textContent = data.total;
    this.itemCountDisplay.textContent = data.itemCount;
  }
}

// Usage
const cartModel = new ShoppingCartModel();
const cartViewModel = new ShoppingCartViewModel(cartModel);
const cartView = new ShoppingCartView(cartViewModel);

// Add some initial products
cartViewModel.addToCart({ id: 1, name: 'Laptop', price: 999.99 });
cartViewModel.addToCart({ id: 2, name: 'Mouse', price: 29.99 }, 2);
```

## 4. Ưu điểm và Nhược điểm

### 4.1 MVC Pattern

#### Ưu điểm
1. **Tách biệt trách nhiệm**: Phân chia rõ ràng giữa dữ liệu, giao diện và xử lý
2. **Dễ bảo trì**: Có thể thay đổi từng phần mà không ảnh hưởng các phần khác
3. **Tái sử dụng**: Có thể tái sử dụng Model cho nhiều View khác nhau
4. **Dễ test**: Dễ dàng test từng thành phần riêng biệt

#### Nhược điểm
1. **Phức tạp**: Có thể phức tạp hóa các ứng dụng đơn giản
2. **Tight coupling**: Controller thường phụ thuộc chặt chẽ vào View
3. **Khó scale**: Có thể khó scale khi ứng dụng phức tạp
4. **Nhiều code**: Yêu cầu nhiều code boilerplate

### 4.2 MVVM Pattern

#### Ưu điểm
1. **Data binding**: Tự động đồng bộ dữ liệu giữa Model và View
2. **Tách biệt UI**: View chỉ quan tâm đến hiển thị
3. **Dễ test**: ViewModel dễ test vì không phụ thuộc vào View
4. **Reusable**: ViewModel có thể được tái sử dụng

#### Nhược điểm
1. **Học tập**: Đòi hỏi thời gian học và hiểu pattern
2. **Memory overhead**: Data binding có thể tốn nhiều bộ nhớ
3. **Debugging**: Khó debug khi có nhiều binding
4. **Overkill**: Có thể quá phức tạp cho ứng dụng nhỏ

## 5. Khi nào nên sử dụng?

### 5.1 MVC Pattern
1. **Ứng dụng web truyền thống**: Với server-side rendering
2. **CRUD đơn giản**: Các ứng dụng CRUD cơ bản
3. **Tương tác đơn giản**: Khi tương tác người dùng không phức tạp
4. **Nhiều view**: Khi cần nhiều cách hiển thị khác nhau cho cùng dữ liệu

### 5.2 MVVM Pattern
1. **SPA**: Các ứng dụng Single Page Application
2. **Tương tác phức tạp**: Khi có nhiều tương tác người dùng
3. **Real-time**: Ứng dụng cần cập nhật real-time
4. **Desktop-like**: Ứng dụng web giống desktop

## 6. Kết luận

MVVM và MVC là hai mẫu thiết kế kiến trúc quan trọng trong phát triển ứng dụng web. MVC phù hợp với các ứng dụng web truyền thống và CRUD đơn giản, trong khi MVVM thích hợp cho các ứng dụng web hiện đại với tương tác phức tạp. Việc lựa chọn pattern nào phụ thuộc vào yêu cầu cụ thể của dự án và công nghệ sử dụng.
