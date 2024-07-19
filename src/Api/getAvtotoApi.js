
const getAvtotoApi = async (q, supplier) => { 


    const SearchGetParts2 = async (processIdjson, supplier) => {

        const result = await fetch(
            `http://izicar.grainpro.ru/avtoto.php?processId=${processIdjson.ProcessSearchId}`
        );
    
        const mass = await result.json(); 
        if(mass?.Info?.SearchStatus == 2){
            return await  SearchGetParts2(processIdjson, supplier)
        }else if(mass.Info.SearchStatus == 4){
            if(mass.Parts.length){
                const data = await mass.Parts
                // .filter(p=>p.MaxCount > 0)
                .map(item=>({
                    article: item.Code,
                    brand: item.Manuf,
                    product_name: item.Name,
                    price: item.Price,
                    quantity: item.MaxCount,
                    delivery_duration: item.Delivery,
                    supplier,
                    color: 'red',
                    warehouse_name: item.Storage
                }))
                if(data.length){
                const newData = [
                    ...data,
                ]
                return newData
            } else return 'notFound'
            }
            else{
                return 'notFound'
            }
        }
        else{    
            return 'notFound'
        }
    }
    
        try{

        const processId = await fetch(
            `http://izicar.grainpro.ru/avtotostart.php?art=${q}`
        );
        const processIdjson = await processId.json();

        return await SearchGetParts2(processIdjson, supplier)
        
}catch(e){
    return 'noConnection'
}




}

export default getAvtotoApi