function decodeEntities(value: string) {
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

function getDivContentByClass(markup: string, className: string) {
  const openings = /<div\b[^>]*>/gi;
  let opening: RegExpExecArray | null;

  while ((opening = openings.exec(markup)) !== null) {
    const classAttribute = opening[0].match(/\bclass\s*=\s*(["'])(.*?)\1/i);
    if (!classAttribute?.[2].split(/\s+/).includes(className)) continue;

    const divTags = /<\/?div\b[^>]*>/gi;
    divTags.lastIndex = openings.lastIndex;
    let depth = 1;
    let tag: RegExpExecArray | null;

    while ((tag = divTags.exec(markup)) !== null) {
      if (/^<\/div/i.test(tag[0])) {
        depth -= 1;
        if (depth === 0) {
          return markup.slice(openings.lastIndex, tag.index);
        }
      } else if (!/\/>$/.test(tag[0])) {
        depth += 1;
      }
    }

    return null;
  }

  return null;
}

function normalizeText(value: string) {
  return decodeEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function removePageTitleHeadings(markup: string, pageTitle: string) {
  const normalizedTitle = normalizeText(pageTitle).toLowerCase();
  return markup.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (heading, _level: string, inner: string) => (
    normalizeText(inner).toLowerCase() === normalizedTitle ? '' : heading
  ));
}

function renderQuestionSequence(value: string) {
  const questionWord = /\b(?:What|Do|How|Is|Can|Why|Which|Will|Who|Where|When|Does|Are|Did|Should|Could)\b/g;
  const questions: Array<{ start: number; end: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = questionWord.exec(value)) !== null) {
    const end = value.indexOf('?', match.index);
    if (end < match.index || end - match.index > 180) continue;

    questions.push({ start: match.index, end });
    questionWord.lastIndex = end + 1;
  }

  if (!questions.length) return null;

  const prefix = value.slice(0, questions[0].start).trim();
  const category = prefix.match(/(?:^|\s)(\d+[.)]\s*[^?]+)$/);
  const output: string[] = [];

  if (category) {
    output.push(`<h2>${escapeHtml(category[1].trim())}</h2>`);
  } else if (prefix) {
    output.push(`<p>${escapeHtml(prefix)}</p>`);
  }

  questions.forEach((question, index) => {
    const nextStart = questions[index + 1]?.start ?? value.length;
    const title = value.slice(question.start, question.end + 1).trim();
    const answer = value.slice(question.end + 1, nextStart).trim();
    if (!title || !answer) return;

    output.push(
      `<details class="faq-item"><summary>${escapeHtml(title)}</summary><div class="faq-answer"><p>${escapeHtml(answer)}</p></div></details>`,
    );
  });

  return output.length ? output.join('') : null;
}

function formatFlattenedBlocks(markup: string) {
  return markup.replace(/<(p|h2)\b[^>]*>([\s\S]*?)<\/\1>/gi, (block, _tag: string, inner: string) => {
    const questions = renderQuestionSequence(normalizeText(inner));
    return questions ?? block;
  });
}

function formatSemanticQuestions(markup: string) {
  return markup.replace(
    /<h3\b[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h[1-3]\b|$)/gi,
    (block, question: string, answer: string) => (
      answer.trim()
        ? `<details class="faq-item"><summary>${question}</summary><div class="faq-answer">${answer}</div></details>`
        : block
    ),
  );
}

function formatPlainText(value: string) {
  const blocks = value
    .replace(/\r\n?/g, '\n')
    .trim()
    .split(/\n\s*\n+/)
    .map((block) => block.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  return blocks.map((block) => (
    renderQuestionSequence(block) ?? `<p>${escapeHtml(block)}</p>`
  )).join('');
}

export interface FaqCategory {
  id: string;
  title: string;
  contentHtml: string;
}

export interface FormattedFaqContent {
  introHtml: string;
  beforeHtml: string;
  categories: FaqCategory[];
  afterHtml: string;
}

function splitFaqCategories(markup: string) {
  const headings = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const numberedHeadings: Array<{ index: number; end: number; title: string }> = [];
  let heading: RegExpExecArray | null;

  while ((heading = headings.exec(markup)) !== null) {
    const title = normalizeText(heading[1]);
    if (/^\d+[.)]\s/.test(title)) {
      numberedHeadings.push({
        index: heading.index,
        end: headings.lastIndex,
        title,
      });
    }
  }

  if (!numberedHeadings.length) {
    return { beforeHtml: markup, categories: [], afterHtml: '' };
  }

  const categories: FaqCategory[] = [];
  let afterHtml = '';

  numberedHeadings.forEach((current, index) => {
    if (afterHtml) return;

    const nextCategory = numberedHeadings[index + 1];
    const nextHeading = /<h2\b[^>]*>[\s\S]*?<\/h2>/gi;
    nextHeading.lastIndex = current.end;
    const otherHeading = nextHeading.exec(markup);
    const end = nextCategory?.index ?? otherHeading?.index ?? markup.length;

    categories.push({
      id: `faq-category-${categories.length + 1}`,
      title: current.title,
      contentHtml: markup.slice(current.end, end),
    });

    if (!nextCategory && otherHeading) {
      afterHtml = markup.slice(otherHeading.index);
    }
  });

  return {
    beforeHtml: markup.slice(0, numberedHeadings[0].index),
    categories,
    afterHtml,
  };
}

export function formatFaqContent(content: string, pageTitle: string) {
  const titleRow = getDivContentByClass(content, 'titleRow');
  const contentSection = getDivContentByClass(content, 'content');
  const introHtml = titleRow ? removePageTitleHeadings(titleRow, pageTitle).trim() : '';
  let body = contentSection ?? content;

  const preContent = body.match(/^\s*<pre\b[^>]*>([\s\S]*?)<\/pre>\s*$/i);
  const plainText = preContent
    ? preContent[1]
    : /<[a-z][^>]*>/i.test(body)
      ? null
      : body;

  if (plainText !== null) {
    body = formatPlainText(decodeEntities(plainText));
  } else {
    body = removePageTitleHeadings(body, pageTitle);
    body = formatFlattenedBlocks(body);
    body = formatSemanticQuestions(body);
  }

  return {
    introHtml,
    ...splitFaqCategories(body),
  };
}
