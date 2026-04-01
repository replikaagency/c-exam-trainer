// Micro-learning screen types
export type Screen =
  | { type: 'intro'; text: string }
  | { type: 'concept'; text: string }
  | { type: 'quiz'; question: string; options: string[]; correctIndex: number; feedbackCorrect: string; feedbackWrong: string }
  | { type: 'build'; title: string; code: string; explanation: string }
  | { type: 'code'; prompt: string }
  | { type: 'fill'; title: string; codeWithGaps: string; answers: string[] }
  | { type: 'ghost'; title: string; ghostCode: string }
  | { type: 'partial'; title: string; starterCode: string }
  | { type: 'level-select' }
  | { type: 'final'; text: string };

export type PracticeLevel = 1 | 2 | 3 | 4;

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

  'tanque': [
    { type: 'intro', text: 'Calcular el volumen de un cilindro.\nPero primero hay que comprobar que los datos tienen sentido.' },
    { type: 'concept', text: 'V = \u03c0 \u00d7 r\u00b2 \u00d7 h\nSi r o h son negativos o cero, no tiene sentido f\u00edsico.' },
    { type: 'quiz', question: '\u00bfHay que comprobar los dos valores (r y h)?', options: ['Solo uno', 'Los dos'], correctIndex: 1, feedbackCorrect: 'Eso es. Si cualquiera es inv\u00e1lido, no se calcula.', feedbackWrong: 'Ambos deben ser positivos. Basta que uno falle.' },
    { type: 'build', title: 'Validar con ||', code: 'if (r <= 0.0f || h <= 0.0f) {\n    printf("ERROR\\n");\n}', explanation: '|| significa "o". Si alguno falla, es error.' },
    { type: 'build', title: 'Calcular', code: 'V = 3.14159f * r * r * h;\nprintf("Volumen: %.2f\\n", V);', explanation: 'r\u00b2 = r * r. No existe ^ en C.' },
    { type: 'final', text: 'Validar m\u00faltiples datos con ||.\nMismo patr\u00f3n que corriente, pero con dos comprobaciones.' },
  ],

  'doble-par': [
    { type: 'intro', text: 'Clasificar un n\u00famero:\n\u00bfes doble par, par o impar?' },
    { type: 'concept', text: 'Doble par = divisible por 4.\nPar = divisible por 2 pero no por 4.' },
    { type: 'quiz', question: '\u00bfQu\u00e9 hay que comprobar primero: %4 o %2?', options: ['%2', '%4'], correctIndex: 1, feedbackCorrect: 'Primero lo m\u00e1s espec\u00edfico (%4).', feedbackWrong: 'Si pones %2 primero, el 12 entra como "par" y nunca llega a "doble par".' },
    { type: 'build', title: 'El orden correcto', code: 'if (n % 4 == 0) printf("Doble par\\n");\nelse if (n % 2 == 0) printf("Par\\n");\nelse printf("Impar\\n");', explanation: 'else if evita que entre en dos casos.' },
    { type: 'final', text: 'Cuando clasificas: comprueba primero lo m\u00e1s restrictivo.' },
  ],

  'resistencias': [
    { type: 'intro', text: 'Calcular resistencias en serie y en paralelo.\nDos f\u00f3rmulas distintas con los mismos datos.' },
    { type: 'concept', text: 'Serie: se suman. R1 + R2.\nParalelo: (R1 \u00d7 R2) / (R1 + R2).' },
    { type: 'quiz', question: 'Si R1=4 y R2=6, \u00bfcu\u00e1nto es la serie?', options: ['10', '24', '2.4'], correctIndex: 0, feedbackCorrect: 'Serie es suma directa.', feedbackWrong: 'Serie = R1 + R2 = 10.' },
    { type: 'build', title: 'Dos c\u00e1lculos', code: 'serie = R1 + R2;\nparalelo = (R1 * R2) / (R1 + R2);', explanation: 'El paralelo usa producto entre suma.' },
    { type: 'final', text: 'Un programa puede calcular varias cosas\ncon los mismos datos.' },
  ],

  'resistencias-colores': [
    { type: 'intro', text: 'Calcular el valor de una resistencia\na partir de los colores de sus bandas.' },
    { type: 'concept', text: 'Cada color tiene un n\u00famero del 0 al 9.\nUsamos switch para convertir la letra inicial al n\u00famero.' },
    { type: 'quiz', question: '\u00bfQu\u00e9 necesitas para no repetir el switch 3 veces?', options: ['Un bucle', 'Una funci\u00f3n'], correctIndex: 1, feedbackCorrect: 'Una funci\u00f3n que recibe la letra y devuelve el d\u00edgito.', feedbackWrong: 'Crear una funci\u00f3n evita copiar el mismo switch 3 veces.' },
    { type: 'build', title: 'La funci\u00f3n', code: 'int colorADigito(char c) {\n    switch (c) {\n        case \'N\': return 0;\n        case \'M\': return 1;\n        case \'R\': return 2;\n        // ... hasta B=9\n        default: return -1;\n    }\n}', explanation: 'Un case por cada color. default = no v\u00e1lido.' },
    { type: 'build', title: 'Usar la funci\u00f3n', code: 'int d1 = colorADigito(c1);\nint d2 = colorADigito(c2);\nint valor = (d1 * 10 + d2) * mult;', explanation: 'Los dos d\u00edgitos forman un n\u00famero de 2 cifras.' },
    { type: 'final', text: 'Funciones + switch = c\u00f3digo limpio.\nEste ejercicio combina ambas cosas.' },
  ],

  'triangulo-numerico': [
    { type: 'intro', text: 'Dibujar un tri\u00e1ngulo de n\u00fameros.\nLos n\u00fameros siguen de fila en fila.' },
    { type: 'concept', text: 'La diferencia con asteriscos:\naqu\u00ed el contador NO se reinicia en cada fila.' },
    { type: 'quiz', question: 'Si la fila 1 tiene el 1 y la fila 2 tiene 2,3...\n\u00bfcon qu\u00e9 n\u00famero empieza la fila 3?', options: ['1', '3', '4'], correctIndex: 2, feedbackCorrect: 'Sigue donde par\u00f3: 1, luego 2-3, luego 4-5-6.', feedbackWrong: 'El contador es global: 1 | 2,3 | 4,5,6 | ...' },
    { type: 'build', title: 'Contador global', code: 'int num = 1;\nfor (i = 1; i <= n; i++) {\n    for (j = 1; j <= i; j++) {\n        printf("%4d", num);\n        num++;\n    }\n    printf("\\n");\n}', explanation: 'num se declara FUERA y nunca se reinicia.' },
    { type: 'final', text: 'Contador global + for anidado.\n%4d alinea los n\u00fameros con ancho fijo.' },
  ],

  'contador-rangos': [
    { type: 'intro', text: 'Leer n\u00fameros y contar\ncu\u00e1ntos son negativos, cero o positivos.' },
    { type: 'concept', text: 'Necesitas 3 contadores.\nCada uno empieza en 0, antes del bucle.' },
    { type: 'quiz', question: '\u00bfD\u00f3nde se inicializan los contadores?', options: ['Dentro del for', 'Antes del for'], correctIndex: 1, feedbackCorrect: 'Siempre antes. Si los pones dentro, se resetean en cada vuelta.', feedbackWrong: 'Dentro del for se resetear\u00edan a 0 en cada iteraci\u00f3n.' },
    { type: 'build', title: 'Leer y clasificar', code: 'for (i = 0; i < n; i++) {\n    scanf("%d", &x);\n    if (x < 0) neg++;\n    else if (x == 0) cero++;\n    else pos++;\n}', explanation: 'else if evita contar el mismo n\u00famero dos veces.' },
    { type: 'final', text: 'Contadores + for + else if.\nPatr\u00f3n muy com\u00fan en ejercicios de examen.' },
  ],

  'suma-acumulada': [
    { type: 'intro', text: 'Sumar n\u00fameros hasta que llegue un -1.\nY calcular la media.' },
    { type: 'concept', text: 'El -1 no se suma. Solo marca el final.\nEsto se llama centinela.' },
    { type: 'quiz', question: '\u00bfD\u00f3nde se lee el siguiente n\u00famero?', options: ['Solo antes del while', 'Antes Y al final del while'], correctIndex: 1, feedbackCorrect: 'Exacto. Si no lees al final, bucle infinito.', feedbackWrong: 'Hay que leer antes del while (la primera vez) y al final (para las siguientes).' },
    { type: 'build', title: 'El patr\u00f3n', code: 'scanf("%d", &x);\nwhile (x != -1) {\n    suma += x;\n    cont++;\n    scanf("%d", &x);\n}', explanation: 'Dos scanf: uno antes, otro al final del while.' },
    { type: 'final', text: 'Centinela: leer \u2192 while \u2192 procesar \u2192 leer de nuevo.' },
  ],

  'insertar-centro': [
    { type: 'intro', text: 'Insertar un d\u00edgito en el centro de un n\u00famero.\nEjemplo: 1234 con d\u00edgito 5 \u2192 12534.' },
    { type: 'concept', text: 'Primero: contar cu\u00e1ntas cifras tiene el n\u00famero.\nDividir entre 10 repetidamente hasta llegar a 0.' },
    { type: 'quiz', question: '\u00bfC\u00f3mo se separa un n\u00famero en "parte alta" y "parte baja"?', options: ['Con + y -', 'Con / y %'], correctIndex: 1, feedbackCorrect: '/ te da la parte alta, % te da la parte baja.', feedbackWrong: 'Divisi\u00f3n entera (/) da la parte alta. M\u00f3dulo (%) da la parte baja.' },
    { type: 'build', title: 'Contar cifras', code: 'tmp = num;\nwhile (tmp > 0) {\n    cifras++;\n    tmp /= 10;\n}', explanation: 'Divide entre 10 hasta que quede 0.' },
    { type: 'build', title: 'Reconstruir', code: 'parte_baja = num % potencia;\nparte_alta = num / potencia;\nresultado = parte_alta * potencia * 10\n           + digito * potencia\n           + parte_baja;', explanation: 'El \u00d710 extra hace hueco para el d\u00edgito nuevo.' },
    { type: 'final', text: 'Manipular cifras: /, % y potencias de 10.\nEjercicio dif\u00edcil pero muy de examen.' },
  ],

  'funciones-geometria': [
    { type: 'intro', text: 'Crear tu propia funci\u00f3n.\nRecibe datos, calcula y devuelve el resultado.' },
    { type: 'concept', text: 'Una funci\u00f3n tiene 3 partes:\n1) tipo de retorno, 2) par\u00e1metros, 3) return.' },
    { type: 'quiz', question: '\u00bfLa funci\u00f3n debe imprimir el resultado?', options: ['S\u00ed, con printf', 'No, debe hacer return'], correctIndex: 1, feedbackCorrect: 'La funci\u00f3n calcula y retorna. main imprime.', feedbackWrong: 'Las funciones devuelven valores con return. printf va en main.' },
    { type: 'build', title: 'Definir la funci\u00f3n', code: 'float areaRectangulo(float base, float altura) {\n    return base * altura;\n}', explanation: 'Recibe dos floats, devuelve un float.' },
    { type: 'build', title: 'Llamarla desde main', code: 'area = areaRectangulo(base, altura);\nprintf("Area: %.2f\\n", area);', explanation: 'main llama a la funci\u00f3n y muestra lo que devuelve.' },
    { type: 'final', text: 'Funciones: calcular y devolver.\nmain: leer, llamar e imprimir.' },
  ],

  'funcion-validar-rango': [
    { type: 'intro', text: 'Crear una funci\u00f3n que diga si un n\u00famero es v\u00e1lido.\nY usarla con do-while para repetir hasta acertar.' },
    { type: 'concept', text: 'do-while: ejecuta al menos una vez.\nRepite mientras la condici\u00f3n sea verdadera.' },
    { type: 'quiz', question: '\u00bfCu\u00e1l es la diferencia entre while y do-while?', options: ['Ninguna', 'do-while siempre ejecuta al menos una vez'], correctIndex: 1, feedbackCorrect: 'Exacto. Primero hace, luego comprueba.', feedbackWrong: 'while puede no ejecutarse nunca. do-while siempre al menos una vez.' },
    { type: 'build', title: 'La funci\u00f3n', code: 'int esValido(float x) {\n    if (x >= 1.0f && x <= 100.0f)\n        return 1;\n    return 0;\n}', explanation: 'Devuelve 1 si est\u00e1 en rango, 0 si no.' },
    { type: 'build', title: 'do-while con la funci\u00f3n', code: 'do {\n    scanf("%f", &x);\n} while (!esValido(x));', explanation: 'El ! invierte: repite mientras NO sea v\u00e1lido.' },
    { type: 'final', text: 'Funciones que devuelven 0 o 1 + do-while.\nPatr\u00f3n de validaci\u00f3n robusto.' },
  ],

  'estadisticas-array': [
    { type: 'intro', text: 'Guardar muchos n\u00fameros y calcular\nm\u00ednimo, m\u00e1ximo y media.' },
    { type: 'concept', text: 'Un array guarda varios valores bajo un nombre.\na[0], a[1], a[2]... se accede con el \u00edndice.' },
    { type: 'quiz', question: '\u00bfCon qu\u00e9 valor inicializas el m\u00ednimo?', options: ['Con 0', 'Con el primer elemento del array'], correctIndex: 1, feedbackCorrect: 'Siempre con a[0]. Si pones 0, puedes equivocarte.', feedbackWrong: 'Si todos son negativos y pones min=0, nunca se actualizar\u00e1.' },
    { type: 'build', title: 'Leer en array', code: 'int a[n];\nfor (i = 0; i < n; i++)\n    scanf("%d", &a[i]);', explanation: 'Un scanf por cada posici\u00f3n del array.' },
    { type: 'build', title: 'Recorrer y calcular', code: 'int min = a[0], max = a[0], suma = 0;\nfor (i = 0; i < n; i++) {\n    if (a[i] < min) min = a[i];\n    if (a[i] > max) max = a[i];\n    suma += a[i];\n}', explanation: 'Un solo for para las tres operaciones.' },
    { type: 'final', text: 'Arrays: guardar, recorrer y calcular.\nBase de muchos problemas.' },
  ],

  'velocidad-media': [
    { type: 'intro', text: 'Calcular la velocidad media de un recorrido\ncon varios tramos.' },
    { type: 'concept', text: 'Velocidad media = distancia total / tiempo total.\nNO es la media de las velocidades de cada tramo.' },
    { type: 'quiz', question: 'Si haces 100km en 1h y 100km en 2h,\n\u00bfla velocidad media es 75 km/h o 66.7 km/h?', options: ['75 km/h', '66.7 km/h'], correctIndex: 1, feedbackCorrect: '200km / 3h = 66.7. No es la media de 100 y 50.', feedbackWrong: 'Distancia total (200) / tiempo total (3) = 66.7 km/h.' },
    { type: 'build', title: 'Acumular totales', code: 'for (i = 0; i < n; i++) {\n    scanf("%f %f", &dist, &tiempo);\n    distTotal += dist;\n    timeTotal += tiempo;\n}', explanation: 'No guardes cada tramo. Solo acumula.' },
    { type: 'final', text: 'Velocidad media \u2260 media de velocidades.\nTrampa cl\u00e1sica de examen.' },
  ],

  'cuatro-cuadrados': [
    { type: 'intro', text: 'Encontrar todas las formas de escribir un n\u00famero\ncomo suma de 4 cuadrados.' },
    { type: 'concept', text: 'Usamos 3 bucles for (a, b, c).\nEl cuarto valor (d) se calcula directamente.' },
    { type: 'concept', text: 'Para no repetir combinaciones:\nb empieza en a, c empieza en b, d debe ser \u2265 c.' },
    { type: 'quiz', question: '\u00bfPor qu\u00e9 b empieza en a y no en 0?', options: ['Para ir m\u00e1s r\u00e1pido', 'Para no repetir combinaciones'], correctIndex: 1, feedbackCorrect: 'Si a=1,b=0 y a=0,b=1 son lo mismo. Evitamos duplicados.', feedbackWrong: 'Sin esa restricci\u00f3n, 0,1 y 1,0 ser\u00edan dos resultados iguales.' },
    { type: 'build', title: 'Los 3 for', code: 'for (a = 0; a*a <= n; a++)\n  for (b = a; a*a+b*b <= n; b++)\n    for (c = b; a*a+b*b+c*c <= n; c++) {\n      resto = n - a*a - b*b - c*c;\n      d = (int)(sqrtf(resto) + 0.5f);\n      if (d*d == resto && d >= c)\n        printf("%d %d %d %d\\n", a,b,c,d);\n    }', explanation: 'd se calcula, no se busca. Eso ahorra un bucle entero.' },
    { type: 'final', text: 'B\u00fasqueda con simetr\u00eda + c\u00e1lculo directo.\nEl ejercicio m\u00e1s dif\u00edcil del bloque.' },
  ],

  'cabe-agujero': [
    { type: 'intro', text: '\u00bfUn objeto cabe por un agujero?\nComparamos sus diagonales.' },
    { type: 'concept', text: 'Diagonal de un rect\u00e1ngulo = ra\u00edz de (lado\u00b2 + lado\u00b2).\nSi la diagonal del objeto \u2264 la del agujero, cabe.' },
    { type: 'quiz', question: '\u00bfC\u00f3mo se calcula la ra\u00edz cuadrada en C?', options: ['sqrt(x)', 'x^0.5', 'raiz(x)'], correctIndex: 0, feedbackCorrect: 'sqrtf() para floats. Necesitas #include <math.h>.', feedbackWrong: 'En C se usa sqrtf() de math.h.' },
    { type: 'build', title: 'Comparar diagonales', code: 'float diag_obj = sqrtf(w*w + h*h);\nfloat diag_aguj = sqrtf(W*W + H*H);\nif (diag_obj <= diag_aguj)\n    printf("CABE\\n");\nelse\n    printf("NO CABE\\n");', explanation: 'Dos ra\u00edces, una comparaci\u00f3n.' },
    { type: 'final', text: 'sqrt + comparaci\u00f3n.\nGeometr\u00eda simple pero importante para examen.' },
  ],

  'polares': [
    { type: 'intro', text: 'Convertir coordenadas (x, y) a polares (r, \u00e1ngulo).\nUsa atan2 que maneja todos los cuadrantes.' },
    { type: 'concept', text: 'atan2(y, x) devuelve el \u00e1ngulo en radianes.\nPara pasar a grados: multiplicar por 180/\u03c0.' },
    { type: 'quiz', question: 'atan2 recibe (y, x). \u00bfQu\u00e9 va primero?', options: ['x', 'y'], correctIndex: 1, feedbackCorrect: 'Primero y, luego x. Al rev\u00e9s de lo que esperas.', feedbackWrong: 'atan2(y, x). Primero la y.' },
    { type: 'build', title: 'El c\u00e1lculo completo', code: 'r = sqrtf(x*x + y*y);\ntheta = atan2f(y, x) * (180.0f / M_PI);\nif (theta < 0) theta += 360.0f;', explanation: 'Si el \u00e1ngulo sale negativo, se le suma 360.' },
    { type: 'final', text: 'atan2 simplifica mucho.\nSin \u00e9l habr\u00eda que tratar cada cuadrante por separado.' },
  ],

  'raiz-cuarta': [
    { type: 'intro', text: 'Calcular la ra\u00edz cuarta de un n\u00famero\naproximando paso a paso, sin usar pow ni sqrt.' },
    { type: 'concept', text: 'Buscas primero por unidades, luego por d\u00e9cimas, luego por cent\u00e9simas.\nCada paso afina m\u00e1s el resultado.' },
    { type: 'quiz', question: '\u00bfPor qu\u00e9 no empezar directamente por cent\u00e9simas?', options: ['Porque tardar\u00eda much\u00edsimo', 'Porque es m\u00e1s f\u00e1cil'], correctIndex: 0, feedbackCorrect: 'Ir de 0 a 100 de 0.01 en 0.01 = 10.000 pasos. Mejor por fases.', feedbackWrong: 'De 0.01 en 0.01 ser\u00edan miles de pasos. Por fases es mucho m\u00e1s r\u00e1pido.' },
    { type: 'build', title: '3 while encadenados', code: 'while ((x+1)*(x+1)*(x+1)*(x+1) <= n)\n    x += 1.0f;\nwhile ((x+0.1f)*(x+0.1f)*(x+0.1f)*(x+0.1f) <= n)\n    x += 0.1f;\nwhile ((x+0.01f)*(x+0.01f)*(x+0.01f)*(x+0.01f) <= n)\n    x += 0.01f;', explanation: 'Cada while avanza desde donde par\u00f3 el anterior.' },
    { type: 'final', text: 'Aproximaci\u00f3n sucesiva: grueso \u2192 fino \u2192 m\u00e1s fino.\nEjercicios tipo PR7.' },
  ],

  'centroide-poligono': [
    { type: 'intro', text: 'Calcular el centro de un pol\u00edgono\ndados sus v\u00e9rtices. Usa la f\u00f3rmula de Shoelace.' },
    { type: 'concept', text: 'Necesitas cerrar el pol\u00edgono:\nel \u00faltimo punto conecta con el primero.' },
    { type: 'quiz', question: 'Si tienes n v\u00e9rtices, \u00bfcu\u00e1ntos lados tiene el pol\u00edgono?', options: ['n-1', 'n'], correctIndex: 1, feedbackCorrect: 'n lados. El \u00faltimo conecta con el primero.', feedbackWrong: 'El lado que cierra el pol\u00edgono cuenta. Son n lados.' },
    { type: 'build', title: 'Cerrar y acumular', code: 'x[n] = x[0]; y[n] = y[0];\nfor (i = 0; i < n; i++) {\n    float cross = x[i]*y[i+1] - x[i+1]*y[i];\n    area += cross;\n    sumX += (x[i]+x[i+1]) * cross;\n    sumY += (y[i]+y[i+1]) * cross;\n}', explanation: 'cross es el producto cruzado de cada arista.' },
    { type: 'build', title: 'Calcular centroide', code: 'area = fabsf(area) / 2.0f;\nCx = sumX / (6 * area);\nCy = sumY / (6 * area);', explanation: 'El 6 en el denominador es parte de la f\u00f3rmula.' },
    { type: 'final', text: 'El ejercicio m\u00e1s completo de todos.\nArrays + bucle + f\u00f3rmula + cerrar pol\u00edgono.' },
  ],

};

export function getScreens(slug: string): Screen[] | null {
  return SCREENS[slug] ?? null;
}

// Practice data per exercise
export interface PracticeData {
  fillCode: string;      // level 1: code with ___ gaps
  fillAnswers: string[]; // correct values for gaps
  ghostCode: string;     // level 2: full solution as ghost
  starterCode: string;   // level 3: partial structure
}

export const PRACTICE_DATA: Record<string, PracticeData> = {
  'datos-personales': {
    fillCode: '#include <stdio.h>\n\nint main() {\n    char nombre[50];\n    int edad;\n    float altura;\n    scanf("___ ___ ___", nombre, ___ edad, ___ altura);\n    printf("Nombre: ___\\n", nombre);\n    printf("Edad: ___\\n", edad);\n    printf("Altura: ___ m\\n", altura);\n    return 0;\n}',
    fillAnswers: ['%s', '%d', '%f', '&', '&', '%s', '%d', '%.2f'],
    ghostCode: '#include <stdio.h>\n\nint main() {\n    char nombre[50];\n    int edad;\n    float altura;\n    scanf("%s %d %f", nombre, &edad, &altura);\n    printf("Nombre: %s\\n", nombre);\n    printf("Edad: %d\\n", edad);\n    printf("Altura: %.2f m\\n", altura);\n    return 0;\n}',
    starterCode: '#include <stdio.h>\n\nint main() {\n    // declara las variables\n\n    // lee los datos con scanf\n\n    // muestra los datos con printf\n\n    return 0;\n}',
  },
  'corriente': {
    fillCode: '#include <stdio.h>\n\nint main() {\n    float V, R, I;\n    scanf("%f %f", &V, &R);\n    if (R ___ 0.0f) {\n        printf("ERROR\\n");\n    } ___ {\n        I = V ___ R;\n        printf("___ A\\n", I);\n    }\n    return 0;\n}',
    fillAnswers: ['<=', 'else', '/', '%.2f'],
    ghostCode: '#include <stdio.h>\n\nint main() {\n    float V, R, I;\n    scanf("%f %f", &V, &R);\n    if (R <= 0.0f) {\n        printf("ERROR\\n");\n    } else {\n        I = V / R;\n        printf("%.2f A\\n", I);\n    }\n    return 0;\n}',
    starterCode: '#include <stdio.h>\n\nint main() {\n    float V, R, I;\n    scanf("%f %f", &V, &R);\n    // valida R antes de dividir\n\n    // calcula I = V / R\n\n    // muestra el resultado\n\n    return 0;\n}',
  },
  'patron-numeros': {
    fillCode: '#include <stdio.h>\n\nint main() {\n    int n, i;\n    scanf("___", &n);\n    for (i = ___; i ___ n; i++) {\n        if (i ___ 2 == 0) {\n            printf("%d PAR\\n", i);\n        } else {\n            printf("___\\n", i);\n        }\n    }\n    return 0;\n}',
    fillAnswers: ['%d', '1', '<=', '%', '%d'],
    ghostCode: '#include <stdio.h>\n\nint main() {\n    int n, i;\n    scanf("%d", &n);\n    for (i = 1; i <= n; i++) {\n        if (i % 2 == 0) {\n            printf("%d PAR\\n", i);\n        } else {\n            printf("%d\\n", i);\n        }\n    }\n    return 0;\n}',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int n, i;\n    scanf("%d", &n);\n    for (/* completa el bucle */) {\n        // comprueba si i es par\n        // imprime con o sin PAR\n    }\n    return 0;\n}',
  },
  'cambio-divisas': {
    fillCode: '#___ EUR_A_USD 1.08f\n#___ EUR_A_GBP 0.86f\n\n#include <stdio.h>\n\nint main() {\n    float euros;\n    scanf("___", &euros);\n    if (euros ___ 0.0f) {\n        printf("ERROR\\n");\n    } else {\n        printf("USD: ___\\n", euros ___ EUR_A_USD);\n    }\n    return 0;\n}',
    fillAnswers: ['define', 'define', '%f', '<=', '%.2f', '*'],
    ghostCode: '#define EUR_A_USD 1.08f\n#define EUR_A_GBP 0.86f\n#define EUR_A_JPY 162.50f\n\n#include <stdio.h>\n\nint main() {\n    float euros;\n    scanf("%f", &euros);\n    if (euros <= 0.0f) {\n        printf("ERROR\\n");\n    } else {\n        printf("USD: %.2f\\n", euros * EUR_A_USD);\n        printf("GBP: %.2f\\n", euros * EUR_A_GBP);\n        printf("JPY: %.2f\\n", euros * EUR_A_JPY);\n    }\n    return 0;\n}',
    starterCode: '#define EUR_A_USD 1.08f\n// a\u00f1ade las otras constantes\n\n#include <stdio.h>\n\nint main() {\n    float euros;\n    // lee euros\n    // valida\n    // calcula y muestra\n    return 0;\n}',
  },
  'ajuste-grados': {
    fillCode: '#include <stdio.h>\n\nint main() {\n    int angulo;\n    scanf("%d", &angulo);\n    while (angulo ___ 0) {\n        angulo ___ 360;\n    }\n    angulo = angulo ___ 360;\n    printf("%d\\n", angulo);\n    return 0;\n}',
    fillAnswers: ['<', '+=', '%'],
    ghostCode: '#include <stdio.h>\n\nint main() {\n    int angulo;\n    scanf("%d", &angulo);\n    while (angulo < 0) {\n        angulo += 360;\n    }\n    angulo = angulo % 360;\n    printf("%d\\n", angulo);\n    return 0;\n}',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int angulo;\n    scanf("%d", &angulo);\n    // corrige negativos con while\n\n    // aplica m\u00f3dulo\n\n    printf("%d\\n", angulo);\n    return 0;\n}',
  },
};

// Auto-generate fill code from solution: replace key patterns with ___
// maxGaps prevents overwhelming the user on complex exercises
function autoFill(code: string, maxGaps = 8): { codeWithGaps: string; answers: string[] } {
  const answers: string[] = [];
  let result = code;
  const canAdd = () => answers.length < maxGaps;

  // 1. Format specifiers: %d, %f, %s, %.2f etc.
  result = result.replace(/%(\.?\d*)[dfs]/g, (match) => {
    if (canAdd()) { answers.push(match); return '___'; }
    return match;
  });

  // 2. Comparison operators: <=, >=, !=, ==
  result = result.replace(/(\s)(<=|>=|!=|==)(\s)/g, (full, pre, op, post) => {
    if (canAdd()) { answers.push(op); return `${pre}___${post}`; }
    return full;
  });

  // 3. && and ||
  result = result.replace(/(\s)(\|\||&&)(\s)/g, (full, pre, op, post) => {
    if (canAdd()) { answers.push(op); return `${pre}___${post}`; }
    return full;
  });

  // 4. Modulo operator (n % 2, not printf %d)
  result = result.replace(/(\w)\s%\s(\d+)/g, (full, before, num) => {
    if (canAdd()) { answers.push(`% ${num}`); return `${before} ___ `; }
    return full;
  });

  // 5. += and -=
  result = result.replace(/(\s)(\+=|-=)(\s)/g, (full, pre, op, post) => {
    if (canAdd()) { answers.push(op); return `${pre}___${post}`; }
    return full;
  });

  // If too few gaps (< 2), also replace the first return value or key number
  if (answers.length < 2) {
    result = result.replace(/return (\d+);/, (full, val) => {
      answers.push(val);
      return 'return ___;';
    });
  }

  return { codeWithGaps: result, answers };
}

// Auto-generate starter code: keep structure, replace body with comments
function autoStarter(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let inBody = false;
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#include') || trimmed.startsWith('#define') || trimmed === '' || trimmed === 'return 0;' || trimmed === '}') {
      result.push(line);
      if (trimmed.includes('{')) braceDepth++;
      if (trimmed.includes('}')) braceDepth--;
      continue;
    }
    if (trimmed.startsWith('int main') || trimmed.startsWith('float ') || trimmed.startsWith('int ') || trimmed.startsWith('char ')) {
      if (braceDepth <= 1) { result.push(line); if (trimmed.includes('{')) braceDepth++; continue; }
    }
    if (trimmed.includes('{')) braceDepth++;
    if (trimmed.includes('}')) braceDepth--;
    if (!inBody && braceDepth >= 1) {
      result.push('    // escribe la l\u00f3gica aqu\u00ed');
      inBody = true;
    }
  }
  return result.join('\n');
}

// Build practice screens for a specific level
export function buildPracticeScreens(exercise: {
  slug: string;
  title: string;
  pattern: string;
  commonMistakes: string[];
  solutionCode: string;
}, level: PracticeLevel): Screen[] {
  const data = PRACTICE_DATA[exercise.slug];
  const intro: Screen = { type: 'intro', text: `Ahora t\u00fa.\nRecuerda: ${exercise.pattern.toLowerCase().slice(0, 60)}` };

  // Manual data available — use it
  if (data) {
    switch (level) {
      case 1: return [intro, { type: 'fill', title: 'Completa los huecos', codeWithGaps: data.fillCode, answers: data.fillAnswers }, { type: 'final', text: 'Bien. Cada hueco que rellenas te acerca m\u00e1s.' }];
      case 2: return [intro, { type: 'ghost', title: 'Escribe sobre la gu\u00eda', ghostCode: data.ghostCode }, { type: 'final', text: 'Vas cogiendo soltura.' }];
      case 3: return [intro, { type: 'partial', title: 'Completa la l\u00f3gica', starterCode: data.starterCode }, { type: 'final', text: 'Cada vez necesitas menos ayuda.' }];
      case 4: return [intro, { type: 'code', prompt: 'Escr\u00edbelo desde cero.' }, { type: 'final', text: 'Lo has hecho t\u00fa solo.' }];
    }
  }

  // Auto-generate from solutionCode
  switch (level) {
    case 1: {
      const { codeWithGaps, answers } = autoFill(exercise.solutionCode);
      return [intro, { type: 'fill', title: 'Completa los huecos', codeWithGaps, answers }, { type: 'final', text: 'Bien. Ya reconoces las piezas.' }];
    }
    case 2:
      return [intro, { type: 'ghost', title: 'Escribe sobre la gu\u00eda', ghostCode: exercise.solutionCode }, { type: 'final', text: 'Vas cogiendo soltura.' }];
    case 3: {
      const starter = autoStarter(exercise.solutionCode);
      return [intro, { type: 'partial', title: 'Completa la l\u00f3gica', starterCode: starter }, { type: 'final', text: 'Cada vez necesitas menos ayuda.' }];
    }
    case 4:
      return [intro, { type: 'code', prompt: 'Escr\u00edbelo desde cero.' }, { type: 'final', text: 'Lo has hecho t\u00fa solo.' }];
  }
}
