import React from 'react';
import './style.scss';

export default class ListItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            disabled: true,
            focused: false
        };
    }

    componentDidMount() {
        autosize($(this.$textarea));
    }

    componentDidUpdate() {
        autosize($(this.$textarea));
        autosize.update($(this.$textarea));
        if (this.state.focused && this.$textarea) {
            this.$textarea.focus();
        }
    }

    handleChange() {
        this.props.onTaskUpdate(this.$textarea.value);
    }

    handleTaskEditStart() {
        this.setState({disabled: false, focused: true});
    }

    handleTaskEditStop() {
        this.setState({disabled: true, focused: false});
        this.handleChange();
    }

    render() {
        const isCompletedClass = (this.props.isCompleted ? 'list__task-description_complete' : '');
        const $task =
            <div className="list__list-item">
                <span className="list__complete-button" onClick={this.props.onTaskCompleteToggle}></span>
                <textarea className={`list__task-description ${isCompletedClass}`}
                    value={this.props.description} disabled={this.state.disabled}
                    onChange={this.handleChange.bind(this)}
                    onBlur={this.handleTaskEditStop.bind(this)}
                    ref={(textarea) => {this.$textarea = textarea;}} rows="1"></textarea>
                <span className="list__remove-button" src="./img/remove-icon.png" onClick={this.props.onTaskRemove}></span>
                <span className="list__edit-button" src="./img/edit-icon.png" onClick={this.handleTaskEditStart.bind(this)}></span>
            </div>;

        return this.props.isTaskVisibleByFilter ? $task : null;
    }
}
