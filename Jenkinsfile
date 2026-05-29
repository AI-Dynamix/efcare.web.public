@Library('jenkins-shared-library') _

// ============================================================================
// EFCare Web Public
// Jenkins CI/CD Pipeline
//
// Trigger strategy:
//   - Any changes to the branch will trigger a build and deploy for the single frontend app.
//
// Deploy target: Portainer stack (efcare-dev) via Portainer REST API.
// Notification: Telegram.
// ============================================================================

pipeline {
    agent {
        label 'aidx-demo'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        // ── Git ─────────────────────────────────────────────────────────
        BRANCH = 'develop'
        ENV    = 'dev'

        // ── Docker Registry (Docker Hub) ─────────────────────────────────
        PRIV_REGISTRY_URL    = 'https://index.docker.io/v1/'
        PRIV_REGISTRY_DOMAIN = 'docker.io'
        PRIV_REPO            = 'tannghidevops'
        PRIV_ENV             = 'dynamix'
        REGISTRY_CREDENTIALS_ID = 'dockerhub-tannghidevops-credentials'

        // ── Portainer ────────────────────────────────────────────────────
        PORTAINER_URL         = 'https://portainer-dev.aidx.vn'
        PORTAINER_ENV_ID      = "${env.PORTAINER_EFCARE_ENV_ID ?: env.PORTAINER_WMS_ENV_ID ?: '4'}"
        PORTAINER_STACK_NAME  = 'efcare-dev'
        PORTAINER_CREDENTIALS_ID = 'portainer-mqtt-credentials'

        // ── Telegram ─────────────────────────────────────────────────────
        // Có thể reuse lại env variables của dự án trước bằng fallback (?:)
        TELEGRAM_BOT_TOKEN = "${env.TELEGRAM_BOT_TOKEN_EFCARE_DEV ?: env.TELEGRAM_BOT_TOKEN_WMS_DEV ?: env.TELEGRAM_BOT_TOKEN_TICKET_API}"
        TELEGRAM_CHAT_ID   = "${env.TELEGRAM_CHAT_ID_EFCARE_DEV ?: env.TELEGRAM_CHAT_ID_WMS_DEV}"

        // ── Pipeline state ───────────────────────────────────────────────
        ERROR_FILE       = '.pipeline_error.txt'
        BUILD_START_TIME = "${System.currentTimeMillis()}"

        // ── Frontend Configuration ───────────────────────────────────────
        APP_NAME = 'efcare-web-public'
        SITE_URL = 'https://efcare.vn' // URL web public của bạn
    }

    stages {

        // ────────────────────────────────────────────────────────────────
        stage('Initialize & Clone') {
        // ────────────────────────────────────────────────────────────────
            steps {
                script {
                    sh "rm -f ${ERROR_FILE} || true"

                    // Clone main repo (sử dụng biến env.gitEfcareUrl hoặc fallback về URL mặc định)
                    checkout([$class: 'GitSCM',
                        branches: [[name: "*/${BRANCH}"]],
                        extensions: [[$class: 'SubmoduleOption', disableSubmodules: false, parentCredentials: true, recursiveSubmodules: true, trackingSubmodules: true]],
                        userRemoteConfigs: [[credentialsId: 'vtnghidevops-github-aidx-read-write-only', url: "${env.gitEfcareUrl ?: env.gitWmsUrl}"]]
                    ])

                    def gitInfo = pipelineUtils.getGitInfo()
                    env.COMMIT_HASH    = gitInfo.commitHashShort ?: sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.COMMIT_MESSAGE = gitInfo.commitMessage    ?: 'N/A'
                    env.COMMIT_AUTHOR  = gitInfo.commitAuthor     ?: 'N/A'
                    env.BUILD_DATE     = sh(script: "TZ='Asia/Ho_Chi_Minh' date +%Y%m%d-%H%M%S", returnStdout: true).trim()

                    // Image tags: <app>-<env>-<hash>-<date>
                    env.IMAGE_TAG = "${APP_NAME}-${ENV}-${env.COMMIT_HASH}-${env.BUILD_DATE}"

                    // Full image references
                    env.IMAGE_FULL = "${PRIV_REGISTRY_DOMAIN}/${PRIV_REPO}/${PRIV_ENV}:${env.IMAGE_TAG}"

                    echo "==> App   : ${env.IMAGE_FULL}"
                    echo "==> Commit: ${env.COMMIT_HASH} by ${env.COMMIT_AUTHOR}"
                }
            }
        }

        // ────────────────────────────────────────────────────────────────
        // BUILD & DEPLOY FRONTEND
        // ────────────────────────────────────────────────────────────────
        stage('Deploy Application') {
            stages {

                stage('Build & Push Image') {
                    steps {
                        script {
                            // Build Docker image 
                            // Có thể truyền biến môi trường SITE qua build-arg nếu cần (trong Dockerfile cần có ARG SITE)
                            sh """
                                docker build \\
                                    --build-arg SITE=${env.SITE_URL} \\
                                    -f Dockerfile \\
                                    -t ${env.IMAGE_FULL} \\
                                    .
                            """

                            withCredentials([usernamePassword(credentialsId: env.REGISTRY_CREDENTIALS_ID, usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
                                sh """
                                    echo "Logging into Docker registry..."
                                    echo "\${REG_PASS}" | docker login ${env.PRIV_REGISTRY_URL} -u "\${REG_USER}" --password-stdin
                                    echo "Pushing image..."
                                    docker push ${env.IMAGE_FULL}
                                """
                            }
                        }
                    }
                }

                stage('Deploy to Portainer') {
                    steps {
                        script {
                            deployToPortainer(
                                portainerUrl   : env.PORTAINER_URL,
                                stackName      : env.PORTAINER_STACK_NAME,
                                envId          : env.PORTAINER_ENV_ID,
                                credentialsId  : env.PORTAINER_CREDENTIALS_ID,
                                imagePattern   : "docker.io/${PRIV_REPO}/${PRIV_ENV}:${APP_NAME}-[^ ]*",
                                newImageTag    : env.IMAGE_FULL,
                                serviceLabel   : 'Web-Public',
                                errorFile      : env.ERROR_FILE
                            )
                            env.DEPLOYED = 'true'
                        }
                    }
                }
            }
        }

        // ────────────────────────────────────────────────────────────────
        stage('Notify Success') {
        // ────────────────────────────────────────────────────────────────
            steps {
                script {
                    def duration = pipelineUtils.formatDuration(
                        System.currentTimeMillis() - env.BUILD_START_TIME.toLong()
                    )

                    def appMsg = env.DEPLOYED == 'true' ? env.IMAGE_TAG : 'No change'

                    sendTelegramNotification.success([
                        botToken      : env.TELEGRAM_BOT_TOKEN,
                        chatId        : env.TELEGRAM_CHAT_ID,
                        projectName   : env.JOB_NAME,
                        buildNumber   : env.BUILD_NUMBER,
                        environment   : env.ENV,
                        imageFull     : "App: ${appMsg}",
                        imageTag      : "App: ${appMsg}",
                        previousVersion: 'N/A',
                        branch        : env.BRANCH,
                        commitHash    : env.COMMIT_HASH,
                        commitMessage : env.COMMIT_MESSAGE,
                        commitAuthor  : env.COMMIT_AUTHOR,
                        duration      : duration,
                        buildUrl      : env.BUILD_URL
                    ])
                }
            }
        }
    }

    post {
        failure {
            script {
                def duration = pipelineUtils.formatDuration(
                    System.currentTimeMillis() - env.BUILD_START_TIME.toLong()
                )

                def failedStage  = 'Unknown'
                def errorMessage = 'No details available'

                try {
                    if (fileExists(env.ERROR_FILE)) {
                        def parts = readFile(env.ERROR_FILE).trim().split('\\|')
                        if (parts.length >= 1) failedStage  = parts[0]
                        if (parts.length >= 2) errorMessage = parts[1]
                    }
                } catch (Exception e) {
                    echo "Could not read error file: ${e.getMessage()}"
                }

                sendTelegramNotification.failure([
                    botToken      : env.TELEGRAM_BOT_TOKEN,
                    chatId        : env.TELEGRAM_CHAT_ID,
                    projectName   : env.JOB_NAME,
                    buildNumber   : env.BUILD_NUMBER,
                    environment   : env.ENV,
                    imageFull     : 'N/A',
                    imageTag      : 'N/A',
                    previousVersion: 'N/A',
                    branch        : env.BRANCH,
                    commitHash    : env.COMMIT_HASH ?: 'N/A',
                    commitAuthor  : env.COMMIT_AUTHOR ?: 'N/A',
                    failedStage   : failedStage,
                    errorMessage  : errorMessage,
                    duration      : duration,
                    buildUrl      : env.BUILD_URL
                ])
            }
        }

        success {
            script {
                echo "Pipeline completed successfully"
            }
        }

        always {
            script {
                sh "rm -f ${ERROR_FILE} || true"
                sh 'docker logout ${PRIV_REGISTRY_URL} || true'
            }
        }
    }
}

// ============================================================================
// Helper: deployToPortainer
// ============================================================================
// Encapsulates the Portainer REST API flow (auth → fetch stack → patch image
// → push update) so each service stage stays DRY.
//
// Args:
//   portainerUrl  : Portainer base URL
//   stackName     : Portainer stack name
//   envId         : Portainer environment/endpoint ID
//   credentialsId : Jenkins credentials ID (username+password)
//   imagePattern  : sed regex to match the current image line
//   newImageTag   : full image:tag to replace with
//   serviceLabel  : human label for log messages
//   errorFile     : path to write error details if deploy fails
// ============================================================================
def deployToPortainer(Map args) {
    withCredentials([usernamePassword(
        credentialsId: args.credentialsId,
        usernameVariable: 'P_USER',
        passwordVariable: 'P_PASS'
    )]) {
        sh """
            set -e

            # Ensure jq is available
            if ! command -v jq > /dev/null 2>&1; then
                echo "==> Installing jq..."
                apk add --no-cache jq 2>/dev/null || { apt-get update -q -y 2>/dev/null && apt-get install -y -q jq 2>/dev/null; } || {
                    echo "==> Package manager failed, downloading jq binary..."
                    curl -sfL https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-linux64 -o ./jq || wget -qO ./jq https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-linux64
                    chmod +x ./jq
                    export PATH="\$PATH:\$(pwd)"
                }
                if ! command -v jq > /dev/null 2>&1; then
                    echo "ERROR: cannot install jq"; exit 1
                fi
            fi

            PORTAINER_URL="${args.portainerUrl}"
            STACK_NAME="${args.stackName}"
            ENV_ID="${args.envId}"
            IMAGE_TAG="${args.newImageTag}"
            SERVICE="${args.serviceLabel}"

            echo "==> [\${SERVICE}] Authenticating to Portainer..."
            TOKEN=\$(curl -sf -X POST "\${PORTAINER_URL}/api/auth" \\
                -H 'Content-Type: application/json' \\
                -d '{"username":"'\${P_USER}'","password":"'\${P_PASS}'"}' | jq -r '.jwt')

            echo "==> [\${SERVICE}] Fetching stacks..."
            STACKS_JSON=\$(curl -sf -H "Authorization: Bearer \${TOKEN}" "\${PORTAINER_URL}/api/stacks")
            STACK_ID=\$(echo "\${STACKS_JSON}" | jq -r --arg name "\${STACK_NAME}" --argjson eid "\${ENV_ID}" \\
                '.[] | select(.Name==\$name and .EndpointId==\$eid) | .Id')
            ENDPOINT_ID=\$(echo "\${STACKS_JSON}" | jq -r --arg name "\${STACK_NAME}" --argjson eid "\${ENV_ID}" \\
                '.[] | select(.Name==\$name and .EndpointId==\$eid) | .EndpointId')

            echo "==> [\${SERVICE}] Stack ID=\${STACK_ID} Endpoint=\${ENDPOINT_ID}"

            echo "==> [\${SERVICE}] Fetching compose file..."
            COMPOSE=\$(curl -sf -H "Authorization: Bearer \${TOKEN}" \\
                "\${PORTAINER_URL}/api/stacks/\${STACK_ID}/file" | jq -r '.StackFileContent')

            echo "==> [\${SERVICE}] Patching image tag..."
            NEW_COMPOSE=\$(echo "\${COMPOSE}" | sed "s|image: ${args.imagePattern}|image: \${IMAGE_TAG}|g")

            echo "==> [\${SERVICE}] Writing payload..."
            jq -n --arg content "\${NEW_COMPOSE}" '{stackFileContent: \$content, prune: true, pullImage: true}' \\
                > deploy_payload_${args.serviceLabel.toLowerCase()}.json

            echo "==> [\${SERVICE}] Deploying..."
            HTTP_STATUS=\$(curl -s -o deploy_res_${args.serviceLabel.toLowerCase()}.json -w "%{http_code}" \\
                -X PUT \\
                -H "Authorization: Bearer \${TOKEN}" \\
                -H "Content-Type: application/json" \\
                "\${PORTAINER_URL}/api/stacks/\${STACK_ID}?endpointId=\${ENDPOINT_ID}" \\
                -d @deploy_payload_${args.serviceLabel.toLowerCase()}.json)

            echo "HTTP Status: \${HTTP_STATUS}"
            if [ "\${HTTP_STATUS}" = "200" ]; then
                echo "==> [\${SERVICE}] Deploy SUCCESS!"
            else
                echo "==> [\${SERVICE}] Deploy FAILED! Response:"
                cat deploy_res_${args.serviceLabel.toLowerCase()}.json
                exit 1
            fi
        """
    }
}