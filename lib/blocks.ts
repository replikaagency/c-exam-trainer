import { Block } from './types';

// Bloques alineados con el programa real PR2–PR7 (OGM803-UAL)
export const BLOCKS: Block[] = [
  {
    id: 1,
    title: 'Leer y mostrar datos',
    description: 'Empiezas aquí. Aprenderás a pedirle datos al usuario y a mostrar resultados con formato. Sin condiciones, sin bucles — solo entrada, cálculo y salida.',
    concepts: ['printf', 'scanf', '#define', 'int', 'float', 'operaciones aritméticas', '%.2f', 'fórmula directa'],
  },
  {
    id: 2,
    title: 'Decidir con condiciones',
    description: 'Tu programa ya no hace siempre lo mismo: aprende a tomar decisiones con if y else. También aprenderás a detectar datos incorrectos antes de calcular.',
    concepts: ['if', 'else if', 'else', 'rangos', 'clasificación', '%2==0', 'par/impar', 'cuadrante'],
  },
  {
    id: 3,
    title: 'Menús y opciones con switch',
    description: 'Cuando hay varias opciones claras (elige 1, 2 o 3), el switch es más limpio que muchos if. Aquí practicas menús y conversiones con múltiples casos.',
    concepts: ['switch', 'case', 'break', 'default', 'char', 'toupper', 'menú'],
  },
  {
    id: 4,
    title: 'Repetir con bucles',
    description: 'Aquí tu programa empieza a hacer cosas muchas veces: contar, sumar, dibujar patrones. Dominar for y while es la clave de este bloque.',
    concepts: ['for', 'for anidado', 'while', 'centinela', 'acumulador', 'patrón numérico', 'media'],
  },
  {
    id: 5,
    title: 'Funciones propias',
    description: 'En vez de poner todo en main, aprendes a crear tus propias funciones: reciben datos, calculan y devuelven un resultado. Esto hace tu código más limpio y reutilizable.',
    concepts: ['funciones', 'return', 'parámetros', 'prototipo', 'do-while'],
  },
  {
    id: 6,
    title: 'Arrays y búsqueda',
    description: 'Guardas muchos datos en un array y los recorres. Aquí calculas estadísticas, buscas valores y resuelves problemas que necesitan guardar información.',
    concepts: ['array', 'for sobre arrays', 'min', 'max', 'acumulación', 'fuerza bruta'],
  },
  {
    id: 7,
    title: 'Problemas completos',
    description: 'Los ejercicios más completos: combinan arrays, fórmulas, bucles y condiciones. Es lo que más se parece a un examen real.',
    concepts: ['VLA', 'sqrt', 'atan2', 'math.h', 'geometría', 'aproximación iterativa'],
  },
];

export function getBlock(id: number): Block | undefined {
  return BLOCKS.find(b => b.id === id);
}
