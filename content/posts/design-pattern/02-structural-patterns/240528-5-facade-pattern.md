---
title: "Structural Pattern [5
/7] - Facade Pattern trong JavaScript/TypeScript"
draft: false
date: 2024-05-28
description: "Facade Pattern là một mẫu thiết kế cấu trúc cung cấp một interface đơn giản cho một hệ thống phức tạp. Bài viết này phân tích cách triển khai Facade Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "facade-pattern-trong-javascript-typescript"
categories:
  - JavaScript
  - TypeScript
  - Design Patterns
tags:
  - JavaScript
  - TypeScript
  - Design Patterns
  - Facade
  - Structural Patterns
---

## 1. Facade Pattern là gì?

Facade Pattern là một mẫu thiết kế cấu trúc cung cấp một interface đơn giản cho một hệ thống phức tạp. Pattern này tạo ra một lớp facade đóng vai trò như một "mặt tiền" cho các hệ thống con, giúp client dễ dàng sử dụng hệ thống mà không cần biết về độ phức tạp bên trong.

Các thành phần chính trong Facade Pattern:
- **Facade**: Interface đơn giản che giấu độ phức tạp của hệ thống
- **Subsystems**: Các hệ thống con thực hiện các chức năng cụ thể
- **Client**: Sử dụng Facade để tương tác với hệ thống

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ cơ bản về Computer System

```javascript
// Subsystem components
class CPU {
  freeze() {
    console.log('CPU: Freezing processor...');
  }
  
  jump(position) {
    console.log(`CPU: Jumping to position ${position}...`);
  }
  
  execute() {
    console.log('CPU: Executing instructions...');
  }
}

class Memory {
  load(position, data) {
    console.log(`Memory: Loading data at position ${position}: ${data}`);
  }
}

class HardDrive {
  read(lba, size) {
    console.log(`HardDrive: Reading ${size} bytes from sector ${lba}`);
    return 'data';
  }
}

// Facade
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }
  
  start() {
    console.log('Computer: Starting...');
    this.cpu.freeze();
    this.memory.load(0, this.hardDrive.read(0, 1024));
    this.cpu.jump(0);
    this.cpu.execute();
    console.log('Computer: System is ready!');
  }
  
  shutdown() {
    console.log('Computer: Shutting down...');
    // Cleanup and shutdown procedures
    console.log('Computer: System is off!');
  }
}

// Usage
const computer = new ComputerFacade();
computer.start();
computer.shutdown();
```

### 2.2 Ví dụ về Video Conversion System

```javascript
// Subsystem components
class VideoFile {
  constructor(filename) {
    this.filename = filename;
    this.codecType = filename.substring(filename.indexOf('.') + 1);
  }
  
  getCodecType() {
    return this.codecType;
  }
}

class Codec {
  constructor(type) {
    this.type = type;
  }
}

class MPEG4CompressionCodec extends Codec {
  constructor() {
    super('mp4');
  }
}

class OggCompressionCodec extends Codec {
  constructor() {
    super('ogg');
  }
}

class CodecFactory {
  extract(file) {
    let type = file.getCodecType();
    if (type === 'mp4') {
      console.log('CodecFactory: Extracting mpeg audio...');
      return new MPEG4CompressionCodec();
    } else {
      console.log('CodecFactory: Extracting ogg audio...');
      return new OggCompressionCodec();
    }
  }
}

class BitrateReader {
  static read(filename, sourceCodec) {
    console.log(`BitrateReader: Reading file ${filename} with codec ${sourceCodec.type}...`);
    return 'buffer';
  }
  
  static convert(buffer, destinationCodec) {
    console.log(`BitrateReader: Converting buffer to codec ${destinationCodec.type}...`);
    return 'converted buffer';
  }
}

class AudioMixer {
  fix(result) {
    console.log('AudioMixer: Fixing audio...');
    return 'fixed audio';
  }
}

// Facade
class VideoConversionFacade {
  convertVideo(filename, format) {
    console.log('VideoConversionFacade: Starting video conversion...');
    
    const file = new VideoFile(filename);
    const sourceCodec = new CodecFactory().extract(file);
    let destinationCodec;
    
    if (format === 'mp4') {
      destinationCodec = new MPEG4CompressionCodec();
    } else {
      destinationCodec = new OggCompressionCodec();
    }
    
    const buffer = BitrateReader.read(filename, sourceCodec);
    let result = BitrateReader.convert(buffer, destinationCodec);
    result = new AudioMixer().fix(result);
    
    console.log('VideoConversionFacade: Conversion completed.');
    return result;
  }
}

// Usage
const converter = new VideoConversionFacade();
converter.convertVideo('video.ogg', 'mp4');
```

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ giúp triển khai Facade Pattern an toàn và rõ ràng hơn:

```typescript
// Payment processing system with TypeScript
interface PaymentDetails {
  amount: number;
  currency: string;
  cardNumber: string;
  cvv: string;
  expiryMonth: number;
  expiryYear: number;
}

interface ShippingDetails {
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

interface OrderDetails {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  customerId: string;
}

// Subsystem components
class PaymentProcessor {
  validateCard(details: PaymentDetails): boolean {
    console.log('Validating card details...');
    // Complex validation logic
    return true;
  }
  
  processPayment(details: PaymentDetails): string {
    console.log('Processing payment...');
    // Complex payment processing logic
    return 'payment_id_123';
  }
}

class InventoryManager {
  checkStock(items: Array<{ productId: string; quantity: number }>): boolean {
    console.log('Checking stock availability...');
    // Complex stock checking logic
    return true;
  }
  
  reserveItems(items: Array<{ productId: string; quantity: number }>): void {
    console.log('Reserving items...');
    // Complex item reservation logic
  }
  
  releaseItems(items: Array<{ productId: string; quantity: number }>): void {
    console.log('Releasing items...');
    // Complex item release logic
  }
}

class ShippingManager {
  calculateCost(details: ShippingDetails): number {
    console.log('Calculating shipping cost...');
    // Complex shipping cost calculation
    return 10.00;
  }
  
  scheduleDelivery(details: ShippingDetails): string {
    console.log('Scheduling delivery...');
    // Complex delivery scheduling logic
    return 'tracking_id_456';
  }
}

class NotificationService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
    // Complex email sending logic
  }
  
  sendSMS(to: string, message: string): void {
    console.log(`Sending SMS to ${to}: ${message}`);
    // Complex SMS sending logic
  }
}

class OrderManager {
  createOrder(details: OrderDetails): string {
    console.log('Creating order...');
    // Complex order creation logic
    return 'order_id_789';
  }
  
  updateOrder(orderId: string, status: string): void {
    console.log(`Updating order ${orderId} status to ${status}`);
    // Complex order update logic
  }
}

// Facade
class OrderProcessingFacade {
  private paymentProcessor: PaymentProcessor;
  private inventoryManager: InventoryManager;
  private shippingManager: ShippingManager;
  private notificationService: NotificationService;
  private orderManager: OrderManager;
  
  constructor() {
    this.paymentProcessor = new PaymentProcessor();
    this.inventoryManager = new InventoryManager();
    this.shippingManager = new ShippingManager();
    this.notificationService = new NotificationService();
    this.orderManager = new OrderManager();
  }
  
  async processOrder(
    orderDetails: OrderDetails,
    paymentDetails: PaymentDetails,
    shippingDetails: ShippingDetails
  ): Promise<{
    orderId: string;
    paymentId: string;
    trackingId: string;
  }> {
    try {
      // Check stock availability
      if (!this.inventoryManager.checkStock(orderDetails.items)) {
        throw new Error('Items out of stock');
      }
      
      // Reserve items
      this.inventoryManager.reserveItems(orderDetails.items);
      
      // Validate payment
      if (!this.paymentProcessor.validateCard(paymentDetails)) {
        this.inventoryManager.releaseItems(orderDetails.items);
        throw new Error('Invalid payment details');
      }
      
      // Create order
      const orderId = this.orderManager.createOrder(orderDetails);
      
      // Process payment
      const paymentId = this.paymentProcessor.processPayment(paymentDetails);
      
      // Calculate shipping
      const shippingCost = this.shippingManager.calculateCost(shippingDetails);
      
      // Schedule delivery
      const trackingId = this.shippingManager.scheduleDelivery(shippingDetails);
      
      // Update order status
      this.orderManager.updateOrder(orderId, 'CONFIRMED');
      
      // Send notifications
      this.notificationService.sendEmail(
        orderDetails.customerId,
        'Order Confirmation',
        `Your order ${orderId} has been confirmed`
      );
      
      this.notificationService.sendSMS(
        orderDetails.customerId,
        `Order ${orderId} confirmed. Tracking ID: ${trackingId}`
      );
      
      return {
        orderId,
        paymentId,
        trackingId
      };
    } catch (error) {
      // Handle errors and rollback if necessary
      console.error('Order processing failed:', error);
      throw error;
    }
  }
  
  async cancelOrder(orderId: string): Promise<void> {
    try {
      // Complex cancellation logic with multiple subsystem interactions
      this.orderManager.updateOrder(orderId, 'CANCELLED');
      // Release inventory, refund payment, cancel shipping, etc.
    } catch (error) {
      console.error('Order cancellation failed:', error);
      throw error;
    }
  }
}

// Usage
async function main() {
  const facade = new OrderProcessingFacade();
  
  const orderDetails: OrderDetails = {
    items: [
      { productId: 'PROD1', quantity: 2, price: 29.99 },
      { productId: 'PROD2', quantity: 1, price: 49.99 }
    ],
    totalAmount: 109.97,
    customerId: 'CUST123'
  };
  
  const paymentDetails: PaymentDetails = {
    amount: 109.97,
    currency: 'USD',
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryMonth: 12,
    expiryYear: 2024
  };
  
  const shippingDetails: ShippingDetails = {
    address: '123 Main St',
    city: 'New York',
    country: 'USA',
    zipCode: '10001'
  };
  
  try {
    const result = await facade.processOrder(
      orderDetails,
      paymentDetails,
      shippingDetails
    );
    
    console.log('Order processed successfully:', result);
    
    // Later, if needed
    await facade.cancelOrder(result.orderId);
  } catch (error) {
    console.error('Error processing order:', error);
  }
}

main();
```

## 4. Ví dụ thực tế: Smart Home System

Hãy xem xét một ví dụ thực tế về việc sử dụng Facade Pattern để điều khiển một hệ thống nhà thông minh:

```typescript
// Subsystem interfaces
interface Light {
  turnOn(): void;
  turnOff(): void;
  dim(level: number): void;
}

interface Thermostat {
  setTemperature(temperature: number): void;
  getTemperature(): number;
  setMode(mode: 'heat' | 'cool' | 'auto'): void;
}

interface SecuritySystem {
  arm(): void;
  disarm(): void;
  getStatus(): string;
}

interface Camera {
  startRecording(): void;
  stopRecording(): void;
  takePicture(): string;
}

interface MusicSystem {
  play(): void;
  pause(): void;
  setVolume(level: number): void;
  setPlaylist(playlist: string): void;
}

// Subsystem implementations
class SmartLight implements Light {
  private isOn: boolean = false;
  private dimLevel: number = 100;
  private location: string;
  
  constructor(location: string) {
    this.location = location;
  }
  
  turnOn(): void {
    this.isOn = true;
    console.log(`${this.location} light turned on`);
  }
  
  turnOff(): void {
    this.isOn = false;
    console.log(`${this.location} light turned off`);
  }
  
  dim(level: number): void {
    this.dimLevel = Math.max(0, Math.min(100, level));
    console.log(`${this.location} light dimmed to ${this.dimLevel}%`);
  }
}

class SmartThermostat implements Thermostat {
  private currentTemperature: number = 22;
  private currentMode: 'heat' | 'cool' | 'auto' = 'auto';
  
  setTemperature(temperature: number): void {
    this.currentTemperature = temperature;
    console.log(`Temperature set to ${temperature}°C`);
  }
  
  getTemperature(): number {
    return this.currentTemperature;
  }
  
  setMode(mode: 'heat' | 'cool' | 'auto'): void {
    this.currentMode = mode;
    console.log(`Thermostat mode set to ${mode}`);
  }
}

class HomeSecuritySystem implements SecuritySystem {
  private armed: boolean = false;
  
  arm(): void {
    this.armed = true;
    console.log('Security system armed');
  }
  
  disarm(): void {
    this.armed = false;
    console.log('Security system disarmed');
  }
  
  getStatus(): string {
    return this.armed ? 'ARMED' : 'DISARMED';
  }
}

class SecurityCamera implements Camera {
  private location: string;
  private recording: boolean = false;
  
  constructor(location: string) {
    this.location = location;
  }
  
  startRecording(): void {
    this.recording = true;
    console.log(`${this.location} camera started recording`);
  }
  
  stopRecording(): void {
    this.recording = false;
    console.log(`${this.location} camera stopped recording`);
  }
  
  takePicture(): string {
    console.log(`${this.location} camera took a picture`);
    return `picture_${Date.now()}.jpg`;
  }
}

class SmartMusicSystem implements MusicSystem {
  private playing: boolean = false;
  private volume: number = 50;
  private currentPlaylist: string = '';
  
  play(): void {
    this.playing = true;
    console.log('Music started playing');
  }
  
  pause(): void {
    this.playing = false;
    console.log('Music paused');
  }
  
  setVolume(level: number): void {
    this.volume = Math.max(0, Math.min(100, level));
    console.log(`Music volume set to ${this.volume}%`);
  }
  
  setPlaylist(playlist: string): void {
    this.currentPlaylist = playlist;
    console.log(`Playlist set to: ${playlist}`);
  }
}

// Facade
class SmartHomeFacade {
  private lights: Map<string, Light>;
  private thermostat: Thermostat;
  private security: SecuritySystem;
  private cameras: Map<string, Camera>;
  private musicSystem: MusicSystem;
  
  constructor() {
    // Initialize subsystems
    this.lights = new Map([
      ['Living Room', new SmartLight('Living Room')],
      ['Kitchen', new SmartLight('Kitchen')],
      ['Bedroom', new SmartLight('Bedroom')]
    ]);
    
    this.thermostat = new SmartThermostat();
    this.security = new HomeSecuritySystem();
    
    this.cameras = new Map([
      ['Front Door', new SecurityCamera('Front Door')],
      ['Back Door', new SecurityCamera('Back Door')],
      ['Garage', new SecurityCamera('Garage')]
    ]);
    
    this.musicSystem = new SmartMusicSystem();
  }
  
  leaveHome(): void {
    console.log('Executing "Leave Home" scene...');
    
    // Turn off all lights
    this.lights.forEach(light => light.turnOff());
    
    // Set energy-saving temperature
    this.thermostat.setTemperature(18);
    this.thermostat.setMode('auto');
    
    // Arm security system
    this.security.arm();
    
    // Start recording on all cameras
    this.cameras.forEach(camera => camera.startRecording());
    
    // Stop music
    this.musicSystem.pause();
  }
  
  arriveHome(): void {
    console.log('Executing "Arrive Home" scene...');
    
    // Disarm security system
    this.security.disarm();
    
    // Stop recording on cameras
    this.cameras.forEach(camera => camera.stopRecording());
    
    // Turn on main lights
    this.lights.get('Living Room')?.turnOn();
    this.lights.get('Kitchen')?.turnOn();
    
    // Set comfortable temperature
    this.thermostat.setTemperature(22);
    
    // Play welcome music
    this.musicSystem.setPlaylist('Welcome Home');
    this.musicSystem.setVolume(30);
    this.musicSystem.play();
  }
  
  movieMode(): void {
    console.log('Executing "Movie Mode" scene...');
    
    // Dim living room lights
    this.lights.get('Living Room')?.dim(20);
    
    // Turn off other lights
    this.lights.get('Kitchen')?.turnOff();
    this.lights.get('Bedroom')?.turnOff();
    
    // Set comfortable temperature
    this.thermostat.setTemperature(21);
    
    // Pause music
    this.musicSystem.pause();
  }
  
  sleepMode(): void {
    console.log('Executing "Sleep Mode" scene...');
    
    // Turn off all lights except bedroom
    this.lights.forEach((light, location) => {
      if (location === 'Bedroom') {
        light.dim(10);
      } else {
        light.turnOff();
      }
    });
    
    // Set night temperature
    this.thermostat.setTemperature(20);
    
    // Arm security system
    this.security.arm();
    
    // Start recording on outdoor cameras
    this.cameras.get('Front Door')?.startRecording();
    this.cameras.get('Back Door')?.startRecording();
    
    // Play sleep playlist at low volume
    this.musicSystem.setPlaylist('Sleep');
    this.musicSystem.setVolume(10);
    this.musicSystem.play();
  }
  
  getStatus(): Record<string, any> {
    return {
      security: this.security.getStatus(),
      temperature: this.thermostat.getTemperature(),
      lights: Array.from(this.lights.entries()).reduce((acc, [location, _]) => ({
        ...acc,
        [location]: 'OK'
      }), {}),
      cameras: Array.from(this.cameras.entries()).reduce((acc, [location, _]) => ({
        ...acc,
        [location]: 'OK'
      }), {})
    };
  }
}

// Usage
function main() {
  const smartHome = new SmartHomeFacade();
  
  // Simulate daily routine
  console.log('Morning: Waking up...');
  smartHome.arriveHome();
  
  console.log('\nEvening: Movie time...');
  smartHome.movieMode();
  
  console.log('\nNight: Going to bed...');
  smartHome.sleepMode();
  
  console.log('\nNext day: Leaving for work...');
  smartHome.leaveHome();
  
  // Check system status
  console.log('\nSystem Status:', smartHome.getStatus());
}

main();
```

## 5. Khi nào nên sử dụng Facade Pattern

Facade Pattern phù hợp trong các tình huống sau:

1. **Khi cần cung cấp interface đơn giản cho hệ thống phức tạp**
2. **Khi có nhiều hệ thống con phụ thuộc lẫn nhau**
3. **Khi muốn tạo lớp entry point cho các thư viện hoặc frameworks**
4. **Khi cần tổ chức hệ thống thành các layer**
5. **Khi muốn giảm sự phụ thuộc giữa client và hệ thống con**

Ví dụ thực tế:
- Hệ thống xử lý đơn hàng
- Hệ thống nhà thông minh
- Thư viện xử lý media
- SDK và API wrappers
- Hệ thống thanh toán

## 6. So sánh với các Pattern khác

### So sánh với Adapter Pattern

| Facade Pattern | Adapter Pattern |
|---------------|----------------|
| Đơn giản hóa interface | Tương thích interface |
| Làm việc với nhiều class | Làm việc với một class |
| Tạo interface mới | Tái sử dụng interface |
| High-level interface | Same-level interface |

### So sánh với Mediator Pattern

| Facade Pattern | Mediator Pattern |
|---------------|-----------------|
| Một chiều | Hai chiều |
| Stateless | Stateful |
| Simple communication | Complex communication |
| Subsystems don't know facade | Components know mediator |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Đơn giản hóa** interface cho client
- **Giảm sự phụ thuộc** giữa client và hệ thống con
- **Tăng tính module hóa**
- **Dễ dàng mở rộng** và bảo trì
- **Tuân thủ Single Responsibility Principle**

### Nhược điểm:
- **Có thể trở thành God Object**
- **Khó xử lý các trường hợp đặc biệt**
- **Có thể che giấu quá nhiều chi tiết**
- **Khó tùy chỉnh** cho từng trường hợp cụ thể
- **Có thể tạo ra bottleneck**

## 8. Kết luận

Facade Pattern là một công cụ mạnh mẽ để đơn giản hóa interface của các hệ thống phức tạp. Pattern này đặc biệt hữu ích khi bạn cần tạo một điểm truy cập duy nhất cho nhiều hệ thống con hoặc khi muốn tổ chức code thành các layer rõ ràng.

Khi quyết định sử dụng Facade Pattern, hãy cân nhắc mức độ trừu tượng hóa phù hợp và đảm bảo rằng facade không trở thành một God Object. Pattern này có thể làm tăng tính linh hoạt và khả năng bảo trì của hệ thống, nhưng cũng cần cẩn thận để không che giấu quá nhiều chi tiết quan trọng.