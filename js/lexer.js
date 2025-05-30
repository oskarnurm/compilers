export class Lexer {
  constructor(source) {
    this.source = source + "\n";
    this.currentChar = "";
    this.currentPos = -1;
    this.nextChar();
  }

  nextChar() {
    /* Increments the lexer's current position and updates the current character.
     * If we reach the end of the input, set the character to the end-of-file marker. */
    this.currentPos += 1;
    if (this.currentPos >= this.source.length) {
      this.currentChar = "\0";
    } else {
      this.currentChar = this.source[this.currentPos];
    }
  }

  peek() {
    /* Look ahead to the next character without updating currentPos */
    if (this.currentPos >= this.source.length) {
      return "\0";
    }
    return this.source[this.currentPos + 1];
  }

  abort(message) {
    console.error("Lexing error. " + message);
    process.exit(1);
  }

  skipWhitespace() {
    while (
      this.currentChar == " " ||
      this.currentChar == "\t" ||
      this.currentChar == "\r"
    ) {
      this.nextChar();
    }
  }

  skipComment() {
    if (this.currentChar == "/" && this.peek() == "/") {
      while (this.currentChar != "\n") {
        this.nextChar();
      }
    }
  }

  getToken() {
    this.skipWhitespace();
    this.skipComment();
    let token = null;

    if (this.currentChar == "+") {
      token = new Token(this.currentChar, TokenType.PLUS);
    } else if (this.currentChar == "-") {
      token = new Token(this.currentChar, TokenType.MINUS);
    } else if (this.currentChar == "*") {
      token = new Token(this.currentChar, TokenType.ASTERISK);
    } else if (this.currentChar == "/") {
      token = new Token(this.currentChar, TokenType.SLASH);
    } else if (this.currentChar == "=") {
      // if the next one is also "=", we have "=="
      if (this.peek() == "=") {
        const lastChar = this.currentChar;
        this.nextChar();
        token = new Token(lastChar + this.currentChar, TokenType.EQEQ);
      } else {
        token = new Token(this.currentChar, TokenType.EQ);
      }
    } else if (this.currentChar == ">") {
      if (this.peek() == "=") {
        const lastChar = this.currentChar;
        this.nextChar();
        token = new Token(lastChar + this.currentChar, TokenType.GTEQ);
      } else {
        token = new Token(this.currentChar, TokenType.GT);
      }
    } else if (this.currentChar == "<") {
      if (this.peek() == "=") {
        const lastChar = this.currentChar;
        this.nextChar();
        token = new Token(lastChar + this.currentChar, TokenType.LTEQ);
      } else {
        token = new Token(this.currentChar, TokenType.LT);
      }
    } else if (this.currentChar == "!") {
      if (this.peek() == "=") {
        const lastChar = this.currentChar;
        this.nextChar();
        token = new Token(lastChar + this.currentChar, TokenType.NOTEQ);
      } else {
        this.abort("Expected !=, got !" + this.peek());
      }
    } else if (this.currentChar == '"') {
      // Get characters between quoatations.
      const startPos = this.currentPos;
      this.nextChar();

      while (this.currentChar != '"') {
        if (
          this.currentChar == "\n" ||
          this.currentChar == "\r" ||
          this.currentChar == "\t" ||
          this.currentChar == "\%" ||
          this.currentChar == "\\"
        ) {
          this.abort("Illegal character in string");
        }
        this.nextChar();
      }
      const tokenText = this.source.slice(startPos, this.currentPos);
      token = new Token(tokenText, TokenType.STRING);
    } else if (this.currentChar == "\n") {
      token = new Token(this.currentChar, TokenType.NEWLINE);
    } else if (this.currentChar == "\0") {
      token = new Token(this.currentChar, TokenType.EOF);
    } else {
      this.abort("Unkown token: " + this.currentChar);
    }
    this.nextChar();
    return token;
  }
}

export class Token {
  constructor(tokenChar, tokenType) {
    this.char = tokenChar;
    this.type = tokenType;
  }
}

export const TokenType = {
  EOF: -1,
  NEWLINE: 0,
  NUMBER: 1,
  IDENT: 2,
  STRING: 3,
  // Keywords.
  LABEL: 101,
  GOTO: 102,
  PRINT: 103,
  INPUT: 104,
  LET: 105,
  IF: 106,
  THEN: 107,
  ENDIF: 108,
  WHILE: 109,
  REPEAT: 110,
  ENDWHILE: 111,
  // Operators.
  EQ: 201,
  PLUS: 202,
  MINUS: 203,
  ASTERISK: 204,
  SLASH: 205,
  EQEQ: 206,
  NOTEQ: 207,
  LT: 208,
  LTEQ: 209,
  GT: 210,
  GTEQ: 211,
};
