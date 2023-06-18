import { useEffect, useState } from "react";

import clsx from "clsx";

type Rating = undefined | 1 | 2 | 3 | 4 | 5;

const AnnotationInput = () => {
  const [selectedRating, setSelectedRating] = useState<Rating>(undefined);

  return (
    <>
      <div className="relative flex h-32 items-center">
        <div
          className={clsx(
            "grid h-full basis-full place-items-center bg-yellow-500",
            selectedRating == 1 ? "ring ring-inset ring-red-500" : ""
          )}
        >
          1
        </div>
        <div
          className={clsx(
            "grid h-full basis-full place-items-center bg-green-500",
            selectedRating == 2 ? "ring ring-inset ring-red-500" : ""
          )}
        >
          2
        </div>
        <div
          className={clsx(
            "grid h-full basis-full place-items-center bg-blue-500",
            selectedRating == 3 ? "ring ring-inset ring-red-500" : ""
          )}
        >
          3
        </div>
        <div
          className={clsx(
            "grid h-full basis-full place-items-center bg-indigo-500",
            selectedRating == 4 ? "ring ring-inset ring-red-500" : ""
          )}
        >
          4
        </div>
        <div
          className={clsx(
            "grid h-full basis-full place-items-center bg-violet-500",
            selectedRating == 5 ? "ring ring-inset ring-red-500" : ""
          )}
        >
          5
        </div>
        <input
          type="range"
          className="absolute h-full w-full"
          onPointerUp={() => setSelectedRating(undefined)}
          onTouchEnd={() => setSelectedRating(undefined)}
          onChange={(e) => {
            const section = Math.floor(e.target.valueAsNumber / 20) + 1;

            if (section < 1) setSelectedRating(1);
            else if (section > 5) setSelectedRating(5);
            else setSelectedRating(section as Rating);
          }}
        />
      </div>
      <span>Selected Rating: {selectedRating ?? "No Rating"}</span>
    </>
  );
};

export default AnnotationInput;
