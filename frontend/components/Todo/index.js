import React from 'react';
import InputText from '../InputText';
import Filter from '../Filter';
import List from '../List';
import './style.scss';

export default class Todo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            selectedFilterId: 0
        };

        this.serverURL = 'https://api.myjson.com/bins/';
        this.jsonURL = null;
    }

    pushStateToServer() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        fetch(this.jsonURL, {
            method: 'PUT',
            body: JSON.stringify({tasks: this.state.tasks}),
            headers: headers
        });
    }

    updateStateFromServer(token) {
        this.jsonURL = this.serverURL + token;
        console.log(this.jsonURL);
        fetch(this.jsonURL, {method: 'GET'})
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                this.setState(data);
            }.bind(this));
    }

    createAndUpdateStateFromServer() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        fetch(this.serverURL, {
            method: 'POST',
            body: '{"tasks":[]}',
            headers: headers
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const uri = data.uri;
                const newToken = uri.slice(uri.lastIndexOf('/') + 1);
                localStorage.todo = JSON.stringify({
                    token: newToken
                });
                return newToken;
            })
            .then(function(newToken) {
                this.updateStateFromServer(newToken);
            }.bind(this));
    }

    componentDidMount() {
        if (!localStorage.todo) {
            localStorage.todo = '{}';
        }

        const token = JSON.parse(localStorage.todo).token;
        if (!token) {
            this.createAndUpdateStateFromServer();
        } else {
            this.updateStateFromServer(token);
        }
    }

    handleTaskAdd(newTaskDescription) {
        const tasks = this.state.tasks.slice();
        tasks.push({
            description: newTaskDescription,
            completed: false
        });
        this.setState({
            tasks: tasks
        });
    }

    handleTaskCompleteToggle(taskId) {
        const tasks = this.state.tasks.slice();
        tasks[taskId].completed = !tasks[taskId].completed;
        this.setState({
            tasks: tasks
        });
    }

    handleTaskUpdate(taskId, newDescription) {
        const tasks = this.state.tasks.slice();
        tasks[taskId].description = newDescription;
        this.setState({
            tasks: tasks
        });
    }

    handleTaskRemove(taskId) {
        const tasks = this.state.tasks.slice();
        tasks.splice(taskId, 1);
        this.setState({
            tasks: tasks
        });
    }

    handleFilterChange(filterId) {
        this.setState({
            selectedFilterId: filterId
        });
    }

    render() {
        return (
            <div className="todo">
                <InputText onTaskAdd={this.handleTaskAdd.bind(this)} />
                <Filter selectedFilterId={this.state.selectedFilterId} onFilterChange={this.handleFilterChange.bind(this)} />
                <List tasks={this.state.tasks}
                    onPushStateToServer={this.pushStateToServer.bind(this)}
                    onTaskCompleteToggle={this.handleTaskCompleteToggle.bind(this)}
                    onTaskUpdate={this.handleTaskUpdate.bind(this)}
                    onTaskRemove={this.handleTaskRemove.bind(this)}
                    selectedFilterId={this.state.selectedFilterId} />
            </div>
        );
    }
}
