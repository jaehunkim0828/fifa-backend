import { Card, Player, Season, Position } from "../mysql/schema";

export async function findCardBySpid(spid: string) {
  return await Card.findOne({
    where: {
      id: spid,
    },
    include: [
      {
        model: Player,
        attributes: ["ovr"],
        include: [
          { model: Position, attributes: ["desc"] },
          { model: Season, attributes: ["seasonImg"] },
        ],
      },
    ],
  }).then((data) => {
    const d = data?.get();
    const result = {
      ...d,
      ovr: d?.spid?.ovr,
      position: d?.spid?.position?.desc,
      spid: d?.id,
      seasonImg: d?.spid?.season?.seasonImg,
    };
    delete result.id;
    return result;
  });
}
