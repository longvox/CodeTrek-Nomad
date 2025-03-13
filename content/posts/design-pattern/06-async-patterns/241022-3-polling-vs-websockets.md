---
title: "Async Pattern [3/3] - Polling vs WebSockets trong JavaScript / TypeScript"
draft: false
date: 2024-10-22
description: "So sánh và phân tích hai cách tiếp cận real-time communication: Polling và WebSockets. Tìm hiểu cách triển khai, ưu nhược điểm và khi nào nên sử dụng mỗi phương pháp trong JavaScript và TypeScript."
slug: "polling-vs-websockets-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Real-time Communication
  - WebSockets
  - Polling
---

## 1. Polling là gì?

Polling là kỹ thuật client định kỳ gửi request đến server để kiểm tra dữ liệu mới. Có hai loại polling chính:

### 1.1 Short Polling

```javascript
async function shortPolling() {
  while (true) {
    try {
      const response = await fetch('/api/updates');
      const data = await response.json();
      processData(data);
    } catch (error) {
      console.error('Polling error:', error);
    }
    
    // Đợi 5 giây trước khi gửi request tiếp theo
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

function processData(data) {
  console.log('New data:', data);
}
```

### 1.2 Long Polling

```typescript
interface UpdateResponse {
  data: any;
  timestamp: number;
}

class LongPollingClient {
  private lastTimestamp: number = 0;
  private endpoint: string;
  private timeout: number;

  constructor(endpoint: string, timeout: number = 30000) {
    this.endpoint = endpoint;
    this.timeout = timeout;
  }

  async startPolling() {
    while (true) {
      try {
        const response = await fetch(
          `${this.endpoint}?lastTimestamp=${this.lastTimestamp}`,
          { 
            signal: AbortSignal.timeout(this.timeout)
          }
        );
        
        if (response.ok) {
          const data: UpdateResponse = await response.json();
          this.lastTimestamp = data.timestamp;
          this.handleUpdate(data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'TimeoutError') {
          continue; // Restart polling on timeout
        }
        console.error('Long polling error:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  private handleUpdate(data: UpdateResponse) {
    console.log('Received update:', data);
  }
}

// Usage
const client = new LongPollingClient('/api/updates');
client.startPolling();
```

## 2. WebSockets là gì?

WebSocket là giao thức cho phép giao tiếp hai chiều giữa client và server qua một kết nối duy nhất.

### 2.1 Basic WebSocket Implementation

```typescript
class WebSocketClient {
  private ws: WebSocket;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.ws.onclose = () => {
      console.log('Connection closed');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private handleMessage(data: string) {
    try {
      const parsedData = JSON.parse(data);
      console.log('Received:', parsedData);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  public send(data: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('Connection not open');
    }
  }

  public close() {
    this.ws.close();
  }
}
```

### 2.2 Type-safe WebSocket với TypeScript

```typescript
interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
}

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: number;
}

class TypedWebSocketClient {
  private ws: WebSocket;
  private messageHandlers: Map<string, (payload: any) => void>;

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.messageHandlers = new Map();
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        const handler = this.messageHandlers.get(message.type);
        
        if (handler) {
          handler(message.payload);
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };
  }

  public on<T>(type: string, handler: (payload: T) => void) {
    this.messageHandlers.set(type, handler);
  }

  public send<T>(type: string, payload: T) {
    const message: WebSocketMessage<T> = { type, payload };
    this.ws.send(JSON.stringify(message));
  }
}

// Usage
const chat = new TypedWebSocketClient('ws://chat.server');

chat.on<ChatMessage>('message', (message) => {
  console.log(`${message.user}: ${message.content}`);
});

chat.send('message', {
  id: crypto.randomUUID(),
  user: 'John',
  content: 'Hello!',
  timestamp: Date.now()
});
```

## 3. Ví dụ Thực Tế: Real-time Chat Application

### 3.1 Polling Version

```typescript
interface ChatState {
  messages: ChatMessage[];
  users: string[];
  lastUpdate: number;
}

class PollingChatClient {
  private state: ChatState = {
    messages: [],
    users: [],
    lastUpdate: 0
  };

  constructor(private apiUrl: string) {}

  async start() {
    this.pollMessages();
    this.pollUsers();
  }

  private async pollMessages() {
    while (true) {
      try {
        const response = await fetch(
          `${this.apiUrl}/messages?since=${this.state.lastUpdate}`
        );
        const data = await response.json();
        
        if (data.messages.length > 0) {
          this.state.messages.push(...data.messages);
          this.state.lastUpdate = data.timestamp;
          this.renderMessages();
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private async pollUsers() {
    while (true) {
      try {
        const response = await fetch(`${this.apiUrl}/users`);
        const users = await response.json();
        
        if (JSON.stringify(users) !== JSON.stringify(this.state.users)) {
          this.state.users = users;
          this.renderUsers();
        }
      } catch (error) {
        console.error('Error polling users:', error);
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  private renderMessages() {
    // Update UI with new messages
  }

  private renderUsers() {
    // Update UI with user list
  }
}
```

### 3.2 WebSocket Version

```typescript
interface ChatEvent {
  type: 'message' | 'user_joined' | 'user_left';
  payload: any;
}

class WebSocketChatClient {
  private ws: WebSocket;
  private state: ChatState = {
    messages: [],
    users: [],
    lastUpdate: 0
  };

  constructor(private wsUrl: string) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.wsUrl);

    this.ws.onmessage = (event) => {
      const chatEvent: ChatEvent = JSON.parse(event.data);
      
      switch (chatEvent.type) {
        case 'message':
          this.handleNewMessage(chatEvent.payload);
          break;
        case 'user_joined':
          this.handleUserJoined(chatEvent.payload);
          break;
        case 'user_left':
          this.handleUserLeft(chatEvent.payload);
          break;
      }
    };

    this.ws.onclose = () => {
      console.log('Connection lost, reconnecting...');
      setTimeout(() => this.connect(), 1000);
    };
  }

  private handleNewMessage(message: ChatMessage) {
    this.state.messages.push(message);
    this.state.lastUpdate = Date.now();
    this.renderMessages();
  }

  private handleUserJoined(user: string) {
    if (!this.state.users.includes(user)) {
      this.state.users.push(user);
      this.renderUsers();
    }
  }

  private handleUserLeft(user: string) {
    const index = this.state.users.indexOf(user);
    if (index !== -1) {
      this.state.users.splice(index, 1);
      this.renderUsers();
    }
  }

  public sendMessage(content: string) {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      user: 'current_user',
      content,
      timestamp: Date.now()
    };

    this.ws.send(JSON.stringify({
      type: 'message',
      payload: message
    }));
  }

  private renderMessages() {
    // Update UI with new messages
  }

  private renderUsers() {
    // Update UI with user list
  }
}
```

## 4. So sánh Polling và WebSockets

### 4.1 Polling

#### Ưu điểm:
- Dễ triển khai
- Hoạt động với mọi browser
- Không cần thay đổi server infrastructure
- Phù hợp với dữ liệu cập nhật không thường xuyên

#### Nhược điểm:
- Tốn bandwidth
- Độ trễ cao
- Server load lớn
- Không real-time thực sự

### 4.2 WebSockets

#### Ưu điểm:
- Real-time thực sự
- Hiệu quả về bandwidth
- Độ trễ thấp
- Giao tiếp hai chiều

#### Nhược điểm:
- Phức tạp hơn để triển khai
- Cần server hỗ trợ WebSocket
- Có thể gặp vấn đề với firewalls
- Cần xử lý reconnection

## 5. Khi nào nên sử dụng?

### 5.1 Sử dụng Polling khi:
- Dữ liệu cập nhật không thường xuyên
- Không yêu cầu real-time tuyệt đối
- Server infrastructure đơn giản
- Cần hỗ trợ nhiều loại client

### 5.2 Sử dụng WebSockets khi:
- Cần real-time thực sự
- Dữ liệu cập nhật thường xuyên
- Cần giao tiếp hai chiều
- Bandwidth là vấn đề quan trọng

## 6. Kết luận

Polling và WebSockets đều có vai trò riêng trong real-time communication. Việc lựa chọn phụ thuộc vào yêu cầu cụ thể của ứng dụng, infrastructure hiện có và trade-offs có thể chấp nhận được.
