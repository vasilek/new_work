import AddTrudModal from "../../components/Modals/AddTrudModal";
import {
    connect
} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        trudTask: state.currentAddingTrudTask,
        isTrudModalOpen: ownProps.isTrudModalOpen,
        closeModal: ownProps.closeModal,
        handleTrudSubmit: ownProps.handleTrudSubmit,
        codes: state.codes
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddTrudModal)

export default Visible


