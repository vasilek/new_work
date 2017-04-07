/**
 * Created by vasil_000 on 06.04.2017.
 */
import React from "react"
import Modal from 'react-modal';
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import "../styles/Modal.css";

const personList = class person extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenUsers: []
        }
    }
    checkboxValueChange(name, id,e) {
        if(this.state.chosenUsers.map(y => y.name).indexOf(name) === -1) {
            this.setState({chosenUsers:this.state.chosenUsers.concat([{name,id}])});
        } else {
            const newArr = this.state.chosenUsers.filter(x => x.name !== name);
            this.setState({chosenUsers: newArr});
        }
    }
    closeModal() {
        this.props.setExecutors(this.state.chosenUsers.map(x => ({value: x.id, label: x.name})));
        this.props.closeModal();
    }
    render(){
        const props = this.props;
        const list = (props.users && props.users.tree) ? props.users.tree.map(x => <div
            style={{display: "flex", flexDirection: "row"}} key={x.id}><input onChange={this.checkboxValueChange.bind(this, x.name, x.id)} checked={this.state.chosenUsers.map(y => y.name).indexOf(x.name) !== -1} type="checkbox" name="a"/>
            <div>{x.name}</div>
        </div>) : <div/>;
        return (
            <Modal
                isOpen={props.isModalOpen}
                contentLabel="Modal"
                style={{overlay: {zIndex: 10}}}
                className="large-modal"
            >
                <Container vertical="true">
                    <h2 flex="2"> Внимание! </h2>

                    <p>Список пользователей</p>
                    <div>{list}</div>

                    <div flex="1">
                        <FlatButton style={{float: "right"}} onClick={this.closeModal.bind(this)} label="ОК"/>
                    </div>
                </Container>
            </Modal>

        )
    }
}

export default personList;