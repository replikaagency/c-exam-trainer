export type DictionaryItem = {
  key: string
  category: string
  meaning: string
  example: string
  exampleExplanation: string
}

export const CATEGORIES = [
  'Basico',
  'Tipos de datos',
  'Entrada / Salida',
  'Operadores',
  'Condiciones',
  'Bucles',
  'Funciones',
  'Matematicas',
  'Arrays',
] as const

export type Category = (typeof CATEGORIES)[number]

export const DICTIONARY: DictionaryItem[] = [
  // ─── BASICO ───
  {
    key: 'variable',
    category: 'Basico',
    meaning:
      'Una caja con nombre donde guardas un dato. Puede ser un numero, una letra... lo que necesites. Le pones un nombre para encontrarla despues.',
    example: 'int edad = 20;',
    exampleExplanation:
      'Creas una caja llamada "edad" y metes el numero 20 dentro.',
  },
  {
    key: '= (igual)',
    category: 'Basico',
    meaning:
      'Sirve para meter un valor dentro de una caja. No es "igual que", es "guarda esto aqui".',
    example: 'edad = 25;',
    exampleExplanation:
      'Mete el numero 25 en la caja "edad". Si antes tenia 20, ahora tiene 25.',
  },
  {
    key: '; (punto y coma)',
    category: 'Basico',
    meaning:
      'Es como un punto al final de una frase. Le dice al ordenador: "esta instruccion ha terminado".',
    example: 'int x = 5;',
    exampleExplanation:
      'El ; al final le dice al ordenador que ya acabaste esa linea.',
  },
  {
    key: '{ } (llaves)',
    category: 'Basico',
    meaning:
      'Son como un paquete. Todo lo que va dentro de las llaves es un grupo de instrucciones que van juntas.',
    example: `if (x > 0) {
  printf("Positivo");
}`,
    exampleExplanation:
      'Las llaves agrupan todo lo que debe pasar cuando x es mayor que 0.',
  },
  {
    key: 'main()',
    category: 'Basico',
    meaning:
      'Es el punto de partida de tu programa. El ordenador siempre empieza a leer desde aqui. Sin main, no arranca nada.',
    example: `int main() {
  printf("Hola");
  return 0;
}`,
    exampleExplanation:
      'Cuando ejecutas tu programa, lo primero que hace es lo que esta dentro de main().',
  },

  // ─── TIPOS DE DATOS ───
  {
    key: 'int',
    category: 'Tipos de datos',
    meaning:
      'Sirve para guardar numeros SIN decimales, como 5, 20 o -3. Si intentas guardar 3.14, se queda solo con el 3.',
    example: 'int edad = 20;',
    exampleExplanation:
      'Creas una caja llamada "edad" que solo guarda numeros enteros, y metes el 20.',
  },
  {
    key: 'float',
    category: 'Tipos de datos',
    meaning:
      'Sirve para guardar numeros CON decimales, como 3.14 o 9.99.',
    example: 'float precio = 9.99;',
    exampleExplanation:
      'Creas una caja llamada "precio" que puede guardar decimales, y metes 9.99.',
  },
  {
    key: 'char',
    category: 'Tipos de datos',
    meaning:
      'Sirve para guardar UNA sola letra o simbolo, como \'A\' o \'?\'. Solo una, no una palabra entera.',
    example: "char letra = 'A';",
    exampleExplanation:
      'Creas una caja llamada "letra" y guardas la letra A. Va entre comillas simples.',
  },

  // ─── ENTRADA / SALIDA ───
  {
    key: 'printf',
    category: 'Entrada / Salida',
    meaning:
      'Muestra un mensaje en la pantalla. Es como decirle al ordenador: "escribe esto para que el usuario lo vea".',
    example: 'printf("Hola mundo");',
    exampleExplanation:
      'Hace que aparezca "Hola mundo" en la pantalla.',
  },
  {
    key: 'scanf',
    category: 'Entrada / Salida',
    meaning:
      'Pide un dato al usuario. El programa se para y espera a que el usuario escriba algo con el teclado.',
    example: 'scanf("%d", &edad);',
    exampleExplanation:
      'El programa espera a que el usuario escriba un numero y lo guarda en la caja "edad".',
  },
  {
    key: '%d',
    category: 'Entrada / Salida',
    meaning:
      'Es un hueco para un numero entero. Se usa dentro de printf o scanf para decir "aqui va un numero".',
    example: 'printf("Tienes %d anios", edad);',
    exampleExplanation:
      'El %d se reemplaza por el valor de "edad". Si edad vale 20, muestra "Tienes 20 anios".',
  },
  {
    key: '%f',
    category: 'Entrada / Salida',
    meaning:
      'Es un hueco para un numero con decimales. Igual que %d pero para numeros con punto decimal.',
    example: 'printf("Precio: %.2f", precio);',
    exampleExplanation:
      'El %f se reemplaza por el valor de "precio". El .2 dice que muestre solo 2 decimales.',
  },
  {
    key: '%s',
    category: 'Entrada / Salida',
    meaning:
      'Es un hueco para un texto (una palabra o frase). Se usa para mostrar o leer palabras.',
    example: 'printf("Hola %s", nombre);',
    exampleExplanation:
      'El %s se reemplaza por el texto de "nombre". Si nombre es "Ana", muestra "Hola Ana".',
  },
  {
    key: '& (ampersand)',
    category: 'Entrada / Salida',
    meaning:
      'Significa "la direccion de esta caja". Se usa en scanf para decirle DONDE guardar lo que el usuario escriba.',
    example: 'scanf("%d", &edad);',
    exampleExplanation:
      'El & le dice a scanf: "guarda el numero en la caja edad". Sin el &, no sabe donde meterlo.',
  },

  // ─── OPERADORES ───
  {
    key: '+ (suma)',
    category: 'Operadores',
    meaning: 'Suma dos numeros. Igual que en matematicas.',
    example: 'int total = 5 + 3;',
    exampleExplanation:
      'Suma 5 y 3, y guarda el resultado (8) en la caja "total".',
  },
  {
    key: '- (resta)',
    category: 'Operadores',
    meaning: 'Resta un numero de otro. Igual que en matematicas.',
    example: 'int resta = 10 - 4;',
    exampleExplanation:
      'Resta 4 de 10 y guarda el resultado (6) en "resta".',
  },
  {
    key: '* (multiplicacion)',
    category: 'Operadores',
    meaning:
      'Multiplica dos numeros. En codigo se usa el asterisco * en vez del simbolo x.',
    example: 'int doble = 5 * 2;',
    exampleExplanation:
      'Multiplica 5 por 2 y guarda el resultado (10) en "doble".',
  },
  {
    key: '/ (division)',
    category: 'Operadores',
    meaning:
      'Divide un numero entre otro. Ojo: si los dos son enteros (int), el resultado NO tiene decimales.',
    example: 'int mitad = 10 / 2;',
    exampleExplanation: 'Divide 10 entre 2 y guarda 5 en "mitad".',
  },
  {
    key: '% (modulo)',
    category: 'Operadores',
    meaning:
      'Te da el RESTO de una division. Ejemplo: 7 entre 2 es 3 y sobra 1. El % te da ese 1.',
    example: 'int resto = 7 % 2;',
    exampleExplanation:
      '7 entre 2 da 3 y sobra 1. El % te da ese resto (1), que se guarda en "resto".',
  },
  {
    key: '== (igual que)',
    category: 'Operadores',
    meaning:
      'Pregunta: "son iguales?". No guarda nada, solo compara. Da verdadero o falso.',
    example: 'if (edad == 18)',
    exampleExplanation:
      'Pregunta: "edad es igual a 18?". Si si, hace lo que esta dentro del if.',
  },
  {
    key: '!= (diferente de)',
    category: 'Operadores',
    meaning:
      'Pregunta: "son diferentes?". Es lo contrario de ==.',
    example: 'if (x != 0)',
    exampleExplanation:
      'Pregunta: "x es diferente de 0?". Si x no es 0, es verdadero.',
  },
  {
    key: '> (mayor que)',
    category: 'Operadores',
    meaning: 'Pregunta: "el de la izquierda es mas grande?".',
    example: 'if (nota > 5)',
    exampleExplanation:
      'Pregunta: "nota es mayor que 5?". Si nota vale 7, si, es verdadero.',
  },
  {
    key: '< (menor que)',
    category: 'Operadores',
    meaning: 'Pregunta: "el de la izquierda es mas pequenio?".',
    example: 'if (edad < 18)',
    exampleExplanation:
      'Pregunta: "edad es menor que 18?". Si edad vale 15, si.',
  },
  {
    key: '>= (mayor o igual)',
    category: 'Operadores',
    meaning:
      'Pregunta: "es mas grande O igual?". Incluye el caso de que sean iguales.',
    example: 'if (nota >= 5)',
    exampleExplanation:
      'Pregunta: "nota es 5 o mas?". Si vale exactamente 5, tambien es verdadero.',
  },
  {
    key: '<= (menor o igual)',
    category: 'Operadores',
    meaning:
      'Pregunta: "es mas pequenio O igual?". Incluye el caso de que sean iguales.',
    example: 'if (edad <= 17)',
    exampleExplanation:
      'Pregunta: "edad es 17 o menos?". Si vale 17, tambien cuenta.',
  },
  {
    key: '&& (y)',
    category: 'Operadores',
    meaning:
      'Significa "Y". Las DOS condiciones tienen que cumplirse para que el resultado sea verdadero.',
    example: 'if (edad >= 18 && edad <= 65)',
    exampleExplanation:
      'Pregunta: "edad es 18 o mas Y a la vez 65 o menos?". Las dos tienen que cumplirse.',
  },
  {
    key: '|| (o)',
    category: 'Operadores',
    meaning:
      'Significa "O". Con que UNA de las dos condiciones se cumpla, ya es suficiente.',
    example: 'if (dia == 6 || dia == 7)',
    exampleExplanation:
      'Pregunta: "dia es 6 O dia es 7?". Si cualquiera de las dos se cumple, es verdadero.',
  },
  {
    key: '! (no)',
    category: 'Operadores',
    meaning:
      'Le da la vuelta. Si algo era verdadero, lo convierte en falso. Y al reves.',
    example: 'if (!encontrado)',
    exampleExplanation:
      'Si "encontrado" es falso (no se encontro), el ! lo convierte en verdadero, y se entra en el if.',
  },

  // ─── CONDICIONES ───
  {
    key: 'if',
    category: 'Condiciones',
    meaning:
      'Significa "SI pasa esto, haz lo siguiente". Mira si algo es verdadero y, si lo es, ejecuta lo de dentro.',
    example: `if (edad >= 18) {
  printf("Eres mayor");
}`,
    exampleExplanation:
      'Si la edad es 18 o mas, muestra "Eres mayor". Si no se cumple, no hace nada.',
  },
  {
    key: 'else',
    category: 'Condiciones',
    meaning:
      'Significa "SI NO se cumple lo anterior, haz esto otro". Va siempre despues de un if.',
    example: `if (edad >= 18) {
  printf("Mayor");
} else {
  printf("Menor");
}`,
    exampleExplanation:
      'Si la edad es 18 o mas, dice "Mayor". Si no, dice "Menor". Siempre pasa una de las dos.',
  },
  {
    key: 'else if',
    category: 'Condiciones',
    meaning:
      'Significa "Y SI TAMPOCO se cumple lo anterior, prueba esta otra condicion". Puedes poner varios seguidos.',
    example: `if (nota >= 9) {
  printf("Sobresaliente");
} else if (nota >= 5) {
  printf("Aprobado");
} else {
  printf("Suspenso");
}`,
    exampleExplanation:
      'Primero mira si nota es 9 o mas. Si no, mira si es 5 o mas. Si tampoco, dice "Suspenso".',
  },

  // ─── BUCLES ───
  {
    key: 'for',
    category: 'Bucles',
    meaning:
      'Repite algo un numero exacto de veces. Tu le dices cuantas veces repetir. Ideal cuando sabes cuantas vueltas dar.',
    example: `for (int i = 0; i < 5; i++) {
  printf("%d ", i);
}`,
    exampleExplanation:
      'Repite 5 veces. Muestra: 0 1 2 3 4. La caja "i" empieza en 0 y sube de uno en uno.',
  },
  {
    key: 'while',
    category: 'Bucles',
    meaning:
      'Repite algo MIENTRAS una condicion sea verdadera. No sabes cuantas veces, para cuando la condicion deje de cumplirse.',
    example: `while (x > 0) {
  x = x - 1;
}`,
    exampleExplanation:
      'Mientras x sea mayor que 0, le resta 1. Cuando x llega a 0, para.',
  },
  {
    key: 'do while',
    category: 'Bucles',
    meaning:
      'Igual que while, pero SIEMPRE ejecuta al menos una vez antes de comprobar la condicion. Primero hace, luego pregunta.',
    example: `do {
  scanf("%d", &n);
} while (n < 0);`,
    exampleExplanation:
      'Pide un numero. Si es negativo, lo vuelve a pedir. Siempre pide al menos una vez.',
  },

  // ─── FUNCIONES ───
  {
    key: 'return',
    category: 'Funciones',
    meaning:
      'Significa "devuelve este resultado y sal". Es como entregar la respuesta final y terminar esa parte del codigo.',
    example: `int doble(int n) {
  return n * 2;
}`,
    exampleExplanation:
      'Recibe un numero, lo multiplica por 2 y devuelve el resultado. Si le pasas 5, devuelve 10.',
  },
  {
    key: 'parametros',
    category: 'Funciones',
    meaning:
      'Son los datos que le pasas a una parte del codigo para que trabaje con ellos. Van entre los parentesis.',
    example: `int suma(int a, int b) {
  return a + b;
}`,
    exampleExplanation:
      '"a" y "b" son los datos que le pasas. Si le pasas 3 y 5, calcula 3 + 5 y devuelve 8.',
  },
  {
    key: 'prototipo',
    category: 'Funciones',
    meaning:
      'Es un aviso que le das al ordenador al principio del codigo: "mas abajo voy a crear algo con este nombre".',
    example: 'int suma(int a, int b);',
    exampleExplanation:
      'Esta linea arriba del todo avisa de que mas abajo existira "suma", que recibe dos numeros y devuelve uno.',
  },

  // ─── MATEMATICAS ───
  {
    key: 'sqrt',
    category: 'Matematicas',
    meaning:
      'Calcula la raiz cuadrada de un numero. Necesitas poner #include <math.h> al principio del archivo.',
    example: 'double r = sqrt(25);',
    exampleExplanation:
      'La raiz cuadrada de 25 es 5. Guarda 5 en la caja "r".',
  },
  {
    key: 'pow',
    category: 'Matematicas',
    meaning:
      'Calcula una potencia: un numero elevado a otro. Ejemplo: 2 elevado a 3 = 2x2x2 = 8.',
    example: 'double r = pow(2, 3);',
    exampleExplanation:
      'Calcula 2 elevado a 3 (2x2x2 = 8) y guarda 8 en "r".',
  },
  {
    key: 'fabs',
    category: 'Matematicas',
    meaning:
      'Quita el signo negativo de un numero. Si es -5, te da 5. Si ya es positivo, lo deja igual.',
    example: 'double r = fabs(-7.5);',
    exampleExplanation:
      'Quita el negativo de -7.5 y guarda 7.5 en "r".',
  },
  {
    key: 'atan2',
    category: 'Matematicas',
    meaning:
      'Calcula el angulo de un punto respecto al centro. Se usa en geometria. El resultado sale en radianes.',
    example: 'double angulo = atan2(1.0, 1.0);',
    exampleExplanation:
      'Calcula el angulo del punto (1, 1), que es 45 grados (sale como 0.785 en radianes).',
  },

  // ─── ARRAYS ───
  {
    key: '[] (corchetes)',
    category: 'Arrays',
    meaning:
      'Se usan para crear una lista de datos del mismo tipo, o para acceder a un dato concreto de esa lista.',
    example: 'int notas[5];',
    exampleExplanation:
      'Crea una lista llamada "notas" con espacio para guardar 5 numeros.',
  },
  {
    key: 'tamanio de un array',
    category: 'Arrays',
    meaning:
      'Es cuantos espacios tiene la lista. Se decide cuando la creas y NO puede cambiar despues.',
    example: 'int notas[3] = {7, 8, 9};',
    exampleExplanation:
      'Crea una lista de 3 posiciones y mete los valores 7, 8 y 9.',
  },
  {
    key: 'acceso por indice',
    category: 'Arrays',
    meaning:
      'Para leer o cambiar un dato de la lista, usas su posicion. MUY IMPORTANTE: la primera posicion es 0, no 1.',
    example: 'notas[0] = 10;',
    exampleExplanation:
      'Cambia el PRIMER dato de la lista "notas" a 10. La posicion 0 es siempre la primera.',
  },
]
