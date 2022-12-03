
# NASA url-collector microservice

NASA url-collector is microservice consuming request of given period of dates nad responses with table of image urls located in apod nasa api of given period of dates.


## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Deployment](#deployment)

## 🧐 About <a name = "about"></a>

NASA url-collector is microservice consuming request of given period of dates nad responses with table of image urls located in [apod nasa api](https://api.nasa.gov) of given period.

## 🏁 Getting Started <a name = "getting_started"></a>

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/en/) v16.17.0
- [TypeSctipt](https://www.npmjs.com/package/typescript)

### Installing

After cloning repository locally.

```
cp .env.dist .env
```

1. Running in development mode

```
npm ci
npm run start:dev
```

2. Running by docker engine

```
npm ci
npm run build:docker
npm run start:docker
```
❗️ Note that `start:docker` command has bind `8080` port in it.

3. Envoirements can be passed by .env file

 - `API_KEY` by default `DEMO_KEY` is key to authorize apod nasa api request.
 - `API_TIMEOUT` by default `60000ms` is aproximated time that apod nasa api responses with timeout code.
 - `CONCURRENT_REQUESTS` by default `5` is number of concurrenting requests that can be called to apod nasa api at the same time.
 - `SERVER TIMEOUT` by default `120000ms` is time after service reponses with timeout code
 - `SERVER_PORT` by default `8080` is port that server is listening on


## 🔧 Running the tests <a name = "tests"></a>

```
npm run test
```


## 🎈 Usage <a name="usage"></a>

After running application http api should be available on `localhost:$PORT`.

❗️ Note that default port from .env.dist file is `8080`.

Url-colector endpoint resource is available on:

`HTTP GET /?start_date=$DATE&end_date=$DATE`

`$DATE` is parameter of valid date format `YYYY-MM-DD`.

## 🚀 Deployment <a name = "deployment"></a>

TBC
