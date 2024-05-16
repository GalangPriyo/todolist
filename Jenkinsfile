pipeline {
    agent any

    tools {
        nodejs 'CobaanHidup' // Pastikan nama ini sesuai dengan nama yang Anda tambahkan di Global Tool Configuration
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/GalangPriyo/todolist.git'
            }
        }

        stage('Install dependencies') {
            steps {
                script {
                    def nodeHome = tool name: 'CobaanHidup', type: 'NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test -- --watchAll=false'
                junit '**/coverage/junit/*.xml'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
