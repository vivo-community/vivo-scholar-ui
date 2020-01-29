import { LitElement } from 'lit-element';

class PersonNavigation extends LitElement {

  constructor() {
    super();
    this.browsingState = {};
    this.navFrom = this.navFrom.bind(this);
    this.navTo = this.navTo.bind(this);
    this.trapLinks = this.trapLinks.bind(this);
    this.handleTabSelected = this.handleTabSelected.bind(this);
  }

  firstUpdated() {
    document.addEventListener('DOMContentLoaded',this.navFrom);
    document.addEventListener('click',this.trapLinks );
    document.addEventListener('tabSelected',this.handleTabSelected);
  }


  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('DOMContentLoaded',this.navFrom);
    document.removeEventListener('click',this.trapLinks);
    document.removeEventListener('tabSelected',this.handleTabSelected);
  }

  trapLinks(e) {
    const eventPath = e.composedPath();
    const linkTarget = eventPath.find(n => n.href);
    if (linkTarget) {
      e.preventDefault();
      this.browsingState.navTo = linkTarget.href;
      const publication = eventPath.find(n => n.tagName === 'VIVO-PUBLICATION');
      if (publication) {
        const publicationList = this.getPublicationList();
        this.browsingState.currentSection = "publications";
        this.browsingState.sectionSort = publicationList.getSort();
        this.browsingState.returnTo = publication.url;
      }
      const grant = eventPath.find(n => n.tagName === 'VIVO-GRANT');
      if (grant) {
        const grantList = this.getGrantList();
        this.browsingState.currentSection = "grants";
        this.browsingState.sectionSort = grantList.getSort();
        this.browsingState.returnTo = grant.url;
      }
      this.navTo();
    }
  }

  navFrom() {
    const url = new URL(window.location.href);
    const incomingBrowsingState = {};
    for(let key of url.searchParams.keys()) {
      incomingBrowsingState[key] = url.searchParams.get(key);
    }
    const { currentTab, currentSection, sectionSort, returnTo, navTo } = incomingBrowsingState;
    if (currentTab) {
      const tabs = this.getMainTabs();
      if (tabs) {
        tabs.selectTabById(currentTab);
      }
    }
    switch(currentSection) {
      case 'publications':
        if (sectionSort) {
          const publicationList = this.getPublicationList();
          if (publicationList) {
            publicationList.setSort(sectionSort);
            publicationList.showItem(returnTo);
          }
        }
      case 'grants':
        if (sectionSort) {
          const grantList = this.getGrantList();
          if (grantList) {
            grantList.setSort(sectionSort);
            grantList.showItem(returnTo);
          }
        }
    }

  }

  navTo() {
    const searchParams = new URLSearchParams(this.browsingState);
    window.history.replaceState({},'', `${window.location.pathname}?${searchParams.toString()}`);
    window.location.href = this.browsingState.navTo;
  }

  handleTabSelected(e) {
    const tab = e.detail;
    this.browsingState.currentTab = tab.id
  }

  getMainTabs() {
    return document.querySelector('vivo-tabs');
  }

  getPublicationList() {
    return document.querySelector('#publication-list');
  }

  getGrantList() {
    return document.querySelector('#grant-list');
  }


}

customElements.define('vivo-person-navigation',PersonNavigation);
