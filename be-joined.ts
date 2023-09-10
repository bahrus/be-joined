import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig, RegExpOrRegExpExt} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {JSONValue} from 'trans-render/lib/types';
import {Actions, AllProps, AP, PAP, ProPAP, POA, CanonicalConfig} from './types';
import {register} from 'be-hive/register.js';
import {arr, tryParse} from 'be-enhanced/cpu.js';

const cache = new Map<string, JSONValue>();
const cachedCanonicals: {[key: string]: CanonicalConfig} = {};

const prop = String.raw `^(?<!\\)as(?<prop>[\w]+)`;
const reJoinStatements: RegExpOrRegExpExt<PJS>[] = [
    {
        regExp: new RegExp(String.raw `${prop}(?<!\\)Expression(?<expr>.*)`),
        defaultVals:{}
    },
];

type PJS = Partial<JoinStatement>;

interface JoinStatement{
    prop: string,
    expr: string,
}

export class BeJoined extends BE<AP, Actions> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
            primaryProp: 'camelConfig',
            cache,
            primaryPropReq: true,
            parseAndCamelize: true,
            camelizeOptions:{

            },
            defaultBucket: 'Join'
        } as BEConfig
    } 

    camelToCanonical(self: this): Partial<AllProps> {
        const {camelConfig, enhancedElement, parsedFrom} = self;
        if(parsedFrom !== undefined) {
            const canonicalConfig = cachedCanonicals[parsedFrom];
            if(canonicalConfig !== undefined){
                return {
                    canonicalConfig
                };
            }

        }
        const camelConfigArr = arr(camelConfig);
        for(const cc of camelConfigArr){
            const {Join} = cc;
            if(Join === undefined) continue;
            for(const j of Join){
                const test = tryParse(j, reJoinStatements) as JoinStatement;
                console.log({test});
            }
        }
        return {}
    }

    onCanonical(self: this): Partial<AllProps> {
        return {
            resolved: true
        }
    }
}

export interface BeJoined extends AllProps{}

const tagName = 'be-joined';
const ifWantsToBe = 'joined';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        propDefaults:{
            ...propDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions: {
            camelToCanonical: 'camelConfig',
            onCanonical: 'canonicalConfig'
        }
    },
    superclass: BeJoined
});

register(ifWantsToBe, upgrade, tagName);