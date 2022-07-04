import { Observable } from "rxjs"

export interface SimpleRepository<T> {
    get(id: string): T | undefined | null
    save(id: string, obj: T)
    getAll(filter?: Partial<T>): T[]
    update(id: string, payload: Partial<T>)
    remove(id: string)
    onSave: Observable<T>
    onRemove: Observable<T>
}

export interface AsyncRepository<T> {
    get(id: string): Promise<T | undefined | null>
    save(id: string, obj: T): Promise<void>
    getAll(filter?: Partial<T>): Promise<T[]>
    update(id: string, payload: Partial<T>): Promise<void>
    remove(id: string): Promise<void>
    onSave: Observable<T>
    onRemove: Observable<T>
}