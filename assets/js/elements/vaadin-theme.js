// Style Vaadin Components

import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles('vaadin-select', css`
  [part="toggle-button"]::before {
    content: var(--lumo-icons-chevron-down);
    color: var(--textColor);
    background-color: var(--lightNeutralColor);
  }
`);

registerStyles('vaadin-select-text-field', css`
  [part="input-field"] {
    border: 1px solid var(--textColor);
    background-color: var(--lightNeutralColor);
    border-radius: 0;
  }
`);

registerStyles('vaadin-select-overlay', css`
  [part="overlay"] {
    color: var(--textColor);
    background-color: var(--lightNeutralColor);
    border: 1px solid var(--textColor);
    border-radius: 0;
  }
`);
