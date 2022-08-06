# Polyfeedback Backend

## Deployment for Development
The section describes the various way you can deploy the app for development purposes.

### Standalone Deployment

Please run the following command for a standalone deployment:
```shell
npm start
```
### Docker deployment
Please run the following command for a docker deployment:
```shell
docker build -t polyfeedback .
docker run -it -p 3000:3000 polyfeedback
```
For an instant refresh development setup:
```shell
docker run -it -p 3000:3000 -v $(pwd):/app polyfeedback
```

## Environment Variables

| Name                             | Description                                                                 | Default        |
|----------------------------------|-----------------------------------------------------------------------------|----------------|
| `JWT_PRIVATE_KEY`                | A private key used to generate and verify JWT tokens                        | **No Default** |
| `NODE_ENV`                       | Represents the running environment. Possible values : `test`, `dev`, `prod` | `prod`         |
| `PORT`                           | The listening port of the app                                               | `3000`         |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase credentials                                                | **No Default** |

