import ClothHat from "./clothHat.json";
import LeatherHat from "./leatherHat.json";
import PlateHelmet from "./plateHelmet.json";

export default { ClothHat, LeatherHat, PlateHelmet };

export function showHead(headName: string) {
  switch (headName) {
    case "Cloth Hat":
      return ClothHat.showHead;
    case "Leather Hat":
      return LeatherHat.showHead;
    case "Plate Helmet":
      return PlateHelmet.showHead;
    default:
      return true;
  }
}
