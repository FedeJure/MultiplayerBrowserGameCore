export declare class PlayerState {
    readonly life: number;
    readonly jumpsAvailable: number;
    readonly inInertia: boolean;
    readonly canMove: boolean;
    readonly position: {
        x: number;
        y: number;
    };
    constructor(savedX: number, savedY: number, life: number, jumpsAvailable: number);
}
