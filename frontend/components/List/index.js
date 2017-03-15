import React from 'react';
import ListItem from '../List/ListItem';
import './style.scss';

export default class List extends React.Component {

    isTaskVisibleByFilter(taskId, selectedFilterId) {
        const task = this.props.tasks[taskId];
        return selectedFilterId === 0 || selectedFilterId === 1 && !task.completed || selectedFilterId === 2 && task.completed;
    }

    componentDidUpdate() {
        this.props.onPushStateToServer();
    }

    render() {
        const $tasks = [];
        const tasks = this.props.tasks;
        for (let taskId = 0; taskId < tasks.length; taskId++) {
            $tasks.push(
                <ListItem taskId={taskId} description={tasks[taskId].description} isCompleted={tasks[taskId].completed}
                    onTaskCompleteToggle={() => this.props.onTaskCompleteToggle(taskId)}
                    onTaskUpdate={(newDescription) => this.props.onTaskUpdate(taskId, newDescription)}
                    onTaskRemove={() => this.props.onTaskRemove(taskId)}
                    isTaskVisibleByFilter={this.isTaskVisibleByFilter(taskId, this.props.selectedFilterId)}
                    key={taskId} />
            );
        }

        return (
            <ul className="list">
                {$tasks}
            </ul>
        );
    }
}
