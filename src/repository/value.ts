import { Value } from "../mysql/schema";

export async function createValue(rating: number, bp: string, spid: string) {
  return await Value.create({
    rating,
    price: bp,
    spidId: spid,
    createdAt: new Date(),
  });
}

export async function findValueByRatingAndSpid(spid: string, rating: number) {
  return Value.findOne({
    where: {
      spidId: spid,
      rating,
    },
    attributes: ["id", "price", "createdAt"],
  });
}

export async function updateValue(bp: string, spid: string, rating: number) {
  return await Value.update(
    {
      price: bp,
      createdAt: new Date(),
    },
    {
      where: {
        spidId: spid,
        rating,
      },
    }
  );
}
