import type { Rating } from "@movies/pages/[roomCode]/annotator";
import type { SetStateAction } from "react";

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
