import { Subscription } from "rxjs";
export declare class Disposer {
    private subscriptions;
    dispose(): void;
    add(subscription: Subscription): void;
}
