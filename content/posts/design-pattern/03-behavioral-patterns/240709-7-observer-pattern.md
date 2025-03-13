---
title: "Behavioral Pattern [7/11] - Observer Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-07-09
description: "Observer Pattern là một mẫu thiết kế hành vi cho phép định nghĩa cơ chế đăng ký để thông báo cho nhiều đối tượng về bất kỳ sự kiện nào xảy ra với đối tượng mà họ đang quan sát. Bài viết này phân tích cách triển khai Observer Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "observer-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Observer
  - Behavioral Patterns
---

## 1. Observer Pattern là gì?

Observer Pattern là một mẫu thiết kế hành vi định nghĩa mối quan hệ một-nhiều giữa các đối tượng, trong đó khi một đối tượng thay đổi trạng thái, tất cả các đối tượng phụ thuộc của nó đều được thông báo và cập nhật tự động. Pattern này thường được sử dụng trong lập trình hướng sự kiện (event-driven programming).

Các thành phần chính trong Observer Pattern:
- **Subject (Observable)**: Đối tượng chứa trạng thái và gửi thông báo
- **Observer**: Interface định nghĩa phương thức cập nhật cho các observer
- **ConcreteObserver**: Các lớp cụ thể triển khai Observer interface

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về News Agency

```javascript
// Subject (Observable)
class NewsAgency {
  constructor() {
    this.subscribers = new Set();
    this.news = '';
  }

  subscribe(observer) {
    this.subscribers.add(observer);
    console.log(`${observer.name} đã đăng ký theo dõi tin tức`);
  }

  unsubscribe(observer) {
    this.subscribers.delete(observer);
    console.log(`${observer.name} đã hủy đăng ký theo dõi tin tức`);
  }

  notify() {
    this.subscribers.forEach(observer => {
      observer.update(this.news);
    });
  }

  publishNews(news) {
    this.news = news;
    console.log(`\nTin tức mới: ${news}`);
    this.notify();
  }
}

// Observer
class NewsSubscriber {
  constructor(name) {
    this.name = name;
  }

  update(news) {
    console.log(`${this.name} nhận được tin tức: ${news}`);
  }
}

// Usage
const newsAgency = new NewsAgency();

const subscriber1 = new NewsSubscriber('Báo VnExpress');
const subscriber2 = new NewsSubscriber('Báo Tuổi Trẻ');
const subscriber3 = new NewsSubscriber('Báo Thanh Niên');

newsAgency.subscribe(subscriber1);
newsAgency.subscribe(subscriber2);
newsAgency.subscribe(subscriber3);

newsAgency.publishNews('Việt Nam vô địch AFF Cup 2024!');

newsAgency.unsubscribe(subscriber2);

newsAgency.publishNews('Thời tiết Hà Nội hôm nay nắng đẹp');
```

### 2.2 Ví dụ về Stock Market

```javascript
// Subject (Observable)
class StockMarket {
  constructor() {
    this.observers = new Map();
    this.stocks = new Map();
  }

  addStock(symbol, price) {
    this.stocks.set(symbol, price);
    this.observers.set(symbol, new Set());
    console.log(`Thêm cổ phiếu ${symbol} với giá ${price}`);
  }

  subscribe(symbol, observer) {
    const observers = this.observers.get(symbol);
    if (observers) {
      observers.add(observer);
      console.log(`${observer.name} đăng ký theo dõi cổ phiếu ${symbol}`);
    }
  }

  unsubscribe(symbol, observer) {
    const observers = this.observers.get(symbol);
    if (observers) {
      observers.delete(observer);
      console.log(`${observer.name} hủy theo dõi cổ phiếu ${symbol}`);
    }
  }

  updateStockPrice(symbol, price) {
    const oldPrice = this.stocks.get(symbol);
    this.stocks.set(symbol, price);
    console.log(`\nGiá cổ phiếu ${symbol} thay đổi từ ${oldPrice} thành ${price}`);
    
    const observers = this.observers.get(symbol);
    if (observers) {
      observers.forEach(observer => {
        observer.update(symbol, oldPrice, price);
      });
    }
  }
}

// Observer
class Investor {
  constructor(name) {
    this.name = name;
  }

  update(symbol, oldPrice, newPrice) {
    const change = ((newPrice - oldPrice) / oldPrice * 100).toFixed(2);
    const trend = newPrice > oldPrice ? 'tăng' : 'giảm';
    console.log(`${this.name}: Cổ phiếu ${symbol} ${trend} ${Math.abs(change)}% (${oldPrice} → ${newPrice})`);
  }
}

// Usage
const market = new StockMarket();

market.addStock('VNM', 100);
market.addStock('FPT', 80);
market.addStock('VIC', 120);

const investor1 = new Investor('Nhà đầu tư A');
const investor2 = new Investor('Nhà đầu tư B');
const investor3 = new Investor('Nhà đầu tư C');

market.subscribe('VNM', investor1);
market.subscribe('VNM', investor2);
market.subscribe('FPT', investor2);
market.subscribe('VIC', investor3);

market.updateStockPrice('VNM', 110);
market.updateStockPrice('FPT', 85);
market.updateStockPrice('VIC', 115);

market.unsubscribe('VNM', investor1);
market.updateStockPrice('VNM', 115);
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về Weather Station

```typescript
// Observer interface
interface WeatherObserver {
  update(temperature: number, humidity: number, pressure: number): void;
}

// Subject interface
interface WeatherSubject {
  registerObserver(observer: WeatherObserver): void;
  removeObserver(observer: WeatherObserver): void;
  notifyObservers(): void;
}

// Concrete Subject
class WeatherStation implements WeatherSubject {
  private observers: Set<WeatherObserver>;
  private temperature: number;
  private humidity: number;
  private pressure: number;

  constructor() {
    this.observers = new Set();
    this.temperature = 0;
    this.humidity = 0;
    this.pressure = 0;
  }

  registerObserver(observer: WeatherObserver): void {
    this.observers.add(observer);
  }

  removeObserver(observer: WeatherObserver): void {
    this.observers.delete(observer);
  }

  notifyObservers(): void {
    this.observers.forEach(observer => {
      observer.update(this.temperature, this.humidity, this.pressure);
    });
  }

  setMeasurements(temperature: number, humidity: number, pressure: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.measurementsChanged();
  }

  private measurementsChanged(): void {
    this.notifyObservers();
  }
}

// Concrete Observers
class WeatherDisplay implements WeatherObserver {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(temperature: number, humidity: number, pressure: number): void {
    console.log(`\n${this.name} - Cập nhật thời tiết:`);
    console.log(`Nhiệt độ: ${temperature}°C`);
    console.log(`Độ ẩm: ${humidity}%`);
    console.log(`Áp suất: ${pressure} hPa`);
  }
}

class WeatherAlert implements WeatherObserver {
  update(temperature: number, humidity: number, pressure: number): void {
    if (temperature > 35) {
      console.log('\nCẢNH BÁO: Nhiệt độ quá cao!');
    }
    if (humidity > 90) {
      console.log('\nCẢNH BÁO: Độ ẩm quá cao!');
    }
    if (pressure < 980) {
      console.log('\nCẢNH BÁO: Áp suất thấp, có thể có bão!');
    }
  }
}

// Usage
const weatherStation = new WeatherStation();

const display1 = new WeatherDisplay('Màn hình 1');
const display2 = new WeatherDisplay('Màn hình 2');
const alert = new WeatherAlert();

weatherStation.registerObserver(display1);
weatherStation.registerObserver(display2);
weatherStation.registerObserver(alert);

// Cập nhật thời tiết
weatherStation.setMeasurements(32, 85, 1012);
weatherStation.setMeasurements(36, 92, 975);

// Gỡ bỏ một observer
weatherStation.removeObserver(display2);

// Cập nhật lại
weatherStation.setMeasurements(30, 80, 1008);
```

### 3.2 Ví dụ về Event System

```typescript
// Event types
type EventType = string;
type EventHandler = (data: any) => void;

// Observer interface
interface EventObserver {
  update(eventType: EventType, data: any): void;
}

// Subject
class EventEmitter {
  private observers: Map<EventType, Set<EventObserver>>;

  constructor() {
    this.observers = new Map();
  }

  subscribe(eventType: EventType, observer: EventObserver): void {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, new Set());
    }
    this.observers.get(eventType)!.add(observer);
  }

  unsubscribe(eventType: EventType, observer: EventObserver): void {
    const observers = this.observers.get(eventType);
    if (observers) {
      observers.delete(observer);
    }
  }

  emit(eventType: EventType, data: any): void {
    const observers = this.observers.get(eventType);
    if (observers) {
      observers.forEach(observer => observer.update(eventType, data));
    }
  }
}

// Concrete Observer
class Logger implements EventObserver {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(eventType: EventType, data: any): void {
    console.log(`[${this.name}] Event ${eventType}:`, data);
  }
}

// Concrete Observer
class Analytics implements EventObserver {
  update(eventType: EventType, data: any): void {
    console.log(`Analytics - Tracking event ${eventType}`);
    // Giả lập gửi dữ liệu phân tích
    console.log('Sending analytics data:', {
      event: eventType,
      timestamp: new Date().toISOString(),
      data
    });
  }
}

// Usage
const eventSystem = new EventEmitter();

const systemLogger = new Logger('System');
const securityLogger = new Logger('Security');
const analytics = new Analytics();

// Đăng ký observers cho các sự kiện khác nhau
eventSystem.subscribe('user:login', systemLogger);
eventSystem.subscribe('user:login', analytics);
eventSystem.subscribe('error', systemLogger);
eventSystem.subscribe('security', securityLogger);

// Phát sinh các sự kiện
eventSystem.emit('user:login', { userId: 123, username: 'john_doe' });
eventSystem.emit('error', { code: 500, message: 'Internal Server Error' });
eventSystem.emit('security', { type: 'unauthorized_access', ip: '192.168.1.1' });

// Hủy đăng ký một observer
eventSystem.unsubscribe('user:login', analytics);

// Phát sinh sự kiện sau khi hủy đăng ký
eventSystem.emit('user:login', { userId: 456, username: 'jane_doe' });
```

## 4. Ưu điểm và Nhược điểm

### 4.1 Ưu điểm
1. **Loose Coupling**: Subject và Observer không phụ thuộc chặt chẽ vào nhau
2. **Mở rộng dễ dàng**: Có thể thêm/xóa observers mà không ảnh hưởng đến subject
3. **Broadcast Communication**: Một subject có thể thông báo cho nhiều observers
4. **Tái sử dụng**: Có thể tái sử dụng subject hoặc observer độc lập

### 4.2 Nhược điểm
1. **Memory Leaks**: Nếu không hủy đăng ký observers có thể gây rò rỉ bộ nhớ
2. **Thứ tự không đảm bảo**: Không đảm bảo thứ tự thông báo cho các observers
3. **Phức tạp hóa**: Có thể làm code phức tạp nếu có nhiều observers và subjects
4. **Cập nhật ngoài ý muốn**: Observers có thể nhận được thông báo không mong muốn

## 5. Khi nào nên sử dụng Observer Pattern?

1. **Event Handling**: Xử lý sự kiện trong ứng dụng
2. **Real-time Updates**: Cập nhật dữ liệu thời gian thực
3. **State Management**: Quản lý và đồng bộ trạng thái
4. **UI Updates**: Cập nhật giao diện người dùng
5. **Logging và Analytics**: Ghi log và theo dõi hoạt động

## 6. Kết luận

Observer Pattern là một mẫu thiết kế mạnh mẽ cho phép xây dựng các hệ thống lỏng lẻo và dễ mở rộng. Pattern này đặc biệt hữu ích trong JavaScript/TypeScript khi làm việc với các ứng dụng hướng sự kiện, real-time updates, hoặc quản lý trạng thái. Tuy nhiên, cần chú ý quản lý bộ nhớ và độ phức tạp khi sử dụng pattern này.
