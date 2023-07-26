import ClothRobe from "./clothRobe.json";
import LeatherShirt from "./leatherShirt.json";
import PlateMail from "./plateMail.json";

export function showNeck(chestName: string) {
  switch (chestName) {
    case "Cloth Robe":
      return ClothRobe.showNeck;
    case "Leather Shirt":
      return LeatherShirt.showNeck;
    case "Plate Mail":
      return PlateMail.showNeck;
    default:
      return false;
  }
}

export function showArms(chestName: string) {
  switch (chestName) {
    case "Cloth Robe":
      return ClothRobe.showArms;
    case "Leather Shirt":
      return LeatherShirt.showArms;
    case "Plate Mail":
      return PlateMail.showArms;
    default:
      return true;
  }
}
