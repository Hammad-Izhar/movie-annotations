import type { PropsWithChildren } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps {
  icon: IconDefinition;
  label?: string;
}

const MainNavigationButton = ({
  label,
  icon,
  children,
}: PropsWithChildren<ButtonProps>) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="grid w-full max-w-xs basis-1/4 place-items-center gap-4"
        onClick={() => {
          modalRef.current?.showModal();
        }}
      >
        <div className="grid aspect-square w-full place-items-center border-8 border-black">
          <FontAwesomeIcon icon={icon} size="10x" />
        </div>
        <h2 className="text-4xl">{label}</h2>
      </button>
      <dialog ref={modalRef} className="modal">
        <form method="dialog" className="modal-box">
          {children}
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default MainNavigationButton;
