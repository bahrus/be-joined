import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig, RegExpOrRegExpExt, EnhancementInfo} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, 
    StringOrPropObserver, PropObserver, InterpolationRule} from './types';
import {register} from 'be-hive/register.js';
import {toParts} from 'trans-render/lib/brace.js';
import {ObserveRule} from 'be-observant/types';
import { ElTypes } from 'be-linked/types';
import {Parts, PropInfo} from 'trans-render/lib/types';
import {lispToCamel} from 'trans-render/lib/lispToCamel.js';
import {Observer} from 'be-observant/Observer.js';

export class BeJoined extends BE<AP, Actions> implements Actions{
    #abortControllers: Array<AbortController>  = [];
    override async attach(enhancedElement: Element, enhancementInfo: EnhancementInfo) {
        super.attach(enhancedElement, enhancementInfo);
        const {attributes} = enhancedElement;
        this.markers = Array.from(attributes).filter(
            x => x.value.length > 0 && (x.name.startsWith('-') || (x.name.startsWith(dataDerive) && x.name.endsWith(deriveFrom))) 
        );
    }

    onMarkers(self: this){
        const {markers} = self;
        const parsedMarkers: Map<InterpolationRule, string> = new Map();
        const observerToInterpolationRule: Map<ObserveRule, InterpolationRule> = new Map();
        const observeRules: Array<ObserveRule> = [];
        for(const marker of markers){
            const {name, value} = marker;
            const attr = name.startsWith('-') ? name.substring(1) : name.substring(dataDerive.length, name.length - deriveFrom.length);
            console.log(attr);
            const propName = lispToCamel(attr);
            const interpolationRule: InterpolationRule = [];
            //parsedMarkers[propName] = interpolationRule;
            parsedMarkers.set(interpolationRule, propName);
            const parts = toParts(value);
            for(const part of parts){
                if(typeof part === 'string'){
                    interpolationRule.push(part);
                    continue;
                }
                const [remote] = part as any as [string];
                const observeRule: ObserveRule = {
                    remoteType: remote[0] as ElTypes,
                    remoteProp: remote.substring(1),
                    callback: this.handleObserveCallback
                };
                observeRules.push(observeRule);
                observerToInterpolationRule.set(observeRule, interpolationRule);
                const propObserver: PropObserver = {
                    observe: observeRule,
                    prop: part as [string, PropInfo]
                }
                interpolationRule.push(propObserver);
            }
        }
        return {
            parsedMarkers,
            observerToInterpolationRule,
            observeRules
        };
    }

    handleObserveCallback = (observe: ObserveRule, val: any) => {
        //console.log({observe, val});
        const interpolationRule = this.observerToInterpolationRule?.get(observe)!;
        const propObserver = interpolationRule.find(x => typeof x !== 'string' && x.observe === observe) as PropObserver;
        if(propObserver.latestVal === val) return;
        propObserver.latestVal = val;
        const vals: string[] = [];
        for(const observerPart of interpolationRule){
            if(typeof observerPart === 'string') {
                vals.push(observerPart);
                continue;
            }
            if(observerPart.latestVal === undefined) {
                //console.log({observerPart});
                return;
            }
            vals.push(observerPart.latestVal);
        }
        const prop = this.parsedMarkers?.get(interpolationRule);
        (<any>this.enhancedElement)[prop!] = vals.join('');
        //TODO:  this is getting called many more times than would seem necessary

    }

    onParsedMarkers(self: this): PAP {
        const {parsedMarkers} = self;
        for(const [interpolationRule, propName] of parsedMarkers!){
            for(const propObserverOrString of interpolationRule){
                if(typeof propObserverOrString === 'string') continue;
                const {observe} = propObserverOrString;
                new Observer(self, observe, self.#abortControllers);
                //console.log('added observer');
                //new Observer(self, )
            }
        }
        return {
            resolved: true
        }
    }
}

export interface BeJoined extends AllProps{}

const tagName = 'be-joined';
const ifWantsToBe = 'be-joined';
const upgrade = '*';

const dataDerive = 'data-derive-';
const deriveFrom = '-from';
const xe = new XE<AP, Actions>({
    config:{
        tagName,
        isEnh: true,
        propDefaults:{
            ...propDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions:{
            onMarkers: 'markers',
            onParsedMarkers: {
                ifAllOf: ['parsedMarkers', 'observerToInterpolationRule', 'observeRules']
            },
            // onObserveRules: {
            //     ifAllOf: ['observeRules', 'propParts']
            // }
        }
    },
    superclass: BeJoined
});

register(ifWantsToBe, upgrade, tagName);




