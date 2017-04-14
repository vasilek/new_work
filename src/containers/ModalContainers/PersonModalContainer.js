/**
 * Created by vasil_000 on 06.04.2017.
 */
import PersonModal from "../../components/Modals/PersonModal";
import {
    connect
} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        departments: state.Admin.departments,
        users: state.Admin.users,
        isModalOpen: ownProps.isModalOpen,
        closeModal: ownProps.closeModal,
    }
}

const Visible = connect(
    mapStateToProps
)(PersonModal)

export default Visible
