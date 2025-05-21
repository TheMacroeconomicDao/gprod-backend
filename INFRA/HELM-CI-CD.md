# Инструкция по Helm и CI/CD для gprod-backend

---

## 1. Что такое Helm и зачем он нужен
- Helm — пакетный менеджер для Kubernetes, позволяет шаблонизировать и удобно деплоить приложения.
- Helm chart — набор файлов (deployment, service, ingress, secret и др.), которые описывают, как развернуть приложение.
- Позволяет быстро обновлять, откатывать и масштабировать приложения.

## 2. Что такое CI/CD и зачем он нужен
- CI/CD — автоматизация сборки, тестирования и деплоя кода.
- CI (Continuous Integration): автоматическая сборка и тесты при каждом пуше.
- CD (Continuous Delivery/Deployment): автоматический деплой в кластер после успешной сборки.
- Пример: GitHub Actions, GitLab CI, Jenkins.

---

## 3. Работа с секретами (Kubernetes Secret + CI/CD)

### 3.1. Создание Kubernetes Secret вручную
```bash
kubectl create secret generic gprod-backend-env \
  --from-env-file=.env.development \
  -n develop-gprod
```
- Создаёт секрет с переменными окружения из файла .env.development.
- Используется в Deployment через:
```yaml
envFrom:
  - secretRef:
      name: gprod-backend-env
```

### 3.2. Создание секрета через Helm

**В values.yaml:**
```yaml
secretEnv:
  DATABASE_URL: "postgresql://postgres:password@postgres:5432/gprod"
  JWT_SECRET: "my-super-secret"
```

**В templates/secret.yaml:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gprod-backend-env
  namespace: {{ .Release.Namespace }}
type: Opaque
stringData:
  {{- range $key, $value := .Values.secretEnv }}
  {{ $key }}: {{ $value | quote }}
  {{- end }}
```

**В templates/deployment.yaml:**
```yaml
envFrom:
  - secretRef:
      name: gprod-backend-env
```

### 3.3. Передача секретов из CI/CD (GitHub Actions)

1. Добавь секреты в GitHub:
   - Settings → Secrets and variables → Actions
   - Например: `DATABASE_URL`, `JWT_SECRET`, `KUBE_CONFIG`

2. В workflow подставляй их в Helm:
```yaml
- name: Deploy via Helm
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    KUBECONFIG: ${{ secrets.KUBE_CONFIG }}
  run: |
    helm upgrade --install gprod-backend ./helm/gprod-backend \
      -n develop-gprod --create-namespace \
      --set secretEnv.DATABASE_URL="$DATABASE_URL" \
      --set secretEnv.JWT_SECRET="$JWT_SECRET" \
      -f ./helm/gprod-backend/values-dev.yaml
```

---

## 4. Проверка и отладка секретов

- Проверить секрет в кластере:
```bash
kubectl get secret gprod-backend-env -n develop-gprod -o yaml
```
- Проверить переменные в поде:
```bash
kubectl exec -it <pod> -n develop-gprod -- printenv | grep DATABASE_URL
```

---

## 5. Best practices
- Никогда не храни реальные секреты в git (values.yaml, .env и т.д.).
- Для dev/stage: можно использовать Kubernetes Secret + Secrets в CI/CD.
- Для prod: значения секретов брать из внешнего секрет-хранилища или CI/CD.
- В Helm-чарте секреты описывать через шаблон secret.yaml и подставлять значения через --set или отдельный values.yaml (не коммитить в git).
- Для сложных случаев — использовать HashiCorp Vault, AWS Secrets Manager и т.д.

---

## 6. Пример полного пайплайна (GitHub Actions)

```yaml
name: Build & Deploy to K3S

on:
  push:
    branches: [dev]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to GHCR
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.CR_PAT }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile.prod
          push: true
          tags: |
            ghcr.io/gybernaty/gprod-backend:dev
            ghcr.io/gybernaty/gprod-backend:${{ github.sha }}

      - name: Set up Helm
        uses: azure/setup-helm@v3

      - name: Deploy via Helm
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          KUBECONFIG: ${{ secrets.KUBE_CONFIG }}
        run: |
          helm upgrade --install gprod-backend ./helm/gprod-backend \
            -n develop-gprod --create-namespace \
            --set image.tag=${{ github.sha }} \
            --set secretEnv.DATABASE_URL="$DATABASE_URL" \
            --set secretEnv.JWT_SECRET="$JWT_SECRET" \
            -f ./helm/gprod-backend/values-dev.yaml
```

---

_Эта инструкция покрывает все основные вопросы по работе с Helm, CI/CD и секретами для gprod-backend. 