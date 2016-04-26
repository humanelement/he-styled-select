# he-styled-select
A lightweight plugin to swap out select dropdowns with html that can be styled and hooked up to an onchange handler.

Written by Human Element's Milligan

See <a href="http://humanelement.github.io/he-styled-select/" target="_blank">DEMO</a>

Usage examples:
```Javascript
//example 1
heStyledSelect.init({
    select:'select.example1' //select a specific <select> element to "style"
    //no onchange is NOT specified so NO event is triggered onchange
});

//example 2
heStyledSelect.init({
    select:'select.example2', //select a specific <select> element to "style"
    onchange:function(select, args){ //trigger the original <select> change event on-change
        select.change();
        //Event.simulate(select[0], 'change'); //prototype
    }
});

```
