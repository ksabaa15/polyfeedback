# REST API Endpoints

## Overview

| Method | Path                   | Description                                                                                      | Header                                            | Body                                                                           | Response            |
|--------|------------------------|--------------------------------------------------------------------------------------------------|---------------------------------------------------|--------------------------------------------------------------------------------|---------------------|
| GET    | */api/courses*         | Gets all the courses. Each course has an array of `Review` reference IDs                         | Authentication Token mapped to key `x-auth-token` | **Empty**                                                                      | Array of **Course** |
| GET    | */api/courses/**:id*** | Gets the course with the given **id**. The course contains a populated array of `Review` objects | Authentication Token mapped to key `x-auth-token` | **Empty**                                                                      | **Course**          |
| POST   | */api/reviews/*        | Adds the given review                                                                            | Authentication Token mapped to key `x-auth-token` | **Review** object without `user` property. Gets user from authentication token | **Review**          |

