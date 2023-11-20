import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {ObserveRule} from 'be-observant/types';
import {Parts} from 'trans-render/lib/types';

export interface EndUserProps extends IBE{
    observeRules?: Array<ObserveRule>;
    propParts?: {[key: string]: Parts};
}

export interface AllProps extends EndUserProps{

}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{
    onObserveRules(self: this): PAP;
}