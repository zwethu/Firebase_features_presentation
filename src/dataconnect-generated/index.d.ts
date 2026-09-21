import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

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

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface UpdateUserBioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
  operationName: string;
}
export const updateUserBioRef: UpdateUserBioRef;

export function updateUserBio(vars?: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;
export function updateUserBio(dc: DataConnect, vars?: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface ListAllUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
  operationName: string;
}
export const listAllUsersRef: ListAllUsersRef;

export function listAllUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;
export function listAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface CreateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  operationName: string;
}
export const createProjectRef: CreateProjectRef;

export function createProject(vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;
export function createProject(dc: DataConnect, vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface UpdateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
  operationName: string;
}
export const updateProjectRef: UpdateProjectRef;

export function updateProject(vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;
export function updateProject(dc: DataConnect, vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;

interface DeleteProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
  operationName: string;
}
export const deleteProjectRef: DeleteProjectRef;

export function deleteProject(vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;
export function deleteProject(dc: DataConnect, vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;

interface GetProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
  operationName: string;
}
export const getProjectRef: GetProjectRef;

export function getProject(vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;
export function getProject(dc: DataConnect, vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;

interface ListMyProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyProjectsData, undefined>;
  operationName: string;
}
export const listMyProjectsRef: ListMyProjectsRef;

export function listMyProjects(options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, undefined>;
export function listMyProjects(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, undefined>;

interface CreateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  operationName: string;
}
export const createTaskRef: CreateTaskRef;

export function createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;
export function createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface UpdateTaskStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
  operationName: string;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;

export function updateTaskStatus(vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;
export function updateTaskStatus(dc: DataConnect, vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

interface DeleteTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  operationName: string;
}
export const deleteTaskRef: DeleteTaskRef;

export function deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface GetTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTaskVariables): QueryRef<GetTaskData, GetTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTaskVariables): QueryRef<GetTaskData, GetTaskVariables>;
  operationName: string;
}
export const getTaskRef: GetTaskRef;

export function getTask(vars: GetTaskVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskData, GetTaskVariables>;
export function getTask(dc: DataConnect, vars: GetTaskVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskData, GetTaskVariables>;

interface ListProjectTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProjectTasksVariables): QueryRef<ListProjectTasksData, ListProjectTasksVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProjectTasksVariables): QueryRef<ListProjectTasksData, ListProjectTasksVariables>;
  operationName: string;
}
export const listProjectTasksRef: ListProjectTasksRef;

export function listProjectTasks(vars: ListProjectTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListProjectTasksData, ListProjectTasksVariables>;
export function listProjectTasks(dc: DataConnect, vars: ListProjectTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListProjectTasksData, ListProjectTasksVariables>;

interface AddProjectMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddProjectMemberVariables): MutationRef<AddProjectMemberData, AddProjectMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddProjectMemberVariables): MutationRef<AddProjectMemberData, AddProjectMemberVariables>;
  operationName: string;
}
export const addProjectMemberRef: AddProjectMemberRef;

export function addProjectMember(vars: AddProjectMemberVariables): MutationPromise<AddProjectMemberData, AddProjectMemberVariables>;
export function addProjectMember(dc: DataConnect, vars: AddProjectMemberVariables): MutationPromise<AddProjectMemberData, AddProjectMemberVariables>;

interface UpdateMemberRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMemberRoleVariables): MutationRef<UpdateMemberRoleData, UpdateMemberRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMemberRoleVariables): MutationRef<UpdateMemberRoleData, UpdateMemberRoleVariables>;
  operationName: string;
}
export const updateMemberRoleRef: UpdateMemberRoleRef;

export function updateMemberRole(vars: UpdateMemberRoleVariables): MutationPromise<UpdateMemberRoleData, UpdateMemberRoleVariables>;
export function updateMemberRole(dc: DataConnect, vars: UpdateMemberRoleVariables): MutationPromise<UpdateMemberRoleData, UpdateMemberRoleVariables>;

interface RemoveProjectMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveProjectMemberVariables): MutationRef<RemoveProjectMemberData, RemoveProjectMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveProjectMemberVariables): MutationRef<RemoveProjectMemberData, RemoveProjectMemberVariables>;
  operationName: string;
}
export const removeProjectMemberRef: RemoveProjectMemberRef;

export function removeProjectMember(vars: RemoveProjectMemberVariables): MutationPromise<RemoveProjectMemberData, RemoveProjectMemberVariables>;
export function removeProjectMember(dc: DataConnect, vars: RemoveProjectMemberVariables): MutationPromise<RemoveProjectMemberData, RemoveProjectMemberVariables>;

interface GetMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMembersVariables): QueryRef<GetMembersData, GetMembersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMembersVariables): QueryRef<GetMembersData, GetMembersVariables>;
  operationName: string;
}
export const getMembersRef: GetMembersRef;

export function getMembers(vars: GetMembersVariables, options?: ExecuteQueryOptions): QueryPromise<GetMembersData, GetMembersVariables>;
export function getMembers(dc: DataConnect, vars: GetMembersVariables, options?: ExecuteQueryOptions): QueryPromise<GetMembersData, GetMembersVariables>;

interface ListMyMembershipsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyMembershipsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyMembershipsData, undefined>;
  operationName: string;
}
export const listMyMembershipsRef: ListMyMembershipsRef;

export function listMyMemberships(options?: ExecuteQueryOptions): QueryPromise<ListMyMembershipsData, undefined>;
export function listMyMemberships(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyMembershipsData, undefined>;

interface AddCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentVariables): MutationRef<AddCommentData, AddCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddCommentVariables): MutationRef<AddCommentData, AddCommentVariables>;
  operationName: string;
}
export const addCommentRef: AddCommentRef;

export function addComment(vars: AddCommentVariables): MutationPromise<AddCommentData, AddCommentVariables>;
export function addComment(dc: DataConnect, vars: AddCommentVariables): MutationPromise<AddCommentData, AddCommentVariables>;

interface DeleteCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
  operationName: string;
}
export const deleteCommentRef: DeleteCommentRef;

export function deleteComment(vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;
export function deleteComment(dc: DataConnect, vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;

interface GetTaskCommentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTaskCommentsVariables): QueryRef<GetTaskCommentsData, GetTaskCommentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTaskCommentsVariables): QueryRef<GetTaskCommentsData, GetTaskCommentsVariables>;
  operationName: string;
}
export const getTaskCommentsRef: GetTaskCommentsRef;

export function getTaskComments(vars: GetTaskCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskCommentsData, GetTaskCommentsVariables>;
export function getTaskComments(dc: DataConnect, vars: GetTaskCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskCommentsData, GetTaskCommentsVariables>;

