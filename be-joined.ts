import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig, RegExpOrRegExpExt, EnhancementInfo} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';
import {toParts} from 'trans-render/lib/brace.js';
import {lispToCamel} from 'trans-render/lib/lispToCamel.js';

export class BeJoined extends BE<AP, Actions> implements Actions{
    override async attach(enhancedElement: Element, enhancementInfo: EnhancementInfo) {
        super.attach(enhancedElement, enhancementInfo);
        const {attributes} = enhancedElement;
        for(const attrib of attributes){
            const {name, value} = attrib;
            if(name.startsWith('-') && value.length > 0){
                const parts = toParts(value);
                console.log({parts});
            }
        }
    }
}

export interface BeJoined extends AllProps{}

const tagName = 'be-joined';
const ifWantsToBe = 'be-joined';
const upgrade = '*';

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
        actions:{}
    },
    superclass: BeJoined
});

register(ifWantsToBe, upgrade, tagName);




