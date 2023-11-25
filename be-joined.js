import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { toParts } from 'trans-render/lib/brace.js';
import { lispToCamel } from 'trans-render/lib/lispToCamel.js';
import { Observer } from 'be-observant/Observer.js';
export class BeJoined extends BE {
    #abortControllers = [];
    async attach(enhancedElement, enhancementInfo) {
        super.attach(enhancedElement, enhancementInfo);
        const { attributes } = enhancedElement;
        this.markers = Array.from(attributes).filter(x => x.value.length > 0 && (x.name.startsWith('-') || (x.name.startsWith(dataDerive) && x.name.endsWith(deriveFrom))));
    }
    onMarkers(self) {
        const { markers } = self;
        const parsedMarkers = new Map();
        const observerToInterpolationRule = new Map();
        const observeRules = [];
        for (const marker of markers) {
            const { name, value } = marker;
            const attr = name.startsWith('-') ? name.substring(1) : name.substring(dataDerive.length, name.length - deriveFrom.length);
            console.log(attr);
            const propName = lispToCamel(attr);
            const interpolationRule = [];
            //parsedMarkers[propName] = interpolationRule;
            parsedMarkers.set(interpolationRule, propName);
            const parts = toParts(value);
            for (const part of parts) {
                if (typeof part === 'string') {
                    interpolationRule.push(part);
                    continue;
                }
                const [remote] = part;
                const observeRule = {
                    remoteType: remote[0],
                    remoteProp: remote.substring(1),
                    callback: this.handleObserveCallback
                };
                observeRules.push(observeRule);
                observerToInterpolationRule.set(observeRule, interpolationRule);
                const propObserver = {
                    observe: observeRule,
                    prop: part
                };
                interpolationRule.push(propObserver);
            }
        }
        return {
            parsedMarkers,
            observerToInterpolationRule,
            observeRules
        };
    }
    handleObserveCallback = (observe, val) => {
        //console.log({observe, val});
        const interpolationRule = this.observerToInterpolationRule?.get(observe);
        const propObserver = interpolationRule.find(x => typeof x !== 'string' && x.observe === observe);
        if (propObserver.latestVal === val)
            return;
        propObserver.latestVal = val;
        const vals = [];
        for (const observerPart of interpolationRule) {
            if (typeof observerPart === 'string') {
                vals.push(observerPart);
                continue;
            }
            if (observerPart.latestVal === undefined) {
                //console.log({observerPart});
                return;
            }
            vals.push(observerPart.latestVal);
        }
        const prop = this.parsedMarkers?.get(interpolationRule);
        this.enhancedElement[prop] = vals.join('');
        //TODO:  this is getting called many more times than would seem necessary
    };
    onParsedMarkers(self) {
        const { parsedMarkers } = self;
        for (const [interpolationRule, propName] of parsedMarkers) {
            for (const propObserverOrString of interpolationRule) {
                if (typeof propObserverOrString === 'string')
                    continue;
                const { observe } = propObserverOrString;
                new Observer(self, observe, self.#abortControllers);
                //console.log('added observer');
                //new Observer(self, )
            }
        }
        return {
            resolved: true
        };
    }
}
const tagName = 'be-joined';
const ifWantsToBe = 'be-joined';
const upgrade = '*';
const dataDerive = 'data-derive-';
const deriveFrom = '-from';
const xe = new XE({
    config: {
        tagName,
        isEnh: true,
        propDefaults: {
            ...propDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions: {
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
