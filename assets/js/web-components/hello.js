/*
class Hello extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML =  `
        <span>
        Hello, <slot />!
        </span>
    `;
  }
}
customElements.define('vivo-hello', Hello)
*/

import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter'
import '@webcomponents/webcomponentsjs/webcomponents-loader.js'
import React from 'react'

import Element, { h } from '@skatejs/element-react';

class Hello extends Element {
  render() {
    return (
      <span>
        Hello, <slot />!
      </span>
    );
  }
}

customElements.define('vivo-hello', Hello);

//export default Hello