'use client';

import { useState } from 'react';
import { compose, email, required } from '@/lib/validators';
import type { BlogComment } from '@/src/types';

const GUEST_AVATAR = 'https://html.aqlova.com/listbnb-prv/listbnb/assets/img/avata/avata-8-2.png';

interface Props {
  initialComments: BlogComment[];
}

interface Errors {
  name: string;
  email: string;
  text: string;
}

const EMPTY_ERRORS: Errors = { name: '', email: '', text: '' };

export default function BlogComments({ initialComments }: Props) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [name, setName] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<Errors>(EMPTY_ERRORS);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Errors = {
      name: required('Name')(name),
      email: emailValue.trim() ? compose(email)(emailValue) : '',
      text: required('Comment')(text),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.text) return;

    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setComments((prev) => [...prev, { name: name.trim(), date, avatar: GUEST_AVATAR, text: text.trim() }]);
    setName('');
    setEmailValue('');
    setText('');
  };

  return (
    <>
      <h3 className="lb-cm-title">Comments <em>({String(comments.length).padStart(2, '0')})</em></h3>
      <ul className="lb-comments">
        {comments.map((comment, index) => (
          <li key={`${comment.name}-${index}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={comment.avatar} alt="" className="lb-cm-avatar" loading="lazy" />
            <div className="lb-cm-body">
              <h5>{comment.name} <span>{comment.date}</span></h5>
              <p>{comment.text}</p>
              <a href="#comment-form" className="lb-link"><i className="bi bi-reply me-1"></i>Reply</a>
            </div>
          </li>
        ))}
      </ul>

      <form id="comment-form" className="lb-cm-form" onSubmit={handleSubmit} noValidate>
        <h4 className="lb-cm-title mb-3">Feedback &amp; reviews</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="cm-name" className="visually-hidden">Your name</label>
            <input
              id="cm-name"
              className={`form-control${errors.name ? ' is-invalid' : ''}`}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'cm-name-error' : undefined}
            />
            {errors.name && <div id="cm-name-error" className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="cm-email" className="visually-hidden">Your email</label>
            <input
              id="cm-email"
              type="email"
              className={`form-control${errors.email ? ' is-invalid' : ''}`}
              placeholder="Your email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'cm-email-error' : undefined}
            />
            {errors.email && <div id="cm-email-error" className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="cm-text" className="visually-hidden">Your comment</label>
            <textarea
              id="cm-text"
              rows={5}
              className={`form-control${errors.text ? ' is-invalid' : ''}`}
              placeholder="Write your comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-invalid={Boolean(errors.text)}
              aria-describedby={errors.text ? 'cm-text-error' : undefined}
            />
            {errors.text && <div id="cm-text-error" className="invalid-feedback">{errors.text}</div>}
          </div>
          <div className="col-12">
            <button type="submit" className="btn lb-btn-primary px-4">Post Comment</button>
          </div>
        </div>
      </form>
    </>
  );
}
