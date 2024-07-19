
const getForumAvtoApi = async (q, supplier) => { 

    try{
        const result = await fetch(
            `https://api.forum-auto.ru/v2/listGoods?login=466479_bondar&pass=HRRUOKixvN&art=${q}&cross=1`
        );
        const mass = await result.json(); 
        if (mass?.length) {
            const data = await mass
                .filter(p => p.num > 0)
                .filter(p => ['MSK', 'RST'].includes( p.whse )) // свои склады
                .map(item => ({
                    article: item.art,
                    brand: item.brand,
                    product_name: item.name,
                    price: item.price,
                    quantity: item.num,
                    delivery_duration: item.d_deliv,
                    supplier,
                    color: '#4800ff',
                    warehouse_name: item.whse
                }))
            if (data.length) {
                const newData = [
                    ...data
                ]
                return newData
            } else return 'notFound'
        } else {
            return 'notFound'
        }
    }catch(e){
        return 'noConnection'
    }

}



export default getForumAvtoApi 
