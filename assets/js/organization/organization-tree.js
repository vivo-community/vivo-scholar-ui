import {LitElement, css} from 'lit-element'
import {html, directive} from 'lit-html'
import organizationSubOrgQuery from "./organization-query"
import OrganizationCache from "./organization-cache"
import client from "../lib/apollo"
import '@vaadin/vaadin-select'
import _ from "lodash"

/* NOTE: the organization-tree object has a variable to control logging level
     Go to the constructor near the bottom of this module to set the log level,
     or search for $$log (FIXME: use existing central logging control or factor out to create one)
*/

// TODO: 0) Add node openers/closers to tree view
// TODO: 1) needs a spinner for queries
// TODO: 2) probably needs to integrate 'organizations' query to get root orgs and filter out those with no sub-orgs for
//     starting point (OpenVivo may not have an actual single root) -- will probably require a new lit-element as tree
//     root
// TODO: 3) after implementing #2, re-working the cache approach to use roots may be warranted as well

class OrganizationTreeListSelector extends LitElement {
  static get properties () {
    return {
      treelistid: {
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
    vm.selected = 'Hierarchy'
    vm.treeList = null
    document.addEventListener('DOMContentLoaded', (event) => {
      vm.contentLoadedCallback(event)
    })
  }
  handleSelection (e) {
    let vm = this
    let selected = e.target.value
    // console.log('selected: ' + selected)
    if (vm.treeList) {
      // console.log('tree-list-id: ' + vm.treelistid)
      if (selected === 'list') {
        this.selected = 'Index'
        // console.log('setting treelist attribute showas to list')
        vm.treeList.classList.add('showaslist')
        vm.treeList.classList.remove('showastree')
      } else {
        this.selected = 'Hierarchy'
        vm.treeList.classList.add('showastree')
        vm.treeList.classList.remove('showaslist')
      }
    }  else {
      this.selected = 'Hierarchy'
    }
  }
  render () {
    // console.log('treeListId: ' + this.treelistid)
    let vm = this
    //return html`<select @change="${this.handleSelection}"><option value="tree">Hierarchy</option><option value="list">Index</option></input>`
    return html`
      <vaadin-select placeholder="${vm.selected}" value="${vm.selected}" @value-changed="${vm.handleSelection}">
      <template>
        <vaadin-list-box>
          <vaadin-item value="tree">Hierarchy</vaadin-item>
          <vaadin-item value="list">Index</vaadin-item>
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
      orgid: {
        type: String,
        value: null
      },
      graphql: {
        type: Object,
        value: {}
      },
    }
  }

  static get styles () {
    return css`
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
        margin-left: 0px;
      }

      .closed.indicator {
        display: inline;
        margin-left: 0px;
      }
    `
  }
  
  handleClick (ev) {
    let vm = this
    this.logDebug('click')
    if (vm.showas === 'tree') {
      vm.opened = !vm.opened
      if (vm.opened) {
        vm.classList.remove('closed')
        vm.classList.add('opened')
      } else {
        vm.classList.remove('opened')
        vm.classList.add('closed')
      }
    }
    this.logDebug(`click ${vm.opened}`)
  }
  
  classListChanged (newClassList, oldClassList) {
    let vm = this
    let func = 'classListChanged'
    vm.logDebug(`${func} - class old value: '${oldClassList}' new value: '${newClassList}'`)
    vm.showas = 'list'
    if (newClassList.includes('showastree')) {
      vm.showas = 'tree'
    }
    if (vm.showas === 'list') {
      vm.ensureCachePopulated()
        .then(() => {
          vm.requestUpdate()
        })
    } else {
      vm.requestUpdate()
    }
  }
  getAllOrgData (orgid) {
    let vm = this
    let func = 'getAllOrgData'
    vm.logDebug(func + ' - called - orgid: ' + orgid)
    return new Promise((resolve, reject) => {
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
                resolve()
              })
          } else {
            resolve()
          }
        })
        .catch((err) => {
          vm.logError('getAllOrgData - getData error. OrgId: ' + orgId + ' Error: ' + err)
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
            // vm.qldata = data.organization
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
        // vm.qldata = orgData
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
  onMutation (mutations, observer) {
    // This pointer is incorrect at this point, can't call logdebug until after
    //   set via mutation.target, but cannot set that until looping through mutations to get one
    //   Possibly could use mutations[0].target if absolutely necessary

    // console.log('onMutation')
    // console.log(mutations)
    // console.log(observer)
    for (let mutation of mutations) {
      const targetAttrs = []
      let vm = mutation.target // the original this of the organization-tree element
      targetAttrs.push(['class', vm.classListChanged])
      // targets.push(['showas', vm.showasHasChanged])
      // targets.push(['qldata', vm.dataHasChanged])
      // targets.push(['opened', vm.openedHasChanged])
      if (mutation.type === 'attributes') {
        targetAttrs.forEach((v) => {
          vm.logDebug(`onMutation checking for attribute: ${v[0]}`)
          if (v[0] === mutation.attributeName) {
            if (v[0] === 'class') {
              vm.logDebug(`class old value: '${mutation.oldValue}' new value: '${vm.classList}'`)
              const domTokenAsArray = v => { return v.toString().length > 0 ? v.toString().split(' ') : [] }
              v[1].apply(vm, [domTokenAsArray(vm.classList), domTokenAsArray(mutation.oldValue)])
            } else {
              let newVal = vm.getAttribute(v[0])
              vm.logDebug(`${mutation.attributeName} changed to ${newVal}`)
              v[1].apply(vm, [newVal, '']) // called hasChanged with new value (old is not tracked)
            }
          }
        })
      }
    }
  }
  
  connectedCallback () {
    super.connectedCallback ()
    let vm = this
    vm.logDebug('connectedCallback this: ' + vm)
    vm.logDebug(vm)
    vm.logDebug('vivo-organizations-tree connected')
    vm.observer = new MutationObserver(vm.onMutation)
    vm.observer.observe(vm /* element */, {
      attributes: true,
      attributeOldValue: true,
      childList: false,
      subtree: false
    })
    // if (vm.opened) {
      vm.getData()
        .then((data) => {
          vm.logDebug('getData callback')
          vm.setDataValue(data)
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
  
  isPrimitive (obj) {
    let rv = !(obj === undefined) && !(obj === null) && !this.isObject(obj) && !this.isArray(obj)
    this.logDebug('isPrimitive of obj: ' + JSON.stringify(obj) + ' is: ' + rv)
    return rv
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
  
  getShowAsType () {
    let rv = (this.showas ? this.showas : 'tree')
    this.logDebug('getShowAsType: ' + rv)
    return rv
  }
  
  getShowAsClass () {
    return (this.getShowAsType() === 'list' ? 'showaslist' : 'showastree')
  }
  opener () {
    return html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14"><path d="M0 0v16l6-6-6-6z" transform="translate(4,-3)" /></svg>`
  }
  closer () {
    return html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><path d="M0 0v16l6-6-6-6z" transform="rotate(90) translate(7, -15)" /></svg>`
  }
  
  render () {
    let vm = this
    try {
      vm.logDebug('tree after graphql: ' + vm.stringify(vm.getDataValue()))
      vm.logDebug('My id(non-root is undefined): ' + vm.id)
      let templates = []
      if (vm.getShowAsType() === 'tree') {
        const theData = vm.getDataValue()
        const hasOrgs = theData && !_.isEmpty(theData) && vm.isArray(theData.hasSubOrganizations)
        const classes = ['indicator']
        if (hasOrgs) {
          if (vm.classList.contains('closed'))
            classes.push('closed')
          else if (vm.classList.contains('opened')) {
            classes.push('opened')
          }
        }
        vm.logDebug('openClosed - classes are: ' + classes + ' theData is: ' + vm.stringify(theData))
        if (classes.includes('opened')) {
          templates.push(html`<div><span class="${classes.join(' ')}">${vm.closer()}</span><span @click="${vm.handleClick}">${vm.getName(theData)}</span></div>`)
        } else if (classes.includes('closed')) {
          templates.push(html`<div><span class="${classes.join(' ')}">${vm.opener()}</span><span @click="${vm.handleClick}">${vm.getName(theData)}</span></div>`)
        } else {
          templates.push(html`<div><span class="${classes.join(' ')}"></span><span @click="${vm.handleClick}">${vm.getName(theData)}</span></div>`)
        }
        if (vm.opened) {
          if (vm.getDataValue() && !_.isEmpty(vm.getDataValue())) {
            if (vm.isArray(vm.getDataValue().hasSubOrganizations)) {
              vm.getDataValue().hasSubOrganizations.sort((a, b) => a.label >= b.label).forEach((v, idx) => {
                this.logDebug('tree creating object elem directly for array item: ' + idx + '. ' + vm.stringify(vm.getDataValue()))
                templates.push(html`<vivo-organizations-tree class="${vm.getShowAsClass()}" orgid="${v.id}" orgname="${v.label}">`)
              })
            } //else {
              // this.logDebug('tree creating ERROR directly. ' + vm.stringify(vm.qldata))
              // templates.push(html`<div>Organization tree - Error: unknown qldata type. Orgid is: ${vm.orgid}</div>`)
            //}
          }
        }
      } else { // show as list
        let sorted = vm.getCache().getAsSortedByNameArray()
        if (vm.logLevelDebug()) {
          console.log(sorted)
        }
        sorted.forEach((v, idx) => {
          templates.push(html`<div orgid="${v[0]}">${v[1].name}</div>`)
        })
      }
      return html`${templates}`
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
    vm.showas = 'tree'
    vm.opened = false
    vm.graphql = organizationSubOrgQuery
    vm.levelTrace = 5
    vm.levelDebug = 4
    vm.levelInfo = 3
    vm.levelWarn = 2
    vm.levelError = 1
    vm.levelNone = 0
    vm.logLevel = vm.levelDebug // $$Log level setting
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
