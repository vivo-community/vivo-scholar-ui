import { LitElement, css } from 'lit-element'
import { html } from 'lit-html'
import { classMap } from 'lit-html/directives/class-map'
import { until } from 'lit-html/directives/until'
import organizationSubOrgQuery from "./organization-query"
import OrganizationCache from "./organization-cache"
import client from "../lib/apollo"
import '../elements/vaadin-theme.js'
import '@vaadin/vaadin-select'
import _ from 'lodash'
import qs from 'qs'

/* NOTE: the organization-tree object has a variable to control logging level
     Go to the constructor near the bottom of this module to set the log level,
     or search for $$log (FIXME: use existing central logging control or factor out to create one)
*/
// TODO: 1) needs a spinner for queries

class OrganizationTreeListSelector extends LitElement {
  static get properties () {
    return {
      treelistid: {
        type: String,
        value: null
      },
      labelForSelectTypeTree: {
        type: String,
        value: null
      },
      labelForSelectTypeList: {
        type: String,
        value: null
      }
    }
  }
  connectedCallback () {
   super.connectedCallback()
  }
  disconnectedCallback () {
    super.disconnectedCallback()
  }
  contentLoadedCallback () {
    let vm = this
    vm.treeList = document.getElementById(vm.treelistid)
  }
  constructor () {
    super()
    let vm = this
    vm.treeList = null
    document.addEventListener('DOMContentLoaded', (event) => {
      vm.contentLoadedCallback(event)
    })
    vm.selected = vm.labelForSelectTypeTree
  }
  handleSelection (e) {
    let vm = this
    let selected = e.target.value
    // console.log('selected: ' + selected)
    if (vm.treeList) {
      // console.log('tree-list-id: ' + vm.treelistid)
      if (selected === 'list') {
        this.selected = vm.labelForSelectTypeList
        // console.log('setting treelist attribute showas to list')
        vm.treeList.showas = 'list'
      } else {
        this.selected = vm.labelForSelectTypeTree
        vm.treeList.showas = 'tree'
      }
    }  else {
      this.selected = vm.labelForSelectTypeTree
    }
  }
  render () {
    // console.log('treeListId: ' + this.treelistid)
    let vm = this
    //return html`<select @change="${this.handleSelection}"><option value="tree">Hierarchy</option><option value="list">Index</option></input>`
    return html`
      <vaadin-select placeholder="${vm.labelForSelectTypeTree}" value="${vm.labelForSelectTypeTree}" @value-changed="${vm.handleSelection}">
      <template>
        <vaadin-list-box>
          <vaadin-item value="tree">${vm.labelForSelectTypeTree}</vaadin-item>
          <vaadin-item value="list">${vm.labelForSelectTypeList}</vaadin-item>
        </vaadin-list-box>
      </template>
      </vaadin-select>
    `
  }
}
customElements.define('vivo-organizations-tree-list-selector', OrganizationTreeListSelector)

const opener = () => {
  return(html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14"><path d="M0 0v16l6-6-6-6z" transform="translate(4,-3)" /></svg>`)
}
const closer = ()  => {
  return(html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><path d="M0 0v16l6-6-6-6z" transform="rotate(90) translate(7, -15)" /></svg>`)
}

class OrganizationTree extends LitElement {
  
  // LOG LEVEL - The initial log level is set in the constructor() near the bottom of the module
  
  setLogLevel (level) {
    this.logLevel = level
  }
  
  static get properties () {
    return {
      id: {
        type: String,
        value: null
      },
      loadingMsg: {
        type: String,
        value: null
      },
      notFoundMsg: {
        type: String,
        value: null
      },
      orgid: {
        type: String,
        value: null
      },
      siteorgid: {
        type: String,
        value: null
      },
      showas: {
        type: String,
        value: "tree",
        attribute: true,
        reflect: true
      },
      opened: {
        type: Boolean,
        value: false,
        attribute: true,
        reflect: true
      }
    }
  }

  static get styles () {
    return css`
      a {
        color: #000000;
        text-decoration: none;
      }
      :host(.showaslist) {
        display: block;
      }

      :host(.showastree) {
        display: block;
        padding-left: 0.5em;
      }

      :host {
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 1.8em;
      }

      div {
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 1.8em;
      }

      .indicator {
        display: inline;
        margin-left: 9px;
      }

      .opened.indicator {
        display: inline;
        margin-left: -9px;
      }

      .closed.indicator {
        display: inline;
        margin-left: -9px;
      }
    `
  }
  handleOpenClose (ev) {
    let vm = this
    this.logDebug('handleOpenClose: ' + vm.showas)
    if (vm.showas === 'tree') {
      vm.opened = (vm.opened ? false : true)
    }
    this.logDebug(`handleOpenClose ${vm.opened}`)
  }

  getAllOrgData (orgid) {
    let vm = this
    let func = 'getAllOrgData'
    vm.logDebug(func + ' - called - orgid: ' + orgid)
    return new Promise((resolve, reject) => {
      vm.setLoading()
      vm.getData(orgid)
        .then((data) => {
          if (data && data.hasSubOrganizations) {
            let promises = []
            data.hasSubOrganizations.forEach((v, idx) => {
              vm.logDebug(func + ' hasSubOrganizations - looking for: ' + v.id)
              promises.push(vm.getAllOrgData(v.id))
            })
            Promise.all(promises)
              .then(() => {
                vm.resetLoading()
                resolve()
              })
          } else {
            vm.resetLoading()
            resolve()
          }
        })
        .catch((err) => {
          vm.logError('getAllOrgData - getData error. OrgId: ' + orgid + ' Error: ' + err)
          vm.resetLoading()
          reject(err)
        })
    })
  }
  
  ensureCachePopulated () {
    let vm = this
    let func = 'ensureCachePopulated'
    vm.logDebug(func + ' - called')
    return new Promise((resolve, reject) => {
      if (!vm.getCache().isFullyPopulated()) {
        vm.getAllOrgData(vm.orgid)
          .then(() => {
            vm.getCache().setFullyPopulated()
            vm.logDebug(func + ' - resolving after setting fully populated')
            resolve()
          })
          .catch((err) => {
            vm.logError(func + ' - error: ' + err)
            reject(err)
          })
      } else {
        vm.logDebug(func + ' - resolving - already fully populated')
        resolve()
      }
    })
  }
  setLoading () {
    let vm = this
    vm.logDebug('setLoading()')
    vm.modal.showModal = true
  }
  resetLoading () {
    let vm = this
    vm.logDebug('resetLoading()')
    vm.modal.showModal = false
  }
  getData (orgid) {
    let func = 'organizationTree.getData'
    let vm = this
    return new Promise((resolve, reject) => {
      vm.logDebug('graphql object: ')
      vm.logDebug(vm.graphql)
      if (!orgid) {
        orgid = vm.orgid
      }
      vm.logDebug('getData tree query for orgid: ' + orgid)
      let orgData = vm.getCache().getOrg(orgid)
      if (!orgData) {
        client.query({
          query: vm.graphql,
          variables: {
            id: orgid
          }
        })
          .then((resp) => {
            let data = resp.data
            vm.logDebug('data returned by query: ')
            vm.logDebug(data)
            vm.logDebug(func + ' - added data to cache for orgid: ' + orgid)
            vm.getCache().putOrg(orgid, data.organization)
            if (vm.logLevelDebug()) {
              vm.getCache().dump()
            }
            resolve(data.organization)
          })
          .catch((error) => {
            vm.logDebug('getData error: ' + error)
            reject(error)
          })
      } else {
        vm.logDebug(func + ' - resolved data from cache for orgid: ' + vm.orgid)
        resolve(orgData)
      }
    })
  }
  getDataValue () {
    return this.qldata // this.getAttribute('qldata')
  }
  setDataValue (value) {
    let vm = this
    vm.qldata = value // setAttribute('qldata', value)
    vm.requestUpdate()
  }
  
  connectedCallback () {
    super.connectedCallback ()
    let vm = this
    vm.logDebug('connectedCallback this: ' + vm)
    vm.logDebug(vm)
    vm.logDebug('vivo-organizations-tree connected')
    vm.setLoading()
    vm.getData()
        .then((data) => {
          vm.resetLoading()
          vm.logDebug('getData callback')
          vm.setDataValue(data)
      })
      .catch((err) => {
        vm.resetLoading()
      })
    //}
    vm.logDebug('getData complete')
  }
  disconnectedCallback () {
    super.disconnectedCallback ()
    this.logDebug('vivo-organizations-tree disconnected')
  }

  getCache (cache) { // FIXME need a better place for this cache e.g. a top level object TBD
    if (!window.organizationCache) {
      window.organizationCache = new OrganizationCache()
    }
    return window.organizationCache
  }
  
  isObject (obj) {
    return obj instanceof Object && !(Array.isArray(obj))
  }
  
  isArray (obj) {
    return Array.isArray(obj)
  }
  
  stringify (obj) {
    let msg = 'Error converting to string'
    let rv = msg
    try {
      rv = JSON.stringify(obj)
    } catch (err) {
      this.logError(obj)
      this.logError(msg)
    }
    return rv
  }
  
  getName (obj) {
    this.logDebug('getName: ' + this.stringify(obj))
    return obj.name || obj.label
  }
  
  getShowAsClass () {
    return (this.showas === 'list' ? 'showaslist' : 'showastree')
  }
  opener () {
    return html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14"><path d="M0 0v16l6-6-6-6z" transform="translate(4,-3)" /></svg>`
  }
  closer () {
    return html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><path d="M0 0v16l6-6-6-6z" transform="rotate(90) translate(7, -15)" /></svg>`
  }
  hasOrgs () {
    let vm = this
    const theData = vm.getDataValue()
    const rv = theData && !_.isEmpty(theData) && vm.isArray(theData.hasSubOrganizations)
    return rv
  }
  getPeopleSearchLink (orgName, hasSubOrgs) {
    let vm = this
    vm.logDebug('getPeopleSearchLink: ' + orgName)
    let theFilters = [{field: 'organizations', value: orgName, 'opKey': 'EQUALS', 'tag': 'organizations'}]
    if (hasSubOrgs) {
      theFilters = [{field: 'schools', value: orgName, 'opKey': 'EQUALS', 'tag': 'schools'}]
    }
    let link = '/search'
    let src = {
      search: '*',
      page: '0',
      orders: [
        {property: 'name', direction: 'ASC'}
      ],
      filters: theFilters,
      'search-tab': 'person-search'
    }
    let query = qs.stringify(src)
    return '/search?' + query
  }
  render () {
    let vm = this
    let theData = vm.getDataValue()
    try {
      if (vm.logLevelDebug()) {
        vm.logDebug('tree after graphql: ' + vm.stringify(theData))
        vm.logDebug('My id(non-root is undefined): ' + vm.id)
        vm.logDebug(`orgid: ${vm.orgid} - siteorgid: ${vm.siteorgid}`)
        vm.logDebug(`showas: ${vm.showas}`)
        vm.logDebug(`opened: ${vm.opened}`)
      }
      let templates = []
      if (vm.showas === 'tree') {
        if (vm.siteorgid !== vm.orgid) {
          if (vm.opened && vm.hasOrgs()) {
            vm.classes = {indicator: true, opened: vm.opened, closed: !!!vm.opened}
            templates.push(html`<div><span @click="${vm.handleOpenClose}" class="${classMap(vm.classes)}">${vm.closer()}</span><a href="${vm.getPeopleSearchLink(vm.getName(theData), vm.hasOrgs())}" orgid="${vm.orgid}">${vm.getName(theData)}</a></div>`)
          } else if (vm.hasOrgs()) {
            vm.classes = {indicator: true, opened: vm.opened, closed: !!!vm.opened}
            templates.push(html`<div><span @click="${vm.handleOpenClose}" class="${classMap(vm.classes)}">${vm.opener()}</span><a href="${vm.getPeopleSearchLink(vm.getName(theData), vm.hasOrgs())}" orgid="${vm.orgid}">${vm.getName(theData)}</a></div>`)
          } else {
            vm.classes = {indicator: true, opened: false, closed: false}
            templates.push(html`<div><span class="${classMap(vm.classes)}"></span><a href="${vm.getPeopleSearchLink(vm.getName(theData), vm.hasOrgs())}" orgid="${vm.orgid}">${vm.getName(theData)}</a></div>`)
          }
        } else {
          if (!theData || _.isEmpty(theData)) {
            templates.push(html`<div>${vm.notFoundMsg}</div>`)
          }
        }
        if (vm.opened) {
          if (vm.getDataValue() && !_.isEmpty(theData)) {
            if (vm.hasOrgs()) {
              theData.hasSubOrganizations.sort((a, b) => a.label >= b.label).forEach((v, idx) => {
                vm.logDebug('tree creating object elem directly for array item: ' + idx + '. ' + vm.stringify(theData))
                templates.push(html`<vivo-organizations-tree class="${vm.getShowAsClass()}" orgid="${v.id}" showas="tree" orgname="${v.label}">`)
              })
            } //else {
              // this.logDebug('tree creating ERROR directly. ' + vm.stringify(vm.qldata))
              // templates.push(html`<div>Organization tree - Error: unknown qldata type. Orgid is: ${vm.orgid}</div>`)
            //}
          }
        }
        return html`${templates}`
      } else { // show as list
        let loader = new Promise((resolve, reject) => {
          vm.ensureCachePopulated()
            .then(() => {
              vm.logDebug(`ensureCachePopulated OK`)
              let sorted = vm.getCache().getAsSortedByNameArray()
              if (vm.logLevelDebug()) {
                console.log(sorted)
              }
              sorted.forEach((v, idx) => {
                if(vm.siteorgid !== v[0]) {
                  templates.push(html`<div><a href="${vm.getPeopleSearchLink(v[1].name, v[1].hasOrgs())}" orgid="${v[0]}">${v[1].name}</a></div>`)
                }
              })
              resolve(templates)
            })
            .catch((err) => {
              vm.logError(`ensureCachePopulated error: ${err}`)
              templates.push(html`<div>${vm.notFoundMsg}</div>`)
              resolve(templates) // resolve with error msg instead of reject(err)
            })
        })
  
       return html`${until(loader,html`<span>${vm.loadingMsg}</span>`)}`
    }
    
    } catch (err) {
      let msg = 'render: get data error: ' + err
      vm.logError(msg)
      return (html`<div>${msg}</div>`)
    }
  }
  
  constructor () {
    super ()
    let vm = this
    vm.qldata = {}
    vm.classes = { "indicator": true, "opened": false, "closed": false }
    // vm.showas = 'tree'
    vm.graphql = organizationSubOrgQuery
    vm.modal = document.querySelector('#loading');
    vm.levelTrace = 5
    vm.levelDebug = 4
    vm.levelInfo = 3
    vm.levelWarn = 2
    vm.levelError = 1
    vm.levelNone = 0
    vm.logLevel = vm.levelDebug // $$Log level setting
    // vm.logLevel = vm.levelError // $$Log level setting
  }
  logLevelTrace () {
    return this.logLevel >= this.levelTrace
  }
  logLevelDebug () {
    return this.logLevel >= this.levelDebug
  }
  logLevelInfo () {
    return this.logLevel >= this.levelInfo
  }
  logLevelWarn () {
    return this.logLevel >= this.levelWarn
  }
  logLevelError () {
    return this.logLevel >= this.levelError
  }
  
  logTrace(msg) {
    if (this.logLevelTrace()) {
      console.log(msg)
    }
  }
  logDebug(msg) {
    if (this.logLevelDebug()) {
      console.log(msg)
    }
  }
  logInfo(msg) {
    if (this.logLevelInfo()) {
      console.log(msg)
    }
  }
  logWarn(msg) {
    if (this.logLevelWarn()) {
      console.log(msg)
    }
  }
  logError(msg) {
    if (this.logLevelError()) {
      console.trace(msg)
    }
  }
  
  
}
customElements.define('vivo-organizations-tree', OrganizationTree)
