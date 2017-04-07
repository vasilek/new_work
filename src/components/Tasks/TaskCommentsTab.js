import React from "react";
import Container from "../Container";
import "../styles/TaskCommentsTab.css";
import helpers from "./taskHelpers";
import FlatButton from 'material-ui/FlatButton';

const tab = class TaskCommentsTab extends React.Component {
    stopPropagation (e){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    render () {
      const props = this.props;
      const {sendComment} = props;
      let comments = helpers.generateComments(props.comments);
      const prepareComment = () => {
        var self = this;
        sendComment(self.refs.commentField.value);
        self.refs.commentField.value = "";
      }
      if(props.task) {
      return (
          <Container vertical="true">
            <div>
              {comments}
            </div>
            <div  className={" comment-send-area " + (props.task.rights.comment ? "" : "disabled")}>
              <Container className="leaveCommentContainer" vertical={true}>
                  <textarea  flex="3" style={{margin:"5px", minHeight:"70px", minWidth:"98%"}} onChange={this.stopPropagation} ref="commentField" placeholder="Напишите комментарий"/>
                  <FlatButton onClick={prepareComment} label="Отправить" />
              </Container>
            </div>
          </Container>
      )
    } else {
      return <div/>
    }
    }
}

export default tab;