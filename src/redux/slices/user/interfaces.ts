import { DARK, LIGHT } from "constants/ui";

export interface ContractState {
    
    theme: typeof DARK | typeof LIGHT ;
    
}