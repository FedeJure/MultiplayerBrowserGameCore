import { CollisionableEntity } from "../entity/CollisionableEntity";
import { CollisionableTargetType } from "../combat/attackTargetType";
import { CombatResult } from "../player/combat/combatResult";
import { Enemy } from "./enemy";
import { Entity } from "../entity/entity";
import { CombatAction } from "../combat/combatAction";
import { EntityAnimationCode, AnimationLayer } from "../entity/animations";
import { DefaultEntityCombat } from "../entity/DefaultEntityCombat";
import { LootConfiguration } from "../loot/lootConfiguration";
import { AsyncRepository } from "../repository";
import { LootGenerator } from "../loot/lootGenerator";
import { shuffle } from "lodash";
import { Balance } from "../inventory/balance";
import { Item } from "../items/item";

export class EnemyCombat extends DefaultEntityCombat {
  private _target: Entity | null = null;
  private readonly intervalTimeCheck = 500;
  private lastTimeCheck = 0;
  private enemy: Enemy;
  private attacking: boolean;
  private attackers: { entity: Entity; damage: number }[] = [];

  readonly timeToRemoveCombat = 5000;
  private lastTimeWithTarget: number;
  constructor(
    private actions: CombatAction[],
    private lootId: LootConfiguration["id"],
    private lootConfigsRepository: AsyncRepository<LootConfiguration>,
    private lootGenerator: LootGenerator
  ) {
    super();
  }

  init(enemy: Enemy) {
    this.enemy = enemy;
    super.init(enemy);
    this.actions.forEach((a) => a.init(this.enemy));
  }
  public get target() {
    return this._target;
  }

  receiveAttack(attack: CombatResult) {
    if (this.enemy.state.reseting) return;

    const calculatedDamage = attack.damage;
    this.enemy.updateState({
      life: this.enemy.state.life - calculatedDamage,
    });
    const attacker = this.attackers.find(
      (a) => a.entity.info.id === attack.attacker.info.id
    );
    if (!attacker) this.attackers.push({ damage: 0, entity: attack.attacker });
    else attacker.damage += calculatedDamage;

    if (this.enemy.state.life <= 0 && this.enemy.state.isAlive) this.die();
  }

  die() {
    this.enemy.animations.stopAnimations();
    this.enemy.animations.executeAnimation(
      EntityAnimationCode.DIE,
      AnimationLayer.COMBAT,
      false,
      1000
    );
    this.enemy.view.setVelocity(0, 0);
    this.enemy.updateState({ isAlive: false });
    this.bringExperienceToAttackers();
    this.resolveLoot();
    setTimeout(() => {
      this.enemy.destroy();
    }, 1000);
  }

  resolveLoot() {
    if (!this.target) return;
    this.lootConfigsRepository.getBy({ id: this.lootId }).then((lootConfig) => {
      if (!lootConfig) return;
      const itemsCount = Math.floor(
        Math.random() * (lootConfig.maxItems - lootConfig.minItems + 1) +
          lootConfig.minItems
      );
      const itemsToLoot: Item["id"][] = [];
      for (let i = 0; i < itemsCount; i++) {
        const items = shuffle(lootConfig?.items);
        let prob = Math.random();
        for (const item of items) {
          if (item.probability < prob && !itemsToLoot.includes(item.itemId)) {
            itemsToLoot.push(item.itemId);
            break;
          }
        }
      }
      const balance = new Balance();
      balance.set(
        Math.floor(
          Math.random() * (lootConfig.maxMoney - lootConfig.minMoney)
        ) + lootConfig.minMoney
      );

      this.lootGenerator.generateLoot(
        itemsToLoot,
        balance,
        this.enemy.state.position,
        this.target!.info.id,
        this.enemy.state.mapId
      );
    });
  }

  bringExperienceToAttackers() {
    let totalDamage = 0;
    this.attackers.forEach((attacker) => {
      totalDamage += attacker.damage;
    });
    const totalExp = 100; //refactor: calculate experience
    this.attackers.forEach((attacker) => {
      attacker.entity.combat.bringExperience(
        (totalExp * attacker.damage) / totalDamage
      );
    });
  }

  private processCloseTargets(targets: CollisionableEntity[]) {
    const filterTargets = targets.filter(
      (t) => t.type === CollisionableTargetType.PLAYER
    );
    if (this._target && filterTargets.length === 0) {
      this._target = null;
      this.lastTimeWithTarget = Date.now();
    }
    if (filterTargets.find((t) => t.target === this.target)) return;
    filterTargets.map(({ target }) => {
      this._target = target;
    });
  }

  update(time: number, delta: number) {
    if (!this.enemy.state.isAlive) return;
    super.update(time, delta);

    if (this.lastTimeCheck + this.intervalTimeCheck < time) {
      this.lastTimeCheck = time;
      this.processCloseTargets(
        this.enemy.view.getEntitiesClose(this.enemy.stats.detectionRange)
      );
    }

    if (
      !this.attacking &&
      this.lastTimeWithTarget + this.timeToRemoveCombat > Date.now()
    ) {
      this.attackers = [];
    }

    if (!this.attacking && this.target) {
      for (const action of this.actions) {
        const execution = action.execute();
        if (execution) {
          this.enemy.updateState({ attacking: true });
          this.attacking = true;
          if (!this.target.state.isAlive) this._target = null;
          setTimeout(() => {
            this.attacking = false;
            this.enemy.updateState({
              attacking: false,
              attackAnimation: undefined,
            });
          }, execution.duration);
          return;
        }
      }
    }
  }
}
