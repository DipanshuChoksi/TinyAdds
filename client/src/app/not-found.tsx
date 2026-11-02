import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container text-center py-5">
      <h1 className="display-3">404</h1>
      <p className="lead">This page could not be found.</p>
      <Link href="/" className="btn btn-primary rounded-pill">Back to home</Link>
    </main>
  );
}
