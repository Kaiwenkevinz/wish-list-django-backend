import  React, { Component } from  'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Material-UI
import NestedGrid from './../NestedGrid';
import Container from '@material-ui/core/Container';

// user defined
import WishItemForm from './WishItemForm';
import { getItems, deleteItems } from '../../actions/items'

import { Upload } from 'antd';
import { Button } from 'antd';
import { Icon} from 'antd';
import 'antd/dist/antd.css'

// const API_URL = 'https://wishlist-backend-server.herokuapp.com';
const API_URL = 'http://127.0.0.1:8000';

var uploadData = {
    'token': null,
    // 'key': 'i am a pic name'
}

axios.get(`${API_URL}/qiniu/token/`)
    .then(res => {
        console.log('should print res')
        console.log(res.data)
        uploadData.token = res.data
    })
    .catch(err => console.log(err))

export class WishItemsList extends Component {

    // static propTypes = {
    //     data: PropTypes.array.isRequired
    // }

    constructor() {
        super();
        this.state = {
            token: null
        }

        this.nextPage = this.nextPage.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.beforeUpload = this.beforeUpload.bind(this)
    }

    componentDidMount() {
        this.props.getItems();
    }

    nextPage() {
        this.props.getItems(this.props.items['next page']);
    }

    previousPage() {
        this.props.getItems(this.props.items['previous page']);
    }

    handleDelete(id) {
        this.props.deleteItems(id);
    }

    handleAvatarChange(info) {
        console.log("handleAvatarChange")

        if (info.file.status === 'done'){
            const img_url = `http://pzvxbm20p.bkt.clouddn.com/${info.file.response.hash}`
            console.log(img_url)
        } else {
            console.log(info.file.response)
        }
    }

    beforeUpload(file) {
        console.log("before unload")
    }

    render() {
        const wantnessOptions = [
            { value: 1, label: '不重要的东西，可以再等等' },
            { value: 2, label: '过几天看看' },
            { value: 3, label: '很想要也很需要' }
        ];

        console.log("render " + uploadData.token)

        const navigationLayout = (
            <div className="nav-buttons">

                <Upload 
                    name="file"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    action="https://upload-z2.qiniup.com"
                    data={uploadData}
                    onChange={this.handleAvatarChange}
                    >
                        <Button>
                            <Icon type="upload" /> Click to Upload
                        </Button>
                </Upload>
                
                <Popup trigger={<button type="button" className="btn btn-outline-info">Add</button>} modal>
                    <WishItemForm options={wantnessOptions}/>
                </Popup>
                <div className="page-buttons">
                    <button type="button" className="btn btn-outline-primary" onClick = {(e) => this.previousPage(e)}>Prev</button>
                    <button type="button" className="btn btn-outline-primary" onClick = {(e) => this.nextPage(e)}>Next</button>
                </div>
            </div>
        );
        
        let items = null;
        let itemsListLayout = null;

        try {
        // for (let i=0; i < 2; i++){
            items = this.props.items.data;
            if (items != null) {
                itemsListLayout = <NestedGrid data={items}/>;
            }
        // }
            // itemsListLayout = items.map(item =>
                // <tr key={item.id+'6'}>
                //     <td key={item.id+item.name+'1'}>{item.name}</td>
                //     <td key={item.id+item.wantness+'2'}>{wantnessOptions.filter(option => option.value == item.wantness)[0].label}</td>
                //     <td key={item.id+item.price+'3'}>{item.price}</td>
                //     <td key={item.id+item.date_created+'4'}>{item.date_created.slice(0,10)}</td>
                //     <td key={item.id+item.result+'5'}>{item.result}</td>
                //     <td key={item.id+"update"}>
                //         <Popup trigger={<button type="button" className="btn btn-outline-primary">Update</button>} modal>
                //             <WishItemForm item={item} options={wantnessOptions}/>
                //         </Popup>
                //     </td>
                //     <td key={item.id+"delete"}><button type="button" className="btn btn-outline-danger" onClick = {() => this.handleDelete(item.id)}>Delete</button></td>
                // </tr>
            // )

        } catch(error) {
            console.log(error)
        }

        return (
            <div>
                <Container className="grid-container" maxWidth="md">
                    {itemsListLayout}
                </Container>    
                {navigationLayout}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    items: state.items.items
});

export default connect(mapStateToProps, { getItems, deleteItems })(WishItemsList);