import { ServerPlayerAnimationDelegator } from "./serverPlayerAnimationDelegator";
export declare class PlayerAnimationDelegator extends ServerPlayerAnimationDelegator {
    init(): void;
    stop(): void;
    update(time: number, delta: number): void;
}
