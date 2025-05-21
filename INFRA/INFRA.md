# K3S КЛАСТЕР INFRA.GYBER.ORG — ДОКУМЕНТАЦИЯ ДЛЯ РАЗРАБОТЧИКОВ

---

## 1. ОБЩАЯ ИНФОРМАЦИЯ О КЛАСТЕРЕ

- **Внешний IP:** 31.129.105.180
- **Версия k3s:** v1.31.x
- **ОС:** Ubuntu 24.04.1 LTS
- **Ресурсы:** ~53% диска занято, ~55% RAM используется

### Ноды кластера
| Имя         | Роль                | Версия           | Статус | Аптайм |
|-------------|---------------------|------------------|--------|--------|
| udjgkcvvya  | control-plane,master| v1.31.4+k3s1     | Ready  | 101d   |
| hfbtuseiuw  | worker              | v1.31.5+k3s1     | Ready  | 107d   |

- **kubectl** настроен и доступен
- Доступны стандартные инструменты управления k3s

---

## 2. СИСТЕМНЫЕ КОМПОНЕНТЫ КЛАСТЕРА

### Ingress и сетевой стек
- **Traefik** — основной Ingress-контроллер (80/443, автоматическая маршрутизация, TLS-терминация)
- **Istio** — сервис-меш (ingress/egress gateway, kiali, grafana, prometheus, loki)
- **CoreDNS** — DNS для сервисов внутри кластера

### Сертификаты и безопасность
- **cert-manager** — автоматизация TLS (Let's Encrypt, HTTP01 через Traefik)
- **ClusterIssuer:** letsencrypt-production (Ready)
- **Контакт:** dmitry.a.ovcharov@gmail.com

### Мониторинг и логирование
- **Prometheus** — сбор метрик с подов, сервисов, нод
- **Grafana** — визуализация (URL: logs.pswmeta.monitoring.infra.gyber.org)
- **Loki** — централизованное хранение логов (PV: loki-pv, 10Gi)
- **Promtail** — агент сбора логов с подов
- **Kiali** — UI для Istio

### Provisioning и storage
- **local-path-provisioner** — драйвер для локальных PVC
- **StorageClass:** local-path (по умолчанию), custom-local-path (альтернативный)
- **Стратегия:** WaitForFirstConsumer

---

## 3. ПРОЕКТЫ И ОКРУЖЕНИЯ (NAMESPACE)

### PSWMeta (develop-pswmeta, stage-pswmeta, prod-pswmeta)
- **Backend:** backend-game (Deployment)
- **Celery:** celery-beat, celery-worker (асинхронные задачи)
- **Frontend:** frontend-game (Deployment)
- **nginx-brotli:** прокси/балансировщик
- **PostgreSQL:** StatefulSet, PVC 8Gi
- **Redis:** Master, PVC 8Gi
- **Promtail:** сбор логов
- **referral-tg-app-frontend-game:** (prod)
- **Ingress:** с TLS, отдельный для каждого окружения
- **URL:**
  - dev: develop.pswmeta.build.infra.gyber.org
  - stage: stage.pswmeta.build.infra.gyber.org
  - prod: referrals.powerswap.io

### n8n (develop-n8n, stage-n8n)
- **n8n:** workflow automation (Deployment)
- **PostgreSQL:** база данных (PVC 1Gi)
- **Хранилище данных:** PVC 100Mi

### GProd (develop-gprod)
- **Namespace создан**
- **URL:** dev.gprod.build.infra.gyber.org, api.dev.gprod.build.infra.gyber.org
- **План:** PostgreSQL, Backend, Ingress с TLS

---

## 4. ХРАНЕНИЕ ДАННЫХ

### PersistentVolume и PVC
| Имя         | Размер | Режим | Статус | Namespace         |
|-------------|--------|-------|--------|-------------------|
| loki-pv     | 10Gi   | RWO   | Bound  | istio-system      |
| ...         | ...    | ...   | ...    | ...               |

- **PVC для PostgreSQL:** 8Gi
- **PVC для Redis:** 8Gi
- **PVC для n8n:** 1Gi (БД), 100Mi (файлы)
- **Все данные контейнеров:** `/var/lib/rancher/k3s/agent/containerd/`
- **PV для приложений:** `/var/lib/rancher/k3s/storage/`
- **Исходники приложений:** доступны только внутри контейнеров (kubectl exec)

---

## 5. DNS, TLS, СЕТЬ

- **DNS-записи:** (A-записи на 31.129.105.180)
  - develop.pswmeta.build.infra.gyber.org
  - stage.pswmeta.build.infra.gyber.org
  - logs.pswmeta.monitoring.infra.gyber.org
  - referrals.powerswap.io
  - dev.gprod.build.infra.gyber.org
  - api.dev.gprod.build.infra.gyber.org
- **TLS:** автоматическое получение и обновление через cert-manager, хранение в Secret соответствующего namespace

---

## 6. СТАНДАРТЫ РАЗВЕРТЫВАНИЯ

- **Namespace:** dev/stage/prod для изоляции окружений
- **StatefulSet:** для баз данных
- **Deployment:** для stateless-приложений
- **Ingress:** с TLS для внешнего доступа
- **ConfigMap/Secret:** для конфигураций
- **Resource Quotas:** контроль ресурсов через namespace
- **Приоритет:** production-окружения
- **Стандартные размеры томов:**
  - PostgreSQL: 8Gi
  - Redis: 8Gi
  - Loki: 10Gi
  - n8n: 1Gi/100Mi

---

## 7. ПУТИ, ФАЙЛЫ, ДОСТУП

- **kubeconfig:** `/etc/rancher/k3s/k3s.yaml`, `/var/lib/rancher/k3s/agent/*.kubeconfig`
- **Сертификаты:** `/var/lib/rancher/k3s/agent/*.crt`, `*.key`
- **Временные файлы и сокеты:** `/run/`, `/run/k3s/`, `/run/flannel/`
- **Данные контейнеров:** `/var/lib/rancher/k3s/agent/containerd/`
- **PV/PVC:** `/var/lib/rancher/k3s/storage/`
- **Исходники приложений:** только внутри контейнеров (kubectl exec)

---

## 8. BEST PRACTICES ДЛЯ РАЗРАБОТЧИКОВ

- **kubectl:** всегда указывай namespace (`-n <namespace>`)
- **Helm:** для деплоя сложных приложений используй Helm-чарты
- **kubectl exec:** для доступа к файлам приложения внутри контейнера
- **kubectl logs:** для просмотра логов пода
- **kubectl get all -A:** для обзора всех ресурсов
- **kubectl describe pod ...:** для диагностики проблем
- **kubectl port-forward:** для локального доступа к сервису
- **kubectl cp:** для копирования файлов внутрь/наружу контейнера
- **kubectl rollout restart deployment ...:** для перезапуска приложения
- **kubectl top pod/node:** для мониторинга ресурсов
- **kubectl apply -f ...:** для применения манифестов
- **kubectl delete ...:** для удаления ресурсов
- **kubectl config use-context ...:** для переключения между кластерами

---

## 9. МОНИТОРИНГ, ЛОГИРОВАНИЕ, ТРОБЛЬШУТИНГ

- **Grafana:** дашборды для мониторинга кластера и приложений
- **Loki:** централизованное логирование
- **Prometheus:** сбор метрик
- **Kiali:** визуализация сервис-меша Istio
- **kubectl describe pod ...:** для диагностики проблем
- **kubectl get events -A:** для просмотра событий
- **kubectl get pvc,pv -A:** для проверки статуса хранилища
- **kubectl get ingress -A:** для проверки маршрутизации
- **kubectl get certificate -A:** для проверки TLS

---

## 10. БЕЗОПАСНОСТЬ

- **kubeconfig и сертификаты:** не публикуй, не храни в публичных репозиториях
- **Secret:** используй для хранения паролей, токенов, ключей
- **RBAC:** минимальные права для сервис-аккаунтов
- **NetworkPolicy:** ограничивай сетевые взаимодействия между namespace
- **Обновления:** регулярно обновляй k3s, системные компоненты и Helm-чарты

---

## 11. ТИПОВЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ

- **Проблемы с PVC:** проверь статус PV/PVC, логи provisioner, права на папки
- **Проблемы с ingress:** проверь Traefik/Ingress, DNS, сертификаты
- **Проблемы с сертификатами:** проверь cert-manager, ClusterIssuer, события
- **Проблемы с деплоем:** смотри kubectl describe, kubectl logs, kubectl get events
- **Проблемы с сетью:** проверь Istio, NetworkPolicy, CoreDNS

---

## 12. ПОЛЕЗНЫЕ КОМАНДЫ

```sh
# Список всех подов во всех namespace
kubectl get pods -A

# Логи пода
kubectl logs -n <namespace> <pod>

# Зайти внутрь контейнера
kubectl exec -it -n <namespace> <pod> -- /bin/sh

# Применить манифест
kubectl apply -f <file.yaml>

# Перезапустить деплоймент
kubectl rollout restart deployment <name> -n <namespace>

# Проверить статус PVC
kubectl get pvc -A

# Проверить сертификаты
kubectl get certificate -A
```

---

_Документ обновлён и дополнен на основе анализа реального состояния кластера (май 2025)._