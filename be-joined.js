import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeJoined extends BE {
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
