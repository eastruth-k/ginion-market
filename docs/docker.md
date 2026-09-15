# Docker Ubuntu 24.04 실행 가이드

이 구성은 하나의 Ubuntu 24.04 컨테이너에서 nginx, Next.js(Node.js), MongoDB를 함께 실행합니다. 호스트의 `3000` 포트는 컨테이너 nginx의 `3000` 포트에 연결되고, nginx는 컨테이너 내부의 Next.js `3001` 포트로 요청을 전달합니다.

MongoDB 데이터는 애플리케이션 컨테이너에, Codex 설정과 Codex가 작업할 프로젝트 소스는 별도의 일회성 도구 컨테이너에 Windows 호스트 경로로 바인드 마운트합니다. 따라서 컨테이너나 이미지를 삭제해도 MongoDB 데이터와 소스 변경은 유지됩니다. Codex 인증 정보를 외부 요청을 받는 애플리케이션 컨테이너와 분리하기 위한 구성입니다.

## 1. 사전 준비

Windows 11에 Docker Desktop이 설치되어 있고 Linux 컨테이너 엔진이 실행 중이어야 합니다.

PowerShell에서 프로젝트 루트로 이동한 후 Docker 환경 파일을 만듭니다.

```powershell
Copy-Item .env.docker.example .env.docker
notepad .env.docker
```

`.env.docker`에서 다음 값을 실제 Windows 경로와 환경에 맞게 수정합니다.

```dotenv
MONGODB_DATA_PATH=C:/Users/user/DockerData/ginion_market/mongodb
CODEX_HOME_PATH=C:/Users/user/.codex
PROJECT_PATH=C:/Users/user/Desktop/kdy/ginion_market
BETTER_AUTH_SECRET=32자-이상의-충분히-긴-임의-문자열
BETTER_AUTH_URL=http://localhost:3000
MONGODB_DB=daepa_market
CODEX_VERSION=0.154.0-alpha.6.2
```

경로에는 역슬래시(`\`) 대신 슬래시(`/`)를 사용합니다. MongoDB 저장 폴더는 최초 실행 전에 생성합니다.

```powershell
$dockerEnv = Get-Content .env.docker | ConvertFrom-StringData
New-Item -ItemType Directory -Force -Path $dockerEnv.MONGODB_DATA_PATH
```

`BETTER_AUTH_SECRET`은 아래 명령으로 생성할 수 있습니다.

```powershell
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower()
```

## 2. 이미지 빌드 및 최초 실행

현재 디렉터리의 프로젝트가 이미지의 `/app`으로 복사된 다음 `npm ci`와 `npm run build`가 실행됩니다.

```powershell
docker compose --env-file .env.docker build
docker compose --env-file .env.docker up -d
```

상태와 로그를 확인합니다.

```powershell
docker compose --env-file .env.docker ps
docker compose --env-file .env.docker logs -f
```

브라우저에서 <http://localhost:3000>을 엽니다.

초기 데이터가 필요하면 실행 중인 컨테이너에서 seed 명령을 한 번 실행합니다.

```powershell
docker compose --env-file .env.docker exec app npm run seed
```

## 3. 중지, 재실행, 삭제

컨테이너를 중지합니다.

```powershell
docker compose --env-file .env.docker stop
```

중지한 컨테이너를 다시 실행합니다.

```powershell
docker compose --env-file .env.docker start
```

컨테이너를 삭제합니다. 호스트의 `MONGODB_DATA_PATH` 데이터는 삭제되지 않습니다.

```powershell
docker compose --env-file .env.docker down
```

삭제 후 같은 이미지로 컨테이너를 다시 생성합니다.

```powershell
docker compose --env-file .env.docker up -d
```

소스가 변경되었으면 이미지를 다시 빌드하고 재생성합니다.

```powershell
docker compose --env-file .env.docker up -d --build
```

이미지까지 삭제하려면 다음을 실행합니다. MongoDB 호스트 폴더는 그대로 유지됩니다.

```powershell
docker compose --env-file .env.docker down --rmi local
```

MongoDB 데이터까지 초기화하려는 경우에만 컨테이너를 내린 뒤 `.env.docker`의 `MONGODB_DATA_PATH` 폴더를 Windows에서 직접 삭제합니다. 이 작업은 복구할 수 없으므로 일반적인 재실행 과정에서는 삭제하지 않습니다.

## 4. 컨테이너에서 Codex CLI 사용

Windows용 `codex.exe`는 Linux 컨테이너에서 직접 실행할 수 없습니다. Docker 이미지는 `CODEX_VERSION`과 같은 버전의 Linux용 Codex CLI를 설치하고, Windows 호스트의 `CODEX_HOME_PATH`를 `/home/nodeapp/.codex`에 연결합니다. 이 방식으로 호스트 Codex의 로그인, 설정과 세션을 그대로 사용합니다.

호스트와 컨테이너 버전이 같은지 확인합니다.

```powershell
codex --version
docker compose --env-file .env.docker --profile tools run --rm codex --version
```

버전이 다르면 `.env.docker`의 `CODEX_VERSION`을 호스트 출력에 맞춘 다음 이미지를 다시 빌드합니다.

```powershell
docker compose --env-file .env.docker build --no-cache
docker compose --env-file .env.docker up -d
```

Codex가 수정한 파일이 Windows 호스트에도 유지되도록 호스트 프로젝트는 컨테이너의 `/workspace`에 별도로 연결되어 있습니다. Codex는 다음처럼 실행합니다.

```powershell
docker compose --env-file .env.docker --profile tools run --rm codex
```

비대화형 실행 예시는 다음과 같습니다.

```powershell
docker compose --env-file .env.docker --profile tools run --rm codex exec "현재 프로젝트를 요약해줘"
```

컨테이너의 `/app`은 이미지 빌드 시점의 실행용 복사본이고 `/workspace`는 Windows의 현재 소스입니다. Codex가 `/workspace`를 수정한 뒤 실행 앱에 반영하려면 `docker compose --env-file .env.docker up -d --build`로 이미지를 다시 빌드합니다.

호스트 `.codex` 폴더에는 인증 정보가 포함될 수 있으므로 이미지를 만들 때 복사하지 않으며, 외부 요청을 받는 `app` 서비스에도 연결하지 않습니다. 해당 폴더와 `.env.docker`는 Git에 커밋하지 않습니다.

## 5. 구성 확인과 문제 해결

nginx, Next.js, MongoDB 프로세스를 확인합니다.

```powershell
docker compose --env-file .env.docker exec app supervisorctl status
```

MongoDB 데이터 경로가 올바르게 연결되었는지 확인합니다.

```powershell
docker inspect ginion-market --format '{{json .Mounts}}'
```

3000 포트를 이미 다른 프로그램이 사용 중이면 해당 프로그램을 종료해야 합니다.

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

Docker Desktop이 실행되지 않은 경우 `docker compose`는 Linux 엔진 연결 오류를 출력합니다. Docker Desktop을 시작한 뒤 `docker version`의 Server 항목이 표시되는지 확인하고 다시 실행합니다.
