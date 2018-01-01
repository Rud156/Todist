# Todist

> A simple todo application inspired by [Microsoft Todo](https://todo.microsoft.com/en-us)

#### Currently only the API is almost complete and is avaliable at: http://asp-net-todo.azurewebsites.net/api

#### This is a work in progress.

### Api Endpoints:
> All endpoints start with: http://asp-net-todo.azurewebsites.net/api
```
    /auth/register
    POST
    username: Username,
    password: Password
```

```
    /auth/login
    POST
    username: Username,
    password: Password
```

```
    /todo/add_category?category=<name>
    POST
    name: New category name
```

```
    /todo/add_todo
    POST
    title: Todo Title,
    category: Todo Category
```

```
    /todo/all
    GET
```

```
    /todo/category?category=<name>
    GET
    name: Category Name
```

```
    /todo/starting?datetime=<date>
    GET
    date: ISO Date string
```

```
    /todo/due?datetime=<date>
    GET
    date: ISO Date string
```

```
    /todo?id=<id>
    GET
    id: Todo Id
```

```
    /todo/completed
    GET
```

```
    /todo/incomplete
    GET
```

```
    /todo/priority?priority=<priority>
    GET
    priority: Number for priority
```

```
    /todo/update_todo
    PUT
    Id: Todo Id,
    DueDate: ISO Date string,
    Note: Extra Content,
    Priority: Priority
```

```
    /todo/complete_todo?id=<id>
    PATCH
    id: Todo Id
```

```
    /todo/mark_incomplete_todo?id=<id>
    PATCH
    id: Todo Id
```

```
    /todo/update_category?category=<name>&newcategoryname=<newName>
    PATCH
    name: Old Category Name,
    newName: New Name for Category
```

```
    /todo/change_priority?priority=<priority>&id=<id>
    PATCH
    priority: Number for priority,
    id: Todo Id
```

```
    /todo?id=<id>
    DELETE
    id: Todo Id
```

```
    /todo/completed?category=<name>
    DELETE
    name: Category Name
```

```
    /todo/category?category=<name>
    DELETE
    name: Category Name
```