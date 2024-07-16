
const formatPrice =  price => {

    return Number( price ).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace(/[.]/g,',')
}

export default formatPrice