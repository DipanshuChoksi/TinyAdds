function decodeHtmlEntities(value: string) {
  return value.replace(
    /&(#x[\da-f]{1,6}|#\d{1,7}|amp|lt|gt|quot|apos|nbsp);/gi,
    (entity, reference: string) => {
      if (reference[0] === '#') {
        const codePoint = reference[1].toLowerCase() === 'x'
          ? Number.parseInt(reference.slice(2), 16)
          : Number.parseInt(reference.slice(1), 10);
        return codePoint > 0 && codePoint <= 0x10ffff
          ? String.fromCodePoint(codePoint)
          : entity;
      }

      const entities: Record<string, string> = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
        nbsp: ' ',
      };
      return entities[reference.toLowerCase()] ?? entity;
    },
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function plainTextToHtml(value: string, pageTitle: string) {
  const blocks = value
    .replace(/\r\n?/g, '\n')
    .trim()
    .split(/\n\s*\n+/)
    .map((block) => block.split('\n').map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0);

  if (blocks.length && normalizeTitle(blocks[0].join(' ')) === normalizeTitle(pageTitle)) {
    blocks.shift();
  }

  return blocks.map((lines) => {
    const text = lines.join(' ');
    if (/^\d+[.)]\s/.test(text)) {
      return `<h2>${escapeHtml(text)}</h2>`;
    }

    if (/^[-*•]\s+/.test(lines[0])) {
      const items: string[] = [];
      for (const line of lines) {
        if (/^[-*•]\s+/.test(line)) {
          items.push(line.replace(/^[-*•]\s+/, ''));
        } else if (items.length) {
          items[items.length - 1] += ` ${line}`;
        }
      }
      return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    }

    return `<p>${escapeHtml(text)}</p>`;
  }).join('');
}

function stripDuplicateLeadingTitle(content: string, pageTitle: string) {
  const firstBlock = content.match(/^\s*<(p|div|h[1-6])\b[^>]*>([\s\S]*?)<\/\1>\s*/i);
  if (!firstBlock) return content;

  const firstText = decodeHtmlEntities(firstBlock[2].replace(/<[^>]*>/g, ''));
  return normalizeTitle(firstText) === normalizeTitle(pageTitle)
    ? content.slice(firstBlock[0].length)
    : content;
}

function formatNumberedHeadings(content: string) {
  return content.replace(/<(p|div)\b[^>]*>([\s\S]*?)<\/\1>/gi, (block, _tag: string, inner: string) => {
    const text = decodeHtmlEntities(inner.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
    return /^\d+[.)]\s/.test(text) ? `<h2>${escapeHtml(text)}</h2>` : block;
  });
}

export function formatCmsContent(content: string, pageTitle: string) {
  const preContent = content.match(/^\s*<pre\b[^>]*>([\s\S]*?)<\/pre>\s*$/i);
  const plainText = preContent
    ? preContent[1]
    : /<[a-z][^>]*>/i.test(content)
      ? null
      : content;

  if (plainText !== null) {
    const decodedText = decodeHtmlEntities(plainText);
    if (!/<[^>]+>/.test(decodedText)) {
      return plainTextToHtml(decodedText, pageTitle);
    }
  }

  return formatNumberedHeadings(stripDuplicateLeadingTitle(content, pageTitle));
}
