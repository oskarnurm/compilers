import { Lexer, TokenType } from "./lexer.js";

let source = "IF+-123 foo*THEN/";
let lexer = new Lexer(source);

let token = lexer.getToken();
while (token.type != TokenType.EOF) {
  console.log(token.type);
  token = lexer.getToken();
}
