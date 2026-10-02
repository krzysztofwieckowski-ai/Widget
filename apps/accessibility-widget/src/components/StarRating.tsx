import { useState } from 'react';
import type { Translation } from '../i18n';
import { StarIcon } from './icons';

type StarRatingProps = { t: Translation };

const STARS = [1, 2, 3, 4, 5];

/**
 * 1–5 star call rating. Built on native radio buttons, so arrow keys and
 * screen readers work out of the box; the stars are just their visual labels.
 * Frontend only: the rating is kept in state and not sent anywhere.
 */
export default function StarRating({ t }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const shown = hovered || rating;

  return (
    <fieldset className="rating">
      <legend className="rating-legend">{t.rateCall}</legend>

      <div className="rating-stars" onMouseLeave={() => setHovered(0)}>
        {STARS.map((stars) => (
          <label key={stars} className={`rating-star${stars <= shown ? ' is-filled' : ''}`} onMouseEnter={() => setHovered(stars)}>
            <input
              type="radio"
              name="call-rating"
              value={stars}
              checked={rating === stars}
              onChange={() => setRating(stars)}
              className="visually-hidden"
            />
            <StarIcon filled={stars <= shown} />
            <span className="visually-hidden">{t.starLabel(stars)}</span>
          </label>
        ))}
      </div>

      <p className="rating-status" role="status">
        {rating > 0 && t.ratingThanks(rating)}
      </p>
    </fieldset>
  );
}
