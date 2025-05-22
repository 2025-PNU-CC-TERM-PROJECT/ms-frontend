# 1단계: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# 의존성 캐시 최적화를 위해 package 파일만 먼저 복사
COPY package*.json ./

# 모든 의존성 설치 (devDependencies 포함)
RUN npm install

# 전체 소스 복사
COPY . .

#쿠버네티스 배포용!!
ENV NEXT_PUBLIC_API_URL=http://ms-backend.ms-backend.example.com

#로컬/도커 환경 테스트용!!
#ENV NEXT_PUBLIC_API_URL=http://localhost:8081

# 애플리케이션 빌드
RUN npm run build

# 2단계: Production Runtime Stage
FROM node:18-alpine

WORKDIR /app

# 빌드 결과 복사
COPY --from=builder /app ./

# 실행 시 환경 (빌드와 분리)
ENV NODE_ENV=production

EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]
