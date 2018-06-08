bergApi = {
	baseURL:'http://api.wo.softberg.org?action=',
	userId:'',
	key:'',
	pieChartData:[],
	csfString: '',
	signIn:function(email,password,callback){
		$.ajax({
			url:'http://api.wo.softberg.org?action=user_signIn',
			type:'post',
			dataType:'json',
			data:{
				username:email,
				password:password	
			},
			success:function(data){
				callback(data)
			},
		})
	},
	getRequest:function(method,type,data,callback){
		$.ajax({
			url:this.baseURL+method,
			type:type,
			data:data,
			dataType:'json',
			success:function(data){
				callback(data);
			},
			error:function(data){
				callback(data);
			},
		});
	},
	getUserData:function(callback){
		this.getRequest('user_getUserData','get',{
			userId:bergApi.userid,
			apiKey:bergApi.key
		},function(data){
			callback(data);
		})
	},
	csfGenerator:function(data){
		var csfString = '';
		data.data.forEach(function(val,key){
			csfString += val['date_created']+',';
			csfString += val['description']+',';
			csfString += val['due_date']+',';
			csfString += val['notes_count']+',';
			csfString += val['notification_date']+',';
			csfString += val['priority']+',';
			csfString += val['seen']+',';
			csfString += val['status']+',';
			csfString += val['task_id']+',';
			csfString += val['task_order']+',';
			csfString += val['title']+',';
			csfString += val['user_id']+"\n";
		});
		return csfString
	},
	getUserTasks:function(callback){
		console.log(this.userId);
		this.getRequest('task_getAll','get',{
			userId:bergApi.userId,
			apiKey:bergApi.key
		},function(data){
			bergApi.responsableChartCalc(data);
			charts.pieChart('responsable_modal',bergApi.pieChartData);
			bergApi.csfString = bergApi.csfGenerator(data);
			callback(data);
			App.downloadcsf('tasks.csv',bergApi.csfString);
		})
	},
	deleteTaskById:function(taskId,callback){
		this.getRequest('task_delete','delete',{
			taskId:taskId,
			userId:bergApi.userId,
			apiKey:bergApi.key
		},function(data){
			callback(data.status)
		})
	},
	addNewTask:function(title,description,dueDate,callback){
		this.getRequest('task_create','post',{
			title:title,
			description:description,
			dueDate:dueDate,
			userId:bergApi.userId,
			priority:'mid',
			status:'hold',
			apiKey:this.key,
		},function(data){
			callback(data);
		});
	},
	updateTask:function(taskId,title,description,dueDate,callback){
		this.getRequest('task_update','put',{
			taskId:taskId,
			userId:this.userId,
			priority:'mid',
			status:'hold',
			title:title,
			description:description,
			dueDate:moment(dueDate).unix(),
			apiKey:this.key
		},function(data){
			callback(data.status);
		});
	},
	getSingleTask:function(taskId,callback){
		this.getRequest('task_getSingle','get',{
			userId:this.userId,
			apiKey:this.key,
			taskId:taskId,
		},function(data){callback(data)});
	},
	changeTaskStatus:function(taskid,callback){
		this.getRequest('task_changeStatus','put',{
			apiKey:bergApi.key,

		})
	},
	responsableChartCalc:function(allTasks,TaskKey){
		var statuses = [];
		var tasksByStatuses = {};
		allTasks.data.forEach(function(value,key){
			if(!tasksByStatuses[value.status]) {
				tasksByStatuses[value.status] = 0;
			}
			tasksByStatuses[value.status] ++;

		});
		for(i in tasksByStatuses){
			bergApi.pieChartData.push([i,tasksByStatuses[i]]);
		}
	}
}