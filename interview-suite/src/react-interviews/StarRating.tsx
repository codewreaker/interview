/**
 * Interview Question: Star Rating Component
 * 
 * Difficulty: Mid–Senior
 * Time: 45–60 min
 * Skills: React Hooks, State Management, Accessibility, Event Handling
 * Tests: 18 total
 * 
 * Objective:
 * Implement a fully functional Star Rating component in React. The component renders 5 stars
 * that respond to hover, click, and keyboard input. It must support full-star and half-star
 * precision, persist selections, revert gracefully on mouse leave, and be fully keyboard-accessible—
 * all driven by a clean two-state model.
 * 
 * Requirements:
 * 1. Hover Behaviour — Stars fill up to the hovered index. Moving the cursor to the left half
 *    of a star should preview a half-star value. Leaving the widget reverts to the last committed value.
 * 
 * 2. Persist on Click — Clicking a star commits that value. Subsequent hover/leave cycles must
 *    revert to this committed value, not the original prop. Clicking the same star again resets to 0.
 * 
 * 3. Half-Star Mode — When steps=0.5 is passed, clicking or hovering the left half of any star
 *    selects idx + 0.5. Right half selects idx + 1.
 * 
 * 4. Keyboard Accessibility — → increases by steps, ← decreases by steps. Numeric keys 1–5 jump
 *    directly. Min 0, max 5.
 * 
 * 5. Prop Sync — If the value prop changes externally (optimistic UI pattern), both display and
 *    committed state must update to reflect the new prop.
 * 
 * 6. Custom Icons — The component accepts custom SVG paths for emptyIcon, halfFilledIcon, and
 *    filledIcon. All icon logic must derive from the value, not be hardcoded.
 */

import React, { useMemo, useState, useEffect } from "react";

export interface StarRatingProps {
  value?: number;
  emptyIcon?: string;
  halfFilledIcon?: string;
  filledIcon?: string;
  steps?: number;
  onChange?: (value: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  emptyIcon = "⭐",
  halfFilledIcon = "✨",
  filledIcon = "🌟",
  steps = 1,
  onChange,
}) => {
  // TODO: Implement the star rating component
  
  /*
  // State Model:
  // - starValue: display state, changes on hover, ephemeral, never persisted on its own
  // - committedValue: saved state, only changes on click or keypress
  //   handleMouseLeave always resets starValue back to committedValue, not to the prop
  
  const [starValue, setStarValue] = useState(value);
  const [committedValue, setCommittedValue] = useState(value);

  // Sync state when the `value` prop changes externally (optimistic UI)
  useEffect(() => {
    setStarValue(value);
    setCommittedValue(value);
  }, [value]);

  // Detect if mouse is on left half of star element
  const isLessThanHalf = (e: React.MouseEvent<HTMLDivElement>): boolean => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return Math.round(Math.abs(e.clientX - rect.left)) <= rect.width / 2;
  };

  // Derive filled stars array from starValue using useMemo
  // Result: array of 5 items, each 0 | 0.5 | 1
  // Hint: use remainder approach — avoid arr[i] = i % 1 || 1 (always returns 1)
  const filledStars = useMemo(() => {
    const arr = new Array(5).fill(0);
    for (let i = 0; i < 5; i++) {
      const remainder = starValue - i;
      if (remainder >= 1) arr[i] = 1;
      else if (remainder >= 0.5) arr[i] = 0.5;
    }
    return arr;
  }, [starValue]);

  // handleMouseMove — updates display state only, respects `steps`
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const idx = Number((e.currentTarget as HTMLElement).dataset.rating);
    const newValue =
      steps === 0.5 && isLessThanHalf(e)
        ? idx + 0.5
        : idx + 1;
    setStarValue(newValue);
  };

  // handleMouseLeave — reverts display to last committed value
  const handleMouseLeave = (): void => {
    setStarValue(committedValue);
  };

  // handleClick — commits the new value (both states)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const idx = Number((e.currentTarget as HTMLElement).dataset.rating);
    const newValue =
      steps === 0.5 && isLessThanHalf(e)
        ? idx + 0.5
        : idx + 1;
    
    // Toggle: if clicking same star, reset to 0
    const finalValue = committedValue === newValue ? 0 : newValue;
    
    setStarValue(finalValue);
    setCommittedValue(finalValue);
    onChange?.(finalValue);
  };

  // handleKeyDown — ArrowRight, ArrowLeft, numeric 1-5, respects steps
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "ArrowRight") {
      const newValue = Math.min(5, committedValue + steps);
      setStarValue(newValue);
      setCommittedValue(newValue);
      onChange?.(newValue);
    } else if (e.key === "ArrowLeft") {
      const newValue = Math.max(0, committedValue - steps);
      setStarValue(newValue);
      setCommittedValue(newValue);
      onChange?.(newValue);
    } else if (!isNaN(Number(e.key)) && Number(e.key) <= 5) {
      const newValue = Number(e.key);
      setStarValue(newValue);
      setCommittedValue(newValue);
      onChange?.(newValue);
    }
  };

  // returnSVG — maps 0 → empty, 0.5 → half, 1 → filled
  const returnSVG = (val: number): string => {
    if (val === 0.5) return halfFilledIcon;
    if (val === 1) return filledIcon;
    return emptyIcon;
  };

  return (
    <div
      tabIndex={0}
      className="star-rating"
      data-testid="star-rating-container"
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-label={`Star rating: ${committedValue} out of 5`}
      aria-valuenow={committedValue}
      aria-valuemin={0}
      aria-valuemax={5}
    >
      {filledStars.map((val, idx) => (
        <div
          key={idx}
          className="rating-star"
          data-rating={idx}
          data-testid="rating-icon"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          role="presentation"
        >
          {returnSVG(val)}
        </div>
      ))}
    </div>
  );
  */

  return (
    <div
      tabIndex={0}
      className="star-rating"
      data-testid="star-rating-container"
      role="slider"
      aria-label="Star rating"
    >
      {/* Render 5 stars */}
      {[0, 1, 2, 3, 4].map((idx) => (
        <div
          key={idx}
          className="rating-star"
          data-rating={idx}
          data-testid="rating-icon"
        >
          ⭐
        </div>
      ))}
    </div>
  );
};

export default StarRating;

/**
 * Implementation Checklist:
 * 
 * ✓ State Setup
 *   - [ ] starValue (display state)
 *   - [ ] committedValue (persistent state)
 * 
 * ✓ Sync Prop Changes
 *   - [ ] useEffect to sync when value prop changes
 * 
 * ✓ Helper: isLessThanHalf(event)
 *   - [ ] Use getBoundingClientRect + clientX
 *   - [ ] Returns true if mouse is on left half of element
 * 
 * ✓ Memoized filledStars Array
 *   - [ ] Derive from starValue
 *   - [ ] Return array of 5 items: 0 | 0.5 | 1
 *   - [ ] Use remainder approach (not arr[i] % 1 || 1)
 * 
 * ✓ Event Handlers
 *   - [ ] handleMouseMove: update starValue, respect steps
 *   - [ ] handleMouseLeave: revert to committedValue
 *   - [ ] handleClick: persist both states, toggle on same star
 *   - [ ] handleKeyDown: arrows (±steps), numeric 1-5, clamped 0-5
 * 
 * ✓ Icon Mapping
 *   - [ ] returnSVG(val): 0.5 → half, 1 → filled, else empty
 * 
 * ✓ Rendering
 *   - [ ] Container div with tabIndex, data-testid, event handlers
 *   - [ ] 5 stars mapped from filledStars array
 *   - [ ] Each star has data-rating, data-testid
 *   - [ ] Use appropriate SVG/icon for each star value
 * 
 * ✓ Accessibility
 *   - [ ] role="slider" on container
 *   - [ ] aria-label, aria-valuenow, aria-valuemin, aria-valuemax
 *   - [ ] Keyboard support (arrow keys, numeric keys)
 * 
 * Hints:
 * - Mouse leave flicker: Put onMouseLeave on container, not each star
 * - data-rating is 0-based: first star is index 0, full value = idx + 1, half = idx + 0.5
 * - Keyboard: Attach onKeyDown to container div (which has tabIndex="0")
 * - Read and write committedValue in keyboard handler, not starValue
 */
