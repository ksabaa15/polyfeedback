# Polyfeedback Backend

## Deployment for Development

To run the app for development purposes, run the following command:

```shell
npm start
```

## Environment Variables

| Name                             | Description                                                                 | Default        |
|----------------------------------|-----------------------------------------------------------------------------|----------------|
| `JWT_PRIVATE_KEY`                | A private key used to generate and verify JWT tokens                        | **No Default** |
| `NODE_ENV`                       | Represents the running environment. Possible values : `test`, `dev`, `prod` | `prod`         |
| `PORT`                           | The listening port of the app                                               | `3000`         |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase credentials                                                | **No Default** |

