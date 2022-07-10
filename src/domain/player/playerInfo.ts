import { Account } from "../account/account";
import { EntityInfo } from "../entity/entityInfo";

export interface PlayerInfo extends EntityInfo {
    accountId: Account['id']
}
