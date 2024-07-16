// import sortdata from "../../../helpers/sort"
import React from "react"


const getMikadoApi = async ({search}) => { 

    const supplier = 'Микадо'

    const q = search
    const data = await SearchGetParts(q, supplier)
    if(data == 500) throwException(q,  supplier, 500)
        else if(!data.length) throwException(q,  supplier)
        else
          return data.json()



          const SearchGetParts = async (q,  supplier) => { //needs to be done
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
                  } else return []
              } else {
                  return []
              }
            }catch(e){
                return 500
            }
        }
        
        const throwException = (q, supplier, status = 200) => {
        
            if(status == 200)
               return [
                {
                    supplier,
                    notFound: true
                }].json()
                else if(status == 500)
                    return[
                        {
                            supplier,
                            noConnection: true
                        }].json()
        }

    
  }



export default getMikadoApi;
