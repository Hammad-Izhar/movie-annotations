import type { SetStateAction } from "react";

import clsx from "clsx";

interface AnnotationInputProps {
  selectedRating: number | undefined;
  setSelectedRating: React.Dispatch<SetStateAction<number | undefined>>;
}

const AnnotationInput = ({ selectedRating, setSelectedRating }: AnnotationInputProps) => {
  return (
    <>
      <div className="flex w-96 justify-center items-center gap-2">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-between w-full">
            <span>0</span>
            <span>10</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={0.1}
            className="h-full w-full"
            onPointerUp={(e) => {
              e.currentTarget.classList.remove("active");
              setSelectedRating(undefined);
            }}
            onTouchEnd={(e) => {
              e.currentTarget.classList.remove("active");
              setSelectedRating(undefined);
            }}
            onPointerDown={(e) => {
              e.currentTarget.classList.add("active");
              setSelectedRating(e.currentTarget.valueAsNumber);
            }}
            onChange={(e) => {
              setSelectedRating(e.target.valueAsNumber);
            }}
          />
          <span
            className={clsx("p-4 w-80 text-center", selectedRating ? "bg-green-300" : "bg-red-300")}
          >
            {selectedRating ? `Annotation Recorded: ${selectedRating}` : "No Annotation Recorded"}
          </span>
        </div>
      </div>
    </>
  );
};

export default AnnotationInput;
