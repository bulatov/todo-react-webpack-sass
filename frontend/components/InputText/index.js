import React from 'react';
import './style.scss';

export default class InputText extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleKeyPress(event) {
        const ENTER_CHAR_CODE = 13;
        if (event.charCode === ENTER_CHAR_CODE && this.state.value) {
            this.props.onTaskAdd(this.state.value);
            this.setState({
                value: ''
            });
        }
    }

    render() {
        return (
            <input className="input-text" type="text" placeholder="What needs to be done?"
                value={this.state.value} onChange={this.handleChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} />
        );
    }
}
