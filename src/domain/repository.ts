export interface SimpleRepository<T extends {id: string}> {
    get(id: string): T | undefined
    save(obj: T)
    getAll(filter?: Partial<T>): T[]
    update(id: string, payload: Partial<T>)
}

export interface AsyncRepository<T extends {id: string}> {
    get(id: string): Promise<T | undefined>
    save(obj: T): Promise<void>
    getAll(filter?: Partial<T>): Promise<T[]>
    update(id: string, payload: Partial<T>): Promise<void>
}