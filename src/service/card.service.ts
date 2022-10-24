import * as cardRepository from "../repository/card";

export async function findCard(spid: number) {
  const card = await cardRepository.findCardBySpid(spid);
  if (!card) throw new Error("없는 spid");
  return card;
}
