"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const t=i=>{const s=new e(i.id);return"A"===i.tagName.toUpperCase()&&""!==i.getAttribute("href")&&(s.href=i.getAttribute("href"),i.setAttribute("tabindex","-1")),i.getAttribute("aria-owns")?(i.getAttribute("aria-owns").split(" ").forEach((e=>{const i=document.getElementById(e),a=t(i);a.parent=s,s.children.push(a)})),s):s};class e{constructor(t){this.name=t,this.parent=null,this.href=null,this.children=[]}}class i{constructor(t){this.root=t,this.active=t}up(){this.active.parent&&(this.active=this.active.parent)}down(){this.active.children.length&&(this.active=this.active.children[0])}left(){if(this.active.parent){let t=this.active.parent.children.indexOf(this.active);t>0&&(this.active=this.active.parent.children[t-1])}}right(){if(this.active.parent){let t=this.active.parent.children.indexOf(this.active);t<this.active.parent.children.length-1&&(this.active=this.active.parent.children[t+1])}}activateLink(){this.active.href&&(window.location.href=this.active.href)}}class s{constructor(e){this.node=e,this.tree=(e=>{const s=e.hasAttribute("aria-owns")?e:e.querySelector("[aria-owns]");return s?new i(t(s)):console.warn("no aria-owns attribut in tree:",e)})(e),this.node.addEventListener("keydown",this.move.bind(this)),this.node.addEventListener("focusin",this.highlight.bind(this,!0)),this.node.addEventListener("focusout",this.highlight.bind(this,!1))}active(){return this.tree.active}move(t){switch(this.highlight(!1),[32,37,38,39,40,13,32].indexOf(t.keyCode)>-1&&t.preventDefault(),t.keyCode){case 37:this.tree.left();break;case 38:this.tree.up();break;case 39:this.tree.right();break;case 40:this.tree.down();break;case 32:case 13:this.tree.activateLink()}this.highlight(!0),this.node.setAttribute("aria-activedescendant",this.active().name)}highlight(t){const e=this.active().name===this.node.id?this.node:this.node.querySelector("#"+this.active().name);!0===t&&e.classList.add("is-activedescendant"),!1===t&&e.classList.remove("is-activedescendant")}}exports.attachNavigator=function(t){new s(t),t.setAttribute("tabindex","0")};
