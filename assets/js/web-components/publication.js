import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter'
import '@webcomponents/webcomponentsjs/webcomponents-loader.js'
import React from 'react'

import Element, { h } from '@skatejs/element-react';
/*
<publication-list format="chicago">
<publication id="<%= p["id"] %>" title="<%= p["title"] %>"/>
</publication-list>   

            <ul class="list-group">
            <%= for (p) in person["selectedPublications"] { %>
               <li class="list-group-item">
                   <span class="publication-title">
                      <a href=/entities/publication/<%= p["id"] %>>
                        <%= p["title"] %>
                      </a> 
                   </span>
               </li>
            <% } %>
            </ul>

*/
class Publication extends Element {
  /*
  https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
    static props = {
    id: String,
    title: String
  };
  */
  static get props() {
    return {
      name: String,
      title: String
    };
  }
  render() {
    return (
      <li>
        <span className="publication-title">
          <a href={`/entities/publication/${this.id}`}>
           { this.title }
          </a> 
        </span>
      </li>
    );
  }
}

customElements.define('vivo-publication', Publication)

//export default Publication