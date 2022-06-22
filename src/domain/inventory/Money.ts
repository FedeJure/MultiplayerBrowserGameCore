import { MoneyView } from "./moneyView";

export interface GameMoney {
  gold: number;
  silver: number;
  copper: number;
}

export class Money {
  private _amount: number = 0;
  private _gameMoney: GameMoney;
  constructor(private _view?: MoneyView) {
    this.updateGameMoney();
  }

  set(amount: number) {
    if (amount < 0) return;
    this._amount = amount;
    this.updateGameMoney();
  }

  add(amount: number) {
    if (amount < 0) return;
    this._amount += amount;
    this.updateGameMoney();
  }

  substract(amount: number) {
    if (amount < 0) return;
    this._amount -= amount;
    this.updateGameMoney();
  }

  private updateGameMoney() {
    const copper = this.amount % 100;
    const silver = Math.trunc(this.amount / 100) % 100;
    const gold = Math.trunc(this.amount / 10000) % 100;
    this._gameMoney = { copper, silver, gold };
    this._view?.setMoney(this._gameMoney);
  }

  get gameMoney(): GameMoney {
    return this._gameMoney;
  }

  get amount() {
    return this._amount;
  }
}
