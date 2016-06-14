var heStyledSelect=(function(){
  return{
      close:function(selects){
          var self=this;
          selects.each(function(){
            var select=jQuery(this);
            var wrap=self['getWrapForSelect'](select);
            wrap.removeClass('select-open');
          });
      },
      open:function(selects){
          var self=this;
          //close any other open selects
          self['close'](jQuery('.init-he-styled-select').not(selects));
          selects.each(function(){
            var select=jQuery(this);
            var wrap=self['getWrapForSelect'](select);
            wrap.addClass('select-open');
          });
      },
      getSelectForWrap:function(wrap){
        var index=wrap.attr('data-styled-select');
        var select=wrap.siblings('.init-he-styled-select[data-styled-select="'+index+'"]:first');
        return select;
      },
      getWrapForSelect:function(select){
        var index=select.attr('data-styled-select');
        var wrap=select.siblings('.he-styled-select-wrap[data-styled-select="'+index+'"]:first');
        return wrap;
      },
      getSelectedOption:function(select){
          var retOption;
          var wrap=this['getWrapForSelect'](select);
          if(wrap.length>0){
              var optionsEl=wrap.children('.select-options:first');
              var getOption=optionsEl.children('.select-option.selected:first');
              if(getOption.length>0){
                  retOption=getOption;
              }
          }
          return retOption;
      },
      setSelectedOption:function(select, setWhat, callback){
          var ret;
          var wrap=this['getWrapForSelect'](select);
          if(wrap.length>0){
              var valEl=wrap.children('.select-val:first');
              var optionsEl=wrap.children('.select-options:first');
              var setOption;
              if(setWhat.hasOwnProperty('text')){
                  if(setWhat['text']==undefined){ setWhat['text']=''; }
                  optionsEl.children('.select-option').each(function(){
                      if(jQuery(this).text()===setWhat['text']){
                          setOption=jQuery(this); return false;
                      }
                  });
              }else if(setWhat.hasOwnProperty('value')){
                  if(setWhat['value']==undefined){ setWhat['value']=''; }
                  if(setWhat['value'].length>0){
                    setOption=optionsEl.children('.select-option[data-value="'+setWhat['value']+'"]:first');
                  }else{
                      optionsEl.children('.select-option').each(function(){
                          var val=jQuery(this).attr('data-value');
                          if(val==undefined || val.length<1){
                              setOption=jQuery(this); return false;
                          }
                      });
                  }
              }
              if(setOption!=undefined && setOption.length>0){
                  if(!setOption.hasClass('selected')){
                      var prevSelOption=optionsEl.children('.select-option.selected');
                      prevSelOption.removeClass('selected');
                      setOption.addClass('selected');
                      var dataVal=setOption.attr('data-value');
                      var txt=setOption.text();
                      valEl.attr('data-value',dataVal);
                      valEl.text(txt);
                      if(setWhat.hasOwnProperty('text')){
                          ret=txt;
                      }else if(setWhat.hasOwnProperty('value')){
                          ret=dataVal;
                      }
                      select.val(dataVal);
                      var callbackArgs={value:dataVal, text:txt, option:setOption, prev_option:prevSelOption};
                      if(select[0].hasOwnProperty('custom_select_onchange')){
                          select[0]['custom_select_onchange'](select, callbackArgs);
                      }
                      if(callback!=undefined){
                          callback(select, callbackArgs);
                      }
                  }
              }
          }
          return ret;
      },
      setText:function(select, newText, callback){
          return this['setSelectedOption'](select, {text:newText}, callback);
      },
      setValue:function(select, newValue, callback){
          return this['setSelectedOption'](select, {value:newValue}, callback);
      },
      getText:function(select){
          var txt;
          var selOption=this['getSelectedOption'](select);
          if(selOption!=undefined && selOption.length>0){ txt=selOption.text(); }
          return txt;
      },
      getValue:function(select){
          var val;
          var selOption=this['getSelectedOption'](select);
          if(selOption!=undefined && selOption.length>0){ val=selOption.attr('data-value'); }
          return val;
      },
      updateOptions:function(select){
          var self=this;
          var wrap=self['getWrapForSelect'](select);
          var valEl=wrap.children('.select-val:first');
          var optionsEl=wrap.children('.select-options:first');
          var selVal=select.val();
          var selTxt=select[0].options[select[0].selectedIndex].textContent || select[0].options[select[0].selectedIndex].innerText;
          valEl.attr('data-value',selVal);
          valEl.text(selTxt);
          optionsEl.html('');
          select.children('option').each(function(){
              var option=jQuery(this);
              var val=option.attr('value');
              var txt=option.text();
              if(val==undefined){
                  if(option.index()===0){
                    val='';
                  }else{
                    option.attr('value',txt); val=option.attr('value');
                  }
              }
              optionsEl.append('<div data-value="'+val+'" class="select-option">'+txt+'</div>');
              var optionEl=optionsEl.children('.select-option:last');
              if(val===selVal){ optionEl.addClass('selected'); }
              optionEl.click(function(e){
                  e.preventDefault(); e.stopPropagation();
                  var wrap=jQuery(this).parents('.he-styled-select-wrap:first');
                  var sel=self['getSelectForWrap'](wrap);
                  self['setValue'](sel, jQuery(this).attr('data-value'));
                  self['close'](sel);
              });
          });
          if(optionsEl.children('.select-option.selected').length<1){
            optionsEl.children('.select-option:first').addClass('selected');
          }
      },
      init:function(args){
          var retInit={}, self=this;
          var getArg=function(name,defaultVal){
              var ret;
              if(args.hasOwnProperty(name)){ ret=args[name]; }
              else{ ret=defaultVal; }
              if(ret!=undefined){ retInit[name]=ret; }
              return ret;
          };
          var selectSel=getArg('select');
          if(selectSel!=undefined){
              var selects=jQuery(selectSel).not('.init-he-styled-select');
              if(selects.length>0){
                  var onchange=getArg('onchange');
                  var classes=getArg('classes');
                  var currentSelectNum=jQuery('.init-he-styled-select').length;
                  selects.each(function(s){
                      var select=jQuery(this); select.addClass('init-he-styled-select');
                      select.attr('data-styled-select',(currentSelectNum+s+1)+'');
                      select.after('<div data-styled-select="'+(currentSelectNum+s+1)+'" class="he-styled-select-wrap"><div class="select-val"></div><div class="select-options"></div><div class="select-btn"></div></div>');
                      self['updateOptions'](select);
                      if(onchange!=undefined){ select[0]['custom_select_onchange']=onchange; }
                      select.change(function(){
                          var val=self['getValue'](jQuery(this));
                          if(val==undefined){ val=''; }
                          if(val!==jQuery(this).val()){
                              self['setValue'](jQuery(this), jQuery(this).val());
                          }
                      });
                      var wrap=self['getWrapForSelect'](select);
                      if(classes!=undefined){
                          for(var c=0;c<classes.length;c++){
                              select.addClass(classes[c]);
                              wrap.addClass(classes[c]);
                          }
                      }
                      var btn=wrap.children('.select-btn:last');
                      var valEl=wrap.children('.select-val:last');
                      valEl.click(function(e){
                          e.preventDefault(); e.stopPropagation();
                          var w=jQuery(this).parents('.he-styled-select-wrap:first');
                          var sel=self['getSelectForWrap'](w);
                          if(w.hasClass('select-open')){
                              self['close'](sel);
                          }else{
                              self['open'](sel);
                          }
                      });
                      btn.click(function(e){
                          e.preventDefault(); e.stopPropagation();
                          var w=jQuery(this).parents('.he-styled-select-wrap:first');
                          var sel=self['getSelectForWrap'](w);
                          if(w.hasClass('select-open')){
                              self['close'](sel);
                          }else{
                              self['open'](sel);
                          }
                      });
                  });
                  retInit['select_el']=selects;
              }
              //if not already init at least one select
              if(!document.hasOwnProperty('he_styled_select_init')){
                document['he_styled_select_init']=true;
                jQuery(document).keydown(function(e){
                  var openWrap=jQuery('.he-styled-select-wrap.select-open:first');
                  if(openWrap.length>0){
                    switch(e.keyCode){
                      case 38: //key up
                        //e.preventDefault(); e.stopPropagation();
                        break;
                      case 40: //key down
                        //e.preventDefault(); e.stopPropagation();
                        break;
                      case 37: //key left
                        //e.preventDefault(); e.stopPropagation();
                        break;
                      case 39: //key right
                        //e.preventDefault(); e.stopPropagation();
                        break;
                      case 13: //enter key
                        //e.preventDefault(); e.stopPropagation();
                        break;
                      case 27: //escape key
                        e.preventDefault(); e.stopPropagation();
                        self['close'](jQuery('.init-he-styled-select'));
                        break;
                    }
                  }
                });
                jQuery(document).click(function(e){
                  var openWrap=jQuery('.he-styled-select-wrap.select-open:first');
                  if(openWrap.length>0){
                    e.preventDefault(); e.stopPropagation();
                    self['close'](jQuery('.init-he-styled-select'));
                  }
                });
              }
          }
          return retInit;
      }
  };
}());
