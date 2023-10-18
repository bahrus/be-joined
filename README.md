# be-joined [TODO]

Allow values from microdata and form elements and host properties to be combined together (interpolated).

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


