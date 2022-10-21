import { SeasonAttributes } from "../models/season.model";
import { Season } from "../mysql/schema";

export async function getSeason() {
  return await Season.findAll({
    attributes: ["seasonId", "seasonImg"],
  });
}
