import GlobalHeader from "../../components/GlobalHeader";
import {
    connect
} from 'react-redux';


const mapStateToProps = (state, ownProps) => {
    return {
        currentTitle: state.currentTitle,
        style: ownProps.style,
        tabs: state.tabs,
        currentTaskFilters: state.currentTaskFilters,
        defaultFilters: state.defaultFilters,
        query: state.query
    }
}


const Visible = connect(
    mapStateToProps
)(GlobalHeader)

export default Visible
