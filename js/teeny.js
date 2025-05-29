import { Lexer, TokenType } from "./lexer.js";

let source = "+- // This is a comment!\n */";
console.log("+- // This is a comment!\n */");
let lexer = new Lexer(source);

let token = lexer.getToken();
while (token.type != TokenType.EOF) {
  console.log(token.type);
  token = lexer.getToken();
}
