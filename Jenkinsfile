// CI/CD pipeline: build & test -> quality gate -> container images -> Kubernetes rollout.
//
// Required Jenkins configuration (Manage Jenkins > System > Global properties):
//   REGISTRY_URL     container registry host, e.g. harbor.example.com
//   SONAR_HOST_URL   SonarQube server URL
//   PUBLIC_API_URL   public URL of the backend, baked into the frontend bundle
//   PUBLIC_APP_URL   public URL of the frontend (MSAL redirect URI)
//
// Required Jenkins credentials:
//   registry-credentials  (username/password)  container registry login
//   sonarqube-token       (secret text)        SonarQube analysis token
//   msal-client-id        (secret text)        Azure AD SPA client id
//   msal-authority        (secret text)        https://login.microsoftonline.com/<tenant-id>
//   azure-tenant-domain   (secret text)        <tenant>.onmicrosoft.com
pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins
  containers:
  - name: maven
    image: maven:3.9-eclipse-temurin-17
    command: ['sleep', 'infinity']
  - name: node
    image: node:20-alpine
    command: ['sleep', 'infinity']
  - name: docker
    image: docker:24-cli
    command: ['sleep', 'infinity']
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['sleep', 'infinity']
    securityContext:
      runAsUser: 0
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
"""
        }
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    environment {
        BACKEND_IMAGE  = "${env.REGISTRY_URL}/meetspace/backend"
        FRONTEND_IMAGE = "${env.REGISTRY_URL}/meetspace/frontend"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Backend: build & test') {
            steps {
                container('maven') {
                    dir('code/backend') {
                        // Tests use an in-memory H2 database and dummy Azure settings
                        sh 'mvn -B clean verify'
                    }
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'code/backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Frontend: lint & type-check') {
            steps {
                container('node') {
                    dir('code/frontend') {
                        sh '''
                            npm ci
                            npm run lint
                            npx tsc --noEmit
                        '''
                    }
                }
            }
        }

        stage('SonarQube analysis') {
            steps {
                container('maven') {
                    dir('code/backend') {
                        withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                            sh '''
                                mvn -B sonar:sonar \
                                  -Dsonar.projectKey=meetspace-backend \
                                  -Dsonar.projectName=meetspace-backend \
                                  -Dsonar.host.url=${SONAR_HOST_URL} \
                                  -Dsonar.token=${SONAR_TOKEN}
                            '''
                        }
                    }
                }
            }
        }

        stage('Build images') {
            steps {
                container('docker') {
                    withCredentials([
                        string(credentialsId: 'msal-client-id', variable: 'MSAL_CLIENT_ID'),
                        string(credentialsId: 'msal-authority', variable: 'MSAL_AUTHORITY'),
                        string(credentialsId: 'azure-tenant-domain', variable: 'TENANT_DOMAIN')
                    ]) {
                        sh '''
                            docker build -f infra/java/Dockerfile \
                              -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest \
                              code/backend

                            docker build -f infra/nodejs/Dockerfile \
                              --build-arg NEXT_PUBLIC_API_URL=${PUBLIC_API_URL} \
                              --build-arg NEXT_PUBLIC_MSAL_CLIENT_ID=${MSAL_CLIENT_ID} \
                              --build-arg NEXT_PUBLIC_MSAL_AUTHORITY=${MSAL_AUTHORITY} \
                              --build-arg NEXT_PUBLIC_MSAL_REDIRECT_URI=${PUBLIC_APP_URL} \
                              --build-arg NEXT_PUBLIC_TENANT_DOMAIN=${TENANT_DOMAIN} \
                              -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest \
                              code/frontend
                        '''
                    }
                }
            }
        }

        stage('Push images') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: 'registry-credentials',
                        usernameVariable: 'REGISTRY_USER',
                        passwordVariable: 'REGISTRY_PASS'
                    )]) {
                        sh '''
                            echo "${REGISTRY_PASS}" | docker login ${REGISTRY_URL} -u "${REGISTRY_USER}" --password-stdin
                            for image in ${BACKEND_IMAGE} ${FRONTEND_IMAGE}; do
                              docker push ${image}:${IMAGE_TAG}
                              docker push ${image}:latest
                            done
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when { branch 'main' }
            steps {
                container('kubectl') {
                    sh '''
                        kubectl set image deployment/meetspace-backend \
                          meetspace-backend=${BACKEND_IMAGE}:${IMAGE_TAG}
                        kubectl set image deployment/meetspace-frontend \
                          meetspace-frontend=${FRONTEND_IMAGE}:${IMAGE_TAG}
                        kubectl rollout status deployment/meetspace-backend --timeout=180s
                        kubectl rollout status deployment/meetspace-frontend --timeout=120s
                    '''
                }
            }
        }
    }

    post {
        success { echo "Deployed build ${IMAGE_TAG}" }
        failure { echo 'Pipeline failed' }
    }
}
