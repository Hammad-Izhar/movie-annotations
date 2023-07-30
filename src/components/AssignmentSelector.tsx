import type Ably from "ably/promises";

import { useRef } from "react";

interface AssignmentSelectorProps {
  userId: string;
  userName: string;
  characters: string[];
  emotions: string[];
  ablyChannel?: Ably.Types.RealtimeChannelPromise;
}

const AssignmentSelector = ({
  userId,
  userName,
  characters,
  emotions,
  ablyChannel,
}: AssignmentSelectorProps) => {
  const characterRef = useRef<HTMLSelectElement>(null);
  const emotionRef = useRef<HTMLSelectElement>(null);

  return (
    <li className="flex gap-2 items-center justify-center">
      <span>{userName}</span>
      <div className="flex">
        <select ref={characterRef}>
          {characters.map((character) => (
            <option key={character}>{character}</option>
          ))}
        </select>
        <select ref={emotionRef}>
          {emotions.map((emotion) => (
            <option className="capitalize" key={emotion}>
              {emotion}
            </option>
          ))}
        </select>
        {/* TODO: Update database schema, characters should have a name and a pfp */}
        <button
          className="btn"
          onClick={() => {
            void ablyChannel?.publish("assignment", {
              for: userId,
              character: characterRef.current?.value,
              imgUrl: "",
              emotion: emotionRef.current?.value,
            });
          }}
        >
          Assign
        </button>
      </div>
    </li>
  );
};

export default AssignmentSelector;
