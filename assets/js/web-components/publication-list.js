import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter'
import '@webcomponents/webcomponentsjs/webcomponents-loader.js'
import React from 'react'

import Element, { h } from '@skatejs/element-react';

class PublicationList extends Element {
  render() {
    return (
        <ul>
          <slot />
        </ul>
    );
  }
}

customElements.define('vivo-publication-list', PublicationList)

//export default PublicationList