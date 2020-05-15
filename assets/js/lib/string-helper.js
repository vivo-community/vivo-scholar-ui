
// https://stackoverflow.com/questions/18379254/regex-to-split-camel-case
function uncamelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export default uncamelCase