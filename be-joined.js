import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { toParts } from 'trans-render/lib/brace.js';
export class BeJoined extends BE {
    async attach(enhancedElement, enhancementInfo) {
        super.attach(enhancedElement, enhancementInfo);
        const { attributes } = enhancedElement;
        for (const attrib of attributes) {
            const { name, value } = attrib;
            if (name.startsWith('-') && value.length > 0) {
                const parts = toParts(value);
                for (const part of parts) {
                    if (typeof part === 'string')
                        continue;
                    const [remote] = part;
                    const observeRule = {
                        remoteType: remote[0],
                        remoteProp: remote.substring(1),
                    };
                }
                console.log({ parts });
            }
        }
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
        actions: {}
    },
    superclass: BeJoined
});
register(ifWantsToBe, upgrade, tagName);
