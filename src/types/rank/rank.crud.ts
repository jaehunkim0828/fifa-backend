export class RankInput {
  spId: number;
  spPosition: string;
  name: string;
  status: {
    shoot: string;
    effectiveShoot: string;
    assist: string;
    goal: string;
    dribble: string;
    dribbleTry: string;
    dribbleSuccess: string;
    passSuccess: string;
    passTry: string;
    block: string;
    tackle: string;
    matchCount: string;
  };
  createDate: string;

  constructor(
    spidId: number,
    position: string,
    name: string,
    assist: string,
    block: string,
    dribble: string,
    dribbleSuccess: string,
    dribbleTry: string,
    effectiveShoot: string,
    goal: string,
    matchCount: string,
    passSuccess: string,
    passTry: string,
    shoot: string,
    tackle: string,
    createDate: string
  ) {
    this.spId = spidId;
    this.spPosition = position;
    this.name = name;
    this.status.assist = assist;
    this.status.block = block;
    this.status.dribble = dribble;
    this.status.dribbleSuccess = dribbleSuccess;
    this.status.dribbleTry = dribbleTry;
    this.status.effectiveShoot = effectiveShoot;
    this.status.goal = goal;
    this.status.matchCount = matchCount;
    this.status.passSuccess = passSuccess;
    this.status.passTry = passTry;
    this.status.shoot = shoot;
    this.status.tackle = tackle;
    this.createDate = createDate;
  }
}
