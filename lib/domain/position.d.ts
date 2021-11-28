export declare class Position {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    toString(): string;
    static fromString(stringifyPosition: string): Position;
}
