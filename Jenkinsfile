pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Code has been checked out from GitHub'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the website...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying website to Apache...'

                sh '''
                    sudo rm -rf /var/www/html/*
                    sudo cp -r "$WORKSPACE"/index.html "$WORKSPACE"/assets "$WORKSPACE"/css "$WORKSPACE"/js "$WORKSPACE"/abhijeet_resume.pdf /var/www/html/
                '''
            }
        }
    }
}
