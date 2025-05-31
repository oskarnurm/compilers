import { Lexer, TokenType } from "./lexer.js";

let source = "123 9.787 */";
let lexer = new Lexer(source);

let token = lexer.getToken();
while (token.type != TokenType.EOF) {
  console.log(token.type);
  token = lexer.getToken();
}
