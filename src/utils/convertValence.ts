import { Valence } from "@prisma/client";

export default function convertValence(valence: string | undefined): Valence {
  switch (valence) {
    case "1":
      return Valence.ONE;
    case "2":
      return Valence.TWO;
    case "3":
      return Valence.THREE;
    case "4":
      return Valence.FOUR;
    case "5":
      return Valence.FIVE;
    default:
      return Valence.UNDEFINED;
  }
}
