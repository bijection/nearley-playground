@{%
	// Moo lexer documention is here:
	// https://github.com/no-context/moo

	const moo = require("moo")
	const lexer = moo.compile({
	  ws:     /[ \t]+/,
	  number: /[0-9]+/,
	  times: /\*|times/,
	  word: /[a-z]+/,
	});
%}

# Pass your lexer with @lexer:
@lexer lexer

main -> trig | multiplication {% ([first]) => first %}

# %token matches any token of that type
multiplication -> %number %ws %times %ws %number {% ([first, , , , second]) => first * second %}

# literal strings match lexed tokens with their exact text
trig -> "sin" %ws %number {% ([, ,third]) => Math.sin(third) %}