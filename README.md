# be-joined [TODO]

Allow microdata elements and host properties to be combined together (interpolated).

## Example 1 - Single dependency (no interpolation)

```html
<link itemprop=isVegetarian href="https://schema.org/True">
<input be-joined='{
  "set": {
    "disabled": {
      "fromItemProp": "isVegetarian"
    }
  }
}'>
```

results in:

```html
<input disabled>
```

## Example 1a

```html
<link itemprop=isVegetarian href="https://schema.org/True">
<input be-joined='
  Set disabled from is vegetarian itemprop.
'>
```

Example 2:

```html
<div itemscope>
<meta itemprop=protocol content=https>
<meta itemprop=domain content=docs.joshatz.com>
<meta itemprop=articleType content=cheatsheets>
<meta itemprop=language content=js>
<meta itemprop=topic content=classes>
<meta itemprop=section content=basic-improved---prototype-definition>
<a be-joined='{
  "join":{
    "href": {
      "fromExpr": "{protocol}://{domain}/{articleType}/{language}/{language}-{classes}/#{section}"
    }
  }
}'
>Basic, Improved - Prototype Definition</a>
</div>
```

results in:

```html
<a href=https://docs.joshuatz.com/cheatsheets/js/js-classes/#basic-improved---prototype-definition>Basic, Improved - Prototype Definition</a>
```

The parts that are wrapped in double {{}} checks for microdata elements, and if not found, searches for value from host.  The ones in single only checks microdata elements.

The host is determined by first searching for itemscoped element with beScoped and/or dash in the name.  If not found, gets values fro getRootNode().host.
