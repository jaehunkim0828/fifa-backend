import { Card } from "../mysql/schema";

export async function findCardBySpid(spid: number) {
  return await Card.findOne({
    where: {
      id: spid,
    },
  });
}
