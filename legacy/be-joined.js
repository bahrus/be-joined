import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { arr, tryParse } from 'be-enhanced/cpu.js';
import { toParts } from 'trans-render/lib/brace.js';
const cache = new Map();
const cachedCanonicals = {};
const prop = String.raw `^(?<!\\)as(?<prop>[\w]+)`;
const reJoinStatements = [
    {
        regExp: new RegExp(String.raw `${prop}(?<!\\)Expression(?<expr>.*)`),
        defaultVals: {}
    },
];
export class BeJoined extends BE {
    static get beConfig() {
        return {
            parse: true,
            primaryProp: 'camelConfig',
            cache,
            primaryPropReq: true,
            parseAndCamelize: true,
            camelizeOptions: {},
            defaultBucket: 'Join'
        };
    }
    camelToCanonical(self) {
        const { camelConfig, enhancedElement, parsedFrom } = self;
        if (parsedFrom !== undefined) {
            const canonicalConfig = cachedCanonicals[parsedFrom];
            if (canonicalConfig !== undefined) {
                return {
                    canonicalConfig
                };
            }
        }
        const camelConfigArr = arr(camelConfig);
        const joins = {};
        for (const cc of camelConfigArr) {
            const { Join } = cc;
            if (Join === undefined)
                continue;
            for (const j of Join) {
                const test = tryParse(j, reJoinStatements);
                if (test === null)
                    throw 'PE'; //Parse Error
                const { expr, prop } = test;
                const parts = toParts(expr);
                joins[prop] = parts;
                console.log({ test, parts });
            }
        }
        const canonicalConfig = {
            joins
        };
        if (parsedFrom !== undefined) {
            cachedCanonicals[parsedFrom] = canonicalConfig;
        }
        return {
            canonicalConfig
        };
    }
    onCanonical(self) {
        const { canonicalConfig } = self;
        console.log({ canonicalConfig });
        return {
            resolved: true
        };
    }
}
const tagName = 'be-joined';
const ifWantsToBe = 'joined';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
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
