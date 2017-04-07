import PasswordChangeModal from "../../components/Modals/PasswordChangeModal";
import {
    connect
} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        user: ownProps.user,
        isModalOpen: ownProps.isModalOpen,
        savePassword: ownProps.savePassword,
        closeModal: ownProps.closeModal
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(PasswordChangeModal)

export default Visible


