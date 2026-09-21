import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddCommentData {
  comment_insert: Comment_Key;
}

export interface AddCommentVariables {
  taskId: UUIDString;
  content: string;
}

export interface AddProjectMemberData {
  projectMember_insert: ProjectMember_Key;
}

export interface AddProjectMemberVariables {
  projectId: UUIDString;
  userId: UUIDString;
  role: string;
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateProjectData {
  project_insert: Project_Key;
}

export interface CreateProjectVariables {
  title: string;
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  title: string;
  projectId: UUIDString;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface DeleteCommentData {
  comment_delete?: Comment_Key | null;
}

export interface DeleteCommentVariables {
  id: UUIDString;
}

export interface DeleteProjectData {
  project_delete?: Project_Key | null;
}

export interface DeleteProjectVariables {
  id: UUIDString;
}

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetCurrentUserData {
  user?: {
    username: string;
    email: string;
    bio?: string | null;
  };
}

export interface GetMembersData {
  projectMembers: ({
    user: {
      username: string;
    };
    role: string;
  })[];
}

export interface GetMembersVariables {
  projectId: UUIDString;
}

export interface GetProjectData {
  project?: {
    title: string;
    description?: string | null;
  };
}

export interface GetProjectVariables {
  id: UUIDString;
}

export interface GetTaskCommentsData {
  comments: ({
    content: string;
    author: {
      username: string;
    };
  })[];
}

export interface GetTaskCommentsVariables {
  taskId: UUIDString;
}

export interface GetTaskData {
  task?: {
    title: string;
    status: string;
    dueDate?: DateString | null;
  };
}

export interface GetTaskVariables {
  id: UUIDString;
}

export interface ListAllUsersData {
  users: ({
    username: string;
  })[];
}

export interface ListMyMembershipsData {
  projectMembers: ({
    project: {
      title: string;
    };
    role: string;
  })[];
}

export interface ListMyProjectsData {
  projects: ({
    title: string;
    createdAt: TimestampString;
  })[];
}

export interface ListProjectTasksData {
  tasks: ({
    title: string;
    status: string;
  })[];
}

export interface ListProjectTasksVariables {
  projectId: UUIDString;
}

export interface ProjectMember_Key {
  id: UUIDString;
  __typename?: 'ProjectMember_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface RemoveProjectMemberData {
  projectMember_delete?: ProjectMember_Key | null;
}

export interface RemoveProjectMemberVariables {
  id: UUIDString;
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateMemberRoleData {
  projectMember_update?: ProjectMember_Key | null;
}

export interface UpdateMemberRoleVariables {
  id: UUIDString;
  role: string;
}

export interface UpdateProjectData {
  project_update?: Project_Key | null;
}

export interface UpdateProjectVariables {
  id: UUIDString;
  description?: string | null;
}

export interface UpdateTaskStatusData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateUserBioData {
  user_update?: User_Key | null;
}

export interface UpdateUserBioVariables {
  bio?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUserBio' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserBio(dc: DataConnect, vars?: UpdateUserBioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserBioData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserBio' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserBio(vars?: UpdateUserBioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserBioData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUser(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to execute without passing in DataConnect. */
export function getCurrentUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to pass in custom DataConnect instances. */
export function getCurrentUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllUsers' Query. Allow users to execute without passing in DataConnect. */
export function listAllUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listAllUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllUsersData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProject' Mutation. Allow users to execute without passing in DataConnect. */
export function createProject(dc: DataConnect, vars: CreateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProjectData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProject(vars: CreateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProjectData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateProject' Mutation. Allow users to execute without passing in DataConnect. */
export function updateProject(dc: DataConnect, vars: UpdateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProjectData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateProject(vars: UpdateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProjectData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProject' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProject(dc: DataConnect, vars: DeleteProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProjectData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProject(vars: DeleteProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProjectData>>;

/** Generated Node Admin SDK operation action function for the 'GetProject' Query. Allow users to execute without passing in DataConnect. */
export function getProject(dc: DataConnect, vars: GetProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProjectData>>;
/** Generated Node Admin SDK operation action function for the 'GetProject' Query. Allow users to pass in custom DataConnect instances. */
export function getProject(vars: GetProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProjectData>>;

/** Generated Node Admin SDK operation action function for the 'ListMyProjects' Query. Allow users to execute without passing in DataConnect. */
export function listMyProjects(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyProjectsData>>;
/** Generated Node Admin SDK operation action function for the 'ListMyProjects' Query. Allow users to pass in custom DataConnect instances. */
export function listMyProjects(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyProjectsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateTask' Mutation. Allow users to execute without passing in DataConnect. */
export function createTask(dc: DataConnect, vars: CreateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTaskData>>;
/** Generated Node Admin SDK operation action function for the 'CreateTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function createTask(vars: CreateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTaskData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateTaskStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateTaskStatus(dc: DataConnect, vars: UpdateTaskStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTaskStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateTaskStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateTaskStatus(vars: UpdateTaskStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTaskStatusData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteTask' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTaskData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteTask(vars: DeleteTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTaskData>>;

/** Generated Node Admin SDK operation action function for the 'GetTask' Query. Allow users to execute without passing in DataConnect. */
export function getTask(dc: DataConnect, vars: GetTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskData>>;
/** Generated Node Admin SDK operation action function for the 'GetTask' Query. Allow users to pass in custom DataConnect instances. */
export function getTask(vars: GetTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskData>>;

/** Generated Node Admin SDK operation action function for the 'ListProjectTasks' Query. Allow users to execute without passing in DataConnect. */
export function listProjectTasks(dc: DataConnect, vars: ListProjectTasksVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectTasksData>>;
/** Generated Node Admin SDK operation action function for the 'ListProjectTasks' Query. Allow users to pass in custom DataConnect instances. */
export function listProjectTasks(vars: ListProjectTasksVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectTasksData>>;

/** Generated Node Admin SDK operation action function for the 'AddProjectMember' Mutation. Allow users to execute without passing in DataConnect. */
export function addProjectMember(dc: DataConnect, vars: AddProjectMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddProjectMemberData>>;
/** Generated Node Admin SDK operation action function for the 'AddProjectMember' Mutation. Allow users to pass in custom DataConnect instances. */
export function addProjectMember(vars: AddProjectMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddProjectMemberData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateMemberRole' Mutation. Allow users to execute without passing in DataConnect. */
export function updateMemberRole(dc: DataConnect, vars: UpdateMemberRoleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMemberRoleData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateMemberRole' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateMemberRole(vars: UpdateMemberRoleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMemberRoleData>>;

/** Generated Node Admin SDK operation action function for the 'RemoveProjectMember' Mutation. Allow users to execute without passing in DataConnect. */
export function removeProjectMember(dc: DataConnect, vars: RemoveProjectMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RemoveProjectMemberData>>;
/** Generated Node Admin SDK operation action function for the 'RemoveProjectMember' Mutation. Allow users to pass in custom DataConnect instances. */
export function removeProjectMember(vars: RemoveProjectMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RemoveProjectMemberData>>;

/** Generated Node Admin SDK operation action function for the 'GetMembers' Query. Allow users to execute without passing in DataConnect. */
export function getMembers(dc: DataConnect, vars: GetMembersVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMembersData>>;
/** Generated Node Admin SDK operation action function for the 'GetMembers' Query. Allow users to pass in custom DataConnect instances. */
export function getMembers(vars: GetMembersVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMembersData>>;

/** Generated Node Admin SDK operation action function for the 'ListMyMemberships' Query. Allow users to execute without passing in DataConnect. */
export function listMyMemberships(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyMembershipsData>>;
/** Generated Node Admin SDK operation action function for the 'ListMyMemberships' Query. Allow users to pass in custom DataConnect instances. */
export function listMyMemberships(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyMembershipsData>>;

/** Generated Node Admin SDK operation action function for the 'AddComment' Mutation. Allow users to execute without passing in DataConnect. */
export function addComment(dc: DataConnect, vars: AddCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddCommentData>>;
/** Generated Node Admin SDK operation action function for the 'AddComment' Mutation. Allow users to pass in custom DataConnect instances. */
export function addComment(vars: AddCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddCommentData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteComment' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteComment(dc: DataConnect, vars: DeleteCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCommentData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteComment' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteComment(vars: DeleteCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCommentData>>;

/** Generated Node Admin SDK operation action function for the 'GetTaskComments' Query. Allow users to execute without passing in DataConnect. */
export function getTaskComments(dc: DataConnect, vars: GetTaskCommentsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskCommentsData>>;
/** Generated Node Admin SDK operation action function for the 'GetTaskComments' Query. Allow users to pass in custom DataConnect instances. */
export function getTaskComments(vars: GetTaskCommentsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskCommentsData>>;

