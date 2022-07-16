export interface Delegator {
    init(): void
    stop(): void
    update(time: number, delta: number): void
    postUpdate?(): void
}