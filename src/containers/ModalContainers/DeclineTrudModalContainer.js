import DeclineTrudModal from "../../components/Modals/DeclineTrudModal";
import {
    connect
} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
      isModalOpen: ownProps.isModalOpen,
      answer: ownProps.answer,
      message: ownProps.message,
      task: state.taskView,
      laborView: ownProps.labor
    }
}

const Visible = connect(
    mapStateToProps
)(DeclineTrudModal)

export default Visible
