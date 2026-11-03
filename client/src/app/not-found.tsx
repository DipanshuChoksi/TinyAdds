import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-4 fw-bold mb-3">404</h1>
      <p className="lead text-muted mb-4">The page you are looking for does not exist.</p>
      <Link href="/" className="btn btn-primary rounded-pill px-4">
        Return Home
      </Link>
    </div>
  );
}

