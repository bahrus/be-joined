# be-joined

Example 1:

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