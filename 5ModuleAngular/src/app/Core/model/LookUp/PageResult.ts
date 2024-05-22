import { CurrencyLkp } from "./CurrencyLKP";
import { JournalLkp } from "./JournalLkp";
import { CostCenter } from "./CostCenter";
 import { UserGroups } from "./UserGroups";
export interface PageResult {
    journalTypes :Array<JournalLkp>;
    Currencies :Array<CurrencyLkp>;
    UserGroups:Array<UserGroups>;
    CostCenter :CostCenter;
    totalItems : number ; 
    
}