// Micro-learning screen types
export type Screen =
  | { type: 'intro'; text: string }
  | { type: 'concept'; text: string }
  | { type: 'quiz'; question: string; options: string[]; correctIndex: number; feedbackCorrect: string; feedbackWrong: string }
  | { type: 'build'; title: string; code: string; explanation: string }
  | { type: 'code'; prompt: string }
  | { type: 'final'; text: string };

// Screens per exercise slug (learn phase only)
export const SCREENS: Record<string, Screen[]> = {

  'datos-personales': [
    { type: 'intro', text: 'Vamos a hacer tu primer programa.\nLee datos del usuario y mu\u00e9stralos por pantalla.' },
    { type: 'concept', text: 'Para leer datos usamos scanf.\nPara mostrarlos usamos printf.' },
    { type: 'concept', text: 'Cada tipo de dato tiene su letra:\n%s para texto, %d para n\u00fameros enteros, %f para decimales.' },
    { type: 'quiz', question: '\u00bfQu\u00e9 letra se usa para leer un n\u00famero entero?', options: ['%s', '%d', '%f'], correctIndex: 1, feedbackCorrect: 'Eso es. %d para enteros.', feedbackWrong: '%d es para enteros. %s es texto, %f es decimal.' },
    { type: 'build', title: 'Paso 1: declarar variables', code: 'char nombre[50];\nint edad;\nfloat altura;', explanation: 'Una variable por cada dato que necesitas.' },
    { type: 'build', title: 'Paso 2: leer los datos', code: 'scanf("%s %d %f", nombre, &edad, &altura);', explanation: 'nombre va sin &. edad y altura s\u00ed llevan &.' },
    { type: 'quiz', question: 'En scanf, \u00bfnombre lleva & delante?', options: ['S\u00ed, como el resto', 'No, nombre va sin &'], correctIndex: 1, feedbackCorrect: 'Eso es. Las cadenas de texto van sin &.', feedbackWrong: 'Las cadenas (char[]) van sin &. Solo int y float lo necesitan.' },
    { type: 'build', title: 'Paso 3: mostrar resultados', code: 'printf("Nombre: %s\\n", nombre);\nprintf("Edad: %d\\n", edad);\nprintf("Altura: %.2f m\\n", altura);', explanation: '%.2f muestra 2 decimales.' },
    { type: 'final', text: 'Ya sabes leer datos y mostrarlos.\nEsto es la base de todo lo que viene.' },
  ],

  'angulo-cuadrante': [
    { type: 'intro', text: 'Un programa que decide qu\u00e9 hacer\nseg\u00fan el valor que recibe.' },
    { type: 'concept', text: 'Usamos if / else if / else.\nEl programa va comprobando hasta que una condici\u00f3n se cumple.' },
    { type: 'concept', text: 'El truco: comprobar primero lo m\u00e1s espec\u00edfico.\nSi no, los casos generales se "tragan" los espec\u00edficos.' },
    { type: 'quiz', question: '\u00bfQu\u00e9 hay que comprobar primero: los ejes exactos o los rangos?', options: ['Los rangos', 'Los ejes exactos'], correctIndex: 1, feedbackCorrect: 'Eso es. Primero lo espec\u00edfico, luego lo general.', feedbackWrong: 'Si pones rangos primero, los valores exactos nunca se comprueban.' },
    { type: 'build', title: 'Primero: validar', code: 'if (angulo < 0 || angulo > 360) {\n    printf("ERROR\\n");\n}', explanation: 'Siempre valida antes de hacer nada.' },
    { type: 'build', title: 'Luego: ejes exactos', code: 'else if (angulo == 0 || angulo == 360)\n    printf("Eje X positivo\\n");\nelse if (angulo == 90)\n    printf("Eje Y positivo\\n");', explanation: 'Los valores exactos van ANTES que los rangos.' },
    { type: 'build', title: 'Por \u00faltimo: cuadrantes', code: 'else if (angulo < 90)\n    printf("Cuadrante I\\n");\nelse if (angulo < 180)\n    printf("Cuadrante II\\n");', explanation: 'Como ya descartamos los ejes, estos rangos funcionan.' },
    { type: 'final', text: 'Has aprendido a encadenar condiciones.\nEl orden siempre importa.' },
  ],

  'aceleracion-normal': [
    { type: 'intro', text: 'Un programa que aplica una f\u00f3rmula.\nLee datos, calcula y muestra el resultado.' },
    { type: 'concept', text: 'La f\u00f3rmula es: a = \u03c9\u00b2 \u00d7 r\nEn C no existe ^. Para elevar al cuadrado: omega * omega.' },
    { type: 'quiz', question: '\u00bfC\u00f3mo se escribe omega al cuadrado en C?', options: ['omega^2', 'omega * omega', 'pow(omega, 2)'], correctIndex: 1, feedbackCorrect: 'Eso es. Multiplicar por s\u00ed mismo.', feedbackWrong: 'En C, ^ es otra cosa (XOR). Usa omega * omega.' },
    { type: 'build', title: 'Leer los datos', code: 'float omega, radio, a;\nscanf("%f %f", &omega, &radio);', explanation: 'Dos n\u00fameros con decimales. Ambos llevan &.' },
    { type: 'build', title: 'Calcular y mostrar', code: 'a = omega * omega * radio;\nprintf("Aceleracion: %.2f m/s2\\n", a);', explanation: 'omega * omega es omega al cuadrado.' },
    { type: 'final', text: 'Leer \u2192 calcular \u2192 mostrar.\nEste patr\u00f3n se repite en casi todo.' },
  ],

  'calificacion': [
    { type: 'intro', text: 'Calcular una nota final\nusando pesos (60%, 30%, 10%).' },
    { type: 'concept', text: 'Media ponderada: cada nota se multiplica por su peso.\nLos pesos deben sumar 1.0 (o 100%).' },
    { type: 'quiz', question: '0.6 + 0.3 + 0.1 = ?', options: ['0.9', '1.0', '1.1'], correctIndex: 1, feedbackCorrect: 'Exacto. Los pesos siempre suman 1.', feedbackWrong: 'Suman 1.0. Si no cuadra, la nota sale mal.' },
    { type: 'build', title: 'La f\u00f3rmula', code: 'nota = 0.6f * examen + 0.3f * hitos + 0.1f * autoeval;', explanation: 'Cada nota multiplicada por su peso.' },
    { type: 'build', title: 'Mostrar con 1 decimal', code: 'printf("Nota final: %.1f\\n", nota);', explanation: '%.1f = un decimal. %.2f ser\u00edan dos.' },
    { type: 'final', text: 'Las f\u00f3rmulas ponderadas se usan mucho.\nSiempre comprueba que los pesos sumen 1.' },
  ],

  'cambio-divisas': [
    { type: 'intro', text: 'Convertir euros a otras monedas\nusando constantes fijas.' },
    { type: 'concept', text: '#define crea un valor fijo que no cambia.\nVa FUERA de main y NO lleva punto y coma.' },
    { type: 'quiz', question: '\u00bfD\u00f3nde va #define?', options: ['Dentro de main', 'Fuera de main, arriba del todo'], correctIndex: 1, feedbackCorrect: 'Eso es. Siempre antes de main.', feedbackWrong: '#define va arriba, fuera de main. Es una instrucci\u00f3n para el compilador.' },
    { type: 'build', title: 'Definir constantes', code: '#define EUR_A_USD 1.08f\n#define EUR_A_GBP 0.86f\n#define EUR_A_JPY 162.50f', explanation: 'Sin = y sin ; al final.' },
    { type: 'build', title: 'Validar y calcular', code: 'if (euros <= 0.0f) {\n    printf("ERROR\\n");\n} else {\n    printf("USD: %.2f\\n", euros * EUR_A_USD);\n}', explanation: 'Primero comprobar, luego calcular.' },
    { type: 'final', text: '#define sirve para constantes.\nAs\u00ed no repites n\u00fameros por todo el c\u00f3digo.' },
  ],

  'corriente': [
    { type: 'intro', text: 'Calcular corriente el\u00e9ctrica.\nPero antes hay que comprobar que los datos son v\u00e1lidos.' },
    { type: 'concept', text: 'Si la resistencia es 0, no puedes dividir.\nEl programa debe detectarlo ANTES de calcular.' },
    { type: 'quiz', question: '\u00bfQu\u00e9 pasa si divides entre 0 en C?', options: ['Da 0', 'El programa se rompe'], correctIndex: 1, feedbackCorrect: 'Exacto. Por eso hay que comprobarlo antes.', feedbackWrong: 'Dividir entre 0 causa un fallo. Siempre hay que comprobarlo.' },
    { type: 'build', title: 'Validar primero', code: 'if (R <= 0.0f) {\n    printf("ERROR\\n");\n}', explanation: 'Esto evita la divisi\u00f3n por cero.' },
    { type: 'build', title: 'Calcular si es v\u00e1lido', code: 'else {\n    I = V / R;\n    printf("%.2f A\\n", I);\n}', explanation: 'Solo se ejecuta si R es positiva.' },
    { type: 'final', text: 'Patr\u00f3n clave: validar \u2192 calcular \u2192 mostrar.\nSiempre en ese orden.' },
  ],

  'ajuste-grados': [
    { type: 'intro', text: 'Ajustar un \u00e1ngulo para que quede entre 0 y 359.\nIncluso si es negativo o muy grande.' },
    { type: 'concept', text: 'El operador % (m\u00f3dulo) da el resto de dividir.\n10 % 3 = 1, porque 10 = 3\u00d73 + 1.' },
    { type: 'quiz', question: '\u00bfQu\u00e9 da -90 % 360 en C?', options: ['270', '-90'], correctIndex: 1, feedbackCorrect: 'Eso es. En C, el m\u00f3dulo con negativos da negativo.', feedbackWrong: 'Cuidado: en C, -90 % 360 da -90, no 270.' },
    { type: 'build', title: 'Corregir negativos primero', code: 'while (angulo < 0) {\n    angulo += 360;\n}', explanation: 'Suma 360 hasta que sea positivo.' },
    { type: 'build', title: 'Luego aplicar m\u00f3dulo', code: 'angulo = angulo % 360;', explanation: 'Esto convierte 360 en 0, 730 en 10, etc.' },
    { type: 'final', text: 'M\u00f3dulo con negativos es una trampa cl\u00e1sica.\nAhora ya la conoces.' },
  ],

  'patron-numeros': [
    { type: 'intro', text: 'Imprimir n\u00fameros del 1 al n.\nTu primer bucle for.' },
    { type: 'concept', text: 'for tiene 3 partes:\nfor (inicio; condici\u00f3n; paso)' },
    { type: 'quiz', question: 'for (i=1; i<=5; i++) \u2014 \u00bfcu\u00e1ntas veces se ejecuta?', options: ['4', '5', '6'], correctIndex: 1, feedbackCorrect: 'Eso es. De 1 a 5 son 5 veces.', feedbackWrong: 'i empieza en 1 y llega hasta 5 (inclusive). Son 5 veces.' },
    { type: 'build', title: 'El bucle', code: 'for (i = 1; i <= n; i++) {\n    printf("%d\\n", i);\n}', explanation: 'Imprime i en cada vuelta.' },
    { type: 'build', title: 'A\u00f1adir condici\u00f3n dentro', code: 'if (i % 2 == 0) {\n    printf("%d PAR\\n", i);\n} else {\n    printf("%d\\n", i);\n}', explanation: 'i % 2 == 0 significa que es par.' },
    { type: 'final', text: 'Ya dominas el for b\u00e1sico.\nEs la herramienta m\u00e1s usada en C.' },
  ],

  'eleva-signo': [
    { type: 'intro', text: 'Calcular (-1) elevado a n.\nSin usar pow. Solo pensando.' },
    { type: 'concept', text: 'Par \u2192 resultado 1.\nImpar \u2192 resultado -1.' },
    { type: 'quiz', question: '(-1) elevado a 4 = ?', options: ['1', '-1'], correctIndex: 0, feedbackCorrect: 'Par \u2192 1. Siempre.', feedbackWrong: '4 es par. Par \u2192 positivo.' },
    { type: 'build', title: 'Todo el programa', code: 'if (n % 2 == 0) {\n    printf("1\\n");\n} else {\n    printf("-1\\n");\n}', explanation: 'n % 2 == 0 comprueba si n es par.' },
    { type: 'final', text: 'A veces la soluci\u00f3n es pensar, no calcular.\nEsto sale mucho en ex\u00e1menes.' },
  ],

  'patron-estrellas': [
    { type: 'intro', text: 'Dibujar un tri\u00e1ngulo de asteriscos.\nNecesitas un for dentro de otro for.' },
    { type: 'concept', text: 'El for exterior controla las filas.\nEl for interior dibuja los asteriscos de cada fila.' },
    { type: 'quiz', question: 'Fila 3 de un tri\u00e1ngulo, \u00bfcu\u00e1ntos asteriscos tiene?', options: ['2', '3', '4'], correctIndex: 1, feedbackCorrect: 'Fila i tiene i asteriscos.', feedbackWrong: 'La fila 3 tiene 3 asteriscos. Fila i \u2192 i asteriscos.' },
    { type: 'build', title: 'Dos for anidados', code: 'for (i = 1; i <= n; i++) {\n    for (j = 1; j <= i; j++) {\n        printf("*");\n    }\n    printf("\\n");\n}', explanation: 'El \\n va FUERA del for interior.' },
    { type: 'final', text: 'For anidado: el interior depende del exterior.\nEste patr\u00f3n se repite mucho.' },
  ],

  'media-desviacion': [
    { type: 'intro', text: 'Leer n\u00fameros hasta que llegue un -99.\nCalcular media y desviaci\u00f3n.' },
    { type: 'concept', text: 'Centinela: un valor especial que dice "ya no hay m\u00e1s".\nAqu\u00ed el centinela es -99.' },
    { type: 'concept', text: 'Necesitas guardar dos totales:\nla suma de todos los n\u00fameros, y la suma de cada n\u00famero multiplicado por s\u00ed mismo.' },
    { type: 'quiz', question: '\u00bfEl centinela (-99) se cuenta en la media?', options: ['S\u00ed', 'No'], correctIndex: 1, feedbackCorrect: 'Nunca. El centinela solo marca el final.', feedbackWrong: 'El centinela no es un dato. Solo indica el fin.' },
    { type: 'build', title: 'Patr\u00f3n centinela', code: 'scanf("%f", &x);\nwhile (x != -99.0f) {\n    suma += x;\n    sumaCuad += x * x;\n    n++;\n    scanf("%f", &x);\n}', explanation: 'Leer antes del while Y al final del while.' },
    { type: 'build', title: 'Calcular desviaci\u00f3n', code: 'media = suma / n;\ndesv = sqrtf(sumaCuad/n - media*media);', explanation: 'F\u00f3rmula: ra\u00edz de (media de cuadrados - cuadrado de media).' },
    { type: 'final', text: 'El patr\u00f3n centinela es fundamental.\nLeer \u2192 while \u2192 acumular \u2192 leer de nuevo.' },
  ],

  'menu-formas': [
    { type: 'intro', text: 'Un men\u00fa con opciones.\nEl usuario elige y el programa act\u00faa.' },
    { type: 'concept', text: 'switch es como un if con muchas opciones.\nCada opci\u00f3n va en un case. No olvides break.' },
    { type: 'quiz', question: '\u00bfQu\u00e9 pasa si olvidas break en un case?', options: ['No pasa nada', 'Se ejecuta tambi\u00e9n el siguiente case'], correctIndex: 1, feedbackCorrect: 'Exacto. Sin break, "cae" al siguiente caso.', feedbackWrong: 'Sin break, la ejecuci\u00f3n contin\u00faa al siguiente case.' },
    { type: 'build', title: 'Estructura del switch', code: 'switch (opcion) {\n    case 1:\n        /* c\u00edrculo */\n        break;\n    case 2:\n        /* rect\u00e1ngulo */\n        break;\n    default:\n        printf("No v\u00e1lido\\n");\n}', explanation: 'default cubre opciones no previstas.' },
    { type: 'final', text: 'switch + break + default.\nEste patr\u00f3n es de examen seguro.' },
  ],

};

export function getScreens(slug: string): Screen[] | null {
  return SCREENS[slug] ?? null;
}
