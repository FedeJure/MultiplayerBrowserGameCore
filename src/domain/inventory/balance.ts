import { Observable, Subject } from "rxjs";
import { BalanceDto } from "./balanceDto";
import { MoneyView } from "./moneyView";

export interface GameBalance {
  gold: number;
  silver: number;
  copper: number;
}

export class Balance {
  private _amount: number = 0;
  private _gameMoney: GameBalance;
  private _onChange = new Subject<void>()
  constructor(private _view?: MoneyView) {
    this.updateGameMoney();
  }

  set(amount: number) {
    if (amount < 0) return;
    this._amount = amount;
    this._onChange.next()
    this.updateGameMoney();
  }

  add(amount: number) {
    if (amount < 0) return;
    this._amount += amount;
    this._onChange.next()
    this.updateGameMoney();
  }

  substract(amount: number) {
    if (amount < 0) return;
    this._amount -= amount;
    this._onChange.next()
    this.updateGameMoney();
  }

  private updateGameMoney() {
    const copper = this.amount % 100;
    const silver = Math.trunc(this.amount / 100) % 100;
    const gold = Math.trunc(this.amount / 10000) % 100;
    this._gameMoney = { copper, silver, gold };
    this._view?.setBalance(this._gameMoney);
  }

  get gameMoney(): GameBalance {
    return this._gameMoney;
  }

  get amount() {
    return this._amount;
  }

  get dto(): BalanceDto {
    return { amount: this.amount };
  }

  get onChange(): Observable<void> {
    return this._onChange
  }
}
