import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Eres un asistente pedagógico dentro de una app para aprender programación en C desde cero.

Tu trabajo NO es resolver ejercicios directamente.
Tu trabajo es ayudar a entenderlos paso a paso, con lenguaje claro, humano y nada intimidante.

Perfil del usuario:
- no tiene ni idea de C o sabe muy poco
- se bloquea fácilmente
- se agobia con palabras técnicas
- necesita explicaciones simples, breves y útiles
- no debe sentirse juzgado

Reglas:
- explica como si ayudaras a un amigo
- usa frases cortas
- no uses jerga innecesaria
- no des la solución completa salvo que ya esté visible
- no escribas demasiado (máximo 200 palabras)
- no digas "incorrecto", "error", "inválido"
- valida lo que sí va bien antes de señalar lo que falta
- céntrate en desbloquear
- responde siempre en español

Estructura de respuesta:

1. Qué está pasando
2. Qué idea clave debes entender
3. Qué haría ahora paso a paso`;

interface ExplainRequest {
  exercise: {
    title: string;
    blockId: number;
    difficulty: number;
    pattern: string;
    patternSteps: string[];
    statement: string;
    concepts: string[];
    hints: { level: number; label: string; content: string }[];
  };
  userAttempt?: string;
  justification?: string;
  hintsRevealed?: number;
  mode: 'explain' | 'start' | 'review' | 'exam_explain';
}

function buildUserMessage(data: ExplainRequest): string {
  const { exercise, userAttempt, hintsRevealed, mode } = data;

  let context = `Ejercicio: ${exercise.title}
Dificultad: ${exercise.difficulty}/5
Patrón que practica: ${exercise.pattern}
Conceptos: ${exercise.concepts.join(', ')}

Enunciado:
${exercise.statement}`;

  if (hintsRevealed && hintsRevealed > 0) {
    const revealedHints = exercise.hints.slice(0, hintsRevealed);
    context += `\n\nPistas que ya ha visto el alumno:\n${revealedHints.map(h => `- ${h.label}: ${h.content}`).join('\n')}`;
  }

  if (mode === 'explain') {
    context += '\n\nEl alumno no entiende el ejercicio. Explícale qué le están pidiendo en lenguaje muy simple. No des código. Explica la idea, no la implementación.';
  } else if (mode === 'start') {
    context += '\n\nEl alumno no sabe por dónde empezar. Guíale con los primeros pasos concretos SIN darle código. Dile qué tiene que pensar primero, qué variables necesita, qué estructura usar.';
  } else if (mode === 'review') {
    context += `\n\nEl alumno ha escrito este intento:\n\`\`\`c\n${userAttempt || '(vacío)'}\n\`\`\`\n\nRevisa su intento. Primero di qué va bien. Luego señala qué le falta o qué podría mejorar. No le des la solución completa, solo la dirección correcta.`;
  } else if (mode === 'exam_explain') {
    context += `\n\n${data.justification ? `El alumno ha justificado así su código:\n"${data.justification}"\n\n` : ''}El alumno quiere saber cómo explicar este ejercicio en un examen oral o escrito. Genera una explicación de máximo 5 frases que:
1. Explique la idea general del programa (1 frase)
2. Justifique por qué se usa cada parte clave (if, for, while, etc.) (2 frases)
3. Diga cómo lo expresaría un alumno en un examen (2 frases)

Usa lenguaje simple, directo, tipo: "Uso un if porque no todos los casos se tratan igual. Primero valido los datos. Después hago el cálculo."
No uses jerga. No escribas código. Solo la explicación que el alumno diría en voz alta.`;
  }

  return context;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'La clave de OpenAI no está configurada. Añade OPENAI_API_KEY en .env.local' },
      { status: 500 }
    );
  }

  let body: ExplainRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
  }

  if (!body.exercise || !body.mode) {
    return NextResponse.json({ error: 'Faltan datos del ejercicio' }, { status: 400 });
  }

  const userMessage = buildUserMessage(body);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', errText);
      return NextResponse.json(
        { error: 'No se pudo conectar con el servicio de explicaciones. Inténtalo de nuevo.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || 'No se pudo generar la explicación.';

    return NextResponse.json({ explanation });
  } catch (err) {
    console.error('Explain API error:', err);
    return NextResponse.json(
      { error: 'Algo salió mal al generar la explicación. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}
