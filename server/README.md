# iBlock Core Server

Welcome to iBlock Core's server! This server is currently intended for providing controlled access to iBlock's blockchain. In the future, it will have more features beyond the blockchain, such as user authentication and merch shop functionalities.

## How to Start the Server

### Docker

Make sure docker-compose is installed and the Docker application is running. Copy the environment variables:
```shell
cp .env.example .env
```
And run the docker command (default port is 5000):
```shell
npm run docker
```

### Manual

On the root folder `server`, install the packages. This process can take some time depending on the internet speed. To install, run:
```shell
npm install
```
Then, copy the environment variables. Note that the port here must match the port of API_URL in `.env` located under `website`.
```shell
cp .env.example .env
```
Finally, start the server (for development)!
```shell
npm run dev
```
