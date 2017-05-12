/**
 * Created by vasil_000 on 06.04.2017.
 */
import React from "react"
import Modal from 'react-modal';
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import "../styles/Modal.css";
import next from "../../Icons/next.svg";
let tasksDict = {};

let tasksIdDict = {};




const personList = class person extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenUsers: [],
            chosenDeps: []
        }
        const userTree1 = this.props.users.tree;
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.initialValue !== this.props.initialValue) {
            this.setState({ chosenUsers: nextProps.initialValue })
        }
    }

    getAllIds(tree) {
        let ids = [];
        tree.forEach(x => {
            const id = x.id;
            const name = x.name;
            const children = x.children;
            if(children && children.length > 0) {
                ids = ids.concat(this.getAllIds(children));
            }
            ids.push({name, id, children});

        });
        return ids;
    }

    clearAllIds(tree) {
        let ids = [];
        tree.forEach(x => {
            const name = x.name;
            const children = x.children;
            // console.log(name);

            if(children && children.length > 0) {
                ids = ids.concat(this.clearAllIds(children));
            }
            ids = ids.filter(y => y.name == name);
        });
        return ids;
    }

    checkboxValueChangeDep(name, id, children, users, e) {
        console.log("ВЫБРАННЫЕ", this.state.chosenDeps);
        var newArr = [];
        var newArr1 = [];

        if (this.state.chosenDeps.map(y => y.name).indexOf(name) === -1) {
            newArr = newArr.concat([{name, id, children}]);
            newArr = newArr.concat(this.getAllIds(children));
            newArr.forEach(x => {
                        for (var y in users) {
                            if (users[y].department == x.name){
                                newArr1.push(users[y]);
                            }
                            else {
                            }
                        }
                    }
                );

            this.setState({chosenDeps: this.state.chosenDeps.concat(newArr)});
            this.setState({chosenUsers: this.state.chosenUsers.concat(newArr1.map(x => ({id: x.id, name: x.name})))});



        } else {
            // console.log(name)
            var newArr = this.state.chosenDeps.filter(x => x.name !== name);

            // var newArr = children;
            // var ch = children.map(x=> x.name);
            // var newArr2 = []
            // for (var i in ch) {
            //     newArr2[i] = newArr.filter(x => x.name == ch[x])
            // }
            // console.log(newArr2);
            // ch.forEach(x=>
            //
            // )
            // console.log(ch)
            // newArr.filter()
            this.setState({chosenDeps: this.clearAllIds(newArr)});
            // newArr = this.clearAllIds(newArr);
            // console.log(newArr)
            newArr.forEach(x => {
                    for (var y in users) {
                        if (users[y].department == x.name){
                            newArr1.push(users[y]);
                        }
                        // else {
                        // }
                    }
                }
            );


            this.setState({chosenDeps: this.clearAllIds(newArr)});
            this.setState({chosenUsers: newArr1.map(x => ({id: x.id, name: x.name}))});


        }
    }



    checkboxValueChangeUser(name, id, e) {
        // this.state.chosenUsers.concat(this.props.initialValue);
        if(this.state.chosenUsers.map(y => y.name).indexOf(name) === -1) {
            this.setState({chosenUsers:this.state.chosenUsers.concat([{name,id}])});
        } else {
            const newArr = this.state.chosenUsers.filter(x => x.name !== name);

            this.setState({chosenUsers: newArr});

        }
    }
    closeModal() {
        if (this.props.setExecutors) {
            this.props.setExecutors(this.state.chosenUsers.map(x => ({value: x.id, label: x.name})));
        }
        this.props.closeModal();
    }

    initialAdd() {
        this.setState({chosenUsers: this.props.initialValue});
    }

    render(){


        const props = this.props;
        var ZZ = [];
        var allUsers = [];


        var glist =<div/>;
        if (props.departments.treeNormalized &&  props.peopleTree.treeNormalized){
            tasksDict = this.props.departments.treeNormalized.byGlobalId;
            // const userTree = props.users.tree;
            const userTree = props.peopleTree.treeNormalized.byGlobalId;
            const depTree = props.departments.treeNormalized.byGlobalId;

            // console.log("userTree", userTree);
            // console.log("depTree", depTree);
            // var depNames = depTree.map(x => x.name);
            // console.log(depNames);
            // depTree.forEach(x =>
            // allUsers.push(x.department));
            // console.log(allUsers);

            for (var k in userTree){
                allUsers.push(userTree[k].department)
            }

            // console.log([...new Set(allUsers)]);


            for (var k in depTree){
                var userAdder = [];
                var dep = depTree[k];
                const id = dep.id;
                const name = dep.name;
                const level = dep.level;
                const children = dep.children;
                const parent_id = dep.parent_id;
                const users = [];
                // if ([...new Set(allUsers)].indexOf(name) >= 0) {
                    ZZ.push({id: id, name: name, level: level, children: children, parent_id: parent_id, users: []});
                // }
            }
            // console.log(ZZ)


            if (ZZ.length !== 0){
                ZZ.forEach(x => {
                        for (var y in userTree) {
                            if (userTree[y].department == x.name){
                                x.users.push({id:userTree[y].id, name:userTree[y].name, department:userTree[y].department});
                            }
                            else {
                            }
                        }
                    }

                );
                // console.log(ZZ.map(x => x.users));
                glist = ZZ.reverse().map(x =>
                    <div style={{marginLeft:x.level*30}}>
                        <div
                            style={{display: "flex", flexDirection: "row"}} key={x.id} >

                            {/*<input onChange={this.checkboxValueChangeDep.bind(this, x.name, x.id, x.children, userTree)} checked={this.state.chosenDeps.map(y => y.name).indexOf(x.name) !== -1} type="checkbox" name="a"/>*/}
                            <div>{x.name}</div>
                        </div>


                        <div style={{marginLeft:30}} >
                            {x.users.map(y =>
                                <div>
                                    <input onChange={this.checkboxValueChangeUser.bind(this, y.name, y.id)} checked={this.state.chosenUsers.map(z => z.name).indexOf(y.name) !== -1} type="checkbox" name="a"/>
                                    {y.name}</div>)}
                        </div>


                    </div>
                );
            }
        }



        const list = (props.users.tree) ? props.users.tree.map(x =>
            <div>{x.department_name}
            <div
            style={{display: "flex", flexDirection: "row"}} key={x.id}><input onChange={this.checkboxValueChangeUser.bind(this, x.name, x.id)} checked={this.state.chosenUsers.map(y => y.name).indexOf(x.name) !== -1} type="checkbox" name="a"/>
            <div>{x.name}</div>
        </div>
        </div>
            ) : <div/>;
        return (
            <Modal
                isOpen={props.isModalOpen}
                contentLabel="Modal"
                // style={{overlay: {zIndex: 10}}}
                className="medium-modal"
            >

                <Container vertical="true">
                    <h3>Список пользователей</h3>

                    <div>{glist}</div>
                    <div flex="1">
                        <FlatButton style={{float: "right"}} onClick={this.closeModal.bind(this)} label="ОК"/>
                    </div>


                </Container>
            </Modal>

        )
    }
}

export default personList;