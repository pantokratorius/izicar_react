import formatPrice from "../../helpers/formatPrice"


const PartsTr = ({ifNextBrand, ifNextArticle, selectOne, item, k, arr }) => {

  return(
    <tr className={`${ifNextBrand(item, k, arr)  ? 'bordered' : ''} ${ifNextArticle(item, k, arr)  ? 'articled' : ''}`} >
          <td style={ifNextArticle(item, k, arr) ? {background:'#d7d7d7'} : null}>{ifNextArticle(item, k, arr)  ? item.article : ''}</td>
          <td title={
            ifNextBrand(item, k, arr)  ? item.brand : ''
          } style={
            ifNextBrand(item, k, arr)  ? {background:'#f0f1ed', fontWeight:'bold'} : null
          }>{ifNextBrand(item, k, arr)  ? item.brand : ''}</td>
          <td>{item.product_name}</td>
          <td style={{textAlign: 'center', width: '100px', background: '#eff1fb'}}>{item.quantity}</td>
          <td style={{textAlign: 'center', width: '150px', background: '#effbf6', maxWidth: '100px'}}>{item.delivery_duration} дн.</td>
          <td style={{textAlign: 'center', width: '150px', whiteSpace: 'nowrap', background: '#fbefef', fontWeight: 'bold'}}>{ Number( item.price ) > 0 && `${ formatPrice(item.price) } р.` }</td>
          <td onClick={selectOne} style={{textAlign: 'center', color: item.color || '#ff6a00', whiteSpace: 'nowrap', fontSize: '13px', cursor: 'pointer'}}><b>{item.supplier}</b></td>
          <td style={{textAlign: 'center', color: item.color || '#ff6a00', whiteSpace: 'nowrap', fontSize: '13px'}}>{item.warehouse_name}</td>
      </tr>
 )
}


export default PartsTr