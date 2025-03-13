---
title: "Structural Pattern [2/7] - Bridge Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-05-07
description: "Bridge Pattern là một mẫu thiết kế cấu trúc cho phép tách biệt abstraction và implementation, giúp chúng có thể thay đổi độc lập. Bài viết này phân tích cách triển khai Bridge Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "bridge-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Bridge
  - Structural Patterns
---

## 1. Bridge Pattern là gì?

Bridge Pattern là một mẫu thiết kế cấu trúc cho phép bạn tách một lớp lớn hoặc một tập hợp các lớp có liên quan thành hai phần riêng biệt: abstraction và implementation. Pattern này giúp các thành phần này có thể thay đổi độc lập với nhau.

Các thành phần chính trong Bridge Pattern:
- **Abstraction**: Interface cấp cao định nghĩa cách sử dụng Implementation
- **Refined Abstraction**: Mở rộng của Abstraction
- **Implementation**: Interface cho các implementation cụ thể
- **Concrete Implementation**: Triển khai cụ thể của Implementation

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ cơ bản về Theme System

```javascript
// Implementation interface
class Theme {
  getColor() {
    throw new Error('getColor() must be implemented');
  }
  
  getSpacing() {
    throw new Error('getSpacing() must be implemented');
  }
  
  getFontSize() {
    throw new Error('getFontSize() must be implemented');
  }
}

// Concrete implementations
class LightTheme extends Theme {
  getColor() {
    return {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      text: '#000000'
    };
  }
  
  getSpacing() {
    return {
      small: '4px',
      medium: '8px',
      large: '16px'
    };
  }
  
  getFontSize() {
    return {
      small: '12px',
      medium: '16px',
      large: '24px'
    };
  }
}

class DarkTheme extends Theme {
  getColor() {
    return {
      primary: '#0056b3',
      secondary: '#495057',
      background: '#1a1a1a',
      text: '#ffffff'
    };
  }
  
  getSpacing() {
    return {
      small: '4px',
      medium: '8px',
      large: '16px'
    };
  }
  
  getFontSize() {
    return {
      small: '12px',
      medium: '16px',
      large: '24px'
    };
  }
}

// Abstraction
class UIComponent {
  constructor(theme) {
    this.theme = theme;
  }
  
  render() {
    throw new Error('render() must be implemented');
  }
}

// Refined abstractions
class Button extends UIComponent {
  render() {
    const colors = this.theme.getColor();
    const spacing = this.theme.getSpacing();
    const fontSize = this.theme.getFontSize();
    
    return {
      backgroundColor: colors.primary,
      color: colors.text,
      padding: `${spacing.small} ${spacing.medium}`,
      fontSize: fontSize.medium,
      border: 'none',
      borderRadius: '4px'
    };
  }
}

class Card extends UIComponent {
  render() {
    const colors = this.theme.getColor();
    const spacing = this.theme.getSpacing();
    const fontSize = this.theme.getFontSize();
    
    return {
      backgroundColor: colors.background,
      color: colors.text,
      padding: spacing.large,
      margin: spacing.medium,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    };
  }
}

// Usage
const lightTheme = new LightTheme();
const darkTheme = new DarkTheme();

const lightButton = new Button(lightTheme);
const darkButton = new Button(darkTheme);
const lightCard = new Card(lightTheme);
const darkCard = new Card(darkTheme);

console.log('Light Button:', lightButton.render());
console.log('Dark Button:', darkButton.render());
console.log('Light Card:', lightCard.render());
console.log('Dark Card:', darkCard.render());
```

### 2.2 Ví dụ về Device Remote Control

```javascript
// Implementation interface
class Device {
  isEnabled() {
    throw new Error('isEnabled() must be implemented');
  }
  
  enable() {
    throw new Error('enable() must be implemented');
  }
  
  disable() {
    throw new Error('disable() must be implemented');
  }
  
  getVolume() {
    throw new Error('getVolume() must be implemented');
  }
  
  setVolume(percent) {
    throw new Error('setVolume() must be implemented');
  }
  
  getChannel() {
    throw new Error('getChannel() must be implemented');
  }
  
  setChannel(channel) {
    throw new Error('setChannel() must be implemented');
  }
}

// Concrete implementations
class TV extends Device {
  constructor() {
    super();
    this.enabled = false;
    this.volume = 30;
    this.channel = 1;
  }
  
  isEnabled() {
    return this.enabled;
  }
  
  enable() {
    this.enabled = true;
  }
  
  disable() {
    this.enabled = false;
  }
  
  getVolume() {
    return this.volume;
  }
  
  setVolume(percent) {
    this.volume = Math.max(0, Math.min(100, percent));
  }
  
  getChannel() {
    return this.channel;
  }
  
  setChannel(channel) {
    this.channel = channel;
  }
}

class Radio extends Device {
  constructor() {
    super();
    this.enabled = false;
    this.volume = 20;
    this.channel = 87.5; // FM frequency
  }
  
  isEnabled() {
    return this.enabled;
  }
  
  enable() {
    this.enabled = true;
  }
  
  disable() {
    this.enabled = false;
  }
  
  getVolume() {
    return this.volume;
  }
  
  setVolume(percent) {
    this.volume = Math.max(0, Math.min(100, percent));
  }
  
  getChannel() {
    return this.channel;
  }
  
  setChannel(channel) {
    // FM frequency range: 87.5 to 108.0
    this.channel = Math.max(87.5, Math.min(108.0, channel));
  }
}

// Abstraction
class Remote {
  constructor(device) {
    this.device = device;
  }
  
  togglePower() {
    if (this.device.isEnabled()) {
      this.device.disable();
    } else {
      this.device.enable();
    }
  }
  
  volumeUp() {
    this.device.setVolume(this.device.getVolume() + 10);
  }
  
  volumeDown() {
    this.device.setVolume(this.device.getVolume() - 10);
  }
  
  channelUp() {
    this.device.setChannel(this.device.getChannel() + 1);
  }
  
  channelDown() {
    this.device.setChannel(this.device.getChannel() - 1);
  }
}

// Refined abstraction
class AdvancedRemote extends Remote {
  mute() {
    this.device.setVolume(0);
  }
  
  setChannel(number) {
    this.device.setChannel(number);
  }
}

// Usage
const tv = new TV();
const radio = new Radio();

const tvRemote = new Remote(tv);
const radioRemote = new AdvancedRemote(radio);

// Using TV remote
tvRemote.togglePower();
tvRemote.volumeUp();
tvRemote.channelUp();
console.log('TV State:', {
  enabled: tv.isEnabled(),
  volume: tv.getVolume(),
  channel: tv.getChannel()
});

// Using Radio remote
radioRemote.togglePower();
radioRemote.setChannel(98.5);
radioRemote.mute();
console.log('Radio State:', {
  enabled: radio.isEnabled(),
  volume: radio.getVolume(),
  channel: radio.getChannel()
});
```

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ giúp triển khai Bridge Pattern an toàn và rõ ràng hơn:

```typescript
// Message interfaces
interface Message {
  content: string;
  importance: 'normal' | 'important' | 'urgent';
}

// Sender interface (Implementation)
interface MessageSender {
  send(msg: Message): Promise<boolean>;
  validateMessage(msg: Message): boolean;
  formatMessage(msg: Message): string;
}

// Concrete implementations
class EmailSender implements MessageSender {
  constructor(private config: { host: string; port: number; secure: boolean }) {}
  
  async send(msg: Message): Promise<boolean> {
    if (!this.validateMessage(msg)) {
      throw new Error('Invalid message');
    }
    
    const formattedMessage = this.formatMessage(msg);
    console.log(`Sending email: ${formattedMessage}`);
    // Simulate email sending
    return true;
  }
  
  validateMessage(msg: Message): boolean {
    return msg.content.length > 0;
  }
  
  formatMessage(msg: Message): string {
    const prefix = msg.importance === 'urgent' ? '🚨 ' :
                  msg.importance === 'important' ? '❗ ' : '';
    return `${prefix}${msg.content}`;
  }
}

class SMSSender implements MessageSender {
  constructor(private config: { apiKey: string; from: string }) {}
  
  async send(msg: Message): Promise<boolean> {
    if (!this.validateMessage(msg)) {
      throw new Error('Invalid message');
    }
    
    const formattedMessage = this.formatMessage(msg);
    console.log(`Sending SMS: ${formattedMessage}`);
    // Simulate SMS sending
    return true;
  }
  
  validateMessage(msg: Message): boolean {
    return msg.content.length <= 160; // SMS length limit
  }
  
  formatMessage(msg: Message): string {
    const prefix = msg.importance === 'urgent' ? 'URGENT: ' :
                  msg.importance === 'important' ? 'IMPORTANT: ' : '';
    return `${prefix}${msg.content}`;
  }
}

class SlackSender implements MessageSender {
  constructor(private config: { webhookUrl: string; channel: string }) {}
  
  async send(msg: Message): Promise<boolean> {
    if (!this.validateMessage(msg)) {
      throw new Error('Invalid message');
    }
    
    const formattedMessage = this.formatMessage(msg);
    console.log(`Sending Slack message: ${formattedMessage}`);
    // Simulate Slack sending
    return true;
  }
  
  validateMessage(msg: Message): boolean {
    return msg.content.length > 0;
  }
  
  formatMessage(msg: Message): string {
    const emoji = msg.importance === 'urgent' ? ':rotating_light: ' :
                 msg.importance === 'important' ? ':warning: ' : ':information_source: ';
    return `${emoji} ${msg.content}`;
  }
}

// Notification abstraction
abstract class NotificationService {
  constructor(protected sender: MessageSender) {}
  
  abstract notify(content: string, importance: Message['importance']): Promise<void>;
}

// Refined abstractions
class UserNotificationService extends NotificationService {
  async notify(content: string, importance: Message['importance'] = 'normal'): Promise<void> {
    const message: Message = { content, importance };
    
    try {
      await this.sender.send(message);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }
}

class SystemNotificationService extends NotificationService {
  private readonly retryAttempts = 3;
  private readonly retryDelay = 1000; // ms
  
  async notify(content: string, importance: Message['importance'] = 'important'): Promise<void> {
    const message: Message = { content, importance };
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await this.sender.send(message);
        console.log('System notification sent successfully');
        return;
      } catch (error) {
        if (attempt === this.retryAttempts) {
          console.error('Failed to send system notification after all retries:', error);
          throw error;
        }
        
        console.warn(`Retry attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
  }
}

// Usage
async function main() {
  // Configure senders
  const emailSender = new EmailSender({
    host: 'smtp.example.com',
    port: 587,
    secure: true
  });
  
  const smsSender = new SMSSender({
    apiKey: 'your-api-key',
    from: '+1234567890'
  });
  
  const slackSender = new SlackSender({
    webhookUrl: 'https://hooks.slack.com/services/xxx',
    channel: '#notifications'
  });
  
  // Create notification services
  const userEmailNotifier = new UserNotificationService(emailSender);
  const userSMSNotifier = new UserNotificationService(smsSender);
  const systemNotifier = new SystemNotificationService(slackSender);
  
  try {
    // Send user notifications
    await userEmailNotifier.notify(
      'Your order has been shipped!',
      'normal'
    );
    
    await userSMSNotifier.notify(
      'Your password will expire soon',
      'important'
    );
    
    // Send system notification
    await systemNotifier.notify(
      'High CPU usage detected on production server',
      'urgent'
    );
  } catch (error) {
    console.error('Error in notification demo:', error);
  }
}

main();
```

## 4. Ví dụ thực tế: Rendering Engine

Hãy xem xét một ví dụ thực tế về việc sử dụng Bridge Pattern để tạo một rendering engine linh hoạt:

```typescript
// Renderer interface (Implementation)
interface Renderer {
  createElement(type: string): any;
  setProperty(element: any, property: string, value: any): void;
  appendChild(parent: any, child: any): void;
  createTextNode(text: string): any;
  render(element: any, container: any): void;
}

// Concrete implementations
class DOMRenderer implements Renderer {
  createElement(type: string) {
    return document.createElement(type);
  }
  
  setProperty(element: HTMLElement, property: string, value: any) {
    if (property === 'className') {
      element.className = value;
    } else if (property === 'textContent') {
      element.textContent = value;
    } else {
      element.setAttribute(property, value);
    }
  }
  
  appendChild(parent: HTMLElement, child: HTMLElement | Text) {
    parent.appendChild(child);
  }
  
  createTextNode(text: string) {
    return document.createTextNode(text);
  }
  
  render(element: HTMLElement, container: HTMLElement) {
    container.appendChild(element);
  }
}

class VirtualRenderer implements Renderer {
  createElement(type: string) {
    return {
      type,
      props: {},
      children: []
    };
  }
  
  setProperty(element: any, property: string, value: any) {
    element.props[property] = value;
  }
  
  appendChild(parent: any, child: any) {
    parent.children.push(child);
  }
  
  createTextNode(text: string) {
    return {
      type: 'text',
      value: text
    };
  }
  
  render(element: any, container: any) {
    container.root = element;
  }
}

// Component abstraction
abstract class Component {
  protected element: any;
  
  constructor(protected renderer: Renderer) {
    this.element = null;
  }
  
  abstract render(): void;
  
  mount(container: any) {
    this.render();
    this.renderer.render(this.element, container);
  }
}

// Refined abstractions
class Button extends Component {
  constructor(
    renderer: Renderer,
    private text: string,
    private onClick: () => void
  ) {
    super(renderer);
  }
  
  render() {
    this.element = this.renderer.createElement('button');
    this.renderer.setProperty(this.element, 'className', 'button');
    
    const textNode = this.renderer.createTextNode(this.text);
    this.renderer.appendChild(this.element, textNode);
    
    if (this.onClick) {
      this.renderer.setProperty(this.element, 'onclick', this.onClick);
    }
  }
}

class Card extends Component {
  constructor(
    renderer: Renderer,
    private title: string,
    private content: string
  ) {
    super(renderer);
  }
  
  render() {
    this.element = this.renderer.createElement('div');
    this.renderer.setProperty(this.element, 'className', 'card');
    
    const titleElement = this.renderer.createElement('h2');
    this.renderer.setProperty(titleElement, 'className', 'card-title');
    const titleText = this.renderer.createTextNode(this.title);
    this.renderer.appendChild(titleElement, titleText);
    
    const contentElement = this.renderer.createElement('p');
    this.renderer.setProperty(contentElement, 'className', 'card-content');
    const contentText = this.renderer.createTextNode(this.content);
    this.renderer.appendChild(contentElement, contentText);
    
    this.renderer.appendChild(this.element, titleElement);
    this.renderer.appendChild(this.element, contentElement);
  }
}

// Usage
// DOM rendering
const domRenderer = new DOMRenderer();
const domButton = new Button(
  domRenderer,
  'Click me!',
  () => console.log('Button clicked!')
);
const domCard = new Card(
  domRenderer,
  'Welcome',
  'This is a card component rendered in the DOM.'
);

// Virtual rendering
const virtualRenderer = new VirtualRenderer();
const virtualButton = new Button(
  virtualRenderer,
  'Virtual Button',
  () => console.log('Virtual button clicked!')
);
const virtualCard = new Card(
  virtualRenderer,
  'Virtual Card',
  'This is a card component in the virtual DOM.'
);

// Mount components
const domContainer = document.getElementById('app');
if (domContainer) {
  domButton.mount(domContainer);
  domCard.mount(domContainer);
}

const virtualContainer = { root: null };
virtualButton.mount(virtualContainer);
virtualCard.mount(virtualContainer);

console.log('Virtual DOM:', virtualContainer);
```

## 5. Khi nào nên sử dụng Bridge Pattern

Bridge Pattern phù hợp trong các tình huống sau:

1. **Khi muốn tách biệt abstraction và implementation**
2. **Khi cần mở rộng class theo nhiều chiều độc lập**
3. **Khi implementation cần thay đổi runtime**
4. **Khi muốn chia sẻ implementation giữa nhiều objects**
5. **Khi cần tránh sự phụ thuộc vĩnh viễn giữa interface và implementation**

Ví dụ thực tế:
- Hệ thống giao diện người dùng đa nền tảng
- Hệ thống xử lý đa phương tiện
- Hệ thống thông báo đa kênh
- Database abstraction layers
- Cross-platform rendering engines

## 6. So sánh với các Pattern khác

### So sánh với Adapter Pattern

| Bridge Pattern | Adapter Pattern |
|---------------|----------------|
| Thiết kế từ đầu | Làm việc với code có sẵn |
| Tách biệt interface | Làm interface tương thích |
| Thay đổi độc lập | Thay đổi một chiều |
| Cấu trúc linh hoạt | Cấu trúc cố định |

### So sánh với Strategy Pattern

| Bridge Pattern | Strategy Pattern |
|---------------|-----------------|
| Tách biệt cấu trúc | Tách biệt hành vi |
| Quan hệ hai chiều | Quan hệ một chiều |
| Focus on interface | Focus on algorithm |
| Permanent relationship | Changeable relationship |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Tách biệt interface** và implementation
- **Tăng khả năng mở rộng** theo nhiều chiều
- **Giảm sự phụ thuộc** giữa các thành phần
- **Cải thiện khả năng tái sử dụng** code
- **Tuân thủ Single Responsibility** và Open/Closed Principles

### Nhược điểm:
- **Tăng độ phức tạp** của code
- **Khó áp dụng** cho class đơn giản
- **Yêu cầu thiết kế cẩn thận** từ đầu
- **Có thể gây khó hiểu** cho developer mới
- **Overhead về performance** với nhiều abstraction layers

## 8. Kết luận

Bridge Pattern là một công cụ mạnh mẽ để tách biệt abstraction và implementation, cho phép chúng thay đổi độc lập với nhau. Pattern này đặc biệt hữu ích trong các hệ thống lớn, nơi cần sự linh hoạt và khả năng mở rộng cao.

Khi quyết định sử dụng Bridge Pattern, hãy cân nhắc độ phức tạp của hệ thống và nhu cầu thay đổi trong tương lai. Pattern này có thể tăng độ phức tạp của code, nhưng lợi ích về tính linh hoạt và khả năng bảo trì thường xứng đáng với chi phí này.