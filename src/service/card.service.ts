import * as cardRepository from "../repository/card";

export async function findCard(spid: string) {
  const cards = await cardRepository.findCardBySpid(spid);
  if (!cards) throw new Error("선수가 없음");
  return cards;
}
