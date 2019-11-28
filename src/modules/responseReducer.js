import Actions from './actions'

export default (state = {items: []}, action) => {
    switch (action.type) {
        case Actions.Types.ADD_RESPONSE:
            return {
                items: [
                    ...state.items.map(item => {
                        item['actual'] = false;
                        return item;
                    }),
                    {
                        items: action.payload.items.map(
                            possibleProductsItem => {
                                possibleProductsItem['resolved']  = possibleProductsItem.products.length === 1;
                                return possibleProductsItem;
                            }
                        ),
                        actual: true
                    }
                ]
            };
        case Actions.Types.CHOOSE_ITEM:
            return {
                items: [
                    ...state.items.map(responseItem => (
                        {
                            ...responseItem,
                            items: responseItem['actual'] ? responseItem['items'].map(
                                (parsedProduct, index) => (
                                                {
                                                    ...parsedProduct,
                                                    products: index === action.payload.parsedProductIndex ?
                                                        parsedProduct['products'].filter(possibleProduct =>
                                                            possibleProduct['id'] === action.payload.chosenProductId
                                                        )
                                                        :
                                                        parsedProduct['products'],
                                                    resolved: index === action.payload.parsedProductIndex ? true : parsedProduct.resolved
                                                }
                                            ))
                                : responseItem['items']
                        }

                    ))
                ]
            };

        default:
            return state;
    }
}
