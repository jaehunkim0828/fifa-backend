export class RankInput {
  spidId: number;
  position: string;
  name: string;
  assist: string;
  block: string;
  dribble: string;
  dribbleSuccess: string;
  dribbleTry: string;
  effectiveShoot: string;
  goal: string;
  matchCount: string;
  passSuccess: string;
  passTry: string;
  shoot: string;
  tackle: string;
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
    this.spidId = spidId;
    this.position = position;
    this.name = name;
    this.assist = assist;
    this.block = block;
    this.dribble = dribble;
    this.dribbleSuccess = dribbleSuccess;
    this.dribbleTry = dribbleTry;
    this.effectiveShoot = effectiveShoot;
    this.goal = goal;
    this.matchCount = matchCount;
    this.passSuccess = passSuccess;
    this.passTry = passTry;
    this.shoot = shoot;
    this.tackle = tackle;
    this.createDate = createDate;
  }
}
