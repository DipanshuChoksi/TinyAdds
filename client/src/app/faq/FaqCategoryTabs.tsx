"use client";

import { useState } from 'react';
import type { FaqCategory } from '@/lib/formatFaqContent';
import styles from './faq.module.css';

export default function FaqCategoryTabs({ categories }: { categories: FaqCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '');
  const activeCategory = categories.find((category) => category.id === activeId);

  if (!categories.length || !activeCategory) return null;

  return (
    <>
      <div className={styles.categoryTabs} role="group" aria-label="FAQ categories" tabIndex={0}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={styles.categoryTab}
            aria-pressed={category.id === activeId}
            onClick={() => setActiveId(category.id)}
          >
            {category.title}
          </button>
        ))}
      </div>

      <section
        key={activeCategory.id}
        className={styles.categoryPanel}
        aria-label={activeCategory.title}
        dangerouslySetInnerHTML={{ __html: activeCategory.contentHtml }}
      />
    </>
  );
}
