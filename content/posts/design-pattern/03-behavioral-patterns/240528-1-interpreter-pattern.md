---
title: "Behavioral Pattern [1/11] - Interpreter Pattern trong JavaScript / TypeScript"
draft: false
date: 2024-05-28
description: "Interpreter Pattern là một mẫu thiết kế hành vi cho phép định nghĩa ngữ pháp cho một ngôn ngữ và cung cấp một bộ thông dịch để xử lý các biểu thức trong ngôn ngữ đó. Bài viết này phân tích cách triển khai Interpreter Pattern trong JavaScript và TypeScript, cùng với các trường hợp sử dụng thực tế."
slug: "interpreter-pattern-trong-javascript-typescript"
categories:
  - JS/TS
  - Design Patterns
tags:
  - JS/TS
  - Design Patterns
  - Interpreter
  - Behavioral Patterns
---

## 1. Interpreter Pattern là gì?

Interpreter Pattern là một mẫu thiết kế hành vi cho phép bạn định nghĩa ngữ pháp cho một ngôn ngữ đơn giản và cung cấp một bộ thông dịch để diễn giải các câu trong ngôn ngữ đó. Pattern này thường được sử dụng để xử lý các biểu thức hoặc câu lệnh theo một ngữ pháp xác định.

Các thành phần chính trong Interpreter Pattern:
- **AbstractExpression**: Interface hoặc abstract class định nghĩa phương thức interpret()
- **TerminalExpression**: Triển khai interpret() cho các phần tử cơ bản của ngữ pháp
- **NonTerminalExpression**: Triển khai interpret() cho các phần tử phức tạp của ngữ pháp
- **Context**: Chứa thông tin toàn cục cần thiết cho việc thông dịch
- **Client**: Xây dựng cây cú pháp từ các expression và gọi interpret()

## 2. Triển khai trong JavaScript

### 2.1 Ví dụ về Calculator

```javascript
// Abstract Expression
class Expression {
  interpret() {
    throw new Error('interpret() must be implemented');
  }
}

// Terminal Expression
class NumberExpression extends Expression {
  constructor(number) {
    super();
    this.number = number;
  }

  interpret() {
    return this.number;
  }
}

// Non-terminal Expression
class AddExpression extends Expression {
  constructor(leftExpression, rightExpression) {
    super();
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  interpret() {
    return this.leftExpression.interpret() + this.rightExpression.interpret();
  }
}

class SubtractExpression extends Expression {
  constructor(leftExpression, rightExpression) {
    super();
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  interpret() {
    return this.leftExpression.interpret() - this.rightExpression.interpret();
  }
}

class MultiplyExpression extends Expression {
  constructor(leftExpression, rightExpression) {
    super();
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  interpret() {
    return this.leftExpression.interpret() * this.rightExpression.interpret();
  }
}

// Parser
class Parser {
  parse(tokens) {
    const stack = [];
    
    for (const token of tokens) {
      if (!isNaN(token)) {
        stack.push(new NumberExpression(Number(token)));
      } else {
        const right = stack.pop();
        const left = stack.pop();
        
        switch (token) {
          case '+':
            stack.push(new AddExpression(left, right));
            break;
          case '-':
            stack.push(new SubtractExpression(left, right));
            break;
          case '*':
            stack.push(new MultiplyExpression(left, right));
            break;
          default:
            throw new Error(`Unknown operator: ${token}`);
        }
      }
    }
    
    return stack[0];
  }
}

// Usage
const parser = new Parser();

// Evaluate "3 4 +" (3 + 4)
const expression1 = parser.parse(['3', '4', '+']);
console.log(expression1.interpret()); // 7

// Evaluate "5 3 2 * +" (5 + (3 * 2))
const expression2 = parser.parse(['5', '3', '2', '*', '+']);
console.log(expression2.interpret()); // 11

// Evaluate "10 5 2 * -" (10 - (5 * 2))
const expression3 = parser.parse(['10', '5', '2', '*', '-']);
console.log(expression3.interpret()); // 0
```

### 2.2 Ví dụ về SQL Query Builder

```javascript
// Abstract Expression
class SQLExpression {
  interpret() {
    throw new Error('interpret() must be implemented');
  }
}

// Terminal Expressions
class TableExpression extends SQLExpression {
  constructor(tableName) {
    super();
    this.tableName = tableName;
  }

  interpret() {
    return `FROM ${this.tableName}`;
  }
}

class ColumnExpression extends SQLExpression {
  constructor(columns) {
    super();
    this.columns = columns;
  }

  interpret() {
    return `SELECT ${this.columns.join(', ')}`;
  }
}

class WhereExpression extends SQLExpression {
  constructor(condition) {
    super();
    this.condition = condition;
  }

  interpret() {
    return `WHERE ${this.condition}`;
  }
}

// Non-terminal Expression
class QueryExpression extends SQLExpression {
  constructor() {
    super();
    this.parts = [];
  }

  add(expression) {
    this.parts.push(expression);
    return this;
  }

  interpret() {
    return this.parts.map(part => part.interpret()).join(' ');
  }
}

// Context
class QueryBuilder {
  select(...columns) {
    this.query = new QueryExpression();
    this.query.add(new ColumnExpression(columns));
    return this;
  }

  from(tableName) {
    this.query.add(new TableExpression(tableName));
    return this;
  }

  where(condition) {
    this.query.add(new WhereExpression(condition));
    return this;
  }

  build() {
    return this.query.interpret();
  }
}

// Usage
const builder = new QueryBuilder();

const query1 = builder
  .select('name', 'age')
  .from('users')
  .where('age > 18')
  .build();

console.log(query1);
// SELECT name, age FROM users WHERE age > 18

const query2 = new QueryBuilder()
  .select('title', 'content', 'author')
  .from('posts')
  .where('published = true')
  .build();

console.log(query2);
// SELECT title, content, author FROM posts WHERE published = true
```

## 3. Triển khai trong TypeScript

### 3.1 Ví dụ về DSL cho Validation Rules

```typescript
// Abstract Expression
interface Expression {
  interpret(context: ValidationContext): boolean;
}

// Context
interface ValidationContext {
  value: any;
  [key: string]: any;
}

// Terminal Expressions
class RequiredExpression implements Expression {
  interpret(context: ValidationContext): boolean {
    return context.value !== undefined && context.value !== null && context.value !== '';
  }
}

class MinLengthExpression implements Expression {
  constructor(private length: number) {}

  interpret(context: ValidationContext): boolean {
    return context.value?.length >= this.length;
  }
}

class MaxLengthExpression implements Expression {
  constructor(private length: number) {}

  interpret(context: ValidationContext): boolean {
    return context.value?.length <= this.length;
  }
}

class EmailExpression implements Expression {
  interpret(context: ValidationContext): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(context.value);
  }
}

// Non-terminal Expression
class AndExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  interpret(context: ValidationContext): boolean {
    return this.left.interpret(context) && this.right.interpret(context);
  }
}

class OrExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  interpret(context: ValidationContext): boolean {
    return this.left.interpret(context) || this.right.interpret(context);
  }
}

// Validator Builder
class ValidationBuilder {
  private expressions: Expression[] = [];

  required(): this {
    this.expressions.push(new RequiredExpression());
    return this;
  }

  minLength(length: number): this {
    this.expressions.push(new MinLengthExpression(length));
    return this;
  }

  maxLength(length: number): this {
    this.expressions.push(new MaxLengthExpression(length));
    return this;
  }

  email(): this {
    this.expressions.push(new EmailExpression());
    return this;
  }

  build(): Expression {
    return this.expressions.reduce((acc, curr) => 
      new AndExpression(acc, curr)
    );
  }
}

// Usage
interface FormData {
  username: string;
  email: string;
  password: string;
}

const formData: FormData = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'
};

const usernameValidator = new ValidationBuilder()
  .required()
  .minLength(3)
  .maxLength(20)
  .build();

const emailValidator = new ValidationBuilder()
  .required()
  .email()
  .build();

const passwordValidator = new ValidationBuilder()
  .required()
  .minLength(8)
  .maxLength(30)
  .build();

// Validate username
console.log('Username valid:', usernameValidator.interpret({ value: formData.username }));

// Validate email
console.log('Email valid:', emailValidator.interpret({ value: formData.email }));

// Validate password
console.log('Password valid:', passwordValidator.interpret({ value: formData.password }));
```

### 3.2 Ví dụ về Expression Parser

```typescript
// Abstract Expression
interface Expression {
  evaluate(): number;
}

// Terminal Expression
class NumberExpression implements Expression {
  constructor(private value: number) {}

  evaluate(): number {
    return this.value;
  }
}

// Non-terminal Expressions
class AddExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  evaluate(): number {
    return this.left.evaluate() + this.right.evaluate();
  }
}

class SubtractExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  evaluate(): number {
    return this.left.evaluate() - this.right.evaluate();
  }
}

class MultiplyExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  evaluate(): number {
    return this.left.evaluate() * this.right.evaluate();
  }
}

class DivideExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  evaluate(): number {
    const rightValue = this.right.evaluate();
    if (rightValue === 0) {
      throw new Error('Division by zero');
    }
    return this.left.evaluate() / rightValue;
  }
}

// Parser
class ExpressionParser {
  private tokens: string[] = [];
  private position: number = 0;

  parse(expression: string): Expression {
    this.tokens = expression
      .split(/\s+/)
      .filter(token => token.length > 0);
    this.position = 0;
    
    return this.parseExpression();
  }

  private parseExpression(): Expression {
    const token = this.tokens[this.position];
    
    if (!isNaN(Number(token))) {
      this.position++;
      return new NumberExpression(Number(token));
    }

    this.position++;
    const left = this.parseExpression();
    const right = this.parseExpression();

    switch (token) {
      case '+':
        return new AddExpression(left, right);
      case '-':
        return new SubtractExpression(left, right);
      case '*':
        return new MultiplyExpression(left, right);
      case '/':
        return new DivideExpression(left, right);
      default:
        throw new Error(`Unknown operator: ${token}`);
    }
  }
}

// Usage
const parser = new ExpressionParser();

// Parse and evaluate expressions
const expressions = [
  '+ 5 * 2 3',     // 5 + (2 * 3) = 11
  '* + 2 3 4',     // (2 + 3) * 4 = 20
  '- 10 / 6 2',    // 10 - (6 / 2) = 7
];

expressions.forEach(exp => {
  const ast = parser.parse(exp);
  console.log(`${exp} = ${ast.evaluate()}`);
});
```

## 4. Trường hợp sử dụng thực tế

### 4.1 Parser cho Domain-Specific Language (DSL)

```typescript
// AST Nodes
interface ASTNode {
  evaluate(context: any): any;
}

class PropertyNode implements ASTNode {
  constructor(private name: string) {}

  evaluate(context: any): any {
    return context[this.name];
  }
}

class ComparisonNode implements ASTNode {
  constructor(
    private operator: string,
    private left: ASTNode,
    private right: ASTNode
  ) {}

  evaluate(context: any): boolean {
    const leftValue = this.left.evaluate(context);
    const rightValue = this.right.evaluate(context);

    switch (this.operator) {
      case '==': return leftValue === rightValue;
      case '!=': return leftValue !== rightValue;
      case '>': return leftValue > rightValue;
      case '<': return leftValue < rightValue;
      case '>=': return leftValue >= rightValue;
      case '<=': return leftValue <= rightValue;
      default: throw new Error(`Unknown operator: ${this.operator}`);
    }
  }
}

// Parser
class RuleParser {
  private tokens: string[] = [];
  private position: number = 0;

  parse(rule: string): ASTNode {
    this.tokens = rule.split(/\s+/).filter(t => t.length > 0);
    this.position = 0;
    return this.parseExpression();
  }

  private parseExpression(): ASTNode {
    const left = new PropertyNode(this.tokens[this.position++]);
    const operator = this.tokens[this.position++];
    const right = isNaN(Number(this.tokens[this.position])) 
      ? new PropertyNode(this.tokens[this.position++])
      : { evaluate: () => Number(this.tokens[this.position++]) };

    return new ComparisonNode(operator, left, right);
  }
}

// Usage
const parser = new RuleParser();

const rules = [
  'age >= 18',
  'score > 75',
  'status == "active"'
];

const context = {
  age: 25,
  score: 85,
  status: 'active'
};

rules.forEach(rule => {
  const ast = parser.parse(rule);
  console.log(`Rule "${rule}" evaluates to:`, ast.evaluate(context));
});
```

### 4.2 Template Engine

```typescript
interface TemplateExpression {
  evaluate(context: any): string;
}

class TextExpression implements TemplateExpression {
  constructor(private text: string) {}

  evaluate(): string {
    return this.text;
  }
}

class VariableExpression implements TemplateExpression {
  constructor(private name: string) {}

  evaluate(context: any): string {
    return context[this.name] ?? '';
  }
}

class ConditionalExpression implements TemplateExpression {
  constructor(
    private condition: string,
    private trueExpr: TemplateExpression,
    private falseExpr?: TemplateExpression
  ) {}

  evaluate(context: any): string {
    const result = !!context[this.condition];
    return result ? this.trueExpr.evaluate(context) 
                 : this.falseExpr?.evaluate(context) ?? '';
  }
}

class TemplateParser {
  parse(template: string): TemplateExpression {
    const expressions: TemplateExpression[] = [];
    let currentText = '';
    let i = 0;

    while (i < template.length) {
      if (template[i] === '{' && template[i + 1] === '{') {
        if (currentText) {
          expressions.push(new TextExpression(currentText));
          currentText = '';
        }

        const end = template.indexOf('}}', i);
        const variable = template.slice(i + 2, end).trim();
        expressions.push(new VariableExpression(variable));
        i = end + 2;
      } else {
        currentText += template[i];
        i++;
      }
    }

    if (currentText) {
      expressions.push(new TextExpression(currentText));
    }

    return {
      evaluate(context: any): string {
        return expressions.map(expr => expr.evaluate(context)).join('');
      }
    };
  }
}

// Usage
const templateEngine = new TemplateParser();

const template = `
Hello {{name}}!
{{#if isAdmin}}
  You have admin access.
{{else}}
  You have regular user access.
{{/if}}
Your role is: {{role}}
`;

const context = {
  name: 'John',
  isAdmin: true,
  role: 'Administrator'
};

const compiled = templateEngine.parse(template);
console.log(compiled.evaluate(context));
```

## 5. Ưu điểm và Nhược điểm

### 5.1 Ưu điểm
1. **Linh hoạt**: Dễ dàng thêm các biểu thức mới vào ngôn ngữ.
2. **Tách biệt**: Ngữ pháp và việc thông dịch được tách biệt rõ ràng.
3. **Dễ mở rộng**: Có thể dễ dàng thêm các quy tắc mới vào ngôn ngữ.

### 5.2 Nhược điểm
1. **Phức tạp**: Với ngữ pháp phức tạp, số lượng lớp có thể tăng nhanh.
2. **Hiệu năng**: Có thể chậm với các biểu thức phức tạp hoặc cây cú pháp sâu.
3. **Khó bảo trì**: Khi ngôn ngữ phát triển, việc bảo trì có thể trở nên khó khăn.

## 6. Kết luận

Interpreter Pattern là một công cụ mạnh mẽ cho việc xây dựng các bộ thông dịch cho các ngôn ngữ đơn giản. Pattern này đặc biệt hữu ích khi bạn cần xây dựng một DSL, công cụ xử lý biểu thức, hoặc template engine. Tuy nhiên, cần cân nhắc kỹ về độ phức tạp của ngữ pháp và yêu cầu hiệu năng khi quyết định sử dụng pattern này.
