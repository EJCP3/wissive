// Ejemplo de integración con React — Fase 7 de requerimientos.md
//
// Esto ya existe empaquetado: `import { Wissive } from 'wissive/react'`
// (ver src/react.tsx) es exactamente este mismo componente. Este archivo
// queda como referencia del patrón manual, para quien prefiera no depender
// del wrapper o necesite algo más custom.
//
// Patrón: useRef para el nodo destino + useEffect que monta en el efecto y
// destruye en el cleanup. Sin esto, cada remount (StrictMode, HMR, o el
// propio usuario navegando) deja un RAF y listeners de mousemove colgando.
import { useEffect, useRef } from 'react';
import { createEmoji, type WissiveInstance, type WissiveOptions } from 'wissive';

interface WissiveEmojiProps extends Omit<WissiveOptions, 'target'> {
  name: string;
}

export function WissiveEmoji({ name, ...options }: WissiveEmojiProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WissiveInstance | null>(null);

  useEffect(() => {
    if (!slotRef.current) return;

    instanceRef.current = createEmoji(name, { target: slotRef.current, ...options });

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo remonta si cambia el nombre
  }, [name]);

  return <div ref={slotRef} />;
}

// Uso:
// <WissiveEmoji name="mochi" size="lg" sound />
