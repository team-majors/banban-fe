#!/bin/bash

##############################################################################
# Banban Frontend Docker Deployment Script
# Nginx는 호스트 서버에 이미 설치됨 (localhost:3000으로 프록시)
# 사용법: ./deploy.sh [옵션]
##############################################################################

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 설정
PROJECT_NAME="banban"
DOCKER_COMPOSE_FILE="docker-compose.yml"
LOG_FILE="deploy.log"
BACKUP_DIR="./backups"
DOCKER_COMPOSE_CMD=""

# 함수: 로그 출력
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

# 함수: 성공 메시지
success() {
    echo -e "${GREEN}[✓] $1${NC}" | tee -a "$LOG_FILE"
}

# 함수: 경고 메시지
warning() {
    echo -e "${YELLOW}[!] $1${NC}" | tee -a "$LOG_FILE"
}

# 함수: 에러 메시지
error() {
    echo -e "${RED}[✗] $1${NC}" | tee -a "$LOG_FILE"
}

# 함수: 사용법 출력
show_usage() {
    cat << EOF
사용법: ./deploy.sh [옵션]

옵션:
    up              Docker 컨테이너 시작
    down            Docker 컨테이너 종료
    restart         Docker 컨테이너 재시작
    rebuild         이미지 다시 빌드 후 시작
    logs            컨테이너 로그 확인
    status          컨테이너 상태 확인
    health          헬스 체크
    backup          현재 상태 백업
    rollback        최근 백업에서 복구 (구현 필요)
    clean           미사용 이미지/볼륨 정리
    ps              실행 중인 컨테이너 확인
    help            도움말 출력

예:
    ./deploy.sh rebuild
    ./deploy.sh logs
    ./deploy.sh health
EOF
}

# 함수: 필수 파일 확인
check_requirements() {
    log "필수 파일 확인 중..."

    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        error "docker-compose.yml 파일을 찾을 수 없습니다"
        exit 1
    fi

    if [ ! -f ".env.production" ]; then
        warning ".env.production 파일이 없습니다. .env 파일을 사용합니다"
    fi

    if ! command -v docker &> /dev/null; then
        error "Docker가 설치되어 있지 않습니다"
        exit 1
    fi

    # Docker Compose V1 또는 V2 확인
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
    else
        error "Docker Compose가 설치되어 있지 않습니다 (V1 또는 V2)"
        exit 1
    fi

    success "필수 파일 및 도구 확인 완료 (Docker Compose: $DOCKER_COMPOSE_CMD)"
}

# 함수: 컨테이너 시작
deploy_up() {
    log "Docker 컨테이너를 시작합니다..."

    if $DOCKER_COMPOSE_CMD up -d; then
        success "컨테이너 시작 완료"
        sleep 3
        deploy_status
    else
        error "컨테이너 시작 실패"
        exit 1
    fi
}

# 함수: 컨테이너 종료
deploy_down() {
    log "Docker 컨테이너를 종료합니다..."

    if $DOCKER_COMPOSE_CMD down; then
        success "컨테이너 종료 완료"
    else
        error "컨테이너 종료 실패"
        exit 1
    fi
}

# 함수: 컨테이너 재시작
deploy_restart() {
    log "Docker 컨테이너를 재시작합니다..."

    if $DOCKER_COMPOSE_CMD restart; then
        success "컨테이너 재시작 완료"
        sleep 3
        deploy_status
    else
        error "컨테이너 재시작 실패"
        exit 1
    fi
}

# 함수: 이미지 다시 빌드
deploy_rebuild() {
    log "Docker 이미지를 빌드합니다..."

    if $DOCKER_COMPOSE_CMD up -d --build; then
        success "이미지 빌드 및 컨테이너 시작 완료"
        sleep 3
        deploy_status
    else
        error "이미지 빌드 실패"
        exit 1
    fi
}

# 함수: 컨테이너 상태 확인
deploy_status() {
    log "컨테이너 상태 확인..."
    $DOCKER_COMPOSE_CMD ps
}

# 함수: 컨테이너 ps 명령
deploy_ps() {
    log "실행 중인 컨테이너 목록..."
    docker ps -a --filter "label=com.docker.compose.project=${PROJECT_NAME}"
}

# 함수: 로그 확인
deploy_logs() {
    log "컨테이너 로그를 출력합니다... (Ctrl+C로 종료)"
    $DOCKER_COMPOSE_CMD logs -f --tail=100
}

# 함수: 헬스 체크
deploy_health() {
    log "헬스 체크를 수행합니다..."

    # Next.js 헬스 체크 (localhost:3000)
    if curl -s -f -o /dev/null http://localhost:3000/health 2>/dev/null; then
        success "Next.js: 정상 (http://localhost:3000)"
    else
        error "Next.js: 응답 없음"
        return 1
    fi

    # 웹사이트 접근 가능 여부 확인
    if curl -s -f -o /dev/null https://www.banban.today 2>/dev/null; then
        success "https://www.banban.today: 접근 가능"
    else
        warning "https://www.banban.today: 응답 없음 (Nginx 설정 확인 필요)"
    fi
}

# 함수: 백업
deploy_backup() {
    log "현재 상태를 백업합니다..."

    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="$BACKUP_DIR/backup-$(date +'%Y%m%d-%H%M%S')"

    log "백업 위치: $BACKUP_NAME"
    mkdir -p "$BACKUP_NAME"

    # 현재 .env.production 백업
    if [ -f ".env.production" ]; then
        cp .env.production "$BACKUP_NAME/"
        success ".env.production 백업 완료"
    fi

    # Docker volumes 백업 (선택사항)
    # docker run --rm -v banban_data:/data -v "$BACKUP_NAME":/backup ubuntu tar czf /backup/data.tar.gz -C / data

    success "백업 완료: $BACKUP_NAME"
}

# 함수: 미사용 이미지/볼륨 정리
deploy_clean() {
    log "미사용 Docker 리소스를 정리합니다..."

    # 중지된 컨테이너 제거
    docker container prune -f

    # 댕글링 이미지 제거
    docker image prune -f

    # 미사용 볼륨 제거
    docker volume prune -f

    success "정리 완료"
}

##############################################################################
# Main Script
##############################################################################

# 로그 파일 초기화
> "$LOG_FILE"

log "=========================================="
log "Banban Frontend Deployment Script"
log "=========================================="

# 필수 파일 확인
check_requirements

# 명령 처리
case "${1:-help}" in
    up)
        deploy_up
        ;;
    down)
        deploy_down
        ;;
    restart)
        deploy_restart
        ;;
    rebuild)
        deploy_rebuild
        ;;
    logs)
        deploy_logs
        ;;
    status)
        deploy_status
        ;;
    ps)
        deploy_ps
        ;;
    health)
        deploy_health
        ;;
    backup)
        deploy_backup
        ;;
    clean)
        deploy_clean
        ;;
    help)
        show_usage
        ;;
    *)
        error "알 수 없는 명령: $1"
        show_usage
        exit 1
        ;;
esac

log "=========================================="
log "작업 완료"
log "=========================================="
log "로그 파일: $LOG_FILE"
