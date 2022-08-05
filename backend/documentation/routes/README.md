# REST API Endpoints

## Overview

| Method | Path                   | Description                                                                             | Header                                            | Body                                                                             | Response            |
|--------|------------------------|-----------------------------------------------------------------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------|---------------------|
| GET    | */api/courses*         | Gets all the courses without their reviews.                                             | Authentication Token mapped to key `x-auth-token` | **Empty**                                                                        | Array of **Course** |
| GET    | */api/courses/**:id*** | Gets the course with the given **id**. The course contains an array of `Review` objects | Authentication Token mapped to key `x-auth-token` | **Empty**                                                                        | **Course**          |
| POST   | */api/reviews/*        | Adds the given review                                                                   | Authentication Token mapped to key `x-auth-token` | **Review** object without `userId` property. Gets user from authentication token | **Review**          |

