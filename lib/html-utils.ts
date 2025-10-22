export function sanitizeHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  const eventAttributes = ['onclick', 'onload', 'onerror', 'onmouseover'];
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    eventAttributes.forEach(attr => {
      if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    });
  });

  return doc.documentElement.outerHTML;
}

export function extractBodyContent(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;
  return body ? body.innerHTML : html;
}

export function generateUniqueId(): string {
  return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function assignIdsToElements(container: HTMLElement): void {
  const elements = container.querySelectorAll('*');
  elements.forEach(el => {
    if (!el.id) {
      el.id = generateUniqueId();
    }
  });
}

export function exportToHTML(stageContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta data-generated-by="editable-html-poster" />
<title>Edited Poster</title>
<style>
body { margin: 0; padding: 0; }
</style>
</head>
<body>
${stageContent}
</body>
</html>`;
}

export function downloadHTML(content: string, filename: string = 'poster.html'): void {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function isTextElement(element: HTMLElement): boolean {
  const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'DIV', 'A', 'STRONG', 'EM', 'LABEL'];
  return textTags.includes(element.tagName);
}

export function isImageElement(element: HTMLElement): boolean {
  return element.tagName === 'IMG';
}
