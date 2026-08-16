const TOKEN = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|default|const|let|var|new|function|return|class|extends|if|else|true|false|null|undefined|async|await|typeof)\b/g;

export function highlightCode(el: HTMLElement): void {
  const raw = el.textContent || '';
  const escaped = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  el.innerHTML = escaped.replace(TOKEN, (_m, com, str, kw) => {
    if (com) return `<span class="tok-com">${com}</span>`;
    if (str) return `<span class="tok-str">${str}</span>`;
    if (kw) return `<span class="tok-kw">${kw}</span>`;
    return _m;
  });
}

export function initSyntaxHighlighting(): void {
  document.querySelectorAll<HTMLElement>('.code-block code').forEach(highlightCode);
}
