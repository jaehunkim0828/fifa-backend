import { Value } from "../mysql/schema";

export async function createValue(rating: number, bp: string, spid: string) {
  return await Value.create({
    rating,
    price: bp,
    spidId: spid,
  });
}

export async function findValueByRatingAndSpid(spid: string, rating: number) {
  return Value.findOne({
    where: {
      spidId: spid,
      rating,
    },
    attributes: ["id", "price"],
  });
}

export async function updateValue(bp: string, spid: string) {
  return await Value.update(
    {
      price: bp,
    },
    {
      where: {
        spidId: spid,
      },
    }
  );
}
