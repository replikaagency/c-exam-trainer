# C Exam Trainer

Herramienta de entrenamiento para aprobar el examen de programación en C de la asignatura OGM803 (UAL). Cubre las prácticas PR2 a PR7 con 29 ejercicios organizados por dificultad.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Estilos**: Tailwind CSS 4 + shadcn/ui
- **IA**: OpenAI API (gpt-4o-mini) para explicaciones pedagógicas
- **Persistencia**: localStorage (sin backend)
- **Despliegue**: Vercel

## Funcionalidades

- 29 ejercicios alineados con las prácticas reales PR2-PR7
- 3 fases de aprendizaje: Aprender, Practicar, Demostrar
- Sistema de pistas progresivas con escalera de ayuda
- Explicaciones con IA (sin chat libre, contextual al ejercicio)
- Progreso guardado en localStorage
- Semáforo de comprensión y detección de bloques débiles
- Ruta de aprendizaje recomendada
- Modo examen con justificación y evaluación IA

## Arrancar en local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local y añadir tu clave de OpenAI

# Arrancar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Requerida | Descripcion |
|----------|-----------|-------------|
| `OPENAI_API_KEY` | Opcional | Clave de API de OpenAI para las explicaciones con IA. Sin ella, la app funciona pero los botones de IA muestran un mensaje de configuracion. |

## Desplegar en Vercel

1. Sube el repo a GitHub
2. Importa el proyecto en [vercel.com/new](https://vercel.com/new)
3. Configura la variable de entorno `OPENAI_API_KEY` en Settings > Environment Variables
4. Despliega

## Estructura del proyecto

```
app/
  page.tsx          # Home, bloques, selector de fase
  layout.tsx        # Layout raiz
  api/explain/      # Endpoint de IA
components/
  exercise-view.tsx # Vista de ejercicio (3 fases)
  ui/               # Componentes shadcn
lib/
  exercises.ts      # Dataset de 29 ejercicios
  blocks.ts         # 7 bloques tematicos
  types.ts          # Tipos TypeScript
  progress.ts       # Progreso en localStorage
  utils.ts          # Utilidades
```
