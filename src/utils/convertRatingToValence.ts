import type { Rating } from "@movies/pages/[roomCode]/annotator";

import { Valence } from "@prisma/client";

export default function convertRatingToValence(valence: Rating): Valence {
  console.log("valence: ", valence);

  switch (valence) {
    case 1:
      return Valence.ONE;
    case 2:
      return Valence.TWO;
    case 3:
      return Valence.THREE;
    case 4:
      return Valence.FOUR;
    case 5:
      return Valence.FIVE;
    default:
      return Valence.UNDEFINED;
  }
}
