
const sortByBrand =  (x, y) => {
    if (x.title < y.title) {return -1;}
    if (x.title > y.title) {return 1;}
    return 0;
}

export default sortByBrand
