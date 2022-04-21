export interface SimpleRepository<T> {
    get(id: string): T | undefined
    save(id: string, obj: T)
    getAll(filter?: Partial<T>): T[]
    update(id: string, payload: Partial<T>)
}

export interface AsyncRepository<T> {
    get(id: string): Promise<T | undefined>
    save(id: string, obj: T): Promise<void>
    getAll(filter?: Partial<T>): Promise<T[]>
    update(id: string, payload: Partial<T>): Promise<void>
}