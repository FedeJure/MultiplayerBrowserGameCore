import { Observable } from "rxjs"
import { AttackTarget } from "../../combat/attackTarget"

export interface CombatCollisionResolver {
    onMeleeTarget:  Observable<AttackTarget>
    enableMeleeCollision()
    disableMeleeCollision()
}