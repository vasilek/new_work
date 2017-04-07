import ConfirmModal from "../../components/Modals/ConfirmModal";
import {
    connect
} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
      isModalOpen: ownProps.isModalOpen,
      answer: ownProps.answer,
      message: ownProps.message
    }
}

const Visible = connect(
    mapStateToProps
)(ConfirmModal)

export default Visible
