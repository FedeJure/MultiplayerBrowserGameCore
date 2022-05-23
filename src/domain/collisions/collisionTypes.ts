export enum CollisionCategory {
  Entity = 2,
  StaticEnvironment = 4,
  WorldBounds = 6,
  DamageArea = 8,
  ReceiveDamageArea = 10
}

export enum CollisionType {
  Start,
  End,
  During,
}

export enum CollisionGroups {
  Entity = -1, //Due Phaser rules, if two gameobjects have the same POSITIVE group they collide and if have the same NEGATIVE group they never collide
}
