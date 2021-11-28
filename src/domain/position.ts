export class Position {
  public readonly x: number;
  public readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `[${this.x},${this.y}]`;
  }

  static fromString(stringifyPosition: string) {
    try {
      const data = JSON.parse(stringifyPosition);
      return new Position(data[0], data[1]);
    } catch (error) {
      throw new Error(
        "[Position] :: Error constructing position, the string must be of type '[1,2]' "
      );
    }
  }
}
