
#!/bin/bash

# Set variables
PROJECT_FOLDER="/home/coder/project/workspace/question_generation_service/solutions/27bc3dbe-5a7f-4b7d-bd8f-5bb5f8a75e4e/springapp"
DATABASE_NAME="27bc3dbe_5a7f_4b7d_bd8f_5bb5f8a75e4e"

# Create Spring Boot project using Spring CLI
spring init \
  --type=maven-project \
  --language=java \
  --boot-version=3.4.0 \
  --packaging=jar \
  --java-version=17 \
  --groupId=com.examly \
  --artifactId=springapp \
  --name="Help Desk Ticketing System" \
  --description="Help Desk Ticketing System with ticket management functionality" \
  --package-name=com.examly.springapp \
  --dependencies=web,data-jpa,validation,mysql \
  --build=maven \
  ${PROJECT_FOLDER}

# Wait for project generation to complete
sleep 5

# Create MySQL database
mysql -u root -pexamly -e "CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME};" 2>/dev/null || echo "Database creation failed, will use default"

# Configure application.properties
cat > "${PROJECT_FOLDER}/src/main/resources/application.properties" << EOL
spring.datasource.url=jdbc:mysql://localhost:3306/${DATABASE_NAME}?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=examly
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server configuration
server.port=8080
server.error.include-message=always
server.error.include-binding-errors=always

# Logging configuration
logging.level.org.springframework.web=INFO
logging.level.org.hibernate=ERROR
EOL

echo "Spring Boot project created successfully in ${PROJECT_FOLDER}"
