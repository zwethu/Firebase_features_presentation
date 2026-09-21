import { CreateUserData, UpdateUserBioData, UpdateUserBioVariables, DeleteUserData, GetCurrentUserData, ListAllUsersData, CreateProjectData, CreateProjectVariables, UpdateProjectData, UpdateProjectVariables, DeleteProjectData, DeleteProjectVariables, GetProjectData, GetProjectVariables, ListMyProjectsData, CreateTaskData, CreateTaskVariables, UpdateTaskStatusData, UpdateTaskStatusVariables, DeleteTaskData, DeleteTaskVariables, GetTaskData, GetTaskVariables, ListProjectTasksData, ListProjectTasksVariables, AddProjectMemberData, AddProjectMemberVariables, UpdateMemberRoleData, UpdateMemberRoleVariables, RemoveProjectMemberData, RemoveProjectMemberVariables, GetMembersData, GetMembersVariables, ListMyMembershipsData, AddCommentData, AddCommentVariables, DeleteCommentData, DeleteCommentVariables, GetTaskCommentsData, GetTaskCommentsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useUpdateUserBio(options?: useDataConnectMutationOptions<UpdateUserBioData, FirebaseError, UpdateUserBioVariables | void>): UseDataConnectMutationResult<UpdateUserBioData, UpdateUserBioVariables>;
export function useUpdateUserBio(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserBioData, FirebaseError, UpdateUserBioVariables | void>): UseDataConnectMutationResult<UpdateUserBioData, UpdateUserBioVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;

export function useGetCurrentUser(options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
export function useGetCurrentUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;

export function useListAllUsers(options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;
export function useListAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;

export function useCreateProject(options?: useDataConnectMutationOptions<CreateProjectData, FirebaseError, CreateProjectVariables>): UseDataConnectMutationResult<CreateProjectData, CreateProjectVariables>;
export function useCreateProject(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProjectData, FirebaseError, CreateProjectVariables>): UseDataConnectMutationResult<CreateProjectData, CreateProjectVariables>;

export function useUpdateProject(options?: useDataConnectMutationOptions<UpdateProjectData, FirebaseError, UpdateProjectVariables>): UseDataConnectMutationResult<UpdateProjectData, UpdateProjectVariables>;
export function useUpdateProject(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProjectData, FirebaseError, UpdateProjectVariables>): UseDataConnectMutationResult<UpdateProjectData, UpdateProjectVariables>;

export function useDeleteProject(options?: useDataConnectMutationOptions<DeleteProjectData, FirebaseError, DeleteProjectVariables>): UseDataConnectMutationResult<DeleteProjectData, DeleteProjectVariables>;
export function useDeleteProject(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProjectData, FirebaseError, DeleteProjectVariables>): UseDataConnectMutationResult<DeleteProjectData, DeleteProjectVariables>;

export function useGetProject(vars: GetProjectVariables, options?: useDataConnectQueryOptions<GetProjectData>): UseDataConnectQueryResult<GetProjectData, GetProjectVariables>;
export function useGetProject(dc: DataConnect, vars: GetProjectVariables, options?: useDataConnectQueryOptions<GetProjectData>): UseDataConnectQueryResult<GetProjectData, GetProjectVariables>;

export function useListMyProjects(options?: useDataConnectQueryOptions<ListMyProjectsData>): UseDataConnectQueryResult<ListMyProjectsData, undefined>;
export function useListMyProjects(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyProjectsData>): UseDataConnectQueryResult<ListMyProjectsData, undefined>;

export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useUpdateTaskStatus(options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;
export function useUpdateTaskStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;

export function useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
export function useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;

export function useGetTask(vars: GetTaskVariables, options?: useDataConnectQueryOptions<GetTaskData>): UseDataConnectQueryResult<GetTaskData, GetTaskVariables>;
export function useGetTask(dc: DataConnect, vars: GetTaskVariables, options?: useDataConnectQueryOptions<GetTaskData>): UseDataConnectQueryResult<GetTaskData, GetTaskVariables>;

export function useListProjectTasks(vars: ListProjectTasksVariables, options?: useDataConnectQueryOptions<ListProjectTasksData>): UseDataConnectQueryResult<ListProjectTasksData, ListProjectTasksVariables>;
export function useListProjectTasks(dc: DataConnect, vars: ListProjectTasksVariables, options?: useDataConnectQueryOptions<ListProjectTasksData>): UseDataConnectQueryResult<ListProjectTasksData, ListProjectTasksVariables>;

export function useAddProjectMember(options?: useDataConnectMutationOptions<AddProjectMemberData, FirebaseError, AddProjectMemberVariables>): UseDataConnectMutationResult<AddProjectMemberData, AddProjectMemberVariables>;
export function useAddProjectMember(dc: DataConnect, options?: useDataConnectMutationOptions<AddProjectMemberData, FirebaseError, AddProjectMemberVariables>): UseDataConnectMutationResult<AddProjectMemberData, AddProjectMemberVariables>;

export function useUpdateMemberRole(options?: useDataConnectMutationOptions<UpdateMemberRoleData, FirebaseError, UpdateMemberRoleVariables>): UseDataConnectMutationResult<UpdateMemberRoleData, UpdateMemberRoleVariables>;
export function useUpdateMemberRole(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMemberRoleData, FirebaseError, UpdateMemberRoleVariables>): UseDataConnectMutationResult<UpdateMemberRoleData, UpdateMemberRoleVariables>;

export function useRemoveProjectMember(options?: useDataConnectMutationOptions<RemoveProjectMemberData, FirebaseError, RemoveProjectMemberVariables>): UseDataConnectMutationResult<RemoveProjectMemberData, RemoveProjectMemberVariables>;
export function useRemoveProjectMember(dc: DataConnect, options?: useDataConnectMutationOptions<RemoveProjectMemberData, FirebaseError, RemoveProjectMemberVariables>): UseDataConnectMutationResult<RemoveProjectMemberData, RemoveProjectMemberVariables>;

export function useGetMembers(vars: GetMembersVariables, options?: useDataConnectQueryOptions<GetMembersData>): UseDataConnectQueryResult<GetMembersData, GetMembersVariables>;
export function useGetMembers(dc: DataConnect, vars: GetMembersVariables, options?: useDataConnectQueryOptions<GetMembersData>): UseDataConnectQueryResult<GetMembersData, GetMembersVariables>;

export function useListMyMemberships(options?: useDataConnectQueryOptions<ListMyMembershipsData>): UseDataConnectQueryResult<ListMyMembershipsData, undefined>;
export function useListMyMemberships(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyMembershipsData>): UseDataConnectQueryResult<ListMyMembershipsData, undefined>;

export function useAddComment(options?: useDataConnectMutationOptions<AddCommentData, FirebaseError, AddCommentVariables>): UseDataConnectMutationResult<AddCommentData, AddCommentVariables>;
export function useAddComment(dc: DataConnect, options?: useDataConnectMutationOptions<AddCommentData, FirebaseError, AddCommentVariables>): UseDataConnectMutationResult<AddCommentData, AddCommentVariables>;

export function useDeleteComment(options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;
export function useDeleteComment(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;

export function useGetTaskComments(vars: GetTaskCommentsVariables, options?: useDataConnectQueryOptions<GetTaskCommentsData>): UseDataConnectQueryResult<GetTaskCommentsData, GetTaskCommentsVariables>;
export function useGetTaskComments(dc: DataConnect, vars: GetTaskCommentsVariables, options?: useDataConnectQueryOptions<GetTaskCommentsData>): UseDataConnectQueryResult<GetTaskCommentsData, GetTaskCommentsVariables>;
