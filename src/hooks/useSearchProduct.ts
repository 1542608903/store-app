import { IProduct } from 'src/types/product';
import { getSearch } from 'src/api/product';
import { reactive } from 'vue';



export default function useSearchProduct() {

  const list = reactive<IProduct[]>([])

  const searchProduct = async (search: string) => {
    const limit = 10;
    const res = await getSearch(search, limit);
    const data = res.result?.list as IProduct[];
    list.length = 0
    list.push(...data);
  }
  return {
    list,
    searchProduct
  }
}
