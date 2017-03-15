import React from 'react';
import './style.scss';

export default class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.filters = ['View All', 'Active', 'Completed'];
    }

    handleClick(filterId) {
        this.props.onFilterChange(filterId);
    }

    render() {
        const $filters = [];
        for (let i = 0; i < this.filters.length; i++) {
            const isSelectedClass = (i === this.props.selectedFilterId ? 'filter__button_selected' : '');
            $filters.push(
                <span className={`filter__button ${isSelectedClass}`}
                    onClick={this.handleClick.bind(this, i)} key={i}>{this.filters[i]}</span>
            );
        }

        return (
            <div className="filter">
                {$filters}
            </div>
        );
    }
}
