import { Exercise } from './types';

export const EXERCISES: Exercise[] = [
  // ─────────────────────────────────────────────
  // BLOQUE 1 — Entrada, salida y variables
  // ─────────────────────────────────────────────
  {
    slug: 'datos-personales',
    title: 'Datos personales (calentamiento)',
    blockId: 1,
    difficulty: 1,
    sourceType: 'real',
    sourceRef: 'PR2',
    concepts: ['printf', 'scanf', '%d', '%f', '%s', 'variables'],
    pattern: 'Leer datos → Imprimir con formato',
    patternSteps: [
      'Declarar variables del tipo correcto',
      'Leer cada dato con scanf y su especificador correcto',
      'Imprimir cada dato con printf y el formato pedido',
    ],
    commonMistakes: [
      'Olvidar & en scanf para int y float',
      'Usar %d para float (debe ser %f)',
      'Poner & delante de un array de char en scanf (no se debe)',
      'Olvidar \\n al final del printf',
    ],
    statement: `[CALENTAMIENTO — Si ya dominas scanf y printf, salta al siguiente]

Escribe un programa que lea el nombre (una palabra), la edad y la altura (en metros) de una persona, y los muestre por pantalla con el siguiente formato exacto:

Nombre: Ana
Edad: 21
Altura: 1.65 m`,
    inputSpec: 'Una cadena sin espacios, un entero y un float.',
    outputSpec: 'Tres líneas con etiqueta y valor.',
    exampleInput: 'Ana 21 1.65',
    exampleOutput: 'Nombre: Ana\nEdad: 21\nAltura: 1.65 m',
    pseudocode: `INICIO
  Declarar nombre[50], edad (int), altura (float)
  Leer nombre, edad, altura
  Imprimir "Nombre: " + nombre
  Imprimir "Edad: " + edad
  Imprimir "Altura: " + altura + " m"
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    char nombre[50];
    int edad;
    float altura;

    scanf("%s %d %f", nombre, &edad, &altura);

    printf("Nombre: %s\\n", nombre);
    printf("Edad: %d\\n", edad);
    printf("Altura: %.2f m\\n", altura);

    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Tres tipos distintos de variable: char[] para texto, int para entero, float para decimal. Cada uno tiene su especificador: %s, %d, %f. En scanf, todos llevan & excepto los arrays de char.' },
      { level: 2, label: 'Estructura mental', content: '3 fases: declarar → leer con scanf → imprimir con printf.\nNo hay cálculos ni condiciones. Sólo E/S con formato.\nRecuerda: %.2f muestra 2 decimales.' },
      { level: 3, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    char nombre[50];\n    int edad;\n    float altura;\n    scanf(/* especificadores y & donde toque */);\n    printf("Nombre: %s\\n", nombre);\n    printf("Edad: ___\\n", ___);\n    printf("Altura: ___ m\\n", ___);\n    return 0;\n}' },
    ],
    estimatedMinutes: 5,
    tags: ['scanf', 'printf', 'variables', 'tipos', 'calentamiento'],
  },

  {
    slug: 'angulo-cuadrante',
    title: 'Ángulo y cuadrante',
    blockId: 1,
    difficulty: 2,
    sourceType: 'real',
    sourceRef: 'PR2',
    concepts: ['scanf', 'printf', 'if/else', 'rangos', 'módulo'],
    pattern: 'Leer → Validar rango → Decidir caso → Imprimir',
    patternSteps: [
      'Leer el ángulo',
      'Validar que esté en [0, 360]',
      'Comprobar si está sobre un eje (0, 90, 180, 270, 360)',
      'Si no está en eje, determinar cuadrante por rango',
      'Imprimir resultado',
    ],
    commonMistakes: [
      'Comprobar cuadrante antes de comprobar si está en un eje',
      'No tratar 360 como equivalente a 0',
      'Olvidar los casos de 0, 90, 180, 270',
      'Usar rangos incorrectos: el primer cuadrante es (0,90), no [0,90]',
    ],
    statement: `Lee un ángulo en grados (entero, entre 0 y 360 inclusive). Indica si está sobre un eje o en qué cuadrante se encuentra.

Salida esperada:
- "Eje X positivo" si el ángulo es 0 o 360
- "Cuadrante I" si está en (0, 90)
- "Eje Y positivo" si es 90
- "Cuadrante II" si está en (90, 180)
- "Eje X negativo" si es 180
- "Cuadrante III" si está en (180, 270)
- "Eje Y negativo" si es 270
- "Cuadrante IV" si está en (270, 360)
- "ERROR" si el ángulo no está en [0, 360]`,
    inputSpec: 'Un entero entre 0 y 360.',
    outputSpec: 'Una línea con el cuadrante o eje.',
    exampleInput: '135',
    exampleOutput: 'Cuadrante II',
    pseudocode: `INICIO
  Leer angulo
  SI angulo < 0 O angulo > 360 → imprimir "ERROR"
  SI angulo == 0 O angulo == 360 → "Eje X positivo"
  SI angulo == 90 → "Eje Y positivo"
  SI angulo == 180 → "Eje X negativo"
  SI angulo == 270 → "Eje Y negativo"
  SI angulo < 90 → "Cuadrante I"
  SI angulo < 180 → "Cuadrante II"
  SI angulo < 270 → "Cuadrante III"
  SI NO → "Cuadrante IV"
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int angulo;
    scanf("%d", &angulo);

    if (angulo < 0 || angulo > 360) {
        printf("ERROR\\n");
    } else if (angulo == 0 || angulo == 360) {
        printf("Eje X positivo\\n");
    } else if (angulo == 90) {
        printf("Eje Y positivo\\n");
    } else if (angulo == 180) {
        printf("Eje X negativo\\n");
    } else if (angulo == 270) {
        printf("Eje Y negativo\\n");
    } else if (angulo < 90) {
        printf("Cuadrante I\\n");
    } else if (angulo < 180) {
        printf("Cuadrante II\\n");
    } else if (angulo < 270) {
        printf("Cuadrante III\\n");
    } else {
        printf("Cuadrante IV\\n");
    }

    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Usa if / else if / else. El orden de las comprobaciones importa: hay que tratar primero la validación y los valores exactos (ejes), y solo después los rangos (cuadrantes).' },
      { level: 2, label: 'Estructura mental', content: 'Hay 3 tipos de caso y deben ir en este orden:\n1) Fuera de rango [0, 360] → ERROR\n2) Valores exactos: 0/360, 90, 180, 270 → nombre de eje\n3) Rangos: <90, <180, <270, resto → cuadrante\nSi compruebas rangos antes que ejes, el eje 90 caería en "Cuadrante I".' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer angulo\nSI angulo < 0 O angulo > 360 → ERROR\nSI NO SI angulo es 0 o 360 → Eje X positivo\nSI NO SI angulo es 90 → Eje Y positivo\nSI NO SI angulo es 180 → Eje X negativo\nSI NO SI angulo es 270 → Eje Y negativo\nSI NO SI angulo < 90 → Cuadrante I\nSI NO SI angulo < 180 → Cuadrante II\nSI NO SI angulo < 270 → Cuadrante III\nSI NO → Cuadrante IV' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int angulo;\n    scanf("%d", &angulo);\n    if (/* fuera de rango */) {\n        printf("ERROR\\n");\n    } else if (/* eje X positivo: dos valores */) {\n        printf("Eje X positivo\\n");\n    } else if (/* completar los 3 ejes restantes */) {\n        ...\n    } else if (angulo < 90) {\n        printf("Cuadrante I\\n");\n    } /* completar cuadrantes II, III, IV */\n    return 0;\n}' },
    ],
    estimatedMinutes: 15,
    tags: ['if/else', 'rangos', 'cuadrantes', 'validación'],
  },

  {
    slug: 'aceleracion-normal',
    title: 'Aceleración centrípeta',
    blockId: 1,
    difficulty: 2,
    sourceType: 'real',
    sourceRef: 'PR3',
    concepts: ['float', 'scanf', 'printf', 'fórmula', '%.2f'],
    pattern: 'Leer datos → Calcular fórmula → Imprimir con formato',
    patternSteps: [
      'Declarar variables float para velocidad angular y radio',
      'Leer con scanf',
      'Calcular: aceleracion = omega * omega * radio',
      'Imprimir con 2 decimales',
    ],
    commonMistakes: [
      'Usar int en vez de float',
      'Calcular omega^2 como omega^2 con ^ (en C no existe, usar omega*omega)',
      'Olvidar %.2f en el printf',
    ],
    statement: `La aceleración normal (centrípeta) se calcula con:
  a = ω² × r

Donde ω es la velocidad angular (rad/s) y r es el radio (m).

Lee ω y r, calcula la aceleración y muéstrala con 2 decimales.

Ejemplo: ω=3.0, r=2.0 → a = 18.00 m/s²`,
    inputSpec: 'Dos floats: omega y radio.',
    outputSpec: 'Una línea: "Aceleracion: X.XX m/s2"',
    exampleInput: '3.0 2.0',
    exampleOutput: 'Aceleracion: 18.00 m/s2',
    pseudocode: `INICIO
  Declarar omega, radio, aceleracion (float)
  Leer omega, radio
  aceleracion = omega * omega * radio
  Imprimir "Aceleracion: " + aceleracion (2 decimales) + " m/s2"
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    float omega, radio, aceleracion;
    scanf("%f %f", &omega, &radio);
    aceleracion = omega * omega * radio;
    printf("Aceleracion: %.2f m/s2\\n", aceleracion);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Variables tipo float. La fórmula es a = ω²·r. En C no existe el operador ^ para potencias; para elevar al cuadrado multiplica la variable por sí misma.' },
      { level: 2, label: 'Estructura mental', content: 'Programa secuencial de 3 pasos:\n1) Declarar variables float\n2) Leer omega y radio con scanf\n3) Calcular la fórmula y mostrar con 2 decimales\nNo hay condiciones ni bucles.' },
      { level: 3, label: 'Pseudocódigo', content: 'Declarar omega, radio, aceleracion (reales)\nLeer omega y radio\naceleracion = omega × omega × radio\nImprimir aceleracion con 2 decimales y unidades' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    float omega, radio, aceleracion;\n    scanf(/* leer dos floats */);\n    aceleracion = /* fórmula a = ω² × r */;\n    printf("Aceleracion: %.2f m/s2\\n", /* ¿qué variable? */);\n    return 0;\n}' },
    ],
    estimatedMinutes: 10,
    tags: ['float', 'fórmula', 'printf', 'precisión'],
  },

  {
    slug: 'calificacion',
    title: 'Calificación ponderada',
    blockId: 1,
    difficulty: 2,
    sourceType: 'real',
    sourceRef: 'PR3',
    concepts: ['float', 'scanf', 'printf', 'fórmula ponderada', '%.1f'],
    pattern: 'Leer múltiples valores → Calcular fórmula ponderada → Imprimir',
    patternSteps: [
      'Leer nota de examen, nota de hitos y nota de autoevaluación',
      'Aplicar pesos: 60% examen, 30% hitos, 10% autoevaluación',
      'Calcular: nota = 0.6*examen + 0.3*hitos + 0.1*auto',
      'Imprimir con 1 decimal',
    ],
    commonMistakes: [
      'Sumar porcentajes que no dan 100',
      'Usar enteros en vez de floats para las notas',
      'Dividir entre 100 cuando ya se usó 0.6 (doble división)',
    ],
    statement: `La nota final de programación se calcula así:
  nota = 0.6 × examen + 0.3 × hitos + 0.1 × autoevaluación

Lee las tres notas (de 0 a 10) y muestra la nota final con 1 decimal.`,
    inputSpec: 'Tres floats: examen, hitos, autoevaluación.',
    outputSpec: '"Nota final: X.X"',
    exampleInput: '7.5 8.0 9.0',
    exampleOutput: 'Nota final: 7.8',
    pseudocode: `INICIO
  Declarar examen, hitos, auto, nota (float)
  Leer examen, hitos, auto
  nota = 0.6*examen + 0.3*hitos + 0.1*auto
  Imprimir "Nota final: " + nota (1 decimal)
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    float examen, hitos, autoeval, nota;
    scanf("%f %f %f", &examen, &hitos, &autoeval);
    nota = 0.6f * examen + 0.3f * hitos + 0.1f * autoeval;
    printf("Nota final: %.1f\\n", nota);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Necesitas float para las notas. La fórmula pondera cada nota con un peso distinto. Los pesos deben sumar 1.0. Usa %.1f para mostrar con 1 decimal.' },
      { level: 2, label: 'Estructura mental', content: 'Programa secuencial:\n1) Declarar 4 floats (3 notas + resultado)\n2) Leer las 3 notas\n3) Aplicar: nota = peso1×nota1 + peso2×nota2 + peso3×nota3\n4) Imprimir con 1 decimal\nVerifica: 0.6 + 0.3 + 0.1 = 1.0.' },
      { level: 3, label: 'Pseudocódigo', content: 'Declarar examen, hitos, auto, nota (reales)\nLeer examen, hitos, auto\nnota = 0.6 × examen + 0.3 × hitos + 0.1 × auto\nImprimir "Nota final: " + nota (1 decimal)' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    float examen, hitos, autoeval, nota;\n    scanf(/* leer 3 floats */);\n    nota = /* suma ponderada con pesos 0.6, 0.3, 0.1 */;\n    printf("Nota final: %.1f\\n", nota);\n    return 0;\n}' },
    ],
    estimatedMinutes: 10,
    tags: ['float', 'fórmula', 'ponderación'],
  },

  // ─────────────────────────────────────────────
  // BLOQUE 2 — Condicionales y validación
  // ─────────────────────────────────────────────
  {
    slug: 'cambio-divisas',
    title: 'Cambio de divisas con #define',
    blockId: 2,
    difficulty: 2,
    sourceType: 'real',
    sourceRef: 'PR2',
    concepts: ['#define', 'float', 'scanf', 'printf', 'if/else', 'constantes'],
    pattern: 'Definir constantes → Leer → Validar → Convertir con constantes → Imprimir',
    patternSteps: [
      'Definir constantes de conversión con #define',
      'Leer la cantidad en euros',
      'Validar que sea positiva',
      'Multiplicar por cada constante para obtener las otras monedas',
      'Imprimir cada resultado con 2 decimales',
    ],
    commonMistakes: [
      'Poner ; al final del #define (no lleva)',
      'Usar variables en lugar de #define para constantes fijas',
      'Validar con == 0 pero no con < 0',
      'Olvidar que #define va FUERA de main, sin ; al final',
    ],
    statement: `Define estas constantes de conversión con #define:
  EUR_A_USD  1.08
  EUR_A_GBP  0.86
  EUR_A_JPY  162.50

Lee una cantidad en euros. Si es ≤ 0, imprime "ERROR".
Si no, convierte a dólares, libras y yenes, mostrando cada resultado con 2 decimales.

Ejemplo:
  Euros: 100.00
  USD: 108.00
  GBP: 86.00
  JPY: 16250.00`,
    inputSpec: 'Un float: cantidad en euros.',
    outputSpec: 'Tres líneas con conversiones o "ERROR".',
    exampleInput: '100.0',
    exampleOutput: 'USD: 108.00\nGBP: 86.00\nJPY: 16250.00',
    pseudocode: `DEFINIR EUR_A_USD = 1.08
DEFINIR EUR_A_GBP = 0.86
DEFINIR EUR_A_JPY = 162.50

INICIO
  Leer euros
  SI euros ≤ 0 → "ERROR"
  SI NO:
    Imprimir euros × EUR_A_USD
    Imprimir euros × EUR_A_GBP
    Imprimir euros × EUR_A_JPY
FIN`,
    solutionCode: `#include <stdio.h>

#define EUR_A_USD 1.08f
#define EUR_A_GBP 0.86f
#define EUR_A_JPY 162.50f

int main() {
    float euros;
    scanf("%f", &euros);
    if (euros <= 0.0f) {
        printf("ERROR\\n");
    } else {
        printf("USD: %.2f\\n", euros * EUR_A_USD);
        printf("GBP: %.2f\\n", euros * EUR_A_GBP);
        printf("JPY: %.2f\\n", euros * EUR_A_JPY);
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: '#define crea constantes que se sustituyen antes de compilar. Van FUERA de main, SIN punto y coma al final. Luego se usan como si fueran números dentro del programa.' },
      { level: 2, label: 'Estructura mental', content: '1) Definir 3 constantes con #define (antes de main)\n2) Leer euros\n3) Validar: euros ≤ 0 → ERROR\n4) Si válido: multiplicar euros por cada constante\n5) Imprimir con 2 decimales\nDiferencia con el ejercicio de Ohm: aquí el foco es usar #define, no solo if/else.' },
      { level: 3, label: 'Pseudocódigo', content: 'DEFINIR constantes de conversión\nLeer euros\nSI euros ≤ 0 → "ERROR"\nSI NO:\n  Imprimir "USD: " + euros × EUR_A_USD (2 decimales)\n  Imprimir "GBP: " + euros × EUR_A_GBP (2 decimales)\n  Imprimir "JPY: " + euros × EUR_A_JPY (2 decimales)' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n\n#define EUR_A_USD /* ¿valor? */\n#define EUR_A_GBP /* ¿valor? */\n#define EUR_A_JPY /* ¿valor? */\n\nint main() {\n    float euros;\n    scanf("%f", &euros);\n    if (/* ¿validación? */) {\n        printf("ERROR\\n");\n    } else {\n        printf("USD: %.2f\\n", /* ¿operación? */);\n        printf("GBP: %.2f\\n", /* ¿operación? */);\n        printf("JPY: %.2f\\n", /* ¿operación? */);\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 12,
    tags: ['#define', 'constantes', 'if/else', 'validación', 'float'],
  },

  {
    slug: 'ajuste-grados',
    title: 'Ajuste de ángulo',
    blockId: 2,
    difficulty: 3,
    sourceType: 'real',
    sourceRef: 'PR4',
    concepts: ['if', 'módulo %', 'negativos', 'int'],
    pattern: 'Leer → Corregir negativos → Aplicar módulo → Imprimir',
    patternSteps: [
      'Leer el ángulo (puede ser negativo o mayor de 360)',
      'Mientras sea negativo, sumar 360',
      'Aplicar módulo 360 para reducir al rango [0, 359]',
      'Imprimir el ángulo ajustado',
    ],
    commonMistakes: [
      'El operador % en C con negativos da resultado negativo',
      'Confiar solo en % sin corregir antes los negativos',
      'No tratar el caso de ángulo == 360 (debe quedar 0)',
    ],
    statement: `Lee un ángulo entero (puede ser negativo o mayor de 360). Ajústalo para que quede en el rango [0, 359].

Reglas:
- Usa módulo 360 para reducirlo
- Si el ángulo es negativo, corrígelo antes del módulo

Ejemplos:
- 370 → 10
- -90 → 270
- 360 → 0
- 45 → 45`,
    inputSpec: 'Un entero, posiblemente negativo o > 360.',
    outputSpec: 'Un entero en [0, 359].',
    exampleInput: '-90',
    exampleOutput: '270',
    pseudocode: `INICIO
  Leer angulo
  MIENTRAS angulo < 0:
    angulo = angulo + 360
  angulo = angulo % 360
  Imprimir angulo
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int angulo;
    scanf("%d", &angulo);
    while (angulo < 0) {
        angulo += 360;
    }
    angulo = angulo % 360;
    printf("%d\\n", angulo);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Operador módulo (%). Trampa clave: en C, el módulo de un número negativo da resultado negativo (-90 % 360 = -90, no 270). Necesitas corregir los negativos ANTES de aplicar el módulo.' },
      { level: 2, label: 'Estructura mental', content: 'Dos pasos:\n1) Si el ángulo es negativo, sumarle 360 repetidamente hasta que sea ≥ 0 (esto necesita un bucle)\n2) Aplicar módulo 360 para reducir valores ≥ 360\nEjemplo: -90 → +270 (paso 1) → 270 (paso 2). Ejemplo: 730 → 730 (paso 1, no es negativo) → 10 (paso 2).' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer angulo\nMIENTRAS angulo < 0:\n  angulo = angulo + 360\nangulo = angulo MÓDULO 360\nImprimir angulo' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int angulo;\n    scanf("%d", &angulo);\n    while (/* ¿cuándo hay que seguir sumando? */) {\n        angulo += 360;\n    }\n    angulo = /* aplicar módulo */;\n    printf("%d\\n", angulo);\n    return 0;\n}' },
    ],
    estimatedMinutes: 15,
    tags: ['módulo', 'negativos', 'while', 'ángulos'],
  },

  {
    slug: 'corriente',
    title: 'Ley de Ohm',
    blockId: 2,
    difficulty: 2,
    sourceType: 'real',
    sourceRef: 'PR4',
    concepts: ['float', 'if/else', 'validación', 'división'],
    pattern: 'Leer → Validar condición → Calcular → Imprimir',
    patternSteps: [
      'Leer tensión (V) y resistencia (R)',
      'Validar que R > 0 (no dividir entre cero)',
      'Calcular corriente: I = V / R',
      'Imprimir con 2 decimales, o ERROR si R <= 0',
    ],
    commonMistakes: [
      'No validar R > 0',
      'Usar int en vez de float',
      'Poner el cálculo antes del if de validación',
    ],
    statement: `Lee la tensión V (en voltios) y la resistencia R (en ohmios). Calcula la corriente I = V / R.

Si R es 0 o negativa, imprime "ERROR".
Si no, imprime la corriente con 2 decimales seguida de " A".`,
    inputSpec: 'Dos floats: V y R.',
    outputSpec: '"X.XX A" o "ERROR"',
    exampleInput: '12.0 4.0',
    exampleOutput: '3.00 A',
    pseudocode: `INICIO
  Leer V, R (float)
  SI R <= 0 → imprimir "ERROR"
  SI NO
    I = V / R
    Imprimir I + " A"
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    float V, R, I;
    scanf("%f %f", &V, &R);
    if (R <= 0.0f) {
        printf("ERROR\\n");
    } else {
        I = V / R;
        printf("%.2f A\\n", I);
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Ley de Ohm: I = V / R. Necesitas float e if/else. Piensa: ¿qué pasa si R es 0 o negativa? Hay que validar antes de dividir.' },
      { level: 2, label: 'Estructura mental', content: '1) Leer V y R\n2) Validar: si R ≤ 0 → ERROR (evitar división por cero)\n3) Si válido: calcular corriente I = V / R\n4) Imprimir I con 2 decimales y unidad " A"' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer V, R\nSI R ≤ 0 → imprimir "ERROR"\nSI NO:\n  I = V / R\n  Imprimir I con 2 decimales y " A"' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    float V, R, I;\n    scanf("%f %f", &V, &R);\n    if (/* condición de error */) {\n        printf("ERROR\\n");\n    } else {\n        I = /* fórmula de Ohm */;\n        printf(/* resultado con 2 decimales y " A" */);\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 12,
    tags: ['if/else', 'validación', 'float', 'división'],
  },

  {
    slug: 'tanque',
    title: 'Volumen del tanque',
    blockId: 2,
    difficulty: 3,
    sourceType: 'real',
    sourceRef: 'PR4',
    concepts: ['float', 'if/else', 'validación múltiple', 'fórmula'],
    pattern: 'Leer múltiples datos → Validar todos → Calcular → Imprimir o ERROR',
    patternSteps: [
      'Leer radio y altura del cilindro',
      'Validar que radio > 0 Y altura > 0',
      'Calcular volumen: V = π × r² × h',
      'Imprimir volumen con 2 decimales, o ERROR si algún dato es inválido',
    ],
    commonMistakes: [
      'Validar solo un parámetro y olvidar el otro',
      'Usar 3.14 en vez de la constante M_PI o 3.14159265',
      'No usar && para combinar las dos condiciones de error',
    ],
    statement: `Un tanque cilíndrico tiene radio r y altura h. Calcula su volumen:
  V = π × r² × h

Lee r y h. Si alguno es ≤ 0, imprime "ERROR". Si no, imprime el volumen con 2 decimales.`,
    inputSpec: 'Dos floats: radio r y altura h.',
    outputSpec: '"Volumen: X.XX" o "ERROR"',
    exampleInput: '2.0 5.0',
    exampleOutput: 'Volumen: 62.83',
    pseudocode: `INICIO
  Leer r, h (float)
  SI r <= 0 O h <= 0 → "ERROR"
  SI NO
    V = 3.14159265 * r * r * h
    Imprimir "Volumen: " + V (2 decimales)
FIN`,
    solutionCode: `#include <stdio.h>
#define PI 3.14159265f

int main() {
    float r, h, V;
    scanf("%f %f", &r, &h);
    if (r <= 0.0f || h <= 0.0f) {
        printf("ERROR\\n");
    } else {
        V = PI * r * r * h;
        printf("Volumen: %.2f\\n", V);
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Fórmula del cilindro: V = π × r² × h. Necesitas validar DOS parámetros: si alguno es ≤ 0, no tiene sentido físico. Usa #define para la constante PI o escribe el valor directamente.' },
      { level: 2, label: 'Estructura mental', content: '1) Leer radio y altura\n2) Validar: si r ≤ 0 O h ≤ 0 → ERROR (necesitas ||)\n3) Si válidos: V = PI × r × r × h (recuerda: r² = r×r)\n4) Imprimir con 2 decimales\nLa validación combina dos condiciones con OR.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer r, h\nSI r ≤ 0 O h ≤ 0 → imprimir "ERROR"\nSI NO:\n  V = 3.14159 × r × r × h\n  Imprimir "Volumen: " + V (2 decimales)' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n#define PI 3.14159265f\nint main() {\n    float r, h, V;\n    scanf("%f %f", &r, &h);\n    if (/* ¿ambas condiciones de error con ||? */) {\n        printf("ERROR\\n");\n    } else {\n        V = /* fórmula del cilindro */;\n        printf("Volumen: %.2f\\n", V);\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 15,
    tags: ['validación múltiple', 'if/else', 'fórmula', '||'],
  },

  {
    slug: 'doble-par',
    title: 'Clasificar número par/doble par',
    blockId: 2,
    difficulty: 2,
    sourceType: 'real',
    sourceRef: 'PR4',
    concepts: ['int', 'if/else if', 'módulo %', 'condiciones'],
    pattern: 'Leer → Clasificar con módulo → Imprimir categoría',
    patternSteps: [
      'Leer un entero',
      'Comprobar si es divisible por 4 (doble par)',
      'Si no, comprobar si es divisible por 2 (par)',
      'Si no, es impar',
    ],
    commonMistakes: [
      'Comprobar %2==0 antes de %4==0 (si %4, ya sabemos que %2 también)',
      'No usar else if (puede entrar en varios casos)',
    ],
    statement: `Lee un entero y clasifícalo:
- Si es divisible por 4: "Doble par"
- Si es divisible por 2 pero no por 4: "Par"
- Si no es divisible por 2: "Impar"`,
    inputSpec: 'Un entero.',
    outputSpec: '"Doble par", "Par" o "Impar"',
    exampleInput: '12',
    exampleOutput: 'Doble par',
    pseudocode: `INICIO
  Leer n
  SI n % 4 == 0 → "Doble par"
  SI NO SI n % 2 == 0 → "Par"
  SI NO → "Impar"
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    if (n % 4 == 0) {
        printf("Doble par\\n");
    } else if (n % 2 == 0) {
        printf("Par\\n");
    } else {
        printf("Impar\\n");
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Operador módulo %. Divisible por 4 implica divisible por 2, así que el orden de las comprobaciones importa. Piensa cuál debes comprobar primero para que no se "trague" el otro caso.' },
      { level: 2, label: 'Estructura mental', content: 'El truco es el orden:\n1) Primero comprobar %4 (más restrictivo)\n2) Luego %2 (menos restrictivo, pero con else if no entra si ya era %4)\n3) else: impar\nSi compruebas %2 primero, el 12 entraría en "Par" y nunca llegaría a "Doble par".' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nSI n es divisible por 4 → "Doble par"\nSI NO SI n es divisible por 2 → "Par"\nSI NO → "Impar"' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    if (/* ¿divisible por qué primero? */) {\n        printf("Doble par\\n");\n    } else if (/* ¿divisible por qué? */) {\n        printf("Par\\n");\n    } else {\n        printf("Impar\\n");\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 10,
    tags: ['módulo', 'if/else if', 'clasificar'],
  },

  {
    slug: 'eleva-signo',
    title: 'Potencia de (-1) sin pow',
    blockId: 2,
    difficulty: 2,
    sourceType: 'real',
    sourceRef: 'PR5/Eleva1PR',
    concepts: ['if/else', 'paridad', 'módulo %', 'int'],
    pattern: 'Leer exponente → comprobar paridad → decidir resultado',
    patternSteps: [
      'Leer n (entero, puede ser negativo)',
      'Si n es par: resultado es 1',
      'Si n es impar: resultado es -1',
      'Imprimir resultado',
    ],
    commonMistakes: [
      'Intentar usar pow(-1, n) — no permitido, y con float puede dar errores de precisión',
      'Multiplicar -1 * -1 * ... en un bucle (funciona pero es innecesario)',
      'No tratar n negativo: -3 % 2 en C da -1, no 1. Hay que usar el valor absoluto o comprobar != 0',
      'Confundir el resultado: par→1, impar→-1 (no al revés)',
    ],
    statement: `Calcula (-1)^n SIN usar la función pow().

Lee un entero n (puede ser negativo). Imprime el resultado:
- Si n es par → 1
- Si n es impar → -1

La clave: (-1) elevado a un número par siempre da 1, y a un impar siempre da -1.

Ejemplo: n=5 → -1
Ejemplo: n=4 → 1
Ejemplo: n=-3 → -1
Ejemplo: n=0 → 1`,
    inputSpec: 'Un entero (puede ser negativo).',
    outputSpec: '"1" o "-1"',
    exampleInput: '5',
    exampleOutput: '-1',
    pseudocode: `INICIO
  Leer n
  SI n es par (n % 2 == 0):
    Imprimir 1
  SI NO:
    Imprimir -1
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    if (n % 2 == 0) {
        printf("1\\n");
    } else {
        printf("-1\\n");
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'No necesitas calcular la potencia real. Solo necesitas saber si n es par o impar. (-1) elevado a par = 1, elevado a impar = -1. Esto es un ejercicio de paridad, no de potencias.' },
      { level: 2, label: 'Estructura mental', content: 'El programa entero es un if/else:\n- Si n%2 == 0 → imprimir 1\n- Si no → imprimir -1\nTrampa: con n negativo, n%2 puede dar -1 en C (no 1). Pero la condición n%2==0 sigue funcionando porque 0==0. Para impar basta con que NO sea 0.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nSI n MÓDULO 2 es 0 → Imprimir 1\nSI NO → Imprimir -1' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    if (/* ¿cómo comprobar paridad? */) {\n        printf("1\\n");\n    } else {\n        printf("-1\\n");\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 8,
    tags: ['paridad', 'módulo', 'if/else', 'sin pow'],
  },

  {
    slug: 'resistencias',
    title: 'Resistencias en serie y paralelo',
    blockId: 2,
    difficulty: 3,
    sourceType: 'real',
    sourceRef: 'PR4',
    concepts: ['float', 'if/else', 'validación', 'fórmulas múltiples'],
    pattern: 'Leer → Validar → Calcular serie y paralelo → Imprimir ambos',
    patternSteps: [
      'Leer R1 y R2',
      'Validar que ambas sean positivas',
      'Calcular: R_serie = R1 + R2',
      'Calcular: R_paralelo = (R1 * R2) / (R1 + R2)',
      'Imprimir ambos resultados con 2 decimales',
    ],
    commonMistakes: [
      'No validar que R1+R2 != 0 para el paralelo (aunque con ambas positivas no ocurre)',
      'Olvidar calcular ambos resultados',
      'Dividir entre R1+R2 antes de multiplicar R1*R2',
    ],
    statement: `Lee dos resistencias R1 y R2 (en ohmios). Si alguna es ≤ 0, imprime "ERROR".
Si no, calcula e imprime:
- Resistencia en serie: R1 + R2
- Resistencia en paralelo: (R1 × R2) / (R1 + R2)

Con 2 decimales cada una.`,
    inputSpec: 'Dos floats: R1 y R2.',
    outputSpec: '"Serie: X.XX\nParalelo: X.XX" o "ERROR"',
    exampleInput: '4.0 6.0',
    exampleOutput: 'Serie: 10.00\nParalelo: 2.40',
    pseudocode: `INICIO
  Leer R1, R2
  SI R1<=0 O R2<=0 → ERROR
  SI NO
    serie = R1 + R2
    paralelo = (R1*R2)/(R1+R2)
    Imprimir serie y paralelo
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    float R1, R2, serie, paralelo;
    scanf("%f %f", &R1, &R2);
    if (R1 <= 0.0f || R2 <= 0.0f) {
        printf("ERROR\\n");
    } else {
        serie = R1 + R2;
        paralelo = (R1 * R2) / (R1 + R2);
        printf("Serie: %.2f\\n", serie);
        printf("Paralelo: %.2f\\n", paralelo);
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Dos fórmulas: serie es suma directa, paralelo es producto dividido por suma. Necesitas validar ambas resistencias antes de calcular.' },
      { level: 2, label: 'Estructura mental', content: '1) Leer R1 y R2\n2) Validar: si R1 ≤ 0 O R2 ≤ 0 → ERROR\n3) Calcular serie = R1 + R2\n4) Calcular paralelo = (R1 × R2) / (R1 + R2)\n5) Imprimir ambos con 2 decimales\nAtención: con ambas positivas, R1+R2 nunca es 0.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer R1, R2\nSI R1 ≤ 0 O R2 ≤ 0 → "ERROR"\nSI NO:\n  serie = R1 + R2\n  paralelo = (R1 × R2) / (R1 + R2)\n  Imprimir ambos con 2 decimales' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    float R1, R2, serie, paralelo;\n    scanf("%f %f", &R1, &R2);\n    if (/* validación con || */) {\n        printf("ERROR\\n");\n    } else {\n        serie = /* fórmula serie */;\n        paralelo = /* fórmula paralelo */;\n        printf("Serie: %.2f\\n", serie);\n        printf("Paralelo: %.2f\\n", paralelo);\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 15,
    tags: ['validación múltiple', 'fórmulas', 'float'],
  },

  // ─────────────────────────────────────────────
  // BLOQUE 3 — Switch y menús
  // ─────────────────────────────────────────────
  {
    slug: 'menu-formas',
    title: 'Área de formas geométricas',
    blockId: 3,
    difficulty: 3,
    sourceType: 'generated',
    concepts: ['switch', 'case', 'break', 'float', 'scanf'],
    pattern: 'Mostrar menú → Leer opción → switch → Calcular según caso → Imprimir',
    patternSteps: [
      'Imprimir las opciones del menú',
      'Leer la opción elegida',
      'switch con un case por figura',
      'Leer los datos necesarios para esa figura',
      'Calcular el área y mostrarla',
      'default: "Opción no válida"',
    ],
    commonMistakes: [
      'Olvidar break al final de cada case',
      'No poner default',
      'Leer los datos antes del switch en vez de dentro de cada case',
    ],
    statement: `Muestra este menú:
  1. Círculo
  2. Rectángulo
  3. Triángulo

Lee la opción. Según la opción:
1. Lee radio → área = π × r²
2. Lee base y altura → área = base × altura
3. Lee base y altura → área = (base × altura) / 2

Muestra "Área: X.XX". Si la opción no es 1, 2 ni 3: "Opción no válida".`,
    inputSpec: 'Un entero (opción) y los floats necesarios.',
    outputSpec: '"Área: X.XX" o "Opción no válida"',
    exampleInput: '1\n5.0',
    exampleOutput: 'Área: 78.54',
    pseudocode: `INICIO
  Imprimir menú
  Leer opcion
  switch(opcion):
    case 1: leer r, area = PI*r*r
    case 2: leer b, h, area = b*h
    case 3: leer b, h, area = b*h/2
    default: "Opción no válida"
  Imprimir area
FIN`,
    solutionCode: `#include <stdio.h>
#define PI 3.14159265f

int main() {
    int opcion;
    float area, r, b, h;

    printf("1. Circulo\\n2. Rectangulo\\n3. Triangulo\\n");
    scanf("%d", &opcion);

    switch (opcion) {
        case 1:
            scanf("%f", &r);
            area = PI * r * r;
            printf("Area: %.2f\\n", area);
            break;
        case 2:
            scanf("%f %f", &b, &h);
            area = b * h;
            printf("Area: %.2f\\n", area);
            break;
        case 3:
            scanf("%f %f", &b, &h);
            area = (b * h) / 2.0f;
            printf("Area: %.2f\\n", area);
            break;
        default:
            printf("Opcion no valida\\n");
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'switch/case/break/default. Cada case es independiente: lee sus propios datos, calcula y muestra. Si olvidas break, la ejecución "cae" al siguiente case.' },
      { level: 2, label: 'Estructura mental', content: '1) Imprimir el menú con las opciones\n2) Leer la opción del usuario\n3) switch con un case por figura (1=círculo, 2=rectángulo, 3=triángulo)\n4) Dentro de cada case: leer datos, calcular área, imprimir, break\n5) default: mensaje de error\nImportante: cada case lee SUS datos, no se leen antes del switch.' },
      { level: 3, label: 'Pseudocódigo', content: 'Imprimir menú (1.Círculo 2.Rectángulo 3.Triángulo)\nLeer opción\nSEGÚN opción:\n  caso 1: leer r, area = PI × r × r, imprimir\n  caso 2: leer b y h, area = b × h, imprimir\n  caso 3: leer b y h, area = (b × h) / 2, imprimir\n  otro: "Opción no válida"' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n#define PI 3.14159265f\nint main() {\n    int opcion;\n    float area;\n    printf(/* imprimir menú */);\n    scanf("%d", &opcion);\n    switch (opcion) {\n        case 1:\n            /* leer radio, calcular PI*r*r, imprimir, break */\n        case 2:\n            /* leer base y altura, calcular b*h, imprimir, break */\n        case 3:\n            /* leer base y altura, calcular b*h/2, imprimir, break */\n        default:\n            printf("Opcion no valida\\n");\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 20,
    tags: ['switch', 'menú', 'float', 'geometría'],
  },

  {
    slug: 'resistencias-colores',
    title: 'Valor de resistencia por colores',
    blockId: 3,
    difficulty: 4,
    sourceType: 'real',
    sourceRef: 'PR4/ResistenciasPR',
    concepts: ['switch', 'char', 'toupper', 'multiplicación por potencia', 'printf'],
    pattern: 'Leer inicial de color → switch para valor → combinar dígitos → aplicar multiplicador',
    patternSteps: [
      'Leer 3 caracteres: color de banda 1, banda 2, y multiplicador',
      'Convertir cada carácter a mayúscula con toupper()',
      'switch para banda 1: convertir letra inicial a dígito (N=0, M=1, R=2...)',
      'switch para banda 2: igual',
      'switch para multiplicador: convertir a potencia de 10',
      'valor = (digito1 * 10 + digito2) * multiplicador',
    ],
    commonMistakes: [
      'Olvidar break en cada case del switch',
      'No usar toupper (el usuario puede escribir minúsculas)',
      'Confundir las iniciales: M=marrón (1), pero también M podría ser morado — usar otra letra',
      'No manejar el default (color no válido)',
      'Calcular mal el multiplicador (no es un dígito sino una potencia de 10)',
    ],
    statement: `Una resistencia tiene 3 bandas de color. Cada color se identifica por su inicial:

  N=Negro(0), M=Marrón(1), R=Rojo(2), A=Naranja(3),
  L=Amarillo(4), V=Verde(5), Z=Azul(6), P=Morado(7),
  G=Gris(8), B=Blanco(9)

Las dos primeras bandas forman un número de 2 dígitos.
La tercera banda es el multiplicador (potencia de 10).

valor = (digito1 × 10 + digito2) × 10^multiplicador

Lee 3 iniciales (caracteres). Imprime el valor de la resistencia.
Si algún color no es válido, imprime "COLOR NO VALIDO".

Ejemplo: R V A → dígitos 2,5 → 25 × 10³ = 25000
  Entrada: R V A
  Salida: 25000`,
    inputSpec: 'Tres caracteres separados por espacio.',
    outputSpec: 'Un entero (valor de la resistencia) o "COLOR NO VALIDO".',
    exampleInput: 'R V A',
    exampleOutput: '25000',
    pseudocode: `INICIO
  Leer c1, c2, c3 (caracteres)
  Convertir a mayúscula: c1=toupper(c1), c2=toupper(c2), c3=toupper(c3)
  d1 = switch(c1): N→0, M→1, R→2, A→3, L→4, V→5, Z→6, P→7, G→8, B→9
  d2 = switch(c2): igual
  mult = switch(c3): N→1, M→10, R→100, A→1000, L→10000, V→100000, Z→1000000
  SI alguno no válido → "COLOR NO VALIDO"
  SI NO: valor = (d1 × 10 + d2) × mult
  Imprimir valor
FIN`,
    solutionCode: `#include <stdio.h>
#include <ctype.h>

int colorADigito(char c) {
    switch (c) {
        case 'N': return 0;
        case 'M': return 1;
        case 'R': return 2;
        case 'A': return 3;
        case 'L': return 4;
        case 'V': return 5;
        case 'Z': return 6;
        case 'P': return 7;
        case 'G': return 8;
        case 'B': return 9;
        default: return -1;
    }
}

int main() {
    char c1, c2, c3;
    scanf(" %c %c %c", &c1, &c2, &c3);
    c1 = toupper(c1);
    c2 = toupper(c2);
    c3 = toupper(c3);

    int d1 = colorADigito(c1);
    int d2 = colorADigito(c2);
    int mult_dig = colorADigito(c3);

    if (d1 < 0 || d2 < 0 || mult_dig < 0) {
        printf("COLOR NO VALIDO\\n");
        return 0;
    }

    int mult = 1;
    for (int i = 0; i < mult_dig; i++) mult *= 10;

    int valor = (d1 * 10 + d2) * mult;
    printf("%d\\n", valor);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'switch con char: cada case compara un carácter y retorna un dígito. Necesitas toupper() de <ctype.h> para aceptar minúsculas. El multiplicador no es un dígito directo sino 10 elevado a ese dígito.' },
      { level: 2, label: 'Estructura mental', content: '1) Leer 3 chars, convertir a mayúscula\n2) Convertir cada inicial a dígito con switch (10 cases + default para error)\n3) Si alguno es inválido → error\n4) valor = (d1 × 10 + d2) — los dos primeros dígitos forman un número\n5) Multiplicar por 10^d3 — puedes calcular 10^d3 con un for que multiplique por 10 d3 veces\nTip: puedes extraer el switch a una función auxiliar para no repetirlo 3 veces.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer c1, c2, c3\nc1 = mayúscula(c1), c2 = mayúscula(c2), c3 = mayúscula(c3)\nd1 = colorADigito(c1)  // switch: N→0, M→1, R→2...\nd2 = colorADigito(c2)\nd3 = colorADigito(c3)\nSI algún dígito es -1 → "COLOR NO VALIDO"\nmult = 1\nPARA i de 0 a d3-1: mult = mult × 10\nvalor = (d1 × 10 + d2) × mult\nImprimir valor' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n#include <ctype.h>\n\nint colorADigito(char c) {\n    switch (c) {\n        case \'N\': return 0;\n        case \'M\': return 1;\n        /* completar R, A, L, V, Z, P, G, B */\n        default: return -1;\n    }\n}\n\nint main() {\n    char c1, c2, c3;\n    scanf(" %c %c %c", &c1, &c2, &c3);\n    /* toupper los 3 */\n    int d1 = colorADigito(c1);\n    int d2 = colorADigito(c2);\n    int d3 = colorADigito(c3);\n    if (/* ¿alguno inválido? */) { printf("COLOR NO VALIDO\\n"); return 0; }\n    /* calcular mult = 10^d3 con un for */\n    /* valor = (d1*10 + d2) * mult */\n    printf("%d\\n", valor);\n    return 0;\n}' },
    ],
    estimatedMinutes: 25,
    tags: ['switch', 'char', 'toupper', 'función', 'resistencias'],
  },

  // ─────────────────────────────────────────────
  // BLOQUE 4 — Bucles y acumuladores
  // ─────────────────────────────────────────────
  {
    slug: 'patron-numeros',
    title: 'Secuencia con for',
    blockId: 4,
    difficulty: 2,
    sourceType: 'real',
    sourceRef: 'PR6/Bucles1PR',
    concepts: ['for', 'printf', 'contador', 'formato'],
    pattern: 'Inicializar → for → imprimir en cada iteración',
    patternSteps: [
      'Leer n (número de elementos)',
      'for desde 1 hasta n',
      'Imprimir el número actual',
    ],
    commonMistakes: [
      'Empezar en 0 cuando se pide empezar en 1',
      'Condición i <= n vs i < n (confundirlas)',
      'Olvidar el salto de línea',
    ],
    statement: `Lee un entero n. Imprime los números del 1 al n, uno por línea, pero:
- Si el número es par: imprímelo seguido de " PAR"
- Si es impar: imprímelo solo

Ejemplo para n=5:
1
2 PAR
3
4 PAR
5`,
    inputSpec: 'Un entero n > 0.',
    outputSpec: 'n líneas.',
    exampleInput: '5',
    exampleOutput: '1\n2 PAR\n3\n4 PAR\n5',
    pseudocode: `INICIO
  Leer n
  PARA i de 1 hasta n:
    SI i % 2 == 0:
      Imprimir i + " PAR"
    SI NO:
      Imprimir i
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int n, i;
    scanf("%d", &n);
    for (i = 1; i <= n; i++) {
        if (i % 2 == 0) {
            printf("%d PAR\\n", i);
        } else {
            printf("%d\\n", i);
        }
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Bucle for que recorre de 1 a n. Dentro del bucle necesitas un if para distinguir pares de impares. Un número es par si su resto al dividir entre 2 es 0.' },
      { level: 2, label: 'Estructura mental', content: '1) Leer n\n2) for desde 1 hasta n (inclusive)\n3) En cada iteración: comprobar si i es par (i%2==0)\n4) Si par: imprimir número + " PAR"\n5) Si impar: imprimir solo el número\nCada línea lleva \\n al final.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nPARA i desde 1 hasta n:\n  SI i es par:\n    Imprimir i + " PAR"\n  SI NO:\n    Imprimir i' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int n, i;\n    scanf("%d", &n);\n    for (/* i desde 1 hasta n */) {\n        if (/* ¿cómo comprobar si i es par? */) {\n            printf("%d PAR\\n", i);\n        } else {\n            printf("%d\\n", i);\n        }\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 12,
    tags: ['for', 'módulo', 'condición dentro de bucle'],
  },

  {
    slug: 'patron-estrellas',
    title: 'Triángulo de asteriscos',
    blockId: 4,
    difficulty: 3,
    sourceType: 'real',
    sourceRef: 'PR6/Bucles4PR',
    concepts: ['for anidado', 'printf', 'patrón', 'bucle interior'],
    pattern: 'for exterior (filas) → for interior (columnas) → salto de línea',
    patternSteps: [
      'Leer n (número de filas)',
      'for exterior: i de 1 a n (filas)',
      'for interior: j de 1 a i (en fila i hay i asteriscos)',
      'printf("*") sin salto de línea',
      'Después del for interior: printf("\\n")',
    ],
    commonMistakes: [
      'Poner el \\n dentro del for interior',
      'El for interior va hasta j<=n en vez de j<=i',
      'No entender que el interior depende del exterior',
    ],
    statement: `Lee un entero n. Imprime un triángulo de asteriscos de n filas:
Para n=4:
*
**
***
****`,
    inputSpec: 'Un entero n > 0.',
    outputSpec: 'n filas de asteriscos.',
    exampleInput: '4',
    exampleOutput: '*\n**\n***\n****',
    pseudocode: `INICIO
  Leer n
  PARA i de 1 hasta n:
    PARA j de 1 hasta i:
      Imprimir "*" (sin salto)
    Imprimir salto de línea
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int n, i, j;
    scanf("%d", &n);
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= i; j++) {
            printf("*");
        }
        printf("\\n");
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Necesitas dos for anidados. El truco: el límite del for interior depende de la variable del for exterior. El salto de línea va DESPUÉS del for interior, no dentro.' },
      { level: 2, label: 'Estructura mental', content: 'Piensa fila por fila:\n- Fila 1: 1 asterisco\n- Fila 2: 2 asteriscos\n- Fila i: i asteriscos\nfor exterior: controla las filas (i de 1 a n)\nfor interior: imprime los asteriscos de esa fila (j de 1 a i)\nprintf("\\n") va ENTRE los dos for, no dentro del interior.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nPARA i desde 1 hasta n:\n  PARA j desde 1 hasta i:\n    Imprimir "*" (sin salto de línea)\n  Imprimir salto de línea' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int n, i, j;\n    scanf("%d", &n);\n    for (i = 1; i <= n; i++) {\n        for (/* j desde 1 hasta ¿qué límite? */) {\n            printf("*");\n        }\n        /* ¿dónde va el salto de línea? */\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 15,
    tags: ['for anidado', 'patrón', 'printf sin newline'],
  },

  {
    slug: 'triangulo-numerico',
    title: 'Triángulo numérico con secuencia continua',
    blockId: 4,
    difficulty: 4,
    sourceType: 'real',
    sourceRef: 'PR6/Bucles6PR',
    concepts: ['for anidado', 'contador global', 'printf con ancho', 'espacios'],
    pattern: 'for exterior (filas) → for interior (columnas) → contador global incrementándose',
    patternSteps: [
      'Leer n (número de filas)',
      'Inicializar un contador global num = 1',
      'for exterior: i de 1 a n (filas)',
      'for interior: j de 1 a i (columnas en esa fila)',
      'Imprimir num con ancho fijo (3 o 4 caracteres), incrementar num',
      'Salto de línea después de cada fila',
    ],
    commonMistakes: [
      'Reiniciar el contador en cada fila (debe ser global, continuo)',
      'No usar ancho fijo (los números de 1 y 2 cifras desalinean el triángulo)',
      'Confundir el límite del for interior (j<=i, no j<=n)',
      'Poner el salto de línea dentro del for interior',
    ],
    statement: `Lee un entero n. Imprime un triángulo numérico de n filas donde los números son secuenciales (1, 2, 3, ...) y continúan de fila en fila.

Cada número ocupa 4 caracteres de ancho (alineado a la derecha).

Ejemplo para n=4:
   1
   2   3
   4   5   6
   7   8   9  10`,
    inputSpec: 'Un entero n > 0.',
    outputSpec: 'Triángulo con números secuenciales y ancho fijo.',
    exampleInput: '4',
    exampleOutput: '   1\n   2   3\n   4   5   6\n   7   8   9  10',
    pseudocode: `INICIO
  Leer n
  num = 1
  PARA i desde 1 hasta n:
    PARA j desde 1 hasta i:
      Imprimir num con ancho 4
      num = num + 1
    Imprimir salto de línea
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int n, i, j, num = 1;
    scanf("%d", &n);
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= i; j++) {
            printf("%4d", num);
            num++;
        }
        printf("\\n");
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'La diferencia con un triángulo de asteriscos: aquí imprimes números secuenciales con un contador que NO se reinicia entre filas. Usa printf("%4d", num) para alinear con ancho fijo de 4.' },
      { level: 2, label: 'Estructura mental', content: 'Dos for anidados + un contador global:\n- num empieza en 1, se incrementa en cada impresión\n- for exterior: filas (i de 1 a n)\n- for interior: columnas (j de 1 a i, es decir, la fila i tiene i números)\n- El truco: num NO se reinicia al empezar cada fila, sigue desde donde quedó\n- %4d en printf da ancho fijo de 4 caracteres, alineado a la derecha.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nnum = 1\nPARA i desde 1 hasta n:\n  PARA j desde 1 hasta i:\n    Imprimir num con ancho 4 caracteres\n    num = num + 1\n  Imprimir salto de línea' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int n, i, j, num = 1;\n    scanf("%d", &n);\n    for (i = 1; i <= n; i++) {\n        for (/* ¿j desde dónde hasta dónde? */) {\n            printf(/* ¿formato con ancho fijo? */, num);\n            num++;\n        }\n        printf("\\n");\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 20,
    tags: ['for anidado', 'contador global', 'printf %4d', 'triángulo'],
  },

  {
    slug: 'contador-rangos',
    title: 'Contar valores en rangos',
    blockId: 4,
    difficulty: 3,
    sourceType: 'real',
    sourceRef: 'PR6/ContarPR',
    concepts: ['for', 'scanf', 'contadores', 'if dentro de bucle'],
    pattern: 'Inicializar contadores → for → leer y clasificar → imprimir contadores',
    patternSteps: [
      'Leer n (cantidad de números)',
      'Inicializar contadores a 0',
      'for de n iteraciones, leer cada número',
      'Clasificar en cada if y actualizar el contador correspondiente',
      'Imprimir los tres contadores',
    ],
    commonMistakes: [
      'No inicializar los contadores a 0 antes del bucle',
      'Usar if-if-if en vez de if-else if (puede contar el mismo número más de una vez)',
      'Leer todos los números antes del bucle',
    ],
    statement: `Lee n enteros. Cuenta cuántos son negativos, cuántos son cero y cuántos son positivos. Imprime los tres contadores.`,
    inputSpec: 'Un entero n, luego n enteros.',
    outputSpec: '"Negativos: X\nCeros: X\nPositivos: X"',
    exampleInput: '6\n-3 0 5 -1 0 7',
    exampleOutput: 'Negativos: 2\nCeros: 2\nPositivos: 2',
    pseudocode: `INICIO
  Leer n
  neg=0, cero=0, pos=0
  PARA i de 1 a n:
    Leer x
    SI x < 0: neg++
    SI x == 0: cero++
    SI x > 0: pos++
  Imprimir neg, cero, pos
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int n, x, i, neg = 0, cero = 0, pos = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &x);
        if (x < 0) neg++;
        else if (x == 0) cero++;
        else pos++;
    }
    printf("Negativos: %d\\n", neg);
    printf("Ceros: %d\\n", cero);
    printf("Positivos: %d\\n", pos);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Necesitas 3 contadores (uno por categoría) y un bucle for. Los contadores deben estar inicializados a 0 ANTES del bucle. Dentro del bucle: leer y clasificar con if/else if.' },
      { level: 2, label: 'Estructura mental', content: '1) Leer n\n2) Inicializar 3 contadores a 0: negativos, ceros, positivos\n3) for de n iteraciones:\n   - Leer x\n   - if x<0: incrementar negativo\n   - else if x==0: incrementar cero\n   - else: incrementar positivo\n4) DESPUÉS del bucle: imprimir los 3 contadores\nError común: usar if-if-if en vez de if-else if (contaría doble).' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nneg=0, cero=0, pos=0\nPARA i desde 0 hasta n-1:\n  Leer x\n  SI x < 0: neg = neg + 1\n  SI NO SI x == 0: cero = cero + 1\n  SI NO: pos = pos + 1\nImprimir neg, cero, pos' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int n, x, i;\n    int neg = 0, cero = 0, pos = 0;\n    scanf("%d", &n);\n    for (/* n iteraciones */) {\n        scanf("%d", &x);\n        /* clasificar x con if/else if/else y actualizar contadores */\n    }\n    printf("Negativos: %d\\n", neg);\n    printf("Ceros: %d\\n", cero);\n    printf("Positivos: %d\\n", pos);\n    return 0;\n}' },
    ],
    estimatedMinutes: 15,
    tags: ['for', 'contadores', 'clasificar', 'else if'],
  },

  {
    slug: 'suma-acumulada',
    title: 'Suma acumulada con while',
    blockId: 4,
    difficulty: 3,
    sourceType: 'generated',
    concepts: ['while', 'acumulador', 'scanf', 'centinela'],
    pattern: 'Inicializar acumulador → while centinela → acumular → calcular resultado',
    patternSteps: [
      'Inicializar suma = 0 y contador = 0',
      'Leer primer valor',
      'while valor != -1 (centinela)',
      'Acumular y contar, leer siguiente valor',
      'Calcular media y mostrar',
    ],
    commonMistakes: [
      'Olvidar leer el primer valor antes del while',
      'Olvidar leer el siguiente valor al final del while (bucle infinito)',
      'Dividir antes de comprobar si contador > 0',
    ],
    statement: `Lee números enteros hasta que el usuario introduzca -1 (centinela). Calcula e imprime la suma y la media de los números leídos (sin contar el centinela). Si no hay datos válidos, imprime "SIN DATOS".`,
    inputSpec: 'Enteros hasta -1.',
    outputSpec: '"Suma: X\nMedia: X.XX" o "SIN DATOS"',
    exampleInput: '3 7 2 5 -1',
    exampleOutput: 'Suma: 17\nMedia: 4.25',
    pseudocode: `INICIO
  suma=0, cont=0
  Leer x
  MIENTRAS x != -1:
    suma += x
    cont++
    Leer x
  SI cont == 0 → "SIN DATOS"
  SI NO → imprimir suma y suma/cont
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int x, cont = 0;
    float suma = 0;
    scanf("%d", &x);
    while (x != -1) {
        suma += x;
        cont++;
        scanf("%d", &x);
    }
    if (cont == 0) {
        printf("SIN DATOS\\n");
    } else {
        printf("Suma: %.0f\\n", suma);
        printf("Media: %.2f\\n", suma / cont);
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Patrón centinela: lees valores hasta encontrar uno especial (-1) que indica "ya no hay más". Necesitas un acumulador (suma) y un contador. Clave: leer ANTES del while y otra vez al FINAL del while.' },
      { level: 2, label: 'Estructura mental', content: 'El patrón centinela tiene esta forma:\n1) Inicializar suma=0, cont=0\n2) Leer primer x\n3) while x ≠ centinela:\n   - acumular: suma += x, cont++\n   - leer siguiente x (si olvidas esto: bucle infinito)\n4) Después del while: si cont==0 sin datos, si no, calcular media=suma/cont\nEl centinela NO se cuenta ni se suma.' },
      { level: 3, label: 'Pseudocódigo', content: 'suma = 0, cont = 0\nLeer x\nMIENTRAS x ≠ -1:\n  suma = suma + x\n  cont = cont + 1\n  Leer x\nSI cont == 0 → "SIN DATOS"\nSI NO → Imprimir suma y media (suma/cont)' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int x, cont = 0;\n    float suma = 0;\n    scanf("%d", &x);\n    while (/* ¿condición con centinela? */) {\n        suma += x;\n        cont++;\n        scanf("%d", &x);  /* ¡leer de nuevo! */\n    }\n    if (/* ¿no hay datos? */) {\n        printf("SIN DATOS\\n");\n    } else {\n        printf("Suma: %.0f\\n", suma);\n        printf("Media: %.2f\\n", /* ¿cómo calcular la media? */);\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 15,
    tags: ['while', 'centinela', 'acumulador', 'media'],
  },

  {
    slug: 'media-desviacion',
    title: 'Media y desviación estándar',
    blockId: 4,
    difficulty: 4,
    sourceType: 'real',
    sourceRef: 'PR6/MediaDesPR',
    concepts: ['while', 'centinela', 'acumulador', 'sqrt', 'math.h'],
    pattern: 'Centinela → acumular suma y suma de cuadrados → calcular media → calcular desviación',
    patternSteps: [
      'Leer hasta centinela (-99), ignorar valores fuera de [0,10]',
      'Acumular suma y suma de cuadrados solo de válidos',
      'Si no hay datos válidos → "NO HAY DATOS"',
      'Media = suma / n',
      'Desviación = sqrt(sumaCuad/n - media²)',
      'Imprimir con 2 decimales',
    ],
    commonMistakes: [
      'No filtrar los valores fuera de rango',
      'Olvidar el #include <math.h> para sqrt',
      'Calcular la desviación sin la fórmula correcta',
      'Dividir entre 0 si no hay datos',
    ],
    statement: `Lee números reales hasta -99. Solo considera los que estén en [0.0, 10.0]. Calcula e imprime su media y desviación estándar con 2 decimales.

Fórmula de desviación: sqrt(Σx²/n − (Σx/n)²)

Si no hay datos válidos, imprime "NO HAY DATOS".`,
    inputSpec: 'Floats hasta -99.',
    outputSpec: '"Media: X.XX\nDesviacion: X.XX" o "NO HAY DATOS"',
    exampleInput: '7.0 3.5 11.0 5.0 -99',
    exampleOutput: 'Media: 5.17\nDesviacion: 1.47',
    pseudocode: `INICIO
  suma=0, sumaCuad=0, n=0
  Leer x
  MIENTRAS x != -99:
    SI x >= 0 Y x <= 10:
      suma += x
      sumaCuad += x*x
      n++
    Leer x
  SI n == 0 → "NO HAY DATOS"
  SI NO:
    media = suma / n
    desv = sqrt(sumaCuad/n - media*media)
    Imprimir media y desv
FIN`,
    solutionCode: `#include <stdio.h>
#include <math.h>

int main() {
    float x, suma = 0, sumaCuad = 0, media, desv;
    int n = 0;
    scanf("%f", &x);
    while (x != -99.0f) {
        if (x >= 0.0f && x <= 10.0f) {
            suma += x;
            sumaCuad += x * x;
            n++;
        }
        scanf("%f", &x);
    }
    if (n == 0) {
        printf("NO HAY DATOS\\n");
    } else {
        media = suma / n;
        desv = sqrtf(sumaCuad / n - media * media);
        printf("Media: %.2f\\n", media);
        printf("Desviacion: %.2f\\n", desv);
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Combina centinela (-99) con filtro de rango [0,10]. Necesitas DOS acumuladores: suma y suma de cuadrados. La desviación estándar usa sqrt de math.h. Solo los valores dentro del rango se acumulan.' },
      { level: 2, label: 'Estructura mental', content: 'Es un centinela con filtro:\n1) Leer x, while x ≠ -99\n2) Dentro del while: SI x está en [0,10], acumular suma, sumaCuad, y contar\n3) Si x está fuera del rango: ignorar (no acumular, no contar)\n4) Leer siguiente x\n5) Después: si n==0 sin datos; si no, media = suma/n y desv = sqrt(sumaCuad/n − media²)\nPunto difícil: la fórmula de desviación necesita dos acumuladores.' },
      { level: 3, label: 'Pseudocódigo', content: 'suma=0, sumaCuad=0, n=0\nLeer x\nMIENTRAS x ≠ -99:\n  SI x ≥ 0 Y x ≤ 10:\n    suma = suma + x\n    sumaCuad = sumaCuad + x×x\n    n = n + 1\n  Leer x\nSI n == 0 → "NO HAY DATOS"\nSI NO:\n  media = suma / n\n  desv = raíz(sumaCuad/n − media²)\n  Imprimir media y desv' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n#include <math.h>\nint main() {\n    float x, suma = 0, sumaCuad = 0, media, desv;\n    int n = 0;\n    scanf("%f", &x);\n    while (/* centinela */) {\n        if (/* x en rango [0,10] */) {\n            suma += x;\n            sumaCuad += /* ¿qué acumular aquí? */;\n            n++;\n        }\n        scanf("%f", &x);\n    }\n    if (n == 0) { printf("NO HAY DATOS\\n"); }\n    else {\n        media = /* ¿fórmula? */;\n        desv = sqrtf(/* ¿fórmula de desviación? */);\n        printf("Media: %.2f\\nDesviacion: %.2f\\n", media, desv);\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 25,
    tags: ['while', 'centinela', 'filtro', 'sqrt', 'math.h'],
  },

  {
    slug: 'insertar-centro',
    title: 'Insertar dígito en el centro',
    blockId: 4,
    difficulty: 5,
    sourceType: 'real',
    sourceRef: 'PR6/InsertarCentroPR',
    concepts: ['while', 'módulo', 'división', 'manipulación de cifras'],
    pattern: 'Contar cifras → calcular posición central → construir nuevo número',
    patternSteps: [
      'Contar cuántas cifras tiene el número (dividir entre 10 hasta que sea 0)',
      'Calcular mitad = cifras / 2',
      'Separar el número: parte baja (últimas mitad cifras) y parte alta',
      'Nuevo número = parte_alta * 10^(mitad+1) + digito * 10^mitad + parte_baja',
      'Para potencias: bucle multiplicando por 10',
    ],
    commonMistakes: [
      'No saber cuántas cifras tiene el número',
      'Confundir la posición central para cifras pares vs impares',
      'Calcular la potencia de 10 incorrectamente',
    ],
    statement: `Lee un número entero positivo y un dígito (0-9). Inserta el dígito en la posición central del número.

- Si el número tiene cifras pares, insertar antes de la mitad derecha
- Si tiene cifras impares, insertar en la posición central

Ejemplo: 1234 con dígito 5 → 12534
Ejemplo: 123 con dígito 5 → 1523`,
    inputSpec: 'Dos enteros: el número y el dígito.',
    outputSpec: 'El nuevo número.',
    exampleInput: '1234 5',
    exampleOutput: '12534',
    pseudocode: `INICIO
  Leer num, digito
  Contar cifras (while num/10 != 0)
  mitad = cifras / 2
  parte_baja = num % 10^mitad
  parte_alta = num / 10^mitad
  potencia = 10^mitad
  resultado = parte_alta * potencia * 10 + digito * potencia + parte_baja
  Imprimir resultado
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int num, digito, cifras = 0, tmp, mitad, potencia = 1;
    int parte_alta, parte_baja, resultado;

    scanf("%d %d", &num, &digito);

    tmp = num;
    while (tmp > 0) { cifras++; tmp /= 10; }

    mitad = cifras / 2;

    for (int i = 0; i < mitad; i++) potencia *= 10;

    parte_baja = num % potencia;
    parte_alta = num / potencia;
    resultado = parte_alta * potencia * 10 + digito * potencia + parte_baja;

    printf("%d\\n", resultado);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Para contar cifras: divide entre 10 repetidamente. Para separar un número: módulo te da las cifras bajas, división entera las altas. Para calcular 10^n sin pow: un bucle multiplicando por 10.' },
      { level: 2, label: 'Estructura mental', content: '4 pasos:\n1) Contar cifras del número (while tmp>0: cifras++, tmp/=10)\n2) mitad = cifras / 2 (posición donde insertar)\n3) Calcular potencia = 10^mitad (con un for)\n4) Separar: parte_baja = num % potencia, parte_alta = num / potencia\n5) Reconstruir: parte_alta × potencia × 10 + dígito × potencia + parte_baja\nEl ×10 extra es para "hacer hueco" al dígito insertado.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer num, digito\ntmp = num, cifras = 0\nMIENTRAS tmp > 0:\n  cifras++, tmp = tmp / 10\nmitad = cifras / 2\npotencia = 1\nPARA i de 0 a mitad-1:\n  potencia = potencia × 10\nparte_baja = num MÓDULO potencia\nparte_alta = num / potencia\nresultado = parte_alta × potencia × 10 + digito × potencia + parte_baja\nImprimir resultado' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int num, digito, cifras = 0, tmp, mitad, potencia = 1;\n    scanf("%d %d", &num, &digito);\n    tmp = num;\n    while (/* contar cifras */) { cifras++; tmp /= 10; }\n    mitad = cifras / 2;\n    for (int i = 0; i < mitad; i++) potencia *= 10;\n    /* separar parte alta y baja usando potencia */\n    /* reconstruir: alta * potencia * 10 + digito * potencia + baja */\n    printf("%d\\n", resultado);\n    return 0;\n}' },
    ],
    estimatedMinutes: 30,
    tags: ['while', 'módulo', 'división', 'cifras', 'manipulación numérica'],
  },

  // ─────────────────────────────────────────────
  // BLOQUE 5 — Funciones
  // ─────────────────────────────────────────────
  {
    slug: 'funciones-geometria',
    title: 'Funciones para geometría',
    blockId: 5,
    difficulty: 3,
    sourceType: 'generated',
    concepts: ['funciones', 'return', 'parámetros', 'prototipo', 'float'],
    pattern: 'Declarar prototipo → definir función → llamar desde main → imprimir resultado',
    patternSteps: [
      'Declarar el prototipo de la función antes de main',
      'Implementar la función con sus parámetros y return',
      'En main: leer datos, llamar a la función, mostrar resultado',
    ],
    commonMistakes: [
      'Olvidar el prototipo (declaración antes de main)',
      'No poner return en la función',
      'No usar el tipo correcto (float) en parámetros y retorno',
      'Poner printf dentro de la función en vez de retornar el valor',
    ],
    statement: `Crea una función que calcule el área de un rectángulo:
  float areaRectangulo(float base, float altura)

En main: lee base y altura, llama a la función y muestra el área con 2 decimales.`,
    inputSpec: 'Dos floats: base y altura.',
    outputSpec: '"Area: X.XX"',
    exampleInput: '4.0 3.0',
    exampleOutput: 'Area: 12.00',
    pseudocode: `PROTOTIPO: float areaRectangulo(float b, float h)

FUNCION areaRectangulo(b, h):
  return b * h

MAIN:
  Leer base, altura
  area = areaRectangulo(base, altura)
  Imprimir area`,
    solutionCode: `#include <stdio.h>

float areaRectangulo(float base, float altura);

float areaRectangulo(float base, float altura) {
    return base * altura;
}

int main() {
    float base, altura, area;
    scanf("%f %f", &base, &altura);
    area = areaRectangulo(base, altura);
    printf("Area: %.2f\\n", area);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Una función en C tiene: tipo de retorno, nombre, parámetros. Necesitas declararla (prototipo) antes de main y definirla con su cuerpo. La función calcula y retorna; main imprime.' },
      { level: 2, label: 'Estructura mental', content: 'El programa tiene 3 partes:\n1) Prototipo de la función (antes de main): anuncia que existe\n2) Definición de la función: recibe base y altura, retorna base×altura\n3) main: lee datos, llama a la función, imprime lo que retornó\nRegla clave: la función NO imprime, solo calcula y hace return.' },
      { level: 3, label: 'Pseudocódigo', content: 'DECLARAR función areaRectangulo(base, altura) → retorna real\n\nFUNCIÓN areaRectangulo(base, altura):\n  retornar base × altura\n\nPRINCIPAL:\n  Leer base, altura\n  area = llamar areaRectangulo(base, altura)\n  Imprimir area con 2 decimales' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n\nfloat areaRectangulo(float base, float altura);  /* prototipo */\n\nfloat areaRectangulo(float base, float altura) {\n    return /* ¿qué operación? */;\n}\n\nint main() {\n    float base, altura, area;\n    scanf("%f %f", &base, &altura);\n    area = /* ¿cómo llamar a la función? */;\n    printf("Area: %.2f\\n", area);\n    return 0;\n}' },
    ],
    estimatedMinutes: 20,
    tags: ['funciones', 'prototipo', 'return', 'float'],
  },

  {
    slug: 'funcion-validar-rango',
    title: 'Función que valida un rango',
    blockId: 5,
    difficulty: 4,
    sourceType: 'generated',
    concepts: ['funciones', 'return int', 'do-while', 'validación'],
    pattern: 'Función valida → main llama en do-while hasta dato correcto',
    patternSteps: [
      'Crear función int esValido(float x, float min, float max) que retorna 1 o 0',
      'En main: leer con do-while llamando a esValido',
      'Cuando es válido: procesar y mostrar',
    ],
    commonMistakes: [
      'Hacer la validación directamente en main en vez de en una función',
      'Usar while en vez de do-while (no lee la primera vez)',
      'Retornar algo distinto de 0/1',
    ],
    statement: `Crea una función int esValido(float x) que devuelve 1 si x está en [1.0, 100.0], y 0 si no.

En main: usa un do-while que lea un float y repita si no es válido. Cuando sea válido, imprime su raíz cuadrada con 2 decimales.

Incluye #include <math.h>.`,
    inputSpec: 'Un float (puede requerir varios intentos si es inválido).',
    outputSpec: '"Raiz: X.XX"',
    exampleInput: '-5.0 200.0 25.0',
    exampleOutput: 'Raiz: 5.00',
    pseudocode: `FUNCION esValido(x):
  SI x >= 1 Y x <= 100: return 1
  SI NO: return 0

MAIN:
  HACER
    Leer x
  MIENTRAS NOT esValido(x)
  Imprimir sqrt(x)`,
    solutionCode: `#include <stdio.h>
#include <math.h>

int esValido(float x);

int esValido(float x) {
    return (x >= 1.0f && x <= 100.0f) ? 1 : 0;
}

int main() {
    float x;
    do {
        scanf("%f", &x);
    } while (!esValido(x));
    printf("Raiz: %.2f\\n", sqrtf(x));
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Combina funciones con do-while. La función retorna int (1=válido, 0=no). do-while es ideal porque siempre lee al menos una vez, y repite mientras no sea válido.' },
      { level: 2, label: 'Estructura mental', content: '1) Crear función esValido: recibe float, retorna 1 si está en [1,100], 0 si no\n2) En main: bucle do-while que lee x y repite mientras !esValido(x)\n3) Cuando sale del bucle: x es válido, calcular sqrt(x)\ndo-while garantiza al menos una lectura. El ! invierte la condición.' },
      { level: 3, label: 'Pseudocódigo', content: 'FUNCIÓN esValido(x):\n  SI x ≥ 1 Y x ≤ 100: retornar 1\n  SI NO: retornar 0\n\nPRINCIPAL:\n  HACER:\n    Leer x\n  MIENTRAS NO esValido(x)\n  Imprimir raíz cuadrada de x' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n#include <math.h>\n\nint esValido(float x);\n\nint esValido(float x) {\n    return /* ¿condición para rango [1,100]? ¿retornar 1 o 0? */;\n}\n\nint main() {\n    float x;\n    do {\n        scanf("%f", &x);\n    } while (/* ¿cómo usar esValido con negación? */);\n    printf("Raiz: %.2f\\n", /* ¿función de math.h? */);\n    return 0;\n}' },
    ],
    estimatedMinutes: 20,
    tags: ['funciones', 'do-while', 'validación', 'return'],
  },

  // ─────────────────────────────────────────────
  // BLOQUE 6 — Arrays
  // ─────────────────────────────────────────────
  {
    slug: 'estadisticas-array',
    title: 'Estadísticas de un array',
    blockId: 6,
    difficulty: 3,
    sourceType: 'generated',
    concepts: ['array', 'for', 'min', 'max', 'media', 'scanf'],
    pattern: 'Leer array → recorrer → calcular min, max, suma → imprimir',
    patternSteps: [
      'Leer n y declarar array de n enteros',
      'for para leer todos los elementos en el array',
      'Inicializar min y max con el primer elemento',
      'for para recorrer y actualizar min, max y suma',
      'Imprimir los tres resultados',
    ],
    commonMistakes: [
      'Inicializar min=0 y max=0 en vez de con el primer elemento',
      'Recorrer desde i=0 o desde i=1 incorrectamente',
      'Olvidar leer los elementos antes de procesarlos',
    ],
    statement: `Lee n enteros en un array. Calcula e imprime el mínimo, el máximo y la media (con 2 decimales).`,
    inputSpec: 'Un entero n, luego n enteros.',
    outputSpec: '"Min: X\nMax: X\nMedia: X.XX"',
    exampleInput: '5\n3 1 4 1 5',
    exampleOutput: 'Min: 1\nMax: 5\nMedia: 2.80',
    pseudocode: `INICIO
  Leer n
  array a[n]
  PARA i de 0 a n-1: leer a[i]
  min = a[0], max = a[0], suma = 0
  PARA i de 0 a n-1:
    SI a[i] < min: min = a[i]
    SI a[i] > max: max = a[i]
    suma += a[i]
  Imprimir min, max, suma/n
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int n, i;
    scanf("%d", &n);
    int a[n];
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    int minVal = a[0], maxVal = a[0], suma = 0;
    for (i = 0; i < n; i++) {
        if (a[i] < minVal) minVal = a[i];
        if (a[i] > maxVal) maxVal = a[i];
        suma += a[i];
    }
    printf("Min: %d\\n", minVal);
    printf("Max: %d\\n", maxVal);
    printf("Media: %.2f\\n", (float)suma / n);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Usa un array para guardar los n números. Para mínimo y máximo: inicializa con el primer elemento (a[0]), NO con 0. Recorre con for comparando y actualizando.' },
      { level: 2, label: 'Estructura mental', content: '2 fases con for:\n1) Leer: for de 0 a n-1, leer cada a[i]\n2) Calcular: inicializar min=a[0], max=a[0], suma=0. for de 0 a n-1: si a[i]<min actualizar, si a[i]>max actualizar, sumar\n3) Imprimir min, max y media (suma/n)\nPara la media: dividir como float, no como int.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nDeclarar array a[n]\nPARA i de 0 a n-1: Leer a[i]\nmin = a[0], max = a[0], suma = 0\nPARA i de 0 a n-1:\n  SI a[i] < min: min = a[i]\n  SI a[i] > max: max = a[i]\n  suma = suma + a[i]\nImprimir min, max, suma/n' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int n, i;\n    scanf("%d", &n);\n    int a[n];\n    for (i = 0; i < n; i++) scanf("%d", &a[i]);\n    int minVal = a[0], maxVal = a[0], suma = 0;\n    for (i = 0; i < n; i++) {\n        /* comparar a[i] con minVal y maxVal, actualizar si corresponde */\n        suma += a[i];\n    }\n    printf("Min: %d\\nMax: %d\\n", minVal, maxVal);\n    printf("Media: %.2f\\n", /* ¿cómo dividir para obtener float? */);\n    return 0;\n}' },
    ],
    estimatedMinutes: 20,
    tags: ['array', 'for', 'min', 'max', 'media'],
  },

  {
    slug: 'velocidad-media',
    title: 'Velocidad media por tramos',
    blockId: 6,
    difficulty: 4,
    sourceType: 'real',
    sourceRef: 'PR7/VelocidadMediaTramoPR',
    concepts: ['array', 'for', 'acumulador', 'validación', 'float'],
    pattern: 'Leer tramos en arrays → acumular distancia y tiempo → calcular velocidad media',
    patternSteps: [
      'Leer n (número de tramos)',
      'Arrays: distancias[] y tiempos[]',
      'for: leer cada par (distancia, tiempo), validar > 0',
      'Acumular distancia total y tiempo total',
      'Velocidad media = distancia_total / tiempo_total',
    ],
    commonMistakes: [
      'Calcular velocidad de cada tramo en vez de la total',
      'No validar que los datos sean positivos',
      'Dividir distancia entre tiempo de un solo tramo',
    ],
    statement: `Lee n tramos de un recorrido. Cada tramo tiene distancia (km) y tiempo (h). Calcula la velocidad media del recorrido completo:
  v = distancia_total / tiempo_total

Si algún dato es ≤ 0, imprime "ERROR". Si no, imprime la velocidad con 2 decimales.`,
    inputSpec: 'Un entero n, luego n pares de floats (distancia tiempo).',
    outputSpec: '"Velocidad media: X.XX km/h" o "ERROR"',
    exampleInput: '3\n100.0 1.0\n80.0 1.0\n120.0 1.5',
    exampleOutput: 'Velocidad media: 85.71 km/h',
    pseudocode: `INICIO
  Leer n
  distTotal=0, timeTotal=0, error=0
  PARA i de 0 a n-1:
    Leer d[i], t[i]
    SI d[i]<=0 O t[i]<=0: error=1
    distTotal += d[i]
    timeTotal += t[i]
  SI error: "ERROR"
  SI NO: imprimir distTotal/timeTotal
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    int n, i, error = 0;
    float dist, tiempo, distTotal = 0, timeTotal = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%f %f", &dist, &tiempo);
        if (dist <= 0.0f || tiempo <= 0.0f) error = 1;
        distTotal += dist;
        timeTotal += tiempo;
    }
    if (error) {
        printf("ERROR\\n");
    } else {
        printf("Velocidad media: %.2f km/h\\n", distTotal / timeTotal);
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Velocidad media ≠ media de velocidades. Es distancia_total / tiempo_total. No necesitas arrays: basta con acumuladores. Valida que cada distancia y tiempo sean positivos.' },
      { level: 2, label: 'Estructura mental', content: '1) Leer n\n2) Inicializar acumuladores y flag de error\n3) for de n tramos: leer distancia y tiempo, validar, acumular\n4) Después del bucle: si hubo error → ERROR; si no → velocidad = distTotal / timeTotal\nTrampas: no calcular v de cada tramo por separado; no olvidar validar ambos valores.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\ndistTotal=0, timeTotal=0, error=0\nPARA i de 0 a n-1:\n  Leer dist, tiempo\n  SI dist ≤ 0 O tiempo ≤ 0: error = 1\n  distTotal = distTotal + dist\n  timeTotal = timeTotal + tiempo\nSI error → "ERROR"\nSI NO → Imprimir distTotal / timeTotal' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    int n, i, error = 0;\n    float dist, tiempo, distTotal = 0, timeTotal = 0;\n    scanf("%d", &n);\n    for (i = 0; i < n; i++) {\n        scanf("%f %f", &dist, &tiempo);\n        if (/* validación */) error = 1;\n        /* acumular dist y tiempo */\n    }\n    if (error) printf("ERROR\\n");\n    else printf("Velocidad media: %.2f km/h\\n", /* ¿fórmula? */);\n    return 0;\n}' },
    ],
    estimatedMinutes: 25,
    tags: ['array', 'acumulador', 'validación', 'float'],
  },

  {
    slug: 'cuatro-cuadrados',
    title: 'Suma de cuatro cuadrados (Lagrange)',
    blockId: 6,
    difficulty: 5,
    sourceType: 'real',
    sourceRef: 'PR7/CuatroCuadradoPR',
    concepts: ['for anidado ×4', 'sqrt', 'math.h', 'fuerza bruta', 'simetría'],
    pattern: '4 for anidados con límites acotados por sqrt → comprobar suma → imprimir',
    patternSteps: [
      'Leer n',
      'for a desde 0, mientras a² ≤ n',
      'for b desde a, mientras a²+b² ≤ n',
      'for c desde b, mientras a²+b²+c² ≤ n',
      'Calcular d² = n − a² − b² − c²',
      'Si d² es cuadrado perfecto y d ≥ c → imprimir la combinación',
    ],
    commonMistakes: [
      'No forzar a ≤ b ≤ c ≤ d (imprime combinaciones repetidas)',
      'Usar un 4º for en vez de calcular d directamente (ineficiente)',
      'No acotar los límites con sqrt (tarda demasiado con n grandes)',
      'Olvidar el caso a=0 o d=0',
      'Comprobar d² con == en float (usar enteros para evitar errores de precisión)',
    ],
    statement: `Dado un entero positivo n, imprime todas las formas de expresarlo como suma de cuatro cuadrados de enteros no negativos (Teorema de Lagrange):

  n = a² + b² + c² + d²

Para evitar repeticiones, imprime solo las combinaciones donde a ≤ b ≤ c ≤ d.

Ejemplo para n=10:
  10 = 0² + 0² + 1² + 3²  (0 + 0 + 1 + 9)
  10 = 1² + 1² + 2² + 2²  (1 + 1 + 4 + 4)`,
    inputSpec: 'Un entero positivo n.',
    outputSpec: 'Todas las descomposiciones a²+b²+c²+d² = n con a ≤ b ≤ c ≤ d.',
    exampleInput: '10',
    exampleOutput: '0 0 1 3\n1 1 2 2',
    pseudocode: `INICIO
  Leer n
  PARA a desde 0 MIENTRAS a×a ≤ n:
    PARA b desde a MIENTRAS a×a + b×b ≤ n:
      PARA c desde b MIENTRAS a×a + b×b + c×c ≤ n:
        resto = n − a×a − b×b − c×c
        d = raíz entera de resto
        SI d×d == resto Y d ≥ c:
          Imprimir a, b, c, d
FIN`,
    solutionCode: `#include <stdio.h>
#include <math.h>

int main() {
    int n, a, b, c, d, resto;
    scanf("%d", &n);

    for (a = 0; a * a <= n; a++) {
        for (b = a; a*a + b*b <= n; b++) {
            for (c = b; a*a + b*b + c*c <= n; c++) {
                resto = n - a*a - b*b - c*c;
                d = (int)(sqrtf((float)resto) + 0.5f);
                if (d * d == resto && d >= c) {
                    printf("%d %d %d %d\\n", a, b, c, d);
                }
            }
        }
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: '4 bucles anidados pero con un truco: no necesitas el 4º bucle. a, b, c van en for; d se calcula como raíz del resto. Para evitar repeticiones: b empieza en a, c en b, y d debe ser ≥ c.' },
      { level: 2, label: 'Estructura mental', content: 'Idea: búsqueda exhaustiva acotada.\n- for a: desde 0 mientras a² ≤ n\n- for b: desde a (simetría) mientras a²+b² ≤ n\n- for c: desde b (simetría) mientras a²+b²+c² ≤ n\n- d: no hace falta un for. resto = n−a²−b²−c². Si resto es un cuadrado perfecto y su raíz ≥ c, es solución.\nEl truco de acotar b≥a, c≥b, d≥c elimina todas las repeticiones.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nPARA a desde 0, mientras a×a ≤ n:\n  PARA b desde a, mientras a×a + b×b ≤ n:\n    PARA c desde b, mientras a×a + b×b + c×c ≤ n:\n      resto = n − a×a − b×b − c×c\n      d = parte entera de raíz(resto)\n      SI d×d == resto Y d ≥ c:\n        Imprimir a, b, c, d' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n#include <math.h>\nint main() {\n    int n, a, b, c, d, resto;\n    scanf("%d", &n);\n    for (a = 0; a*a <= n; a++) {\n        for (b = /* ¿desde dónde? */; /* ¿condición? */; b++) {\n            for (c = /* ¿desde dónde? */; /* ¿condición? */; c++) {\n                resto = /* n menos los tres cuadrados */;\n                d = (int)(sqrtf((float)resto) + 0.5f);\n                if (/* ¿d es raíz exacta? */ && /* ¿d ≥ c? */) {\n                    printf("%d %d %d %d\\n", a, b, c, d);\n                }\n            }\n        }\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 35,
    tags: ['for anidado', 'fuerza bruta', 'sqrt', 'Lagrange', 'simetría'],
  },

  // ─────────────────────────────────────────────
  // BLOQUE 7 — Problemas combinados
  // ─────────────────────────────────────────────
  {
    slug: 'cabe-agujero',
    title: '¿Cabe por el agujero?',
    blockId: 7,
    difficulty: 4,
    sourceType: 'real',
    sourceRef: 'PR5',
    concepts: ['sqrt', 'math.h', 'comparación', 'diagonal'],
    pattern: 'Calcular diagonales con sqrt → comparar → imprimir resultado',
    patternSteps: [
      'Leer ancho y alto del objeto y del agujero',
      'Calcular diagonal del objeto: sqrt(w²+h²)',
      'Calcular diagonal del agujero: sqrt(W²+H²)',
      'Si diagonal_objeto <= diagonal_agujero: cabe',
      'Si no: no cabe',
    ],
    commonMistakes: [
      'Comparar ancho con ancho y alto con alto en vez de diagonales',
      'Olvidar #include <math.h>',
      'No comparar si el objeto cabe en ambas orientaciones',
    ],
    statement: `Un objeto rectangular tiene dimensiones w×h. Un agujero rectangular tiene dimensiones W×H. El objeto cabe por el agujero si su diagonal es menor o igual que la diagonal del agujero.

  diagonal = sqrt(lado1² + lado2²)

Lee w, h, W, H. Imprime "CABE" o "NO CABE".`,
    inputSpec: 'Cuatro floats: w h W H.',
    outputSpec: '"CABE" o "NO CABE"',
    exampleInput: '3.0 4.0 5.0 5.0',
    exampleOutput: 'CABE',
    pseudocode: `INICIO
  Leer w, h, W, H
  diag_obj = sqrt(w*w + h*h)
  diag_aguj = sqrt(W*W + H*H)
  SI diag_obj <= diag_aguj → "CABE"
  SI NO → "NO CABE"
FIN`,
    solutionCode: `#include <stdio.h>
#include <math.h>

int main() {
    float w, h, W, H;
    scanf("%f %f %f %f", &w, &h, &W, &H);
    float diag_obj = sqrtf(w*w + h*h);
    float diag_aguj = sqrtf(W*W + H*H);
    if (diag_obj <= diag_aguj) {
        printf("CABE\\n");
    } else {
        printf("NO CABE\\n");
    }
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'La diagonal de un rectángulo se calcula con sqrt(a²+b²). Un objeto cabe por un agujero si su diagonal es ≤ la diagonal del agujero. Necesitas #include <math.h>.' },
      { level: 2, label: 'Estructura mental', content: '1) Leer 4 valores: ancho y alto del objeto, ancho y alto del agujero\n2) Calcular diagonal del objeto: sqrt(w² + h²)\n3) Calcular diagonal del agujero: sqrt(W² + H²)\n4) Comparar: si diag_objeto ≤ diag_agujero → "CABE"\n5) Si no → "NO CABE"\nRecuerda: w² en C es w*w, no w^2.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer w, h, W, H\ndiag_objeto = raíz(w×w + h×h)\ndiag_agujero = raíz(W×W + H×H)\nSI diag_objeto ≤ diag_agujero → "CABE"\nSI NO → "NO CABE"' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n#include <math.h>\nint main() {\n    float w, h, W, H;\n    scanf("%f %f %f %f", &w, &h, &W, &H);\n    float diag_obj = sqrtf(/* ¿suma de cuadrados? */);\n    float diag_aguj = sqrtf(/* ¿suma de cuadrados? */);\n    if (/* ¿qué comparar? */) {\n        printf("CABE\\n");\n    } else {\n        printf("NO CABE\\n");\n    }\n    return 0;\n}' },
    ],
    estimatedMinutes: 20,
    tags: ['sqrt', 'math.h', 'diagonal', 'comparación'],
  },

  {
    slug: 'polares',
    title: 'Coordenadas polares con atan2',
    blockId: 7,
    difficulty: 4,
    sourceType: 'real',
    sourceRef: 'PR5/PolaresPR',
    concepts: ['sqrt', 'atan2', 'M_PI', 'math.h', 'conversión radianes-grados'],
    pattern: 'Calcular r con sqrt → calcular θ con atan2 → ajustar a [0, 360) → imprimir',
    patternSteps: [
      'Leer x e y',
      'Calcular r = sqrt(x² + y²)',
      'Calcular θ = atan2(y, x) — devuelve radianes en (-π, π]',
      'Convertir a grados: θ × 180 / π',
      'Si θ < 0, sumar 360 para que quede en [0, 360)',
      'Imprimir r con 3 decimales y θ con 1 decimal',
    ],
    commonMistakes: [
      'Usar atan(y/x) en vez de atan2(y,x) — atan no distingue cuadrantes y falla si x=0',
      'Invertir los argumentos de atan2: es atan2(y, x), NO atan2(x, y)',
      'Olvidar convertir de radianes a grados',
      'No ajustar ángulos negativos (atan2 puede devolver valores en (-π, 0) para Q3 y Q4)',
      'Usar M_PI sin #define _USE_MATH_DEFINES en algunos compiladores',
    ],
    statement: `Lee las coordenadas cartesianas (x, y) y conviértelas a polares (r, θ).

Usa atan2(y, x) de math.h, que gestiona todos los cuadrantes automáticamente (incluido x=0).

  r = sqrt(x² + y²)
  θ = atan2(y, x) convertido a grados

Si θ resulta negativo, súmale 360 para que quede en [0, 360).

Caso especial: si x=0 y y=0, imprime r=0.000 theta=0.0.

Imprime r con 3 decimales y θ con 1 decimal.

Ejemplos:
  (1, 1)    → r=1.414 theta=45.0
  (-3, 3)   → r=4.243 theta=135.0
  (-1, -1)  → r=1.414 theta=225.0
  (1, -1)   → r=1.414 theta=315.0
  (0, 5)    → r=5.000 theta=90.0`,
    inputSpec: 'Dos floats: x e y.',
    outputSpec: '"r=X.XXX theta=X.X"',
    exampleInput: '-3.0 3.0',
    exampleOutput: 'r=4.243 theta=135.0',
    pseudocode: `INICIO
  Leer x, y
  r = raíz(x×x + y×y)
  theta = atan2(y, x)          // radianes en (-π, π]
  theta = theta × 180 / π      // convertir a grados
  SI theta < 0: theta = theta + 360
  Imprimir r (3 decimales) y theta (1 decimal)
FIN`,
    solutionCode: `#include <stdio.h>
#include <math.h>

int main() {
    float x, y, r, theta;
    scanf("%f %f", &x, &y);

    r = sqrtf(x * x + y * y);
    theta = atan2f(y, x) * (180.0f / M_PI);
    if (theta < 0.0f) theta += 360.0f;

    printf("r=%.3f theta=%.1f\\n", r, theta);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'atan2(y, x) es la versión "inteligente" de atan: maneja todos los cuadrantes y el caso x=0 automáticamente. Devuelve radianes en (-π, π]. Solo necesitas convertir a grados y ajustar negativos.' },
      { level: 2, label: 'Estructura mental', content: 'Con atan2 el programa es mucho más simple que con atan:\n1) Calcular r = sqrt(x²+y²)\n2) Calcular θ = atan2(y, x) — ¡ojo! primero y, luego x\n3) Convertir radianes a grados: × 180 / PI\n4) Si θ < 0: sumar 360\nNo necesitas tratar x=0 como caso especial. atan2 lo maneja solo.\nVentaja enorme: sin if anidados para cuadrantes.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer x, y\nr = raíz(x×x + y×y)\ntheta = atan2(y, x) × 180 / π\nSI theta < 0: theta = theta + 360\nImprimir r con 3 decimales y theta con 1 decimal' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n#include <math.h>\nint main() {\n    float x, y, r, theta;\n    scanf("%f %f", &x, &y);\n    r = sqrtf(/* ¿suma de cuadrados? */);\n    theta = atan2f(/* ¿qué va primero, y o x? */) * (180.0f / M_PI);\n    if (/* ¿ángulo negativo? */) theta += 360.0f;\n    printf("r=%.3f theta=%.1f\\n", r, theta);\n    return 0;\n}' },
    ],
    estimatedMinutes: 20,
    tags: ['atan2', 'sqrt', 'M_PI', 'math.h', 'conversión'],
  },

  {
    slug: 'raiz-cuarta',
    title: 'Raíz cuarta por aproximación',
    blockId: 7,
    difficulty: 5,
    sourceType: 'real',
    sourceRef: 'PR7/RaizCuartaPR',
    concepts: ['do-while', 'aproximación iterativa', 'float', 'bucles encadenados'],
    pattern: 'Bucle de unidades → bucle de décimas → bucle de centésimas → resultado',
    patternSteps: [
      'Leer n (número del que calcular raíz cuarta)',
      'Bucle 1: x de 1 a x^4 <= n, paso 1',
      'Bucle 2: desde el x anterior, paso 0.1, mientras x^4 <= n',
      'Bucle 3: desde el x anterior, paso 0.01, mientras x^4 <= n',
      'El último x válido es la raíz cuarta aproximada',
    ],
    commonMistakes: [
      'No guardar el último valor válido antes de que se pase',
      'Usar paso demasiado pequeño desde el inicio (ineficiente)',
      'No encadenar los bucles (cada uno empieza donde paró el anterior)',
    ],
    statement: `Calcula la raíz cuarta de n por aproximación sucesiva.

Método: comienza en x=1, incrementa de 1 en 1 hasta que x^4 > n. Luego retrocede y avanza de 0.1 en 0.1. Luego de 0.01 en 0.01.

El resultado es el mayor x tal que x^4 ≤ n. Imprime con 2 decimales.`,
    inputSpec: 'Un float n > 0.',
    outputSpec: '"Raiz cuarta: X.XX"',
    exampleInput: '100.0',
    exampleOutput: 'Raiz cuarta: 3.16',
    pseudocode: `INICIO
  Leer n
  x = 1.0
  MIENTRAS (x+1)^4 <= n: x += 1
  MIENTRAS (x+0.1)^4 <= n: x += 0.1
  MIENTRAS (x+0.01)^4 <= n: x += 0.01
  Imprimir x
FIN`,
    solutionCode: `#include <stdio.h>

int main() {
    float n, x = 1.0f;
    scanf("%f", &n);
    while ((x+1)*(x+1)*(x+1)*(x+1) <= n) x += 1.0f;
    while ((x+0.1f)*(x+0.1f)*(x+0.1f)*(x+0.1f) <= n) x += 0.1f;
    while ((x+0.01f)*(x+0.01f)*(x+0.01f)*(x+0.01f) <= n) x += 0.01f;
    printf("Raiz cuarta: %.2f\\n", x);
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Aproximación sucesiva: primero buscas por unidades, luego por décimas, luego por centésimas. Cada while avanza un paso más fino. En C no hay ^: para x⁴ usa x*x*x*x.' },
      { level: 2, label: 'Estructura mental', content: '3 bucles while encadenados:\n1) x desde 1, paso 1: mientras (x+1)⁴ ≤ n, avanzar\n2) Desde donde paró, paso 0.1: mientras (x+0.1)⁴ ≤ n, avanzar\n3) Desde donde paró, paso 0.01: mientras (x+0.01)⁴ ≤ n, avanzar\nClave: cada while comprueba el SIGUIENTE valor, no el actual. Al terminar, x es el mayor valor cuya 4ª potencia no supera n.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nx = 1.0\nMIENTRAS (x+1)⁴ ≤ n: x = x + 1\nMIENTRAS (x+0.1)⁴ ≤ n: x = x + 0.1\nMIENTRAS (x+0.01)⁴ ≤ n: x = x + 0.01\nImprimir x con 2 decimales' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\nint main() {\n    float n, x = 1.0f;\n    scanf("%f", &n);\n    while (/* (x+1)*(x+1)*(x+1)*(x+1) ¿condición? */) x += 1.0f;\n    while (/* mismo patrón con paso 0.1 */) x += 0.1f;\n    while (/* mismo patrón con paso 0.01 */) x += 0.01f;\n    printf("Raiz cuarta: %.2f\\n", x);\n    return 0;\n}' },
    ],
    estimatedMinutes: 30,
    tags: ['while', 'aproximación', 'bucles encadenados', 'float'],
  },

  {
    slug: 'centroide-poligono',
    title: 'Centroide del polígono',
    blockId: 7,
    difficulty: 5,
    sourceType: 'real',
    sourceRef: 'PR7/CentroidePoligonoPR',
    concepts: ['array', 'for', 'fórmula compleja', 'geometría', 'acumulación'],
    pattern: 'Leer vértices → cerrar polígono → bucle con fórmula acumulativa → calcular centroide',
    patternSteps: [
      'Leer n vértices (x[i], y[i])',
      'Cerrar el polígono: x[n]=x[0], y[n]=y[0]',
      'Bucle: calcular área acumulada y suma ponderada de x e y',
      'Fórmula: área acumulada (con signo)',
      'Centroide: cx = sumX / (6*área), cy = sumY / (6*área)',
    ],
    commonMistakes: [
      'No cerrar el polígono (falta la última arista)',
      'Olvidar multiplicar por 6 en el denominador del centroide',
      'No tomar el valor absoluto del área',
    ],
    statement: `Lee n vértices de un polígono (x[i], y[i]). Calcula el centroide usando la fórmula de la shoelace:

Área = 0.5 × |Σ(x[i]×y[i+1] − x[i+1]×y[i])|

Cx = Σ((x[i]+x[i+1])×(x[i]×y[i+1]−x[i+1]×y[i])) / (6×Área)
Cy = Σ((y[i]+y[i+1])×(x[i]×y[i+1]−x[i+1]×y[i])) / (6×Área)

Cierra el polígono: x[n]=x[0], y[n]=y[0]. Imprime Cx y Cy con 2 decimales.`,
    inputSpec: 'Un entero n, luego n pares de floats.',
    outputSpec: '"Cx=X.XX Cy=X.XX"',
    exampleInput: '4\n0 0\n4 0\n4 3\n0 3',
    exampleOutput: 'Cx=2.00 Cy=1.50',
    pseudocode: `INICIO
  Leer n, x[n], y[n]
  x[n]=x[0], y[n]=y[0]
  area=0, sumX=0, sumY=0
  PARA i de 0 a n-1:
    cross = x[i]*y[i+1] - x[i+1]*y[i]
    area += cross
    sumX += (x[i]+x[i+1]) * cross
    sumY += (y[i]+y[i+1]) * cross
  area = |area| / 2
  Cx = sumX / (6*area)
  Cy = sumY / (6*area)
  Imprimir Cx, Cy
FIN`,
    solutionCode: `#include <stdio.h>
#include <math.h>

int main() {
    int n, i;
    scanf("%d", &n);
    float x[n+1], y[n+1];
    for (i = 0; i < n; i++) scanf("%f %f", &x[i], &y[i]);
    x[n] = x[0]; y[n] = y[0];

    float area = 0, sumX = 0, sumY = 0;
    for (i = 0; i < n; i++) {
        float cross = x[i]*y[i+1] - x[i+1]*y[i];
        area  += cross;
        sumX  += (x[i] + x[i+1]) * cross;
        sumY  += (y[i] + y[i+1]) * cross;
    }
    area = fabsf(area) / 2.0f;
    printf("Cx=%.2f Cy=%.2f\\n", sumX / (6*area), sumY / (6*area));
    return 0;
}`,
    hints: [
      { level: 1, label: 'Orientación', content: 'Necesitas arrays para los vértices. Cerrar el polígono: x[n]=x[0], y[n]=y[0]. La fórmula de Shoelace calcula área y centroide con un solo bucle acumulando cross, sumX y sumY. fabsf de math.h da valor absoluto float.' },
      { level: 2, label: 'Estructura mental', content: '1) Leer n vértices en arrays x[] e y[] (declarar con tamaño n+1)\n2) Cerrar polígono: x[n]=x[0], y[n]=y[0]\n3) Un bucle de 0 a n-1:\n   - cross = x[i]×y[i+1] − x[i+1]×y[i]\n   - Acumular: area += cross\n   - sumX += (x[i]+x[i+1]) × cross\n   - sumY += (y[i]+y[i+1]) × cross\n4) area = |area| / 2\n5) Cx = sumX / (6×area), Cy = sumY / (6×area)\nEl 6 en el denominador es parte de la fórmula, no olvidarlo.' },
      { level: 3, label: 'Pseudocódigo', content: 'Leer n\nDeclarar x[n+1], y[n+1]\nPARA i de 0 a n-1: Leer x[i], y[i]\nx[n] = x[0], y[n] = y[0]\narea=0, sumX=0, sumY=0\nPARA i de 0 a n-1:\n  cross = x[i]×y[i+1] − x[i+1]×y[i]\n  area += cross\n  sumX += (x[i]+x[i+1]) × cross\n  sumY += (y[i]+y[i+1]) × cross\narea = |area| / 2\nCx = sumX / (6×area)\nCy = sumY / (6×area)\nImprimir Cx, Cy' },
      { level: 4, label: 'Esqueleto en C', content: '#include <stdio.h>\n#include <math.h>\nint main() {\n    int n, i;\n    scanf("%d", &n);\n    float x[n+1], y[n+1];\n    for (i = 0; i < n; i++) scanf("%f %f", &x[i], &y[i]);\n    x[n] = x[0]; y[n] = y[0];\n    float area = 0, sumX = 0, sumY = 0;\n    for (i = 0; i < n; i++) {\n        float cross = /* fórmula con x[i], y[i+1], x[i+1], y[i] */;\n        area += cross;\n        sumX += /* ¿qué multiplicar por cross? */;\n        sumY += /* ¿qué multiplicar por cross? */;\n    }\n    area = fabsf(area) / 2.0f;\n    printf("Cx=%.2f Cy=%.2f\\n", /* ¿fórmula con sumX, sumY, area? */);\n    return 0;\n}' },
    ],
    estimatedMinutes: 40,
    tags: ['array', 'geometría', 'fórmula compleja', 'math.h', 'shoelace'],
  },
];

export function getExercise(slug: string): Exercise | undefined {
  return EXERCISES.find(e => e.slug === slug);
}

export function getExercisesByBlock(blockId: number): Exercise[] {
  return EXERCISES.filter(e => e.blockId === blockId);
}

export function getAllSlugs(): string[] {
  return EXERCISES.map(e => e.slug);
}
