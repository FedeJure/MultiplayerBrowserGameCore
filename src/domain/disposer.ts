import { Subscription } from "rxjs";

export class Disposer {
    private subscriptions: Subscription[] = []

    public dispose() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = []
    }

    public add(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }
}