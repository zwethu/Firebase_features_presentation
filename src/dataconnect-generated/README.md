# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*ListAllUsers*](#listallusers)
  - [*GetProject*](#getproject)
  - [*ListMyProjects*](#listmyprojects)
  - [*GetTask*](#gettask)
  - [*ListProjectTasks*](#listprojecttasks)
  - [*GetMembers*](#getmembers)
  - [*ListMyMemberships*](#listmymemberships)
  - [*GetTaskComments*](#gettaskcomments)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUserBio*](#updateuserbio)
  - [*DeleteUser*](#deleteuser)
  - [*CreateProject*](#createproject)
  - [*UpdateProject*](#updateproject)
  - [*DeleteProject*](#deleteproject)
  - [*CreateTask*](#createtask)
  - [*UpdateTaskStatus*](#updatetaskstatus)
  - [*DeleteTask*](#deletetask)
  - [*AddProjectMember*](#addprojectmember)
  - [*UpdateMemberRole*](#updatememberrole)
  - [*RemoveProjectMember*](#removeprojectmember)
  - [*AddComment*](#addcomment)
  - [*DeleteComment*](#deletecomment)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserRef:
```typescript
const name = getCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCurrentUserData {
  user?: {
    username: string;
    email: string;
    bio?: string | null;
  };
}
```
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@dataconnect/generated';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@dataconnect/generated';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListAllUsers
You can execute the `ListAllUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllUsersRef:
```typescript
const name = listAllUsersRef.operationName;
console.log(name);
```

### Variables
The `ListAllUsers` query has no variables.
### Return Type
Recall that executing the `ListAllUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllUsersData {
  users: ({
    username: string;
  })[];
}
```
### Using `ListAllUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllUsers } from '@dataconnect/generated';


// Call the `listAllUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listAllUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListAllUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllUsersRef } from '@dataconnect/generated';


// Call the `listAllUsersRef()` function to get a reference to the query.
const ref = listAllUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetProject
You can execute the `GetProject` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getProject(vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;

interface GetProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
}
export const getProjectRef: GetProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProject(dc: DataConnect, vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;

interface GetProjectRef {
  ...
  (dc: DataConnect, vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
}
export const getProjectRef: GetProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProjectRef:
```typescript
const name = getProjectRef.operationName;
console.log(name);
```

### Variables
The `GetProject` query requires an argument of type `GetProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProjectVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetProject` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProjectData {
  project?: {
    title: string;
    description?: string | null;
  };
}
```
### Using `GetProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProject, GetProjectVariables } from '@dataconnect/generated';

// The `GetProject` query requires an argument of type `GetProjectVariables`:
const getProjectVars: GetProjectVariables = {
  id: ..., 
};

// Call the `getProject()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProject(getProjectVars);
// Variables can be defined inline as well.
const { data } = await getProject({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProject(dataConnect, getProjectVars);

console.log(data.project);

// Or, you can use the `Promise` API.
getProject(getProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project);
});
```

### Using `GetProject`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProjectRef, GetProjectVariables } from '@dataconnect/generated';

// The `GetProject` query requires an argument of type `GetProjectVariables`:
const getProjectVars: GetProjectVariables = {
  id: ..., 
};

// Call the `getProjectRef()` function to get a reference to the query.
const ref = getProjectRef(getProjectVars);
// Variables can be defined inline as well.
const ref = getProjectRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProjectRef(dataConnect, getProjectVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.project);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.project);
});
```

## ListMyProjects
You can execute the `ListMyProjects` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyProjects(options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, undefined>;

interface ListMyProjectsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyProjectsData, undefined>;
}
export const listMyProjectsRef: ListMyProjectsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyProjects(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, undefined>;

interface ListMyProjectsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyProjectsData, undefined>;
}
export const listMyProjectsRef: ListMyProjectsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyProjectsRef:
```typescript
const name = listMyProjectsRef.operationName;
console.log(name);
```

### Variables
The `ListMyProjects` query has no variables.
### Return Type
Recall that executing the `ListMyProjects` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyProjectsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyProjectsData {
  projects: ({
    title: string;
    createdAt: TimestampString;
  })[];
}
```
### Using `ListMyProjects`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyProjects } from '@dataconnect/generated';


// Call the `listMyProjects()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyProjects();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyProjects(dataConnect);

console.log(data.projects);

// Or, you can use the `Promise` API.
listMyProjects().then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

### Using `ListMyProjects`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyProjectsRef } from '@dataconnect/generated';


// Call the `listMyProjectsRef()` function to get a reference to the query.
const ref = listMyProjectsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyProjectsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.projects);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

## GetTask
You can execute the `GetTask` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTask(vars: GetTaskVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskData, GetTaskVariables>;

interface GetTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTaskVariables): QueryRef<GetTaskData, GetTaskVariables>;
}
export const getTaskRef: GetTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTask(dc: DataConnect, vars: GetTaskVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskData, GetTaskVariables>;

interface GetTaskRef {
  ...
  (dc: DataConnect, vars: GetTaskVariables): QueryRef<GetTaskData, GetTaskVariables>;
}
export const getTaskRef: GetTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTaskRef:
```typescript
const name = getTaskRef.operationName;
console.log(name);
```

### Variables
The `GetTask` query requires an argument of type `GetTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTaskVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetTask` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTaskData {
  task?: {
    title: string;
    status: string;
    dueDate?: DateString | null;
  };
}
```
### Using `GetTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTask, GetTaskVariables } from '@dataconnect/generated';

// The `GetTask` query requires an argument of type `GetTaskVariables`:
const getTaskVars: GetTaskVariables = {
  id: ..., 
};

// Call the `getTask()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTask(getTaskVars);
// Variables can be defined inline as well.
const { data } = await getTask({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTask(dataConnect, getTaskVars);

console.log(data.task);

// Or, you can use the `Promise` API.
getTask(getTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

### Using `GetTask`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTaskRef, GetTaskVariables } from '@dataconnect/generated';

// The `GetTask` query requires an argument of type `GetTaskVariables`:
const getTaskVars: GetTaskVariables = {
  id: ..., 
};

// Call the `getTaskRef()` function to get a reference to the query.
const ref = getTaskRef(getTaskVars);
// Variables can be defined inline as well.
const ref = getTaskRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTaskRef(dataConnect, getTaskVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.task);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

## ListProjectTasks
You can execute the `ListProjectTasks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProjectTasks(vars: ListProjectTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListProjectTasksData, ListProjectTasksVariables>;

interface ListProjectTasksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProjectTasksVariables): QueryRef<ListProjectTasksData, ListProjectTasksVariables>;
}
export const listProjectTasksRef: ListProjectTasksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProjectTasks(dc: DataConnect, vars: ListProjectTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListProjectTasksData, ListProjectTasksVariables>;

interface ListProjectTasksRef {
  ...
  (dc: DataConnect, vars: ListProjectTasksVariables): QueryRef<ListProjectTasksData, ListProjectTasksVariables>;
}
export const listProjectTasksRef: ListProjectTasksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProjectTasksRef:
```typescript
const name = listProjectTasksRef.operationName;
console.log(name);
```

### Variables
The `ListProjectTasks` query requires an argument of type `ListProjectTasksVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListProjectTasksVariables {
  projectId: UUIDString;
}
```
### Return Type
Recall that executing the `ListProjectTasks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProjectTasksData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProjectTasksData {
  tasks: ({
    title: string;
    status: string;
  })[];
}
```
### Using `ListProjectTasks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProjectTasks, ListProjectTasksVariables } from '@dataconnect/generated';

// The `ListProjectTasks` query requires an argument of type `ListProjectTasksVariables`:
const listProjectTasksVars: ListProjectTasksVariables = {
  projectId: ..., 
};

// Call the `listProjectTasks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProjectTasks(listProjectTasksVars);
// Variables can be defined inline as well.
const { data } = await listProjectTasks({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProjectTasks(dataConnect, listProjectTasksVars);

console.log(data.tasks);

// Or, you can use the `Promise` API.
listProjectTasks(listProjectTasksVars).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

### Using `ListProjectTasks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProjectTasksRef, ListProjectTasksVariables } from '@dataconnect/generated';

// The `ListProjectTasks` query requires an argument of type `ListProjectTasksVariables`:
const listProjectTasksVars: ListProjectTasksVariables = {
  projectId: ..., 
};

// Call the `listProjectTasksRef()` function to get a reference to the query.
const ref = listProjectTasksRef(listProjectTasksVars);
// Variables can be defined inline as well.
const ref = listProjectTasksRef({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProjectTasksRef(dataConnect, listProjectTasksVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tasks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

## GetMembers
You can execute the `GetMembers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMembers(vars: GetMembersVariables, options?: ExecuteQueryOptions): QueryPromise<GetMembersData, GetMembersVariables>;

interface GetMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMembersVariables): QueryRef<GetMembersData, GetMembersVariables>;
}
export const getMembersRef: GetMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMembers(dc: DataConnect, vars: GetMembersVariables, options?: ExecuteQueryOptions): QueryPromise<GetMembersData, GetMembersVariables>;

interface GetMembersRef {
  ...
  (dc: DataConnect, vars: GetMembersVariables): QueryRef<GetMembersData, GetMembersVariables>;
}
export const getMembersRef: GetMembersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMembersRef:
```typescript
const name = getMembersRef.operationName;
console.log(name);
```

### Variables
The `GetMembers` query requires an argument of type `GetMembersVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMembersVariables {
  projectId: UUIDString;
}
```
### Return Type
Recall that executing the `GetMembers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMembersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMembersData {
  projectMembers: ({
    user: {
      username: string;
    };
    role: string;
  })[];
}
```
### Using `GetMembers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMembers, GetMembersVariables } from '@dataconnect/generated';

// The `GetMembers` query requires an argument of type `GetMembersVariables`:
const getMembersVars: GetMembersVariables = {
  projectId: ..., 
};

// Call the `getMembers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMembers(getMembersVars);
// Variables can be defined inline as well.
const { data } = await getMembers({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMembers(dataConnect, getMembersVars);

console.log(data.projectMembers);

// Or, you can use the `Promise` API.
getMembers(getMembersVars).then((response) => {
  const data = response.data;
  console.log(data.projectMembers);
});
```

### Using `GetMembers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMembersRef, GetMembersVariables } from '@dataconnect/generated';

// The `GetMembers` query requires an argument of type `GetMembersVariables`:
const getMembersVars: GetMembersVariables = {
  projectId: ..., 
};

// Call the `getMembersRef()` function to get a reference to the query.
const ref = getMembersRef(getMembersVars);
// Variables can be defined inline as well.
const ref = getMembersRef({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMembersRef(dataConnect, getMembersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.projectMembers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.projectMembers);
});
```

## ListMyMemberships
You can execute the `ListMyMemberships` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyMemberships(options?: ExecuteQueryOptions): QueryPromise<ListMyMembershipsData, undefined>;

interface ListMyMembershipsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyMembershipsData, undefined>;
}
export const listMyMembershipsRef: ListMyMembershipsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyMemberships(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyMembershipsData, undefined>;

interface ListMyMembershipsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyMembershipsData, undefined>;
}
export const listMyMembershipsRef: ListMyMembershipsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyMembershipsRef:
```typescript
const name = listMyMembershipsRef.operationName;
console.log(name);
```

### Variables
The `ListMyMemberships` query has no variables.
### Return Type
Recall that executing the `ListMyMemberships` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyMembershipsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyMembershipsData {
  projectMembers: ({
    project: {
      title: string;
    };
    role: string;
  })[];
}
```
### Using `ListMyMemberships`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyMemberships } from '@dataconnect/generated';


// Call the `listMyMemberships()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyMemberships();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyMemberships(dataConnect);

console.log(data.projectMembers);

// Or, you can use the `Promise` API.
listMyMemberships().then((response) => {
  const data = response.data;
  console.log(data.projectMembers);
});
```

### Using `ListMyMemberships`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyMembershipsRef } from '@dataconnect/generated';


// Call the `listMyMembershipsRef()` function to get a reference to the query.
const ref = listMyMembershipsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyMembershipsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.projectMembers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.projectMembers);
});
```

## GetTaskComments
You can execute the `GetTaskComments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTaskComments(vars: GetTaskCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskCommentsData, GetTaskCommentsVariables>;

interface GetTaskCommentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTaskCommentsVariables): QueryRef<GetTaskCommentsData, GetTaskCommentsVariables>;
}
export const getTaskCommentsRef: GetTaskCommentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTaskComments(dc: DataConnect, vars: GetTaskCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskCommentsData, GetTaskCommentsVariables>;

interface GetTaskCommentsRef {
  ...
  (dc: DataConnect, vars: GetTaskCommentsVariables): QueryRef<GetTaskCommentsData, GetTaskCommentsVariables>;
}
export const getTaskCommentsRef: GetTaskCommentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTaskCommentsRef:
```typescript
const name = getTaskCommentsRef.operationName;
console.log(name);
```

### Variables
The `GetTaskComments` query requires an argument of type `GetTaskCommentsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTaskCommentsVariables {
  taskId: UUIDString;
}
```
### Return Type
Recall that executing the `GetTaskComments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTaskCommentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTaskCommentsData {
  comments: ({
    content: string;
    author: {
      username: string;
    };
  })[];
}
```
### Using `GetTaskComments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTaskComments, GetTaskCommentsVariables } from '@dataconnect/generated';

// The `GetTaskComments` query requires an argument of type `GetTaskCommentsVariables`:
const getTaskCommentsVars: GetTaskCommentsVariables = {
  taskId: ..., 
};

// Call the `getTaskComments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTaskComments(getTaskCommentsVars);
// Variables can be defined inline as well.
const { data } = await getTaskComments({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTaskComments(dataConnect, getTaskCommentsVars);

console.log(data.comments);

// Or, you can use the `Promise` API.
getTaskComments(getTaskCommentsVars).then((response) => {
  const data = response.data;
  console.log(data.comments);
});
```

### Using `GetTaskComments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTaskCommentsRef, GetTaskCommentsVariables } from '@dataconnect/generated';

// The `GetTaskComments` query requires an argument of type `GetTaskCommentsVariables`:
const getTaskCommentsVars: GetTaskCommentsVariables = {
  taskId: ..., 
};

// Call the `getTaskCommentsRef()` function to get a reference to the query.
const ref = getTaskCommentsRef(getTaskCommentsVars);
// Variables can be defined inline as well.
const ref = getTaskCommentsRef({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTaskCommentsRef(dataConnect, getTaskCommentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comments);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUserBio
You can execute the `UpdateUserBio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserBio(vars?: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;

interface UpdateUserBioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
}
export const updateUserBioRef: UpdateUserBioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserBio(dc: DataConnect, vars?: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;

interface UpdateUserBioRef {
  ...
  (dc: DataConnect, vars?: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
}
export const updateUserBioRef: UpdateUserBioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserBioRef:
```typescript
const name = updateUserBioRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserBio` mutation has an optional argument of type `UpdateUserBioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserBioVariables {
  bio?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUserBio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserBioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserBioData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserBio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserBio, UpdateUserBioVariables } from '@dataconnect/generated';

// The `UpdateUserBio` mutation has an optional argument of type `UpdateUserBioVariables`:
const updateUserBioVars: UpdateUserBioVariables = {
  bio: ..., // optional
};

// Call the `updateUserBio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserBio(updateUserBioVars);
// Variables can be defined inline as well.
const { data } = await updateUserBio({ bio: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserBioVariables` argument.
const { data } = await updateUserBio();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserBio(dataConnect, updateUserBioVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserBio(updateUserBioVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserBio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserBioRef, UpdateUserBioVariables } from '@dataconnect/generated';

// The `UpdateUserBio` mutation has an optional argument of type `UpdateUserBioVariables`:
const updateUserBioVars: UpdateUserBioVariables = {
  bio: ..., // optional
};

// Call the `updateUserBioRef()` function to get a reference to the mutation.
const ref = updateUserBioRef(updateUserBioVars);
// Variables can be defined inline as well.
const ref = updateUserBioRef({ bio: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserBioVariables` argument.
const ref = updateUserBioRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserBioRef(dataConnect, updateUserBioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateProject
You can execute the `CreateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createProject(vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface CreateProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
}
export const createProjectRef: CreateProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProject(dc: DataConnect, vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface CreateProjectRef {
  ...
  (dc: DataConnect, vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
}
export const createProjectRef: CreateProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProjectRef:
```typescript
const name = createProjectRef.operationName;
console.log(name);
```

### Variables
The `CreateProject` mutation requires an argument of type `CreateProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProjectVariables {
  title: string;
}
```
### Return Type
Recall that executing the `CreateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProjectData {
  project_insert: Project_Key;
}
```
### Using `CreateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProject, CreateProjectVariables } from '@dataconnect/generated';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  title: ..., 
};

// Call the `createProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProject(createProjectVars);
// Variables can be defined inline as well.
const { data } = await createProject({ title: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProject(dataConnect, createProjectVars);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
createProject(createProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

### Using `CreateProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProjectRef, CreateProjectVariables } from '@dataconnect/generated';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  title: ..., 
};

// Call the `createProjectRef()` function to get a reference to the mutation.
const ref = createProjectRef(createProjectVars);
// Variables can be defined inline as well.
const ref = createProjectRef({ title: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProjectRef(dataConnect, createProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

## UpdateProject
You can execute the `UpdateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProject(vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;

interface UpdateProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
}
export const updateProjectRef: UpdateProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProject(dc: DataConnect, vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;

interface UpdateProjectRef {
  ...
  (dc: DataConnect, vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
}
export const updateProjectRef: UpdateProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProjectRef:
```typescript
const name = updateProjectRef.operationName;
console.log(name);
```

### Variables
The `UpdateProject` mutation requires an argument of type `UpdateProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProjectVariables {
  id: UUIDString;
  description?: string | null;
}
```
### Return Type
Recall that executing the `UpdateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProjectData {
  project_update?: Project_Key | null;
}
```
### Using `UpdateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProject, UpdateProjectVariables } from '@dataconnect/generated';

// The `UpdateProject` mutation requires an argument of type `UpdateProjectVariables`:
const updateProjectVars: UpdateProjectVariables = {
  id: ..., 
  description: ..., // optional
};

// Call the `updateProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProject(updateProjectVars);
// Variables can be defined inline as well.
const { data } = await updateProject({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProject(dataConnect, updateProjectVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
updateProject(updateProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `UpdateProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProjectRef, UpdateProjectVariables } from '@dataconnect/generated';

// The `UpdateProject` mutation requires an argument of type `UpdateProjectVariables`:
const updateProjectVars: UpdateProjectVariables = {
  id: ..., 
  description: ..., // optional
};

// Call the `updateProjectRef()` function to get a reference to the mutation.
const ref = updateProjectRef(updateProjectVars);
// Variables can be defined inline as well.
const ref = updateProjectRef({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProjectRef(dataConnect, updateProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## DeleteProject
You can execute the `DeleteProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteProject(vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;

interface DeleteProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
}
export const deleteProjectRef: DeleteProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProject(dc: DataConnect, vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;

interface DeleteProjectRef {
  ...
  (dc: DataConnect, vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
}
export const deleteProjectRef: DeleteProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProjectRef:
```typescript
const name = deleteProjectRef.operationName;
console.log(name);
```

### Variables
The `DeleteProject` mutation requires an argument of type `DeleteProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProjectVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProjectData {
  project_delete?: Project_Key | null;
}
```
### Using `DeleteProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProject, DeleteProjectVariables } from '@dataconnect/generated';

// The `DeleteProject` mutation requires an argument of type `DeleteProjectVariables`:
const deleteProjectVars: DeleteProjectVariables = {
  id: ..., 
};

// Call the `deleteProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProject(deleteProjectVars);
// Variables can be defined inline as well.
const { data } = await deleteProject({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProject(dataConnect, deleteProjectVars);

console.log(data.project_delete);

// Or, you can use the `Promise` API.
deleteProject(deleteProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_delete);
});
```

### Using `DeleteProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProjectRef, DeleteProjectVariables } from '@dataconnect/generated';

// The `DeleteProject` mutation requires an argument of type `DeleteProjectVariables`:
const deleteProjectVars: DeleteProjectVariables = {
  id: ..., 
};

// Call the `deleteProjectRef()` function to get a reference to the mutation.
const ref = deleteProjectRef(deleteProjectVars);
// Variables can be defined inline as well.
const ref = deleteProjectRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProjectRef(dataConnect, deleteProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_delete);
});
```

## CreateTask
You can execute the `CreateTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTaskRef:
```typescript
const name = createTaskRef.operationName;
console.log(name);
```

### Variables
The `CreateTask` mutation requires an argument of type `CreateTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTaskVariables {
  title: string;
  projectId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTaskData {
  task_insert: Task_Key;
}
```
### Using `CreateTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTask, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  projectId: ..., 
};

// Call the `createTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTask(createTaskVars);
// Variables can be defined inline as well.
const { data } = await createTask({ title: ..., projectId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTask(dataConnect, createTaskVars);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
createTask(createTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

### Using `CreateTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTaskRef, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  projectId: ..., 
};

// Call the `createTaskRef()` function to get a reference to the mutation.
const ref = createTaskRef(createTaskVars);
// Variables can be defined inline as well.
const ref = createTaskRef({ title: ..., projectId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTaskRef(dataConnect, createTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

## UpdateTaskStatus
You can execute the `UpdateTaskStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTaskStatus(vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

interface UpdateTaskStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTaskStatus(dc: DataConnect, vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

interface UpdateTaskStatusRef {
  ...
  (dc: DataConnect, vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTaskStatusRef:
```typescript
const name = updateTaskStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateTaskStatus` mutation requires an argument of type `UpdateTaskStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTaskStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateTaskStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTaskStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTaskStatusData {
  task_update?: Task_Key | null;
}
```
### Using `UpdateTaskStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTaskStatus, UpdateTaskStatusVariables } from '@dataconnect/generated';

// The `UpdateTaskStatus` mutation requires an argument of type `UpdateTaskStatusVariables`:
const updateTaskStatusVars: UpdateTaskStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateTaskStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTaskStatus(updateTaskStatusVars);
// Variables can be defined inline as well.
const { data } = await updateTaskStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTaskStatus(dataConnect, updateTaskStatusVars);

console.log(data.task_update);

// Or, you can use the `Promise` API.
updateTaskStatus(updateTaskStatusVars).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

### Using `UpdateTaskStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTaskStatusRef, UpdateTaskStatusVariables } from '@dataconnect/generated';

// The `UpdateTaskStatus` mutation requires an argument of type `UpdateTaskStatusVariables`:
const updateTaskStatusVars: UpdateTaskStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateTaskStatusRef()` function to get a reference to the mutation.
const ref = updateTaskStatusRef(updateTaskStatusVars);
// Variables can be defined inline as well.
const ref = updateTaskStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTaskStatusRef(dataConnect, updateTaskStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

## DeleteTask
You can execute the `DeleteTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface DeleteTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
}
export const deleteTaskRef: DeleteTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface DeleteTaskRef {
  ...
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
}
export const deleteTaskRef: DeleteTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTaskRef:
```typescript
const name = deleteTaskRef.operationName;
console.log(name);
```

### Variables
The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTaskVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}
```
### Using `DeleteTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTask, DeleteTaskVariables } from '@dataconnect/generated';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  id: ..., 
};

// Call the `deleteTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTask(deleteTaskVars);
// Variables can be defined inline as well.
const { data } = await deleteTask({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTask(dataConnect, deleteTaskVars);

console.log(data.task_delete);

// Or, you can use the `Promise` API.
deleteTask(deleteTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_delete);
});
```

### Using `DeleteTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTaskRef, DeleteTaskVariables } from '@dataconnect/generated';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  id: ..., 
};

// Call the `deleteTaskRef()` function to get a reference to the mutation.
const ref = deleteTaskRef(deleteTaskVars);
// Variables can be defined inline as well.
const ref = deleteTaskRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTaskRef(dataConnect, deleteTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_delete);
});
```

## AddProjectMember
You can execute the `AddProjectMember` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addProjectMember(vars: AddProjectMemberVariables): MutationPromise<AddProjectMemberData, AddProjectMemberVariables>;

interface AddProjectMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddProjectMemberVariables): MutationRef<AddProjectMemberData, AddProjectMemberVariables>;
}
export const addProjectMemberRef: AddProjectMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addProjectMember(dc: DataConnect, vars: AddProjectMemberVariables): MutationPromise<AddProjectMemberData, AddProjectMemberVariables>;

interface AddProjectMemberRef {
  ...
  (dc: DataConnect, vars: AddProjectMemberVariables): MutationRef<AddProjectMemberData, AddProjectMemberVariables>;
}
export const addProjectMemberRef: AddProjectMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addProjectMemberRef:
```typescript
const name = addProjectMemberRef.operationName;
console.log(name);
```

### Variables
The `AddProjectMember` mutation requires an argument of type `AddProjectMemberVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddProjectMemberVariables {
  projectId: UUIDString;
  userId: UUIDString;
  role: string;
}
```
### Return Type
Recall that executing the `AddProjectMember` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddProjectMemberData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddProjectMemberData {
  projectMember_insert: ProjectMember_Key;
}
```
### Using `AddProjectMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addProjectMember, AddProjectMemberVariables } from '@dataconnect/generated';

// The `AddProjectMember` mutation requires an argument of type `AddProjectMemberVariables`:
const addProjectMemberVars: AddProjectMemberVariables = {
  projectId: ..., 
  userId: ..., 
  role: ..., 
};

// Call the `addProjectMember()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addProjectMember(addProjectMemberVars);
// Variables can be defined inline as well.
const { data } = await addProjectMember({ projectId: ..., userId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addProjectMember(dataConnect, addProjectMemberVars);

console.log(data.projectMember_insert);

// Or, you can use the `Promise` API.
addProjectMember(addProjectMemberVars).then((response) => {
  const data = response.data;
  console.log(data.projectMember_insert);
});
```

### Using `AddProjectMember`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addProjectMemberRef, AddProjectMemberVariables } from '@dataconnect/generated';

// The `AddProjectMember` mutation requires an argument of type `AddProjectMemberVariables`:
const addProjectMemberVars: AddProjectMemberVariables = {
  projectId: ..., 
  userId: ..., 
  role: ..., 
};

// Call the `addProjectMemberRef()` function to get a reference to the mutation.
const ref = addProjectMemberRef(addProjectMemberVars);
// Variables can be defined inline as well.
const ref = addProjectMemberRef({ projectId: ..., userId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addProjectMemberRef(dataConnect, addProjectMemberVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.projectMember_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.projectMember_insert);
});
```

## UpdateMemberRole
You can execute the `UpdateMemberRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMemberRole(vars: UpdateMemberRoleVariables): MutationPromise<UpdateMemberRoleData, UpdateMemberRoleVariables>;

interface UpdateMemberRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMemberRoleVariables): MutationRef<UpdateMemberRoleData, UpdateMemberRoleVariables>;
}
export const updateMemberRoleRef: UpdateMemberRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMemberRole(dc: DataConnect, vars: UpdateMemberRoleVariables): MutationPromise<UpdateMemberRoleData, UpdateMemberRoleVariables>;

interface UpdateMemberRoleRef {
  ...
  (dc: DataConnect, vars: UpdateMemberRoleVariables): MutationRef<UpdateMemberRoleData, UpdateMemberRoleVariables>;
}
export const updateMemberRoleRef: UpdateMemberRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMemberRoleRef:
```typescript
const name = updateMemberRoleRef.operationName;
console.log(name);
```

### Variables
The `UpdateMemberRole` mutation requires an argument of type `UpdateMemberRoleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMemberRoleVariables {
  id: UUIDString;
  role: string;
}
```
### Return Type
Recall that executing the `UpdateMemberRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMemberRoleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMemberRoleData {
  projectMember_update?: ProjectMember_Key | null;
}
```
### Using `UpdateMemberRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMemberRole, UpdateMemberRoleVariables } from '@dataconnect/generated';

// The `UpdateMemberRole` mutation requires an argument of type `UpdateMemberRoleVariables`:
const updateMemberRoleVars: UpdateMemberRoleVariables = {
  id: ..., 
  role: ..., 
};

// Call the `updateMemberRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMemberRole(updateMemberRoleVars);
// Variables can be defined inline as well.
const { data } = await updateMemberRole({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMemberRole(dataConnect, updateMemberRoleVars);

console.log(data.projectMember_update);

// Or, you can use the `Promise` API.
updateMemberRole(updateMemberRoleVars).then((response) => {
  const data = response.data;
  console.log(data.projectMember_update);
});
```

### Using `UpdateMemberRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMemberRoleRef, UpdateMemberRoleVariables } from '@dataconnect/generated';

// The `UpdateMemberRole` mutation requires an argument of type `UpdateMemberRoleVariables`:
const updateMemberRoleVars: UpdateMemberRoleVariables = {
  id: ..., 
  role: ..., 
};

// Call the `updateMemberRoleRef()` function to get a reference to the mutation.
const ref = updateMemberRoleRef(updateMemberRoleVars);
// Variables can be defined inline as well.
const ref = updateMemberRoleRef({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMemberRoleRef(dataConnect, updateMemberRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.projectMember_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.projectMember_update);
});
```

## RemoveProjectMember
You can execute the `RemoveProjectMember` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
removeProjectMember(vars: RemoveProjectMemberVariables): MutationPromise<RemoveProjectMemberData, RemoveProjectMemberVariables>;

interface RemoveProjectMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveProjectMemberVariables): MutationRef<RemoveProjectMemberData, RemoveProjectMemberVariables>;
}
export const removeProjectMemberRef: RemoveProjectMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeProjectMember(dc: DataConnect, vars: RemoveProjectMemberVariables): MutationPromise<RemoveProjectMemberData, RemoveProjectMemberVariables>;

interface RemoveProjectMemberRef {
  ...
  (dc: DataConnect, vars: RemoveProjectMemberVariables): MutationRef<RemoveProjectMemberData, RemoveProjectMemberVariables>;
}
export const removeProjectMemberRef: RemoveProjectMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeProjectMemberRef:
```typescript
const name = removeProjectMemberRef.operationName;
console.log(name);
```

### Variables
The `RemoveProjectMember` mutation requires an argument of type `RemoveProjectMemberVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveProjectMemberVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `RemoveProjectMember` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveProjectMemberData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveProjectMemberData {
  projectMember_delete?: ProjectMember_Key | null;
}
```
### Using `RemoveProjectMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeProjectMember, RemoveProjectMemberVariables } from '@dataconnect/generated';

// The `RemoveProjectMember` mutation requires an argument of type `RemoveProjectMemberVariables`:
const removeProjectMemberVars: RemoveProjectMemberVariables = {
  id: ..., 
};

// Call the `removeProjectMember()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeProjectMember(removeProjectMemberVars);
// Variables can be defined inline as well.
const { data } = await removeProjectMember({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeProjectMember(dataConnect, removeProjectMemberVars);

console.log(data.projectMember_delete);

// Or, you can use the `Promise` API.
removeProjectMember(removeProjectMemberVars).then((response) => {
  const data = response.data;
  console.log(data.projectMember_delete);
});
```

### Using `RemoveProjectMember`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeProjectMemberRef, RemoveProjectMemberVariables } from '@dataconnect/generated';

// The `RemoveProjectMember` mutation requires an argument of type `RemoveProjectMemberVariables`:
const removeProjectMemberVars: RemoveProjectMemberVariables = {
  id: ..., 
};

// Call the `removeProjectMemberRef()` function to get a reference to the mutation.
const ref = removeProjectMemberRef(removeProjectMemberVars);
// Variables can be defined inline as well.
const ref = removeProjectMemberRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeProjectMemberRef(dataConnect, removeProjectMemberVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.projectMember_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.projectMember_delete);
});
```

## AddComment
You can execute the `AddComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addComment(vars: AddCommentVariables): MutationPromise<AddCommentData, AddCommentVariables>;

interface AddCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentVariables): MutationRef<AddCommentData, AddCommentVariables>;
}
export const addCommentRef: AddCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addComment(dc: DataConnect, vars: AddCommentVariables): MutationPromise<AddCommentData, AddCommentVariables>;

interface AddCommentRef {
  ...
  (dc: DataConnect, vars: AddCommentVariables): MutationRef<AddCommentData, AddCommentVariables>;
}
export const addCommentRef: AddCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCommentRef:
```typescript
const name = addCommentRef.operationName;
console.log(name);
```

### Variables
The `AddComment` mutation requires an argument of type `AddCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCommentVariables {
  taskId: UUIDString;
  content: string;
}
```
### Return Type
Recall that executing the `AddComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCommentData {
  comment_insert: Comment_Key;
}
```
### Using `AddComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addComment, AddCommentVariables } from '@dataconnect/generated';

// The `AddComment` mutation requires an argument of type `AddCommentVariables`:
const addCommentVars: AddCommentVariables = {
  taskId: ..., 
  content: ..., 
};

// Call the `addComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addComment(addCommentVars);
// Variables can be defined inline as well.
const { data } = await addComment({ taskId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addComment(dataConnect, addCommentVars);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
addComment(addCommentVars).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

### Using `AddComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCommentRef, AddCommentVariables } from '@dataconnect/generated';

// The `AddComment` mutation requires an argument of type `AddCommentVariables`:
const addCommentVars: AddCommentVariables = {
  taskId: ..., 
  content: ..., 
};

// Call the `addCommentRef()` function to get a reference to the mutation.
const ref = addCommentRef(addCommentVars);
// Variables can be defined inline as well.
const ref = addCommentRef({ taskId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCommentRef(dataConnect, addCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

## DeleteComment
You can execute the `DeleteComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteComment(vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;

interface DeleteCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
}
export const deleteCommentRef: DeleteCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteComment(dc: DataConnect, vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;

interface DeleteCommentRef {
  ...
  (dc: DataConnect, vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
}
export const deleteCommentRef: DeleteCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCommentRef:
```typescript
const name = deleteCommentRef.operationName;
console.log(name);
```

### Variables
The `DeleteComment` mutation requires an argument of type `DeleteCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCommentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCommentData {
  comment_delete?: Comment_Key | null;
}
```
### Using `DeleteComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteComment, DeleteCommentVariables } from '@dataconnect/generated';

// The `DeleteComment` mutation requires an argument of type `DeleteCommentVariables`:
const deleteCommentVars: DeleteCommentVariables = {
  id: ..., 
};

// Call the `deleteComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteComment(deleteCommentVars);
// Variables can be defined inline as well.
const { data } = await deleteComment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteComment(dataConnect, deleteCommentVars);

console.log(data.comment_delete);

// Or, you can use the `Promise` API.
deleteComment(deleteCommentVars).then((response) => {
  const data = response.data;
  console.log(data.comment_delete);
});
```

### Using `DeleteComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCommentRef, DeleteCommentVariables } from '@dataconnect/generated';

// The `DeleteComment` mutation requires an argument of type `DeleteCommentVariables`:
const deleteCommentVars: DeleteCommentVariables = {
  id: ..., 
};

// Call the `deleteCommentRef()` function to get a reference to the mutation.
const ref = deleteCommentRef(deleteCommentVars);
// Variables can be defined inline as well.
const ref = deleteCommentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCommentRef(dataConnect, deleteCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_delete);
});
```

