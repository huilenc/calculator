export function evaluateExpression(raw: string): number {
  // Pre-process: normalize separators and replace "1/x" with ⅟ (U+215F)
  // to avoid ambiguity between the "1" in "1/x" and numeric literals.
  const expr = raw
    .replace(/,/g, ".")
    .replace(/\s+/g, "")
    .replace(/1\/x/g, "⅟");
  if (!expr) throw new Error("Empty expression");
  // 1) Tokenize numbers/operators/parentheses + unary minus support
  const tokens: string[] = [];
  let i = 0;
  const isDigit = (c: string) => c >= "0" && c <= "9";
  const isOperator = (t: string) =>
    t === "+" || t === "-" || t === "*" || t === "/";
  // Postfix unary: operand already on output stack, push token directly to output
  const isPostfixUnary = (t: string) =>
    t === "%" || t === "x^2" || t === "⅟";
  // Prefix unary: like a high-precedence right-associative operator
  const isPrefixUnary = (t: string) => t === "√";
  while (i < expr.length) {
    const c = expr[i];
    // Multi-char token "x^2" must be checked before the operator/char checks
    if (expr.startsWith("x^2", i)) {
      tokens.push("x^2");
      i += 3;
      continue;
    }
    if (isDigit(c) || c === ".") {
      let num = c;
      i++;
      while (i < expr.length && (isDigit(expr[i]) || expr[i] === ".")) {
        num += expr[i++];
      }
      if ((num.match(/\./g) || []).length > 1)
        throw new Error("Invalid number");
      tokens.push(num);
      continue;
    }
    if (
      c === "-" &&
      (tokens.length === 0 ||
        isOperator(tokens[tokens.length - 1]) ||
        tokens[tokens.length - 1] === "(")
    ) {
      // unary minus before number or parenthesis
      if (
        i + 1 < expr.length &&
        (isDigit(expr[i + 1]) || expr[i + 1] === ".")
      ) {
        let num = "-";
        i++;
        while (i < expr.length && (isDigit(expr[i]) || expr[i] === ".")) {
          num += expr[i++];
        }
        if ((num.match(/\./g) || []).length > 1)
          throw new Error("Invalid number");
        tokens.push(num);
        continue;
      } else {
        // -(...) => 0 - (...)
        tokens.push("0");
        tokens.push("-");
        i++;
        continue;
      }
    }
    if (
      c === "+" ||
      c === "-" ||
      c === "*" ||
      c === "/" ||
      c === "(" ||
      c === ")" ||
      c === "%" ||
      c === "√" ||
      c === "⅟"
    ) {
      tokens.push(c);
      i++;
      continue;
    }
    throw new Error(`Invalid character: ${c}`);
  }
  // 2) Shunting-yard: infix -> postfix (RPN)
  // √ gets precedence 3 so it binds tighter than * and / (prec 2)
  const prec: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "√": 3 };
  const output: string[] = [];
  const ops: string[] = [];
  for (const t of tokens) {
    if (!Number.isNaN(Number(t))) {
      output.push(t);
    } else if (isPostfixUnary(t)) {
      // Operand is already on the output; push the operator immediately.
      output.push(t);
    } else if (isPrefixUnary(t)) {
      ops.push(t);
    } else if (isOperator(t)) {
      while (
        ops.length &&
        ops[ops.length - 1] !== "(" &&
        (isOperator(ops[ops.length - 1]) || isPrefixUnary(ops[ops.length - 1])) &&
        prec[ops[ops.length - 1]] >= prec[t]
      ) {
        output.push(ops.pop()!);
      }
      ops.push(t);
    } else if (t === "(") {
      ops.push(t);
    } else if (t === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        output.push(ops.pop()!);
      }
      if (!ops.length || ops.pop() !== "(")
        throw new Error("Mismatched parentheses");
      // Pop a prefix unary (e.g. √) that was waiting for the parenthesised group
      if (ops.length && isPrefixUnary(ops[ops.length - 1])) {
        output.push(ops.pop()!);
      }
    }
  }
  while (ops.length) {
    const op = ops.pop()!;
    if (op === "(" || op === ")") throw new Error("Mismatched parentheses");
    output.push(op);
  }
  // 3) Evaluate postfix
  const stack: number[] = [];
  for (const t of output) {
    if (!Number.isNaN(Number(t))) {
      stack.push(Number(t));
      continue;
    }
    // Unary operators (prefix √, postfix %, x^2, ⅟)
    if (t === "%" || t === "x^2" || t === "⅟" || t === "√") {
      const a = stack.pop();
      if (a === undefined) throw new Error("Invalid expression");
      if (t === "%") stack.push(a / 100);
      else if (t === "x^2") stack.push(a * a);
      else if (t === "⅟") {
        if (a === 0) throw new Error("Division by zero");
        stack.push(1 / a);
      } else {
        if (a < 0) throw new Error("Square root of negative number");
        stack.push(Math.sqrt(a));
      }
      continue;
    }
    // Binary operators
    const b = stack.pop();
    const a = stack.pop();
    if (a === undefined || b === undefined)
      throw new Error("Invalid expression");
    if (t === "+") stack.push(a + b);
    else if (t === "-") stack.push(a - b);
    else if (t === "*") stack.push(a * b);
    else if (t === "/") {
      if (b === 0) throw new Error("Division by zero");
      stack.push(a / b);
    }
  }
  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}
