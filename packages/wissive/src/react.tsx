/**
 * Wrapper oficial para React — `import { Wissive } from 'wissive/react'`.
 *
 * Es exactamente el patrón documentado en README.md 4.5 (useRef + useEffect
 * + destroy en el cleanup), empaquetado una sola vez para que el consumidor
 * no tenga que escribirlo. `react` es peer dependency opcional: si no está
 * instalada, importar 'wissive' (sin /react) sigue funcionando igual.
 */
import { useEffect, useRef } from 'react';
import { createEmoji } from './index';
import type { WissiveInstance, WissiveOptions } from './index';

export interface WissiveProps extends Omit<WissiveOptions, 'target'> {
  name: string;
}

export function Wissive({ name, ...options }: WissiveProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WissiveInstance | null>(null);

  useEffect(() => {
    if (!slotRef.current) return;

    instanceRef.current = createEmoji(name, { target: slotRef.current, ...options });

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // Solo remonta si cambia el nombre — cambiar una opción suelta (size,
    // sound, etc.) no justifica destruir y recrear la instancia entera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return <div ref={slotRef} />;
}
