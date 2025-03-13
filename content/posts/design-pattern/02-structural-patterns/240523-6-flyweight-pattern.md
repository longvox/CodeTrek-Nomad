---
title: "Structural Pattern [6/7] - Flyweight Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-05-23
description: "Flyweight Pattern là một mẫu thiết kế cấu trúc giúp tối ưu hóa việc sử dụng bộ nhớ bằng cách chia sẻ các trạng thái chung giữa nhiều đối tượng. Bài viết này phân tích cách triển khai Flyweight Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "flyweight-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Flyweight
  - Structural Patterns
---

## 1. Flyweight Pattern là gì?

Flyweight Pattern là một mẫu thiết kế cấu trúc cho phép bạn tối ưu hóa việc sử dụng bộ nhớ bằng cách chia sẻ các trạng thái chung giữa nhiều đối tượng thay vì lưu trữ chúng trong từng đối tượng. Pattern này đặc biệt hữu ích khi ứng dụng cần tạo ra một số lượng lớn các đối tượng tương tự nhau.

Các thành phần chính trong Flyweight Pattern:
- **Flyweight**: Interface hoặc abstract class định nghĩa các phương thức cho các trạng thái được chia sẻ
- **ConcreteFlyweight**: Triển khai interface Flyweight và lưu trữ trạng thái nội tại (intrinsic state)
- **FlyweightFactory**: Tạo và quản lý các đối tượng Flyweight
- **Client**: Sử dụng các đối tượng Flyweight và truyền trạng thái ngoại tại (extrinsic state)

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ cơ bản về Text Editor

```javascript
// Flyweight
class Character {
  constructor(char, style) {
    this.char = char;
    this.style = style;
  }
  
  render(position) {
    console.log(`Character ${this.char} at position ${position} with style ${JSON.stringify(this.style)}`);
  }
}

// Flyweight Factory
class CharacterFactory {
  constructor() {
    this.characters = new Map();
  }
  
  getCharacter(char, style) {
    const key = this.getKey(char, style);
    
    if (!this.characters.has(key)) {
      this.characters.set(key, new Character(char, style));
    }
    
    return this.characters.get(key);
  }
  
  getKey(char, style) {
    return `${char}_${JSON.stringify(style)}`;
  }
  
  getCount() {
    return this.characters.size;
  }
}

// Text Editor using Flyweight Pattern
class TextEditor {
  constructor() {
    this.factory = new CharacterFactory();
    this.characters = [];
  }
  
  write(text, style) {
    const chars = text.split('');
    chars.forEach(char => {
      const flyweight = this.factory.getCharacter(char, style);
      this.characters.push({
        flyweight,
        position: this.characters.length
      });
    });
  }
  
  render() {
    this.characters.forEach(char => {
      char.flyweight.render(char.position);
    });
  }
}

// Usage
const editor = new TextEditor();

// Write text with different styles
editor.write('Hello', { font: 'Arial', size: 12, color: 'black' });
editor.write(' World!', { font: 'Arial', size: 14, color: 'red' });
editor.write('\nHello', { font: 'Times', size: 12, color: 'blue' });
editor.write(' Again!', { font: 'Times', size: 14, color: 'green' });

// Render text
editor.render();

// Check number of character objects created
console.log(`Total unique character objects: ${editor.factory.getCount()}`);
```

### 2.2 Ví dụ về Game Objects

```javascript
// Flyweight
class TreeType {
  constructor(name, color, texture) {
    this.name = name;
    this.color = color;
    this.texture = texture;
  }
  
  render(x, y) {
    console.log(`Rendering ${this.name} tree at (${x}, ${y})`);
    console.log(`Color: ${this.color}, Texture: ${this.texture}`);
  }
}

// Flyweight Factory
class TreeFactory {
  constructor() {
    this.treeTypes = new Map();
  }
  
  getTreeType(name, color, texture) {
    const key = `${name}_${color}_${texture}`;
    
    if (!this.treeTypes.has(key)) {
      this.treeTypes.set(key, new TreeType(name, color, texture));
    }
    
    return this.treeTypes.get(key);
  }
  
  getCount() {
    return this.treeTypes.size;
  }
}

// Tree object using flyweight
class Tree {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  
  render() {
    this.type.render(this.x, this.y);
  }
}

// Forest manages multiple trees
class Forest {
  constructor() {
    this.trees = [];
    this.factory = new TreeFactory();
  }
  
  plantTree(x, y, name, color, texture) {
    const type = this.factory.getTreeType(name, color, texture);
    const tree = new Tree(x, y, type);
    this.trees.push(tree);
  }
  
  render() {
    this.trees.forEach(tree => tree.render());
  }
}

// Usage
const forest = new Forest();

// Plant many trees
for (let i = 0; i < 10; i++) {
  forest.plantTree(
    Math.random() * 100,
    Math.random() * 100,
    'Oak',
    'Green',
    'Oak Bark'
  );
  
  forest.plantTree(
    Math.random() * 100,
    Math.random() * 100,
    'Pine',
    'Dark Green',
    'Pine Bark'
  );
  
  forest.plantTree(
    Math.random() * 100,
    Math.random() * 100,
    'Birch',
    'White',
    'Birch Bark'
  );
}

// Render forest
forest.render();

// Check memory usage
console.log(`Total tree types: ${forest.factory.getCount()}`);
console.log(`Total trees: ${forest.trees.length}`);
```

## 3. Triển khai trong TypeScript

TypeScript với hệ thống kiểu mạnh mẽ giúp triển khai Flyweight Pattern an toàn và rõ ràng hơn:

```typescript
// Particle System Example
interface ParticleProperties {
  texture: string;
  spriteSize: number;
  color: string;
}

// Flyweight
class ParticleType {
  constructor(private props: ParticleProperties) {}
  
  render(x: number, y: number, scale: number, rotation: number): void {
    console.log(
      `Rendering particle at (${x}, ${y}) with:`,
      `\n- Scale: ${scale}`,
      `\n- Rotation: ${rotation}`,
      `\n- Texture: ${this.props.texture}`,
      `\n- Sprite Size: ${this.props.spriteSize}`,
      `\n- Color: ${this.props.color}`
    );
  }
}

// Flyweight Factory
class ParticleFactory {
  private types: Map<string, ParticleType> = new Map();
  
  getParticleType(props: ParticleProperties): ParticleType {
    const key = this.getKey(props);
    
    if (!this.types.has(key)) {
      this.types.set(key, new ParticleType(props));
    }
    
    return this.types.get(key)!;
  }
  
  private getKey(props: ParticleProperties): string {
    return `${props.texture}_${props.spriteSize}_${props.color}`;
  }
  
  getTypesCount(): number {
    return this.types.size;
  }
}

// Individual particle instance
class Particle {
  private velocity: { x: number; y: number };
  private rotation: number;
  private scale: number;
  
  constructor(
    private x: number,
    private y: number,
    private type: ParticleType
  ) {
    this.velocity = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1
    };
    this.rotation = Math.random() * 360;
    this.scale = Math.random() * 0.5 + 0.5;
  }
  
  update(deltaTime: number): void {
    this.x += this.velocity.x * deltaTime;
    this.y += this.velocity.y * deltaTime;
    this.rotation += deltaTime * 45; // 45 degrees per second
  }
  
  render(): void {
    this.type.render(this.x, this.y, this.scale, this.rotation);
  }
}

// Particle System
class ParticleSystem {
  private particles: Particle[] = [];
  private factory: ParticleFactory;
  
  constructor() {
    this.factory = new ParticleFactory();
  }
  
  createParticle(x: number, y: number, props: ParticleProperties): void {
    const type = this.factory.getParticleType(props);
    const particle = new Particle(x, y, type);
    this.particles.push(particle);
  }
  
  update(deltaTime: number): void {
    this.particles.forEach(particle => particle.update(deltaTime));
  }
  
  render(): void {
    this.particles.forEach(particle => particle.render());
  }
  
  getStats(): { particles: number; types: number } {
    return {
      particles: this.particles.length,
      types: this.factory.getTypesCount()
    };
  }
}

// Usage
const particleSystem = new ParticleSystem();

// Create different types of particles
const particleTypes = [
  {
    texture: 'smoke',
    spriteSize: 32,
    color: 'gray'
  },
  {
    texture: 'fire',
    spriteSize: 16,
    color: 'orange'
  },
  {
    texture: 'spark',
    spriteSize: 8,
    color: 'yellow'
  }
];

// Create many particles
for (let i = 0; i < 1000; i++) {
  const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
  particleSystem.createParticle(
    Math.random() * 800, // x
    Math.random() * 600, // y
    type
  );
}

// Simulate particle system
const deltaTime = 1/60; // 60 FPS
particleSystem.update(deltaTime);
particleSystem.render();

// Check memory usage
console.log('Particle System Stats:', particleSystem.getStats());
```

## 4. Ví dụ thực tế: UI Component Library

Hãy xem xét một ví dụ thực tế về việc sử dụng Flyweight Pattern trong thư viện UI Component:

```typescript
// Style definitions
interface ThemeStyles {
  primary: string;
  secondary: string;
  fontSize: number;
  fontFamily: string;
  borderRadius: number;
  padding: number;
}

interface ComponentStyles {
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  borderRadius: number;
  padding: number;
}

// Flyweight
class ComponentStyle {
  constructor(private styles: ComponentStyles) {}
  
  apply(element: HTMLElement): void {
    Object.assign(element.style, {
      backgroundColor: this.styles.backgroundColor,
      color: this.styles.textColor,
      fontSize: `${this.styles.fontSize}px`,
      fontFamily: this.styles.fontFamily,
      borderRadius: `${this.styles.borderRadius}px`,
      padding: `${this.styles.padding}px`
    });
  }
}

// Flyweight Factory
class StyleFactory {
  private styles: Map<string, ComponentStyle> = new Map();
  
  getStyle(theme: ThemeStyles, variant: 'primary' | 'secondary'): ComponentStyle {
    const key = `${variant}_${JSON.stringify(theme)}`;
    
    if (!this.styles.has(key)) {
      const styles: ComponentStyles = {
        backgroundColor: theme[variant],
        textColor: variant === 'primary' ? '#ffffff' : '#000000',
        fontSize: theme.fontSize,
        fontFamily: theme.fontFamily,
        borderRadius: theme.borderRadius,
        padding: theme.padding
      };
      
      this.styles.set(key, new ComponentStyle(styles));
    }
    
    return this.styles.get(key)!;
  }
  
  getStylesCount(): number {
    return this.styles.size;
  }
}

// UI Components
class Button {
  private element: HTMLButtonElement;
  
  constructor(
    text: string,
    private style: ComponentStyle,
    onClick: () => void
  ) {
    this.element = document.createElement('button');
    this.element.textContent = text;
    this.element.addEventListener('click', onClick);
    this.style.apply(this.element);
  }
  
  render(): HTMLButtonElement {
    return this.element;
  }
}

class Card {
  private element: HTMLDivElement;
  
  constructor(
    title: string,
    content: string,
    private style: ComponentStyle
  ) {
    this.element = document.createElement('div');
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    
    const contentElement = document.createElement('p');
    contentElement.textContent = content;
    
    this.element.appendChild(titleElement);
    this.element.appendChild(contentElement);
    
    this.style.apply(this.element);
  }
  
  render(): HTMLDivElement {
    return this.element;
  }
}

// UI Component Factory
class ComponentFactory {
  private styleFactory: StyleFactory;
  
  constructor(private theme: ThemeStyles) {
    this.styleFactory = new StyleFactory();
  }
  
  createButton(
    text: string,
    variant: 'primary' | 'secondary',
    onClick: () => void
  ): Button {
    const style = this.styleFactory.getStyle(this.theme, variant);
    return new Button(text, style, onClick);
  }
  
  createCard(
    title: string,
    content: string,
    variant: 'primary' | 'secondary'
  ): Card {
    const style = this.styleFactory.getStyle(this.theme, variant);
    return new Card(title, content, style);
  }
  
  getStylesCount(): number {
    return this.styleFactory.getStylesCount();
  }
}

// Usage
const theme: ThemeStyles = {
  primary: '#007bff',
  secondary: '#6c757d',
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  borderRadius: 4,
  padding: 8
};

const factory = new ComponentFactory(theme);

// Create multiple components with shared styles
const buttons: Button[] = [];
const cards: Card[] = [];

for (let i = 0; i < 100; i++) {
  buttons.push(
    factory.createButton(
      `Button ${i}`,
      i % 2 === 0 ? 'primary' : 'secondary',
      () => console.log(`Button ${i} clicked`)
    )
  );
  
  cards.push(
    factory.createCard(
      `Card ${i}`,
      `This is card number ${i}`,
      i % 2 === 0 ? 'primary' : 'secondary'
    )
  );
}

// Check memory usage
console.log('Total components:', buttons.length + cards.length);
console.log('Unique styles:', factory.getStylesCount());

// Render components (if in browser environment)
const container = document.getElementById('app');
if (container) {
  buttons.forEach(button => container.appendChild(button.render()));
  cards.forEach(card => container.appendChild(card.render()));
}
```

## 5. Khi nào nên sử dụng Flyweight Pattern

Flyweight Pattern phù hợp trong các tình huống sau:

1. **Khi ứng dụng cần tạo nhiều đối tượng tương tự**
2. **Khi bộ nhớ là một vấn đề quan trọng**
3. **Khi các đối tượng có nhiều trạng thái chung**
4. **Khi có thể tách biệt trạng thái nội tại và ngoại tại**
5. **Khi cần tối ưu hiệu suất của ứng dụng**

Ví dụ thực tế:
- Text editors
- Game objects
- UI components
- Particle systems
- Character rendering

## 6. So sánh với các Pattern khác

### So sánh với Singleton Pattern

| Flyweight Pattern | Singleton Pattern |
|------------------|------------------|
| Chia sẻ trạng thái | Chia sẻ instance |
| Nhiều instance | Một instance |
| Tối ưu bộ nhớ | Kiểm soát truy cập |
| Stateless | Stateful |

### So sánh với Object Pool Pattern

| Flyweight Pattern | Object Pool Pattern |
|------------------|-------------------|
| Chia sẻ trạng thái | Tái sử dụng đối tượng |
| Immutable | Mutable |
| Không giới hạn | Giới hạn số lượng |
| Memory focused | Performance focused |

## 7. Ưu điểm và nhược điểm

### Ưu điểm:
- **Tiết kiệm bộ nhớ** đáng kể
- **Cải thiện hiệu suất** cache
- **Giảm số lượng đối tượng**
- **Tách biệt trạng thái**
- **Dễ dàng mở rộng**

### Nhược điểm:
- **Phức tạp hóa code**
- **Khó debug**
- **Khó thay đổi trạng thái nội tại**
- **Có thể ảnh hưởng hiệu suất** nếu sử dụng không đúng
- **Khó xác định trạng thái** nội tại và ngoại tại

## 8. Kết luận

Flyweight Pattern là một công cụ mạnh mẽ để tối ưu hóa việc sử dụng bộ nhớ trong các ứng dụng có nhiều đối tượng tương tự nhau. Pattern này đặc biệt hữu ích trong các tình huống như text editor, game engine, hoặc UI component library, nơi có nhiều đối tượng chia sẻ các thuộc tính chung.

Khi quyết định sử dụng Flyweight Pattern, hãy cân nhắc kỹ giữa lợi ích về bộ nhớ và độ phức tạp của code. Pattern này có thể giúp tiết kiệm đáng kể bộ nhớ, nhưng cũng có thể làm cho code khó hiểu và maintain hơn.