import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {Parts} from 'trans-render/lib/types';

export interface EndUserProps extends IBE{
    camelConfig?: CamelConfig
}

export type JoinStatement = string;

export interface CamelConfig{
    Join?: Array<JoinStatement>
}



export interface AllProps extends EndUserProps{
    canonicalConfig?: CanonicalConfig
}

export type NameOfProp = string;

export interface CanonicalConfig{
    joins: {[key: NameOfProp]: Parts};
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>]


export interface Actions{
    camelToCanonical(self: this): PAP;
    onCanonical(self: this): PAP;
}