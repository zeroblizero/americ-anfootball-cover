import { useState } from 'react';
import quotes from '../data/quotes.json';

export default function QuoteBanner() {
  const [quote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  );

  return (
    <div className="quote-banner">
      <blockquote>
        <p>&ldquo;{quote.lyric}&rdquo;</p>
        <cite>— {quote.song}</cite>
      </blockquote>
    </div>
  );
}
