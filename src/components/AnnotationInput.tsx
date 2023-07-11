import type { Rating } from "@movies/pages/[roomCode]/annotator";
import type { SetStateAction } from "react";

import clsx from "clsx";

interface AnnotationInputProps {
  selectedRating: Rating;
  setSelectedRating: React.Dispatch<SetStateAction<Rating>>;
}
const convertInputToRating = (rawInput: number): Rating => {
  const normalizedInput = Math.floor(rawInput / 20) + 1;

  if (normalizedInput < 1) return 1;
  if (normalizedInput > 5) return 5;

  return normalizedInput as Rating;
};

const AnnotationInput = ({ selectedRating, setSelectedRating }: AnnotationInputProps) => {
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
          onPointerDown={(e) => {
            setSelectedRating(convertInputToRating(e.currentTarget.valueAsNumber));
          }}
          onChange={(e) => {
            setSelectedRating(convertInputToRating(e.target.valueAsNumber));
          }}
        />
      </div>
      <span>Selected Rating: {selectedRating ?? "No Rating"}</span>
    </>
  );
};

export default AnnotationInput;
