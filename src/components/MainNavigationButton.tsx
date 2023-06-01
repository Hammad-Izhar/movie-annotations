import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface ButtonProps {
  icon: IconDefinition;
  href: string;
  label?: string;
}

const MainNavigationButton = ({ label, icon, href }: ButtonProps) => {
  return (
    <Link className="grid place-items-center gap-4" href={href}>
      <button className="aspect-square w-96 border-8 border-black">
        <FontAwesomeIcon icon={icon} size="10x" />
      </button>
      <h2 className="text-4xl">{label}</h2>
    </Link>
  );
};

export default MainNavigationButton;
