# be-joined

Allows microdata elements and host properties to be combined together (interpolated).

## Example 1 - Single dependency (no interpolation)

```html
<link itemprop=isVegetarian href="https://schema.org/True">
<input be-joined='{
  "disabled": "{isVegetarian}"
}'>
```

results in:

```html
<input disabled>
```

So this has a similar mission to [be-it](https://github.com/bahrus/be-it).  However, be-it provides more nuanced / specialized behavior for this scenario.  be-joined's mission is strongest during server-side processing and during template instantiation.  It's least desirable scenario is with server-rendered HTML.

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
    "href": "{protocol}://{domain}/{articleType}/{language}/{language}-{classes}/#{section}"
}'
>Basic, Improved - Prototype Definition</a>
</div>
```

results in:

```html
<a href=https://docs.joshuatz.com/cheatsheets/js/js-classes/#basic-improved---prototype-definition be-itemized='{
    "href": "{protocol}://{domain}/{{articleType}}/{language}/{{language}}-{classes}/#{section}"
}'
>Basic, Improved - Prototype Definition</a>
```

The parts that are wrapped in double {{}} checks for microdata elements, and if not found, searches for value from host.  The ones in single only checks microdata elements.

The host is determined by first searching for itemscoped element with beScoped and/or dash in the name.  If not found, gets values fro getRootNode().host.
