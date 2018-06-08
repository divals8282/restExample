App = {
	signIn:function(){
		$('document').ready(function(){
			$('#openModal').trigger('click');
			$('#signIn_submit').click(function(){
				var email = $('#signIn_email').val();
				var password = $('#signIn_password').val()
				bergApi.signIn(email,password,function(data){
					if(data.status == 'error'){
						$('#error_log').html(data.message);
					}
					else{
						localStorage.setItem('userid',data.data['user_id']);
						localStorage.setItem('key',data.data['api_key']);
						window.location.href = "http://localhost/restExample";
					}
				});
			});
		});
	},
	checkUser:function(){
		var userId = localStorage.getItem('userid');
		var key = localStorage.getItem('key');
		if(userId != null && key != null){
			bergApi.userId = userId;
			bergApi.key = key;
		}
		else{
		window.location.href = "http://localhost/restExample/login.html";
		}
	},
	downloadcsf:function (filename, text) {
		$('#download_csf').bind('click',function(){
			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
			element.setAttribute('download', filename);

			element.style.display = 'none';
			document.body.appendChild(element);

			element.click();

			document.body.removeChild(element);
		});
	},
	showAllTasks:function(){
		var table = $('#table').DataTable();
		bergApi.getUserTasks(function(tasks){
			tasks.data.forEach(function(value,key){
				table.row.add([
					value['task_id'],
					value['title'],
					value['status'],
					value['description'],
					value['seen'],
					value['due_date'],
					'<td><button class="btn btn-primary edit edit_task" data-toggle="modal" data-target="#EditModal" data-taskId="'+ value['task_id'] +'">Edit</button></td>',
					'<td><button class="btn btn-danger delete" data-taskId="'+ value['task_id'] +'">Delete</button></td>',
				]).draw().node();
			});
		});
	},
	deleteTask:function(){
		$('.table').on('click','.delete',function(){
			var id = $(this).data('taskid');
			if(confirm('you sure?')){
				bergApi.deleteTaskById(id,function(status){
					if(status == 'success'){
						window.location.reload();
					}
				});
			}
		});
	},
	addNewTask:function(){
		$('#add_new_task_submit').bind('click',function(){
			var title = $('#add_new_task_title').val();
			var description = $('#add_new_task_description').val();
			var dueDate = parseInt($('#add_new_task_dueDate').val()) * 60000;
			bergApi.addNewTask(title,description,dueDate,function(data){
				if(data.status == "success"){
					//window.location.href = "";
				}
				else{$("#add_new_task_log").html(data.message);}
			});
		})
	},
	editTask:function(){
		$('#table').on('click','.edit_task',function(target){
			var taskId = target.currentTarget.dataset.taskid;
			bergApi.getSingleTask(taskId,function(task){
				// console.log(task);
				$('#edit_task_title').val(task.data['title']);
				$('#edit_task_description').val(task.data['description']);
				$('#edit_task_dueDate').val(task.data['due_date']);
				$('#edit_task_submit').attr('rel',taskId);
			});
		})
	},
	updateTask:function() {
		$('#edit_task_submit').click(function(){
			var taskId = $('#edit_task_submit').attr('rel');
			var title = $('#edit_task_title').val()
			var descr = $('#edit_task_description').val()
			var dueDate = $('#edit_task_dueDate').val()
			bergApi.updateTask(taskId,title,descr,dueDate);
		});
	},
	userLogout:function() {
		$('#user_logout').bind('click',function(){
			localStorage.removeItem('userid');
			localStorage.removeItem('username');
			//bad moment
			window.location.href = "http://localhost/restExample/";
		});
	},
	init:function(){
		var location = window.location.href;
		if(location.search('login.html') != -1){
		this.signIn();
		}
		else{
		this.checkUser();
		this.showAllTasks();
		this.deleteTask();
		this.addNewTask();
		this.editTask();
		this.updateTask();
		this.userLogout();
		}
	}
}


$('document').ready(function(){
	App.init();
})