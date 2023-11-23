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
        this.markers = Array.from(attributes).filter(x => x.name.startsWith('-') && x.value.length > 0);
    }
    onMarkers(self) {
        const { markers } = self;
        const parsedMarkers = {};
        const observerToInterpolationRule = new Map();
        const observeRules = [];
        for (const marker of markers) {
            const { name, value } = marker;
            const propName = lispToCamel(name.substring(1));
            const interpolationRule = [];
            parsedMarkers[propName] = interpolationRule;
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
        console.log({ observe, val });
    };
    onParsedMarkers(self) {
        const { parsedMarkers } = self;
        for (const key in parsedMarkers) {
            const interpolationRule = parsedMarkers[key];
            for (const propObserverOrString of interpolationRule) {
                if (typeof propObserverOrString === 'string')
                    continue;
                const { observe } = propObserverOrString;
                new Observer(self, observe, self.#abortControllers);
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
