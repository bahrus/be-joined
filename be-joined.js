import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { toParts } from 'trans-render/lib/brace.js';
import { lispToCamel } from 'trans-render/lib/lispToCamel.js';
import { hydrateObserve } from 'be-observant/hydrateObserve.js';
export class BeJoined extends BE {
    #abortControllers = [];
    async attach(enhancedElement, enhancementInfo) {
        super.attach(enhancedElement, enhancementInfo);
        const { attributes } = enhancedElement;
        const observeRules = [];
        const propParts = {};
        for (const attrib of attributes) {
            const { name, value } = attrib;
            if (name.startsWith('-') && value.length > 0) {
                const parts = toParts(value);
                propParts[lispToCamel(name.substring(1))] = parts;
                for (const part of parts) {
                    if (typeof part === 'string')
                        continue;
                    const [remote] = part;
                    const observeRule = {
                        remoteType: remote[0],
                        remoteProp: remote.substring(1),
                        callback: this.handleObserveCallback
                    };
                    observeRules.push(observeRule);
                }
            }
        }
        Object.assign(this, { propParts, observeRules });
    }
    handleObserveCallback(observe, val) {
        console.log({ observe, val });
    }
    onObserveRules(self) {
        const { observeRules, propParts } = self;
        console.log({ observeRules, propParts });
        for (const observeRule of observeRules) {
            hydrateObserve(self, observeRule, self.#abortControllers);
        }
        return {
            resolved: true,
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
            onObserveRules: {
                ifAllOf: ['observeRules', 'propParts']
            }
        }
    },
    superclass: BeJoined
});
register(ifWantsToBe, upgrade, tagName);
