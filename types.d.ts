import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {ObserveRule} from 'be-observant/types';
import {Parts, StringOrProp, PropInfo} from 'trans-render/lib/types';

export interface ObservableParts{
    
}
export interface EndUserProps extends IBE{
    markers: Array<Attr>;
}

export interface PropObserver{
    prop: [string, PropInfo],
    observe: ObserveRule;
    latestVal?: string;
}

export type StringOrPropObserver = string | PropObserver;

export type InterpolationRule = Array<StringOrPropObserver>;

export interface AllProps extends EndUserProps{
    observeRules?: Array<ObserveRule>;
    //propParts?: {[key: string]: Parts};
    parsedMarkers?: {[key: string]: InterpolationRule}
    observerToInterpolationRule?: Map<ObserveRule, InterpolationRule>
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{
    //onObserveRules(self: this): PAP;
    onMarkers(self: this): PAP;
    onParsedMarkers(self: this): PAP;
}