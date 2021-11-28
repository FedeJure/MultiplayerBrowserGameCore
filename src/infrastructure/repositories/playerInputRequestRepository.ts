export class PlayerInputRequestRepository {

    private readonly store: Map<string, number> = new Map()
    
    set(playerId: string, request: number) {
        this.store.set(playerId, request)
    }

    remove(playerId: string) {
        this.store.delete(playerId)
    }

    getOrCreate(playerId: string) {
        let requestNumber = this.store.get(playerId)
        if (!requestNumber) {
            requestNumber = 0
            this.store.set(playerId, requestNumber)
        }
        return requestNumber
    }
}