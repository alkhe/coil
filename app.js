var Task = Coil.Model({
	title: 'Untitled',
	completed: false
});

var TaskView = Coil.View({
	template: _.template('<span class="taskTitle">Title (Click to Edit): <%= title %></span>|Completed: <%= completed %>|<button class="completeTask">Complete</button>'),
	events: {
		'click/.completeTask': 'completeTask',
		'click/.taskTitle': 'editTaskTitle'
	},
	completeTask: function() {
		this.model.set('completed', true);
	},
	editTaskTitle: function() {
		var self = this,
			taskEdit = $('<input>'),
			taskTitle = this.el.find('.taskTitle').empty().append(taskEdit);
		taskEdit.val(taskTitle.text()).keypress(function(e) {
			if (e.which == 13)
				self.model.set('title', taskEdit.val());
		});
	}
});

var TaskListView = Coil.CollectionView({
	view: TaskView
});

$(document).ready(function() {
	var addtask = $('#addtask'),
		tasklist = $('#tasklist');

	var taskListView = TaskListView({
		el: tasklist
	});

	addtask.click(function() {
		taskListView.add(Task()).render();
	});

});

