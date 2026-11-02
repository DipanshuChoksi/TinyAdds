import Image from 'next/image';
import Link from 'next/link';
import { EMOTIONS } from '@/data/site';

export default function EmotionRow() {
  return (
    <ul className="list-unstyled d-flex flex-wrap gap-4 justify-content-center mb-0">
      {EMOTIONS.map((e) => (
        <li key={e.slug} className="text-center">
          <Link href={`/emotion/${e.slug}`} className="text-decoration-none text-reset d-block">
            <Image src={e.image} alt="" width={72} height={72} />
            <h3 className="h6 mt-2 mb-0">{e.name}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
