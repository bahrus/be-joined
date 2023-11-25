# be-joined

Allow values from microdata and form elements and host properties to be combined together (interpolated).

[![NPM version](https://badge.fury.io/js/be-joined.png)](http://badge.fury.io/js/be-joined)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-joined?style=for-the-badge)](https://bundlephobia.com/result?p=be-joined)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-joined?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/be-joined/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-joined/actions/workflows/CI.yml)

Example 1:

```html
<form>
  <div itemscope>
    <meta itemprop=protocol content=https>
    <meta itemprop=domain content=docs.joshatz.com>
    <meta itemprop=articleType content=cheatsheets>
    <!-- <meta itemprop=language content=js> -->
    <input id=language value=js>
    <!-- <meta itemprop=topic content=classes> -->
    <input name=topic value=classes>

    <meta itemprop=section content=basic-improved---prototype-definition>
    <a -href="{$protocol}://{$domain}/{@articleType}/{#language}/{#language}-{@topic}/#{$section}" be-joined
    >Basic, Improved - Prototype Definition</a>
  </div>
</form>
```

results in:

```html
<a href=https://docs.joshuatz.com/cheatsheets/js/js-classes/#basic-improved---prototype-definition>Basic, Improved - Prototype Definition</a>
```

> [!Note]
> From a performance point of view, this enhancement works best with ynamic (client-side) content that derives from a template (for example, for a repeating web component) as opposed to server-rendered content.  To work effectively with server-rendered content, see [be-itemized](https://github.com/bahrus/be-itemized), which (may, tbd) use be-joined behind the scenes.

## Special Symbols

As we've seen above, we will encounter special symbols used in order to keep the statements small.  A summary of those symbols is shown below

| Symbol      | Meaning              | Notes                                                                                |
|-------------|----------------------|--------------------------------------------------------------------------------------|
| /propName   |"Hostish"             | Pulls in values from the "host".                                                     |
| @propName   |Name attribute        | Pulls in values from form elements using name attribute.                             |
| $propName   |Itemprop attribute    | Pulls in values from microdata elements with itemprop attribute.                     |
| #propName   |Id attribute          | Pulls in values from elements identified ia the id.                                  |
| -prop-name  |Marker indicates prop | Pulls in values from nearest "upsearch" element matching the attribute.              |


"Hostish" means:

1.  First, do a "closest" for an element with attribute itemscope, where the tag name has a dash in it.  Do that search recursively.  
2.  If no match found, use getRootNode().host.

## HTML5 compliance

To be HTML5 compliant, use data-derive-*-from instead:

```html
<form>
  <div itemscope>
    <meta itemprop=protocol content=https>
    <meta itemprop=domain content=docs.joshatz.com>
    <meta itemprop=articleType content=cheatsheets>
    <!-- <meta itemprop=language content=js> -->
    <input id=language value=js>
    <!-- <meta itemprop=topic content=classes> -->
    <input name=topic value=classes>

    <meta itemprop=section content=basic-improved---prototype-definition>
    <a data-derive-href-from="{$protocol}://{$domain}/{@articleType}/{#language}/{#language}-{@topic}/#{$section}" be-joined
    >Basic, Improved - Prototype Definition</a>
  </div>
</form>
```

## Example 2 [Untested]

```html
<my-custom-element>
  #shadow
      <a -href="{protocol}://{domain}/{articleType}/{language}/{language}-{topic}/#{section}" be-joined
      >Basic, Improved - Prototype Definition</a>
</my-custom-element>
```

In this example, when no symbols are provided (or slash is used), we assume the property values should come from the host (ish)


## Viewing Demos Locally

Any web server that can serve static files will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.js.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/ in a modern browser.

## Running Tests

```
> npm run test
```

## Using from ESM Module:

```JavaScript
import 'be-joined/be-joined.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-joined';
</script>
```
