
const getMikadoApi = async (q, supplier) => { 

    
        try{
            const result = await fetch(
                  `http://izicar.grainpro.ru/?art=${q}`
            );
            const mass = await result.json(); 
            
            if (mass?.length) {
                const data = await mass
                    .filter(p => p.num.match(/\d+/)[0] > 0)
                    .map(item => ({
                        article: item.art,
                        brand: item.brand,
                        product_name: item.name,
                        price: item.price,
                        quantity: item.num,
                        delivery_duration: item.d_deliv,
                        supplier,
                        color: '#ff00b8',
                        warehouse_name: item.warehouse_name
                    }))
                if (data?.length) {
                    const newData = [
                        ...data
                    ]
                    return newData
                } else  return 'notFound'
            } else {
                return 'notFound'
            }
          }catch(e){
            return 'noConnection'
          }
        
}



export default getMikadoApi
