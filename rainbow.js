class Rainbow {
    constructor(colorconstant = 0) {
        this.colorconstant = colorconstant
    }
    get color() {
        let ref = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
        let rgb = [Math.sin(this.colorconstant)*128+128, Math.sin(this.colorconstant+2.1)*128+128, Math.sin(this.colorconstant+4.2)*128+128]
        this.colorconstant += 0.314
        return parseInt(`0x${rgb.reduce((acc, cur) => {
            return acc += ref[Math.floor(cur/16)] + ref[Math.floor(cur)%16]
        }, '')}`)
    }
    get constant() {
        return this.colorconstant
    }
}
module.exports = Rainbow