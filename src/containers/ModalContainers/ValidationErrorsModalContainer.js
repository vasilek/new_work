import ValidationErrorsModal from "../../components/Modals/ValidationErrorsModal";
import {
    closeErrorsModal
} from "../../redux/actions/layoutActions";
import {
    connect
} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
      errors: state.validationErrors,
      isModalOpen: state.isErrorsModalOpen
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      closeModal: function() {
        dispatch(closeErrorsModal({}))
      }
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(ValidationErrorsModal)

export default Visible
