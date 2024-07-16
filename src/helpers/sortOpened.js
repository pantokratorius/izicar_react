
const sortOpened =  (data, q, order= 'price') => {
    if(order == 'price'){
        data.sort((a, b) => {
            const nameA = a.article.toUpperCase(); 
            const nameB = b.article.toUpperCase(); 
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            
            return 0;
        })
        data.sort((a, b) => parseFloat(a.delivery_duration) - parseFloat(b.delivery_duration))
        data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        data.sort((a) => a.article.toLowerCase().replace(/-/g,'').indexOf(q.toLowerCase().replace(/-/g,'')) + 1 ? -1 : 1)
        data.sort((a) => a.article.toLowerCase().replace(/-/g,'') == q.toLowerCase().replace(/-/g,'') ? -1 : 1)
    }
    else if(order == 'delivery'){
        data.sort((a, b) => {
            const nameA = a.article.toUpperCase(); 
            const nameB = b.article.toUpperCase(); 
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            
            return 0;
        })
        data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        data.sort((a, b) => parseFloat(a.delivery_duration) - parseFloat(b.delivery_duration))
        data.sort((a) => a.article.toLowerCase().replace(/-/g,'').indexOf(q.toLowerCase().replace(/-/g,'')) + 1 ? -1 : 1)
        data.sort((a) => a.article.toLowerCase().replace(/-/g,'') == q.toLowerCase().replace(/-/g,'') ? -1 : 1)
    }
    // else if(order == 'article'){
    //     data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    //     // data.sort((a, b) => parseFloat(a.delivery_duration) - parseFloat(b.delivery_duration))
    //     data.sort((a) => a.article.toLowerCase().replace(/-/,'').indexOf(q.toLowerCase().replace(/-/,'')) + 1 ? -1 : 1)
    //     data.sort((a) => a.article.toLowerCase().replace(/-/,'') == q.toLowerCase().replace(/-/,'') ? -1 : 1)
    // }

    return data
}

export default sortOpened