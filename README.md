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
    <a be-joined="
      Join as href expression {|protocol}://{|domain}/{|articleType}/{#language}/{#language}-{&topic}/#{|section}.
      "
    >Basic, Improved - Prototype Definition</a>
  </div>
</form>
```

results in:

```html
<a href=https://docs.joshuatz.com/cheatsheets/js/js-classes/#basic-improved---prototype-definition>Basic, Improved - Prototype Definition</a>
```

The parts that are wrapped in double {{}} checks for microdata elements, and if not found, searches for value from host.  The ones in single only checks microdata elements.

The host is determined by first searching for itemscoped element with beScoped and/or dash in the name.  If not found, gets values fro getRootNode().host.

Example 2a:

<a be-joined="
  Join {protocol}://{domain}/{articleType}/{language}/{language}-{classes}/#{section} as href.
"
>Basic, Improved - Prototype Definition</a>
