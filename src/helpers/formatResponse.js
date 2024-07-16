
const formatResponse =  ( mass,  format ) => {
    const data =  mass
    .filter(p => p[format.quantity] > 0)
    .map(item => ({
        article: item[ format.article ],
        brand: item[ format.brand ],
        product_name: item[ format.product_name ],
        price: format.item[ format.price ],
        quantity: item[ format.quantity ],
        delivery_duration: item[ format.delivery_duration ],
    }))
    
if (data.length) {
    const newData = [{
            article: '%%',
            brand: 'Форумавто',
            product_name: '',
            price: '',
            quantity: '',
            delivery_duration: '',
        },
        ...data
    ]
    return newData
} else return []
}

export default formatResponse