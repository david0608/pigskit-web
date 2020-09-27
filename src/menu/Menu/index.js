import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import axios from '../../utils/axios'
import { createAbort } from '../../utils/abort'
import SearchField from '../../components/utils/SearchField'
import Abstract from '../../components/utils/Abstract'
import CheckList from '../../components/utils/CheckList'
import Image from '../../components/utils/Image'
import TextInput from '../../components/utils/TextInput'
import QuantityInput from '../../components/utils/QuantityInput'
import RectButton from '../../components/utils/RectButton'
import Loading from '../../components/utils/Loading'
import Decorate from '../../components/utils/Decorate'
import { cartInfoActions } from '../Cart'
import '../../styles/text.less'
import './index.less'

const Menu = connect(
    (state) => ({
        loading: state.shopProducts.loading,
        error: state.shopProducts.error,
        data: state.shopProducts.data,
    })
)((props) => {
    const {
        loading,
        error,
        data,
    } = props

    const [state, setState] = useState({
        searchProductName: new RegExp(),
    })

    let productElements = null

    if (loading) {
        productElements = <Loading/>
    } else if (error) {
        productElements = null
    } else {
        let products = data.products
        products = Object.entries(products).filter((prod) => state.searchProductName.exec(prod[1].name.toUpperCase()))
        if (products.length === 0) {
            productElements = <Decorate.Blank className='Blank'>No product.</Decorate.Blank>
        } else {
            productElements = products.map((prod, i) => (
                <Product
                    key={i}
                    data={{
                        key: prod[0],
                        ...prod[1]
                    }}
                />
            ))
        }
    }

    return (
        <div className='Menu-root'>
            <SearchField onCommit={(value) => setState({ searchProductName: new RegExp(value.toUpperCase())})}/>
            <Decorate.List className='Products'>{productElements}</Decorate.List>
        </div>
    )
})

const Product = React.memo(
    (props) => {
        const {
            data,
        } = props

        const refAbstract = useRef(null)

        return (
            <Abstract ref={refAbstract}>
                <Outline data={data}/>
                <Detail
                    refAbstract={refAbstract}
                    data={data}
                />
            </Abstract>
        )
    }
)

const Outline = (props) => {
    const {
        data,
    } = props

    return (
        <div className='Product-outline'>
            <div className='Name'>
                {data.name}
            </div>
            <Decorate.Price>
                {data.price}
            </Decorate.Price>
        </div>
    )
}

class DetailComponent extends React.Component {
    constructor(props) {
        super(props)

        this.refCustomizes = {}

        Object.keys(this.customizes).map((k) => {
            this.refCustomizes[k] = React.createRef()
        })

        this.refRemarkInput = React.createRef()
        this.refQuantityInput = React.createRef()

        this.abort = createAbort()

        this.state = {
            busy: false,
            error: false,
        }
    }

    get shopId() {
        return this.props.shopId
    }

    get key() {
        return this.props.data.key
    }

    get name() {
        return this.props.data.name
    }

    get description() {
        return this.props.data.description
    }

    get price() {
        return this.props.data.price
    }

    get hasPicture() {
        return this.props.data.has_picture
    }

    get customizes() {
        return this.props.data.customizes
    }

    commit() {
        if (this.state.busy) return

        let error = false
        let cus_sel = {}
        Object.entries(this.refCustomizes).forEach((cus) => {
            let key = cus[0]
            let refCus = cus[1]
            if (refCus.current.hasSelection) {
                let selected = refCus.current.checkedSelectionKey
                if (selected) {
                    cus_sel[key] = selected
                } else {
                    error = true
                }
            }
        })
        if (error) return

        this.setState({
            busy: true,
            error: false,
        })

        let abortTk = this.abort.signup()

        axios({
            method: 'POST',
            url: '/api/cart/item',
            data: {
                shop_id: this.shopId,
                product_key: this.key,
                remark: this.refRemarkInput.current.value,
                count: this.refQuantityInput.current.value.toString(),
                cus_sel: JSON.stringify(cus_sel)
            },
            cancelToken: abortTk.axiosCancelTk(),
        })
        .then((res) => {
            if (abortTk.isAborted()) return
            this.props.refetchCart()
            this.props.refAbstract.current.blur()
        })
        .catch((err) => {
            console.log('Error', err.response)
            if (abortTk.isAborted()) return
            this.setState({ error: true })
        })
        .finally(() => {
            if (!abortTk.isAborted()) {
                this.abort.signout(abortTk)
                this.setState({ busy: false })
            }
        })
    }

    componentWillUnmount() {
        this.abort.abort()
    }

    render() {
        return (
            <div className='Product-detail'>
                <div className='Title'>
                    <span className='Text_header_2nd'>
                        {this.name}
                    </span>
                    <Decorate.Price>
                        {this.price}
                    </Decorate.Price>
                </div>
                {
                    this.hasPicture &&
                    <Image
                        url={`/fs/shop/product/image?shop_id=${this.shopId}&product_key=${this.key}`}
                        presize
                    />
                }
                <div className={clsx('Description', 'Text_remark')}>
                    {this.description}
                </div>
                <Decorate.DevideList className='Customizes'>
                    {
                        Object.entries(this.customizes).map((cus, i) => {
                            let cusKey = cus[0]
                            let cusData = cus[1]
                            return (
                                <Customize
                                    key={i}
                                    forwardRef={this.refCustomizes[cusKey]}
                                    data={{ key: cusKey, ...cusData }}
                                />
                            )
                        })
                    }
                </Decorate.DevideList>
                <TextInput
                    ref={this.refRemarkInput}
                    label='Remark'
                    multiline
                />
                <div className='Quantity'>
                    <div className={clsx('Label', 'Text_bold')}>
                        Quantity :
                    </div>
                    <QuantityInput
                        ref={this.refQuantityInput}
                        defaultValue={1}
                        minValue={1}
                    />
                </div>
                <RectButton onClick={this.commit.bind(this)} loading={this.state.busy}>add to cart</RectButton>
                {this.state.error && <div className={clsx('Error', 'Text_error')}>Encountered an error. Please try again.</div>}
            </div>
        )
    }
}

const Detail = connect(
    (state) => ({
        shopId: state.shopInfo.data.id,
    }),
    (dispatch) => ({
        refetchCart: () => dispatch(cartInfoActions.refetchAction()),
    })
)(DetailComponent)

class Customize extends React.PureComponent {
    constructor(props) {
        super(props)

        let defaultSelectionKey = null
        let selections = Object.keys(this.selections)
        if (selections.length === 1) {
            defaultSelectionKey = selections[0]
        }

        this.state = {
            checkedSelectionKey: defaultSelectionKey,
            error: false,
        }
    }

    get name() {
        return this.props.data.name
    }

    get description() {
        return this.props.data.description
    }

    get selections() {
        return this.props.data.selections
    }

    get hasSelection() {
        return Object.keys(this.selections).length > 0
    }

    get checkedSelectionKey() {
        if (!this.hasSelection) {
            return null
        }

        if (this.state.checkedSelectionKey) {
            this.setState({ error: false })
            return this.state.checkedSelectionKey
        } else {
            this.setState({  error: true })
            return null
        }
    }

    componentDidMount() {
        if (this.props.forwardRef) {
            this.props.forwardRef.current = this
        }
    }

    onSelectionCheck(selectionKey) {
        this.setState({
            checkedSelectionKey: selectionKey
        })
    }

    isSelectionChecked(selectionKey) {
        return this.state.checkedSelectionKey === selectionKey
    }

    render() {
        const {
            error,
        } = this.state

        return (
            <div className='Customize-root'>
                <span className='Text_header_3rd'>
                    {this.name}
                </span>
                <div className={clsx('Description', 'Text_remark')}>
                    {this.description}
                </div>
                {
                    this.hasSelection ?
                    <Decorate.List className='Selections'>
                        <CheckList
                            listItems={this.selections}
                            isItemChecked={this.isSelectionChecked.bind(this)}
                            onItemCheck={this.onSelectionCheck.bind(this)}
                            ItemComponent={Selection}
                        />
                    </Decorate.List> :
                    null
                }
                {error ? <div className={clsx('Error', 'Text_error')}>Please choose a selection.</div> : null}
            </div>
        )
    }
}

const Selection = (props) => {
    const {
        itemKey,
        itemData,
    } = props

    const {
        name,
        price,
    } = itemData

    return (
        <div className='Selection-root'>
            <div className='Name'>
                {name}
            </div>
            <Decorate.Price>
                {price}
            </Decorate.Price>
        </div>
    )
}

export default Menu