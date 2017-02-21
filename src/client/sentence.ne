MAIN -> SENTENCE "."
SENTENCE -> SUB _ VERB _ MOD
SUB -> "My dog" | "Charles" | "A typical Reddit user"
VERB -> "sleeps" | "thinks" | "cries" | "tweets" | "believes in ponies"
MOD -> "with" _ OBJ | "while thinking about" _ OBJ | "better than" _ OBJ _ "can" | "agressively" | "but" _ SENTENCE
OBJ -> "a hammer" | "nobody" | "snakes"
_ -> " "