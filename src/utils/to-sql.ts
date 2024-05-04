export default (str: string) => {
    if(!str) return
    return str.replace(/\'/g, '\`')
}
